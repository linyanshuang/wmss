;(function($){
	$.dlm = $.dlm||{};
    $.dlm={
        inits:function(){
        	$(document).FastClick();
			$(".execute-input").Execute();
			$(".empty").Empty();
			$(".password-li").Pas();
			$(".gray-bg").CloseBg();
			$(this).scroll_top();
        },
        FastClick:function(){
        	FastClick.attach(document.body);
        },
		ComTab:function(){
			$(this).find("li").click(function(){
				$(this).addClass("on").siblings().removeClass("on");
				var flag = $(this).index();
				$(this).parent().parent().parent().find(".lp-tab-item").eq(flag).show().siblings().hide();
			});
		},
		SubTab:function(obj){
			$(this).find("li").click(function(){
				$(this).addClass("on").siblings().removeClass("on");
				var flag = $(this).index();
				$(obj).eq(flag).show().siblings(obj).hide();
			});
		},
		ComFiexd:function(obj){
			var _top = $(obj).offset().top;
        	$(window).bind("scroll", function(event){
               if( $(window).scrollTop() >= _top ) {
                    $(obj).addClass("fiexd");
                }else {
                	$(obj).removeClass("fiexd");
                }
            });
		},
		Loading:function(){
			layer.open({
				className: 'popuo-loading',
	            content: '<div class="load-container"><div class="loader"></div><p>正在加载中...</p><em class="iconfont">&#xe655;</em></div>',
	            time: 0
	        });
		},
		Execute:function(){
			$(this).on('input', function() { 
				if($(this).val() == ""){
					$(this).parent().find(".empty").css("display","none");
				}else{
					$(this).parent().find(".empty").css("display","block");
					
				} 
			});
			$(this).on('blur', function(){
				$(this).parent().find(".empty").css("display","none");
			});
			$(this).on('focus', function(){
				if($(this).val() == ""){
					$(this).parent().find(".empty").css("display","none");
				}else{
					$(this).parent().find(".empty").css("display","block");
					
				}
			});
		},
		Empty:function(){
			$(this).tap(function(){
				$(this).hide();
				$(this).parent().find(".execute-input").val("");
			});
		},
		Pas:function(){
			$(this).find(".eye-off").tap(function(){
				$(this).hide();
				$(this).parent(".password-li").find(".eye-on").css("display","block");
				$(this).parent(".password-li").find("input").attr("type","email");
				$(this).parent(".password-li").find("input").focus();
			});
			$(this).find(".eye-on").tap(function(){
				$(this).hide();
				$(this).parent(".password-li").find(".eye-off").css("display","block");
				$(this).parent(".password-li").find("input").attr("type","password");
				$(this).parent(".password-li").find("input").focus();
			});
		},
		CloseBg:function(){
			$(this).on("click",function(){
				$(this).hide();
				$(".hide-item").hide();
				$(".main-screen").find("li").removeClass("on");
			});
			
		},
		scroll_top:function(){
           
        }
		
		
    }
    $.extend($.fn,$.dlm);
    $(function(){$.dlm.inits();})
})(Zepto);
function Alert(txt){ //alert
	layer.open({
		content: '<p>'+txt+'</p>',
		shade:false,
		style: 'background-color:rgba(0,0,0,0.7);color:#fff;border:none;text-align:center;width:auto; margin:0 0.6rem;',
		time: 1.5
	});
};
function djs(){ //倒计时
	var wait=59;
	function time(){
        if (wait == 0) {
       		$(".djs").hide();
       		$(".yzm-click").show();
        }else{
            $(".djs-s").text(wait);
            wait--;
            setTimeout(function() {
                time()
            },1000);
        }
    };
	time();
};
function checkphone(obj){ //验证手机号
	var valnum = $(obj).val().length;
	var tel = $(obj).val().replace(/\s+/g,"");//获取手机号并清空空格
	var telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
	if(telReg == false){ //如果手机号码不能通过验证
		return true;
	}else{ //如果手机号码通过验证
		return false;
	}
};
function DownSlide(mmenuhei){
	var Winnum = parseFloat($(window).height());
	var Scrnum = parseFloat($(document).scrollTop());
	var Viewrapnum = parseFloat($(".viewrap").height());
	var Ynum = Winnum-mmenuhei+Scrnum-6;
	$(".cover-bg").addClass("show").height(Winnum);
	Zepto(".cover-01").animate({translateY:Ynum+"px"},300,'ease-out');
	
};
function UpSlide(def,myScroll){
	Zepto(".cover-01").animate({translateY:"100%"},300,'ease-out',function(){$(".cover-bg").removeClass("show").height("0");});
	document.removeEventListener('touchmove',def,false);
	myScroll.destroy();
};

function Loading(){
	layer.open({
		className: 'popuo-loading',
        content: '<div class="load-container"><div class="loader"></div><p>正在加载中...</p><em class="iconfont">&#xe63a;</em></div>',
        time: 0
    });
};

function LoadingClose() {
	layer.closeAll();
};



/**
 * 通用一句话弹出层
 * txt：弹出层文本
 * qxflag：true有取消按钮,false没有取消按钮
 * fun1：确认回调函数
 * fun2：取消回调函数
**/
function Confirm(txt,qxflag,fun1,fun2){
	if(qxflag){
		btn_box = ['确认', '取消'];
		cname = ""
	}else{
		btn_box = ['确认', ''];
		cname = "confirm-onebtn"
	};
	layer.open({
	    content: txt,
	    btn: btn_box,
	    className: cname,
	    yes: function(index){
	    	try{
				fun1();
			}catch(e){
				
			}
	      	layer.close(index);
	    },
	    no:function(index){
	    	try{
				fun2();
			}catch(e){
				
			}
	      	layer.close(index);
	    }
	});
};
