import request from 'ecip-web/utils/request'

// 首页获取场次
export const getSimulationexam = (type) => {
  return request({
    url: `/api/v1/train/baseexam/index/${type}`,
    method: 'get',
    params: {}
  })
}

// 获取用户参与场次数
export const historyCount = (id, type) => {
  return request({
    url: `/api/v1/train/baseexam/historyCount/${id}/${type}`,
    method: 'get',
    params: {}
  })
}

// 开始考试
export const SimulationexamStart = (id, type) => {
  return request({
    url: `/api/v1/train/exam/start/${id}/${type}`,
    method: 'get',
    data: {}
  })
}

// 提交答案
export const ExamSubmitAnswer = (examMode, data) => {
  return request({
    url: `/api/v1/train/baseexam/submitAnswer/${examMode}`,
    method: 'post',
    data: data
  })
}

// 查看答案和解析
export const ExamAnswerAnalysis = (id) => {
  return request({
    url: `/api/v1/train/baseexam/answerAnalysis/${id}`,
    method: 'get',
    data: {}
  })
}

// 草稿箱
export const ExamDrafts = (id, data) => {
  return request({
    url: `/api/v1/train/exam/drafts/${id}`,
    method: 'post',
    data: data
  })
}

// 正式考试已经考过，根据场次查看考试结果
export const ResultByExamNum = (id, data) => {
  return request({
    url: `/api/v1/train/baseexam/resultByExamNum/${id}`,
    method: 'get',
    data: data
  })
}

// 重做试卷,根据练习记录查询场次
export const FindExamNum = (examHistoryId) => {
  return request({
    url: `/api/v1/train/examHistory/findExamNum/${examHistoryId}`,
    method: 'get',
    data: {}
  })
}
