import request from 'ecip-web/utils/request'
import collectConstant from "@/views/cy/collect/collectStatus/collectConstant";

const findList = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/findList',
    method: 'post',
    params: params,
    data: data
  })
}

const findOnlineList = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/findOnlineList',
    method: 'post',
    params: params,
    data: data
  })
}

const findById = (params, data) => {
  return request({
    url: 'api/v1/collect/collectStatus/findById',
    method: 'post',
    params: params,
    data: data,
  })
}
const save = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/save',
    method: 'post',
    params: params,
    data: data
  })
}

const saveImport = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/saveImport',
    method: 'post',
    params: params,
    data: data
  })
}

const findDiscount = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/findDiscount',
    method: 'post',
    params: params,
    data: data
  })
}

const saveDiscount = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/saveDiscount',
    method: 'post',
    params: params,
    data: data
  })
}

const submit = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/submit',
    method: 'post',
    params: params,
    data: data
  })
}

const clean = (params, data) => {
  return request({
    url: '/api/v1/collect/collectStatus/clean',
    method: 'post',
    params: params,
    data: data
  })
}

/**
 * 交调站的对比
 */
var compiledispatching = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    fractureSurfaceID: a.fractureSurfaceID,
    fractureSurfaceName: a.fractureSurfaceName,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + a.fractureSurfaceName + ' 的数据: ';
  let records = '';
  console.log("aProps:" + aProps);
  for (let i = 0; i < aProps.length; i++) {

    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;

      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";"
      ;

      updateRecords[propName] = b[propName] == '' ? '' : b[propName];
    } else {
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 长益北线各门架流量统计的对比
 */
var compileCyGantryFlowSum = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    gantryId: a.gantryId,
    gantryName: a.gantryName,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + a.gantryName + ' 的数据: ';
  let records = '';
  console.log("aProps:" + aProps);
  for (let i = 0; i < aProps.length; i++) {

    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;

      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
      updateRecords[propName] = b[propName] == '' ? '' : b[propName];
    } else {
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 唐津门架和收费站
 */
var compileTjSum = (a, b, updateList, _this,type) => {
  let tjId = type == 'station'?a.stationId:a.gantryId;
  let tjName = type == 'station'?a.stationName:a.gantryName;
  let updateRecords = {
    record: '',
    gantryId: tjId,
    gantryName: tjName,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    columnStr: ''
  }
  
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + tjName +  " " +a.mediaTypeName + ' 的数据: ';
  let records = '';
  console.log("aProps:" + aProps); 

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;

      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
      updateRecords[propName] = b[propName] == '' ? '' : b[propName];
    } else {
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}
/**
 * 长益北线各站车流收入的对比
 */
var compileStationFlowIncome = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了数据: ';
  let records = '';
  console.log("aProps:" + aProps);
  for (let i = 0; i < aProps.length; i++) {

    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;

      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
      updateRecords[propName] = b[propName] == '' ? '' : b[propName];
    } else {
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);

  }
}

/**
 * 收费分项指标的对比
 */
