import request from 'ecip-web/utils/request'

let findByEntity = (data) => {
  return request({
    url: 'api/v1/common/sysOrg/findByEntity',
    method: 'post',
    data: data
  });
}

let findTree = (param, data) => {
  return request({
    url: 'api/v1/common/sysOrg/orgList',
    method: 'get',
    param: param,
    data: data
  })
}

let findTreeAll = (param, data) => {
  return request({
    url: 'api/v1/common/sysOrg/orgListAll',
    method: 'get',
    param: param,
    data: data
  })
}

let getCurUserOrg = () => {
  return request({
    url: 'api/v1/common/sysOrg/getCurrentOrg',
    method: 'get'
  });
}

export default { findByEntity, findTree, getCurUserOrg }
