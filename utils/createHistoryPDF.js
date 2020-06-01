const fs = require("fs");
const path = require("path")
const PDFDocument = require("pdfkit");

const top = {
    top: 0
}

function historyPDF(account_info, path) {
  let doc = new PDFDocument({ size: "A4" });
  generateHeader(doc, account_info);
  generateAccountInfo(doc, account_info);
  generateHistoryTable(doc, account_info.account.history)

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, account_info) {
  if(account_info.account.passport == true){
      doc
      .image(path.join(__dirname, '../', `/public/passports/${account_info.account.account_number}.jpg`), 50, 130, { width: 50 })
      .fillColor("#444444")
      .fontSize(10)
      .text("Enaland NIG LTD", 110, 57)
      .text("200 okunwague street", 400, 57)
      .text("Benin city, Edo state", 400, 67)
      .moveDown();
    }else{
      doc
      .fillColor("#444444")
      .fontSize(10)
      .text("Enaland NIG LTD", 110, 57)
      .text("200 okunwague street", 400, 57)
      .text("Benin city, Edo state", 400, 67)
      .moveDown();
    }
  }

function generateAccountInfo(doc, account_info) {
  doc
    .fillColor("#444444")
    .fontSize(15)
    .text("History of " + account_info.name, 150, 160);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Account Name:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(account_info.name, 150, customerInformationTop)
    .font("Helvetica")
    .text("Account Number:", 50, customerInformationTop + 15)
    .font("Helvetica-Bold")
    .text(account_info.account.account_number, 150, customerInformationTop + 15)
    .font("Helvetica")
    .text("Phone Number:", 50, customerInformationTop + 30)
    .font("Helvetica-Bold")
    .text(account_info.account.phone_number, 150, customerInformationTop + 30)
    .font("Helvetica")
    .text("Gender:", 50, customerInformationTop + 45)
    .font("Helvetica-Bold")
    .text(account_info.account.gender, 150, customerInformationTop + 45)
    .font("Helvetica")
    .text("Email:", 50, customerInformationTop + 60)
    .text(account_info.account.email, 150, customerInformationTop + 60)
    .font("Helvetica")
    .moveDown();
}

// history table
function generateHistoryTable(doc, history) {
    let i;
    const historyTableTop = 330;
  
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      historyTableTop,
      "Date",
      "Amount Type",
      "Withdrawer",
      "Deposit",
      "Balance",
    );
    generateHr(doc, historyTableTop + 20);
    doc.font("Helvetica");

    if(history.length > 14){
      for (i = history.length - 14, j = 0; j < 14; i++, j++) {
        const item = history[i];
        const position = historyTableTop + (j + 1) * 30;
        generateTableRow(
          doc,
          position,
          new Date(item.date).toDateString(),
          item.transaction_type,
          item.debit,
          item.credit,
          item.balance
        );
        generateHr(doc, position + 20);
      }
    }else{
      for (i = 0; i < history.length; i++) {
        const item = history[i];
        const position = historyTableTop + (i + 1) * 30;
        generateTableRow(
          doc,
          position,
          new Date(item.date).toDateString(),
          item.transaction_type,
          item.debit,
          item.credit,
          item.balance
        );
        generateHr(doc, position + 20);
      }
    }

}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function generateTableRow(
    doc,
    y,
    type,
    amount,
    balance,
    date,
    time
  ) {
    doc
      .fontSize(10)
      .text(type, 50, top.top + y)
      .text(amount, 150, top.top + y)
      .text(balance, 280, top.top + y, { width: 90, align: "right" })
      .text(date, 370, top.top + y, { width: 90, align: "right" })
      .text(time, 0, top.top + y, { align: "right" });
  }
  


module.exports = {
  historyPDF
};