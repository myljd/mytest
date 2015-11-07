var CouponOriginal = require('../models/v1/coupon_original');
var CouponDistribution = require('../models/v1/coupon_distribution');
var User = require('../models/v1/user');
var uuid = require('node-uuid');
var moment = require('moment');

var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};

CouponDistribution.belongsTo(CouponOriginal, {
    foreignKey: 'original_id'
});

exports.getUserCoupons = function(req, res) {

    CouponDistribution
        .findAll({
            where: {
                user_id: req.query.user_id
            },
            include: [CouponOriginal]
        })
        .then(function(coupons) {
            if (coupons.length == 0) {
                result.code = 404;
                result.action = 'getUserCoupons';
                result.success = false;
                result.message = '该用户还没有优惠券';
                res.json(result);
            } else {
                var coupons_arr = [];
                for (var i = 0; i < coupons.length; ++i) {

                    var coupon = {
                        'id': '',
                        'user_id': '',
                        'coupon_original_id': '',
                        'is_activated': '',
                        'pin_code': '',
                        'brand': '',
                        'thumbnail': '',
                        'title': '',
                        'desc': '',
                        'code': '',
                        'time_last': '',
                        'template_id': '',
                        'coupon_number': '',
                        'is_paid': ''
                    };
                    coupon.id = coupons[i].id;
                    coupon.coupon_number = coupons[i].coupon_number;
                    coupon.user_id = coupons[i].user_id;
                    coupon.is_activated = coupons[i].is_activated;
                    coupon.brand = coupons[i].brand;
                    coupon.thumbnail = coupons[i].thumbnail;
                    coupon.title = coupons[i].title;
                    coupon.desc = coupons[i].desc;
                    coupon.code = coupons[i].coupon_number;
                    coupon.time_last = coupons[i].time_last;
                    coupon.coupon_original_id = coupons[i].id;
                    coupon.template_id = coupons[i].template_id;
                    coupon.pin_code = coupons[i].pin_code;
                    coupon.is_paid = coupons[i].is_paid;
                    console.log(coupon);
                    coupons_arr.push(coupon);
                }

                result.code = 200;
                result.action = 'getUserCoupons';
                result.success = true;
                result.message = '获取兑换券列表成功';
                result.data = coupons_arr;
                res.json(result);
                coupons_arr.length = 0;
                result.data = null;
            }
        })

}

//激活pin码
exports.activateCoupon = function(req, res) {

    CouponDistribution
        .find({
            where: {
                // user_id:req.body.user_id,
                pin_code: req.body.pin_code
            }
        })
        .then(function(coupon) {
            if (coupon) {
                coupon.is_activated = true;
                coupon.user_id = req.body.user_id;
                coupon.save().then(function() {
                    result.code = 200;
                    result.action = 'activateCoupon';
                    result.success = true;
                    result.message = '激活兑换券成功';
                    res.json(result);
                })
            } else {
                result.code = 404;
                result.action = 'activateCoupon';
                result.success = false;
                result.message = '该pin码不存在，请重新输入';
                res.json(result);
            }
        })
}

//判断激活pin码 是否使用
exports.couponUse = function(req, res) {

    CouponDistribution
        .find({
            where: {
                pin_code: req.query.pin_code
            }
        })
        .then(function(coupon) {
            if (coupon) {
                console.log(coupon.user_id);
                if (coupon.user_id) {
                    getUser(coupon.user_id);
                }
                CouponDistribution
                    .find({
                        where: {
                            pin_code: req.query.pin_code,
                            is_activated: 0
                        }
                    })
                    .then(function(coupons) {

                        if (coupons) {
                            result.code = 200;
                            result.action = 'couponUse';
                            result.success = true;
                            result.message = '礼券码可使用';
                            result.data = coupons;
                            res.json(result);
                        } else {
                            console.log(phone)
                            result.code = 404;
                            result.action = 'couponUse';
                            result.success = false;
                            result.data = coupons;
                            result.message = '该pin码已被' + phone.substr(0, 3) + '******' + phone.substr(8, 10) + '使用';
                            res.json(result);
                        }
                    })
            } else {
                result.code = 404;
                result.action = 'couponUse';
                result.success = false;
                result.data = coupon;
                result.message = '该pin码不存在';
                res.json(result);
            }
        })
}

