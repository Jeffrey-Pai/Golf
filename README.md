# ⛳ Golf

> **[📖 線上閱讀指南](https://jeffrey-pai.github.io/Golf/)** — 支援手機與電腦網頁瀏覽

高爾夫完整學習指南，從初學者到職業選手的全方位高爾夫教學文件（繁體中文）。

詳細內容請見 [golf-guide/README.md](./golf-guide/README.md)。

---

## 🚀 免費部署說明（GitHub Pages）

本專案使用 **GitHub Pages + GitHub Actions** 免費部署，完全零費用，以下是啟用步驟：

### 啟用步驟（只需做一次）

1. 前往 GitHub 儲存庫頁面
2. 點選上方 **Settings**（設定）標籤
3. 左側選單找到 **Pages**（頁面）
4. 在 **Build and deployment** → **Source** 下拉選單中，選擇 **GitHub Actions**
5. 儲存後，下次推送到 `main` 分支時，網站會自動建置並發布

### 確認部署成功

- 完成上述設定後，每次推送到 `main` 都會觸發自動部署
- 可在 **Actions** 標籤查看建置狀態（綠色 ✅ 代表成功）
- 部署完成後，網站網址為：`https://jeffrey-pai.github.io/Golf/`

### 為什麼是免費的？

| 項目 | 說明 |
|------|------|
| **GitHub Pages** | 公開儲存庫完全免費，無流量限制 |
| **GitHub Actions** | 公開儲存庫每月提供無限免費執行分鐘數 |
| **MkDocs Material** | 開源免費套件，無需付費授權 |

> ✅ 結論：此部署方式對公開儲存庫完全免費，無需信用卡或付費帳號。

---

## 🔐 會員認證設定（Firebase Authentication）

本專案內建 **Firebase Authentication** 會員系統，支援：
- **Google 帳號** 一鍵登入
- **電子郵件 + 密碼** 註冊與登入（含信箱驗證）

未設定 Firebase 時，網站以公開模式運行（所有頁面可直接瀏覽）。完成以下步驟即可啟用會員保護功能。

### 啟用步驟

#### 1. 建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/) 並登入
2. 點選 **「新增專案」**，輸入專案名稱後完成建立
3. 在左側選單進入 **Authentication → 開始使用**
4. 切換至 **「Sign-in method」** 標籤，啟用以下提供者：
   - **Google**（一鍵啟用，選擇支援電子郵件）
   - **電子郵件/密碼**（啟用，可選擇是否允許無密碼連結登入）

#### 2. 取得 Firebase 設定

1. 進入 **專案設定（齒輪圖示）→ 一般**
2. 在「您的應用程式」區塊點選 **「\</> 網頁」** 以新增 Web 應用程式
3. 輸入應用程式暱稱後完成建立，複製 `firebaseConfig` 物件中的各項值

#### 3. 填入設定

開啟 `golf-guide/javascripts/firebase-config.js`，將複製的值填入：

```javascript
window.GOLF_FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};
```

#### 4. 設定已授權網域

在 Firebase Console 中前往 **Authentication → Settings → 已授權網域**，新增：
- `jeffrey-pai.github.io`（或您自訂的網域）
- `localhost`（本機開發用）

#### 5. 部署

將修改推送至 `main` 分支，GitHub Actions 會自動部署。此後：
- **首頁**與**登入頁**可公開瀏覽
- **其他所有頁面**需要登入才能存取
- 登入後右上角會顯示使用者頭像與登出按鈕

### 本機開發注意事項

本機使用 `mkdocs serve` 時，網站路徑為 `/Golf/`（與 `site_url` 設定相同）。
若遇到重新導向問題，可暫時在 `firebase-config.js` 將 `apiKey` 清空，讓網站以公開模式運行。