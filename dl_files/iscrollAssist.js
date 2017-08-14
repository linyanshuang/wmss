/*** 滚动辅助模块  ***/
;(function($,window){
	
	//模块对外提供的公共方法
	var exportsMethods = {
	
		/**
		 * 新建一个竖直滚动实例,并做一些处理,整合上拉下拉的功能
		 * wrapper        要渲染滚动实例的位置
		 * pulldownAction 下拉执行的逻辑
		 * pullupAction   上拉执行的逻辑
		 * opts           滚动个性化参数 
		 * pullText       拉动时不同状态要显示的文字
		 */
		newVerScrollForPull : function(wrapper,pulldownAction,pullupAction,opts,pullText){
			
			var $wrapper ;
			if(typeof wrapper === 'string'){
				$wrapper = $(wrapper);
			}else if(typeof wrapper === 'object'){
				$wrapper = wrapper;
			}
			var pulldownRefresh   = pullText && pullText['pulldownRefresh'] ? pullText['pulldownRefresh'] : '下拉刷新...',
				pullupLoadingMore = pullText && pullText['pullupLoadingMore'] ? pullText['pullupLoadingMore'] : '上拉加载更多...',
				releaseToRefresh  = pullText && pullText['releaseToRefresh'] ? pullText['releaseToRefresh'] : '松手开始刷新...',
				releaseToLoading  = pullText && pullText['releaseToLoading'] ? pullText['releaseToLoading'] : '松手开始加载...',
				loading 		  = pullText && pullText['loading'] ? pullText['loading'] : '加载中...';
			
			var $pulldown = $wrapper.parent().find('[xid="pulldown"]'),
				$pullup   = $wrapper.find('[xid="pullup"]'),
				$pulldown_label = $pulldown.find(".pulldown-label"),
				$pullup_label = $pullup.find("#pullup-label"),
				pullupOffset   = 0,
				pulldownOffset = 0;
			if($pulldown.length>0){
				pulldownOffset = $pulldown.height();
				$pulldown_label.html(pulldownRefresh);
			}
			
			if($pullup.length>0){
				pullupOffset = $pullup.height();
				$pullup_label.html(pullupLoadingMore);
			}
			
			//这个属性很重要,目前V5版本不支持,需修改源码
			var options = {
				topOffset : pulldownOffset,
				probeType: 3,
				preventDefault: false
			};
			
			$.extend(true,options,opts);
			
			var scrollObj = this.newVerScroll($wrapper[0],options);
			
			//滚动刷新触发的事件
			scrollObj.on('refresh',function(){
				if ($pulldown.length>0 && $pulldown.hasClass('loading')) {
					$pulldown.removeClass('loading').removeClass('flip');
					$pulldown_label.html(pulldownRefresh);
				}
				
			});
			
			//滚动的时候触发的事件
			scrollObj.on('scrollMove',function(){
				if ($pulldown.length>0 && this.y >= 56 && !$pulldown.hasClass('flip') && !$pulldown.hasClass('loading')) {
					$pulldown.removeClass('loading').removeClass('flip').addClass('flip');
					$pulldown_label.html(releaseToRefresh);
					this.minScrollY = 56;
				}
			});
			
			//滚动结束之后触发的事件
			var sobj = $wrapper.get(0);
			sobj.addEventListener("touchend",function(){
				setTimeout(function(){
					if ($pulldown.length>0 && $pulldown.hasClass('flip')) {
						$pulldown.removeClass('loading').removeClass('flip').addClass('loading');
						$pulldown_label.html(loading);
						$pullup.hide();
						if(typeof pulldownAction === 'function'){
							pulldownAction.call(scrollObj);
						};
					}else if (scrollObj.y <= scrollObj.maxScrollY && !$pulldown.hasClass('loading')){
						if(typeof pullupAction === 'function'){
							pullupAction.call(scrollObj);
						};
				    }
				},0);
		    }, false);
			
			//滚动结束之后触发的事件
			/*scrollObj.on('scrollEnd',function(){
				if ($pulldown.length>0 && $pulldown.hasClass('flip')) {
					$pulldown.removeClass().addClass('loading');
					$pulldown_label.html(loading);
					if(typeof pulldownAction === 'function'){
						pulldownAction.call(scrollObj);	
					};
				}
			});*/
			
			//sobj.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			sobj.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			return scrollObj;
		},
		newVerScroll : function(dom,option){
			var opt = {
				scrollbars : false //是否有滚动条
			};
			if(option){
				$.extend(opt,option);
			}
			var iSObj = new IScroll(dom,opt);
			
			//滚动条在滚动时显示出来,滚动结束隐藏
			//V5以前版本有个参数可以设置,V5之后目前只能手动处理滚动条的显示隐藏或者可从外部传个参数进来判断
			iSObj.on("scrollEnd",function(){
				if(this.indicator1){
					this.indicator1.indicatorStyle['transition-duration'] = '350ms';
					this.indicator1.indicatorStyle['opacity'] = '0';
				}
			});
			iSObj.on("scrollMove",function(){
				if(this.indicator1){
					this.indicator1.indicatorStyle['transition-duration'] = '0ms';
					this.indicator1.indicatorStyle['opacity'] = '0.8';
				}
			});
			return iSObj;
		}
	};
	
	window.iscrollAssist = exportsMethods;
	
})(Zepto,window);