define(function(require){
	var dlm = require("$UI/dlmm/js/dlm");
	var gameinfolist = require("$UI/dlmm/js/gameinfo_app");
	//var gameinfolist = require("$UI/dlmm/js/gameinfo_app_ios");////ios提交审核版本一定要修改成这个
	
	var Model = function(){
		this.callParent();
		this.keyword = "";
	};
	
	var iscrollObj;//列表拖动对象
	var totalPage = 0;//总页数
	var totalCount = 0;//总条数
	var gameindex = -1;//选择区服时的游戏的index
	var areaindex = -1;//选择区服时的区的index
	
	var currentNo = 0;
	var gamename = "";
	var areaname = "";
	var servername = "";
	var minPrice = "";
	var maxPrice = "";
	var beginTime = "";
	var endTime = "";
	var orderstatus = "";
	var sort = "";
	
	
	Model.prototype.toEdit = function(event){
		var row = event.bindingContext.$object;
		var orderid = row.val("orderid");
		dlm.goPage("publish_sec",{"orderid":orderid});
	};
	
	Model.prototype.deleteorder =function(event){
		var me = this;
		var row = event.bindingContext.$object;
		var orderid = row.val("orderid");
		Confirm("您确定要删除此订单吗？",true,a);
			function a(){
				dlm.sendRequest({
					"action":"/deleteOrder.action",
					"params":{
						"orderid":orderid
					},
					"async":true,
					"success":function(json){
						if(json && json.result == "1" && json.data){
							Alert("删除成功");
							me.comp("data1").refreshData({"confirm":false});
						}else{
							Alert(json.data);
						}
					}
				});
			}
			
	};
	
	Model.prototype.toDown =function(event){
		var me = this;
		var row = event.bindingContext.$object;
		var orderid = row.val("orderid");
			Confirm("您确定要下架此订单吗？",true,a);
			function a(){
				dlm.sendRequest({
						"action":"/closeOrder.action",
						"params":{
							"orderid":orderid
						},
						"async":true,
						"success":function(json){
							if(json && json.result == "1" && json.data){
								Alert("下架成功");
								me.comp("data1").refreshData({"confirm":false});
							}else{
								Alert(json.data);
							}
						}
				});
			}
	};
	
	
	
	Model.prototype.initParam = function(){
		currentNo = 0;
		gamename = "";
		areaname = "";
		servername = "";
		minPrice = "";
		maxPrice = "";
		beginTime = "";
		endTime = "";
		iscrollObj = null;
		totalPage = 0;
		totalCount = 0;
		gameindex = -1;
		areaindex = -1;
		orderstatus = "";
		sort = "";
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
			"action":"/releaseOrderManageList.action",
			"params":{
				"pageSize":dlm.pageSize,
				"currentNo":currentNo,
				"gamename":gamename,
				"areaname":areaname,
				"servername":servername,
				"minPrice":minPrice,
				"maxPrice":maxPrice,
				"beginTime":beginTime,
				"endTime":endTime,
				"keyword":me.keyword,
				"orderstatus":orderstatus,
				"sort":sort
			},
			"async":true,
			"trust":true,
			"success":function(json){
				if(currentNo == 0){
					me.comp("data1").clear();
				}
				if(json && json.result == "1" && json.data){
					totalCount = json.count;
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
		
		var pulldownAction = function(){
			//刷新数据
			me.comp("data1").refreshData({"confirm":false});
		};
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
				//目标段位
//				if(on_i == 1){
//					target = "黄铜";
//				}else if(on_i == 2){
//					target = "白银";
//				}else if(on_i == 3){
//					target = "黄金";
//				}else if(on_i == 4){
//					target = "铂金";
//				}else if(on_i == 5){
//					target = "钻石";
//				}else if(on_i == 6){
//					target = "大师";
//				}else{
//					target = "";
//				}
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
		//刷新数据
		this.comp("data1").refreshData();
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
		this.comp("data1").refreshData({"confirm":false});
	};
	
	//筛选排序区域
	Model.prototype.screenClick = function(event){
		var dom_obj = event.delegateTarget;
		if($(dom_obj).hasClass("on") == false){
			$(dom_obj).addClass("on").siblings().removeClass("on");
			var flag = $(dom_obj).index();
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
	
	//列表数据刷新
	Model.prototype.data1CustomRefresh = function(event){
		//刷新
		currentNo = 0;
		this.getList();
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
		this.comp("data1").refreshData({"confirm":false});
		$(this.getElementByXid("main-screen")).children("li").eq(0).removeClass("on").find("span").text(servername);
		$(this.getElementsByXid("hide-item")[0]).hide();
		$(this.getElementByXid("gray-bg")).hide();
		localStorage.gamename_defa = gamename;
	};
	
	//订单详情
	Model.prototype.orderClick = function(event){
		var row = event.bindingContext.$object;
		var orderid = row.val("orderid");
		dlm.goPage("orderInfo",{"orderid":orderid});
	};
	
	//点击了状态
	Model.prototype.statusClick = function(event){
		var dom_obj = event.delegateTarget;
		orderstatus = $(dom_obj).attr("value");
		this.comp("data1").refreshData();
		//样式变更
		$(dom_obj).addClass("on").siblings().removeClass("on");
	};
	
	return Model;
});