var compileItemizedCharges = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    stationId: a.stationId,
    stationName: a.stationName,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + a.stationName + ' 的数据: ';
  let records = '';
  console.log("aProps:" + aProps);
  for (let i = 0; i < aProps.length; i++) {

    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;

      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
      updateRecords[propName] = b[propName] == '' ? '' : b[propName];
    } else {
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 通行费征收任务 的对比
 */
var compileStationActGetFee = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    stationId: a.stationId,
    stationName: a.stationName,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + a.stationName + ' 的数据: ';
  let records = '';
  console.log("aProps:" + aProps);
  for (let i = 0; i < aProps.length; i++) {

    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;

      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
      updateRecords[propName] = b[propName] == '' ? '' : b[propName];
    } else {
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 利息数 的对比
 */
var compileInterestAmount = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    collectYear: a.collectYear,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + a.collectYear + ' 的数据: ';
  let records = '';
  console.log("aProps:" + aProps);
  for (let i = 0; i < aProps.length; i++) {

    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;

      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
      updateRecords[propName] = b[propName] == '' ? '' : b[propName];
    } else {
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 节假日管理的对比
 */
var compileHoliday = (a, b, updateList, _this) => {
  let updateRecords = {
    id: b.id,
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    roadId: _this.queryParams.roadId,
    operate: '修改了数据表'
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了数据: ';
  let records = '';
  for(let i = 0; i < aProps.length; i++) {
    // let updates = {};
    // Object.assign(updates,updateRecords)
    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + a[propName] + ', 修改后: ' + b[propName] + ";";
      updateRecords[propName] = b[propName];
    }else{
      updateRecords[propName] = a[propName];
    }
  }
  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 门架的对比
 */
var compileGantry = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    gantryId: a.gantryId,
    mediaType: a.mediaType,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    roadId: _this.queryParams.roadId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + a.gantryName + ' 交易类型为 ' + a.mediaTypeName + ' 的数据: ';
  let records = '';

  if(_this.queryParams.tableId === '20' &&
    _this.initDiscountRate != _this.discountForm.discountRate){
      let updateR = '修改了 优惠车系数，修改前：' + _this.initDiscountRate + '，修改后：'
       + _this.discountForm.discountRate;
      records = records + updateR;

  }

  for(let i = 0; i < aProps.length; i++) {
    // let updates = {};
    // Object.assign(updates,updateRecords)
    let propName = aProps[i];

    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;
      if (_this.queryParams.tableId === '20' || _this.queryParams.tableId === '70') {
        let aPropName = a[propName] == null ? '' : Number(a[propName]).toFixed(2);
        let bPropName = b[propName] == '' ? '' : Number(b[propName]).toFixed(2);
        records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
        updateRecords[propName] = b[propName] == '' ? '' : Number(b[propName]);
      } else {
        let aPropName = a[propName] == null ? '' : Number(a[propName]);
        let bPropName = b[propName] == '' ? '' : Number(b[propName]);
        records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
        updateRecords[propName] = b[propName] == '' ? '' : b[propName];
      }
    }else{
      updateRecords[propName] = a[propName];
    }

  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 断面的对比
 */
 var compileFractureSurface = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    fractureSurfaceId: a.fractureSurfaceId,
    dataType:a.dataType,
    mediaType: a.mediaType,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    roadId: _this.queryParams.roadId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + a.fractureSurFaceName + ' 数据类型为 '
   + a.dataTypeName + ' 交易类型为 ' + a.mediaTypeName + ' 的数据: ';
  let records = '';  
  for(let i = 0; i < aProps.length; i++) {
    // let updates = {};
    // Object.assign(updates,updateRecords)
    let propName = aProps[i]; 
    if (a[propName] != b[propName] ) {
      updateRecords.columnStr += ',' + propName; 
      let aPropName = a[propName] == null ? '' : Number(a[propName]);
      let bPropName = b[propName] == '' ? '' : Number(b[propName]);
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
      updateRecords[propName] = b[propName] == '' ? '' : b[propName]; 
    }else{
      updateRecords[propName] = a[propName];
    }

  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}


/**
 * 收费站的对比
 */
var compileStation = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    stationId: a.stationId,
    payType: a.payType,
    inOutType: a.inOutType,
    mediaType: a.mediaType,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    roadId: _this.queryParams.roadId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = ''
  if (updateRecords.tableId === '40') {
    operateRecord = '修改了 ' + a.stationName + ' 支付类型为 ' + a.payTypeName + ' 的数据: ';
  } else {
    operateRecord = '修改了 ' + a.stationName + ' 出入口类型为 ' + a.inOutTypeName + '、' + ' 通行介质为 ' + a.mediaTypeName + ' 的数据: ';
  }
  let records = '';
  for(let i = 0; i < aProps.length; i++) {
    // let updates = {};
    // Object.assign(updates,updateRecords)
    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      updateRecords.columnStr += ',' + propName;
      if (_this.queryParams.tableId === '40') {
        let aPropName = a[propName] == null ? '' : Number(a[propName]).toFixed(2);
        let bPropName = b[propName] == '' ? '' : Number(b[propName]).toFixed(2);
        records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
        updateRecords[propName] = b[propName] == '' ? '' : Number(b[propName]);
      } else {
        let aPropName = a[propName] == null ? '' : Number(a[propName]);
        let bPropName = b[propName] == '' ? '' : Number(b[propName]);
        records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
        updateRecords[propName] = b[propName] == '' ? '' : b[propName];
      }

    }else{
      updateRecords[propName] = a[propName];
    }

  }

  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 天气的对比
 */
var compileWeather = (a, b, updateList, _this) => {
   let updateRecords = {
    id: b.id,
    reportDate: _this.queryParams.collectDate,
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    roadId: _this.queryParams.roadId,
    operate: '修改了数据表'
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了 ' + _this.queryParams.roadName + ' 路段的数据: ';
  let records = '';
  for(let i = 0; i < aProps.length; i++) {
    // let updates = {};
    // Object.assign(updates,updateRecords)
    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + a[propName] + ', 修改后: ' + b[propName] + ";";
      updateRecords[propName] = b[propName];
    }else{
      updateRecords[propName] = a[propName];
    }
  }
  if (records && records != '') {
    updateRecords.record = records;
    updateList.push(updateRecords);
  }
}

/**
 * 实际拆分的对比
 */
var compileApctualIncome = (a, b, updateList, _this) => {
  let updateRecords = {
    record: '',
    splitType: a.splitType,
    operate: '修改了数据表',
    collectDate: _this.queryParams.collectDate,
    tableId: _this.queryParams.tableId,
    roadId: _this.queryParams.roadId,
    columnStr: ''
  }
  //取对象a和b的属性名
  let aProps = Object.getOwnPropertyNames(a);
  //去掉最后的 __obj__
  aProps.pop();
  //循环取出属性名，再判断属性值是否一致
  let operateRecord = '修改了拆分类型为 ' + a.splitTypeName + ' 的数据: ';
  let records = '';
  for(let i = 0; i < aProps.length; i++) {
    // let updates = {};
    // Object.assign(updates,updateRecords)
    let propName = aProps[i];
    if (a[propName] != b[propName]) {
      if (propName == 'splitDays' || propName == 'noSplitDays') {
        records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + Number(a[propName]) + ', 修改后: ' + Number(b[propName]) + ";";
        updateRecords[propName] = b[propName];
      } else {
        updateRecords.columnStr += ',' + propName;
        let aPropName = a[propName] == null ? '' : Number(a[propName]).toFixed(2);
        let bPropName = b[propName] == '' ? '' : Number(b[propName]).toFixed(2);
        records = records + operateRecord + _this.columnMap[propName] + ': 修改前: ' + aPropName + ', 修改后: ' + bPropName + ";";
        updateRecords[propName] = b[propName] == '' ? '' : Number(b[propName]);
      }
    }else{
      updateRecords[propName] = a[propName];
    }
  }

  if (records && records != '') {
    updateRecords.record = records;
    console.log("updateRecords.record:", updateRecords)
    updateList.push(updateRecords);
  }
}


/**
 * 交调站checkData
 */
var checkDataDispatching = (updateData, _this) => {


  return true;

}

/**
 * 长益北线各站车流收入checkData
 */
var checkDataStationFlowIncome = (updateData, _this) => {


  return true;

}

/**
 * 长益北线各门架车流量统计checkData
 */
var checkDataCyGantryFlow = (updateData, _this) => {


  return true;

}

/**
 * 通行费征收任务 checkData
 */
var checkDatastationActGetFee = (updateData, _this) => {


  return true;

}


/**
 * 门架checkData
 */
var checkDataGantry = (updateData, _this) => {
  let vehTypeTollCnt = Number(updateData.vehType1Toll) + Number(updateData.vehType2Toll) +
    Number(updateData.vehType3Toll) + Number(updateData.vehType4Toll) + Number(updateData.vehType11Toll) + Number(updateData.vehType12Toll) +
    Number(updateData.vehType13Toll) + Number(updateData.vehType14Toll) + Number(updateData.vehType15Toll) + Number(updateData.vehType16Toll) +
    Number(updateData.vehType21Toll) + Number(updateData.vehType22Toll) + Number(updateData.vehType23Toll) + Number(updateData.vehType24Toll) +
    Number(updateData.vehType25Toll) + Number(updateData.vehType26Toll);

  let vehClassTollCnt = Number(updateData.vehClass0) + Number(updateData.vehClass24) +
    Number(updateData.vehClass25) + Number(updateData.vehClass27) + Number(updateData.vehClass28);

  console.log("vehTypeTollCnt:", vehTypeTollCnt);
  console.log("vehClassTollCnt:", vehClassTollCnt);

  // if (vehTypeTollCnt != vehClassTollCnt) {
  //   _this.$notify.error("存在收费车型总数不等于收费车种总数,请检查！");
  //   return false;
  // }

  let vehTypeFreeCnt = Number(updateData.vehType1Free) + Number(updateData.vehType2Free) +
    Number(updateData.vehType3Free) + Number(updateData.vehType4Free) + Number(updateData.vehType11Free) + Number(updateData.vehType12Free) +
    Number(updateData.vehType13Free) + Number(updateData.vehType14Free) + Number(updateData.vehType15Free) + Number(updateData.vehType16Free) +
    Number(updateData.vehType21Free) + Number(updateData.vehType22Free) + Number(updateData.vehType23Free) + Number(updateData.vehType24Free) +
    Number(updateData.vehType25Free) + Number(updateData.vehType26Free);

  let vehClassFreeCnt = Number(updateData.vehClass8) + Number(updateData.vehClass10) +
    Number(updateData.vehClass14) + Number(updateData.vehClass21) +
    Number(updateData.vehClass22) + Number(updateData.vehClass23) +
    Number(updateData.vehClass26);

  // if (vehTypeFreeCnt != vehClassFreeCnt) {
  //   _this.$notify.error("存在免费车型总数不等于免费车种总数,请检查！");
  //   return false;
  // }

  return true;

}

/**
 * 收费站checkData
 */
var checkDataStation = (updateData, _this) => {
  let vehTypeTollCnt = Number(updateData.vehType1Toll) + Number(updateData.vehType2Toll) +
    Number(updateData.vehType3Toll) + Number(updateData.vehType4Toll) + Number(updateData.vehType11Toll) + Number(updateData.vehType12Toll) +
    Number(updateData.vehType13Toll) + Number(updateData.vehType14Toll) + Number(updateData.vehType15Toll) + Number(updateData.vehType16Toll) +
    Number(updateData.vehType21Toll) + Number(updateData.vehType22Toll) + Number(updateData.vehType23Toll) + Number(updateData.vehType24Toll) +
    Number(updateData.vehType25Toll) + Number(updateData.vehType26Toll);

  let vehClassTollCnt = Number(updateData.vehClass0) + Number(updateData.vehClass24) +
    Number(updateData.vehClass25) + Number(updateData.vehClass27) + Number(updateData.vehClass28) + Number(updateData.vehClass211);

  console.log("vehTypeTollCnt:", vehTypeTollCnt);
  console.log("vehClassTollCnt:", vehClassTollCnt);

  // if (vehTypeTollCnt != vehClassTollCnt) {
  //   _this.$notify.error("存在收费车型总数不等于收费车种总数,请检查！");
  //   return false;
  // }

  let vehTypeFreeCnt = Number(updateData.vehType1Free) + Number(updateData.vehType2Free) +
    Number(updateData.vehType3Free) + Number(updateData.vehType4Free) + Number(updateData.vehType11Free) + Number(updateData.vehType12Free) +
    Number(updateData.vehType13Free) + Number(updateData.vehType14Free) + Number(updateData.vehType15Free) + Number(updateData.vehType16Free) +
    Number(updateData.vehType21Free) + Number(updateData.vehType22Free) + Number(updateData.vehType23Free) + Number(updateData.vehType24Free) +
    Number(updateData.vehType25Free) + Number(updateData.vehType26Free);

  let vehClassFreeCnt = Number(updateData.vehClass8) + Number(updateData.vehClass10) +
    Number(updateData.vehClass14) + Number(updateData.vehClass212) +
    Number(updateData.vehClass22) + Number(updateData.vehClass23) +
    Number(updateData.vehClass26);

  console.log("vehTypeFreeCnt:", vehTypeFreeCnt);
  console.log("vehClassFreeCnt:", vehClassFreeCnt);
  // if (vehTypeFreeCnt != vehClassFreeCnt) {
  //   _this.$notify.error("存在免费车型总数不等于免费车种总数,请检查！");
  //   return false;
  // }
  return true;

}

/**
 * 实际拆分checkData
 */
var checkDataSplit = (updateData, _this) => {
  let totalFee = Number(updateData.totalFee);

  let feeSum = Number(updateData.fee1) + Number(updateData.fee2) + Number(updateData.fee3) + Number(updateData.fee4)
    + Number(updateData.fee5) + Number(updateData.fee6) + Number(updateData.fee7) + Number(updateData.fee8) + Number(updateData.fee9)
    + Number(updateData.fee10) + Number(updateData.fee11) + Number(updateData.fee12) + Number(updateData.fee13) + Number(updateData.fee14)
    + Number(updateData.fee15) + Number(updateData.fee16) + Number(updateData.fee17) + Number(updateData.fee18) + Number(updateData.fee19)
    + Number(updateData.fee20) + Number(updateData.fee21) + Number(updateData.fee22) + Number(updateData.fee23) + Number(updateData.fee24)
    + Number(updateData.fee25) + Number(updateData.fee26) + Number(updateData.fee27) + Number(updateData.fee28) + Number(updateData.fee29)
    + Number(updateData.fee30) + Number(updateData.fee31);

  console.log("totalFee:", totalFee);
  console.log("feeSum:", feeSum);

  /*if (totalFee != feeSum) {
    //  _this.$notify.error("存在实际拆分金额月小计不等于每天合计,请检查！");
    alert("存在实际拆分金额月小计不等于每天合计,请检查！");
    return false;
  }*/

  return true;

}


/**
 * 交调站 对比
 */
var dispatching_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for (let i = 0; i < updateRecords.length; i++) {
    if (updateRecords.fractureSurfaceName === '合计') {
      continue;
    }

    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.fractureSurfaceID;
    console.log("initTableData", initTableData);

    let check = checkData(_this.queryParams.tableId, upDateObj, _this);
    if (!check) {
      return false;
    }

    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.fractureSurfaceID;
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        break;
      }
    }
  }

  return true;

}

