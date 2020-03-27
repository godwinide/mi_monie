const fs = require("fs");
const path = require("path")
const PDFDocument = require("pdfkit");

function createAccountPDF(account_info, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc, account_info);
  generateCustomerInformation(doc, account_info);
  generateFooter(doc);

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

function generateCustomerInformation(doc, account_info) {
  doc
    .fillColor("#444444")
    .fontSize(15)
    .text("Account Info Of " + account_info.name, 150, 160);

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
    .font("Helvetica-Bold")
    .text(new Date(account_info.account.dateJoined).toLocaleDateString(), 150, customerInformationTop + 60)
    .font("Helvetica")
    .text("Date Of Birth:", 50, customerInformationTop + 75)
    .font("Helvetica-Bold")
    .text(new Date(account_info.account.dob).toLocaleDateString(), 150, customerInformationTop + 75)
    .font("Helvetica")
    .text("User ID:", 50, customerInformationTop + 90)
    .font("Helvetica-Bold")
    .text(account_info.account.user_id, 150, customerInformationTop + 90)
    .font("Helvetica")
    .text("Status:", 50, customerInformationTop + 105)
    .font("Helvetica-Bold")
    .text(account_info.account.status, 150, customerInformationTop + 105)
    .font("Helvetica")
    .text("Address 1:", 50, customerInformationTop + 120)
    .font("Helvetica-Bold")
    .text(account_info.account.address1, 150, customerInformationTop + 120)
    .font("Helvetica")
    .text("Address 2:", 50, customerInformationTop + 135)
    .font("Helvetica-Bold")
    .text(account_info.account.address2, 150, customerInformationTop + 135)
    .font("Helvetica")
    .text("BVN:", 50, customerInformationTop + 150)
    .font("Helvetica-Bold")
    .text(account_info.account.bvn, 150, customerInformationTop + 150)
    .font("Helvetica")
    

    .moveDown();
}



function generateFooter(doc) {
  const top = 370
  doc
    .fontSize(10)
    .text("For enquiries contact us:", 50, top + 30)
    .text("Phone: 08078561982", 50, top + 50)
    .text("Email: enaland.com", 50, top + 70)
    .text("website: enaland.com", 50, top + 90)
}



module.exports = {
  createAccountPDF
};