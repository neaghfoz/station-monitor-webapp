import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XlLSXStyle from 'tibms-xlsx-style'

/**
 * 数据分组统计
 * @param dataArr 数组
 * @param groupFn 分组函数 function(item){ return [item.id] }
 * @param sumFn 分组函数 function(item,sum){  }
 * @param whereFn 过滤函数 function(item){ item.id==5 }
 * @returns {*[]}
 */
export const dataGroup = (dataArr, columnNameArr, groupFn, sumFn, whereFn) => {
  const groups = {}
  dataArr.forEach(function(o) {
    if (whereFn && !whereFn(o)) {
      return true
    }
    let group = groupFn(o)
    if (group instanceof Array) {
      group = JSON.stringify(group)
    }
    groups[group] = groups[group] || (sumFn ? {} : [])
    if (sumFn) {
      sumFn(o, groups[group])
    } else {
      groups[group].push(o)
    }
  })
  if (columnNameArr && columnNameArr.length > 0) {
    return Object.keys(groups).map(function(group) {
      const row = groups[group]
      group = new Function('return' + group)()
      if (group instanceof Array) {
        for (var cIdx in columnNameArr) {
          row[columnNameArr[cIdx]] = group[cIdx]
        }
      } else {
        row[columnNameArr] = group
      }
      return row
    })
  } else {
    return groups
  }
}

/**
 * 将对象转换为数组
 * @param mapData {}数据
 * @param dataFun(key,row) 转为数据行数据处理
 * @returns {*[]}
 */
export const mapToArray = (mapData, dataFun) => {
  return Object.keys(mapData).map(function(key) {
    const row = mapData[key]
    dataFun(key, row)
    return row
  })
}

/**
 * 自定义翻译
 * @param datas
 * @param transFun
 */
export const transfer = (datas, transFun) => {
  for (const key in datas) {
    transFun(datas[key])
  }
}

/**
 * 车种转换
 * @param vehicleClass
 * @param isCheck
 * @returns {string|*}
 */
export const transferVehicleClass = (vehicleClass, isCheck) => {
  switch (Number(vehicleClass)) {
    case 0:
      return '普通车'
    case 6:
      return '公务车'
    case 8:
      return '军警车'
    case 10:
      return '紧急车'
    case 12:
      return '免费'
    case 14:
      return '车队'
    case 21:
      return '绿通车'
    case 22:
      return '联合收割机'
    case 23:
      return '抢险救灾'
    case 24:
      return 'J1类集装箱车'
    case 25:
      return '大件运输'
    case 26:
      return '应急保障车'
    case 27:
      return '货车列车或半挂汽车列车'
    case 28:
      return 'J2类型集装箱'
    default:
      return isCheck ? '' : '未知' + vehicleClass
  }
}

/**
 * 车型转换
 * @param vehicleType
 * @param isCheck
 * @returns {string|*}
 */
export const transferVehicleType = (vehicleType, isCheck) => {
  switch (Number(vehicleType)) {
    case 1:
      return '一型客车'
    case 2:
      return '二型客车'
    case 3:
      return '三型客车'
    case 4:
      return '四型客车'
    case 11:
      return '一型货车'
    case 12:
      return '二型货车'
    case 13:
      return '三型货车'
    case 14:
      return '四型货车'
    case 15:
      return '五型货车'
    case 16:
      return '六型货车'
    case 21:
      return '一型专项作业车'
    case 22:
      return '二型专项作业车'
    case 23:
      return '三型专项作业车'
    case 24:
      return '四型专项作业车'
    case 25:
      return '五型专项作业车'
    case 26:
      return '六型专业作业车'
    default:
      return isCheck ? '' : '未知' + vehicleType
  }
}

/**
 * 通行路径方式转换
 * @param pathType
 * @param isCheck
 * @returns {string|*}
 */
export const transferPathType = (pathType, isCheck) => {
  switch (Number(pathType)) {
    case 1:
      return '本路段进本路段出'
    case 2:
      return '本路段进其它路段出'
    case 3:
      return '其它路段进本路段出'
    case 4:
      return '途径路段'
    default:
      return isCheck ? '' : '未知' + pathType
  }
}

