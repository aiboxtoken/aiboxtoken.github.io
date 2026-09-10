/**
 * AiBox Token Launch — Order Backend (Google Apps Script)
 *
 * Stores orders in a Google Sheet, sends a Telegram alert, and optionally emails the operator.
 * Secrets are stored in Apps Script Properties, NOT in GitHub.
 *
 * Script Properties to create:
 *   TELEGRAM_BOT_TOKEN  = 123456:ABC...
 *   TELEGRAM_CHAT_ID    = 123456789 (or -100... for a group/channel)
 *   NOTIFY_EMAIL        = your-email@example.com   (optional)
 *   SHEET_ID            = Google Sheet ID
 *   SHARED_SECRET       = any long random text      (optional; see note below)
 *
 * Deploy: Deploy > New deployment > Web app
 *   Execute as: Me
 *   Who has access: Anyone
 */

const HEADERS = [
  'Received At','Order ID','Status','Package','Token / Project','Symbol','Supply','Decimals',
  'Project Type','Goal','Country','Preferred Contact','Telegram / LINE','Email',
  'Project Website / Social','Expected Launch Date','Source Page','User Agent'
];

function doGet() {
  return json_({ok:true, service:'AiBox Token Launch Order API'});
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    const required = ['orderId','name','symbol','supply','package'];
    for (const k of required) {
      if (!String(p[k] || '').trim()) throw new Error('Missing field: ' + k);
    }

    // Honeypot: bots often fill hidden fields. Silently acknowledge but do not save.
    if (String(p.company || '').trim()) return json_({ok:true});

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const props = PropertiesService.getScriptProperties();
      const sheetId = props.getProperty('SHEET_ID');
      if (!sheetId) throw new Error('SHEET_ID is not configured in Script Properties.');
      const ss = SpreadsheetApp.openById(sheetId);
      const sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

      // Prevent accidental duplicate submission with the same Order ID.
      if (sheet.getLastRow() > 1) {
        const ids = sheet.getRange(2,2,sheet.getLastRow()-1,1).getDisplayValues().flat();
        if (ids.includes(String(p.orderId))) return json_({ok:true, duplicate:true, orderId:p.orderId});
      }

      const row = [
        new Date(), clean_(p.orderId), 'NEW', clean_(p.package), clean_(p.name), clean_(p.symbol),
        clean_(p.supply), clean_(p.decimals), clean_(p.type), clean_(p.description), clean_(p.country),
        clean_(p.preferredContact), clean_(p.contact), clean_(p.email), clean_(p.projectLinks),
        clean_(p.launchDate), clean_(p.source), clean_(p.userAgent)
      ];
      sheet.appendRow(row);

      const message = buildTelegram_(p);
      sendTelegram_(message, props);
      sendEmail_(p, message, props);
      return json_({ok:true, orderId:p.orderId});
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return json_({ok:false, error:String(err && err.message || err)});
  }
}

function clean_(v) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').slice(0,5000);
}

function html_(s) {
  return clean_(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function buildTelegram_(p) {
  return [
    '🚀 <b>NEW AIBOX TOKEN ORDER</b>',
    '',
    '<b>Order ID:</b> <code>'+html_(p.orderId)+'</code>',
    '<b>Package:</b> '+html_(p.package),
    '<b>Token:</b> '+html_(p.name),
    '<b>Symbol:</b> '+html_(p.symbol),
    '<b>Supply:</b> '+html_(p.supply),
    '<b>Decimals:</b> '+html_(p.decimals),
    '<b>Type:</b> '+html_(p.type),
    '<b>Goal:</b> '+html_(p.description || '-'),
    '<b>Country:</b> '+html_(p.country || '-'),
    '<b>Preferred:</b> '+html_(p.preferredContact || '-'),
    '<b>Telegram / LINE:</b> '+html_(p.contact || '-'),
    '<b>Email:</b> '+html_(p.email || '-'),
    '<b>Website / Social:</b> '+html_(p.projectLinks || '-'),
    '<b>Expected launch:</b> '+html_(p.launchDate || '-'),
    '',
    '<b>Status:</b> NEW ORDER'
  ].join('\n');
}

function sendTelegram_(message, props) {
  const token = props.getProperty('TELEGRAM_BOT_TOKEN');
  const chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chatId) return;
  const url = 'https://api.telegram.org/bot' + token + '/sendMessage';
  const res = UrlFetchApp.fetch(url, {
    method:'post', muteHttpExceptions:true,
    payload:{chat_id:chatId, text:message, parse_mode:'HTML', disable_web_page_preview:'true'}
  });
  if (res.getResponseCode() >= 300) console.error('Telegram error: '+res.getContentText());
}

function sendEmail_(p, message, props) {
  const to = props.getProperty('NOTIFY_EMAIL');
  if (!to) return;
  const subject = '[AiBox Token Launch] New Order ' + clean_(p.orderId) + ' — ' + clean_(p.name);
  const plain = message.replace(/<[^>]+>/g,'');
  MailApp.sendEmail({to:to, subject:subject, body:plain, name:'AiBox Token Launch Orders'});
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
