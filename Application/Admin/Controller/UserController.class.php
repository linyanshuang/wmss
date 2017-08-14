<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Admin\Controller;
use User\Api\UserApi;

/**
 * 后台用户控制器
 * @author 麦当苗儿 <zuojiazi@vip.qq.com>
 */
class UserController extends AdminController {

    /**
     * 用户管理首页
     * @author 麦当苗儿 <zuojiazi@vip.qq.com>
     */
    public function index(){
        $nickname       =   I('nickname');
        $map['status']  =   array('egt',0);
		if(is_numeric(I('last_login_time'))){
		    $n_day_time = NOW_TIME - I('last_login_time') * 24 * 60 * 60;
			$map['last_login_time']  =   array('elt',$n_day_time);
		}
        if(is_numeric($nickname)){
            $map['uid|nickname|mobile']=   array(intval($nickname),array('like','%'.$nickname.'%'),array('like',$nickname.'%'),'_multi'=>true);
        }else{
            $map['nickname|email']    =  array(array('like', '%'.(string)$nickname.'%'),array('like','%'.(string)$nickname.'%'),'_multi'=>true);
        }

        $list   = $this->lists('Member', $map);
        int_to_string($list);
		//$User = new UserApi();
		//foreach($list as $u){
		//	 $u['email'] = $User->info($u['uid'])['2'];
		//	 $u['mobile'] = $User->info($u['uid'])['3'];
		//	 $nlist[] = $u;
		//}
        $this->assign('_list', $list);
        $this->meta_title = '用户信息';
        $this->display();
    }

    /**
     * 修改昵称初始化
     * @author huajie <banhuajie@163.com>
     */
    public function updateNickname(){
        $uid = I('get.uid')? I('get.uid'): UID;
        $nickname = M('Member')->getFieldByUid($uid, 'nickname');
        $email =    M('Member')->getFieldByUid($uid, 'email');
        $this->assign('nickname', $nickname);
        $this->assign('email', $email);
        $this->assign('uid', $uid);
        $this->meta_title = '修改昵称/邮箱';
        $this->display();
    }

    /**
     * 修改昵称提交
     * @author huajie <banhuajie@163.com>
     */
    public function submitNickname(){
        //获取参数
        //$nickname = I('post.nickname');
        $password = I('post.password');
        $email    = I('post.email');
        $uid    = I('post.uid');
        empty($uid)      && $this->error('UID不能为空');
        //empty($nickname) && $this->error('请输入昵称');
        //empty($password) && $this->error('请输入密码');
        empty($email)    && $this->error('请输入邮箱');

        //密码验证
        $User   =   new UserApi();
        $data['email'] = $email;
        $res    =   $User->updateInfo($uid, 'tolyss', $data);
        if($res['status']){
            $Member =   D('Member');
            $res = $Member->where(array('uid'=>$uid))->save($data);
            $this->success('修改邮箱成功！');
        }else{
            $this->error($res['info']);
        }
    }

    /**
     * 修改密码初始化
     * @author huajie <banhuajie@163.com>
     */
    public function updatePassword(){
        $this->meta_title = '修改密码';
        $this->display();
    }

    /**
     * 修改密码提交
     * @author huajie <banhuajie@163.com>
     */
    public function submitPassword(){
        //获取参数
        $password   =   I('post.old');
        empty($password) && $this->error('请输入原密码');
        $data['password'] = I('post.password');
        empty($data['password']) && $this->error('请输入新密码');
        $repassword = I('post.repassword');
        empty($repassword) && $this->error('请输入确认密码');

        if($data['password'] !== $repassword){
            $this->error('您输入的新密码与确认密码不一致');
        }

        $Api    =   new UserApi();
        $res    =   $Api->updateInfo(UID, $password, $data);
        if($res['status']){
            $this->success('修改密码成功！');
        }else{
            $this->error($res['info']);
        }
    }
	
	
	public function nologinNotify(){
        $id = array_unique((array)I('id',0));
        $ids  = is_array($id) ? implode(',',$id) : $id;
        if (empty($ids)) {
            $this->error('请选择要操作的数据!');
        }
		if(!is_array($id)){
			$info = M('Member')->where(array('uid'=>$id))->find();
			$info['last_login_time'] = time_format($info['last_login_time']);
			if($info){
				@Send2Mail($info['email'],C('MAIL_NOTIC_SUBJECT'),loadVM(C('EMAIL_NOTIFY_TPL_NOLOGIN'),$info));
			}
		}else{
			foreach($id as $_id){
				$info = M('Member')->where(array('uid'=>$_id))->find();	
				$info['last_login_time'] = time_format($info['last_login_time']);
				if($info){
					@Send2Mail($info['email'],C('MAIL_NOTIC_SUBJECT'),loadVM(C('EMAIL_NOTIFY_TPL_NOLOGIN'),$info));
				}
			}
		}
		$this->success('通知成功!');
	}
	
