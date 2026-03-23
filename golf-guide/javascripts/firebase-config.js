/**
 * Firebase configuration for the Golf Guide authentication system.
 *
 * ⚠️  DO NOT commit real API keys here.  This file is tracked by Git.
 *
 * HOW TO SET UP (GitHub Pages deployment via GitHub Actions):
 * 1. Go to https://console.firebase.google.com/ and create a new project.
 * 2. In your project, go to Authentication → Sign-in method and enable:
 *    - Google (for Google sign-in)
 *    - Email/Password (for email registration & login)
 * 3. In Project Settings → General → Your apps, register a Web app and
 *    copy the firebaseConfig values shown there.
 * 4. In your GitHub repository, go to Settings → Secrets and variables →
 *    Actions and add the following Repository Secrets:
 *      - FIREBASE_API_KEY
 *      - FIREBASE_AUTH_DOMAIN
 *      - FIREBASE_PROJECT_ID
 *      - FIREBASE_STORAGE_BUCKET
 *      - FIREBASE_MESSAGING_SENDER_ID
 *      - FIREBASE_APP_ID
 * 5. In Firebase → Authentication → Settings → Authorized domains, add:
 *    - jeffrey-pai.github.io  (or your custom domain)
 *    - localhost               (for local development)
 *
 * The GitHub Actions workflow (.github/workflows/deploy.yml) automatically
 * injects these secrets into this file at build time.  The committed copy
 * always contains empty strings so no credentials are stored in Git.
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
