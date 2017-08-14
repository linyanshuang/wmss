<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Home\Controller;
use OT\DataDictionary;
use Common\Api\Snoopy;

/**
 * 前台首页控制器
 * 主要获取首页聚合数据
 */
class IndexController extends HomeController {

	//系统首页
    public function index(){

        $category = D('Category')->getTree();
        $lists    = D('Document')->lists(null);
		
        //获取列表数据
        $map['status']    =   array('gt', -1);
		$map['action_id'] = C('USER_SEARCH_ACTION_ID');
		$map['model']     = array('like','新词%');
        $loglists   =   D('ActionLog')->lists($map);
        foreach ($loglists as $key=>$value){
				$model = str_replace("新词:","",$value['model']);
				$model = str_replace("旧词:","",$model);
				$keyword = explode(":", $model);
				$remarks =  explode("在", $value['remark']);
				$tmp = $value;
			    $tmp['remark'] = hide_nickname($remarks[0]) . '查询了'.$keyword[0];
				$searchCount = get_keywords_result_count($model);
				if($searchCount > 10){
					$tmp['count']  = $searchCount;
					$nloglists[] = $tmp;
				}			    
        }
		

        $this->assign('category',$category);//栏目
        $this->assign('lists',$lists);//列表
        $this->assign('loglists',$nloglists);//日志列表
        $this->assign('page',D('Document')->page);//分页
		if(isOperation()){
			$this->assign("isOpration",true);		
		}else{
			$this->assign("isOpration",false);
		}
        $this->display();
    }
	
	public function totalCount(){
		$this->ajaxReturn(get_total_query_count(),'JSON');
	}
	
	public function currentCount($keyword=''){
		$keyword   =   strtolower(trim(I('get.search')));//全部转成小写
		$this->ajaxReturn(get_keywords_result_count1($keyword),'JSON');
	}

	public function trace($ip=''){
		$ip = get_client_ip();
		$Ipl = new \Org\Net\IpLocation('QQWry.dat'); // 实例化类 参数表示IP地址库文件
		$area = $Ipl->getlocation($ip); // 获取某个IP地址所在的位置
		echo $area . $ip;
	
	}

	
	public function init(){
		$url = "www.findeen.co.uk";
		$newresult = $this->getWebsite("http://" . $url);
		print_R($newresult);
	}
	
	public function resultCount(){
		$hash='caf41005018c1951dd6912f0425741b1';
		$query['hash'] = $hash; 
		$a = D('QueryResult')->listcount($query);
		print_r($a);
	}	
	
	public function search(){
		if ( !is_login() ) {
			$result['status'] = 'nologin';
			$result['url'] = U('User/login');
			$this->ajaxReturn($result,'JSON');
			exit;
		}

		if(strtotime(get_expiry()) < strtotime(date('Y-m-d 00:00'))){
			$result['status'] = 'expired';//账户已过期
			$this->ajaxReturn($result,'JSON');
			exit;
		}
		$country =  trim(I('post.country'));
		if(!$country){
			$result['status'] = 'noselect';//没有选择国家
			$this->ajaxReturn($result,'JSON');
			exit;
		}
		$keyword   =   strtolower(trim(I('post.search')));//全部转成小写
		$count = 0;
		if(isset($keyword)){
			$Member = D('Member');		
			//连接 Redis 服务
			$redis = new \Redis();
			$redis->pconnect(C('REDIS_HOST'), 6379);
		    $md5key = md5($keyword . ":" . $country);
			$queryCount  = $redis->zcard(C('KEY_RESULT_KEYWORDS_PRE_FIX') . $md5key);//判断默认的是否有结果
			if($queryCount <= 0){
				if(!isOperation() && $this->isBusy()){
					$result['status'] = 'busy';//1分钟频度检测
					$result['delay'] = 60 - (NOW_TIME - session("lastTime"));
				}else{
					$count = $redis->lpush(C('KEY_NEW_KEYWORDS_LIST_PRE_FIX'),$keyword ."|". $country);
					$redis->close();
					if($count > 0){
						$result['delay'] = C('FILTER_DELAY');
						$result['status'] = 'success';
						session("lastTime",NOW_TIME);
					}else{
						$result['delay'] = '100';
						$result['status'] = 'fail';
					}
					$Member->search("新词:" . $keyword .":". $country);
				}
			}else{
				$Member->search("旧词:" . $keyword .":". $country);
				$result['delay'] = '100';
			}
		}
		
		$this->ajaxReturn($result,'JSON');
	}

	
	private function isBusy(){
		$lastTime = session("lastTime");
		if(empty($lastTime)){
			return false;
		}else{
			if(NOW_TIME - $lastTime < 60){
				return true;
			}else{
				return false;
			}
		}
	}
	
