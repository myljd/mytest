var hash = require('../routes/pass').hash;
var User = require('../models/v1/user');
var uuid = require('node-uuid');
var AVOS = require('avoscloud-sdk').AV;
var moment = require('moment');

AVOS.initialize("T8FpwYJEjoRwdpTU8t0uNmWK", "56HbNPExX5527atSkj4Yjit2");

var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};

// exports.getUserSelf = function(req, res) {
//     console.log('in');
//     result.code = 200;
//     result.action = 'getUserSelf';
//     result.success = true;
//     result.message = '获取用户信息成功';
//     result.data = req.session.user;
//     res.json(result);
//     result.data = null;
// }

//查询用户详情
exports.getUser = function(req, res) {
        User
            .find({
                where: {
                    user_id: req.query.user_id
                }
            })
            .then(function(user) {
                // console.log("222",user);
                result.code = 200;
                result.action = 'getUser';
                result.success = true;
                result.message = "getUser";
                result.data = user;

                res.json(result);
                result.data = null;
            })
    }
    //获取某个用户的信息


exports.login = function(req, res) {
        console.log(req.body.mobile + ':' + req.body.password);
        authenticate(req, res, function(err, user) {
            if (user) {
                console.log('user is:' + user);
                req.session.regenerate(function() {
                    req.session.user = user;
                    result.code = 200;
                    result.action = 'login';
                    result.success = true;
                    result.message = '登录成功';
                    result.data = user;
                    res.json(result);
                    result.data = null;
                });
            } else {
                //console.log(123);
                result.code = 404;
                result.action = 'login';
                result.success = false;
                result.message = err.message;
                res.json(result);
            }
        });
    } //登录

function authenticate(req, res, fn) {
    console.log("进入登录密码")
    if (!module.parent) console.log('authenticating %s:%s', req.body.mobile, req.body.password);
    console.log(req.body.mobile)
    User.find({
        where: {
            mobile: req.body.mobile
        }
    }).then(function(user) {
        if (user) {
            console.log('user', user);
            hash(req.body.password, user.salt, function(err, hash) {
                if (err) {
                    console.log('err', err);
                    return fn(err);
                }
                if (hash.toString() == user.hash) {
                    console.log('hash matches...');
                    //console.log('hash is %s', hash.toString());
                    return fn(null, user);
                } else {
                    console.log(999);
                    fn(new Error('密码输入错误'));
                }
            })

        } else {
            console.log(222);
            fn(new Error('用户尚不存在'));
        }

    })
}
exports.isPhoneExist = function(req, res) {

        User.
        find({
            where: {
                mobile: req.body.mobile
            }
        }).
        then(function(user) {
            if (user) {
                result.code = 404;
                result.action = 'isPhoneExist';
                result.success = false;
                result.message = '手机号已被注册';
                res.json(result);
            } else {
                result.code = 200;
                result.action = 'isPhoneExist';
                result.success = true;
                result.message = '手机号可以使用';
                res.json(result);
            }
            // res.json(result);
        });

    } //判断手机号码

// exports.isLogin = function(req, res) {

//     console.log(req.session.user + "数据")
//     console.log("进来没有")

//     if (req.session.user) {
//         result.code = 200;
//         result.action = 'isLogin';
//         result.success = true;
//         result.message = 'user is active';
//         result.data = req.session.user;
//         res.json(result);
//         result.data = null;
//     } else {
//         result.code = 404;
//         result.action = 'isLogin';
//         result.success = false;
//         result.message = 'user is inactive';
//         res.json(result);
//     }
// }


