import request from 'ecip-web/utils/request'

export const getData = (url, params, data, isPost) => {
  const postReq = {
    url: url,
    method: 'post',
    params: params,
    data: data || {}
  }

  const getReq = {
    url: url,
    method: 'get',
    params: params
  }

  return request(isPost ? postReq :getReq);

}


