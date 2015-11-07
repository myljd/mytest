var CalendarProduct = require('../models/v1/calendar_user_product');
var CalendarUserPost = require('../models/v1/calendar_user_post');
var Template = require('../models/v1/template');
var TemplateMonth = require('../models/v1/template_month');

var uuid = require('node-uuid');
var moment = require('moment');


var PDF = require('pdfkit'); //including the pdfkit module
var fs = require('fs');

// var PSD = require('psd');
// var psd = PSD.fromFile("01.psd");
// // var psd = PSD.fromFile("01.psd");
// psd.parse();




var result = {
    'code': '',
    'action': '',
    'success': '',
    'message': '',
    'data': ''
};

CalendarProduct.belongsTo(Template, {
    foreignKey: 'template_id'
});

/*
GET
获取已有作品列表
*/
exports.getUserCalendarProducts = function(req, res) {

    CalendarProduct
        .findAll({
            where: {
                user_id: req.query.user_id
            },
            include: [Template]
        })
        .then(function(calendarProducts) {
            // console.log(calendarProducts)
            if (calendarProducts.length == 0) {
                result.code = 404;
                result.action = 'getUserCalendarProducts';
                result.success = false;
                result.message = '该用户还没有作品';
                res.json(result);
            } else {
                result.code = 200;
                result.action = 'getUserCalendarProducts';
                result.success = true;
                result.message = '获取用户作品列表成功';
                result.data = calendarProducts;
                res.json(result);
                result.data = null;
            }
        })

}

/*
GET
获取已有的某一个作品中已经上传的图片和其位置并生成 pdf
product_id、template_id、code
*/
var template_id, top, left, image_width, image_height, page_width, page_height, code, name;
exports.getUserCalendarPosts = function(req, res) {
    // console.log(req.query.product_id)
    template_id = req.query.template_id;
    code = req.query.code;
    // code ='CMR7N4D8';
    // template_id = 3;
    getCalendar();
    CalendarUserPost
        .findAll({
            where: {
                product_id: req.query.product_id
            },
            pos: 'sort ASC'
        })
        .then(function(calendarUserPost) {
            //console.log(calendarUserPost);
            if (calendarUserPost.length == 0) {
                result.code = 404;
                result.action = 'getUserCalendarPosts';
                result.success = false;
                result.message = '该作品还没有上传的图片';
                res.json(result);
            } else {
                console.log('pdf....');
                GeneratePdfFile(calendarUserPost); //pdf生成                
                result.code = 200;
                result.action = 'getUserCalendarPosts';
                result.success = true;
                result.message = '获取已有的某一个作品中已经上传的图片和其位置，成功';
                result.data = calendarUserPost;
                result.name = name;
                res.json(result);
                result.data = null;
            }
        })
}

function getCalendar() {
    TemplateMonth
        .findAll({
            where: {
                template_id: template_id,
            },
            pos: 'sort ASC'
        })
        .then(function(calendarUserPost) {
            // console.log(calendarUserPost);
            tmp_arr_local_name = calendarUserPost;
            left = calendarUserPost[0].left;
            top = calendarUserPost[0].top;
            image_height = calendarUserPost[0].image_height;
            image_width = calendarUserPost[0].image_width;
            page_height = calendarUserPost[0].page_height;
            page_width = calendarUserPost[0].page_width;
            console.log('left:' + left);
            console.log('top:' + top);
            console.log('image_height:' + image_height);
            console.log('image_width:' + image_width);
            console.log('page_height:' + page_height);
            console.log('page_width:' + page_width);
        })
}



/*
GET
获取已有的某一个作品中已经上传的图片和其位置
*/

