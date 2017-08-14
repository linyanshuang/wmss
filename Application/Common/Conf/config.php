<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

/**
 * 系统配文件
 * 所有系统级别的配置
 */
return array(
    /* 模块相关配置 */
    'AUTOLOAD_NAMESPACE' => array('Addons' => ONETHINK_ADDON_PATH), //扩展模块列表
    'DEFAULT_MODULE'     => 'Home',
    'MODULE_DENY_LIST'   => array('Common', 'User'),
    //'MODULE_ALLOW_LIST'  => array('Home','Admin'),
	
	'COOKIE_DOMAIN'      =>  'waimaoshensou.com',
	'SEARCH_DOMAIN'      =>  'waimaoshensou.cn',

    'COOKIE_DOMAIN'      =>  'waimaoshensou.com',
    'SEARCH_DOMAIN'      =>  'waimaoshensou.cn',    
    /* 系统数据加密设置 */
    'DATA_AUTH_KEY' => 'q=xD"8pyh`!no-PXZri_TBzG5;6OCu)mV/~[fN<@', //默认数据加密KEY
    /* 调试配置 */
    'SHOW_PAGE_TRACE' => true,

    /* 用户相关设置 */
    'USER_MAX_CACHE'     => 1000, //最大缓存用户数
    'USER_ADMINISTRATOR' => 1, //管理员用户ID

    /* URL配置 */
    'URL_CASE_INSENSITIVE' => true, //默认false 表示URL区分大小写 true则表示不区分大小写
    'URL_MODEL'            => 2, //URL模式
    'VAR_URL_PARAMS'       => '', // PATHINFO URL参数变量
    'URL_PATHINFO_DEPR'    => '/', //PATHINFO URL分割符

    /* 全局过滤配置 */
    'DEFAULT_FILTER' => '', //全局过滤函数

    /* 数据库配置 */
    'DB_TYPE'   => 'mysqli', // 数据库类型
    'DB_HOST'   => '127.0.0.1', // 服务器地址
    'DB_NAME'   => 'onethink', // 数据库名
    'DB_USER'   => 'root', // 用户名
    'DB_PWD'    => 'root',  // 密码
    'DB_PORT'   => '3306', // 端口
    'DB_PREFIX' => 'onethink_', // 数据库表前缀

    /* 文档模型配置 (文档模型核心配置，请勿更改) */
    'DOCUMENT_MODEL_TYPE' => array(2 => '主题', 1 => '目录', 3 => '段落'),
		/* 邮件发送配置 */
	'THINK_EMAIL' => array(
		'SMTP_HOST' => 'smtp.qq.com', //SMTP服务器
		'SMTP_PORT' => '465', //SMTP服务器端口
		'SMTP_USER' => 'waimaoshensou@qq.com', //SMTP服务器用户名
		'SMTP_PASS' => 'kycwcerbpvqvhehj', //SMTP服务器密码
		'FROM_EMAIL' => 'waimaoshensou@qq.com',
		'FROM_NAME' => '外贸神搜', //发件人名称
		'REPLY_EMAIL' => '', //回复EMAIL（留空则为发件人EMAIL）
		'REPLY_NAME' => '', //回复名称（留空则为发件人名称）
		'SESSION_EXPIRE'=>'72',
	), 
);
