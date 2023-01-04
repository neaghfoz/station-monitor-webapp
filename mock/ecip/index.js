// const Mock = require('mockjs')
const depts = require('./dept.js')
const users = require('./user.js')
const areas = require('./area.js')

module.exports = [
  // mock get all routes form server
  {
    url: '/api/v1/dept/sysrDept/data',
    type: 'get',
    response: _ => {
      return depts
    }
  },
  {
    url: '/api/v1/system/dept/tree',
    type: 'get',
    response: _ => {
      return depts
    }
  },
  {
    url: '/api/v1/treedemo/treeDemo/data',
    type: 'post',
    response: _ => {
      return depts
    }
  },
  {
    url: '/api/v1/sysrUser/page',
    type: 'get',
    response: _ => {
      return users
    }
  },
  {
    url: '/api/v1/sysrUser/data',
    type: 'post',
    response: _ => {
      return users
    }
  },
  {
    url: '/api/v1/sysrUser/findDataByIds',
    type: 'post',
    response: _ => {
      return {
        'code': 200,
        'message': '操作成功',
        'data': [
          {
            'id': '1276391174197739520',
            'username': 'liutang',
            'realName': '临桂六塘收费站',
            'sex': '0',
            'ustatus': 1,
            'createTime': '2020-06-26T00:45:45.000+0800',
            'tenantId': '1249628559274672128',
            'sexText': '男',
            'deptName': '',
            'orgName': '六塘收费站'
          }
        ],
        'success': true
      }
    }
  },
  {
    url: '/api/v1/user/sysrUser/findDataByIds',
    type: 'post',
    response: _ => {
      return {
        'code': 200,
        'message': '操作成功',
        'data': [
          {
            'id': '1276391174197739520',
            'username': 'liutang',
            'realName': '临桂六塘收费站',
            'sex': '0',
            'ustatus': 1,
            'createTime': '2020-06-26T00:45:45.000+0800',
            'tenantId': '1249628559274672128',
            'sexText': '男',
            'deptName': '',
            'orgName': '六塘收费站'
          }
        ],
        'success': true
      }
    }
  },
  {
    url: '/api/v1/area/sysrArea/data',
    type: 'get',
    response: _ => {
      return areas
    }
  }

]