/**
 * 长益北线各站车流收入 对比
 */
var stationFlowIncome_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for (let i = 0; i < updateRecords.length; i++) {

    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.collectDate;
    console.log("initTableData", initTableData);

    let check = checkData(_this.queryParams.tableId, upDateObj, _this);
    if (!check) {
      return false;
    }

    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.collectDate;
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        break;
      }
    }
  }

  return true;

}

/**
 * 收费分项指标表 对比
 */
var itemizedCharges_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for (let i = 0; i < updateRecords.length; i++) {
    if (updateRecords.stationName === '合计') {
      continue;
    }

    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.stationId;

    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.stationId;
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        break;
      }
    }
  }

  return true;
}

/**
 * 利息数 对比
 */
var interestAmount_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for (let i = 0; i < updateRecords.length; i++) {
    if (updateRecords.collectYear === '合计') {
      continue;
    }

    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.collectYear;

    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.collectYear;
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        break;
      }
    }
  }

  return true;

}

/**
 * 节假日管理对比
 */

var holiday_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {
  for (let i = 0; i < updateRecords.length; i++) {
    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.id;
    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.id;
      console.log("initId:" + initId + " upDateId:" + upDateId);
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        break;
      }
    }
  }
  return true;
}

/**
 * 唐津合计统计
 * @param {*} initTableData 
 * @param {*} updateRecords 
 * @param {*} updateList 
 * @param {*} _this 
 */
