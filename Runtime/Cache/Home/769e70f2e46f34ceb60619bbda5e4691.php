<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8">
<title><?php echo C('WEB_SITE_TITLE');?></title>
 <meta name="description" content="<?php echo C('WEB_SITE_DESCRIPTION');?>"/>
 <meta name="keywords" content="<?php echo C('WEB_SITE_KEYWORD');?>"/>

<link href="/Public/static/bootstrap/css/bootstrap.css" rel="stylesheet">
<link href="/Public/static/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">
<link href="/Public/static/bootstrap/css/docs.css" rel="stylesheet">
<link href="/Public/static/bootstrap/css/onethink.css" rel="stylesheet">
<link href="/Public/static/datatables/loading.css" rel="stylesheet">

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
<script src="/Public/static/bootstrap/js/html5shiv.js"></script>
<![endif]-->

<!--[if lt IE 9]>
<script type="text/javascript" src="/Public/static/jquery-1.10.2.min.js"></script>
<![endif]-->
<!--[if gte IE 9]><!-->
<script type="text/javascript" src="/Public/static/jquery-2.0.3.min.js"></script>
<script type="text/javascript" src="/Public/static/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/Public/static/datatables/loading-min.js"></script>
<!--<![endif]-->
<!-- 页面header钩子，一般用于加载插件CSS文件和代码 -->
<?php echo hook('pageHeader');?>

</head>
<body>
	<!-- 头部 -->
	<!-- 导航条
================================================== -->
<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="brand" href="<?php echo U('index/index');?>"><?php echo C('SITE_LOGO_DESC');?></a>
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <div class="nav-collapse collapse">
                <ul class="nav">
                    <?php $__NAV__ = M('Channel')->field(true)->where("status=1")->order("sort")->select(); if(is_array($__NAV__)): $i = 0; $__LIST__ = $__NAV__;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$nav): $mod = ($i % 2 );++$i; if(($nav["pid"]) == "0"): ?><li>
                            <a href="<?php echo (get_nav_url($nav["url"])); ?>" target="<?php if(($nav["target"]) == "1"): ?>_blank<?php else: ?>_self<?php endif; ?>"><?php echo ($nav["title"]); ?></a>
                        </li><?php endif; endforeach; endif; else: echo "" ;endif; ?>
                </ul>
            </div>
            <div class="nav-collapse collapse pull-right">
                <?php if(is_login()): ?><ul class="nav" style="margin-right:90px">
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" style="padding-left:0;padding-right:0"><?php echo get_username();?> <b class="caret"></b></a>
                            <ul class="dropdown-menu">
								<li><a href="#">账户有效期：<?php echo get_expiry();?></a></li>
								<li><a href="#">账户余额:<?php echo get_balance();?>元</a></li>
								<li><a href="javascript:alert('请联系客服')">续费</a></li>
                                <li><a href="<?php echo U('User/profile');?>">修改密码</a></li>
                                <li><a href="<?php echo U('User/logout');?>">退出</a></li>
                            </ul>
                        </li>
                    </ul>
                <?php else: ?>
                    <ul class="nav" style="margin-right:0">
                        <li>
                            <a href="<?php echo U('User/login');?>">登录</a>
                        </li>
                        <li>
                            <a href="<?php echo U('User/register');?>" style="padding-left:0;padding-right:0">注册</a>
                        </li>
                    </ul><?php endif; ?>
            </div>
        </div>
    </div>
</div>

	<!-- /头部 -->
	
	<!-- 主体 -->
	
    <header class="jumbotron subhead" id="overview">
        <div class="container">
            <h2>源自相同起点，演绎不同精彩。全球第一款懂外贸的找客户软件！</h2>
            <p class="notice<?php echo C('WEB_SITE_NOTICE_FONT');?>"><?php echo C('WEB_SITE_NOTICE');?></p>
        </div>
	<link href="/Public/static/datatables/dataTables.bootstra.css" rel="stylesheet">
	<link href="/Public/static/bootstrap/css/bootstrap-multiselect.css" rel="stylesheet">
    </header>

