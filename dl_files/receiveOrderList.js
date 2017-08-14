define(function(require){
	var justep = require("$UI/system/lib/justep");
	var dlm = require("$UI/dlmm/js/dlm");
	var gameinfolist = require("$UI/dlmm/js/gameinfo_app");
	//var gameinfolist = require("$UI/dlmm/js/gameinfo_app_ios");//ios提交审核版本一定要修改成这个

	var Model = function(){
		this.callParent();
	};
	
	localStorage.setItem("isFirst", 0);
	
	var iscrollObj;//列表拖动对象
	var totalPage = 0;//总页数
	var totalCount = 0;//总条数
	var gameindex = -1;//选择区服时的游戏的index
	var areaindex = -1;//选择区服时的区的index
	
	var currentNo = 0;
	var gamename = localStorage.gamename_defa ? localStorage.gamename_defa : "王者荣耀";
	//var gamename = "英雄联盟";//ios提交审核版本一定要修改成这个
	var areaname = "";
	var servername = "";
	var orderorgin = 0;
	var target = "";
	var minPrice = "";
	var maxPrice = "";
	var keyword = "";
	var sort = "";
	var isqiangdan = "";
	var beginGrade = "";
	var endGrade = "";
	
	//初始化查询参数
	Model.prototype.initParam = function(){
		totalPage = 0;
		totalCount = 0;
		gameindex = -1;
		areaindex = -1;
		currentNo = 0;
		gamename = localStorage.gamename_defa ? localStorage.gamename_defa : "王者荣耀";
		//gamename = "英雄联盟";//ios提交审核版本一定要修改成这个
		areaname = "";
		servername = "";
		orderorgin = 0;
		target = "";
		minPrice = "";
		maxPrice = "";
		keyword = "";
		sort = "";
		isqiangdan = "";
		endGrade = "";
	};
	
	Model.prototype.getList = function(){
		var me = this;
		//隐藏已无更多
		$(me.getElementByXid("listEnd")).hide();
		//显示加载中
		if(me.comp("data1").count() == 0){
			$(me.getElementByXid("pullup")).show();
			$(me.getElementByXid("pulldown")).hide();
		}
		dlm.sendRequest({
			"action":"/receiveOrderList.action",
			"params":{
				"pageSize":dlm.pageSize,
				"currentNo":currentNo,
				"gamename":gamename,
				"areaname":areaname,
				"servername":servername,
				"orderorgin":orderorgin,
				"target":target,
				"minPrice":minPrice,
				"maxPrice":maxPrice,
				"keyword":keyword,
				"isqiangdan":isqiangdan,
				"sort":sort,
				"beginGrade":beginGrade,
				"endGrade":endGrade
			},
			"async":true,
			"success":function(json){
				if(currentNo == 0){
					me.comp("data1").clear();
				}
				if(json && json.result == "1" && json.data){
					totalCount = json.count;
					$(me.getElementByXid("totalCount")).html("共有"+totalCount+"条数据");
					totalPage = parseInt(totalCount / dlm.pageSize);
					if(json.data && json.data.length > 0){
						me.comp("data1").loadData(json.data, currentNo != 0);
					}
				}
				//如果列表没有数据，隐藏下拉刷新，显示无更多数据
				if(me.comp("data1").count() == 0){
					$(me.getElementByXid("pulldown")).hide();
					$(me.getElementByXid("listEnd")).html("无数据");
					$(me.getElementByXid("listEnd")).show();
				}else{
					$(me.getElementByXid("pulldown")).show();
				}
				//隐藏加载中效果
				$(me.getElementByXid("pullup")).hide();
				//延迟刷新
				if(currentNo == 0){
					setTimeout(function(){
						if(iscrollObj){
							iscrollObj.refresh();
							iscrollObj.scrollTo(0, 0, 100, IScroll.utils.ease.circular);
						}
					},300);
				}else{
					if(iscrollObj){
						iscrollObj.refresh();
					}
				}
			}
		});
	};

	Model.prototype.modelLoad = function(event){
		this.initParam();
		var me = this;
		var userinfo = localStorage.userinfo ? JSON.parse(localStorage.userinfo) : null;
		currentNo = 0;
		
		//判断是否有抢单区权限
		if(localStorage.getItem("isGrab") && localStorage.getItem("isGrab") == 1){
			isqiangdan=1;
			$(me.getElementByXid("replaceArea")).addClass("on");
			$(me.getElementByXid("biaozhun")).removeClass("on");
			//查询数据
			me.getList();
		}else{
			dlm.sendRequest({
				"action":"/getUserInfo.action",
				"params":{
				},
				"async":true,
				"success":function(json){
					if(json.data !=null&&json.data!=""){
						localStorage.setItem("isGrab", json.data.isGrab);
					}else{
						localStorage.setItem("isGrab",0);
					}
					if(gamename=="王者荣耀"&&localStorage.getItem("isGrab")==1){
						isqiangdan=1;
						$(me.getElementByXid("replaceArea")).addClass("on");
						$(me.getElementByXid("biaozhun")).removeClass("on")
					}else{
						$(me.getElementByXid("replaceArea")).removeClass("on");
						$(me.getElementByXid("biaozhun")).addClass("on")
					}
					//查询数据
					me.getList();
				}
			});
		}
		
		//上滑
		var pulldownAction = function(){
			//刷新数据
			currentNo = 0;
//			me.comp("data1").refreshData({"confirm":false});
			me.getList();
		};
		//下滑
		var pullupAction = function(){
	        currentNo += 1;
	        if(currentNo > totalPage){
	        	$(me.getElementByXid("pullup")).hide();
	        	$(me.getElementByXid("listEnd")).html("没有更多数据了");
	            $(me.getElementByXid("listEnd")).show();
	            iscrollObj.refresh();
	        }else{
				//下一页数据加载，显示加载中效果
				$(me.getElementByXid("pullup")).show();
	            me.getList();
	        }
	    }
		iscrollObj = iscrollAssist.newVerScrollForPull($(me.getElementByXid("wrapper")),pulldownAction,pullupAction);
		me.loadGame();
		
		//自动关闭
		setTimeout(function () {
		    me.closeTips();
		}, 10000);
		
		//游戏订单数量
//		setTimeout(function () {
//			me.gameCount();
//		},1000);
	};
	
	Model.prototype.gameCount = function(event){
		var me = this;
		dlm.sendRequest({
			"action":"/getGameOrderCount.action",
			"async":true,
			"success":function(json){
				if(json && json.result == 1 && json.data.list){
					var list = json.data.list;
					for(var i = 0; i < list.length; i++){
						var gname = list[i].gamename;
						var count = list[i].count;
						$(me.getElementByXid("list1")).find("li").each(function(){
							var tempname = gameinfolist.list[$(this).index()].name;
							if(tempname == gname){
								if($(this).find("em").size() == 0){
									$(this).append("<em>"+count+"</em>");
								}else{
									$(this).find("em").html(count);
								}
							}
						});
					}
				}
			}
		});
	};
	
	// 关闭提示
	Model.prototype.closeTips = function(event){
		$(".jd-tips").hide();
	}
	
	//订单区域选择
	Model.prototype.orginClick = function(event){
		var dom_obj = event.delegateTarget;
		var orname = $(dom_obj).text();
		var flag = $(dom_obj).index();
		$(dom_obj).addClass("on").siblings("li").removeClass("on");
		if(orname.trim() =="抢单"){
			isqiangdan = "1";
			orderorgin = 0;
		}else{
			if(flag == 0){
				isqiangdan = "0";
				orderorgin = 2;
			}else if(flag == 1){
				isqiangdan = "0";
				orderorgin = 0;
			}else if(flag == 2){
				isqiangdan = "0";
				orderorgin = 1;
			}
		}
		
//		if(flag == 0){
//			orderorgin = 0;
//		}else if(flag == 1){
//			orderorgin = 1;
//		}
//		this.comp("data1").refreshData({"confirm":false});
		currentNo = 0;
		this.getList();
	};
	
	//高级清空
	Model.prototype.gjqkClick = function(event){
		$($(this.getElementsByXid("hide-item")[2])).find(".gj-box-item").each(function(index){
			$(this).find("li").removeClass("on");
			$(this).find("li").eq(0).addClass("on");
		});
	};
	
	//高级确认
	Model.prototype.gjqrClick = function(event){
		var dom_obj = event.delegateTarget;
		var flag = 0;
		$($(this.getElementsByXid("hide-item")[2])).find(".gj-box-item").each(function(index){
			var item_i = $(this).index();
			var on_i = $(this).find(".on").index();
			if(on_i == 0){
				flag = flag+1;
			}
			if(item_i == 0){
				//价格筛选
				if(on_i == 1){
					minPrice = "1";
					maxPrice = "100";
				}else if(on_i == 2){
					minPrice = "101";
					maxPrice = "300";
				}else if(on_i == 3){
					minPrice = "301";
					maxPrice = "500";
				}else if(on_i == 4){
					minPrice = "501";
					maxPrice = "";
				}else{
					minPrice = "";
					maxPrice = "";
				}
			}else if(item_i == 1){
				//起始段位
				//其他游戏不用段位查询
				if("王者荣耀" != gamename && "英雄联盟" != gamename){
					beginGrade = "";
				}else if(on_i == 1){
					if("王者荣耀" == gamename){
						beginGrade = "青铜";
					}else if("英雄联盟" == gamename){
						beginGrade = "黄铜";
					}
				}else if(on_i == 2){
					beginGrade = "白银";
				}else if(on_i == 3){
					beginGrade = "黄金";
				}else if(on_i == 4){
					beginGrade = "铂金";
				}else if(on_i == 5){
					beginGrade = "钻石";
				}else if(on_i == 6){
					beginGrade = "大师";
				}else if(on_i == 7){
					beginGrade = "最强王者";
				}else{
					beginGrade = "";
				}
			}else if(item_i == 2){
				//目标段位
				//其他游戏不用段位查询
				if("王者荣耀" != gamename && "英雄联盟" != gamename){
					endGrade = "";
				}else if(on_i == 1){
					if("王者荣耀" == gamename){
						endGrade = "青铜";
					}else if("英雄联盟" == gamename){
						endGrade = "黄铜";
					}
				}else if(on_i == 2){
					endGrade = "白银";
				}else if(on_i == 3){
					endGrade = "黄金";
				}else if(on_i == 4){
					endGrade = "铂金";
				}else if(on_i == 5){
					endGrade = "钻石";
				}else if(on_i == 6){
					endGrade = "大师";
				}else if(on_i == 7){
					endGrade = "最强王者";
				}else{
					endGrade = "";
				}
			}
		});
		if(flag == 2){
			$(this.getElementByXid("main-screen")).children("li").eq(2).removeClass("on").find("span").text("高级筛选");
			$(this.getElementsByXid("hide-item")[2]).hide();
			$(this.getElementByXid("gray-bg")).hide();
		}else{
			$(this.getElementByXid("main-screen")).children("li").eq(2).removeClass("on").find("span").text("已选择");
			$(this.getElementsByXid("hide-item")[2]).hide();
			$(this.getElementByXid("gray-bg")).hide();
		}
		currentNo = 0;
		//刷新数据
		this.getList();
	};
	
	//高级筛选
	Model.prototype.gjsxClick = function(event){
		var dom_obj = event.delegateTarget;
		$(dom_obj).addClass("on").siblings("li").removeClass("on");
	};
	
	//综合排序点击
	Model.prototype.zhpxClick = function(event){
		var dom_obj = event.delegateTarget;
		$(dom_obj).addClass("on").siblings("li").removeClass("on");
		var _val = $(dom_obj).text();
		$(this.getElementByXid("main-screen")).children("li").eq(1).removeClass("on").find("span").text(_val);
		$(this.getElementsByXid("hide-item")[1]).hide();
		$(this.getElementByXid("gray-bg")).hide();
		
		sort = $(dom_obj).attr("value");
		//刷新数据
		currentNo = 0;
//		this.comp("data1").refreshData({"confirm":false});
		this.getList();
	};
	
	//筛选排序区域
	Model.prototype.screenClick = function(event){
		var dom_obj = event.delegateTarget;
		if($(dom_obj).hasClass("on") == false){
			$(dom_obj).addClass("on").siblings().removeClass("on");
			var flag = $(dom_obj).index();
			//如果是高级筛选，根据游戏改变筛选内容
			if(flag == 2){
				var gjsx_ds = $(this.getElementsByXid("hide-item")[flag]).find(".gjsx_ds");
				if("王者荣耀" == gamename){
					if(gjsx_ds.is(".on")){
						gjsx_ds.removeClass("on");
						gjsx_ds.each(function(){
							$(this).parent().find("li").eq(0).addClass("on");
						});
					}
					gjsx_ds.hide();
				}else if("英雄联盟" == gamename){
					gjsx_ds.show();
				}
			}else if(flag == 0){
				//如果是游戏区服，更新游戏下的订单数字
				this.gameCount();
			}
			$(this.getElementsByXid("hide-item")[flag]).show().siblings(".hide-item").hide();
			$(this.getElementByXid("gray-bg")).show();
		}else{
			$(dom_obj).removeClass("on");
			$(this.getElementsByXid("hide-item")[0]).hide();
			$(this.getElementsByXid("hide-item")[1]).hide();
			$(this.getElementsByXid("hide-item")[2]).hide();
			$(this.getElementByXid("gray-bg")).hide();
		}
	};
	
	//接单
	Model.prototype.receiveOrder = function(event){
		var row = event.bindingContext.$object;
		var orderid = row.val("orderid");
		var me = this;
		//获得订单的信息
		dlm.sendRequest({
			"action":"/receiveOrderInfo.action",
			"params":{
				"orderid":orderid
			},
			"success":function(json2){
				if(json2 && json2.result == "1" && json2.data && json2.data.info.orderstatus == "1"){
					dlm.goPage("receiveOrder",{"orderinfo":json2.data});
				}else if(json2 && (json2.result == "3" || json2.result == "4")){
					Alert("请先登录");
					dlm.goPage("login",{});
				}else{
					//不能接单提示
					Alert("该订单已被接或下架，尝试其他订单或下拉刷新新订单吧~");
				}
			}
		});
		
	};
	
	//列表数据刷新
	Model.prototype.data1CustomRefresh = function(event){
//		//刷新
//		currentNo = 0;
//				dlm.sendRequest({
//					"action":"/getUserInfo.action",
//					"params":{
//					},
//					"async":true,
//					"success":function(json){
//						Alert(json.data.isGrab);
//						if(json.data !=null&&json.data!=""){
//							localStorage.setItem("isGrab", json.data.isGrab);
//						}else{
//							localStorage.setItem("isGrab",0);
//						}
//						if(gamename=="王者荣耀"&&localStorage.getItem("isGrab")==1){
//							isqiangdan=1;
//						}	
//						
//					}
//				});
//			this.getList();
			
		
	};
	
	//跳转搜索页
	Model.prototype.toSearch = function(event){
		var me = this;
		dlm.goPage("searchOrder",{
			"search":function(resultmsg){
				keyword = resultmsg;
				if(keyword){
					$(me.getElementByXid("searchText")).val(keyword);
					$(me.getElementByXid("fixed-header")).hide();
					$(me.getElementByXid("search-header")).show();
				}else{
					$(me.getElementByXid("search-header")).hide();
					$(me.getElementByXid("fixed-header")).show();
				}
				//刷新数据
//				me.comp("data1").refreshData({"confirm":false});
				currentNo = 0;
				me.getList();
			},
			"keyword":keyword,
			"placeholder":"订单号/区服/发布人/标题"
		});
	};
	
	//加载游戏区服
	Model.prototype.loadGame = function(){
		//加载游戏数据
		this.comp("gamename").loadData(gameinfolist.list);
		//选择默认游戏
		for(var i = 0 ; i < gameinfolist.list.length; i++){
			var name = gameinfolist.list[i].name;
			if(gamename == name){
				$(this.getElementByXid("list1")).find("li").eq(i).click();
				$(this.getElementByXid("main-screen")).children("li").eq(0).removeClass("on").find("span").text(gamename);
				break;
			}
		}
		
	};
	
	//加载区
	Model.prototype.loadAreaname = function(){
		//先清空区列表
		this.comp("areaname").clear();
		//加载区数据
		this.comp("areaname").loadData(gameinfolist.list[gameindex].list);
		//清空服务器
		this.comp("servername").clear();
	};
	
	//加载服务器
	Model.prototype.loadServername = function(){
		//先清空区列表
		this.comp("servername").clear();
		//加载服务器数据
		this.comp("servername").loadData(gameinfolist.list[gameindex].list[areaindex].list);
	};
	
	//点击游戏
	Model.prototype.gameClick = function(obj){
		//判断是否切换了，没切换则不用更新数据
		var dom_obj = obj.delegateTarget;
		var gamename = gameinfolist.list[$(dom_obj).index()].name;
		if(gamename.trim() =="王者荣耀"){
			$(this.getElementByXid("replaceArea")).html("抢单");
			if(localStorage.getItem("isGrab")==1){
				$(this.getElementByXid("replaceArea")).addClass("on");
				$(this.getElementByXid("biaozhun")).removeClass("on")
				this.getList();
			}
		}else{
			$(this.getElementByXid("replaceArea")).html("优质");
		}
		var index = $(dom_obj).index();
		if(gameindex != index){
			//样式切换
			$(dom_obj).addClass("on").siblings().removeClass("on");
			//更新游戏的index
			gameindex = index;
			areaindex = -1;
			//刷新区数据
			this.loadAreaname();
		}
	};
	
	//点击区
	Model.prototype.areaClick = function(obj){
		//判断是否切换了，没切换则不用更新数据
		var dom_obj = obj.delegateTarget;
		var index = $(dom_obj).index();
		if(areaindex != index){
			//更新区的index
			$(dom_obj).addClass("on").siblings().removeClass("on");
			//更新区的index
			areaindex = index;
			//刷新服务器数据
			this.loadServername();
		}
	};
	
	//点击服务器
	Model.prototype.serverClick = function(obj){
		var index = $(obj.delegateTarget).index();
		$(obj.delegateTarget).addClass("on").siblings().removeClass("on");
		gamename = gameinfolist.list[gameindex].name;
		if(areaindex > -1){
			areaname = gameinfolist.list[gameindex].list[areaindex].name;
			servername = gameinfolist.list[gameindex].list[areaindex].list[index].name;
		}
		currentNo = 0;
//		this.comp("data1").refreshData({"confirm":false});
		this.getList();
		$(this.getElementByXid("main-screen")).children("li").eq(0).removeClass("on").find("span").text(gamename);
		$(this.getElementsByXid("hide-item")[0]).hide();
		$(this.getElementByXid("gray-bg")).hide();
		localStorage.gamename_defa = gamename;
	};
	
	//点击返回顶部
	Model.prototype.topClick = function(event){
		iscrollObj.scrollTo(0, 0, 500, IScroll.utils.ease.circular);
	};
	
	//取消点击
	Model.prototype.cancelClick = function(event){
		var me = this;
		keyword = "";
		$(me.getElementByXid("search-header")).hide();
		$(me.getElementByXid("fixed-header")).show();
		//刷新数据
		currentNo = 0;
//		me.comp("data1").refreshData({"confirm":false});
		me.getList();
	};
	
	Model.prototype.div1Keyup = function(event){
		var me = this;
		var obj = event.originalEvent;
		if (obj.keyCode == "13") {
        	var msg = $(me.getElementByXid("searchText")).val().replace(/(^\s*)|(\s*$)/g,'');
        	if(msg != ""){
	        	me.addKeyword(msg);
        	}
        	keyword = msg;
			if(keyword){
				$(me.getElementByXid("searchText")).val(keyword);
				$(me.getElementByXid("fixed-header")).hide();
				$(me.getElementByXid("search-header")).show();
			}else{
				$(me.getElementByXid("search-header")).hide();
				$(me.getElementByXid("fixed-header")).show();
			}
			$(me.getElementByXid("searchText")).blur();
			//刷新数据
			currentNo = 0;
//			me.comp("data1").refreshData({"confirm":false});
			me.getList();
        }
	};
	
	//新增值到本地缓存
	Model.prototype.addKeyword = function(msg){
		//缓存中的历史记录
		var searchList = localStorage.searchList ? JSON.parse(localStorage.searchList) : null;
		if(!searchList){
    		searchList = [];
    	}else{
    		for(var i = 0 ; i < searchList.length ; i++){
    			var key = searchList[i].keyword;
    			if(key == msg){
    				searchList.splice(i,1);
    				break;
    			}
    		}
    		if(searchList.length >= 5){
    			searchList.shift();
    		}
    	}
    	searchList.push({"keyword":msg});
    	localStorage.searchList = JSON.stringify(searchList);
	};
	
	Model.prototype.noticeClick = function(event){
		var noticeid = $(this.getElementByXid("noticeid")).val();
		var linkurl = $(this.getElementByXid("linkurl")).val();
		var currtime = new Date().getTime();
		localStorage.setItem("notice_send", noticeid);
		localStorage.setItem("notice_send_time", currtime);
		$(this.getElementByXid("noticeMsg")).hide();
		if(linkurl){
			dlm.sendRequest({
				"action":"/appNoticeInfo.action",
				"params":{
					"noticeid":noticeid
				},
				"success":function(json){
					dlm.goPage("openUrl",{"linkurl":linkurl});
				}
			});
		}else{
			dlm.goPage("noticeInfo",{"noticeid":noticeid});
		}
	};
	
	Model.prototype.noticeCloseClick = function(event){
		var noticeid = $(this.getElementByXid("noticeid")).val();
		var currtime = new Date().getTime();
		localStorage.setItem("notice_send", noticeid);
		localStorage.setItem("notice_send_time", currtime);
		$(this.getElementByXid("noticeMsg")).hide();
	};
	
	Model.prototype.modelActive = function(event){
	};
	
	Model.prototype.modelInactive = function(event){
	};
	
	return Model;
});