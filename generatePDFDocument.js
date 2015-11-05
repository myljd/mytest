
var PDF = require('pdfkit'); //including the pdfkit module
var fs = require('fs');
// var text = '/Applications/MAMP/htdocs/CloudPrinting-Backend/test.txt';

doc = new PDF({layout: 'portrait',size:[2500,1674]}); //creating a new PDF object





// doc.pipe(fs.createWriteStream('./public/pdf/test.pdf')); //creating a write stream 
doc.pipe(fs.createWriteStream('./public/pdf/test.pdf')); //creating a write stream
doc.registerFont('Palatino', './public/fonts/fangzhen.ttf')
doc.registerFont('maotion', './public/fonts/IDAutomationHC39M.ttf')
doc.font('Palatino')
    
    .image('./public/images/01.jpg', 10.5, 10,{width:2480,height:1654})
    .image('./public/images/01.png', 10, 10)



doc.addPage()
	.font('maotion')
    .fontSize(25)
    .text('is change!',1990,1356)



doc.end(); //we end the document writing.