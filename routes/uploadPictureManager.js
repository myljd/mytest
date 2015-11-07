var http = require('http'),
    path = require('path'),
    formidable = require('formidable'),
    sys = require('sys'),
    qn = require('qn'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    im = require('imagemagick'),
    mv = require('mv');


//用户的
var client = qn.create({
    accessKey: 'lgNuU4zURArmOuiFJM9Wk3sX5Ez4srGNGia0mBY6',
    secretKey: 'b4TiOpVQC1q5rfLOnU6MeXvuSv8I8glaK5OAjpgs',
    bucket: 'cloudpriting',
    domain: 'http://7xn9bs.com1.z0.glb.clouddn.com',
    // timeout: 3600000, // default rpc timeout: one hour, optional
    // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
    //uploadURL: 'http://up.qiniu.com/',
});

exports.uploadRawPictureToQiniu = function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        //console.log(files);

        sys.inspect({
            fields: fields,
            files: files
        });

        var tmp_path = files.portrait.path;
        var filename = uuid.v4() + path.extname(files.portrait.name);

        var target_path = './public/images/' + filename;
        // console.log(tmp_path);
        //console.log('.....'+filename);
        // move the file from the temporary location to the intended location
        mv(tmp_path, target_path, function(err) {
            if (err) throw err;
            //console.log(err);

            var final_path = './public/images/' + filename;
            var qiniuUniqueFilePath = uuid.v4() + path.extname(files.portrait.name);

            client.uploadFile(final_path, {
                key: qiniuUniqueFilePath
            }, function(err, success) {
                console.log(success);
                var result;
                if (err) {
                    // console.log(err);
                    result = {
                        'code': 404,
                        'success': false,
                        'action': 'uploadPictureToQiniu',
                        'err': err
                    };
                } else {
                    result = {
                        'code': 200,
                        'success': true,
                        'action': 'uploadPictureToQiniu',
                        'url': success.url,
                        'fileName': filename
                    };
                }
                res.json(result);
            });
        });
    });
}


exports.uploadRawPictureToQiniu1 = function(req, res) {
    console.log(222);
    var form = new formidable.IncomingForm();
    //console.log(form);
    form.parse(req, function(err, fields, files) {

        sys.inspect({
            fields: fields,
            files: files
        });

        var tmp_path = files.portrait.path;
        var filename = uuid.v4() + path.extname(files.portrait.name);
        // console.log(tmp_path);
        // console.log(filename);

        var target_path = './public/images/' + filename;
        // console.log(tmp_path);
        // console.log(filename);
        // move the file from the temporary location to the intended location
        mv(tmp_path, target_path, function(err, success) {
            console.log(success)
            if (err) throw err;
            var result;
            if (err) {
                result = {
                    'code': 404,
                    'success': false,
                    'action': 'uploadPictureToQiniu',
                    'err': err
                };
            } else {
                result = {
                    'code': 200,
                    'success': true,
                    'action': 'uploadPictureToQiniu',
                    //'url':success.url,
                    'fileName': filename
                };
            }
            res.json(result);

        })
    })
}
var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};
//删除文件
exports.deleteFile = function(req, res) {
    fs.unlink('./public/images/' + req.body.fileName, function(err) {
        if (err) throw err;
        console.log('successfully deleted');
        result = {
            'code': 200,
            'success': true,
            'action': 'deleteFile',
            'message': "删除文件成功"
        };
        res.json(result);
    });
}



exports.uploadAppPictureToQiniu = function(req, res) {
    // console.log(req.body.imgData);
    var imgData = req.query.str;
    console.log(imgData);
    var ite = 0;
    var target_arr = new Array();
    recursiveUpdateDishInShortSupply(ite, imgData.length, imgData, target_arr, function(final_results) {

        var final_arr = new Array();
        for (var i = 0; i < imgData.length; ++i) {
            if (i == 0) {
                final_arr = final_arr + final_results[i];
            } else {
                final_arr = final_arr + '--' + final_results[i];
            }
        }
        console.log(final_arr);
        //var result;
        result.code = 200;
        result.action = 'uploadAppPictureToQiniu';
        result.success = true;
        result.data = final_arr;
        result.message = "";
        res.header("Access-Control-Allow-Origin", "*");
        res.jsonp(result);

    })
}

function recursiveUpdateDishInShortSupply(i, len, ori_arr, in_short_supply, fn) {
    if (i == len) {
        return fn(in_short_supply);
    } else {
        console.log(i);
        console.log(ori_arr[i].length);
        console.log(ori_arr[i]);
        if (ori_arr[i].length <= 78) {
            in_short_supply.push(ori_arr[i]);
            return recursiveUpdateDishInShortSupply(i + 1, len, ori_arr, in_short_supply, fn);
        } else {

            var base64Data = ori_arr[i].replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            // var target_path = './public/images/' + filename;
            var filename = './public/image/' + uuid.v4() + ".jpg";
            // console.log(filename);

            // var fileName = '/image/'+uuid.v4()+ ".png";

            fs.writeFile(filename, dataBuffer, function(err) {


                var qiniuUniqueFilePath = uuid.v4() + ".jpg"; //randomize unique path for the picture
                // console.log(qiniuUniqueFilePath);
                if (err) {
                    console.log(err);
                } else {

                    in_short_supply.push(filename);
                    return recursiveUpdateDishInShortSupply(i + 1, len, ori_arr, in_short_supply, fn);
                    // client.uploadFile(filename, {
                    //     key: qiniuUniqueFilePath
                    // }, function(err, success) {
                    //      in_short_supply.push(success.url);
                    //       console.log(success);
                    //       return recursiveUpdateDishInShortSupply(i+1,len,ori_arr,in_short_supply,fn);                  
                    // });
                }
            });
        }
    }
}

exports.uploadPictureDataToQiniu = function(req, res) {
    //接收前台POST过来的base64
    var imgData = req.body.imgData;
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var filename = './public/images/' + uuid.v4() + ".jpg";

    fs.writeFile(filename, dataBuffer, function(err) {
        var name = filename.split("images/")[1];
        if (err) {
            res.send(err);
        } else {
            result = {
                'code': 200,
                'success': true,
                'action': 'uploadPictureDataToQiniu',
                'url': name
            };
            res.json(result);
        }
    });
}

exports.uploadQiniuAndDel = function(req, res) {
    console.log('writefile start..', req.body.imgNum);
    //接收前台POST过来的base64
    var imgData = req.body.imgData;
    // console.log(imgData);
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var filename = './public/images/' + uuid.v4() + ".jpg";

    fs.writeFile(filename, dataBuffer, function(err) {
        console.log('writefile finished..uploadFile start...');
        var qiniuUniqueFilePath = filename.split("images/")[1];
        if (err) {
            res.send(err);
        } else {
            client.uploadFile(filename, {
                key: qiniuUniqueFilePath
            }, function(err, success) {
                console.log(success);
                console.log(filename);
                fs.unlinkSync(filename);

                var result;
                if (err) {
                    result = {
                        'code': 404,
                        'success': false,
                        'action': 'uploadQiniuAndDel',
                        'err': err
                    };
                    //res.header("Access-Control-Allow-Origin", "*");
                    res.json(result);
                } else {

                        result = {
                            'code': 200,
                            'success': true,
                            'action': 'uploadQiniuAndDel',
                            'url': success.url
                        };
                     //   res.header("Access-Control-Allow-Origin", "*");
                        res.json(result);
                            
                }

            });

        }

    });

}
