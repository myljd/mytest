var fs = require('fs');
var qn = require('qn');
var http = require("http");
var request = require('request'),
    uuid = require('node-uuid');
var moment = require('moment');
//用户的
var client = qn.create({
    accessKey: 'lgNuU4zURArmOuiFJM9Wk3sX5Ez4srGNGia0mBY6',
    secretKey: 'b4TiOpVQC1q5rfLOnU6MeXvuSv8I8glaK5OAjpgs',
    bucket: 'cloudpriting',
    domain: 'http://7xn9bs.com1.z0.glb.clouddn.com'
});
var CalendarUserPost = require('../models/v1/calendar_user_post');

var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};

var tmp_data, topArr, leftArr, widthArr, heightArr, product_id;
exports.PostDataFileName = function(req, res) {

    topArr = req.body.topArr;
    leftArr = req.body.leftArr;
    // console.log(req.body.scaleArr);
    // scaleArr = req.body.scaleArr;   
    widthArr = req.body.widthArr;
    heightArr = req.body.heightArr;
    product_id = req.body.pordouctId;
    tmp_data = req.body.urlArr;

    PostImageMogrFileName(function(err, valid_result) {
        result.code = 200;
        result.action = 'PostDataFileName';
        result.success = true;
        result.message = "作品生成成功";
        console.log(result);
        res.json(result);
        result.data = null;
    });
}


// var tmp_data = ['11.jpg', '05.jpg', '06.jpg', '04.jpg', '01.jpg', '02.jpg',
//     '03.jpg', '08.jpg', '07.jpg', '12.jpg', '09.jpg', '10.jpg', '12.jpg'
// ];
// var topArr = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
// var leftArr = ['0', ' 0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
// // var scaleArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
// var widthArr = ['280', '2480', '2480', '2480', '2480', '2480', '2480', '2480', '2480', '2480', '2480', '2480', '2480'];
// var heightArr = ['154', '1654', '1654', '1654', '1654', '1654', '1654', '1654', '1654', '1654', '1654', '1654', '1654'];
// // var tmp_data = ['01.jpg', '11.jpg', '05.jpg'];


// tmp();

// function tmp() {
//     PostImageMogrFileName();
// }


// function PostImageMogrFileName() {
//     for (var i = 0; i < tmp_data.length; ++i) {
//         image.imageMogr({
//             // thumbnail: '300x500',
//             gravity: 'NorthWest',
//             crop: '!300x400a10a10',
//             quality: 85,
//             // rotate: 90,
//             format: 'jpg'
//         }, function(err, imageData) {
//             if (err) {
//                 return console.error(err);
//             }

//             // 使用 imageData 进行操作
//         },client);
//     }
// }


function PostImageMogrFileName(fn) {
    var ite = 0;
    var target_arr = new Array();
    imageMogr(ite, tmp_data.length, tmp_data, target_arr, client, function(final_results) {

        for (var i = 0; i < final_results.length; ++i) {
            CalendarUserPost
                .create({
                    product_id: product_id,
                    picture_url: final_results[i],
                    qiniu_url: final_results[i],
                    pos: i,
                    name: moment().format('YYYYMMDDHHmmss')
                }).then(function(newUrlPost) {
                    if (newUrlPost) {
                        console.log('success');

                    } else {
                        console.log('err...');
                    }
                })
        }

        return fn(null, 'success');

    })
}

function imageMogr(i, len, ori_arr, in_short_supply, client, fn) {

    if (i == len) {
        return fn(in_short_supply);
    } else {
        var url = tmp_data[i] + '?imageMogr/v2/auto-orient/gravity/NorthWest/crop/!' +
            widthArr[i] + 'x' + heightArr[i] + 'a' +  leftArr[i] + 'a' + topArr[i]+ '/quality/85/format/jpg';
        console.log(url);

        http.get(url, function(_res) {
            var str = '';
            _res.setEncoding('binary');
            _res.on('data', function(data) {
                str += data.toString();
            });

            _res.on('end', function() {
                var type = _res.headers["content-type"];
                var prefix = "data:" + type + ";base64,";
                var base64 = new Buffer(str, 'binary').toString('base64');
                var resultData = prefix + base64;
                var imgData = resultData;
                var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                var filename = './public/images/' + uuid.v4() + ".jpg";
                var qiniuUniqueFilePath = filename.split('./public/images/')[1];

                fs.writeFile(filename, dataBuffer, function(err) {

                    if (err) {
                        console.log('err:' + err);
                    } else {
                        console.log(qiniuUniqueFilePath);
                        in_short_supply.push(qiniuUniqueFilePath);
                        return imageMogr(i + 1, len, ori_arr, in_short_supply, client, fn);

                        //addPictureToProductWithPos(qiniuUniqueFilePath);                   
                        // client.uploadFile(filename, {
                        //     key: qiniuUniqueFilePath
                        // }, function(e, success) {
                        //     if (e) {
                        //         console.log('e....'+e);
                        //     } else {
                        //         // console.log(success);
                        //         console.log(success.url);
                        //     }
                        // })
                    }
                })
            })
        })
    }
}