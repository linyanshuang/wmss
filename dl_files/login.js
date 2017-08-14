define(function(require) {

	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");
	var dlm = require("$UI/dlmm/js/dlm");
	require("$UI/system/lib/cordova/cordova");
	require("cordova!cordova-plugin-device");
	var windowDialog = require('$UI/system/components/justep/windowDialog/windowDialog');
	var MD5 = require('$UI/system/lib/base/md5');
	var Model = function() {
		this.callParent();

	};

	// 图片路径转换
	Model.prototype.toUrl = function(url) {
		return url ? require.toUrl(url) : "";
	};

	/**
	 * 登录
	 */
	Model.prototype.loginBtnClick = function(event) {

		var me = this;
		md5 = new MD5();
		var username = this.getElementByXid("nameInput").value;
		var password = this.getElementByXid("passwordInput").value;
		if (!username) {
			Alert("请输入用户名");
			return false;
		}
		if (!password) {
			Alert("请输入密码");
			return false;
		}
		if (username.length > 50) {
			Alert("用户名过长");
			return false;
		}
		if (password.length < 6 || password.length > 20) {
			Alert("密码长度错误");
			return false;
		}
		/**
		 * 登录验证（手机验证或者密保验证）
		 */
		dlm.sendRequest({
			"action" : "/getLoginCheck.action",
			"params" : {
				"username" : username
			},
			"success" : function(json) {
				console.log(json.data);
				var userid = json.data.userid;
				var phone = json.data.phone;
				if (json.result == 1) {
					// 用户名密码校验
					if (json.data.logincheck == 1) {// 手机验证
						var url = '$UI/dlmm/page/login/phoneverification.w';
						var params = {
							"phone" : phone,
							"userid" : userid,
							"username" : username,
							"password" : md5.hex_md5(md5.hex_md5(password) + "dlm"),
							refreshMain : function(){me.getParent().comp("mainContainer").refresh();justep.Shell.closeAllOpendedPages();}
						}
						justep.Shell.showPage(url, params);
					} else if (json.data.logincheck == 2) {// 密保验证
						var url = '$UI/dlmm/page/login/security_question_verification.w';
						var params = {
							"userid" : userid,
							"username" : username,
							"password" : md5.hex_md5(md5.hex_md5(password) + "dlm"),
							refreshMain : function(){me.getParent().comp("mainContainer").refresh();justep.Shell.closeAllOpendedPages();}
						}
						justep.Shell.showPage(url, params);
					} else {

						if (username && password) {
							// 登录用户名密码校验

							/*
							 * dlm.sendRequest({ "action" :
							 * "/loginCheck.action", "params" : { "username" :
							 * username, "password" : password, // "status" :
							 * "md5" "pcname" : device.model, "macaddress" :
							 * device.uuid }, "success" : function(json) {
							 * alert(JSON.stringify(json.data)); //
							 * localStorage.userinfo =
							 * JSON.stringify(json.data); if (json.result == 1) { }
							 * me.getParent().loginSuccess(); me.close(); } });
							 */

							dlm.sendRequest({
								"action" : "/login.action",
								"params" : {
									"username" : username,
									"password" : md5.hex_md5(md5.hex_md5(password) + "dlm"),
									"status" : "md5",
									"logintype" : "5",
									"pcname" : justep.Browser.isX5App ? device.model : null,
									"macaddress" : justep.Browser.isX5App ? device.uuid : null
								},
								"success" : function(json) {
									if (json.result == 1) {
										localStorage.userinfo = JSON.stringify(json.data);

										/*justep.Shell.showPage("main");
										me.getParent().loginSuccess();*/
										// me.close();
										me.getParent().comp("mainContainer").refresh();
										justep.Shell.closeAllOpendedPages();

									} else {
										var message = json.data;
										if(message.indexOf("封停")>-1){
											layer.open({
												content: '<div style="text-align:left;">'+message.replace(new RegExp('\n','gm'),'<br/>')+'</div>',
												shade:false,
												style: 'background-color:rgba(0,0,0,0.7);color:#fff;border:none;text-align:center;width:auto; margin:0 0.6rem;',
												time: 4
											});
										} else{
											Alert(message);
										}
									}
								}
							});
						} else if (!username) {
							Alert("请填写用户名");
						} else if (!password) {
							Alert("请填写密码");
						} else {
							Alert("用户名或者密码错误");

						}

					}
				}else if (json.result == 2) {
					Alert(json.data);
				}else if (json.result == 5) {
					Alert("请求参数错误");
				}
			}
		});

	};
	// 用户名输入框获取焦点时，去掉错误提示框中的文字提示
	/*
	 * Model.prototype.nameInputFocus = function(event) {
	 * $("#username_error").html(""); };
	 */
	// 密码框获取焦点时，去掉错误提示框中的文字提示
	/*
	 * Model.prototype.passwordInputFocus = function(event) {
	 * $("#password_error").html(""); };
	 */
	/**
	 * 页面跳转->去找回密码页面
	 * 点击忘记密码---->跳转到找回密码页面---->输入手机号---->输入验证码---->跳转到设置密码页面---->数据新的密码完成密码更新
	 */
	Model.prototype.forgetPassword = function(event) {
		var me = this;
		var url = '$UI/dlmm/page/login/toGetBackPassword.w';
		justep.Shell.showPage(url);
	};
	Model.prototype.a1Click = function(event) {
		var me = this;
		this.getParent().comp("mainContainer").refresh();
		justep.Shell.closeAllOpendedPages();
	};
	Model.prototype.modelLoad = function(event) {
		// 循环验证非空 并且点亮登录按钮
		var must_num = $(".must-input").length;
		$(".must-input").on('input', function() {
			$(".must-input").each(function(index) {
				var _len = $(this).val().length;
				if (_len < 1) {
					$(".reg-btn").find("a").removeClass("on").addClass("off");
					return false;
				} else if ($(this).parent("li").hasClass("password-li")) {
					if (_len < 6) {
						$(".reg-btn").find("a").removeClass("on").addClass("off");
						return false;
					}
				}
				;
				if (index == must_num - 1) {
					$(".reg-btn").find("a").removeClass("off").addClass("on");
				}
			});
		});
		Zepto(".empty").tap(function() {
			$(".reg-btn").find("a").removeClass("on").addClass("off");
		});

	};
	/**
	 * 点击登录页的注册按钮跳转到注册页面
	 */
	Model.prototype.registerBtnClick = function(event) {
		var url = '$UI/dlmm/page/register/register.w';
		justep.Shell.showPage(url);
		/*
		 * var dialog = this.comp('registerDialog'); var url =
		 * require.toUrl(url); dialog.open({ src : url, params : { } })
		 */
	};

	/*
	 * Model.prototype.registerDialogClose = function(event) { if (1 == 1) {
	 * justep.Shell.closePage(); } else { } };
	 */
	Model.prototype.loginSuccess = function(event) {
		var url = require.toUrl("./main.w");
		justep.Shell.loadPage({
			"url" : url
		});
		this.comp("mainContainer").setSrc(url);
		this.comp("mainContainer").refresh();
	};
	return Model;
});