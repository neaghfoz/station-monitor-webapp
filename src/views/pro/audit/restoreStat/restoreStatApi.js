import request from 'ecip-web/utils/request'

export const getData = (page,data) => {
  return request({
    url: 'api/v1/audit/list/reptStat/findRestoreStat',
    method: 'post',
    params: page,
    data: data
  })
}
