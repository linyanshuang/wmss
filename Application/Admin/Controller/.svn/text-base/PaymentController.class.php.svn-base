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
 * 后台消费记录控制器
 * @author linys
 */
class PaymentController extends AdminController {

    /**
     * 消费记录首页
     * @author linys
     */
    public function index(){
        $nickname       =   I('nickname');
        if(is_numeric($nickname)){
            $map['uid|username']=   array(intval($nickname),array('like','%'.$nickname.'%'),array('like',$nickname.'%'),'_multi'=>true);
        }else{
            $map['username']    =  array('like', '%'.(string)$nickname.'%');
        }

        $list   = $this->lists('Payment', $map);
        int_to_string($list);
        $this->assign('_list', $list);
		$map['status'] = '1';
		$this->assign('sum', $this->totalSum($map));
        $this->meta_title = '消费记录';
        $this->display();
    }

	
    /**
     * 会员续费
     * @author linys
     */
    public function renew($uid = '', $sn='', $remark=''){
		$info = M("Member")->where(array('uid'=>$uid))->find();
        if(IS_POST){
			$price = C('GOODS_PRICE')[$sn];
			if($info['balance'] < $price){
				$this->error('续费失败,用户余额不足！');
				return;
			}
			 if(strtotime($info['expiryend']) < strtotime(date('Y-m-d 00:00'))){//已过期
				 $newexpiry = date("Y-m-d 00:00",strtotime(C('GOODS_TIME')[$sn]));
			 }else{//未过期
				 $newexpiry = date('Y-m-d 00:00', strtotime (C('GOODS_TIME')[$sn], strtotime($info['expiryend'])));
			 }
			/* 更新消费记录 */
			$payment['uid'] = $uid;
			$payment['pay_type'] = 1;//余额支付
			$payment['goods_sn'] = $sn;
			$payment['goods_name'] = C('GOODS_LIST')[$sn];
			$payment['goods_price'] = $price;
			$payment['buy_count'] = 1;
			$payment['amount'] = $price;
			$payment['oprate_uid'] = UID;
			$payment['oprate_name'] =  session('user_auth.username');
			$payment['create_time'] =  NOW_TIME;
			$payment['update_time'] =  NOW_TIME;
			$payment['discount'] =  0.00; //折扣 单位：元
			$payment['status'] =  1;//支付成功
			$payment['remark'] =  $remark;

            $User   =   new UserApi;
			$uinfo = $User->info($uid);
			if($uinfo && isset($uinfo['1'])){				
				$payment['username'] = $uinfo['1'];
			}
			$payment =M('Payment')->create($payment);
			if(!M('Payment')->add($payment)){
				$this->error('续费失败,插入消费记录错误');
				return;
			}
			
			/* 更新余额 */
			$data = array(
				'uid'             => $uid,
				'balance'         => array('exp', '`balance`-'.$price),
				'expiryend'       => $newexpiry,
			);
			if(M('Member')->save($data)){
				$this->success('续费成功！',U('User/index'));
			}else{
				$this->error('续费失败，更新余额出错');
			}
			
        } else {
			$this->assign('nickname',$info['nickname']);
		    $this->assign('balance',$info['balance']);
			$this->assign('expiryend',$info['expiryend'] ." 00:00");
			$this->assign('uid',$uid);
            $this->meta_title = '会员续费';
            $this->display();
        }
	}	
	public function price($sn='',$uid=''){
		if(isset($sn)){
			if(isset(C('GOODS_PRICE')[$sn])){
				$info = M("Member")->where(array('uid'=>$uid))->find();
				 if(strtotime($info['expiryend']) < strtotime(date('Y-m-d 00:00'))){//已过期
					 $result['newexpiry'] = date("Y-m-d 00:00",strtotime(C('GOODS_TIME')[$sn]));
				 }else{//未过期
					 $result['newexpiry'] = date('Y-m-d 00:00', strtotime (C('GOODS_TIME')[$sn], strtotime($info['expiryend'])));
				 }
				$result['msg'] = C('GOODS_PRICE')[$sn];
				$result['status'] = 'success';
			}else{
				$result['msg'] = '获取价格出错';
				$result['status'] = 'error';
			}
		}else{
			$result['msg'] = '获取价格出错';
			$result['status'] = 'error';
		}
		$this->ajaxReturn($result,'JSON');			
    }

	public function totalSum($map){
		$sum['today']  = M('Payment')->where(find_create_time('today',$map))->sum('amount');
		$sum['week']   = M('Payment')->where(find_create_time('week',$map))->sum('amount');
		$sum['mounth'] = M('Payment')->where(find_create_time('mounth',$map))->sum('amount');
		$sum['year']   = M('Payment')->where(find_create_time('year',$map))->sum('amount');
		$sum['all']    = M('Payment')->where(find_create_time('',$map))->sum('amount');
		
		$sum['today'] = $sum['today'] ? $sum['today'] : "0.00";
		$sum['week'] = $sum['week'] ? $sum['week'] : "0.00";
		$sum['mounth'] = $sum['mounth'] ? $sum['mounth'] : "0.00";
		$sum['year'] = $sum['year'] ? $sum['year'] : "0.00";
		$sum['all'] = $sum['all'] ? $sum['all'] : "0.00";
		return $sum;
	}
}
