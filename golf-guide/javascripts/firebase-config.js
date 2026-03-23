/**
 * Firebase configuration for the Golf Guide authentication system.
 *
 * HOW TO SET UP:
 * 1. Go to https://console.firebase.google.com/ and create a new project.
 * 2. In your project, go to Authentication → Sign-in method and enable:
 *    - Google (for Google sign-in)
 *    - Email/Password (for email registration & login)
 * 3. In Project Settings → General → Your apps, register a Web app.
 * 4. Copy the firebaseConfig object values into the fields below.
 * 5. In Authentication → Settings → Authorized domains, add:
 *    - jeffrey-pai.github.io  (or your custom domain)
 *    - localhost               (for local development)
 *
 * Leave apiKey empty to run the site in public mode (no auth required).
 */
window.GOLF_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
