var Template = require('../models/v1/template');
var TemplateMonth = require('../models/v1/template_month');

var uuid = require('node-uuid');
var moment = require('moment');

var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};


/*
GET 
通过coupon_original_id 取到可以使用的模版
*/
exports.listAvailableTemplates = function(req, res) {
    Template
        .findAll({
            where: {
                coupon_original_id: req.query.coupon_original_id
            }
        })
        .then(function(templates) {
          // console.log(templates)
            if (templates.length == 0) {
                result.code = 404;
                result.action = 'listAvailableTemplates';
                result.success = false;
                result.message = '该券没有可用模版';
                res.json(result);
            } else {
                result.code = 200;
                result.action = 'listAvailableTemplates';
                result.success = true;
                result.message = '获取券对应模版成功';
                result.data = templates;
                res.json(result);
                result.data = null;
            }
        })
}


/*
GET 
通过coupon_flag 取到可以使用的模版
*/
exports.listAvailableTemplatesFlag = function(req, res) {
    Template
        .findAll({
            where: {
                id: req.query.template_id
            }
        })
        .then(function(templates) {
          // console.log(templates)
            if (templates.length == 0) {
                result.code = 404;
                result.action = 'listAvailableTemplatesFlag';
                result.success = false;
                result.message = '该券没有可用模版';
                res.json(result);
            } else {
                result.code = 200;
                result.action = 'listAvailableTemplatesFlag';
                result.success = true;
                result.message = '获取券对应模版成功';
                result.data = templates;
                res.json(result);
                result.data = null;
            }
        })
}

/*
GET 
id 取到可以使用的模版
*/
exports.listTemplates = function(req, res) {
    TemplateMonth
        .findAll({
            where: {
                template_id: req.query.template_id
            }
        })
        .then(function(templates) {
          // console.log(templates)
            if (templates.length == 0) {
                result.code = 404;
                result.action = 'listTemplates';
                result.success = false;
                result.message = '该券没有可用模版';
                // res.header("Access-Control-Allow-Origin", "*");
                // res.jsonp(result);
                res.json(result);
            } else {
                result.code = 200;
                result.action = 'listTemplates';
                result.success = true;
                result.message = '获取券对应模版成功';
                result.data = templates;
                // res.header("Access-Control-Allow-Origin", "*");
                // res.jsonp(result);
                res.json(result);
                result.data = null;
            }
        })
}