	private function isBlackList($url){
		$list = explode(',',C("BLACK_LIST"));
		foreach($list as $val){
			if(strpos($url,$val) > -1 ){
				return true;
			}
		}
		return false;
	}

	
	/* 显示URL详细信息 */	
	public function website($url='', $country='', $keyword=''){
		$metas = array();
		$url   =  $url ? $url : trim(I('get.url'));
		$country =  $country ? $country : trim(I('get.country'));
		$keyword   =   $keyword ? strtolower($keyword) : strtolower(trim(I('get.search')));//全部转成小写
		$empty =array();
		$empty['website']= $url;
		$empty['title']=' ';
		$empty['keywords']=' ';
		$empty['desc']=' ';
		$empty['query']=' ';
		$empty['email']=' ';
		

		$md5key = md5($keyword . ":" . $country);
		$metas = $this->getWebsite("http://" . $url);
		//save2redis
		if(isset($metas['title']) || isset($metas['desc']) || isset($metas['query'])){
			//连接 Redis 服务
			$redis = new \Redis();
			$redis->pconnect(C('REDIS_HOST'), 6379);	
			$redis->hmset(C('KEY_RESULT_KEYWORDS_PRE_FIX').$md5key.$url,$metas);
			$redis->close();
		}
		$this->ajaxReturn(array_merge($empty,$metas),'jsonp');
	}
	

	
	/* 显示关键词结果 */
	public function showResult(){
		if ( !is_login() ) {
			$result['status'] = 'nologin';
			$result['url'] = U('User/login');
			$this->ajaxReturn($result,'JSON');
			exit;
		}
		$iDisplayLength   =   I('get.iDisplayLength') - 1;
		$iDisplayStart   =   I('get.iDisplayStart');
		$sSearch   =   strtolower(trim(I('get.sSearch')));
		$sSearch_4 =   strtolower(trim(I('get.sSearch_4')));
		$country =  trim(I('get.country'));
		//连接本地的 Redis 服务
	    $redis = new \Redis();
	    $redis->pconnect(C('REDIS_HOST'), 6379);
	    $keyword = $sSearch;
		$md5key = md5($keyword . ":" . $country);
		$key = C('KEY_RESULT_KEYWORDS_PRE_FIX').$md5key;

		//黑名单过滤
		$range = $redis->zRange(C('KEY_RESULT_KEYWORDS_PRE_FIX').$md5key,0,-1); //分页用到的主要函数		
		foreach($range as $website){
				if($this->isBlackList($website)){// 删除黑名单结果
					$redis->zRem(C('KEY_RESULT_KEYWORDS_PRE_FIX').$md5key,$website);
				}
		}
        $totalCount  = $redis->zcard($key); // 总记录数
		if(!$sSearch_4){//会员模式
			$range = $redis->zRange(C('KEY_RESULT_KEYWORDS_PRE_FIX').$md5key,$iDisplayStart,$iDisplayStart+$iDisplayLength); //分页用到的主要函数
			// 获取url keywords等信息
			foreach($range as $website){
				if($this->isBlackList($website)){
					continue;//黑名单
				}
				$result = $redis->hGetAll(C('KEY_RESULT_KEYWORDS_PRE_FIX') . $md5key . $website);
				if(!$result['keywords']){
					$this->getWebsiteByJava($website,$md5key);
				}
			}
			sleep(C('SYSTEM_WEB_INFO_WAITING'));
			// 暂停N秒后重新获取
			foreach($range as $website){
				$result = $redis->hGetAll(C('KEY_RESULT_KEYWORDS_PRE_FIX') . $md5key . $website);
				if(!isset($result['email'])){
					$result['email'] = " ";
				}
				$pageList[] = $result;
			}
			$totalDisplayRecords = $totalCount;
		}else{// 管理员查规则模式
			$range = $redis->zRange(C('KEY_RESULT_KEYWORDS_PRE_FIX').$md5key,0,-1); //分页用到的主要函数
			$i = 0;
			$j = 0;
			// 获取url keywords等信息
			foreach($range as $website){
				if($this->isBlackList($website)){
					continue;//黑名单
				}
				$hash = $redis->hGetAll(C('KEY_RESULT_KEYWORDS_PRE_FIX') . $md5key.$website);
				if(strpos($hash['query'],$sSearch_4) > -1 ){//包含查询条件即可
					$j++;
					if($j >= $iDisplayStart && $j<$iDisplayStart+$iDisplayLength){
						if(!$hash['keywords']){
							$this->getWebsiteByJava($website,$md5key);
						}
					}
				}
				$i++;
			}
			sleep(C('SYSTEM_WEB_INFO_WAITING'));
			// 暂停N秒后重新获取
			$i = 0;
			$j = 0;
			foreach($range as $website){
				$hash = $redis->hGetAll(C('KEY_RESULT_KEYWORDS_PRE_FIX') . $md5key.$website);
				if(strpos($hash['query'],$sSearch_4) > -1 ){//包含查询条件即可
					$j++;
					if($j >= $iDisplayStart && $j<$iDisplayStart+$iDisplayLength){
						if(!isset($hash['email'])){
							$hash['email'] = " ";
						}
						$pageList[] = $hash;
					}
				}
				$i++;
			}
			$totalDisplayRecords = $j;
			$totalCount = $i;
		}
		
		

		//构建空对象
		if(count($pageList) < 1){
			$empty['website']='';
			$empty['title']='';
			$empty['keywords']='';
			$empty['desc']='';
			$empty['query']='';
			$empty['email']='';
			$pageList[] = $empty;
		}
		$redis->close();
		$result = array();
		$result['draw'] = 2;
		$result['iTotalRecords'] = $totalCount;
		$result['iTotalDisplayRecords'] = $totalDisplayRecords;
		$result['aaData'] = $pageList;
		$this->ajaxReturn ($result,'JSON');
	}

