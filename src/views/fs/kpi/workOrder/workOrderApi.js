import request from 'ecip-web/utils/request'

 const findWorkOrders = (params, data) => {
  return request({
    url: 'api/v1/kpi/workOrder/findList',
    method: 'post',
    params: params,
    data: data
  })
}

 const deleteItem = (params, data) => {
  return request({
    url: 'api/v1/kpi/workOrder/delete',
    method: 'post',
    params: params,
    data: data
  })
}

const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/kpi/workOrder/exp',
    method: 'post',
    params: params,
    data: data,
  })
}

export default {deleteItem,findWorkOrders,exportExcel}