var phone;

function getUser(user_id) {
    User
        .find({
            where: {
                user_id: user_id
            }
        })
        .then(function(user) {
            // console.log(user.mobile)       
            phone = user.mobile;
            return user.mobile
        })
}

//查询出券的内容
exports.couponS = function(req, res) {

    CouponOriginal
        .find({
            where: {
                id: req.query.id
            }
        })
        .then(function(couponOriginal) {
            console.log(couponOriginal)
            if (couponOriginal) {
                console.log("可以")
                result.code = 200;
                result.action = 'coupon';
                result.success = true;
                result.message = '查询成功';
                result.data = couponOriginal;
                res.json(result);
            } else {
                console.log("不可以")
                result.code = 404;
                result.action = 'coupon';
                result.success = false;
                result.data = couponOriginal;
                result.message = '查询失败';
                res.json(result);
            }
        })
}

//根据code 查询
exports.codeS = function(req, res) {

    CouponOriginal
        .find({
            where: {
                code: req.query.code
            }
        })
        .then(function(couponOriginal) {
            console.log(couponOriginal)
            if (couponOriginal) {
                // console.log("可以")
                result.code = 200;
                result.action = 'coupon';
                result.success = true;
                result.message = '查询成功';
                result.data = couponOriginal;
                res.json(result);
            } else {
                // console.log("不可以")
                result.code = 404;
                result.action = 'coupon';
                result.success = false;
                result.data = couponOriginal;
                result.message = '查询失败';
                res.json(result);
            }
        })
}


//根据code 重置券的状态
exports.ResetStateCode = function(req, res) {

    CouponDistribution
        .update({
            is_activated: 0,
            user_id: ''
        }, {
            where: {
                pin_code: req.query.code
            }
        })
        .then(function(couponOriginal) {
            console.log(couponOriginal)
            if (couponOriginal) {
                // console.log("可以")
                result.code = 200;
                result.action = 'ResetStateCode';
                result.success = true;
                result.message = '重置状态成功';
                result.data = couponOriginal;
                res.json(result);
            } else {
                // console.log("不可以")
                result.code = 404;
                result.action = 'ResetStateCode';
                result.success = false;
                result.data = couponOriginal;
                result.message = '重置状态失败';
                res.json(result);
            }
        })
}


//根据pin_code 重置券支付的状态
exports.updateCouponPaid = function(req, res) {

    CouponDistribution
        .update({
            is_paid: 1 //已支付           
        }, {
            where: {
                pin_code: req.query.code
            }
        })
        .then(function(couponOriginal) {
            //console.log(couponOriginal)
            if (couponOriginal) {
                // console.log("可以")
                result.code = 200;
                result.action = 'updateCouponPaid';
                result.success = true;
                result.message = '重置支付状态成功';
                result.data = couponOriginal;
                res.json(result);
            } else {
                // console.log("不可以")
                result.code = 404;
                result.action = 'updateCouponPaid';
                result.success = false;
                result.data = couponOriginal;
                result.message = '重置支付状态失败';
                res.json(result);
            }
        })
}

exports.activateCouponByUserId = function(req, res) {

    CouponDistribution
        .find({
            where: {
                pin_code: req.body.pin_code
            }
        })
        .then(function(coupon) {

            coupon.is_activated = true;
            coupon.user_id = req.body.user_id;
            coupon.save().then(function() {
                result.code = 200;
                result.action = 'activateCoupon';
                result.success = true;
                result.message = '激活兑换券成功';
                res.json(result);
            })

        })
}

exports.loadAllCoupon = function(req, res) {
    CouponDistribution
        .findAll()
        .then(function(coupon) {
            console.log(coupon)
            if (coupon) {
                result.code = 200;
                result.action = 'loadAllCoupon';
                result.success = true;
                result.data = coupon;
                result.message = '查找礼券成功';
                res.json(result);

            } else {
                result.code = 404;
                result.action = 'loadAllCoupon';
                result.success = false;
                result.message = '查找礼券失败';
                res.json(result);
            }

        })
}