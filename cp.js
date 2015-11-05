var express = require('express');
var app = require('express')();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connection = require('express-myconnection');
var wx = require('./routes/wx');
// var routes = require('./routes/index');
var users = require('./routes/users');
var coupon = require('./routes/coupon');
var calendar = require('./routes/calendar');
var template = require('./routes/template');
var address = require('./routes/address');
var orders = require('./routes/orders');
var qn = require('./routes/qiniu');
var uploadPictureManager = require('./routes/uploadPictureManager');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, uploadDir: __dirname + '/public/images' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true,
//     uploadDir: __dirname + '/public/images'
// }));
app.use(cookieParser());
app.use(session({
    secret: 'cloudprinting2015'
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);

app.post('/uploadRawPictureToQiniu', uploadPictureManager.uploadRawPictureToQiniu); //七牛
app.get('/uploadAppPictureToQiniu', uploadPictureManager.uploadAppPictureToQiniu); //七牛
app.post('/wx/getSignature', wx.getSignature); //七牛
app.post('/PostDataFileName', qn.PostDataFileName); //七牛裁剪


app.post('/wx/getImgData', wx.getImgData); //下载图片
app.post('/wx/getImgDataTest', wx.getImgDataTest); //下载图片
// app.post('/isAutoLogin', users.isAutoLogin); //消费者登陆
app.post('/update_password', users.update_password); //修改密码
app.post('/update_name', users.update_name); //修改姓名
// app.get('/isLogin', users.isLogin);
app.post('/login', users.login); //登录

// app.get('/getUserSelf', users.getUserSelf);
app.get('/getUser', users.getUser); //查询用户星信息

app.post('/sendVerifyMsg', users.sendVerifyMsg);
app.post('/register', users.register);
app.post('/isPhoneExist', users.isPhoneExist);
app.post('/users/iForgot',users.iForgot);
app.post('/users/iForgot1',users.iForgot1);
app.post('/addDeliveryAdderss', address.addDeliveryAdderss); //添加收货地址

app.post('/findAlladdress', address.findAlladdress); //查找该用户所有收货地址
app.post('/findAddress', address.findAddress); //查询出默认地址
app.get('/findAddressId', address.findAddressId); //根据ID 查询地址
app.post('/delte_address', address.delte_address); //根据ID 删除地址
app.post('/updataAdderss', address.updataAdderss); //修改收货地址
app.post('/updateiFdefaultFlg', address.updateiFdefaultFlg); //设置默认地址


app.get('/getUserCoupons', coupon.getUserCoupons); //查询该用户所有礼券
app.post('/activateCoupon', coupon.activateCoupon); //激活pin码 
app.get('/couponUse', coupon.couponUse);//激活pin码 是否使用
app.get('/couponS', coupon.couponS);//查询出券的内容
app.get('/codeS', coupon.codeS);////根据code 查询内容
app.post('/activateCouponByUserId', coupon.activateCouponByUserId);
app.get('/ResetStateCode', coupon.ResetStateCode);////根据code 重置卷的状态 
app.get('/updateCouponPaid', coupon.updateCouponPaid);////根据pin_code 重置卷的支付状态 



app.get('/listAvailableTemplates', template.listAvailableTemplates); //获取该券对应的模板
app.get('/listTemplates', template.listTemplates); //查找模板图片
app.get('/listAvailableTemplatesFlag', template.listAvailableTemplatesFlag); //查找模板图片


app.get('/getUserCalendarProducts', calendar.getUserCalendarProducts); // 获取已有作品列表
app.get('/getUserCalendarPosts', calendar.getUserCalendarPosts); // 获取已有的某一个作品中已经上传的图片和其位置
app.post('/createUserCalendarProducts', calendar.createUserCalendarProducts); // 用户[新建]一个的作品
app.post('/addPictureToProductWithPos', calendar.addPictureToProductWithPos); // 上传图片的url到作品，并把位置（那一张）写入数据库
app.get('/postsCalendar', calendar.postsCalendar); // 获取已有封面ID
app.get('/getCalendarPosts', calendar.getCalendarPosts); // 获取已有封面
app.post('/delteCalendar', calendar.delteCalendar); //删除次模板
app.get('/getCalendar', calendar.getCalendar); //

app.post('/listposid', calendar.listposid); //
app.post('/updatePictureToProductWithPos', calendar.updatePictureToProductWithPos); //


app.post('/uploadPictureDataToQiniu', uploadPictureManager.uploadPictureDataToQiniu); // 获取已有封面

app.post('/uploadQiniuAndDel', uploadPictureManager.uploadQiniuAndDel); // 上传七牛并删除本地数据

app.post('/createAddress', orders.createAddress); //下单
app.get('/findAllorder', orders.findAllorder); //查询该用户所有订单
app.get('/findorderId', orders.findorderId); //查询该用户该ID地址
app.post('/listOrderIsPaid', orders.listOrderIsPaid); //查询是否已下单成功


//业务员端
app.get('/admin',function(req, res){
    res.render('business');
})

app.post('/loadAllCoupon',coupon.loadAllCoupon);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var http = require('http').Server(app);
http.listen(7113, function() {
    console.log('cloudprinting listening on *:7113');
});


// module.exports = app;
