define(function(require){

	var dlm = require("$UI/dlmm/js/dlm");
	
	var Model = function(){
		this.callParent();
	};
	
	//跳转搜索页
	Model.prototype.toSearch = function(event){
		var me = this;
		//刷新数据
		var index = me.comp("contents1").getActiveIndex();
		var pageXid = index === 0 ? "receiveManageContainer" : "releaseManageContainer";
		
		var model = me.comp(pageXid).getInnerModel();
		dlm.goPage("searchOrder",{
			"search":function(resultmsg){
				model.keyword = resultmsg;
				model.comp("data1").refreshData();
			},
			"keyword":model.keyword,
			"placeholder":"订单号/标题/接单人/角色/账号"
		});
	};
	
	return Model;
	
});