/**
 * 计费类型转换
 * @param pathType
 * @param isCheck
 * @returns {string|*}
 */
export const transferExitFeeType = (exitFeeType, isCheck) => {
  switch (Number(exitFeeType)) {
    case 1:
      return '按OBU累计优惠后金额计费'
    case 2:
      return '按OBU内累计优惠前金额计费'
    case 3:
      return '按CPC累计金额计费'
    case 4:
      return '省中心在线服务计费'
    case 5:
      return '部中心在线服务计费 '
    case 6:
      return '按全网最小费额计费'
    case 11:
      return '开放式计费'
    default:
      return isCheck ? '' : '未知' + exitFeeType
  }
}

/**
 * 差异原因转换
 * @param diffType
 * @param isCheck
 * @returns {string}
 */
export const transferDiffReason = (diffType, isCheck) => {
  switch (diffType) {
    case '1':
      return '按OBU内累计优惠后金额计费'
    case '3':
      return '按CPC卡内累计金额计费'
    case '4':
      return '省中心在线服务计费'
    case '5':
      return '部中心在线服务计费'
    case '6':
      return '按全网最小费额计费'
    case '20':
      return 'ETC转现金'
    case '21':
      return '拒付'
    case '22':
      return '省中心拆分0元'
    case '23':
      return '路段拆分0元'
    case '30':
      return '无差异'
    case '31':
      return '行程多拆'
    case 'uncFee':
      return '争议拒付-坏账'
    case 'other':
      return '其它'
    default:
      return isCheck ? '' : '未知' + diffType
  }
}

/*
  tableHead 头
  tableBody 内容
  sheet excel
 */
let initStyle = (tableHead, tableBody, sheet) => {
  var headRows = tableHead.children.length;
  var bodyRows = tableBody.children.length;
  //设置宽度
  for(let i = 0; i < headRows + bodyRows; i++) {
    sheet['!cols'].push({wpx: 100});
  }
  // 设置单元格
  XEUtils.objectEach(sheet, (v, k) => {
    if (!XEUtils.isArray(v) && !XEUtils.isString(v)) {
      var rowNum = k.replaceAll(/[a-zA-Z]/g, '');
      if (rowNum <= headRows) {
        v.s = {
          font: {sz: 13, bold: true, name: 'Microsoft JhengHei'},
          alignment: {wrapText: true, vertical: 'center', horizontal: 'center'}
        }
      } else {
        v.s = {
          font: {sz: 11, bold: false, name: 'Microsoft JhengHei'},
          alignment: {wrapText: true, vertical: 'center', horizontal: 'center'}
        }
      }
    }
  })
}

/**
 * 导出报表数据
 * @param refTableName
 * @param fileName
 */
export const exportExcel = (refTable, fileName) => {
  const toBuffer = (wbout) => {
    const buf = new ArrayBuffer(wbout.length)
    const view = new Uint8Array(buf)
    for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xFF
    return buf
  }
  // 转换数据
  const book = XLSX.utils.book_new()
  // 表头
  let tableHead = refTable.$el.querySelector('.vxe-table--header>thead')
  tableHead = tableHead.cloneNode(true)
  // 表数据
  let tableBody = refTable.$el.querySelector('.body--wrapper>.vxe-table--body>tbody')
  tableBody = tableBody.cloneNode(true)
  // 新建表,不对现有数据进行调整
  const myTable = document.createElement('table')
  myTable.appendChild(tableHead)
  myTable.appendChild(tableBody)

  const sheet = XLSX.utils.table_to_sheet(myTable)
  var hs= {
    font: { sz: 10, color: { rgb: "ff0000" }, bold: true },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" }},
  }

  //设置样式
  initStyle(tableHead,tableBody,sheet);

  XLSX.utils.book_append_sheet(book, sheet)
  // const wbout = XLSX.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' })
  const ws = XlLSXStyle.write(book,{ bookType: 'xlsx', bookSST: false, type: 'binary' }); //使用样式write
  const blob = new Blob([toBuffer(ws)], { type: 'application/octet-stream' })
  // 保存导出
  FileSaver.saveAs(blob, fileName + '.xlsx')
}