var tj_findKeyAndCompile = (initTableData, updateRecords, updateList, _this,type) => {
  
  for (let i = 0; i < updateRecords.length; i++) {
    let upDateObj = updateRecords[i];
    let upDateId = type=='gantry'? upDateObj.gantryId : upDateObj.stationId;
    let upDateMediaTypeName = upDateObj.mediaTypeName;
    let upDateDirection = upDateObj.direction;


    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j]; 
      let initId = type=='gantry'? initObj.gantryId : initObj.stationId;
      let initMediaTypeName = initObj.mediaTypeName;
      let initDirection = initObj.direction;
      if (initId === upDateId && initMediaTypeName == upDateMediaTypeName && initDirection == upDateDirection) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        break;
      }
    }
  }
  return true;
}

/**
 * 长益北线各门架流量统计 对比
 */
var cyGantryFlow_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for (let i = 0; i < updateRecords.length; i++) {
    if (updateRecords.fractureSurfaceName === '合计') {
      continue;
    }

    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.gantryId;
    console.log("initTableData", initTableData);

    let check = checkData(_this.queryParams.tableId, upDateObj, _this);
    if (!check) {
      return false;
    }

    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.gantryId;
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        break;
      }
    }
  }

  return true;

}

/**
 * 通行费征收任务 对比
 */
