/**
 * 编码转化
 * @param text 文本
 * @returns 转码后文本
 */
export function cjkEncode(text)
{
  if (text == null) {
    return "";
  }
  var newText = "";
  for(var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if (code >= 128 || code == 91 || code == 93) {  //91 is "[", 93 is "]".
      newText += "[" + code.toString(16) + "]";
    } else {
      newText += text.charAt(i);
    }
  }
  return newText;
}

/**
 * json参数转url
 * @param params json格式参数
 * @returns 参数url
 */
export  function getParam(params) {
  var result = '&';
  for(let key in params)
  {
    result += key + '=' + encodeURIComponent(params[key]) + '&';
  }
  return result + '1';
}

/**
 * 获取报表url
 * @param reportSrc 文件路径
 * @param params 参数
 * @returns 报表url
 */
export function getUrl(reportSrc, params) {

  var baseUrl = process.env.NODE_ENV === 'development' ? '' : process.env.BASE_URL
  params.curTimeFineReport = new Date().getTime();
  var url = baseUrl + reportSrc + this.getParam(params);
  return url.replace('//', '/')
}


export default { getUrl, cjkEncode, getParam }
