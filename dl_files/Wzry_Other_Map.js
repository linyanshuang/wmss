var gradearr = {0:"--",1:"倔强青铜Ⅲ",2:"倔强青铜Ⅱ",3:"倔强青铜Ⅰ",
			4:"秩序白银Ⅲ",5:"秩序白银Ⅱ",6:"秩序白银Ⅰ",
			7:"荣耀黄金Ⅲ",8:"荣耀黄金Ⅱ",9:"荣耀黄金Ⅰ",
			10:"尊贵铂金Ⅲ",11:"尊贵铂金Ⅱ",12:"尊贵铂金Ⅰ",
			13:"永恒钻石Ⅲ",14:"永恒钻石Ⅱ",15:"永恒钻石Ⅰ",16:"最强王者",
			17:"荣耀黄金Ⅳ",18:"尊贵铂金Ⅴ",19:"尊贵铂金Ⅳ",20:"永恒钻石Ⅴ",21:"永恒钻石Ⅳ"}
var area_type_arr = ["5V5","大乱斗","排位赛"];
var battle_type_arr = {4:"排位",5:"匹配",9:"大乱斗"};
//格式化日期,
function formatDate(date,format){
  var paddNum = function(num){
    num += "";
    return num.replace(/^(\d)$/,"0$1");
  }
  //指定格式字符
  var cfg = {
     yyyy : date.getFullYear() //年 : 4位
    ,yy : date.getFullYear().toString().substring(2)//年 : 2位
    ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
    ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
    ,d  : date.getDate()   //日 : 如果1位的时候不补0
    ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
    ,hh : date.getHours()  //时
    ,mm : date.getMinutes() //分
    ,ss : date.getSeconds() //秒
  }
  format || (format = "yyyy-MM-dd hh:mm:ss");
  return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
} 