/**
 * route index.js
 * author: willian12345@126.com
 * github: https://github.com/willian12345/wechat-JS-SDK-demo
 * time: 2015-1-27
 */
var fs = require('fs');
var qn = require('qn');
var http = require("http");
var https = require("https");
var jsSHA = require('jssha');
var uuid = require('node-uuid');
var encoding = require('encoding');

var querystring = require('querystring');
var crypto = require('crypto');
// 2小时后过期，需要重新获取数据后计算签名
var expireTime = 7200 - 100;

var client = qn.create({
    accessKey: 'lgNuU4zURArmOuiFJM9Wk3sX5Ez4srGNGia0mBY6',
    secretKey: 'b4TiOpVQC1q5rfLOnU6MeXvuSv8I8glaK5OAjpgs',
    bucket: 'cloudpriting',
    domain: 'http://7xn9bs.com1.z0.glb.clouddn.com'
});

// var expireTime = 0;
/**
    公司运营的各个公众平台appid及secret
    对象结构如：
    [{
        appid: 'wxa0f06601f19433af'
        ,secret: '097fd14bac218d0fb016d02f525d0b1e'
    }]
*/
// 路径为'xxx/rsx/0'时表示榕树下
// 路径为'xxx/rsx/1'时表示榕树下其它产品的公众帐号
// 以此以0,1,2代表数组中的不同公众帐号
// 以rsx或其它路径文件夹代表不同公司产品
var getAppsInfo = require('../config/wx_info'); // 从外部加载app的配置信息
var appIds = getAppsInfo();
/**
    缓存在服务器的每个URL对应的数字签名对象
    {
        'http://game.4gshu.com/': {
            appid: 'wxa0f06601f194xxxx'
            ,secret: '097fd14bac218d0fb016d02f525dxxxx'
            ,timestamp: '1421135250'
            ,noncestr: 'ihj9ezfxf26jq0k'
        }
    }
*/
var cachedSignatures = {};


// 输出数字签名对象
function responseWithJson(res, data) {
    console.log("---------responseWithJson-------");
    console.log("data", data);
    // 允许跨域异步获取
    // res.set({
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "POST,GET",
    //     "Access-Control-Allow-Credentials": "true"
    // });
    res.json(data);
};

// 随机字符串产生函数
function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
};

// 时间戳产生函数
function createTimeStamp() {
    return parseInt(new Date().getTime() / 1000) + '';
};

function errorRender(res, info, data) {
    console.log('----errorRender-----');
    if (data) {
        console.log(data);
        console.log('---------');
    }
    // res.set({
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "POST,GET",
    //     "Access-Control-Allow-Credentials": "true"
    // });
    responseWithJson(res, {
        errmsg: 'error',
        message: info,
        data: data
    });
};

// 计算签名
function calcSignature(ticket, noncestr, ts, url) {
    var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + ts + '&url=' + url;
    console.log("str", str);
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    // shaObj = new jsSHA(str, 'TEXT');
    return shasum.digest('hex');
}

// 获取微信签名所需的ticket
function getTicket(url, index, res, accessData) {
    https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + accessData.access_token + '&type=jsapi', function(_res) {
        var str = '',
            resp;
        _res.on('data', function(data) {
            str += data;
        });
        _res.on('end', function() {
            console.log('return ticket:  ' + str);
            try {
                resp = JSON.parse(str);
            } catch (e) {
                return errorRender(res, '解析远程JSON数据错误', str);
            }

            var appid = appIds[index].appid;
            var ts = createTimeStamp();
            var nonceStr = createNonceStr();
            var ticket = resp.ticket;
            var signature = calcSignature(ticket, nonceStr, ts, url);
            console.log("signature", signature);
            cachedSignatures[url] = {
                nonceStr: nonceStr,
                appid: appid,
                timestamp: ts,
                access_token: accessData.access_token,
                signature: signature,
                url: url
            };

            responseWithJson(res, {
                nonceStr: nonceStr,
                timestamp: ts,
                appid: appid,
                signature: signature,
                access_token: accessData.access_token,
                url: url
            });
        });
    });
};


// 通过请求中带的index值来判断是公司运营的哪个公众平台
exports.getSignature = function(req, res) {
    var _url = req.body.url;
    var signatureObj = cachedSignatures[_url];

    if (!_url) {
        return errorRender(res, '缺少url参数');
    }

    // 如果缓存中已存在签名，则直接返回签名
    if (signatureObj && signatureObj.timestamp) {
        var t = createTimeStamp() - signatureObj.timestamp;
        console.log(signatureObj.url, _url);
        // 未过期，并且访问的是同一个地址
        // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
        if (t < expireTime && signatureObj.url == _url) {
            console.log('======== result from cache ========');
            return responseWithJson(res, {
                nonceStr: signatureObj.nonceStr,
                timestamp: signatureObj.timestamp,
                appid: signatureObj.appid,
                signature: signatureObj.signature,
                access_token: signatureObj.access_token,
                url: signatureObj.url
            });
        }
        // 此处可能需要清理缓存当中已过期的数据
    }


    // 获取微信签名所需的access_token
    https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appIds[0].appid + '&secret=' + appIds[0].secret, function(_res) {
        var str = '';
        _res.on('data', function(data) {
            str += data;
        });
        _res.on('end', function() {
            console.log('return access_token:  ' + str);
            try {
                var resp = JSON.parse(str);
            } catch (e) {
                return errorRender(res, '解析access_token返回的JSON数据错误', str);
            }

            getTicket(_url, 0, res, resp);
        });
    })

};

