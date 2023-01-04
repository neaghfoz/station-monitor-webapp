import request from 'ecip-web/utils/request'

export const findPage = (params, data) => {
  return request({
    url: 'api/v1/user/sysrUser/page',
    method: 'post',
    params: params,
    data: data
  })
}

export const getRole = (data) => {
  return request({
    url: 'api/v1/role/sysrRole/data',
    method: 'post',
    data: data
  })
}

// 根据个人信息获取考试场次分配情况
export const findSettingNumPage = (params, data) => {
  return request({
    url: 'api/v1/train/examnumuser/findSettingNumPage',
    method: 'post',
    params: params,
    data: data
  })
}

// 一对一分配考试场次及人员
export const settingOperator = (data) => {
  return request({
    url: 'api/v1/train/examnumuser/settingOperator',
    method: 'post',
    data: data
  })
}

// 考试场次批量分配人员
export const batchSettingOperator = (data) => {
  return request({
    url: 'api/v1/train/examnumuser/batchSettingOperator',
    method: 'post',
    data: data
  })
}

// 删除人员分配的考试场次
export const deleteByIds = (operatorNo, examNumId) => {
  return request({
    url: `api/v1/train/examnumuser/delete/${operatorNo}/${examNumId}`,
    method: 'delete',
    params: {}
  })
}