var stationActGetFee_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for (let i = 0; i < updateRecords.length; i++) {
    if (updateRecords.stationName === '合计') {
      continue;
    }

    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.stationId;
    console.log("initTableData", initTableData);

    let check = checkData(_this.queryParams.tableId, upDateObj, _this);
    if (!check) {
      return false;
    }

    for (let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.stationId;
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        break;
      }
    }
  }

  return true;

}

/**
 * 门架 对比
 */
var gantry_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {
  for(let i = 0; i < updateRecords.length; i++) {
    if (updateRecords.mediaTypeName === '合计') {
      continue;
    }

    let upDateObj = updateRecords[i];
    let upDateGantryId = upDateObj.gantryId;
    let upDateMediaTypeName = upDateObj.mediaTypeName;
    
    let check = checkData(_this.queryParams.tableId, upDateObj, _this);
    if (!check) {
      return false;
    }
    for(let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initGantryId = initObj.gantryId;
      let initMediaTypeName = initObj.mediaTypeName;
      if (initGantryId === upDateGantryId && initMediaTypeName === upDateMediaTypeName) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        break;
      }
    }

  }

  return true;

}

/**
 * 收费站 对比
 */
var station_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {
  if (_this.queryParams.tableId == '40') {
    for(let i = 0; i < updateRecords.length; i++) {
      if (updateRecords.payTypeName === '合计' ||
          updateRecords.payTypeName === '入口小计' || updateRecords.payTypeName === '出口小计') {
        continue;
      }

      let upDateObj = updateRecords[i];
      let upDateStationId = upDateObj.stationId;
      let upDatePayTypeName = upDateObj.payTypeName;
      let check = checkData(_this.queryParams.tableId, upDateObj, _this);
      if (!check) {
        return false;
      }
      for(let j = 0; j < initTableData.length; j++) {
        let initObj = initTableData[j];
        let initStationId = initObj.stationId;
        let initPayTypeName = initObj.payTypeName;
        if (initStationId === upDateStationId && initPayTypeName === upDatePayTypeName) {
          compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
          console.log("initObj", initObj)
          break;
        }
      }
    }
  } else {
    for(let i = 0; i < updateRecords.length; i++) {
      if (updateRecords.mediaTypeName === '合计' || updateRecords.mediaTypeName === 'CPC合计'
       || updateRecords.mediaTypeName === 'ETC合计') {
        continue;
      }

      let upDateObj = updateRecords[i];
      let upDateStationId = upDateObj.stationId;
      let upDateInOutTypeName = upDateObj.inOutTypeName;
      let upDateMediaTypeName = upDateObj.mediaTypeName;
      let check = checkData(_this.queryParams.tableId, upDateObj, _this);
      if (!check) {
        return false;
      }
      for(let j = 0; j < initTableData.length; j++) {
        let initObj = initTableData[j];
        let initStationId = initObj.stationId;
        let initInOutTypeName = initObj.inOutTypeName;
        let initMediaTypeName = initObj.mediaTypeName;

        if (initStationId === upDateStationId && initInOutTypeName === upDateInOutTypeName && initMediaTypeName === upDateMediaTypeName) {
          compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
          break;
        }
      }
    }
  }

  console.log("updateList:", updateList);
  return true;

}

