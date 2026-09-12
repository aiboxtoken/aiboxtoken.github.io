const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const sheet = getLeadSheet_();
    const data = e.parameter || {};
    const submittedAt = data.submittedAt || new Date().toISOString();

    sheet.appendRow([
      submittedAt,
      data.name || "",
      data.company || "",
      data.service || "",
      data.budget || "",
      data.message || "",
      data.page || "",
      "New",
    ]);

    sendTelegramAlert_(data, submittedAt);
    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error) });
  }
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Name",
      "Company / Brand",
      "Service",
      "Budget",
      "Project Details",
      "Source Page",
      "Status",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendTelegramAlert_(data, submittedAt) {
  const properties = PropertiesService.getScriptProperties();
  const token = properties.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = properties.getProperty("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;

  const message = [
    "🔔 New AiBox website lead",
    "",
    "Name: " + (data.name || "-"),
    "Company / Brand: " + (data.company || "-"),
    "Service: " + (data.service || "-"),
    "Budget: " + (data.budget || "-"),
    "Project Details: " + (data.message || "-"),
    "Submitted: " + submittedAt,
  ].join("\n");

  UrlFetchApp.fetch(
    "https://api.telegram.org/bot" + token + "/sendMessage",
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
      muteHttpExceptions: true,
    },
  );
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
