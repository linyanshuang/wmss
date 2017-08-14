<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: huajie <banhuajie@163.com>
// +----------------------------------------------------------------------

namespace Admin\Model;
use Think\Model;

/**
 * 查询模型
 * @author huajie <banhuajie@163.com>
 */

class QueryModel extends Model {

    /* 自动验证规则 */
    protected $_validate = array(
        array('keywords', 'require', '关键词不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
        array('keywords', '1,50', '关键词长度不能超过80个字符', self::MUST_VALIDATE, 'length', self::MODEL_BOTH),
        array('contry', 'require', '国家不能为空', self::MUST_VALIDATE, 'regex', self::MODEL_BOTH),
    );

    /* 自动完成规则 */
    protected $_auto = array(
        array('create_time', 'time', self::MODEL_BOTH, 'function'),
    );

    /**
     * 新增或更新查询
     * @return boolean fasle 失败 ， int  成功 返回完整的数据
     */
    public function update(){
        /* 获取数据对象 */
        $data = $this->create($_POST);
        if(empty($data)){
            return false;
        }

        /* 添加或新增行为 */
        if(empty($data['id'])){ //新增数据
            $id = $this->add(); //添加行为
            if(!$id){
                $this->error = '新增搜索记录出错！';
                return false;
            }
        } else { //更新数据
            $status = $this->save(); //更新基础内容
            if(false === $status){
                $this->error = '更新搜索记录出错！';
                return false;
            }
        }
        //删除缓存
        S('action_list', null);

        //内容添加或更新完成
        return $data;

    }


	/**
	 * 获取明细
	 * @param  integer $id 查询记录ID
	 * @return array       详细数据
	 */
	public function detail($id){
		/* 获取基础数据 */
		$info = $this->field(true)->find($id);
		if(!(is_array($info)){
			$this->error = '记录不存在';
			return false;
		}
		return $info;
	}

}

