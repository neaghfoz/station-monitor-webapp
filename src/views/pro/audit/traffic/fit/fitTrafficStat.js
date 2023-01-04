import request from 'ecip-web/utils/request'

export const fitStatByTransDay = (params, data) => {
	return request({
	   url: 'api/v1/audit/traffic/fitStatByTransDay',
	   method: 'post',
	   params: params,
	   data: data
	})
}

export const fitStatByPathType = (params, data) => {
	return request({
	   url: 'api/v1/audit/traffic/fitStatByPathType',
	   method: 'post',
	   params: params,
	   data: data
	})
}

export const exportExcel = (params, data) => {
  return request({
    url: 'api/v1/audit/traffic/fit/exportExcel',
    method: 'post',
    params: params,
    data: data,
  })
}

