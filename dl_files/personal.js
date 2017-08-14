define(function(require) {
	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");
	var dlm = require("$UI/dlmm/js/dlm");
    require("cordova!cordova-plugin-OpenApp");
    require("cordova!cordova-plugin-inappbrowser");
    
	var Model = function() {
		this.callParent();
	};
	Model.prototype.personalContentLoad = function(event){
	
	    var myScroll;
	    var def = function(e){e.preventDefault();}
	    function loaded () {
			myScroll = new IScroll('#kf_wrapper',{
				bounce:false,
				momentum:false
			});
			document.addEventListener('touchmove',def,false);
		};
		
		  //联系客服
		
		$("#lxkf").click(function(event){
				$(".x-panel-content").height("100%");
		        //debugger
	            event.stopPropagation(); //阻止事件冒泡
				loaded(); // 创建活动菜单
				var mmenuhei = $("#kf_choose_aut_").outerHeight(true);
				DownSlide(mmenuhei);
				
			    $("#personal_qq").on('tap',function(event){
					window.open('mqq://im/chat?chat_type=wpa&uin=800811499&version=1&src_type=web','_system');
					UpSlide(def, myScroll);
				});
				$("#personal_tel").on('tap',function(event){
					UpSlide(def, myScroll);
				});
				$("#personal_mail").on('tap',function(event){
					UpSlide(def, myScroll);
				});
				$("#kf_cancel_choose").on('tap', function(event){
					UpSlide(def, myScroll); //关闭上滑菜单
				});
				/*$(document).click(function(){
					UpSlide(def, myScroll); //关闭上滑菜单
				});*/
				$("#kf_offer_float").click(function(event){
					event.stopPropagation();
				});
		});

	//andriod
	/*$("#andriod").click(function(){
		try{
			cordova.plugins.OpenApp.open(['551484875556323017970001','1', 
		                              'yohKEvwjFJ9IcgpMsM+HLTVML3Q+DTT5/iwW+8DEGHdlF+kl/5QE4VekqUel+ehwZmVDpF1O4+iU'+
									  '965781KkpPlNAsevQz0Dy9rAl8cswcqIzxaQ6eiQexVc6GhOtIOZOntewHsSxsDoj0upwcPX2TCV'+
									  'fcFO/w4VS1jnTCzqAkLjaKFXd2h/sHMrq+9szzaHi8M6TbXRb2C45JN3VOW0tc5VrlogKX/hTsvF'+
									  'KLvPqU8Q1tMxvTmCd4XqW5oOTU9Qu/2MUGgQ25ZzfzihD4iySny0nZ3VTlVcFap32fQD7tXG+DH3'+
									  '2V8dNUfWDn9ROLBGdlrjzxCc8HSMwjFqhZWM2xpgmZG/zg22qDjjHbdf3EeQU9SR1SYhqIOb/ArC'+
									  'zjhXRh4C8YTee2gvByFO3zl5ig=='], 
					function(success){Alert(success)},function(error){Alert(error)})
		}catch(err){
			
		}
		});*/
	//ios
	/*$("#ios").click(function(){
	try{
		cordova.plugins.OpenApp.open(['551484286781860010515001','1', 
			                              'hyhxscHnNMd5ltof3MEa1i69kptgTk1h85pz1cjfjMmOygqaplCBOuOktH2WAHbnGju4pGK/YsUZ'+
		                                  'RPE2wZ+WVNe98OBR35NHEeiTF1QKI0Ocfm6V5GSzf647s82fGHjKgfVmV7kFunhZFpbLpZ0jZA=='],  
				function(success){Alert(success)},function(error){Alert(error)})
	}catch(err){
		
	}
	});*/
		
		
		
		
	};
	
	
	Model.prototype.loadPersonalInfo = function(event) {

		var me = this;
		dlm.sendRequest({
			"action" : "/getLoginUserInfo.action",
			"params" : {},
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
						console.log(user.touaddr);
					}
				}
			}
		});

		dlm.sendRequest({
			"action" : "/finance/getAccountInfo.action",
			"params" : {

			},
			"success" : function(json) {
				$("#per_amount").html(json.data.A);
				$("#per_freeze").html(json.data.B);
			}
		});
	};

	Model.prototype.financeManager = function(event) {
		var me = this;
		var url = '$UI/dlmm/page/finance/financeManager.w';
		var params = {
			reloadParent : function() {
				me.loadPersonalInfo();
			}
		};
		justep.Shell.showPage(url, params);
	};
	/**
	 * 点击资料跳转到个人详情页
	 */
	Model.prototype.userinfoClick = function(event) {
		var me = this;
		var url = '$UI/dlmm/page/personal/personalinfo.w';
		var params = {
			reloadParent : function() {
				me.loadPersonalInfo();
			}

		}
		justep.Shell.showPage(url, params);

	};
	Model.prototype.closelogin = function(event) {
		var me = this;
		justep.Shell.closeAllOpendedPages();
		justep.Shell.showPage("main");
		me.getParent().loginSuccess();
	};
	/**
	 * 点击设置进入到设置界面
	 */
	Model.prototype.setClick = function(event) {
		var me = this;
		var params = {
			reloadParent : function() {
				me.closelogin();
			}
		}
		// var url = '$UI/dlmm/page/personal/setting.w';
		var url = '$UI/dlmm/page/personal/safety.w';
		justep.Shell.showPage(url, params);
	};

	Model.prototype.helpClick = function(event) {
		var url = '$UI/dlmm/page/personal/help.w';
		justep.Shell.showPage(url);
	};

	Model.prototype.aboutClick = function(event) {
		var url = '$UI/dlmm/page/personal/about.w';
		justep.Shell.showPage(url);
	};
	
	Model.prototype.toActivity = function(event){
		var url ='$UI/dlmm/page/personal/activity_main.w';
		justep.Shell.showPage(url);
	};
	

	return Model;
});