    /**
     * 重置密码
     * @author linys
     */
    public function resetPassword($id=''){
		$uid = array_unique((array)$id);
        if( in_array(C('USER_ADMINISTRATOR'), $uid)){
            $this->error("不允许对超级管理员执行该操作!");
			return;
        }
        //获取参数
		$data['password'] = generate_password();
        $Api    =   new UserApi();
        $res    =   $Api->updateInfo($id, 'tolyss', $data);
        if($res['status']){
			$info = M('Member')->where(array('uid'=>$id))->find();
			if($info){
$resetTPL=<<<EOT
尊敬的用户:{$info['nickname']}</br>
	您的密码已经被管理员重置，新的密码是：{$data['password']}(请注意大小写)<a href='http://www.waimaoshensou.com/Home/User/login.html'>点击登陆</a>后请修改密码。</br>
			
</br>			
外贸神搜
EOT;
				if($info['email']){
					Send2Mail($info['email'],'用户重置密码通知',$resetTPL);
					$this->success('重置密码成功，新密码已下发到用户邮箱');
				}else{
					$this->error('重置密码成功，邮件下发失败');
				}				
			}else{
				$this->error('用户信息查询失败！');
			}
            
        }else{
            $this->error($res['info']);
        }
    }

    /**
     * 用户行为列表
     * @author huajie <banhuajie@163.com>
     */
    public function action(){
        //获取列表数据
        $Action =   M('Action')->where(array('status'=>array('gt',-1)));
        $list   =   $this->lists($Action);
        int_to_string($list);
        // 记录当前列表页的cookie
        Cookie('__forward__',$_SERVER['REQUEST_URI']);

        $this->assign('_list', $list);
        $this->meta_title = '用户行为';
        $this->display();
    }

    /**
     * 新增行为
     * @author huajie <banhuajie@163.com>
     */
    public function addAction(){
        $this->meta_title = '新增行为';
        $this->assign('data',null);
        $this->display('editaction');
    }

    /**
     * 编辑行为
     * @author huajie <banhuajie@163.com>
     */
    public function editAction(){
        $id = I('get.id');
        empty($id) && $this->error('参数不能为空！');
        $data = M('Action')->field(true)->find($id);

        $this->assign('data',$data);
        $this->meta_title = '编辑行为';
        $this->display();
    }

    /**
     * 更新行为
     * @author huajie <banhuajie@163.com>
     */
    public function saveAction(){
        $res = D('Action')->update();
        if(!$res){
            $this->error(D('Action')->getError());
        }else{
            $this->success($res['id']?'更新成功！':'新增成功！', Cookie('__forward__'));
        }
    }

    /**
     * 会员状态修改
     * @author 朱亚杰 <zhuyajie@topthink.net>
     */
    public function changeStatus($method=null){
        $id = array_unique((array)I('id',0));
        if( in_array(C('USER_ADMINISTRATOR'), $id)){
            $this->error("不允许对超级管理员执行该操作!");
        }
        $id = is_array($id) ? implode(',',$id) : $id;
        if ( empty($id) ) {
            $this->error('请选择要操作的数据!');
        }
        $map['uid'] =   array('in',$id);
        switch ( strtolower($method) ){
            case 'forbiduser':
                $this->forbid('Member', $map );
                break;
            case 'resumeuser':
                $this->resume('Member', $map );
                break;
            case 'deleteuser':
                $this->delete('Member', $map );
                break;
            default:
                $this->error('参数非法');
        }
    }

    public function add($username = '', $password = '', $repassword = '', $email = '', $mobile='' , $company=''){
        if(IS_POST){
            /* 检测密码 */
            if($password != $repassword){
                $this->error('密码和重复密码不一致！');
            }

            /* 调用注册接口注册用户 */
            $User   =   new UserApi;
            $uid    =   $User->register($username, $password, $email, $mobile, $company);
            if(0 < $uid){ //注册成功
                $user = array('uid' => $uid, 'nickname' => $username,'email' => $email,'company' => $company, 'mobile' => $mobile, 'status' => 1);
                if(!M('Member')->add($user)){
                    $this->error('用户添加失败！');
                } else {
                    $this->success('用户添加成功！',U('index'));
                }
            } else { //注册失败，显示错误信息
                $this->error($this->showRegError($uid));
            }
        } else {
            $this->meta_title = '新增用户';
            $this->display();
        }
    }
	

    /**
     * 获取用户注册错误信息
     * @param  integer $code 错误编码
     * @return string        错误信息
     */
    private function showRegError($code = 0){
        switch ($code) {
            case -1:  $error = '用户名长度必须在16个字符以内！'; break;
            case -2:  $error = '用户名被禁止注册！'; break;
            case -3:  $error = '用户名被占用！'; break;
            case -4:  $error = '密码长度必须在6-30个字符之间！'; break;
            case -5:  $error = '邮箱格式不正确！'; break;
            case -6:  $error = '邮箱长度必须在1-32个字符之间！'; break;
            case -7:  $error = '邮箱被禁止注册！'; break;
            case -8:  $error = '邮箱被占用！'; break;
            case -9:  $error = '手机格式不正确！'; break;
            case -10: $error = '手机被禁止注册！'; break;
            case -11: $error = '手机号被占用！'; break;
            default:  $error = '未知错误';
        }
        return $error;
    }
	

}
