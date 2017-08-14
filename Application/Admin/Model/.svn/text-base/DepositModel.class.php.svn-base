<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: linys
// +----------------------------------------------------------------------

namespace Admin\Model;
use Think\Model;

/**
 * 充值模型
 * @author linys
 */

class DepositModel extends Model {
    protected $_validate = array(
        array('amount', 'require', '金额不能为空', self::MUST_VALIDATE , 'regex', self::MODEL_BOTH),
        array('uid', 'require', '用户不能为空', self::MUST_VALIDATE , 'regex', self::MODEL_BOTH),
        array('username', 'require', '用户名不能为空', self::MUST_VALIDATE , 'regex', self::MODEL_BOTH),
        array('oprate_uid', 'require', '操作者ID不能为空', self::MUST_VALIDATE , 'regex', self::MODEL_BOTH),
        array('oprate_name', 'require', '操作者名称不能为空', self::MUST_VALIDATE , 'regex', self::MODEL_BOTH),
    );
	
}
