import echarts from 'echarts'

// 转成成表格数据
export default  {
  /**
   *折线图
   */
  lineOption:{
    title:{
      text:'',
      textStyle:{
        color:'#999',
        fontSize: 12,
        fontWeight: 'normal'
      },
      top:'13%',
      right:'3%',
    },
    tooltip: {
      trigger: 'axis',
      padding: [2, 10],
      textStyle: {
        fontSize: 14
      },
      rich:{
        'red':{
          color:"#f00"
        }
      }
    },
    toolbox: {
      top:11,
      feature: {
        saveAsImage: {}
      }
    },
    legend: {
      data:['交易金额'],
      textStyle:{ color:"#666" },
      top:'3%',
      right:'3%',
      itemGap: 30
    },
    grid: {
      top: '20%',
      left: '3.5%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisLabel: {
        textStyle: {  color: "#666" },
        interval:0,
        rotate:35,//倾斜度 -90 至 90 默认为0
        margin:10
      },
      axisTick: { show: false },
      axisLine:{ lineStyle:{ color:'#ddd' } }
    },
    yAxis: {
      type: 'value',
      name: '单位（元）',
      nameTextStyle: {
        color: '#333'
      },
      position: 'left',
      axisLabel: { textStyle: {  color: "#333" } },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#EEE'
        }
      },
      axisLine:{ lineStyle:{ color:'#ddd' } },
      axisTick: { show: false },
    },
    series: [{
      name:'交易金额',
      type: 'line',
      symbol: 'circle',
      symbolSize:10,
      itemStyle:{
        color:'#0088ff',
      },
      emphasis:{
        itemStyle:{
          color:'#fff',
          borderWidth:3,
          borderColor: "#0088ff"
        },
      },
      smooth: true
    }
    ]
  },
  /**
   *柱状图
   */
  barOption:{
    title:{
      text:'',
      textStyle:{
        color:'#999',
        fontSize: 12,
        fontWeight: 'normal'
      },
      top:'13%',
      right:'3%',
    },
    tooltip: {
      trigger: 'axis',
      padding: [2, 10],
      textStyle: {
        fontSize: 14
      },
      rich:{
        'red':{
          color:"#f00"
        }
      },
      formatter:""

    },
    toolbox: {
      top:11,
      feature: {
        saveAsImage: {}
      }
    },
    legend: {
      data:['数量'],
      textStyle:{ color:"#666" },
      top:'3%',
      right:'3%',
      itemGap: 30
    },
    grid: {
      top: '20%',
      left: '3.5%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: ['5%'],
      data: [],
      axisLabel: {
        textStyle: {  color: "#666" },
        interval:0,
        rotate:35,//倾斜度 -90 至 90 默认为0
        margin:10
      },
      axisTick: { show: false },
      axisLine:{ lineStyle:{ color:'#ddd' } }
    },
    yAxis: {
      type: 'value',
      name: '单位（元）',
      nameTextStyle: {
        color: '#333'
      },
      position: 'left',
      axisLabel: { textStyle: {  color: "#333" } },

      axisLine:{ lineStyle:{ color:'#ddd' } },
      axisTick: { show: false },
    },
    series: [{
      name:'交易金额',
      type: 'bar',
      barWidth: '30%',
      itemStyle:{
        color:'#0088ff'
      }
    }
    ]
  },
  init(el){
    this.$el = el
  },
  show:function(dataArr, activeName , statType){





    if(!this.myChart){
      this.myChart = echarts.init(this.$el)
    }

    let data = {
      xData:[],
      specialCnt:[]
    }
    for(let i in dataArr){
      let vo = dataArr[i]
      data.xData.push(vo.xname)

      if( statType == '1' ) {
        data.specialCnt.push(vo.specialCnt)
        this.barOption.tooltip.formatter = null ;
        this.lineOption.tooltip.formatter = null ;

      } else {
        data.specialCnt.push(parseFloat(vo.specialRate.replace('%', '')).toFixed(2))
        this.barOption.tooltip.formatter = function(params)  {  //格式化数据的函数
          //console.log('我的参数',params)  //打印出来的数据
          var msg = params[0].axisValue+'</br>';
          for (let a = 0; a < params.length; a++) {
            var t = '%</br>';
            if(a>=params.length-1){
              t='%'
            }
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[a].color+'"></span>'
            msg+= dotHtml + params[a].seriesName + ':' + params[a].value + t;
          }
          return msg;
        };
        this.lineOption.tooltip.formatter = function(params)  {  //格式化数据的函数
          //console.log('我的参数',params)  //打印出来的数据
          var msg = params[0].axisValue+'</br>';
          for (let a = 0; a < params.length; a++) {
            var t = '%</br>';
            if(a>=params.length-1){
              t='%'
            }
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[a].color+'"></span>'
            msg+= dotHtml + params[a].seriesName + ':' + params[a].value + t;
          }
          return msg;
        };
      }

    }
    let curOption = {}
    if (activeName =='time') {
      curOption = this.lineOption
    }else{
      curOption = this.barOption
    }
    curOption.xAxis.data = data.xData
    //
    curOption.series[0].data = data.specialCnt
    //yAxis ， series 设置
    if (statType == '1') {
      curOption.yAxis.name = '单位（条）';
      curOption.series[0].name = '特情数量';


    } else if(statType == '2') {
      curOption.yAxis.name = '单位（%）';
      curOption.series[0].name = '特情占比';
    }
    var typeName = '';
    switch (activeName){
      case 'road':
        typeName = '路段'
        break;
      case 'station':
        typeName = '收费站'
        break;
      case 'gantry':
        typeName = '门架'
      break;
      case 'special':
        typeName = '特情类型'
      break;
      case 'vehicleType':
        typeName = '车型'
        break;
      case 'vehicleClass':
        typeName = '车种'
        break;
      case 'time':
        typeName = '时间'
      break;
    }
    curOption.title.text = '收费站特情分析' + typeName + '图表';
    this.myChart.clear()
    this.myChart.setOption(curOption);
  }

}
