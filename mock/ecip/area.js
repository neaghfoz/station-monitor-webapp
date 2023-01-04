const data = {
  'code': 200,
  'message': '操作成功',
  'data': [{
    'id': '1254679584473874432',
    'createBy': {
      'id': '-1'
    },
    'createDate': '2020-04-27 15:51:38',
    'updateBy': {
      'id': '-1'
    },
    'updateDate': '2020-04-27 15:51:38',
    'parentId': '',
    'parentName': '',
    'parentIds': '',
    'nodeLevel': 0,
    'name': '中国',
    'sort': -1,
    'children': [{
      'id': '1254691795112034304',
      'createBy': {
        'id': '-1'
      },
      'createDate': '2020-04-27 16:40:10',
      'updateBy': {
        'id': '-1'
      },
      'updateDate': '2020-04-27 16:40:10',
      'parentId': '1254679584473874432',
      'parentName': '',
      'parentIds': ',1254679584473874432,',
      'nodeLevel': 1,
      'name': '广州',
      'sort': -1,
      'children': [{
        'id': '1254696036614537216',
        'createBy': {
          'id': '-1'
        },
        'createDate': '2020-04-27 16:57:01',
        'updateBy': {
          'id': '-1'
        },
        'updateDate': '2020-04-27 16:57:01',
        'parentId': '1254691795112034304',
        'parentName': '',
        'parentIds': ',1254691795112034304,1254679584473874432,',
        'nodeLevel': 2,
        'name': '天河区',
        'sort': -1,
        'type': 'district',
        'code': 'Tianhe',
        'title': '天河区'
      }],
      'type': 'city',
      'code': 'Guangzhou',
      'title': '广州'
    }, {
      'id': '1254722953182969856',
      'createBy': {
        'id': '-1'
      },
      'createDate': '2020-04-27 18:43:58',
      'updateBy': {
        'id': '-1'
      },
      'updateDate': '2020-04-27 18:43:58',
      'parentId': '1254679584473874432',
      'parentName': '',
      'parentIds': ',1254679584473874432,',
      'nodeLevel': 1,
      'name': '杭州',
      'sort': 1,
      'type': 'city',
      'code': 'Hangzhou',
      'title': '杭州'
    }],
    'type': 'country',
    'code': 'China',
    'title': '中国'
  }, {
    'id': '1254720385866268672',
    'createBy': {
      'id': '-1'
    },
    'createDate': '2020-04-27 18:33:46',
    'updateBy': {
      'id': '-1'
    },
    'updateDate': '2020-04-27 18:33:46',
    'parentId': '',
    'parentName': '',
    'parentIds': '',
    'nodeLevel': 0,
    'name': '美国',
    'sort': 0,
    'children': [{
      'id': '1254720487850770432',
      'remarks': '111',
      'createBy': {
        'id': '-1'
      },
      'createDate': '2020-04-27 18:34:11',
      'updateBy': {
        'id': '-1'
      },
      'updateDate': '2020-04-28 09:41:57',
      'parentId': '1254720385866268672',
      'parentName': '',
      'parentIds': ',1254720385866268672,',
      'nodeLevel': 1,
      'name': '纽约',
      'sort': -1,
      'type': 'city',
      'code': 'NewYork',
      'title': '纽约'
    }],
    'type': 'country',
    'code': 'America',
    'title': '美国'
  }],
  'success': true
}

module.exports = data
