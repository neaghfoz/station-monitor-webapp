import request from 'ecip-web/utils/request'

// 理论训练首页
export const getTheoriestrain = (id) => {
  return request({
    url: `/api/v1/train/theoriestrain/index`, // /${id}
    method: 'get',
    params: {}
  })
}

// 理论训练科目试题统计
export const getQuestionCount = (data) => {
  return request({
    url: `/api/v1/train/question/count`,
    method: 'post',
    data: data // {"type":type,"knowledgeId":id}
  })
}

// 提交练习记录
export const save = (data) => {
  return request({
    url: '/api/v1/train/theoriestrain/submitAnswer',
    method: 'post',
    data: data
  })
}

// 理论训练 - 开始练习
export const startPracticing = (entry) => {
  return request({
    url: `/api/v1/train/theoriestrain/startPracticing/${entry}`,
    method: 'get',
    data: {}
  })
}

// 综合训练 - 开始练习
export const comStartPracticing = (data) => {
  return request({
    url: `/api/v1/train/compositetrain/start`,
    method: 'post',
    data: data
  })
}

// 分页查询练习记录
export const practicingHistory = (params, data) => {
  return request({
    url: `/api/v1/train/examHistory/findPage`,
    method: 'post',
    params: params,
    data: data
  })
}

// 添加到错题集
export const favorSave = (data) => {
  return request({
    url: `/api/v1/train/test/favor/save`,
    method: 'put',
    data: data
  })
}

// 设置实操训练流程
export const operationtrainStart = (examType, data) => {
  return request({
    url: `/api/v1/train/operationtrain/start/${examType}`,
    method: 'get',
    params: data
  })
}

// 实操训练 - 考试记录解答列表
export const examquestionsituation = (params, data) => {
  return request({
    url: `/api/v1/train/examquestionsituation/findPage`,
    method: 'post',
    params: params,
    data: data
  })
}

// 实操训练 - 练习模式-重新练习
export const restart = (examMode, examHistoryId) => {
  return request({
    url: `/api/v1/train/baseexam/restart/${examMode}/${examHistoryId}`,
    method: 'post',
    data: {}
  })
}

// 实操训练 - 考核模式-开始或暂停
export const startOrSuspend = (examSessionId, data) => {
  return request({
    url: `/api/v1/train/exam/startOrSuspend/${examSessionId}`,
    method: 'post',
    data: data
  })
}
