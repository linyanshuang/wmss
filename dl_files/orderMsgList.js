define(function(require){
	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");
	var dlm = require("$UI/dlmm/js/dlm");

	var Model = function(){
		this.callParent();
	};
	
	var iscrollObj;//列表拖动对象
	var totalPage = 0;//总页数
	var totalCount = 0;//总条数
	var currentNo = 0;
	
	// 页面加载
	Model.prototype.modelLoad = function(event){
		var me = this;
		var pulldownAction = function(){
		// 刷新数据
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
	    };
		iscrollObj = iscrollAssist.newVerScrollForPull($(me.getElementByXid("wrapper")),pulldownAction,pullupAction);
	};
	
	var userinfo = localStorage.userinfo ? JSON.parse(localStorage.userinfo) : null;
	
	//加载列表
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
			"action":"/getNotreadChatListNew.action",
			"params":{
				"pageSize":dlm.pageSize,
				"currentNo":currentNo
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
					if(json.data.length > 0){
						for(var i = 0;i<json.data.length;i++){
							json.data[i].ordertitle = json.data[i].lastChat.ordertitle;
							json.data[i].touaddr = json.data[i].lastChat.touaddr;
							json.data[i].content = json.data[i].lastChat.nickname + ":" + json.data[i].lastChat.content;
						}
						me.comp("data1").loadData(json.data, currentNo != 0);
					}
				}
				//如果列表没有数据，隐藏下拉刷新，显示无更多数据
				if(me.comp("data1").count() == 0){
					$(me.getElementByXid("pulldown")).hide();
					$(me.getElementByXid("listEnd")).html("暂无订单消息");
					$(me.getElementByXid("listEnd")).show();
				}else{
					$(me.getElementByXid("pulldown")).show();
				}
				//隐藏加载中效果
				$(me.getElementByXid("pullup")).hide();
				 
				//延迟刷新
				setTimeout(function(){
					$(me.getElementByXid("wrapper")).hide();
					if(currentNo == 0){
						if(iscrollObj){
							iscrollObj.scrollTo(0, 0);
						}
					}
					iscrollObj.refresh();
					$(me.getElementByXid("wrapper")).show();
				},300);
				
			}
		});
	};

	//列表数据刷新
	Model.prototype.data1CustomRefresh = function(event){
		//刷新
		currentNo = 0;
		this.getList();
	};
	
	Model.prototype.data1Create = function(event){
		event.source.limit = 2;
	};
	
	//返回
	Model.prototype.back=function(event){
		totalPage = 0;//总页数
		totalCount = 0;//总条数
		currentNo = 0;
		this.params.reloadParent();
		this.close();
	};
	
	Model.prototype.orderChat=function(event){
		$(event.delegateTarget).hide();
		var row = event.bindingContext.$object;
		var orderid = row.val("orderid");
		justep.Shell.showPage("$UI/dlmm/page/orderManage/orderChat.w",{"orderid":orderid});
	};
	
	Model.prototype.noticeClick = function(event){
		$(this.getElementByXid("notice")).find("dd > h2 > em").remove();
		dlm.goPage("noticeList");
	};
	
	Model.prototype.activityClick = function(event){
		$(this.getElementByXid("activity")).find("dd > h2 > em").remove();
		dlm.goPage("noticeactivityList");
	};
	
	return Model;
});