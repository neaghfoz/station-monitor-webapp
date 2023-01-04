import echarts from 'echarts'
import {transferDiffReason, transferExitFeeType} from "@/views/pro/common/util/dataUtil"
import api from "@/views/pro/audit/fee/indexFee/indexFeeApi"
import moment from 'moment'

// 转成成表格数据
export default {
  datas: {
    // 日通行费趋势图
    "txfjhqst": {
      data: [
        //应收
        [820, 932, 901, 934, 1290, 1330, 1320],
        //实收
        [820, 932, 901, 934, 1190, 1130, 1120]
      ]
    },
    "txfjhqst2": {
      data: [
        //应收
        [820, 932, 901, 934, 1290, 1330, 1320],
        //实收
        [-820, -932, -901, -934, -1190, -1130, -1120]
      ],
    },
    "gljz": {
      //关联记账统计
      data: [
        //校核应收
        [320, 302, 301],
        //记账拆分
        [120, 132, 101]
      ],
    },
    "ceyy": {
      //关联记账统计
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "txljtype": {
      data: [
        //'校核应收
        [320, 302, 301, 334],
        //已关联确认记账
        [120, 132, 101, 134],
        //无关联确认记账
        [320, 302, 301, 334],
      ]
    },
    "ckjftype": {
      data: [
        {
          name: '按OBU累计优惠后金额计费',
          value: 0
        },
        {
          name: '按CPC累计金额计费',
          value: 0
        },
        {
          name: '部中心在线服务计费',
          value: 0
        },
        {
          name: '省中心在线服务计费',
          value: 0
        },
        {
          name: '按全网最小费额计费',
          value: 0
        }
      ]
    },
    // 月度通行费
    "ydtxf": {
      data: [
        //应收
        [820, 932, 901, 934, 1290, 1330, 1320],
        //实收
        [820, 932, 901, 934, 1190, 1130, 1120]
      ],
    }
  },
  option: {
    "line": {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        padding: [2, 10],
        textStyle: {
          fontSize: 14
        },
        formatter: (params) => {  //格式化数据的函数
          //            console.log('我的参数',params)  //打印出来的数据
          var msg = params[0].axisValue + '</br>';
          for (let a = 0; a < params.length; a++) {
            var t = '万</br>';
            if (a >= params.length - 1) {
              t = '万'
            }
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[a].color + '"></span>'
            msg += dotHtml + params[a].seriesName + ' ' + params[a].value + t;
          }
          return msg;
        }
      },
      legend: {
        data: ['理论应收', '拟合应收', '收益快报'],
        textStyle: {color: "#666"},
        top: '3%',
        right: '3%',
        itemGap: 20
        //orient: 'vertical'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2020-01-01', '2020-01-05', '2020-01-09', '2020-01-13', '2020-01-17', '2020-01-21', '2020-01-26'],
        axisLabel: {textStyle: {color: "#666"}},
        axisTick: {show: false},
        axisLine: {lineStyle: {color: '#ddd'}}
      },
      yAxis: {
        type: 'value',
        name: '    单位（万元）',
        nameTextStyle: {
          color: '#333'
        },
        position: 'left',
        axisLabel: {textStyle: {color: "#333"}},
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#EEE'
          }
        },
        axisLine: {lineStyle: {color: '#ddd'}},
        axisTick: {show: false},
      },
      series: [{
        name: '理论应收',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#0088ff',
        },
        emphasis: {
          itemStyle: {
            color: '#fff',
            borderWidth: 3,
            borderColor: "#0088ff"
          },
        },
        smooth: true,
      }, {
        name: '拟合应收',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#feb42f',
        },
        emphasis: {
          itemStyle: {
            color: '#fff',
            borderWidth: 3,
            borderColor: "#feb42f"
          },
        },
        smooth: true,
      }, {
        name: '收益快报',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#21d4b6',
        },
        emphasis: {
          itemStyle: {
            color: '#fff',
            borderWidth: 3,
            borderColor: "#21d4b6"
          },
        },
        smooth: true,
      }]
    },
    "bar": {
      color: ['#ff6160', '#21d4b6'],
      tooltip: {
        trigger: 'item'
      },
      title: {
        text: '日均差值：3.2万元',
        right: '10%',
        top: '16%',
        textStyle: {
          color: '#333',
          fontSize: 14,
          lineHeight: 16,
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        axisLabel: {textStyle: {color: "#666"}},
        axisTick: {show: false, alignWithLabel: false},
        axisLine: {lineStyle: {color: '#ddd'}}
      },
      yAxis: {
        type: 'value',
        name: '单位（万元）',
        nameTextStyle: {
          color: '#333'
        },
        position: 'left',
        axisLabel: {textStyle: {color: "#333"}},
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#EEE'
          }
        },
        axisLine: {lineStyle: {color: '#ddd'}},
        axisTick: {show: false},
      },
      series: [
        {
          name: '应收',
          type: 'bar',
          stack: 'one',
          barWidth: '50%',
          data: [12, 46, 35, 78, 655, 23, 58]
        },
        {
          name: '实收',
          type: 'bar',
          stack: 'one',
          barWidth: '50%',
          data: [12, 46, 35, 78, 655, 23, 58]
        },
      ]
    },
    "jh-line": {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        padding: [2, 10],
        textStyle: {
          fontSize: 14
        },
        formatter: (params) => {  //格式化数据的函数
          //            console.log('我的参数',params)  //打印出来的数据
          //var msg = '';
          var msg = params[0].axisValue + '</br>';
          for (let a = 0; a < params.length; a++) {
            var t = '万</br>';
            if (a >= params.length - 1) {
              t = '万'
            }
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[a].color + '"></span>'
            msg += dotHtml + params[a].seriesName + ' ' + params[a].value + t;
          }
          return msg;
        }
      },
      legend: {
        data: ['理论应收', '拟合应收', '收益快报'],
        textStyle: {color: "#666"},
        top: '3%',
        right: '3%',
        itemGap: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisLabel: {textStyle: {color: "#666"}},//{textStyle: {color: "#666"},interval:0, rotate:0  },
        axisTick: {show: false},
        axisLine: {lineStyle: {color: '#ddd'}}
      },
      yAxis: {
        type: 'value',
        name: '    单位（万元）',
        nameTextStyle: {
          color: '#333'
        },
        position: 'left',
        axisLabel: {textStyle: {color: "#333"}},
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#EEE'
          }
        },
        axisLine: {lineStyle: {color: '#ddd'}},
        axisTick: {show: false},
      },
      series: [{
        name: '理论应收',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#0088ff',
        },
        emphasis: {
          itemStyle: {
            color: '#fff',
            borderWidth: 3,
            borderColor: "#0088ff"
          },
        },
        smooth: true,
      }, {
        name: '拟合应收',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#feb42f',
        },
        emphasis: {
          itemStyle: {
            color: '#fff',
            borderWidth: 3,
            borderColor: "#feb42f"
          },
        },
        smooth: true,
      }, {
        name: '收益快报',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#21d4b6',
        },
        emphasis: {
          itemStyle: {
            color: '#fff',
            borderWidth: 3,
            borderColor: "#21d4b6"
          },
        },
        smooth: true,
      }]
    }
  },
  getOption: function (val, $vm, chartId) {
    const data = this.datas[chartId];
    const type = val.dataset.chart;
    var opt = this.option[val.dataset.chart];
    let d = data.data;
    switch (type) {
      case "line":
        var dayArray = this.daysOfMonth($vm);
        opt.xAxis.data = dayArray;
        var initArr1 = [], initArr2 = [], initArr3 = [];
        //      	不足长度的数据自动补充0
        for (var i = 0; i < dayArray.length; i++) {
          initArr1[i] = 0;
          initArr2[i] = 0;
          initArr3[i] = 0;
        }
        for (var j = 0; j < d[0].length; j++) {
          initArr1[j] = d[0][j];
        }
        for (var o = 0; o < d[1].length; o++) {
          initArr2[o] = d[1][o];
        }
        for (var o = 0; o < d[2].length; o++) {
          initArr3[o] = d[2][o];
        }
        opt.series[0].data = initArr1;
        opt.series[1].data = initArr2;
        opt.series[2].data = initArr3;
        break;
      case "bar":
        // var dayArray = this.daysOfMonth($vm);
        // opt.xAxis.data = dayArray;
        // var initArr1 = [],initArr2 = [];
        // //      	不足长度的数据自动补充0
        // for(var i=0;i<dayArray.length;i++){
        //   initArr1[i] = 0;
        //   initArr2[i] = 0;
        // }
        // for(var j=0;j<d[0].length;j++){
        //   initArr1[j] = d[0][j];
        // }
        // for(var o=0;o<d[1].length;o++){
        //   initArr2[o] = d[1][o];
        // }
        // opt.series[0].data = initArr1;
        // opt.series[1].data = initArr2;
        // opt.title.text= data.avgNum>0?('日均差值：'+data.avgNum+'万元'):'';
        break;
      // 月度通行费
      case "jh-line":
        var dayArray = this.monthsOfYear($vm);
        opt.xAxis.data = dayArray;
        var initArr1 = [], initArr2 = [], initArr3 = [];
        //      	不足长度的数据自动补充0
        for (var i = 0; i < dayArray.length; i++) {
          initArr1[i] = 0;
          initArr2[i] = 0;
          initArr3[i] = 0;
        }
        for (var j = 0; j < d[0].length; j++) {
          initArr1[j] = d[0][j];
        }
        for (var o = 0; o < d[1].length; o++) {
          initArr2[o] = d[1][o];
        }
        for (var o = 0; o < d[2].length; o++) {
          initArr3[o] = d[2][o];
        }
        opt.series[0].data = initArr1;
        opt.series[1].data = initArr2;
        opt.series[2].data = initArr3;
        break;
      default:
        break;
    }
    return opt;
  },
  myCharts: {},
  diffDataSource: null,
  toWYuan(num) {
    return (parseFloat(num) / 1000000).toFixed(2);
  },
  daysOfMonth($vm) {
    let days = moment($vm.$data.txfjhqst.startDay.substr(0, 7), 'YYYY-MM').endOf('month').format('DD');
    let ms = []
    let m = $vm.$data.txfjhqst.startDay.substr(5, 2)
    for (let i = 1; i <= days; i++) {
      ms.push(m + '-' + (i < 10 ? '0' + i : i + ''))
    }
    return ms
  },
  monthsOfYear($vm) {
    let ms = []
    let dateStart = moment($vm.$data.ydtxf.startDay, 'YYYY-MM-DD')
    let dateEnd = moment($vm.$data.ydtxf.endDay, 'YYYY-MM-DD')
    let dateTemp = dateStart;
    while (1) {
      ms.push(dateTemp.format("YYYY-MM"));
      dateTemp = dateTemp.add(1, "months").endOf('month')
      if (dateTemp.diff(dateEnd, "months") > 0) {
        break
      }
    }
    debugger
    return ms
  },
  reload: function ($vm) {
    let chartTargets = $vm.$data.chartTarget
    let data = null
    const $this = this
    chartTargets.forEach(target => {
      // 调用接口获取数据
      if (target == 'txfjhqst') {
        data = this.callApi('txfjh', target, $vm.$data.txfjhqst, $vm)
      } else if (target == 'ydtxf') {
        data = this.callApi('txfjh', target, $vm.$data.ydtxf, $vm)
      } else if (target == 'feeSplit') {
        data = this.callApi(target, target, $vm.$data.feeSplit, $vm)
      } else {
        data = this.callApi(target, target, $vm.$data.queryParams, $vm)
      }
    })
  },
  async callApi(apiFname, target, param, $vm) {
    let data = await api[apiFname](param)
    // 格式化数据，并渲染图标
    if (data.code == 200) {
      this[target](data.data, $vm)
    } else {
      this.$message({
        message: '调用接口失败[' + apiFname + ']',
        type: 'error'
      });
    }
  },
  init: function ($vm, chartId) {
    // 初始化
    $vm.$nextTick(() => {
      let $el = $vm.$refs[chartId]
      //if($el.style.display!='none'){
      //  if(!this.myCharts.hasOwnProperty(chartId)){
      $el.type = chartId
      this.myCharts[chartId] = echarts.init($el)
      //  }
      //渲染图表
      let curOption = this.getOption($vm.$refs[chartId], $vm, chartId)
      this.myCharts[chartId].clear()
      this.myCharts[chartId].setOption(curOption)
      //}
      $vm.$data.txfjhqst.loading = false
      $vm.$data.feeSplit.loading = false

    })

  },
  // 月度通行费
  ydtxf(data, $vm) {
    var sectionDatas = data.fittingStat;//拟合应收
    var provDatas = data.earningsStat;//收益快报
    var theoryDatas = data.theoryStat;//理论应收
    var tmpSectionData = {}
    var tmpProvData = {}
    var tmpTheoryData = {}

    var config = {
      sectioData: [],
      provinData: [],
      theoryData: []
    }
    for (var i = 0; i < sectionDatas.length; i++) {
      var vo = sectionDatas[i];
      var mon = vo.transDay.substr(0, 4) + "-" + vo.transDay.substr(4, 2);
      tmpSectionData[mon] = this.toWYuan(vo.fee);
      tmpProvData[mon] = 0;
      tmpTheoryData[mon] = 0;
    }
    for (var i = 0; i < provDatas.length; i++) {
      var vo = provDatas[i];
      var mon = vo.transDay.substr(0, 4) + "-" + vo.transDay.substr(4, 2);
      tmpProvData[mon] = this.toWYuan(vo.fee);
    }
    for (var i = 0; i < theoryDatas.length; i++) {
      var vo = theoryDatas[i];
      var mon = vo.transDay.substr(0, 4) + "-" + vo.transDay.substr(4, 2);
      tmpTheoryData[mon] = this.toWYuan(vo.fee);
    }

    var dayArray = this.monthsOfYear($vm)
    var diffSum = 0;
    for (var i = 0; i < dayArray.length; i++) {
      var mon = dayArray[i];
      var seVal = 0;
      var provVal = 0;
      var theVal = 0;
      if (tmpSectionData.hasOwnProperty(mon)) {
        seVal = tmpSectionData[mon]
      }
      if (tmpProvData.hasOwnProperty(mon)) {
        provVal = tmpProvData[mon]
      }
      if (tmpTheoryData.hasOwnProperty(mon)) {
        theVal = tmpTheoryData[mon]
      }
      if (seVal != 0) {
        diffSum += Math.abs(seVal - provVal);
      }
      config.sectioData.push(seVal);
      config.provinData.push(provVal);
      config.theoryData.push(theVal);
    }
    var chart = "ydtxf";
    this.datas[chart].data[0] = config.theoryData;
    this.datas[chart].data[1] = config.sectioData;
    this.datas[chart].data[2] = config.provinData;
    this.init($vm, chart);
  },

  // 顶部统计
  feeSplit(rows, $vm) {
    debugger
    let payFeeCur = '/'
    let feeCur = '/'
    let splitFeeCur = '/'

    let payFeeLastMon = '/'
    let feeLastMon = '/'
    let splitFeeLastMon = '/'

    let payFeeLastYear = '/'
    let feeLastYear = '/'
    let splitFeeLastYear = '/'

    // 上月和本月顶部统计
    $vm.$data.top.st1.month = $vm.$data.txfjhqst.startDay.substr(5, 2) + "月";//"当月"//lastMon2.substr(4, 2) + "月"
    $vm.$data.top.st2.month = "环比"//lastMon.substr(4, 2) + "月"
    $vm.$data.top.st3.month = "同比"//curMonth.substr(4, 2) + "月"

    $vm.$data.top.st1.payFee = '/'
    $vm.$data.top.st1.fee = '/'
    $vm.$data.top.st1.splitFee = '/'
    $vm.$data.top.st1.diffFee = '/'

    if (rows.dataCurrentMonth.length > 0) {
      payFeeCur = this.toWYuan(rows.dataCurrentMonth[0].payFee)
      feeCur = this.toWYuan(rows.dataCurrentMonth[0].fee)
      splitFeeCur = this.toWYuan(rows.dataCurrentMonth[0].splitFee)
      $vm.$data.top.st1.payFee = payFeeCur
      $vm.$data.top.st1.fee = feeCur
      $vm.$data.top.st1.splitFee = splitFeeCur

      if ($vm.$data.top.st1.fee > 0) {
        $vm.$data.top.st1.diffFee = (parseFloat($vm.$data.top.st1.splitFee - $vm.$data.top.st1.fee ) / $vm.$data.top.st1.fee * 100).toFixed(2) + '%'
      }
    }

    $vm.$data.top.st2.payFee = '/'
    $vm.$data.top.st2.fee = '/'
    $vm.$data.top.st2.splitFee = '/'
    $vm.$data.top.st2.diffFee = '/'
    if (rows.dataLastMonth.length > 0) {
      payFeeLastMon = this.toWYuan(rows.dataLastMonth[0].payFee)
      feeLastMon = this.toWYuan(rows.dataLastMonth[0].fee)
      splitFeeLastMon = this.toWYuan(rows.dataLastMonth[0].splitFee)

      if (payFeeCur >= 0 && payFeeLastMon > 0) {
        $vm.$data.top.st2.payFee = (parseFloat(payFeeCur - payFeeLastMon) / payFeeLastMon * 100).toFixed(2) + '%'
      }
      if (feeCur >= 0 && feeLastMon > 0) {
        $vm.$data.top.st2.fee = (parseFloat(feeCur - feeLastMon) / feeLastMon * 100).toFixed(2) + '%'
      }
      if (splitFeeCur >= 0 && splitFeeLastMon > 0) {
        $vm.$data.top.st2.splitFee = (parseFloat(splitFeeCur - splitFeeLastMon) / splitFeeLastMon * 100).toFixed(2) + '%'
      }

      //$vm.$data.top.st2.payFee = this.toWYuan(rows.dataLastMonth[0].payFee)
      //$vm.$data.top.st2.fee = this.toWYuan(rows.dataLastMonth[0].fee)
      //$vm.$data.top.st2.splitFee = this.toWYuan(rows.dataLastMonth[0].splitFee)
      // if ($vm.$data.top.st2.fee > 0) {
      //   $vm.$data.top.st2.diffFee = (parseFloat($vm.$data.top.st2.fee - $vm.$data.top.st2.splitFee) / $vm.$data.top.st2.fee * 100).toFixed(2) + '%'
      // }
    }

    $vm.$data.top.st3.payFee = '/'
    $vm.$data.top.st3.fee = '/'
    $vm.$data.top.st3.splitFee = '/'
    $vm.$data.top.st3.diffFee = '/'
    if (rows.dataLastYear.length > 0) {
      payFeeLastYear = this.toWYuan(rows.dataLastYear[0].payFee)
      feeLastYear = this.toWYuan(rows.dataLastYear[0].fee)
      splitFeeLastYear = this.toWYuan(rows.dataLastYear[0].splitFee)
      if (payFeeCur >= 0 && payFeeLastYear > 0) {
        $vm.$data.top.st3.payFee = (parseFloat(payFeeCur - payFeeLastYear) / payFeeLastYear * 100).toFixed(2) + '%'
      }
      if (feeCur >= 0 && feeLastYear > 0) {
        $vm.$data.top.st3.fee = (parseFloat(feeCur - feeLastYear) / feeLastYear * 100).toFixed(2) + '%'
      }
      if (splitFeeCur >= 0 && splitFeeLastYear > 0) {
        $vm.$data.top.st3.splitFee = (parseFloat(splitFeeCur - splitFeeLastYear) / splitFeeLastYear * 100).toFixed(2) + '%'
      }

      // $vm.$data.top.st3.payFee = this.toWYuan(rows.dataLastYear[0].payFee)
      // $vm.$data.top.st3.fee = this.toWYuan(rows.dataLastYear[0].fee)
      // $vm.$data.top.st3.splitFee = this.toWYuan(rows.dataLastYear[0].splitFee)
      //
      // if ($vm.$data.top.st3.fee > 0) {
      //   $vm.$data.top.st3.diffFee = (parseFloat($vm.$data.top.st3.fee - $vm.$data.top.st3.splitFee) / $vm.$data.top.st3.fee * 100).toFixed(2) + '%'
      // }
    }
  },

  // 通行费校核趋势图
  txfjhqst(data, $vm) {
    var sectionDatas = data.fittingStat;//拟合应收
    var provDatas = data.earningsStat;//收益快报
    var theoryDatas = data.theoryStat;//理论应收
    var config = {
      sectioData: [],
      provinData: [],
      theoryData: []
    }
    var tmpSectionData = {}
    var tmpProvData = {}
    var tmpTheoryData = {}
    for (var i = 0; i < sectionDatas.length; i++) {
      var vo = sectionDatas[i];
      var day = vo.transDay.substr(4, 2) + "-" + vo.transDay.substr(6, 2);
      tmpSectionData[day] = this.toWYuan(vo.fee);
      tmpProvData[day] = 0;
      tmpTheoryData[day] = 0;
    }
    for (var i = 0; i < provDatas.length; i++) {
      var vo = provDatas[i];
      var day = vo.transDay.substr(4, 2) + "-" + vo.transDay.substr(6, 2);
      tmpProvData[day] = this.toWYuan(vo.fee);
    }
    for (var i = 0; i < theoryDatas.length; i++) {
      var vo = theoryDatas[i];
      var day = vo.transDay.substr(4, 2) + "-" + vo.transDay.substr(6, 2);
      tmpTheoryData[day] = this.toWYuan(vo.fee);
    }

    var dayArray = this.daysOfMonth($vm)
    var diffSum = 0;
    for (var i = 0; i < dayArray.length; i++) {
      var day = dayArray[i];
      var seVal = 0;
      var provVal = 0;
      var theVal = 0;
      if (tmpSectionData.hasOwnProperty(day)) {
        seVal = tmpSectionData[day]
      }
      if (tmpProvData.hasOwnProperty(day)) {
        provVal = tmpProvData[day]
      }
      if (tmpTheoryData.hasOwnProperty(day)) {
        theVal = tmpTheoryData[day]
      }
      if (seVal != 0) {
        diffSum += Math.abs(seVal - provVal);
      }
      config.sectioData.push(seVal);
      config.provinData.push(provVal);
      config.theoryData.push(theVal);
    }

    var chart = "txfjhqst";
    //this.datas[chart].data[0] = config.sectioData;
    //this.datas[chart].data[1] = config.provinData;
    this.datas[chart].data[0] = config.theoryData;
    this.datas[chart].data[1] = config.sectioData;
    this.datas[chart].data[2] = config.provinData;
    this.init($vm, chart);

    // var chart = "txfjhqst2";
    // this.datas[chart].data[0] = [];
    // this.datas[chart].data[1] = [];
    // for(var i=0;i<config.sectioData.length;i++){
    //   var diffFee = (config.provinData[i]-config.sectioData[i]).toFixed(2);
    //   if(diffFee>=0){
    //     this.datas[chart].data[0].push(diffFee);
    //     this.datas[chart].data[1].push(0);
    //   }else{
    //     this.datas[chart].data[1].push(diffFee);
    //     this.datas[chart].data[0].push(0);
    //   }
    // }
    // this.datas[chart].avgNum = (parseFloat(diffSum)/config.sectioData.length).toFixed(2);
    // this.init($vm,chart);
  }

}
