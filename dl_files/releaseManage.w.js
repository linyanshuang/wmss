window.__justep.__ResourceEngine.loadCss([{url: '/system/components/comp.min.css', include: '$model/system/components/justep/lib/css2/dataControl,$model/system/components/justep/input/css/datePickerPC,$model/system/components/justep/messageDialog/css/messageDialog,$model/system/components/justep/lib/css3/round,$model/system/components/justep/input/css/datePicker,$model/system/components/justep/row/css/row,$model/system/components/justep/attachment/css/attachment,$model/system/components/justep/barcode/css/barcodeImage,$model/system/components/bootstrap/dropdown/css/dropdown,$model/system/components/justep/dataTables/css/dataTables,$model/system/components/justep/contents/css/contents,$model/system/components/justep/common/css/forms,$model/system/components/justep/locker/css/locker,$model/system/components/justep/menu/css/menu,$model/system/components/justep/scrollView/css/scrollView,$model/system/components/justep/loadingBar/loadingBar,$model/system/components/justep/dialog/css/dialog,$model/system/components/justep/bar/css/bar,$model/system/components/justep/popMenu/css/popMenu,$model/system/components/justep/lib/css/icons,$model/system/components/justep/lib/css4/e-commerce,$model/system/components/justep/toolBar/css/toolBar,$model/system/components/justep/popOver/css/popOver,$model/system/components/justep/panel/css/panel,$model/system/components/bootstrap/carousel/css/carousel,$model/system/components/justep/wing/css/wing,$model/system/components/bootstrap/scrollSpy/css/scrollSpy,$model/system/components/justep/titleBar/css/titleBar,$model/system/components/justep/lib/css1/linear,$model/system/components/justep/numberSelect/css/numberList,$model/system/components/justep/list/css/list,$model/system/components/justep/dataTables/css/dataTables'}]);window.__justep.__ResourceEngine.loadJs(['/system/core.min.js','/system/common.min.js','/system/components/comp.min.js']);define(function(require){
require('$model/UI2/system/components/justep/model/model');
require('$model/UI2/system/components/justep/loadingBar/loadingBar');
require('$model/UI2/system/components/justep/list/list');
require('$model/UI2/system/components/justep/data/data');
require('$model/UI2/system/components/justep/window/window');
var __parent1=require('$model/UI2/system/lib/base/modelBase'); 
var __parent0=require('$model/UI2/dlmm/page/orderManage/releaseManage'); 
var __result = __parent1._extend(__parent0).extend({
	constructor:function(contextUrl){
	this.__sysParam='true';
	this.__contextUrl=contextUrl;
	this.__id='';
	this.__cid='ceQriii';
	this._flag_='13baa3f644c8597609bfc5c7b1f0033f';
	this.callParent(contextUrl);
 var __Data__ = require("$UI/system/components/justep/data/data");new __Data__(this,{"autoLoad":true,"confirmDelete":true,"confirmRefresh":false,"defCols":{"accountpwd":{"define":"accountpwd","label":"密码","name":"accountpwd","relation":"accountpwd","type":"String"},"accountvalue":{"define":"accountvalue","label":"账号","name":"accountvalue","relation":"accountvalue","type":"String"},"areaname":{"define":"areaname","label":"区名称","name":"areaname","relation":"areaname","type":"String"},"createtime":{"define":"createtime","label":"发布时间","name":"createtime","relation":"createtime","type":"String"},"cxjg":{"define":"cxjg","label":"撤销结果","name":"cxjg","relation":"cxjg","type":"String"},"cxyy":{"define":"cxyy","label":"撤销原因","name":"cxyy","relation":"cxyy","type":"String"},"dlcontent":{"define":"dlcontent","label":"代练要求内容","name":"dlcontent","relation":"dlcontent","type":"String"},"dlwctime":{"define":"dlwctime","label":"完成时间","name":"dlwctime","relation":"dlwctime","type":"String"},"efficiency":{"define":"efficiency","label":"效率保证金","name":"efficiency","relation":"efficiency","type":"String"},"finishtime":{"define":"finishtime","label":"完单时间","name":"finishtime","relation":"finishtime","type":"String"},"gamename":{"define":"gamename","label":"游戏名称","name":"gamename","relation":"gamename","type":"String"},"isbuyer":{"define":"isbuyer","label":"是否接单人","name":"isbuyer","relation":"isbuyer","type":"String"},"isseller":{"define":"isseller","label":"是否发单人","name":"isseller","relation":"isseller","type":"String"},"linktel":{"define":"linktel","label":"联系电话","name":"linktel","relation":"linktel","type":"String"},"nickname":{"define":"nickname","label":"昵称","name":"nickname","relation":"nickname","type":"String"},"orderid":{"define":"orderid","label":"订单ID","name":"orderid","relation":"orderid","type":"String"},"orderorgin":{"define":"orderorgin","label":"订单来源","name":"orderorgin","relation":"orderorgin","type":"String"},"orderstatusname":{"define":"orderstatusname","label":"订单状态","name":"orderstatusname","relation":"orderstatusname","type":"String"},"ordertitle":{"define":"ordertitle","label":"订单标题","name":"ordertitle","relation":"ordertitle","type":"String"},"otherdesc":{"define":"otherdesc","label":"其它说明","name":"otherdesc","relation":"otherdesc","type":"String"},"qq":{"define":"qq","label":"联系QQ","name":"qq","relation":"qq","type":"String"},"receivetime":{"define":"receivetime","label":"接单时间","name":"receivetime","relation":"receivetime","type":"String"},"requiretime":{"define":"requiretime","label":"代练要求时间","name":"requiretime","relation":"requiretime","type":"String"},"rolename":{"define":"rolename","label":"角色名称","name":"rolename","relation":"rolename","type":"String"},"safedeposit":{"define":"safedeposit","label":"安全保证金","name":"safedeposit","relation":"safedeposit","type":"String"},"sellername":{"define":"sellername","label":"发单人昵称","name":"sellername","relation":"sellername","type":"String"},"servername":{"define":"servername","label":"服务器名称","name":"servername","relation":"servername","type":"String"},"sqzcyy":{"define":"sqzcyy","label":"申请仲裁原因","name":"sqzcyy","relation":"sqzcyy","type":"String"},"surplustime":{"define":"surplustime","label":"剩余时间","name":"surplustime","relation":"surplustime","type":"String"},"unitprice":{"define":"unitprice","label":"价格","name":"unitprice","relation":"unitprice","type":"String"},"zcjg":{"define":"zcjg","label":"仲裁结果","name":"zcjg","relation":"zcjg","type":"String"},"zcsm":{"define":"zcsm","label":"仲裁说明","name":"zcsm","relation":"zcsm","type":"String"}},"directDelete":false,"events":{"onCustomRefresh":"data1CustomRefresh"},"idColumn":"orderid","limit":20,"xid":"data1"});
 new __Data__(this,{"autoLoad":true,"confirmDelete":true,"confirmRefresh":true,"defCols":{"id":{"define":"id","label":"游戏ID","name":"id","relation":"id","type":"String"},"name":{"define":"name","label":"游戏名称","name":"name","relation":"name","type":"String"}},"directDelete":false,"events":{},"idColumn":"name","limit":20,"xid":"gamename"});
 new __Data__(this,{"autoLoad":true,"confirmDelete":true,"confirmRefresh":true,"defCols":{"name":{"define":"name","label":"区名称","name":"name","relation":"name","type":"String"}},"directDelete":false,"events":{},"idColumn":"name","limit":20,"xid":"areaname"});
 new __Data__(this,{"autoLoad":true,"confirmDelete":true,"confirmRefresh":true,"defCols":{"name":{"define":"name","label":"服务器名称","name":"name","relation":"name","type":"String"}},"directDelete":false,"events":{},"idColumn":"name","limit":20,"xid":"servername"});
}}); 
return __result;});
