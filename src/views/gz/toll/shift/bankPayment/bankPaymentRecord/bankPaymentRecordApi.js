import request from 'ecip-web/utils/request'

const findPage = (params, data) => {
  return request({
    url: '/api/v1/shift/bankPaymentRecord/findPage',
    method: 'post',
    params: params,
    data: data
  })
}

const getCurrentOrg = () => {
  return request({
    url: '/api/v1/common/sysOrg/getCurrentOrg',
    method: 'get',
    params: {}
  })
}


const findOrgByAuth = (data) => {
  return request({
    url: '/api/v1/common/sysOrg/findByAuth',
    method: 'get',
    params: data
  })
}

const findDetailList = (data) => {
  return request({
    url: '/api/v1/shift/bankPaymentRecord/findDetailList',
    method: 'post',
    data: data
  })
}

const save = (data) => {
  return request({
    url: '/api/v1/shift/bankPaymentRecord/save',
    method: 'post',
    data: data
  })
}

const detail = (id) => {
  return request({
    url: '/api/v1/shift/bankPaymentRecord/detail/'+id,
    method: 'get'
  })
}

const delRecord = (id) => {
  return request({
    url: '/api/v1/shift/bankPaymentRecord/'+id,
    method: 'delete'
  })
}


export default {
  findPage,
  getCurrentOrg,
  findOrgByAuth,
  findDetailList,
  save,
  detail,
  delRecord
}
