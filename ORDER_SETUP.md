# AiBox Token Launch — Live Order Setup

The website is ready to submit real orders. GitHub Pages remains public/static; secrets stay in Google Apps Script.

## 1) Create the Google Sheet
1. Create a new Google Sheet named **AiBox Token Launch Orders**.
2. Copy the Sheet ID from its URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`.
3. You do not need to create columns manually; the script creates an `Orders` sheet and headers on first order.

## 2) Create a Telegram bot
1. In Telegram, open **@BotFather**.
2. Send `/newbot` and follow the prompts.
3. Copy the Bot Token. Do **not** put it in GitHub.
4. Send at least one message to your new bot from the Telegram account that should receive alerts.
5. To discover your Chat ID, open in a browser:
   `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   Find `message.chat.id`.
   If using a group, add the bot to the group, send a message, then check `getUpdates`; group IDs are often negative.

## 3) Create the Google Apps Script backend
1. Go to `script.google.com` and create a **New project** named `AiBox Token Launch Orders`.
2. Delete the starter code and paste the contents of `apps-script-backend.gs`.
3. Open **Project Settings > Script properties** and add:
   - `SHEET_ID` = your Google Sheet ID
   - `TELEGRAM_BOT_TOKEN` = token from BotFather
   - `TELEGRAM_CHAT_ID` = your chat/group ID
   - `NOTIFY_EMAIL` = email that should receive backup notifications (optional)
4. Click **Deploy > New deployment > Web app**.
5. Execute as: **Me**.
6. Who has access: **Anyone**.
7. Deploy and authorize the script.
8. Copy the Web App URL ending in `/exec`.

## 4) Connect the website
Open `config.js` and replace:

`PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

with your `/exec` Web App URL.

Upload/replace these files in `aiboxtoken/aiboxtoken.github.io`:
- `create-token.html`
- `app.js`
- `style.css`
- `config.js`

Do **not** upload Telegram Bot Token or any secret to GitHub.

## 5) Test
1. Visit `https://aiboxtoken.github.io/create-token.html`.
2. Submit a test order.
3. You should see an Order ID such as `ATL-20260910-AB12CD`.
4. Confirm that the same order appears in the Google Sheet and Telegram.

## Order statuses
Recommended workflow:
`NEW > REVIEW > PAYMENT PENDING > PAID > BUILDING > CLIENT REVIEW > LAUNCHED`

You can edit the Status cell manually in Google Sheets for v1.

## Security notes
- Never request seed phrases, private keys, wallet passwords, or recovery phrases.
- GitHub Pages code is public. Keep all bot tokens and credentials in Apps Script Properties.
- The included hidden honeypot field reduces basic bot spam. For higher traffic, add CAPTCHA/rate limiting in a later backend version.
- Client-generated Order IDs are identifiers, not payment receipts. Confirm payment separately before starting paid work.
