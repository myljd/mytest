var Order = require('../models/v1/order');
var uuid = require('node-uuid');
var moment = require('moment');

var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};

exports.createAddress = function(req, res) {
    console.log(req.body.order_sn);
    console.log(req.body.pdf);

    Order
        .create({
            order_sn: req.body.order_sn,
            consignee: req.body.consignee,
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            is_paid: req.body.is_paid,
            sub: req.body.sub,
            area: req.body.area,
            detailed: req.body.detailed,
            tellphone: req.body.tellphone,
            express: req.body.express,
            price: req.body.price,
            postage: req.body.postage,
            remarks: req.body.remarks,
            time_new: req.body.time_new,
            pdf: req.body.pdf,
            order:0

        }).then(function(newOrder) {
            if (newOrder) {
                result.code = 200;
                result.action = 'createAddress';
                result.success = true;
                result.message = '新建订单成功';
                result.data = newOrder;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'createAddress';
                result.success = false;
                result.message = '新建订单失败';
                res.json(result);
            }
        })

}

//查询出所有的订单 
exports.findAllorder = function(req, res) {
        Order
            .findAll({
                where: {
                    user_id: req.query.user_id
                },
                time_new: 'sort DESC'
            })
            .then(function(order) {
                console.log(order)
                if (order.length !=0) {
                    result.code = 200;
                    result.action = 'findAllorder';
                    result.success = true;
                    result.message = "成功查找收货地址";
                    result.data = order;
                    res.json(result);
                    result.data = null;
                } else {
                    result.code = 404;
                    result.action = 'findAllorder';
                    result.success = false;
                    result.message = 'err';
                    res.json(result);
                }
            })
    }
    //查询该用户的该ID地址
exports.findorderId = function(req, res) {
    Order
        .find({
            where: {
                id: req.query.id
            }
        })
        .then(function(order) {
            console.log(order)
            if (order) {
                result.code = 200;
                result.action = 'findorderId';
                result.success = true;
                result.message = "成功查找收货地址";
                result.data = order;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'findorderId';
                result.success = false;
                result.message = 'err';
                res.json(result);
            }
        })
}


/*
POST
判断producet_id是否下单成功
*/

exports.listOrderIsPaid = function(req, res) {
    console.log(req.body.product_id);
    Order
        .find({
            where: {
                product_id: req.body.product_id,
            },
            pos: 'sort ASC'
        })
        .then(function(listorderispaid) {
            console.log(listorderispaid);
            if (listorderispaid) {
                result.code = 200;
                result.action = 'listOrderIsPaid';
                result.success = true;
                result.message = '获得下单列表成功';
                result.data = listorderispaid;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'listOrderIsPaid';
                result.success = false;
                result.message = '获得下单列表失败';
                res.json(result);
            }
        })
}