exports.logout = function(req, res) {
    req.session.destroy(function() {
        result.code = 200;
        result.action = 'logout';
        result.success = true;
        result.message = 'user is logout';
        res.json(result);
        // res.redirect('/');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    });
}; //注销

// exports.isAutoLogin = function(req, res) {
//     console.log(req.body.mobile)

//     User.find({
//         where: {
//             mobile: req.body.mobile
//         }
//     }).then(function(user) {
//         console.log(user)
//         req.session.regenerate(function() {
//             req.session.user = user;

//             result.code = 200;
//             result.action = 'isAutoLogin';
//             result.success = true;
//             result.message = "自动登录成功";
//             result.data = user;
//             res.json(result);
//             result.data = null;
//         });
//     })
// }

/*
用户注册
POST
参数: 1)mobile_phone ;2)password; 3)validSmsCode 获得的验证码;
*/
exports.register = function(req, res) {
    console.log('register...in');
    //先验证短信验证码，再完成基本注册registerBasicInfo
    verifySmsCode(req, res, function(err, valid_result) {

        if (err) {
            result.code = 404;
            result.action = 'register';
            result.success = false;
            result.message = err;
            res.json(result);
        } else {
            console.log('verifySmsCode success, register next step....in');
            registerBasicInfo(req, res, function(err, user) {
                if (err) {
                    result.code = 404;
                    result.action = 'register';
                    result.success = false;
                    result.message = err;
                    res.json(result);
                } else {
                    console.log('register user basic info...user is:', user);
                    req.session.regenerate(function() {
                        console.log(55555);
                        req.session.user = user;
                        console.log(req.session.user.mobile);
                        result.code = 200;
                        result.action = 'register';
                        result.success = true;
                        result.message = "注册成功";
                        result.data = user;
                        console.log(result);
                        res.json(result);
                        result.data = null;
                    })
                }
            })
        }

    })
}


function registerBasicInfo(req, res, fn) {
    console.log('registerBasicInfo...in');

    hash(req.body.password, function(err, salt, hash) {

        if (err) {
            return fn(err, null);
        }
        // store the salt & hash in the "db"
        else {
            console.log('hash finished...Creating User....in');
            User
                .create({
                    user_id: GenerateUUIDV4(),
                    mobile: req.body.mobile,
                    salt: salt,
                    hash: hash.toString(),
                    reg_time: moment().format('YYYYMMDDHHmmss'),
                    name: req.body.name,
                    gender: req.body.gender
                }).then(function(user) {
                    console.log('user.hash is:' + user.hash);
                    return fn(null, user);
                })
        }
    });
}

exports.sendVerifyMsg = function(req, res) {
// console.log(req.body.mobile)
    AVOS.Cloud.requestSmsCode(req.body.mobile).then(function() {
        //发送成功

        console.log("短信验证码发送成功");
        result.code = 200;
        result.action = 'sendVerifyMsg';
        result.success = true;
        result.message = "短信验证码发送成功";
        res.json(result);
    }, function(err) {
        //发送失败
        console.log("短信验证码发送失败");
        result.code = 404;
        result.action = 'sendVerifyMsg';
        result.success = false;
        result.message = "短信验证码发送失败";
        res.json(result);
    });

}


function verifySmsCode(req, res, fn) {
    console.log(req.body.validSmsCode);

    var result = {
        'code': 200,
        'success': true,
        'message': 'blank'
    };

    AVOS.Cloud.verifySmsCode(req.body.validSmsCode)
        .then(function() {
            console.log("验证码正确");
            result.code = 200;
            result.success = true;
            result.message = '验证码正确';
            return fn(null, result);

        }, function(err) {
            //验证失败
            console.log("验证码错误");
            result.code = 404;
            result.success = false;
            result.message = '验证码错误';
            return fn("验证码错误", null);
        });

}
//修改用户登录密码
exports.update_password = function(req, res) {

    User
        .find({
            where: {
                user_id: req.body.user_id
            }
        })
        .then(function(user) {

            console.log("req.body.password is %s", req.body.password);
            console.log("salt is %s", user.salt);
            console.log("hash is %s", user.hash);

            hash(req.body.original_password, user.salt, function(err, hash_verify) {
                if (hash_verify.toString() == user.hash) {
                    hash(req.body.password, function(err, salt_new, hash_new) {
                        if (err) throw err;
                        // store the salt & hash in the "db"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                        new_user_salt = salt_new;
                        new_user_hash = hash_new.toString();
                        console.log("req.body.password is %s", req.body.password);
                        console.log("salt is %s", new_user_salt);
                        user.updateAttributes({
                            salt: new_user_salt,
                            hash: new_user_hash
                        }).then(function() {

                            req.session.regenerate(function() {
                                req.session.user = user;
                                result.code = 200;
                                result.action = 'updaterecord_byd02011';
                                result.success = true;
                                result.message = '更新成功';
                                result.data = user;
                                res.json(result);
                                result.data = null;
                            });

                        });

                    });

                } else {
                    result.code = 404;
                    result.action = 'update_password';
                    result.success = false;
                    result.message = "原密码输入不正确";
                    res.json(result);
                }
            })

        })
}
exports.update_name = function(req, res) {
    User.update({
            name: req.body.name
        }, {
            where: {
                user_id: req.body.user_id
            }
        })
        .then(function(user) {
            console.log("进来")
            if (user) {
                console.log("更新")
                result.code = 200;
                result.action = 'update_name';
                result.success = true;
                result.message = '更新成功';
                result.data = user;
                res.json(result);
                result.data = null;
            } else {
                console.log("没更新")
                result.code = 404;
                result.action = 'update_name';
                result.success = false;
                result.message = '更新失败';
                result.data = user;
                res.json(result);
            }
        })
}

function GenerateUUIDV4() {
    var arr = uuid.v4().toString().split('-');
    var str = "";
    for (var i = 0; i < arr.length; ++i) {
        str += arr[i];
    }
    return str;
}



/*
找回密码第一步
*/
exports.iForgot = function(req, res) {
    console.log(req.body.mobile_phone);
    // console.log(req.body.validSmsCode);
     User
        .find({
            where: {
                mobile: req.body.mobile_phone
            }
        })
        .then(function(user) {
            console.log(user);
            if (user) {
                verifySmsCode(req, res, function(err, valid_result) {
                    if (err) {
                        result.code = 404;
                        result.action = 'forgotstep1';
                        result.success = false;
                        result.message = err;
                        res.json(result);
                    } else {
                        result.code = 200;
                        result.action = 'forgotstep2';
                        result.success = true;
                        result.message = '成功';
                        result.data = user;
                        res.json(result);
                        result.data = null;
                    }
                })
            }
        })
}

exports.iForgot1 = function(req, res) {
     User
        .find({
            where: {
                mobile: req.body.mobile_phone
            }
        })
        .then(function(user) {
        console.log(req.body.mobile_phone);
        if (user) {
            hash(req.body.password, function(err, salt, hash) {

                if (err) throw err;
                // store the salt & hash in the "db"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                new_user_salt = salt;
                new_user_hash = hash.toString();

                user
                    .updateAttributes({
                        salt: new_user_salt,
                        hash: new_user_hash
                    })
                    .then(function() {
                        var result = {
                            'code': 200,
                            'success': true,
                            'message': '密码修改成功'
                        };
                        res.json(result);
                    });

            });
        } else {
            result.code = 404;
            result.action = '';
            result.success = false;
            result.message = '没有该用户';
            res.json(result);
        }
    })
}