exports.getCalendar = function(req, res) {
    if (req.query.code == 1) {
        template_id = req.query.template_id;
        getCalendar();
        CalendarUserPost
            .findAll({
                where: {
                    product_id: req.query.product_id,
                },
                pos: 'sort ASC'
            })
            .then(function(calendarUserPost) {
                if (calendarUserPost) {
                    result.code = 200;
                    result.action = 'getCalendar';
                    result.success = true;
                    result.message = '获得作品成功';
                    result.data = calendarUserPost;
                    result.month = tmp_arr_local_name;
                    res.json(result);
                    result.data = null;
                } else {
                    result.code = 404;
                    result.action = 'getCalendar';
                    result.success = false;
                    result.message = '获得作品成功失败';
                    res.json(result);
                }
            })
    } else {
        CalendarUserPost
            .findAll({
                where: {
                    product_id: req.query.product_id,
                },
                pos: 'sort ASC'
            })
            .then(function(calendarUserPost) {
                if (calendarUserPost) {
                    result.code = 200;
                    result.action = 'getCalendar';
                    result.success = true;
                    result.message = '获得作品成功';
                    result.data = calendarUserPost;
                    res.json(result);
                    result.data = null;
                } else {
                    result.code = 404;
                    result.action = 'getCalendar';
                    result.success = false;
                    result.message = '获得作品成功失败';
                    res.json(result);
                }
            })
    }

}



/*
POST: 1) template_id; 2) coupon_distribution_id;
用户[新建]一个的作品
*/
exports.createUserCalendarProducts = function(req, res) {
    console.log('req.body.template_id:',req.body.template_id);
    CalendarProduct
        .create({
            user_id: req.body.user_id,
            template_id: req.body.template_id,
            coupon_distribution_id: req.body.coupon_distribution_id
        }).then(function(newCalendarProduct) {

            if (newCalendarProduct) {
                result.code = 200;
                result.action = 'createUserCalendarProducts';
                result.success = true;
                result.message = '新建用户作品成功';
                result.data = newCalendarProduct;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'createUserCalendarProducts';
                result.success = false;
                result.message = '新建用户作品失败';
                res.json(result);
            }
        })

}

/*
POST: 1) product_id ; 2) picture_url; 3) pos; (0~12)
上传图片的url到作品，并把位置（那一张）写入数据库
*/

exports.addPictureToProductWithPos = function(req, res) {

    CalendarUserPost
        .create({
            product_id: req.body.product_id,
            picture_url: req.body.picture_url,
            qiniu_url: req.body.qiniu_url,
            pos: req.body.pos,
            name: moment().format('YYYYMMDDHHmmss')
        }).then(function(newUrlPost) {

            if (newUrlPost) {
                result.code = 200;
                result.action = 'addPictureToProductWithPos';
                result.success = true;
                result.message = '上传图片及其位置到作品，成功';
                result.data = newUrlPost;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'addPictureToProductWithPos';
                result.success = false;
                result.message = '上传图片及其位置到作品，失败';
                res.json(result);
            }

        })

}

/*
返回删除刚创建的模板
*/
exports.delteCalendar = function(req, res) {
    console.log("进")
    CalendarProduct
        .destroy({
            where: {
                id: req.body.pordouct_id
            }
        })
        .then(function(deleteProduct) {
            console.log(deleteProduct)
            if (deleteProduct) {
                result.code = 200;
                result.action = 'delteCalendar';
                result.success = true;
                result.message = "删除新作品成功";
                result.data = deleteProduct;
                console.log(deleteProduct);
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'delteCalendar';
                result.success = false;
                result.message = "未查找到相关数据";
                result.data = deleteProduct;
                console.log(deleteProduct);
                res.json(result);
                result.data = null;
            }
        })
}

/*
查询用户作品ID 
*/
exports.postsCalendar = function(req, res) {

    CalendarProduct
        .findAll({
            where: {
                user_id: req.query.user_id
            },
        })
        .then(function(calendarProduct) {
            if (calendarProduct.length != 0) {
                result.code = 200;
                result.action = 'postsCalendar';
                result.success = true;
                result.message = '获得作品成功';
                result.data = calendarProduct;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'postsCalendar';
                result.success = false;
                result.message = '获得作品成功失败';
                res.json(result);
            }

        })
}

/*
GET
获取已有的某一个人作品的封面
*/

