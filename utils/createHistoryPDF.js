const PDFKit = require("pdfkit");
const path = require("path");


module.exports = (account, res) => {
    const fullName = `${account.firstname} ${account.lastname} ${account.middlename}`;
    const doc = new PDFKit({autoFirstPage:true});
    doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("Enaland Global Limited", 20, 30)
    .moveDown(2)
    .lineCap('butt')
    .moveTo(20, 50)
    .lineTo(600, 50)
    .stroke()
    .image(path.resolve(__dirname, "../public", "img", "logo.png"), 520, 10, {width: 60})
    .moveDown(-1)
    .fontSize(15)
    .moveDown(.5)
    .font("Times-Roman")
    .text(`Account History Of ${fullName}`, {align:"center"})
    .moveDown(1)
    .font("Helvetica")
    .fontSize(11)
    .text(`Account ID:           ${account.account_number}`, 80, 120)
    .moveDown(.5)
    .text(`First Name:           ${account.firstname}`)
    .moveDown(.5)
    .text(`Last Name:            ${account.lastname}`)
    .moveDown(.5)
    .text(`Middle Name:          ${account.middlename}`)
    .moveDown(2)
    .text("Date", 10, 225)
    .text("Type", 140, 225)
    .text("Withdrawer", 240, 225)
    .text("Deposit", 370, 225)
    .text("Balance", 500, 225)
    .underline(10, 245, doc.page.width-20, 3)
    .stroke()



    let pageAdded = false;
    let counter = 0;
    let height = 185;
    let pageLimit = 13

    function addRow(doc,h,height,i) {
            doc
            .text(new Date(h.date).toLocaleDateString(), 10, height + (40 * (i + 1)))
            .text(h.transaction_type, 140, height + (40 * (i + 1)))
            .text(h.debit,240, height + (40 * (i + 1)))
            .text(h.credit, 370, height + (40 * (i + 1)))
            .text(account.balance, 500, height + (40 * (i + 1)))
            .underline(10, height + 10 + (40 * (i + 1)), doc.page.width-20, 3)
            .stroke()        
    }



    account.history.forEach((h, i) => {
      counter+=1;
      if(counter % pageLimit === 0 && i !== 0){
           doc.addPage()
           pageAdded = true;
           height = 0;
           counter = 0;
           pageLimit = 17;
           addRow(doc,h, height, counter);
      }else{
          addRow(doc,h, height, counter);
      }
  })
    

    doc.pipe(res);
    doc.end();
}