<div id="main-container" class="container">
    <div class="row">
        
 <!--左侧 nav
================================================== 
    <div class="span3 bs-docs-sidebar">
        <ul class="nav nav-list bs-docs-sidenav">
            <?php echo W('Category/lists', array(1, true));?>
        </ul>
    </div>
	-->

        
        <!-- Contents
        ================================================== -->
        <section id="contents">
		    <div class="span12">
		<div class="row-fluid">
		     <form action="<?php echo U('search');?>" method="get" id="searchForm" class="form-horizontal">
			<div>
				<ul class="breadcrumb">
					<li>
						国家：
					</li>
						<div class="btn-group">
						<!-- multiple="multiple" -->
						<select id="optgroup-limit" >
							   <?php $_result=C('COUNTRY_LIST');if(is_array($_result)): $i = 0; $__LIST__ = $_result;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?><option value="<?php echo ($key); ?>"><?php echo ($vo); ?></option><?php endforeach; endif; else: echo "" ;endif; ?>
						</select>
					</div>	
					<li>
						关键词查询：
					</li>
				<div class="input-append">
					<input  type="text" name="search" id="search" />
					<input  type="hidden" name="country" id="country" />
					<button type="button" class="btn submit-btn ajax-post"  id="submit" >查询</button>

					<input  type="hidden" name="sSearch_4" id="sSearch_4" />
				<?php if($isOpration): ?><select id="fillter_query" class="hide-native-select offset1 ">
					    <option value="">all</value>
						<option value="inurl:contact">site:{*} inurl:contact</value>
						<option value="inurl:aboutus">site:{*} inurl:aboutus</value>
						<option value="inurl:faq">site:{*} inurl:faq</value>
						<option value="inurl:where to buy">site:{*} inurl:where to buy</value>
						<option value="inurl:dealer">site:{*} inurl:dealer</value>
						<option value="related:">related:{*}</value>
						<option value="inurl:product">site:{*} inurl:product</value>
						<option value="toll free">site:{*} toll free</value>
						<option value="open time">site:{*} open time</value>
						<option value="open hour">site:{*} open hour</value>
					</select>
					<button type="button" class="btn submit-btn ajax-post"  id="query" >过滤</button><?php endif; ?>
				</div>
				<?php if(!$isOpration): ?><li>
					<ul class="hide" id="indexLinks">
				    <?php if(!empty($loglists)): if(is_array($loglists)): $i = 0; $__LIST__ = $loglists;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?><li><?php echo ($vo["remark"]); ?> 找到<?php echo ($vo["count"]); ?>个目标客户</li><?php endforeach; endif; else: echo "" ;endif; endif; ?>	
					</ul>
					
				</li><?php endif; ?>
							
				</ul>
				<label  style="float:left;font-weight: bold;color:red">外贸神搜累计帮用户找到：<span id="total_count"><?php echo get_total_query_count();?></span>个客户;</label>
				<label id="runing" style="float:left;display: none;">正在处理您的关键词，已找到
				<span id="current_count">0</span>个客户，稍后可重新点击查询按钮获得最新客户</label>
			</div
			 </form>
		</div>
		<div class="row-fluid">

			<table class="table table-striped table-bordered table-hover datatable" id="datatable">
				<thead>
					<tr>
						<th>Website</th>
						<th>Title</th>
						<!--<th>Keywords</th>-->
						<th>Description</th>
						<?php if($isOpration): ?><th>Query</th><?php endif; ?>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>		
				</tbody>
			</table>
		</div>
     <script type="text/javascript" src="/Public/static/datatables/jquery.dataTables.min.js"></script>
     <script type="text/javascript" src="/Public/static/datatables/dataTables.bootstrap.js"></script>
     <script type="text/javascript" src="/Public/static/bootstrap/js/bootstrap-multiselect.js"></script>
	
	
