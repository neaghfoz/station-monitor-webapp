import request from 'ecip-web/utils/request'

export const dictList=(dictType)=>
{
  return request({
    url: `api/v1/common/dict/dictList/${dictType}`,
    method: 'get'
  });
}


export const dictMap=(dictType)=>
{
  return request({
    url: `api/v1/common/dict/dictMap/${dictType}`,
    method: 'get'
  });
}
