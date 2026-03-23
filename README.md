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

> ⚠️ **安全提醒：** Firebase 的 API Key 等設定值不能直接寫入程式碼推上 GitHub！  
> 本專案使用 **GitHub Actions Secrets** 在自動部署時安全地注入這些值。  
> `golf-guide/javascripts/firebase-config.js` 中只保留空字串，永遠不要在此填入真實金鑰。

---

### 啟用步驟（共四步）

#### 步驟一：建立 Firebase 專案並啟用登入方式

1. 前往 [Firebase Console](https://console.firebase.google.com/) 並以 Google 帳號登入
2. 點選 **「新增專案（Add project）」** → 輸入專案名稱 → 完成建立
3. 在左側選單點選 **「Build」** → **「Authentication」**
4. 點選 **「開始使用（Get started）」**
5. 切換至 **「Sign-in method」** 標籤，分別啟用：
   - **「Google」**：點選啟用開關 → 選擇支援電子郵件 → 儲存
   - **「電子郵件/密碼（Email/Password）」**：點選啟用第一個開關 → 儲存

---

#### 步驟二：取得 Firebase 設定值（新版 Firebase Console）

> 以下步驟在 Firebase v10（2024 年新版 Console）仍完全適用。

> ❌ **常見錯誤：不要使用服務帳戶金鑰（Service Account JSON）！**  
> 如果您在 Firebase Console 中看到類似以下的 JSON，那是 **Admin SDK 服務帳戶金鑰**，  
> 用於伺服器端程式，**不適用於本專案**，請勿使用：
>
> ```json
> {
>   "type": "service_account",
>   "project_id": "your-project",
>   "private_key_id": "...",
>   "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...",
>   "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
>   ...
> }
> ```
>
> 本專案是靜態網頁（GitHub Pages），使用 **Firebase 用戶端 Web SDK**，  
> 需要的是下方說明的 **`firebaseConfig` 物件中的六個欄位**，而不是服務帳戶金鑰。

**正確的取得方式：**

1. 回到 Firebase 專案首頁，點選左上角 **齒輪圖示（⚙️）** → **「專案設定（Project settings）」**
2. 在 **「一般（General）」** 標籤頁，往下捲動至 **「您的應用程式（Your apps）」** 區塊  
   ⚠️ 注意：不是「服務帳戶（Service accounts）」標籤，而是 **「一般（General）」** 標籤
3. 若尚未新增 Web 應用程式，點選 **「\</> 網頁（Web）」** 圖示：
   - 輸入應用程式暱稱（例如 `golf-guide`）
   - 不需勾選 Firebase Hosting
   - 點選 **「註冊應用程式（Register app）」**
4. 畫面會顯示 `firebaseConfig` 物件，格式如下：

   ```javascript
   const firebaseConfig = {
     apiKey:            "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain:        "your-project.firebaseapp.com",
     projectId:         "your-project",
     storageBucket:     "your-project.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId:             "1:123456789012:web:abcdefabcdefabcdef"
   };
   ```

   > 📌 **這六個欄位的值就是您需要的 Secrets**，請全部複製備用。

---

#### 步驟三：將設定值加入 GitHub Repository Secrets

> 這樣做的目的是讓 GitHub Actions 在部署時自動注入設定，金鑰永遠不會出現在 Git 歷史中。

1. 前往您的 **GitHub 儲存庫頁面**（例如 `https://github.com/Jeffrey-Pai/Golf`）
2. 點選上方 **「Settings」** 標籤
3. 在左側選單展開 **「Secrets and variables」** → 點選 **「Actions」**
4. 點選右上角 **「New repository secret」** 按鈕
5. 依序新增以下六個 Secret（名稱必須完全一致，值貼上步驟二取得的對應欄位）：

   | Secret 名稱 | 對應 firebaseConfig 欄位 | 值的範例 |
   |---|---|---|
   | `FIREBASE_API_KEY` | `apiKey` | `AIzaSyXXXXXXXXXXXX` |
   | `FIREBASE_AUTH_DOMAIN` | `authDomain` | `your-project.firebaseapp.com` |
   | `FIREBASE_PROJECT_ID` | `projectId` | `your-project` |
   | `FIREBASE_STORAGE_BUCKET` | `storageBucket` | `your-project.firebasestorage.app` |
   | `FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` | `123456789012` |
   | `FIREBASE_APP_ID` | `appId` | `1:123456789012:web:abcdef` |

---

#### 步驟四：設定已授權網域

在 Firebase Console 中前往 **Authentication → Settings → 已授權網域（Authorized domains）**，新增：
- `jeffrey-pai.github.io`（或您自訂的網域）
- `localhost`（本機開發用）

---

### 部署與效果

完成以上設定後，推送任何更新到 `main` 分支，GitHub Actions 即會：
1. 讀取上述六個 Secrets
2. 自動將值注入 `firebase-config.js`（不存入 Git）
3. 建置並部署到 GitHub Pages

部署完成後：
- **首頁**與**登入頁**可公開瀏覽
- **其他所有頁面**需要登入才能存取
- 登入後右上角會顯示使用者頭像與登出按鈕

---

### 本機開發注意事項

本機使用 `mkdocs serve` 時，`firebase-config.js` 內的值均為空字串，網站會自動以**公開模式**運行（無需登入）。  
這是正常行為，本機開發時不需要也不應該在檔案中填入真實金鑰。