<script type="text/javascript">
var fvTable;
$(document).ready(function() {
setInterval(function() {
	$("#total_count").fadeOut("1000");
    $("#total_count").load("<?php echo U('totalCount');?>");
	$("#total_count").fadeIn('2000');
}, <?php echo C('GETWEBSITE_TIMEOUT');?>);
setInterval(function() {
 if($('#runing').css('display')!='none'){
        $("#current_count").fadeOut("1000");
    $("#current_count").load("<?php echo U('currentCount');?>?search="+encodeURIComponent($("#search").val())+":"+$("#country").val());
        $("#current_count").fadeIn('2000');
}
}, <?php echo C('CURRENTCOUNT_TIMEOUT');?>);
<?php if(is_login()): ?>refresh();<?php endif; ?>
	<?php if($isOpration): ?>$("#query").click(function(){
					i++;
					if(i % 2 == 0){
						next = "";
					}else{
						next =" ";
					}
					$("#sSearch_4").val($('#fillter_query').val().trim());
					$(".dataTables_filter input[type=text]").val($("#search").val() + next);
					var e = jQuery.Event("keyup");//模拟一个键盘事件
					e.keyCode = 13;//keyCode=13是回车
					$(".dataTables_filter input[type=text]").trigger(e);
				}	
			);
	<?php else: ?>
//播放速度
var speed = 1000;
//控制范围，符合jQuery路径即可
var block = '#indexLinks li';
//需要显示的内容条目数
var eq = 1;
var h = 0;
//如果内容数目大于需要滚动的数目，开始滚动！
if($(block).length > eq){
	//隐藏除了第一个的其它所有节点
	$(block).slice(eq).css('display','none');
	$("#indexLinks").show();
	//播放开始
	h = setInterval('scrollContent("'+block+'",'+eq+',2)',speed);
	$('#siteBulletin').mouseout(function(){
		h = setInterval('scrollContent("'+block+'",'+eq+',2)',speed);
	});
	$('#siteBulletin').mouseover(function(){
		clearInterval(h);
	});
}<?php endif; ?>
		var select = $('#optgroup-limit').multiselect({
			enableCollapsibleOptGroups: true,
			 enableFiltering: true,
			 buttonContainer: '<div id="collapsed-container" />',
            onChange: function(options, checked) {
			    var $option = $(options);
				$("#country").val(select.val());
				$(".dataTables_filter input[type=text]").val("");
				if($('#optgroup-limit option:selected').length > 1){
					alert("一次最多只能选择1个国家");
					$("#optgroup-limit").multiselect('deselect', $option.val());
				}
            }
        });
		$("#country").val(select.val());
		$('#collapsed-container .caret-container').click();
		loading = new ol.loading({id:"datatable"});
		$("#submit").click(function() {
				$(".dataTables_filter input[type=text]").val("");
				var strSearch = $("#search").val();
				var strCountry = $("#country").val();
				if(!strSearch){
					$("#search").focus();
					return;
				}
				$("#current_count").val("0");
				$("#runing").show();
				loading.show();
				$.ajax({
				   type: "POST",
				   url: "<?php echo U('search');?>",
				   data: { search: strSearch, country:strCountry},
				   success: function(msg){
						if(msg.status =='expired'){
							alert("账户有效期已到，请及时续费");
							loading.hide();
							window.location = msg.url;
							return;
						}else if(msg.status =='nologin'){
							alert("请先登录，再查询");
							loading.hide();
							window.location = msg.url;
							return;
						}else if(msg.status =='noselect'){
							alert("请选择国家");
							loading.hide();
							return;
						}else if(msg.status =='busy'){
							alert("亲，歇会吧,小搜马上回来(" + msg.delay + "秒)");
							loading.hide();
							return;
						}
						//延时N秒
						setTimeout(function(){
							i++;
							if(i % 2 == 0){
								next = "";
							}else{
								next =" ";
							}
							$(".dataTables_filter input[type=text]").val(strSearch + next);
							$(".dataTables_filter input[type=text]").focus();
							var e = jQuery.Event("keyup");//模拟一个键盘事件
							e.keyCode =13;//keyCode=13是回车
							$(".dataTables_filter input[type=text]").trigger(e);
							fvTable.fnAdjustColumnSizing();
							loading.hide();
						},msg.delay);
						
				   }
				});
		});
		$('#search').keydown(function(e){
			if(e.keyCode == 13){
				//模拟点击登陆按钮，触发上面的 Click 事件
				e.preventDefault();
				$("#submit").click();
			}
		});
		$('#search').keyup(function(e){
			if(e.keyCode == 13){
				//模拟点击登陆按钮，触发上面的 Click 事件
				e.preventDefault();
			}
		});

		<?php if(is_login()): ?>var i=0;
			function refresh (){
			website = 0;
			title = 1;
			//keywords = 2;
			desc = 3-1;
			query = 4-1;
			fvTable  = $('.datatable').dataTable( {   
					  "bProcessing": true,
					  "bServerSide": true,
					  "bSort": false,
					  "bFilter": true,
					  "iDisplayLength":30,
					  "sScrollX":"100%",
					  "sScrollY":"100%",
					  "sAjaxSource": '<?php echo U('showResult');?>',
					  "aoColumns": [
							{"mData": "website"},
							{"mData": "title"},
							//{"mData": "keywords"},
							{"mData": "desc"},
							<?php if($isOpration): ?>{"mData": "query"},<?php endif; ?>
							{"mData": "email"}
						  ],	
					   "fnServerParams": function ( aoData ) { //请求服务器参数
							  aoData.push( { "name": "sSearch_4", "value": $("#sSearch_4").val() },{ "name": "country", "value": $("#country").val() } ); 
							},
					   "oLanguage": {
							"sUrl": "/Public/static/bootstrap/js/zh_CN.json"
						},
						"fnRowCallback": function (nRow, aData, iDisplayIndex) {
							var loadingIMG = "<img src='/Public/static/datatables/loading.gif' />";
							if(aData.website !== null && aData.website.length > 0){
								$('td:eq(0)', nRow).html("<a href='http://" + aData.website + "' target='_blank'>"+aData.website+"</a>");
								$('td:eq(query)', nRow).html("<a href='javascript:$(\"#sSearch_4\").val(\"" + aData.query + "\");' >"+aData.query+"</a>");
							}
							var re = new RegExp(",","g");
							if(aData.website !== null && aData.website.length > 0 && aData.title.length == 0 && aData.keywords.length==0 && aData.desc.length==0){
								loading.show();
								$('td:eq(title)', nRow).html(loadingIMG);

								$.ajax({  
									 type:'get', 
									 timeout:<?php echo C('GETWEBSITE_TIMEOUT');?>,
									 url:'http://www' + i++ + '.<?php echo C('SEARCH_DOMAIN'); echo U('website');?>?url=' + aData.website,  
									 dataType:'jsonp',  
									 jsonp: 'callback',
									 success:function(data){
										  
										  if(data)   
										  {
												loading.hide();
												if (typeof(data.title)=="string" && data.title.length > 100) {
													$('td:eq('+title+')', nRow).html(data.title.trim().replace(re,' ').substr(0, 100)+ "...");
												}else{
													$('td:eq('+title+')', nRow).html(data.title);
												}
												if (typeof(data.keywords)=="string" && data.keywords.length > 200) {
													$('td:eq('+keywords+')', nRow).html(data.keywords.trim().replace(re,' ').substr(0, 200)+ "...");
												}else{
													$('td:eq('+keywords+')', nRow).html(data.keywords);
												}
												if (typeof(data.desc)=="string" && data.desc.length > 200) {
													$('td:eq('+desc+')', nRow).html(data.desc.trim().replace(re,' ').substr(0, 200)+ "...");
												}else{
													$('td:eq('+desc+')', nRow).html(data.desc);
												}
										  }  
									  },  
									  error:function(){
											$('td:eq(title)', nRow).html("<font color='red'>time out</font>");
									  }  
								}); 
							}
							if (aData.title !== null && aData.title.length > 100) {
								titletext = aData.title.trim().replace(re,' ').substr(0, 100)+ "...";
								$('td:eq('+title+')', nRow).html(titletext);
							}else{
								titletext = aData.title.trim();
							}
							if (aData.keywords !== null && aData.keywords.length > 200) {
								keywordstext = aData.keywords.trim().replace(re,' ').substr(0, 200)+ "..."
								$('td:eq('+title+')', nRow).html(keywordstext + titletext);									
							}else{
								keywordstext = aData.keywords.trim();
								$('td:eq('+title+')', nRow).html(keywordstext +  titletext);	
							}
							if (aData.desc !== null && aData.desc.length > 200) {
								$('td:eq('+desc+')', nRow).html( aData.desc.trim().replace(re,' ').substr(0, 200)+ "...");
							}
						},
						"fnInitComplete": function(oSettings, json) {
							//this.fnAdjustColumnSizing();
							//alert(json+ 'DataTables has finished its initialisation.' );
						},
				});
				
				
				
		}<?php endif; ?>
	<?php if(!$isOpration): ?>setTimeout(function () {
			$("#datatable_wrapper #datatable_length").hide();
			$("#datatable_wrapper #datatable_filter").hide();
		}, 100);<?php endif; ?>
} );
function scrollContent(block,eq,type){
		//获取第节点
	    var firstNode = $(block);
	    //动画效果
	    switch(type){
	    	case 1:
	    		animation_out = {height:'hide'};
	    		animation_in = {height:'show'};
	    		break;
	    	case 2:
	    		animation_out = {opacity:'hide'};
	    		animation_in = {opacity:'show'};
	    		break;
	    	case 3:
	    		animation_out = {height:'hide',opacity:'hide'};
	    		animation_in = {height:'show',opacity:'show'};
	    		break;
	    	case 4:
	    		animation_out = {height:'show',opacity:'show'};
	    		animation_in =  {height:'hide',opacity:'hide'};
	    		break;
	    	default:'';
	    }
	    //开始动画
	    firstNode.eq(0).animate(animation_out,1000,function(){
	    	//克隆.追加到最后.隐藏
	        $(this).clone().appendTo($(this).parent()).css('display','none');
	        //显示第二个节点内容
	    	firstNode.eq(eq).removeAttr('style').animate(animation_in,1000);
	    	//删除第一个节点内容
	        $(this).remove();
	    });
}
</script>
		    </div>
        </section>

        </div>

    </div>