/**
 * 天气对比
 */

var weather_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {
  for(let i = 0; i < updateRecords.length; i++) {
    let upDateObj = updateRecords[i];
    let upDateId = upDateObj.id;
    for(let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initId = initObj.id;
      let initPayTypeName = initObj.payTypeName;
      console.log("initId:" + initId + " upDateId:" + upDateId);
      if (initId === upDateId) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        console.log("initObj", initObj);
        console.log("updateLists", updateList)
        break;
      }
    }
  }
  return true;
}

/**
 * 实际拆分 对比
 */
var actualSplit_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for(let i = 0; i < updateRecords.length; i++) {
    if (updateRecords.splitTypeName === '合计') {
      continue;
    }

    let upDateObj = updateRecords[i];
    let upDatesplitTypeName = upDateObj.splitTypeName;
    let check = checkData(_this.queryParams.tableId, upDateObj, _this);
    if (!check) {
      return false;
    }
    for(let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initsplitTypeName = initObj.splitTypeName;
      if (initsplitTypeName === upDatesplitTypeName) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        break;
      }
    }

  }

  return true;

}

/**
 * 断面预算月表
 */
 var fractureSurfaceSum_findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {

  for(let i = 0; i < updateRecords.length; i++) {

    let upDateObj = updateRecords[i];
    let upDateFractureSurFaceId = upDateObj.fractureSurFaceId;
    let upDateDataTypeName = upDateObj.dataTypeName;
    let upDateMediaTypeName = upDateObj.mediaTypeName;
    let check = checkData(_this.queryParams.tableId, upDateObj, _this);
    if (!check) {
      return false;
    }
    for(let j = 0; j < initTableData.length; j++) {
      let initObj = initTableData[j];
      let initFractureSurFaceId = initObj.fractureSurFaceId;
      let initDataTypeName = initObj.dataTypeName;
      let initMediaTypeName = initObj.mediaTypeName;
      if (initFractureSurFaceId === upDateFractureSurFaceId && upDateDataTypeName === initDataTypeName
         && initMediaTypeName === upDateMediaTypeName) {
        compile(_this.queryParams.tableId, initObj, upDateObj, updateList, _this);
        break;
      }
    }


  }

  return true;

}