var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': '',
    'url': ''
};
// 通过请求中带的index值来判断是公司运营的哪个公众平台
exports.getImgData = function(req, res) {
    // 获取微信签名所需的access_token
    var access_token = req.body.access_token;
    var media_id = req.body.media_id;
    console.log('access_token', access_token);
    console.log('media_id', media_id);

    // var url = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + access_token + '&media_id='+ media_id;
    // response = yield request.get(url); // 通过co-request向微信服务器发出请求
    // var type = response.headers["content-type"];
    // console.log('type',type);
    // var prefix = "data:" + type + ";base64,";
    // var base64 = new Buffer(response.body, 'binary').toString('base64');
    // console.log('resp.body',response.body);

    // var dataImg = prefix + base64;
    // console.log('dataImg',dataImg);
    // res.json(dataImg);

    // 处理响应，组合base64图片


    http.get('http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + access_token + '&media_id=' + media_id, function(_res) {
        var str = '';
        console.log('STATUS: ' + _res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(_res.headers));
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
            var base64Data = resultData.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');

            var filename = './public/images/' + uuid.v4() + ".jpg";
            //写入文件并上传七牛，同时删除文件
            fs.writeFile(filename, dataBuffer, function(err) {
                console.log('WX  writefile finished..uploadFile start...');
                var qiniuUniqueFilePath = filename.split("images/")[1];
                if (err) {
                    var resultErr = {
                        'code': 404,
                        'success': false,
                        'action': 'getImgData',
                        'err': err
                    };
                    res.json(resultErr);
                } else {
                    client.uploadFile(filename, {
                        key: qiniuUniqueFilePath
                    }, function(err, success) {
                        console.log(success);
                        console.log(filename);
                        // console.log(resultData);
                        fs.unlinkSync(filename);
                        if (err) {
                            var resultErr = {
                                'code': 404,
                                'success': false,
                                'action': 'getImgData',
                                'err': err
                            };
                            res.json(resultErr);
                        } else {
                            result.code = 200;
                            result.action = 'getImgData';
                            result.success = true;
                            result.message = "获取图片数据";
                            result.data = resultData;
                            result.url = success.url;
                            res.json(result);
                            result.data = null;
                        }
                    });
                }
            });
        });
    })
};

exports.getImgDataTest = function(req, res) {
    // 获取微信签名所需的access_token

    var access_token = 'EcWR5bURdD2587xucwfGFqDXEM5cFekTs8LWNolcEE4R4rbO2WltNCNP8GC3n6ytvAk2S_EobvDOZ_qgPVozOg3SAEfNUe5TCw3D3JBCRnoSMDaAIAFZQ';
    var media_id = 'S0gORx2zueKR00rslq4zW7TTmjphpMXApCuplDcT2zAOcNxskwjViUao_Ix2__kI';

    http.get('http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + access_token + '&media_id=' + media_id, function(_res) {
        var str = '';
        console.log('STATUS: ' + _res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(_res.headers));
        _res.setEncoding('binary');

        _res.on('data', function(data) {
            str += data.toString();
        });
        _res.on('end', function() {
            //获取微信下载数据
            var type = _res.headers["content-type"];
            var prefix = "data:" + type + ";base64,";
            var base64 = new Buffer(str, 'binary').toString('base64');
            var resultData = prefix + base64;
            console.log('resultData: ' + resultData);
            var filename = './public/images/' + uuid.v4() + ".jpg";
            //写入文件并上传七牛，同时删除文件
            fs.writeFile(filename, base64, function(err) {
                console.log('WX  writefile finished..uploadFile start...');
                var qiniuUniqueFilePath = filename.split("images/")[1];
                if (err) {
                    result = {
                        'code': 404,
                        'success': false,
                        'action': 'getImgData',
                        'err': err
                    };
                    res.json(result);
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
                                'action': 'getImgData',
                                'err': err
                            };
                            res.json(result);
                        } else {
                            result.code = 200;
                            result.action = 'getImgData';
                            result.success = true;
                            result.message = "获取图片数据";
                            result.data = resultData;
                            result.url = success.url;
                            res.set({
                                "Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Methods": "POST,GET",
                                "Access-Control-Allow-Credentials": "true"
                            });

                            res.json(result);
                            result.data = null;

                        }

                    });

                }

            });
        });
    })
};