exports.getCalendarPosts = function(req, res) {

    CalendarUserPost
        .find({
            where: {
                product_id: req.query.product_id,
                pos: 0
            },
            pos: 'sort ASC'
        })
        .then(function(calendarUserPost) {
            if (calendarUserPost) {
                result.code = 200;
                result.action = 'getCalendarPosts';
                result.success = true;
                result.message = '获得作品成功';
                result.data = calendarUserPost;
                res.json(result);
                result.data = null;
            } else {
                result.code = 404;
                result.action = 'getCalendarPosts';
                result.success = false;
                result.message = '获得作品成功失败';
                res.json(result);
            }
        })
}


exports.listposid = function(req, res) {
    CalendarUserPost
        .findAll({
            where: {
                pos: req.body.pos,
                product_id: req.body.product_id
            },
            pos: 'sort ASC'
        })
        .then(function(calendarUserPost) {
            console.log(calendarUserPost);
            if (calendarUserPost.length == 0) {
                result.code = 404;
                result.action = 'listposid';
                result.success = false;
                result.message = '已有上传图片';
                res.json(result);
            } else {

                result.code = 200;
                result.action = 'listposid';
                result.success = true;
                result.message = '查找失败';
                result.data = calendarUserPost;
                //res.header("Access-Control-Allow-Origin", "*");
                res.json(result);
                result.data = null;
            }
        })
}

exports.updatePictureToProductWithPos = function(req, res) {

    CalendarUserPost
        .update({
            picture_url: req.body.picture_url,
            qiniu_url: req.body.qiniu_url
        }, {
            where: {
                product_id: req.body.product_id,
                pos: req.body.pos
            }
        })
        .success(function(updateqiniuurl) {

            result.code = 200;
            result.action = 'updatePictureToProductWithPos';
            result.success = true;
            result.data = updateqiniuurl;
            //console.log(result.data);
            result.message = "修改成功";
            res.json(result);
        })
}




var tmp_printure_url = new Array();
var tmp_arr_local_name = new Array();
var tmp_local_name = new Array();
var tmp_tmp_arr = new Array();
//pdf生成 
function GeneratePdfFile(tmp_arr) {
    // console.log(tmp_arr_local_name);
    for (var j = 0; j < tmp_arr.length; j++) {
        if (j == 0) {
            tmp_printure_url = tmp_arr[j].picture_url;
            tmp_local_name = tmp_arr_local_name[j].month_local_name;
        } else {
            tmp_printure_url = tmp_printure_url + ',' + tmp_arr[j].picture_url;
            tmp_local_name = tmp_local_name + ',' + tmp_arr_local_name[j].month_local_name;
        }
    }
    var tmp_tmp_picture_url = tmp_printure_url.split(',');
    var local_name = tmp_local_name.split(',');
    doc = new PDF({
        layout: 'landscape', //横向
        size: [page_height + 20, page_width + 20] //[高,宽]
    });
    console.log('name:.....' + moment().format('YYYYMMDDHHmmss'));
    name = moment().format('YYYYMMDDHHmmss');
    doc.pipe(fs.createWriteStream('/data/www/html/cloudprinting-backend/public/pdf/' + moment().format('YYYYMMDDHHmmss') + '.pdf')); //creating a write stream  
    doc.registerFont('maotion', '/data/www/html/cloudprinting-backend/public/fonts/IDAutomationHC39M.ttf')
    for (var i = 0; i < tmp_tmp_picture_url.length; i++) {
        if (i == 0) {
            doc.image('/data/www/html/cloudprinting-backend/public/images/' + tmp_tmp_picture_url[i], tmp_arr_local_name[i].left + 10, tmp_arr_local_name[i].top, {
                    width: image_width,
                    height: image_height
                })
                .image('/data/www/html/cloudprinting-backend/public/images/' + local_name[i], 10, 10)
                .font('maotion')
                .fontSize(42)
                .text(code, 2000, 1376)
        } else {
            doc.addPage()
                .image('/data/www/html/cloudprinting-backend/public/images/' + tmp_tmp_picture_url[i], tmp_arr_local_name[i].left + 10, tmp_arr_local_name[i].top, {
                    width: image_width,
                    height: image_height
                })
                .image('/data/www/html/cloudprinting-backend/public/images/' + local_name[i], 10, 10)
        }
    }
    doc.end(); //we end the document writing.
}