/**
 * 对比修改前后
 * @param tableId 表id
 */
var compile = (tableId, a, b, updateList, _this) => {
  switch (tableId) {
    case collectConstant.tableId.gantryFlow:
      compileGantry(a, b, updateList, _this);
      break;
    case collectConstant.tableId.gantryFee:
      compileGantry(a, b, updateList, _this);
      break;
    case collectConstant.tableId.stationFlow:
      compileStation(a, b, updateList, _this);
      break;
    case collectConstant.tableId.stationFee:
      compileStation(a, b, updateList, _this);
      break;
    case collectConstant.tableId.weatherEmergencies:
      compileWeather(a, b, updateList, _this);
      break;
    case collectConstant.tableId.gantryFlowPrediction:
      compileGantry(a, b, updateList, _this);
      break;
    case collectConstant.tableId.gantryFeePrediction:
      compileGantry(a, b, updateList, _this);
      break;
    case collectConstant.tableId.actualSplitIncome:
      compileApctualIncome(a, b, updateList, _this);
      break;
    case collectConstant.tableId.dispatchingStationSum:
      compiledispatching(a, b, updateList, _this);
      break;
    case collectConstant.tableId.stationFlowIncome:
      compileStationFlowIncome(a, b, updateList, _this);
      break;
    case collectConstant.tableId.itemizedCharges:
      compileItemizedCharges(a, b, updateList, _this);
      break;
    case collectConstant.tableId.cyGantryFlow:
      compileCyGantryFlowSum(a, b, updateList, _this);
      break;    
    case collectConstant.tableId.actGetFee:
      compileStationActGetFee(a, b, updateList, _this);
      break;
    case collectConstant.tableId.actColFee:
      compileStationActGetFee(a, b, updateList, _this);
      break;
    case collectConstant.tableId.interestAmountSum:
      compileInterestAmount(a, b, updateList, _this);
      break;
    case collectConstant.tableId.cyStationFlowSum:
      compileStationActGetFee(a, b, updateList, _this);
      break;    
   case collectConstant.tableId.tjGantrySum:
     compileTjSum(a, b, updateList, _this,'gantry');
      break;
    case collectConstant.tableId.tjStationSum:
      compileTjSum(a, b, updateList, _this,'station');
      break;
    case collectConstant.tableId.adjustmentFee:
      compileInterestAmount(a, b, updateList, _this);
      break;
    case collectConstant.tableId.colHoliday:
      compileHoliday(a, b, updateList, _this);
      break;
    case collectConstant.tableId.fractureSurfaceSum:
      compileFractureSurface(a, b, updateList, _this);
      break; 
    default:
      break;
  }
}

