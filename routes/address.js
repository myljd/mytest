var Address = require('../models/v1/address');
var uuid = require('node-uuid');
var moment = require('moment');

var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};
// var  acc =  console.log();

exports.addDeliveryAdderss = function(req, res) {
    Address.update({
            is_default: 0
        }, {
            where: {
                user_id: req.body.user_id
            }
        })
        .then(function(address) {
            Address
                .create({
                    user_id: req.body.user_id,
                    sub: req.body.sub,
                    area: req.body.area,
                    detailed: req.body.detailed,
                    consignee: req.body.consignee,
                    tellphone: req.body.tellphone,
                    is_default: 1
                }).then(function(address) {
                    result.code = 200;
                    result.action = 'addDeliveryAdderss';
                    result.success = true;
                    result.message = "成功添加收货地址";
                    result.data = address;
                    res.json(result);
                    result.data = null;
                })

        })
}

//查找该用户所有收货地址
exports.findAlladdress = function(req, res) {
    Address
        .findAll({
            where: {
                user_id: req.body.user_id
            },
            order: 'id desc'
        })
        .then(function(address) {
            console.log(address)
            if (address) {
                result.code = 200;
                result.action = 'findAlladdress';
                result.success = true;
                result.message = "成功查找收货地址";
                result.data = address;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'findAlladdress';
                result.success = false;
                result.message = 'err';
                res.json(result);
            }
        })
}

//查询默认地址
exports.findAddress = function(req, res) {
    Address
        .find({
            where: {
                user_id: req.session.user.user_id,
                is_default: 1
            }
        })
        .then(function(address) {
            console.log(address)
            if (address) {
                result.code = 200;
                result.action = 'findAddress';
                result.success = true;
                result.message = "成功查找收货地址";
                result.data = address;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'findAddress';
                result.success = false;
                result.message = 'err';
                res.json(result);
            }
        })
}

//当前选址地址 
exports.findAddressId = function(req, res) {
    console.log(req.body.u_id)
    Address
        .find({
            where: {
                id: req.query.u_id
            }
        })
        .then(function(address) {
            console.log(address)
            if (address) {
                result.code = 200;
                result.action = 'findAddressId';
                result.success = true;
                result.message = "成功查找收货地址";
                result.data = address;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'findAddressId';
                result.success = false;
                result.message = 'err';
                res.json(result);
            }
        })
}

//根据ID删除当前地址
exports.delte_address = function(req, res) {
    Address
        .destroy({
            where: {
                id: req.body.u_id
            }
        })
        .then(function(user_address) {
            if (user_address) {
                result.code = 200;
                result.action = 'delte_address';
                result.success = true;
                result.message = "删除地址成功";
                result.data = user_address;
                console.log(user_address);
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'delte_address';
                result.success = false;
                result.message = "未查找到相关数据";
                result.data = user_address;
                console.log(user_address);
                res.json(result);
                result.data = null;
            }
        })
}

//更新收货地址
exports.updataAdderss = function(req, res) {
    Address.update({
            sub: req.body.sub,
            area: req.body.area,
            detailed: req.body.detailed,
            consignee: req.body.consignee,
            tellphone: req.body.tellphone
        }, {
            where: {
                user_id: req.body.user_id,
                id: req.body.u_id
            }
        })
        .then(function(address) {
            if (address) {
                result.code = 200;
                result.action = 'updataAdderss';
                result.success = true;
                result.message = '更新成功';
                result.data = address;
                res.json(result);
                console.log(address);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'updataAdderss';
                result.success = false;
                result.message = "更新失败";
                result.data = address;
                console.log(address);
                res.json(result);
                result.data = null;
            }
        })
}

//设置为默认地址
exports.updateiFdefaultFlg = function(req, res) {
    console.log("进来")
    Address
        .find({
            where: {
                user_id: req.body.user_id,
                id: req.body.u_id
            }
        })
        .then(function(address) {
            console.log("执行")
            var users_id = req.body.user_id;
            // var is_default = req.body.is_default;
            // console.log(users_id)
            // console.log(req.body.is_default)
            if (req.body.is_default == 0) {
                Address.update({
                        is_default: 0
                    }, {
                        where: {
                            user_id: users_id
                        }
                    })
                    .then(function(address1) {
                        console.log("对了")
                        address.is_default = 1;
                        address.save().then(function() {
                            result.code = 200;
                            result.action = 'updateiFdefaultFlg';
                            result.success = true;
                            result.message = "成功设置默认地址";
                            result.data = address;
                            res.json(result);
                            result.data = null;
                        })
                    })
            }
        })
}