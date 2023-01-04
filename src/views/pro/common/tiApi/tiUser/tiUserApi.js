import request from 'ecip-web/utils/request'

let getUserNodeLevel = () => {
  return request({
    url: 'api/v1/common/sysOrg/getCurrentOrg',
    method: 'get'
  });
}

let isUserOrgConf = () => {
  return request({
    url: 'api/v1/common/sysUser/isUserOrgConfig',
    method: 'get'
  });
}

let getCurUserOrg = () => {
  return request({
    url: 'api/v1/common/sysOrg/getCurrentOrg',
    method: 'get'
  });
}

let getCurUserInfo = (params, data) => {
  return request({
    url: '/api/v1/common/sysUser/getUserByEntity',
    method: 'get',
    params: params,
    data: data
  })
}

export default { getUserNodeLevel, isUserOrgConf, getCurUserOrg, getCurUserInfo }
