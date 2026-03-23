/**
 * Golf Guide – Authentication module
 *
 * Handles:
 *  - Firebase initialisation (Google + Email/Password)
 *  - Route protection (non-public pages redirect to /login/)
 *  - Login / Register form on the /login/ page
 *  - User widget (avatar + logout) injected into the Material header
 *
 * Requires firebase-app-compat.js and firebase-auth-compat.js to be
 * loaded before this script (see mkdocs.yml extra_javascript).
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /*  Constants                                                           */
  /* ------------------------------------------------------------------ */

  var MIN_PASSWORD_LENGTH = 6;

  var cfg = window.GOLF_FIREBASE_CONFIG || {};
  var isConfigured = !!(cfg.apiKey && cfg.projectId);
  var siteBase = (window.GOLF_SITE_BASE || "").replace(/\/$/, "");

  // Queued message to display on the login form once it is rendered
  var pendingAuthMsg = null;
  // Set to true during the registration flow so onAuthStateChanged does not
  // show the "email not verified" error while the new account is being set up
  var justRegistered = false;

  // Pages that are accessible without authentication
  var PUBLIC_PATHS = [
    siteBase + "/",
    siteBase + "/index.html",
    siteBase + "/login/",
    siteBase + "/login/index.html",
    "/",
    "/index.html"
  ];

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                             */
  /* ------------------------------------------------------------------ */

  function isPublicPage() {
    var p = window.location.pathname;
    return (
      PUBLIC_PATHS.indexOf(p) !== -1 ||
      p.endsWith("/login/") ||
      p.endsWith("/login/index.html")
    );
  }

  function isLoginPage() {
    var p = window.location.pathname;
    return p.endsWith("/login/") || p.endsWith("/login/index.html");
  }

  function getRedirectTarget() {
    var params = new URLSearchParams(window.location.search);
    var r = params.get("redirect");
    // Only allow same-origin redirects
    if (r) {
      try {
        var url = new URL(r, window.location.origin);
        if (url.origin === window.location.origin) return url.href;
      } catch (e) {}
    }
    return siteBase + "/";
  }

  function revealContent() {
    document.documentElement.removeAttribute("data-auth-pending");
  }

  function redirectToLogin() {
    var target =
      siteBase +
      "/login/?redirect=" +
      encodeURIComponent(window.location.href);
    window.location.replace(target);
  }

  /**
   * Display a message on the login page's auth-message element.
   * If the element does not exist yet (form not rendered), stores the
   * message in pendingAuthMsg so renderLoginForm can apply it later.
   */
  function showAuthMsg(text, type) {
    var el = document.getElementById("golf-auth-msg");
    if (el) {
      el.className = "golf-auth-msg golf-auth-msg--" + type;
      el.textContent = text;
      el.hidden = false;
    } else {
      pendingAuthMsg = { text: text, type: type };
    }
  }

  /* ------------------------------------------------------------------ */
  /*  User widget in the Material header                                 */
  /* ------------------------------------------------------------------ */

  function injectUserWidget(user) {
    // Wait for the header to be present
    var header = document.querySelector(".md-header__inner");
    if (!header) return;

    var existing = document.getElementById("golf-auth-widget");
    if (existing) existing.remove();

    var widget = document.createElement("div");
    widget.id = "golf-auth-widget";
    widget.className = "golf-auth-widget";

    if (user) {
      var rawName = user.displayName || user.email;
      var initial = (rawName && rawName.length > 0 ? rawName[0] : "U").toUpperCase();
      var avatarHtml = user.photoURL
        ? '<img class="golf-auth-avatar" src="' +
          escapeHtml(user.photoURL) +
          '" alt="' +
          escapeHtml(user.displayName || "User") +
          '">'
        : '<span class="golf-auth-avatar golf-auth-avatar--text">' +
          escapeHtml(initial) +
          "</span>";

      widget.innerHTML =
        '<div class="golf-auth-user">' +
          avatarHtml +
          '<span class="golf-auth-name">' +
          escapeHtml(user.displayName || user.email || "會員") +
          "</span>" +
          '<button id="golf-logout-btn" class="golf-auth-logout-btn">登出</button>' +
        "</div>";

      widget.querySelector("#golf-logout-btn").addEventListener("click", function () {
        firebase.auth().signOut();
      });
    } else {
      var loginHref =
        siteBase +
        "/login/?redirect=" +
        encodeURIComponent(window.location.href);
      widget.innerHTML =
        '<a class="golf-auth-login-link" href="' +
        escapeHtml(loginHref) +
        '">登入</a>';
    }

    header.appendChild(widget);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ------------------------------------------------------------------ */
  /*  Login page form                                                     */
  /* ------------------------------------------------------------------ */

  function renderLoginForm(container) {
    var isRegister = false;

    function setMsg(text, type) {
      var el = document.getElementById("golf-auth-msg");
      if (!el) return;
      el.className = "golf-auth-msg golf-auth-msg--" + type;
      el.textContent = text;
      el.hidden = false;
    }

    function clearMsg() {
      var el = document.getElementById("golf-auth-msg");
      if (el) {
        el.hidden = true;
        el.textContent = "";
      }
    }

    function build() {
      container.innerHTML =
        '<div class="golf-login-card">' +
          '<div class="golf-login-header">' +
            '<span class="golf-login-logo" aria-hidden="true">⛳</span>' +
            '<h1 class="golf-login-title">高爾夫完整學習指南</h1>' +
            '<p class="golf-login-subtitle">' +
            (isRegister ? "建立您的會員帳號" : "登入以存取完整學習內容") +
            "</p>" +
          "</div>" +

          (isConfigured
            ? ""
            : '<p class="golf-auth-notice">' +
              "⚠️ Firebase 尚未設定。請參閱 README 完成設定後即可啟用會員登入功能。" +
              "</p>") +

          '<p id="golf-auth-msg" class="golf-auth-msg" hidden></p>' +

          (!isRegister && isConfigured
            ? '<button id="golf-google-btn" class="golf-btn golf-btn--google" type="button">' +
              '<svg class="golf-google-icon" viewBox="0 0 48 48" aria-hidden="true">' +
              '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>' +
              '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
              '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
              '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
              "</svg>" +
              "使用 Google 帳號登入" +
              "</button>" +
              '<div class="golf-divider" role="separator"><span>或</span></div>'
            : "") +

          '<form id="golf-auth-form" class="golf-auth-form" novalidate>' +
            (isRegister
              ? '<div class="golf-field">' +
                '<label for="golf-name">姓名（選填）</label>' +
                '<input id="golf-name" type="text" placeholder="您的姓名" autocomplete="name">' +
                "</div>"
              : "") +
            '<div class="golf-field">' +
              '<label for="golf-email">電子郵件</label>' +
              '<input id="golf-email" type="email" placeholder="your@email.com" required autocomplete="email">' +
            "</div>" +
            '<div class="golf-field">' +
              '<label for="golf-password">密碼</label>' +
              '<input id="golf-password" type="password" placeholder="' +
              (isRegister ? "至少 6 個字元" : "輸入密碼") +
              '" required autocomplete="' +
              (isRegister ? "new-password" : "current-password") +
              '">' +
            "</div>" +
            '<button class="golf-btn golf-btn--primary" type="submit">' +
            (isRegister ? "建立帳號" : "登入") +
            "</button>" +
          "</form>" +

          '<p class="golf-auth-toggle">' +
            (isRegister ? "已有帳號？" : "還沒有帳號？") +
            '<button class="golf-auth-toggle-btn" id="golf-toggle-mode" type="button">' +
            (isRegister ? "返回登入" : "立即註冊") +
            "</button>" +
          "</p>" +
        "</div>";

      // Google sign-in
      var googleBtn = document.getElementById("golf-google-btn");
      if (googleBtn) {
        googleBtn.addEventListener("click", function () {
          clearMsg();
          var provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider).catch(function (err) {
            setMsg(friendlyError(err), "error");
          });
        });
      }

      // Email form submit
      document.getElementById("golf-auth-form").addEventListener("submit", function (e) {
        e.preventDefault();
        clearMsg();
        var email = document.getElementById("golf-email").value.trim();
        var password = document.getElementById("golf-password").value;

        if (!isConfigured) {
          setMsg("Firebase 尚未設定，請參閱 README。", "error");
          return;
        }

        if (isRegister) {
          if (password.length < MIN_PASSWORD_LENGTH) {
            setMsg("密碼至少需要 6 個字元", "error");
            return;
          }
          var nameInput = document.getElementById("golf-name");
          var displayName = nameInput ? nameInput.value.trim() : "";

          justRegistered = true;
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(function (cred) {
              var updates = displayName
                ? cred.user.updateProfile({ displayName: displayName })
                : Promise.resolve();
              return updates
                .then(function () {
                  return cred.user.sendEmailVerification();
                })
                .then(function () {
                  // Sign out immediately so the user must verify before accessing
                  // protected content; onAuthStateChanged will not redirect them.
                  return firebase.auth().signOut();
                });
            })
            .then(function () {
              setMsg(
                "帳號建立成功！請至信箱點擊驗證連結，然後再登入。",
                "success"
              );
            })
            .catch(function (err) {
              setMsg(friendlyError(err), "error");
            })
            .finally(function () {
              justRegistered = false;
            });
        } else {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(function (err) {
              setMsg(friendlyError(err), "error");
            });
        }
      });

      // Toggle register / login mode
      document.getElementById("golf-toggle-mode").addEventListener("click", function () {
        isRegister = !isRegister;
        clearMsg();
        build();
      });

      // Apply any message queued before the form was rendered
      // (e.g., email-not-verified notice set by onAuthStateChanged)
      if (pendingAuthMsg) {
        showAuthMsg(pendingAuthMsg.text, pendingAuthMsg.type);
        pendingAuthMsg = null;
      }
    }

    build();
  }

  function friendlyError(err) {
    switch (err.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "電子郵件或密碼不正確";
      case "auth/email-already-in-use":
        return "此電子郵件已被使用";
      case "auth/invalid-email":
        return "請輸入有效的電子郵件地址";
      case "auth/weak-password":
        return "密碼強度不足，請使用更複雜的密碼";
      case "auth/popup-closed-by-user":
        return "登入視窗已關閉，請再試一次";
      case "auth/network-request-failed":
        return "網路連線失敗，請稍後再試";
      default:
        return err.message || "發生未知錯誤，請稍後再試";
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Bootstrap                                                           */
  /* ------------------------------------------------------------------ */

  function boot() {
    if (!isConfigured) {
      // No Firebase – site runs in public mode
      revealContent();
      if (isLoginPage()) {
        var c = document.getElementById("login-container");
        if (c) renderLoginForm(c);
      }
      return;
    }

    // Initialise Firebase (guard against duplicate init)
    if (!firebase.apps.length) {
      firebase.initializeApp(cfg);
    }

    // Render login form before auth state resolves
    if (isLoginPage()) {
      var c = document.getElementById("login-container");
      if (c) renderLoginForm(c);
    }

    // Auth state listener
    firebase.auth().onAuthStateChanged(function (user) {
      revealContent();

      // Enforce email verification for email/password accounts.
      // Google-signed-in users always have emailVerified === true.
      // Skip the error message during the registration flow (justRegistered)
      // because the registration handler shows its own success message.
      if (user && !user.emailVerified) {
        if (isLoginPage() && !justRegistered) {
          showAuthMsg(
            "您的電子郵件尚未驗證，請至信箱點擊驗證連結後再登入。",
            "error"
          );
        }
        firebase.auth().signOut();
        return;
      }

      injectUserWidget(user);

      if (user) {
        // Signed in and verified – if on login page, redirect to target
        if (isLoginPage()) {
          window.location.replace(getRedirectTarget());
        }
      } else {
        // Signed out – redirect protected pages to login
        if (!isPublicPage()) {
          redirectToLogin();
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