</div>

<script type="text/javascript">
    $(function(){
        $(window).resize(function(){
            $("#main-container").css("min-height", $(window).height() - 343);
        }).resize();
    })
</script>
	<!-- /主体 -->

	<!-- 底部 -->
	
    <!-- 底部
    ================================================== -->
    <footer class="footer">
      <div class="container">
          <p>  <strong></strong> © 2016-2022 waimaoshensou.com. All rights reserved</p>
      </div>
    </footer>

<script type="text/javascript">
(function(){
	var ThinkPHP = window.Think = {
		"ROOT"   : "", //当前网站地址
		"APP"    : "", //当前项目地址
		"PUBLIC" : "/Public", //项目公共目录地址
		"DEEP"   : "<?php echo C('URL_PATHINFO_DEPR');?>", //PATHINFO分割符
		"MODEL"  : ["<?php echo C('URL_MODEL');?>", "<?php echo C('URL_CASE_INSENSITIVE');?>", "<?php echo C('URL_HTML_SUFFIX');?>"],
		"VAR"    : ["<?php echo C('VAR_MODULE');?>", "<?php echo C('VAR_CONTROLLER');?>", "<?php echo C('VAR_ACTION');?>"]
	}
})();
</script>
 <!-- 用于加载js代码 -->
<!-- 页面footer钩子，一般用于加载插件JS文件和JS代码 -->
<?php echo hook('pageFooter', 'widget');?>
<div class="hidden"><!-- 用于加载统计代码等隐藏元素 -->
	
	
</div>
<!-- WPA Button Begin -->
<script charset="utf-8" type="text/javascript" src="http://wpa.b.qq.com/cgi/wpa.php?key=XzgwMDEzNjk2OF80MTI0NjRfODAwMTM2OTY4Xw"></script>
<!-- WPA Button End -->
	<!-- /底部 -->
</body>
</html>