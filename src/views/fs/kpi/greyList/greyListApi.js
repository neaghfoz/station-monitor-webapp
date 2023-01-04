import request from 'ecip-web/utils/request'

const findList = (params, data) => {
  return request({
    url: 'api/v1/kpi/greyList/findList',
    method: 'post',
    params: params,
    data: data
  })
}

const addItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/greyList/save',
    method: 'post',
    params: params,
    data: data
  })
}

const enableItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/greyList/enadble',
    method: 'post',
    params: params,
    data: data
  })
}

const deleteItem = (id) => {
  return request({
    url: `api/v1/kpi/greyList/delete/${id}`,
    method: 'delete',
    params: id,
    data: {}
  })
}

export default {findList,addItem,enableItem,deleteItem}
