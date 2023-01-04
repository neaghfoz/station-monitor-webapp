import echarts from 'echarts'
import {transferDiffReason, transferExitFeeType} from "@/views/pro/common/util/dataUtil"
import api from "@/views/pro/analyse/flowTurnover/flowTurnoverApi"
import moment from 'moment'

export default {
  datas: {
    // 月度通行费
    "gantryFlowTurnover": {
      data: [
        {value: 1048, name: 'ETC'},
        {value: 735, name: 'CPC'}
      ],
    },
    "gantryFeeTurnover": {
      data: [
        {value: 1048, name: 'ETC'},
        {value: 735, name: 'CPC'}
      ],
    },
    "stationFlowTurnover": {
      data: [
        {value: 1048, name: 'ETC'},
        {value: 735, name: '支付宝'},
        {value: 1048, name: '微信'},
        {value: 735, name: '其他第三方'},
        {value: 735, name: '现金'}
      ],
    },
    "stationFeeTurnover": {
      data: [
        {value: 1048, name: 'ETC'},
        {value: 735, name: '支付宝'},
        {value: 1048, name: '微信'},
        {value: 735, name: '其他第三方'},
        {value: 735, name: '现金'}
      ],
    }
  },
  option: {
    "gflowt-pie":{
      title: {
        text: '',
      },
      color:['#1890ff','#121313'],
      legend: {
        itemGap: 30,
        itemWidth: 30,
        itemHeight: 14,
        orient: "vertical", //垂直显示还是水平显示
        right: 20, //legend相对位置
        bottom: 0, //legend相对位置
        x:'40%',
        y:'28%',
        textStyle: { fontSize: "14" }, //legend字体大小
        formatter:'',
      },
      series: [
        {
          type: 'pie',
          radius: ['28%', '30%'],
          center: ['18%', '35%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{total|  }'+ '\n\r' + '{active|车流量}',
              rich: {
                total:{
                  fontSize: 14,
                  fontFamily : "微软雅黑",
                },
                active: {
                  fontFamily : "微软雅黑",
                  fontSize: 16,
                  lineHeight:30,
                },
              }
            },
            emphasis: {//中间文字显示
              show: true,
            }
          },
          labelLine: {
            show: false
          },

      }]
    },
    "gfeet-pie":{
      title: {
        text: '',
      },
      color:['#FFC851','#121313'],
      legend: {
        itemGap: 30,
        itemWidth: 30,
        itemHeight: 14,
        orient: "vertical", //垂直显示还是水平显示
        right: 20, //legend相对位置
        bottom: 0, //legend相对位置
        x:'40%',
        y:'28%',
        textStyle: { fontSize: "14" }, //legend字体大小
        //formatter:'0'
      },
      series: [
        {
          type: 'pie',
          radius: ['28%', '30%'],
          center: ['18%', '35%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{total|  }'+ '\n\r' + '{active|交易额}',
              rich: {
                total:{
                  fontSize: 14,
                  fontFamily : "微软雅黑",
                },
                active: {
                  fontFamily : "微软雅黑",
                  fontSize: 16,
                  lineHeight:30,
                },
              }
            },
            emphasis: {//中间文字显示
              show: true,
            }
          },
          labelLine: {
            show: false
          },

        }]
    },
    "sflowt-pie":{
      title: {
        text: '',
      },
      color:['#FFC851','#1890ff','#1cc899','#ef6b0d','#121313'],
      legend: {
        itemGap: 30,
        itemWidth: 30,
        itemHeight: 14,
        orient: "vertical", //垂直显示还是水平显示
        right: 20, //legend相对位置
        bottom: 0, //legend相对位置
        x:'40%',
        y:'18%',
        textStyle: { fontSize: "14" }, //legend字体大小
      },
      series: [
        {
          type: 'pie',
          radius: ['28%', '30%'],
          center: ['18%', '35%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: '{total|  }'+ '\n\r' + '{active|车流量}',
              rich: {
                total:{
                  fontSize: 14,
                  fontFamily : "微软雅黑",
                },
                active: {
                  fontFamily : "微软雅黑",
                  fontSize: 16,
                  lineHeight:30,
                },
              }
            },
            emphasis: {//中间文字显示
              show: true,
            }
          },
          labelLine: {
            show: false
          },

        }]
    },
    "sfeet-pie":{
      title: {
        text: '',
      },
      color:['#FFC851','#1890ff','#1cc899','#ef6b0d','#121313'],
      legend: {
        itemGap: 30,
        itemWidth: 30,
        itemHeight: 14,
        orient: "vertical", //垂直显示还是水平显示
        right: 20, //legend相对位置
        bottom: 0, //legend相对位置
        x:'40%',
        y:'18%',
        textStyle: { fontSize: "14" }, //legend字体大小
        //formatter:'0'
      },
      series: [
        {
          type: 'pie',
          radius: ['28%', '30%'],
          center: ['18%', '35%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              color:'#4c4a4a',
              formatter: '{total|  }'+ '\n\r' + '{active|交易额}',
              rich: {
                total:{
                  fontSize: 14,
                  fontFamily : "微软雅黑",
                },
                active: {
                  fontFamily : "微软雅黑",
                  fontSize: 16,
                  lineHeight:30,
                },
              }
            },
            emphasis: {//中间文字显示
              show: true,
            }
          },
          labelLine: {
            show: false
          },

        }]
    },
  },

  getOption: function (val, $vm, chartId) {
    const data = this.datas[chartId];
    const type = val.dataset.chart;
    var opt = this.option[val.dataset.chart];
    let d = data.data;
    var cnt; var valText;
    switch (type) {
      // 车流量
      case "gflowt-pie":
        opt.series[0].data = d;
        cnt = ((Number(d[0].value) + Number(d[1].value))/10000).toFixed(2);
        opt.series[0].label.normal.formatter = '{total| '+cnt+' 万}'+ '\n\r' + '{active|车流量}';
        opt.legend.formatter = function (name) {
          d.forEach(target => {
            if(name == target.name){
              valText = (Number(target.value)/10000).toFixed(2);
            }
          })
          return name + '    ' + valText + '万辆';
        };
        break;
      case "gfeet-pie":
        opt.series[0].data = d;
        cnt = ((Number(d[0].value) + Number(d[1].value))/10000).toFixed(2);
        opt.series[0].label.normal.formatter = '{total| '+cnt+' 万}'+ '\n\r' + '{active|交易额}';
        opt.legend.formatter = function (name) {
          d.forEach(target => {
            if(name == target.name){
              valText = (Number(target.value)/10000).toFixed(2);
            }
          })
          return name + '    ' + valText + '万元';
        };
        break;
      case "sflowt-pie":
        opt.series[0].data = d;
        cnt = ((Number(d[0].value)+Number(d[1].value)+Number(d[2].value)+Number(d[3].value)+Number(d[4].value))/10000).toFixed(2);
        opt.series[0].label.normal.formatter = '{total| '+cnt+' 万}'+ '\n\r' + '{active|车流量}';
        opt.legend.formatter = function (name) {
          d.forEach(target => {
            if(name == target.name){
              valText = (Number(target.value)/10000).toFixed(2);
            }
          })
          return name + '    ' + valText + '万辆';
        };
        break;
      case "sfeet-pie":
        opt.series[0].data = d;
        cnt = ((Number(d[0].value)+Number(d[1].value)+Number(d[2].value)+Number(d[3].value)+Number(d[4].value))/10000).toFixed(2);
        opt.series[0].label.normal.formatter = '{total| '+cnt+' 万}'+ '\n\r' + '{active|交易额}';
        opt.legend.formatter = function (name) {
          d.forEach(target => {
            if(name == target.name){
              valText = (Number(target.value)/10000).toFixed(2);
            }
          })
          return name + '    ' + valText + '万元';
        };
        break;
      default:
        break;
    }
    return opt;
  },

  myCharts: {},
  diffDataSource: null,

  reload: function ($vm) {
    let chartTargets = $vm.$data.chartTarget
    let data = null
    const $this = this
    chartTargets.forEach(target => {
      // 调用接口获取数据
      if (target == 'gantryFlowTurnover') {
        data = this.callApi('findGantryData', target, $vm.$data.appForm, $vm)
      }
      if (target == 'gantryFeeTurnover') {
        data = this.callApi('findGantryData', target, $vm.$data.appForm, $vm)
      }
      if (target == 'stationFlowTurnover') {
        data = this.callApi('findStationData', target, $vm.$data.appForm, $vm)
      }
      if (target == 'stationFeeTurnover') {
        data = this.callApi('findStationData', target, $vm.$data.appForm, $vm)
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
      let $el = $vm.$refs[chartId]
      $el.type = chartId
      this.myCharts[chartId] = echarts.init($el)
      //  }
      //渲染图表
      let curOption = this.getOption($vm.$refs[chartId], $vm, chartId)
      this.myCharts[chartId].clear()
      this.myCharts[chartId].setOption(curOption)
      //}

  },

  gantryFlowTurnover(data, $vm) {
    var config = {
      GantryFlow: [{value: 0, name: 'ETC'},{value: 0, name: 'CPC'}]
    }

    data.forEach(target => {
      switch (target.mediaType) {
        case "1":
          if(target.gantryFlow != 0){
            config.GantryFlow[0].value = target.gantryFlow;}
          break;
        case "2":
          if(target.gantryFlow != 0){
            config.GantryFlow[1].value = target.gantryFlow;}
          break;
        default:
          break
      }
    })

    var chart = "gantryFlowTurnover";
    this.datas[chart].data = config.GantryFlow
    this.init($vm, chart);
  },

  gantryFeeTurnover(data, $vm) {
    var config = {
      GantryFee: [{value: 0, name: 'ETC'},{value: 0, name: 'CPC'}]
    }

    data.forEach(target => {
      switch (target.mediaType) {
        case "1":
          if(target.gantryFee != 0){
            config.GantryFee[0].value = target.gantryFee;}
          break;
        case "2":
          if(target.gantryFee != 0){
            config.GantryFee[1].value = target.gantryFee;}
          break;
        default:
          break
      }
    })

    var chart = "gantryFeeTurnover";
    this.datas[chart].data = config.GantryFee
    this.init($vm, chart);
  },

  stationFlowTurnover(data, $vm) {
    var config = {
      StationFlow: [{value: 0, name: 'ETC'},{value: 0, name: '支付宝'},
        {value: 0, name: '微信'},{value: 0, name: '其他第三方'},{value: 0, name: '现金'}]
    }

    data.forEach(target => {
      switch (target.payType) {
        case "4":
          if(target.stationFlow != 0){
            config.StationFlow[0].value = target.stationFlow;}
          break;
        case "6":
          if(target.stationFlow != 0){
            config.StationFlow[1].value = target.stationFlow;}
          break;
        case "7":
          if(target.stationFlow != 0){
            config.StationFlow[2].value = target.stationFlow;}
          break;
        case "2":
        case "3":
          if(target.stationFlow != 0){
            config.StationFlow[3].value = Number(target.stationFlow)+Number(config.StationFlow[3].value);}
          break;
        case "1":
          if(target.stationFlow != 0){
            config.StationFlow[4].value = target.stationFlow;}
          break;
        default:
          break
      }
    })

    var chart = "stationFlowTurnover";
    this.datas[chart].data = config.StationFlow
    this.init($vm, chart);
  },

  stationFeeTurnover(data, $vm) {
    var config = {
      StationFee: [{value: 0, name: 'ETC'},{value: 0, name: '支付宝'},
        {value: 0, name: '微信'},{value: 0, name: '其他第三方'},{value: 0, name: '现金'}]
    }

    data.forEach(target => {
      switch (target.payType) {
        case "4":
          if(target.stationFee != 0){
            config.StationFee[0].value = target.stationFee;}
          break;
        case "6":
          if(target.stationFee != 0){
            config.StationFee[1].value = target.stationFee;}
          break;
        case "7":
          if(target.stationFee != 0){
            config.StationFee[2].value = target.stationFee;}
          break;
        case "2":
        case "3":
          if(target.stationFee != 0){
            config.StationFee[3].value = Number(target.stationFee)+Number(config.StationFee[3].value);}
          break;
        case "1":
          if(target.stationFee != 0){
            config.StationFee[4].value = target.stationFee;}
          break;
        default:
          break
      }
    })

    var chart = "stationFeeTurnover";
    this.datas[chart].data = config.StationFee
    this.init($vm, chart);
  }

}


