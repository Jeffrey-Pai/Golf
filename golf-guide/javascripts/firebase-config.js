/**
 * Firebase configuration for the Golf Guide authentication system.
 *
 * ⚠️  DO NOT commit real API keys here.  This file is tracked by Git.
 *     The committed copy always contains empty strings.
 *     Real values are injected at build time from GitHub Actions Secrets.
 *
 * HOW TO SET UP:
 *   See README.md → "🔐 會員認證設定（Firebase Authentication）" for the
 *   complete step-by-step guide, including:
 *     - Where to find your 6 config values in Firebase Console
 *       (⚙️ Project settings → General → Your apps → firebaseConfig)
 *     - How to add them as GitHub Repository Secrets
 *       (Settings → Secrets and variables → Actions → New repository secret)
 *
 * Secret names to create in GitHub:
 *   FIREBASE_API_KEY          ← apiKey
 *   FIREBASE_AUTH_DOMAIN      ← authDomain
 *   FIREBASE_PROJECT_ID       ← projectId
 *   FIREBASE_STORAGE_BUCKET   ← storageBucket
 *   FIREBASE_MESSAGING_SENDER_ID ← messagingSenderId
 *   FIREBASE_APP_ID           ← appId
 *
 * Leave all values empty to run the site in public mode (no auth required).
 */
window.GOLF_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
