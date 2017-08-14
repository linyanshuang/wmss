<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: linys <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Admin\Controller;
use User\Api\UserApi;

/**
 * 后台充值控制器
 * @author linys
 */
class DepositController extends AdminController {

    /**
     * 充值记录
     * @author linys
     */
    public function index(){
        $nickname       =   I('nickname');
        if(is_numeric($nickname)){
            $map['uid|username']=   array(intval($nickname),array('like','%'.$nickname.'%'),array('like',$nickname.'%'),'_multi'=>true);
        }else{
            $map['username']    =  array('like', '%'.(string)$nickname.'%');
        }

        $list   = $this->lists('Deposit', $map);
        int_to_string($list);
		
        $this->assign('_list', $list);
		$this->assign('sum', $this->totalSum($map));
        $this->meta_title = '充值记录';
        $this->display();
    }

	
    /**
     * 会员充值
     * @author linys
     */
    public function doDeposit($uid = '', $balance='' ,$remark=''){
        if(IS_POST){
			if($balance <= 0){
				$this->error('充值金额错误');
				return;
			}
			$deposit['uid'] = $uid;
			$deposit['type'] = 1;//后台充值
			$deposit['amount'] = $balance;
			$deposit['oprate_uid'] = UID;
			$deposit['oprate_name'] =  session('user_auth.username');
			$deposit['create_time'] =  NOW_TIME;
			$deposit['remark'] =  $remark;

            $User   =   new UserApi;
			$uinfo = $User->info($uid);
			if($uinfo && isset($uinfo['1'])){				
				$deposit['username'] = $uinfo['1'];
			}
			$deposit =M('Deposit')->create($deposit);
 			if(M('Deposit')->add($deposit)){
				/* 更新余额 */
				$data = array(
					'uid'             => $uid,
					'balance'         => array('exp', '`balance`+'.$balance)
				);
				if(M('Member')->save($data)){
					$this->success('充值成功！',U('User/index'));
				}else{
					$this->error('充值失败,更新余额错误');
				}	
			}else{
				$this->error('充值失败，插入充值记录错误');	
			}
        } else {
			$User   =   new UserApi;
			$info    =   $User->info($uid);
			$this->assign('nickname',$info['1']);
			$this->assign('expiryend',$info['1']);
			$this->assign('uid',$uid);
            $this->meta_title = '用户充值';
            $this->display("deposit");
        }
    }

	
		
	public function totalSum($map){
		$sum['today']  = M('Deposit')->where(find_create_time('today',$map))->sum('amount');
		$sum['week']   = M('Deposit')->where(find_create_time('week',$map))->sum('amount');
		$sum['mounth'] = M('Deposit')->where(find_create_time('mounth',$map))->sum('amount');
		$sum['year']   = M('Deposit')->where(find_create_time('year',$map))->sum('amount');
		$sum['all']    = M('Deposit')->where(find_create_time('',$map))->sum('amount');
		
		$sum['today'] = $sum['today'] ? $sum['today'] : "0.00";
		$sum['week'] = $sum['week'] ? $sum['week'] : "0.00";
		$sum['mounth'] = $sum['mounth'] ? $sum['mounth'] : "0.00";
		$sum['year'] = $sum['year'] ? $sum['year'] : "0.00";
		$sum['all'] = $sum['all'] ? $sum['all'] : "0.00";
		return $sum;
	}


}