	private function get_meta_data($html) {
		preg_match_all("/<meta[^>]+name=\"([^\"]*)\"[^>]+content=\"([^\"]*)\"[\/]*[^>]*>/i",$html, $out, PREG_PATTERN_ORDER);
		preg_match('/<title>([^>]*)<\/title>/si', $html, $title); 
		$meta['title'] = $title[1];
		for ($i=0;$i < count($out[1]);$i++) {
			// loop through the meta data - add your own tags here if you need
			if (strtolower($out[1][$i]) == "keywords") $meta['keywords'] = $out[2][$i];
			if (strtolower($out[1][$i]) == "description") $meta['desc'] = $out[2][$i];
		}
		return $meta;    
	}
	
	private function getWebsiteByJava($website,$md5key){
		//连接本地的 Redis 服务
	    $redis = new \Redis();
	    $redis->pconnect(C('REDIS_HOST'), 6379);
		$redis->lpush('SHENSOU_NEW_URL_LIST', $website . "," . $md5key);
	}
	
		/* 显示URL详细信息 */
	private function getWebsite($url){
		$metas = array();
		$snoopy= new Snoopy();
		$snoopy->agent = "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36";
		$snoopy->maxredirs = 3;
		$snoopy->offsiteok = false;
		$snoopy->expandlinks = false;
		
		// fetch the text of the website www.google.com:
		if($snoopy->fetch($url)){ 
			// other methods: fetch, fetchform, fetchlinks, submittext and submitlinks
			// redirecd:
			if(strpos($snoopy->response_code,"302") > -1|| strpos($snoopy->response_code,"301") > -1){
				while(list($key,$val) = each($snoopy->headers)){
					if(strpos($val,"Location:")>-1){
						$newUrl =  substr($val,strpos($val,"Location:")+9);
						return $this->getWebsite(trim($newUrl));
					}
				}
			}
			// print the texts of the website:
			$metas = $this->get_meta_data($snoopy->results);
		}
		return $metas;
	}	
		
}
