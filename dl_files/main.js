define(function(require){
	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");
	var dlm = require("$UI/dlmm/js/dlm");

	require("$UI/system/lib/cordova/cordova");
	require("cordova!cordova-plugin-device");
	require("cordova!cn.zxj.cordova.UmengAnalyticsPlugin");
	require("cordova!cordova-plugin-app-version");
	
	var Model = function(){
		this.callParent();
	};
	
	Model.prototype.modelLoad = function(event){
		Zepto.dlm.inits();
		
		//获取当前应用版本号
		if(window.plugins && cordova && cordova.getAppVersion){
			cordova.getAppVersion.getVersionNumber(function(currentVersion) {
				localStorage.setItem("currentVersion", currentVersion);
			});
		}
		
		var me = this;
		if(localStorage.notRead && localStorage.userinfo && localStorage.notRead==localStorage.userinfo.userid){
			//设置消息未读标记
			$("#msgtip").show();
		} else{
			$("#msgtip").hide();
		}
		
		//定时刷新未读消息
		var refreshMessage = setInterval(function(){
			me.refresh(refreshMessage);
		}, 15000);
		setTimeout(function(){
			me.refresh(refreshMessage);
		}, 2000);
		
		
		// 初始化友盟统计配置
		if(window.plugins && window.plugins.umengAnalyticsPlugin)
			window.plugins.umengAnalyticsPlugin.init();
	};
	
	Model.prototype.noticeData = {
			"noticeid":"",
			"activityid":""
	};
	
	Model.prototype.refresh = function(refreshMessage){
		var me = this;
		var msg = me.comp("messageManageContainer").getInnerModel();
		var receive = me.comp("receiveContainer").getInnerModel();
		dlm.sendRequest({
			"action":"/getMsgCount.action",
			"params":{
				
			},
			"async":true,
			"success":function(json){
				if(json.result=="1"){
					if(json.data.orderMsg){
						var orderMsg = json.data.orderMsg;
						if(orderMsg && orderMsg.CT && parseInt(orderMsg.CT) && parseInt(orderMsg.CT)>0){
							//$("#orderMsgNum").html(parseInt(orderMsg.CT)>99 ? "99+":parseInt(orderMsg.CT));
							//$("#orderMsgNum").show();
							//判断上次最新未读消息时间
							if(localStorage.orderNewtime){
								if(localStorage.orderNewtime<orderMsg.CREATETIME){
									//标记消息未读标记并更新时间
									$("#msgtip").show();
									localStorage.orderNewtime = orderMsg.CREATETIME;
									localStorage.notRead = localStorage.userinfo.userid;
								}
							} else{
								if(orderMsg.CREATETIME){
									//标记消息未读标记并更新时间
									$("#msgtip").show();
									localStorage.orderNewtime = orderMsg.CREATETIME;
									localStorage.notRead = localStorage.userinfo.userid;
								}
							}
						} else{
							//$("#orderMsgNum").hide();
						}
					} else{
						localStorage.removeItem("orderNewtime");
						localStorage.removeItem("notRead");
					}
					
					
					//公告通知
					if(json.data.notice){
						var cache_noticeid = localStorage.getItem("noticeid");
						var noticeid = json.data.notice.noticeid;
						var title = json.data.notice.title;
						try {
							if(!cache_noticeid || parseInt(noticeid) > parseInt(cache_noticeid)){
								//新公告
								$("#msgtip").show();
								$(msg.getElementByXid("notice")).find("dd > h2 > em").remove();
								$(msg.getElementByXid("notice")).find("dd > h2").append("<em></em>");
								//localStorage.setItem("noticeid", noticeid);
								me.noticeData.noticeid = noticeid;
							}
							$(msg.getElementByXid("notice")).find(".message-info").html(title);
						} catch (e) {
						}
					}
					//福利活动
					if(json.data.notice_activity){
						var cache_noticeid = localStorage.getItem("notice_activity");
						var noticeid = json.data.notice_activity.noticeid;
						var title = json.data.notice_activity.title;
						try {
							if(!cache_noticeid || parseInt(noticeid) > parseInt(cache_noticeid)){
								//新福利活动
								$("#msgtip").show();
								$(msg.getElementByXid("activity")).find("dd > h2 > em").remove();
								$(msg.getElementByXid("activity")).find("dd > h2").append("<em></em>");
								//localStorage.setItem("notice_activity", noticeid);
								me.noticeData.activityid = noticeid;
							}
							$(msg.getElementByXid("activity")).find(".message-info").html(title);
						} catch (e) {
						}
					}
					//推送通知
					if(json.data.notice_send){
						var cache_noticeid = localStorage.getItem("notice_send");
						var noticeid = json.data.notice_send.noticeid;
						var linkurl = json.data.notice_send.linkurl;
						var cache_time = localStorage.getItem("notice_send_time");
						var currtime = new Date().getTime();
						var title = json.data.notice_send.title;
						var sendtime = json.data.notice_send.sendtime;
						try {
							if(!cache_noticeid || parseInt(noticeid) > parseInt(cache_noticeid)){
								//新推送
								$(receive.getElementByXid("scroll-left")).html(title);
								$(receive.getElementByXid("noticeid")).val(noticeid);
								$(receive.getElementByXid("linkurl")).val(linkurl);
								$(receive.getElementByXid("noticeMsg")).show();
								//new Scroll(receive.getElementByXid("scroll-left"));
								//localStorage.setItem("notice_send", noticeid);
								//localStorage.setItem("notice_send_time", currtime);
							}else if(cache_noticeid && cache_time && sendtime != "0" && noticeid == cache_noticeid){
								//定时推送，判断时间是否达到
								if(currtime > parseInt(cache_time)+(parseInt(sendtime)*3600*1000)){
									//定时推送
									$(receive.getElementByXid("scroll-left")).html(title);
									$(receive.getElementByXid("noticeid")).val(noticeid);
									$(receive.getElementByXid("linkurl")).val(linkurl);
									$(receive.getElementByXid("noticeMsg")).show();
									//new Scroll(receive.getElementByXid("scroll-left"));
									//localStorage.setItem("notice_send", noticeid);
									//localStorage.setItem("notice_send_time", currtime);
								}
							}
						} catch (e) {
						}
					}
				} else{
					if(json && (json.result == 3 || json.result == 4)){
						localStorage.removeItem("userinfo");
					}
					if(json.data){
						clearInterval(refreshMessage);
						//Alert(json.data);
						//justep.Shell.showPage("login");
					}
					localStorage.removeItem("orderNewtime");
					localStorage.removeItem("notRead");
				}
			}
		});
	};
	
	Model.prototype.checkLogin = function(event){
		var userinfo = localStorage.userinfo ? JSON.parse(localStorage.userinfo) : null;
		var me =this;
		//加载消息页
		me.comp('messageManageContainer').load();
		var selectedBut = event.item;
		if(selectedBut){
			var selectedXid = selectedBut.getXid();
			if(selectedXid!="receiveButton"){
				//校验登录状态
				if(!userinfo){
					justep.Shell.showPage("login");
					return;
				}
				if(selectedXid=="messageManageButton"){
					localStorage.removeItem("notRead");
					//未读标记取消
					$("#msgtip").hide();
					//me.comp('messageManageContainer').load();
					if(me.comp('messageManageContainer').getInnerModel()){
						me.comp('messageManageContainer').getInnerModel().data1CustomRefresh();
					}
					
					//认为公告活动已读
					if(me.noticeData.noticeid){
						localStorage.setItem("noticeid", me.noticeData.noticeid);
					}
					if(me.noticeData.activityid){
						localStorage.setItem("notice_activity", me.noticeData.activityid);
					}
					
					
					//取消息未读标记
					/*dlm.sendRequest({
						"action":"/getMsgCount.action",
						"params":{
							
						},
						"success":function(json){
							if(json && json.result){
								if(json.result=="1"){
									if(json.data.orderMsg){
										var orderMsg = json.data.orderMsg;
										if(orderMsg && orderMsg.CT && parseInt(orderMsg.CT) && parseInt(orderMsg.CT)>0){
											$("#orderMsgNum").html(parseInt(orderMsg.CT)>99 ? "99+":parseInt(orderMsg.CT));
											$("#orderMsgNum").show();
										} else{
											$("#orderMsgNum").hide();
										}
									}
								}
							}
						}
					});*/
					
				} else if(selectedXid=="personalButton"){
					dlm.sendRequest({
						"action" : "/getLoginUserInfo.action",
						"params" : {},
						"async":true,
						"trust":true,
						"success" : function(json) {
							var user = json.data;
							if (user) {
								if (user.nickname) {
									$("#per_nickname").html(user.nickname);
								}
			
								if (user.userid) {
									$("#per_signature").html("ID:"+user.userid);
								}
								/*if (user.signature) {
									var signature = user.signature;
									if (signature.length > 12) {
										signature = signature.substring(0, 12) + "......"
									}
									$("#per_signature").html("个性签名：" + signature);
								}*/
								if (user.touaddr) {
									$("#per_touaddr").attr("src", user.touaddr);
								}
							}
						}
					});
			
					dlm.sendRequest({
						"action" : "/finance/getAccountInfo.action",
						"params" : {
			
						},
						"async":true,
						"trust":true,
						"success" : function(json) {
							$("#per_amount").html(json.data.A);
							$("#per_freeze").html(json.data.B);
						}
					});
					
				}else if(selectedXid=="publishManageButton"){
					dlm.goPage("publish_first");
				}
			} 
		}
	};
	
	return Model;
});