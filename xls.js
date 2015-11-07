var xlsx = require("node-xlsx");
var list = xlsx.parse("xls.xls");
var CouponDistribution = require('./models/v1/coupon_distribution');
console.log(list[1].data[0]);


var tmp_arr = list[1].data[0];
console.log(tmp_arr[1]);
var result = {'code':'','action':'','success':'','message':'','data':''};
CouponDistribution
	.create({
		pin_code:tmp_arr[1]
	})
	.then(function(dishClassifyNew){
		console.log(dishClassifyNew);
		if(dishClassifyNew.length!=0){
			result.code = 200;
			result.action = 'createDishClassifiersInDatabase';
    		result.success = true;
   			result.message = "成功";   			
   			// res.json(result);
   			result.data = null;
		}else{
			result.code = 404;
			result.action = 'createDishClassifiersInDatabase';
    		result.success = false;
    		result.message = "失败";
			// res.json(result);
		}
	})