/**
 * 根据level获取orgNo
 */
export const  getOrgNo =(sysOrg) => {
  if(!sysOrg)
    return 0;
  switch (Number(sysOrg.nodeLevel)) {
    case 0:
      return sysOrg.provinceNo;
    case 1:
      return sysOrg.centerNo;
    case 2:
      return sysOrg.roadNo;
    case 3:
      return sysOrg.branchNo;
    case 4:
      return sysOrg.stationNo;
    default:
      return 0;
  }
}

/**
 * 机构树
 * @param sysOrg
 * @param key
 * @param array
 */
export const getOrgTreeData =(sysOrg,key,array,minLevel) => {
  if(sysOrg)
  {
    sysOrg.forEach(item => {
        if(item[key] != '0'){
          array.push(item[key]);
        }
        if(item.children && item.nodeLevel <=minLevel)
        {
          getOrgTreeData(item.children,key,array,minLevel);
        }
      }
    );
  }
}


/**
 * 从机构中获取路段
 * @param sysOrg
 * @param array
 */
export const getRoadList =(sysOrg,array) => {
  const key = 'roadId'
  const level = 2
  if(sysOrg)
  {
    sysOrg.forEach(item => {
        if(item[key] != '0'){
          array.push(item);
        }
        if(item.children && item.nodeLevel <=level)
        {
          getRoadList(item.children,array);
        }
      }
    );
  }
}


/**
 * 从机构中获取收费站
 * @param sysOrg 机构树结构
 * @param array 输出的数组
 */
export const getStation =(sysOrg,array) => {
  const key = 'stationId'
  const level = 4
  if(sysOrg)
  {
    sysOrg.forEach(item => {
        if(item[key] != '0'){
          item['staName'] = `[${item[key]}]`+item['stationName']
          array.push(item);
        }
        if(item.children && item.nodeLevel <=level)
        {
          getStation(item.children,array);
        }
      }
    );
  }
}

/**
 * 获取当前机构所在路径
 * @param currentOrgId
 * @param sysOrg
 */
var nodePathArray = [];
export const getCurrentOrgPath= (currentOrgId,sysOrg) =>{
   nodePathArray = [];
  try {
    for (let i = 0; i < sysOrg.length; i++) {
       getOrgPath(sysOrg[i],currentOrgId);
    }
    return nodePathArray;
  } catch (e) {
    return nodePathArray;
  }
}


export const getOrgPath = (sysOrg,currentOrgId) => {
  nodePathArray.push(sysOrg.name);
  if(sysOrg.id == currentOrgId){
    throw ("over");
  }
  if(sysOrg.children && sysOrg.children.length > 0){

    for (var i = 0; i < sysOrg.children.length; i++) {
      getOrgPath(sysOrg.children[i],currentOrgId);
    }
    // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
    nodePathArray.pop();

  }else {
    // 找到叶子节点时，删除路径当中的该叶子节点
    nodePathArray.pop();
  }

}

/**
 * 获取表单列Map
 * @param columns
 * @param columnMap
 */
export const getTableColumnMap =(columns,columnMap) =>{
  columns.forEach(item=>{
    if(item.children){
      item.children.forEach(child=>{
        child.title = item.title + "-" + child.title;
      })
      getTableColumnMap(item.children,columnMap);
    }else if(item.field){
      columnMap[item.field] = item.title;
    }
  })
}


export const treeChildren2List = (treeData) => {
    let treeArray ;
    if (treeData instanceof Array){
      treeArray = treeData;
    }else{
      treeArray.push(treeData)
    }

    let list = [];
    let handle = (data)=>{
      data.forEach(x=>{
        if (x.children && x.children.length > 0){
          handle(x.children);
        }
        list.push(x);
      })
    }

    handle(treeArray);
    return list;
}

