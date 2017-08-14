<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: huajie <banhuajie@163.com>
// +----------------------------------------------------------------------

namespace Admin\Controller;

/**
 * 行为控制器
 * @author huajie <banhuajie@163.com>
 */
class ActionController extends AdminController {

    /**
     * 行为日志列表
     * @author huajie <banhuajie@163.com>
     */
    public function actionLog(){
        //获取列表数据
        $map['status']    =   array('gt', -1);
        $list   =   $this->lists('ActionLog', $map);
        int_to_string($list);
        foreach ($list as $key=>$value){
            $model_id                  =   get_document_field($value['model'],"name","id");
            $list[$key]['model_id']    =   $model_id ? $model_id : 0;
        }
        $this->assign('_list', $list);
        $this->meta_title = '行为日志';
        $this->display();
    }

	public function redis2mysql(){
	set_time_limit(0);
		for($i=0;$i < 200;$i++){
                        $_GET['p'] = $i;
			$id = trim(I('get.id'));
			#$map['id'] = $id;
			#$res =  M('Query')->where($map)->find();
			$list   =   $this->lists('Query', $map);
			foreach($list as $res){
				$this->one2save($res);
			}
		}
	}	


private function one2save($search){
		//连接本地的 Redis 服务
	    $redis = new \Redis();
	    $redis->pconnect(C('REDIS_HOST'), 6379);
		$key = C('KEY_RESULT_KEYWORDS_PRE_FIX').$search['hash'];
		$i = 1;
		echo $queryCount  = $redis->zcard($key);
		if($queryCount > 0){
			$search['count']  = $queryCount;
			#$query =M('Query')->save($search);		
			$range = $redis->zRange($key,0,-1);
			foreach($range as $website){
				$res = $redis->hGetAll($key . $website);
                                $redis->delete($key.$website);
				$result['hash'] = $search['hash'];
				$result['website'] = $website;
				$result['keywords'] = $res['keywords'];
				$result['email'] = $res['email'];
				$result['title'] = $res['title'];
				$result['query'] = $res['query'];
   			        $result['description'] = $res['desc'];
				$result['create_time'] = NOW_TIME;
				#$result =M('QueryResult')->create($result);
				#if(!M('QueryResult')->add($payment)){
			#						echo '插入记录错误'.$result['website'].$i++.'</br>';
			#	}else{
			#		#echo '插入成功'.$i++.'</br>';
			#	}
			}
		}
	}

    /**
     * 查询日志列表
     * @author huajie <banhuajie@163.com>
     */
    public function searchLog(){
		
        $nickname       =   I('nickname');
        $map['remark']    =  array('like', '%'.(string)$nickname.'%');
		
        //获取列表数据
        $map['status']    =   array('gt', -1);
		$map['action_id'] = C('USER_SEARCH_ACTION_ID');
        $list   =   $this->lists('ActionLog', $map);
        int_to_string($list);
        foreach ($list as $key=>$value){
            $model_id                  =   get_document_field($value['model'],"name","id");
            $list[$key]['model_id']    =   $model_id ? $model_id : 0;
        }
        $this->assign('_list', $list);
        $this->meta_title = '查询日志';
        $this->display();
    }
	
	public function cleanKeyword(){
		$keyword       =   I('keyword');
		$keyword = str_replace("新词:","",$keyword);
		$keyword = str_replace("旧词:","",$keyword);
		//连接本地的 Redis 服务
	    $redis = new \Redis();
	    $redis->pconnect(C('REDIS_HOST'), 6379);
		$md5key = md5($keyword);
		$key = C('KEY_RESULT_KEYWORDS_PRE_FIX').$md5key;
		if($redis->del($key)){
			 $this->success('缓存清除成功！');
		}else{
			$this->error('缓存清除失败！');
		}
	}

    /**
     * 查看行为日志
     * @author huajie <banhuajie@163.com>
     */
    public function edit($id = 0){
        empty($id) && $this->error('参数错误！');

        $info = M('ActionLog')->field(true)->find($id);

        $this->assign('info', $info);
        $this->meta_title = '查看行为日志';
        $this->display();
    }

    /**
     * 删除日志
     * @param mixed $ids
     * @author huajie <banhuajie@163.com>
     */
    public function remove($ids = 0){
        empty($ids) && $this->error('参数错误！');
        if(is_array($ids)){
            $map['id'] = array('in', $ids);
        }elseif (is_numeric($ids)){
            $map['id'] = $ids;
        }
        $res = M('ActionLog')->where($map)->delete();
        if($res !== false){
            $this->success('删除成功！');
        }else {
            $this->error('删除失败！');
        }
    }

    /**
     * 清空日志
     */
    public function clear(){
        $res = M('ActionLog')->where('1=1')->delete();
        if($res !== false){
            $this->success('日志清空成功！');
        }else {
            $this->error('日志清空失败！');
        }
    }

}