/**
 * 数据校验
 * @param updateData
 */
var checkData = (tableId, updateData, _this) => {
  switch (tableId) {
    case collectConstant.tableId.gantryFlow:
      return checkDataGantry(updateData, _this);
    case collectConstant.tableId.gantryFee:
      return checkDataGantry(updateData, _this);
    case collectConstant.tableId.stationFlow:
      return checkDataStation(updateData, _this);
    case collectConstant.tableId.stationFee:
      return checkDataStation(updateData, _this);
    case collectConstant.tableId.weatherEmergencies:
      return true;
    case collectConstant.tableId.gantryFlowPrediction:
      return checkDataGantry(updateData, _this);
    case collectConstant.tableId.gantryFeePrediction:
      return checkDataGantry(updateData, _this);
    case collectConstant.tableId.dispatchingStationSum:
      return checkDataDispatching(updateData, _this);
    case collectConstant.tableId.stationFlowIncome:
      return checkDataStationFlowIncome(updateData, _this);
    case collectConstant.tableId.actualSplitIncome:
      return checkDataSplit(updateData, _this);
    case collectConstant.tableId.cyGantryFlow:
      return checkDataCyGantryFlow(updateData, _this);
    case collectConstant.tableId.actGetFee:
      return checkDatastationActGetFee(updateData, _this);
    case collectConstant.tableId.actColFee:
      return checkDatastationActGetFee(updateData, _this);
    case collectConstant.tableId.interestAmountSum:
      return checkDatastationActGetFee(updateData, _this);
    case collectConstant.tableId.cyStationFlowSum:
      return checkDatastationActGetFee(updateData, _this);
    case collectConstant.tableId.tjGantrySum:
      return true;
    case collectConstant.tableId.tjStationSum:
      return true;
    case collectConstant.tableId.adjustmentFee:
      return true;
    case collectConstant.tableId.fractureSurfaceSum:
      return true;
    default:
      return true;
  }
}

/**
 * 数据对比
 * @param tableId 表id
 */
var findKeyAndCompile = (initTableData, updateRecords, updateList, _this) => {
  let res = false;

  switch (_this.queryParams.tableId) {
    case collectConstant.tableId.gantryFlow:
      res = gantry_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.gantryFee:
      res = gantry_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.stationFlow:
      res = station_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.stationFee:
      res = station_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.weatherEmergencies:
      res = weather_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.gantryFlowPrediction:
      res = gantry_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.gantryFeePrediction:
      res = gantry_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.actualSplitIncome:
      res = actualSplit_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.dispatchingStationSum:
      res = dispatching_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.stationFlowIncome:
      res = stationFlowIncome_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.itemizedCharges:
      res = itemizedCharges_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.cyGantryFlow:
      res = cyGantryFlow_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.tjGantrySum:
      res = tj_findKeyAndCompile(initTableData, updateRecords, updateList, _this,'gantry');
      break;
    case collectConstant.tableId.tjStationSum:
      res = tj_findKeyAndCompile(initTableData, updateRecords, updateList, _this,'station');
      break;
    case collectConstant.tableId.actGetFee:
      res = stationActGetFee_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.actColFee:
      res = stationActGetFee_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.interestAmountSum:
      res = interestAmount_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.cyStationFlowSum:
      res = stationActGetFee_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.adjustmentFee:
      res = interestAmount_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.colHoliday:
      res = holiday_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
      break;
    case collectConstant.tableId.fractureSurfaceSum:
      res = fractureSurfaceSum_findKeyAndCompile(initTableData, updateRecords, updateList, _this);
    default:
      break;
  }

  return res;
}

export default {
  findById,
  findList,
  findOnlineList,
  save,
  saveImport,
  submit,
  findKeyAndCompile,
  clean,
  findDiscount,
  saveDiscount
}
