define(function(require) {
	var justep = require("$UI/system/lib/justep");
	var ShellImpl = require('$UI/system/lib/portal/shellImpl');
	var dlm = require("$UI/dlmm/js/dlm");
	var browser = require("$UI/system/lib/base/browser");
	
	//引入插件
	require("cordova!cn.zxj.cordova.UmengAnalyticsPlugin");
	require("cordova!com.verso.cordova.clipboard");
	require("cordova!de.appplant.cordova.plugin.background-mode");
	require("cordova!de.appplant.cordova.plugin.badge");
	require("cordova!de.appplant.cordova.plugin.local-notification");
	require("cordova!cordova-plugin-customurlscheme");
	require("cordova!cordova-plugin-OpenApp");
	
	
	//判断端类型
	if(window.plugins && navigator.userAgent && navigator.userAgent.indexOf("iPhone")>-1){
		require("css!$UI/dlmm/css/ios").load();
	}
	
	var Model = function() {
		this.callParent();
		var shellImpl = new ShellImpl(this, {
			"contentsXid" : "pages",
			"pageMappings" : {
				"main" : {
					url : "$UI/dlmm/main.w"
				},
				"receiveOrder" : {
					url : "$UI/dlmm/page/receiveOrder/receiveOrder.w"
				},
				"login" : {
					url : "$UI/dlmm/page/login/login.w"
				},
				"orderInfo":{
					url : "$UI/dlmm/page/orderManage/orderInfo.w"
				},
				"orderInfo_sqcx":{
					url : "$UI/dlmm/page/orderManage/orderInfo_sqcx.w"
				},
				"orderInfo_sqzc":{
					url : "$UI/dlmm/page/orderManage/orderInfo_sqzc.w"
				},
				"searchOrder":{
					url : "$UI/dlmm/page/receiveOrder/searchOrder.w"
				},
				"orderInfo_tjyc":{
					url : "$UI/dlmm/page/orderManage/orderInfo_tjyc.w"
				},
				"orderChat":{
					url : "$UI/dlmm/page/orderManage/orderChat.w"
				},
				"register" : {
					url : require.toUrl('./page/register/register.w')
				},
				"register_second" : {
					url : require.toUrl('./page/register/register_second.w')
				},
				"tgpInfo_lol" : {
					url : require.toUrl('./page/receiveOrder/tgpInfo_lol.w')
				},
				"tgpInfo_wzry" : {
					url : require.toUrl('./page/receiveOrder/tgpInfo_wzry.w')
				},
				"publish_first" : {
					url : require.toUrl('./page/publish/publish_first.w')
				},
				"publish_sec" : {
					url : require.toUrl('./page/publish/publish_sec.w')
				},
				"publish_final" : {
					url : require.toUrl('./page/publish/publish_final.w')
				},
				"auto_login_authorize" : {
					url : require.toUrl('./page/publish/authorize.w')
				},
				"noticeList" : {
					url : require.toUrl('./page/message/noticeList2.w')
				},
				"noticeactivityList" : {
					url : require.toUrl('./page/message/activityList.w')
				},
				"noticeInfo" : {
					url : require.toUrl('./page/message/noticeInfo.w')
				},
				"openUrl" : {
					url : require.toUrl('./page/message/openUrl.w')
				},
				"register_agr" : {
					url : require.toUrl('./page/register/register_agr.w')
				},
				"publish_agr" : {
					url : require.toUrl('./page/publish/publish_agr.w')
				},
				"receiveOrder_agr" : {
					url : require.toUrl('./page/receiveOrder/receiveOrder_agr.w')
				}
			}
		});
	};

	Model.prototype.modelLoad = function(event){
		//判断是否已登录
		var me = this;
//		var url = require.toUrl("./main.w");
//		justep.Shell.loadPage({"url":url});
//		me.comp("mainContainer").setSrc(url);

		//清空错误提示
		window.onerror=function(){
			
		};
		$(document).ajaxError( function(event, jqXHR, options, data){
			
		});
		
		if(browser.isX5App){
			//检测是否有复制分享
			this.getCopyShare();
			//取消所有消息
			cordova.plugins.notification.local.cancelAll(function(){
				//定时唤醒用户
				var titles = ["是时候接个订单展现你的王者风采了。","王者荣耀抢单区惊现肥单出现大量肥单，快来看看吧！","要不要接个单子，赚点零钱？","我看你骨骼惊奇，必是代练奇才，这里有几个肥单推荐给你。"
				              ,"吾日三看抢单区，可以王者已。","推荐好友接单，可获得现金奖励，详情请看代练妈妈微信公众号：DLMM52","嘿，兄弟，开黑不，我赵云贼6。。。","兄弟，不是我和你吹，那天我用成吉思汗，野外看到兰陵王，我反手就是一个大。。。"
				              ,"关关雎鸠，在河之洲，小乔昭君，我都好逑。","快来代练妈妈接单赚钱啦~","代练妈妈提醒您：快来接单赚钱啦~","一日，赵云野外遭遇曹操，一套连招竟然将其打死。赵云奇怪回去问诸葛：这曹操装备这么垃圾？诸葛：谁让他不知道接单赚钱！"
				              ,"欢迎使用代练妈妈，快来看看又有什么新鲜活动吧"];
				var title = titles[parseInt(Math.random()*titles.length, 10)];
				cordova.plugins.notification.local.schedule({
			             id : 1,
			          text : title,
			          every : 'week',
			      autoClear : false,
			      		at : new Date(new Date().getTime()+2*24*60*60*1000)
		        });
			});
			me.isactive = 0;
			//APP进入后台模式时触发
			cordova.plugins.backgroundMode.onactivate = function() {
				setTimeout(function(){
					//两秒后还是后台模式，才认为真正进入后台模式
					if(cordova.plugins.backgroundMode.isActive()){
						me.isactive = 1;
					}
				},2000);
			};
			//APP从后台模式解除时触发
			cordova.plugins.backgroundMode.ondeactivate = function() {
				//是否真正进入后台模式过
				if(me.isactive && me.isactive == 1){
					//检查是否有复制分享
					me.getCopyShare();
				}
				me.isactive = 0;
			};
			//后台模式激活
			cordova.plugins.backgroundMode.enable();
		}else{
			//非APP
			
			//获取URL分享信息
			this.getUrlShare();
			//指定打开链接的页面
			this.getUrlOpen();
			//启动复制插件
			new Clipboard('.copydlmm');
		}
	};
	
	//获得当前的参数，或指定url的参数
	Model.prototype.getQueryString = function(name,url){
		var search = window.location.search;
		if(url){
			search = url.indexOf("?") > -1 ? url.substring(url.indexOf("?")) : "";
		}
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null; 
	};
	
	//URL分享
	Model.prototype.getUrlShare = function(event){
		//获取URL内容
		var share_key = this.getQueryString("share_key");
		if(share_key){
			this.openShare(share_key,2);
		}
	};
	
	//URL打开
	Model.prototype.getUrlOpen = function(event){
		//获取URL内容
		var page = this.getQueryString("page");
		var params = this.getQueryString("params");
		if(page && params){
			dlm.goPage(page,JSON.parse(params));
		}
	};
	
	//复制分享
	Model.prototype.getCopyShare = function(event){
		var me = this;
		//app内获取剪切板
		cordova.plugins.clipboard.paste(function(text){
			if(text && text.indexOf("￥") > -1 && text.indexOf("代练妈妈") > -1){
				text = text.substring(text.indexOf("￥")+1);
				if(text.indexOf("￥") > -1){
					var share_key = text.substring(0,text.indexOf("￥"));
					me.openShare(share_key,1);
					//获取分享后把分享内容清空，避免重复分享
					cordova.plugins.clipboard.copy("",function(evt){});	
				}
			}
		});	
	};
	
	Model.prototype.openShare = function(share_key,type){
		var me = this;
		dlm.sendRequest({
			"action":"/getAppShare.action",
			"params":{
				"share_key":share_key,
				"device":me.getDeviceType(),
				"clienttype":me.getClientType(),
				"sharetype":type
			},
			"async":true,
			"success":function(json){
				if(json && json.result && json.result == "1" && json.data){
					me.cindex = me.openDiv(
						"",json.data.remark,['立即查看', '取消'],"6",
						function(){
							layer.close(me.cindex);
							var page = json.data.page;
							var params = JSON.parse(json.data.params);
							justep.Shell.closePage(page);
							setTimeout(function(){
								justep.Shell.loadPage(page,
									function(){
										justep.Shell.showPage(page);
										if(type == 2 && !browser.isX5App){
											$(me.getElementByXid("loadAppDownload")).show();
											Zepto(".closeApp").tap(function(){
												//关闭底部下载APP窗口
												$(me.getElementByXid("loadAppDownload")).hide();
											});
											Zepto(".downloadApp").tap(function(){
												//开发执行下载方法
												location.href = "http://static.dailianmama.com/tool/dlmmqy/appdownload.html";
											});
										}
									}
								,params);
							},500);
							
						}
					);
				}else if(json && json.data){
					Alert(json.data);
				}
			}
		});
	};
	
	Model.prototype.loginSuccess = function(event){
		this.comp("mainContainer").refresh();
	};
	
	Model.prototype.openDiv = function(title,content,other,type,fun,fun2){
		var _html = '';
		if(type == 2){
			_html += '<div class="ye-box"><div class="ye-box-header">'+
						'<em class="iconfont" style="right:0;left:inherit;">&#xe601;</em>'+
						'<h2 class="title">'+title+'</h2>'+
					'</div>';
			_html += '<div class="ye-box-con">'+content+'</div>'+
					'<div class="btn-block" style="margin: 0.3rem 0 0.6rem 0;">'+
				    	'<p><a class="button-blue">'+other+'</a></p>'+
				    '</div>'+
				'</div>';
		}else if(type == 5){
			_html += '<div style="height:2.6rem;">'+
						'<img src="http://static.dailianmama.com/app_dlmm/images/share_logo.png" width="30%">'+
					'</div>'+
					'<h4 class="share_p"><span class="share_p_span">您的分享口令已生成</span></h4>'+
					'<div class="share_detail">'+
						'<textarea style="width:90%;height:3.8rem;border:0;margin-top:0.5rem;" class="share_copy_text" readonly>'+ content+'</textarea>'+
					'</div>';
		}else if(type == 6){
			_html += '<div style="height:2.4rem;">'+
						'<img src="http://static.dailianmama.com/app_dlmm/images/openshare_logo.png" width="23%">'+
					'</div>'+
					'<h4 class="openShare_p"><span class="share_p_span">去打开分享口令</span></h4>'+
					'<div class="share_detail">'+
						'<p class="share_content">'+content+'</p>'+
					'</div>';
		}
		var cindex;
		if(type != 2){
			cindex = layer.open({
			    content: _html,
			    btn: other,
			    className:'sharePopup',
			    success:function(){
			    	setTimeout(function(){
				    	if(fun2){
							fun2();
						}
					},500);
			    },
		    	yes: function(index){
		    		if(fun){
		    			fun();
		    		}
			    }
			});
		}else{
			cindex = layer.open({
				content:_html,
				className:"ye-type",
				shadeClose: false,
				success: function(){
					setTimeout(function(){
						$(".ye-box-header").find("em.iconfont").click(function(){
							layer.closeAll();
						});
						$(".ye-box .btn-cancel").click(function(){
							layer.closeAll();
						});
						$(".ye-box .input").focus(function(){
							$(".ye-box .msg").html("&nbsp;");
						});
						$(".ye-box .input").trigger('click');
						$(".ye-box .btn-sure").click(function(){
							fun();
						});
						$(".ye-box .button-blue").click(function(){
							var text = $(".ye-box .input").val();
							fun(text);
						});
						if(fun2){
							fun2();
						}
					},500);
				}
			});
		}
		return cindex;
	};
	
	Model.prototype.modelInactive = function(event){
		//关闭弹框
		layer.close(this.cindex);
	};
	
	Model.prototype.modelActive = function(event){
	};
	
	//分享信息
	Model.prototype.sharedata = {};
	
	//打开分享层
	Model.prototype.createShare = function(title,remark,page,params){
		var me = this;
		function success(){
			me.showActionSheet();
			//非app环境
			if(!browser.isX5App){
				new Clipboard('.share_copy',{
				    text: function(trigger) {
				        return me.sharedata.text;
				    }
				});
			}
		}
		me.createShareData(title,remark,page,params,success);
	};
	
	//创建分享数据
	Model.prototype.createShareData = function(title,remark,page,params,fun){
		var me = this;
		dlm.sendRequest({
			"action":"/createAppShare.action",
			"params":{
				"title":title,
				"remark":remark,
				"page":page,
				"params":JSON.stringify(params),
				"device":me.getDeviceType(),
				"clienttype":me.getClientType()
			},
			"async":true,
			"success":function(json){
				if(json && json.result && json.result == "1" && json.data){
					me.sharedata = json.data;
					if(fun){
						fun();
					}
				}else if(json && json.data){
					Alert(json.data);
				}
			}
		});
	};
	
	//获得设备类型
	Model.prototype.getDeviceType = function(){
		return browser.deviceType;
	};
	
	//获得客户端类型
	Model.prototype.getClientType = function(){
		if(browser.isX5App){
			return 1;
		}
		if(browser.isWeChat){
			return 2;
		}
		if(browser.isMobile){
			return 3;
		}
		return 0;
	};
	
	
	//显示底部分享
	Model.prototype.showActionSheet = function(){
		var me = this;
		var mask = Zepto(me.getElementByXid("mask"));
		var weuiActionsheet = Zepto(me.getElementByXid("weui_actionsheet"));
		weuiActionsheet.addClass('weui_actionsheet_toggle');
		mask.show().addClass('weui_fade_toggle').tap(function () {
			me.hideActionSheet();
		});
		Zepto(me.getElementByXid("actionsheet_cancel")).tap(function () {
			me.hideActionSheet();
		});
		Zepto(".share_copy:eq(0)").tap(function(){
			me.share(0);
		});
		Zepto(".share_copy:eq(1)").tap(function(){
			me.share(1);
		});
		Zepto(".share_copy:eq(2)").tap(function(){
			me.copyShare();
		});
		weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');
		document.ontouchstart=function(){
			return false;
		}
	};
	
	//隐藏底部分享
	Model.prototype.hideActionSheet = function(){
		var me = this;
		var mask = Zepto(me.getElementByXid("mask"));
		var weuiActionsheet = Zepto(me.getElementByXid("weui_actionsheet"));
		weuiActionsheet.removeClass('weui_actionsheet_toggle');
		mask.removeClass('weui_fade_toggle');
		weuiActionsheet.on('transitionend', function () {
			mask.hide();
		}).on('webkitTransitionEnd', function () {
			mask.hide();
		});
		document.ontouchstart=function(){
			return true;
		}
	};
	
	//分享
	Model.prototype.share = function(index){
		var me = this;
		//app复制
		if(browser.isX5App){
			cordova.plugins.clipboard.copy(me.sharedata.text,function(evt){});	
		}
		me.hideActionSheet();
		me.isopen = "0";
		me.cindex = me.openDiv(
			"",me.sharedata.text,['去粘贴', '不分享'],"5",
			function(){
				if(me.isopen == "1"){
					return;
				}
				me.isopen = "1";
				setTimeout(function(){
					layer.close(me.cindex);
					//app打开
					if(browser.isX5App){
						try{
							var opencode = index == 0 ? me.sharedata.open_wx_code : me.sharedata.open_qq_code;
							cordova.plugins.OpenApp.open(["551488263961930017855001","1",opencode], 
								function(success){
								},
								function(error){
									//使用第二种包名登陆
									opencode = index == 0 ? me.sharedata.open_wx_code : me.sharedata.open_qq_code2;
									cordova.plugins.OpenApp.open(["551488263961930017855001","1",opencode], 
										function(success){
										},
										function(error){
											Alert("跳转失败，请手动复制");
										}
									);
								}
							);
						}catch(err){
							
						}
					}else{
						//跳转
						var scheme = "";
						if(index == 0){
							scheme = "weixin://";
						}else if(index == 1){
							if(browser.isAndroid){
								scheme = "mqqwpa://im/chat?chat_type=wpa&uin=返回好友列表粘贴&version=1";
							}else{
								scheme = "mqqwpa://";
							}
						}
						location.href=scheme;
					}
				},200);
			},
			function(){
				//非APP环境，兼容多种情况复制
				if(!browser.isX5App){
					$(".layermbtn span").eq(1).attr("data-clipboard-target",".share_copy_text");
					$(".layermbtn span").eq(1).addClass("share_copy");
					new Clipboard('.share_copy');
				}
			}
		);
	};
	
	//复制分享内容
	Model.prototype.copyShare = function(){
		//app复制
		if(browser.isX5App){
			cordova.plugins.clipboard.copy(this.sharedata.text,function(evt){});	
		}
		this.hideActionSheet();
		Alert("复制成功");
	};
	
	//接单分享
	Model.prototype.receiveOrderShare = function(info){
		var title = "【" + info.ordertitle + "，价格：" + info.unitprice + "元，单号：" + info.orderid + "】代练妈妈，等你接单！";
		this.createShare(title,title,"receiveOrder",{"orderid":info.orderid});
	};
	
	//公告分享
	Model.prototype.noticeInfoShare = function(info){
		var title = "【" + info.title + "】代练妈妈，活动不停！";
		this.createShare(title,title,"noticeInfo",{"noticeid":info.noticeid});
	};
	
	return Model;
});