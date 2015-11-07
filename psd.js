var PSD = require('psd');
var psd = PSD.fromFile("01.psd");
psd.parse();

// console.log(psd.tree().export().children);

console.log('height:'+psd.tree().export().children[0].height);
console.log('width:'+psd.tree().export().children[0].width);
console.log('left:'+psd.tree().export().children[0].left);
console.log('top:'+psd.tree().export().children[0].top);   //top图层
//console.log(psd.tree().childrenAtPath('A/B/C')[0]);

// You can also use promises syntax for opening and parsing
// PSD.open("psd.psd").then(function (psd) {
//   return psd.image.saveAsPng('./psd.png');
// }).then(function () {
//   console.log("Finished!");
// });



console.log('page size:',psd.tree().export().document); //page size