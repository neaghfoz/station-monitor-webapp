import request from 'ecip-web/utils/request'

/**
 * 获取日常备注
 * @param params
 */
export const findList = (data) => {
  return request({
    url: '/api/v1/toll/lane/dailyMark/findList',
    method: 'post',
    data: data
  })
}

/**
 * 更新
 * @param data
 */
export const update = (data) => {
  return request({
    url: '/api/v1/toll/lane/dailyMark/update',
    method: 'post',
    data: data
  })
}

/**
 * 获取字符内容
 * @param params
 */
export const getAllContent= (data) => {
  return request({
    url: '/api/v1/toll/lane/dailyMark/getAllContent',
    method: 'post',
    data: data
  })
}


export default {findList,update,getAllContent}
