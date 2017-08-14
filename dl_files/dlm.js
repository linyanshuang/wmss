define(function(require) {
	var constant = require("./constant");
	var dlm = {};
	var justep = require("$UI/system/lib/justep");
	
	dlm.pageSize = 30;
	/**
	 * 发起请求
	 * params:请求参数
	 * action:请求方法
	 * success:成功后的调用方法
	 */
	dlm.sendRequest = function(options) {
		var userinfo = localStorage.userinfo ? JSON.parse(localStorage.userinfo) : null;
		if(!options.params){
			options.params = {};
		}
		if(!options.baseUrl){
			options.params.appflag = "1";
			options.params.ticket = userinfo ? userinfo.ticket : "";
		}
		return $.ajax({
			"type" : "post",
			"async" : options.async ? options.async : false,
			"dataType" : "jsonp",
			"jsonp" : "dlmjsonp",
			"timeout" : options.timeout ? options.timeout : 5000,
			"url" : (options.baseUrl ? options.baseUrl : constant.INTF_URL) + options.action,
			"data" : options.params,
			"success" : function(json){
				if(json){
					if(options.trust){
						if(json && json.result == "1" && json.data){
							options.success(json);
						}else if(json && json.result == "2" && json.data){
							if(json.data.message || json.data.msg){
								Alert(json.data.message ? json.data.message : json.data.msg);
							}else{
								Alert(json.data);
							}
						}else if(json.result && json.result == "3"){
							localStorage.removeItem("userinfo");
						}else if(json.result && json.result == "4"){
							localStorage.removeItem("userinfo");
						}else{
							
						}
					}else{
						options.success(json);
					}
				}else{
					Alert("网络打了个盹，请刷新下重试");
				}
			},
			"error" : function(){
				if(options.error){
					options.error();
				}else{
					//Alert("网络打了个盹，请刷新下重试");
				}
			}
		});
	};
	
	/**
	 * 跳转页面，用此方法必须将页面加入映射，使用缩略名称
	 */
	dlm.goPage = function(url,params) {
		justep.Shell.closePage(url);
		justep.Shell.loadPage(url,
			function(){
				justep.Shell.showPage(url);
			}
		,params);
	};
	return dlm;
});