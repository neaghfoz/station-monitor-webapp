import echarts from 'echarts'


/**
 * 默认配置
 * @type {{}}
 */
export const chartOptions = {
  // 趋势图默认配置
  'line':{
    // 渲染的目标elemnt dom 对象
    el:null,
    // 图表类型
    chartType: 'line',
    // 标题
    titleText: '',
    // 数值单位
    unitText: '',
    // 趋势线名称
    legendData: ['应收','实收'],
    // 趋势线颜色
    legendColor: ['#0088ff','#feb42f','#b2ead3','#8bef4c'],
    // x坐标值
    xdata: ['2020-01-01', '2020-01-05', '2020-01-09', '2020-01-13', '2020-01-17', '2020-01-21', '2020-01-26'],
    // y统计值
    ydata: [
      [20,30,40,35,75,10,8],
      [50,70,60,45,80,100,65]
    ],
    // echart 默认配置
    option: {
      title:{
        text:'',
        x:'center',
        y:'top',
        textAlign:'left'
      },
      tooltip: {
        trigger: 'axis',
        padding: [2, 10],
        textStyle: {
          fontSize: 14
        },
        formatter: (params) => {  //格式化数据的函数
          var msg = params[0].axisValue+'</br>'
          for (let a = 0; a < params.length; a++) {
            var t = '</br>';
            if(a>=params.length-1){
              t=''
            }
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:'+params[a].color+'"></span>'
            msg+= dotHtml + params[a].seriesName.substring(0,2) + ' ' + params[a].value + t
          }
          return msg
        }
      },
      legend: {
        data:[],
        textStyle:{ color:"#666" },
        top:'3%',
        right:'3%',
        itemGap: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        top:'10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: { textStyle: {  color: "#666" } },
        axisTick: { show: false },
        axisLine:{ lineStyle:{ color:'#ddd' } }
      },
      yAxis: {
        type: 'value',
        name: '', // 单位
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
        name:'',
        type: 'line',
        symbol: 'circle',
        symbolSize:8,
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
        smooth: true,
      }]
    }
  },
  // 柱形图
  'bar':{
    // 渲染的目标elemnt dom 对象
    el:null,
    // 图表类型
    chartType: 'bar',
    // 标题
    titleText: '',
    // 数值单位
    unitText: '',
    // 趋势线名称
    legendData: ['应收','实收'],
    // 趋势线颜色
    legendColor: ['#0088ff','#feb42f','#b2ead3','#8bef4c'],
    // x坐标值
    xdata: ['2020-01-01', '2020-01-05', '2020-01-09'],
    // y统计值
    ydata: [
      [300,500,700],
      [200,400,800]
    ],
    // echart 默认配置
    option: {
      title:{
        text:'',
      },
      color:['#0088ff','#feb42f','#b2ead3','#8bef4c'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['应收','实收'],
        textStyle:{ color:"#666" },
        icon:'rect',
        itemWidth:9,
        itemHeight:9,
        padding: [0, 10],
        top:'3%',
        right:'3%',
        itemGap: 20
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        top:'10%',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        name: '单位（车次）',
        nameTextStyle: {
          color: '#333'
        },
        position: 'left',
        boundaryGap: false,
        axisLabel: { textStyle: {  color: "#666" } },
        axisTick: { show: false },
        axisLine:{ lineStyle:{ color:'#ddd' } }
      },
      xAxis: {
        type: 'category',
        data: ['2020-01-01', '2020-01-02', '2020-01-03','2020-01-04'],
        axisLabel: { textStyle: {  color: "#333" },interval:0 },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#EEE'
          },
        },
        axisLine:{ lineStyle:{ color:'#ddd' },show:true },
        axisTick: { show: false },
      },
      series: [
        {
          name: '应收',
          type: 'bar',
          barWidth: '30%'
        },
        {
          name: '实收',
          type: 'bar',
          barWidth: '30%'
        }
      ]
    }
  }
}

/**
 * 深度复制
 * @param target 复制到的对象
 * @param from ...多个对象
 */
function assign(target, from) {
  from = from||{}
  if(arguments.length>2){
    for (var s = 1; s <arguments.length ; s++ ) {
      assign(target, arguments[s])
    }
    return
  }
  for (const prop in from) {
    if (from.hasOwnProperty(prop)) {
      if (from[prop] !== null && typeof from[prop] === 'object') {
        if(from[prop] instanceof Element){
          target[prop] = from[prop]
        }else{
          if(Object.prototype.toString.call(from[prop]) === '[object Array]'){
            target[prop] = []
          }else{
            target[prop] = target[prop] || {}
          }
          assign(target[prop], from[prop])
        }
      } else {
        target[prop] = from[prop]
      }
    }
  }
}

/**
 * 初始化echat
 * @param el
 */
export function init(el){
  return echarts.init(el)
}

// 创建echart 图表
export function createChart(vopt){
  const chartType = vopt.chartType
  const allOpt = {}
  assign(allOpt,chartOptions[chartType],vopt)
  const option = allOpt.option
  // 表格设置
  option.el = allOpt.el
  option.title.text = allOpt.titleText
  option.yAxis.name = allOpt.unitText
  option.legend.data = allOpt.legendData
  option.xAxis.data = allOpt.xdata
  option.color = allOpt.legendColor

  const serie = option.series[0]
  option.series = []
  for (let i = 0; i < allOpt.legendData.length; i++) {
    let leTitle = allOpt.legendData[i]
    let leColor = allOpt.legendColor[i]
    const newSerie = {}
    assign(newSerie,serie)
    newSerie.name = leTitle
    newSerie.type = chartType
    if(newSerie.itemStyle){
      newSerie.itemStyle.color = leColor
    }
    if(newSerie.emphasis &&  newSerie.emphasis.itemStyle){
      newSerie.emphasis.itemStyle.borderColor = leColor
    }
    newSerie.data = []
    if(allOpt.ydata.length == allOpt.legendData.length){
      newSerie.data = allOpt.ydata[i]
    }
    option.series.push(newSerie)
  }

  // 添加show方法
  option.show = (myChart)=>{
    myChart = myChart || option.myChart
    if(!myChart && option.el){
      myChart = echarts.init(option.el)
    }
    if(myChart){
      option.myChart = myChart
      option.myChart.clear()
      option.myChart.setOption(option)
    }
  }

  // 添加数据设置方法
  option.setData = (xdata,ydata)=>{
    option.xAxis.data = xdata
    const series = option.series
    for (let i = 0; i < ydata.length; i++) {
      series[i].data = ydata[i]
    }
    option.show()
  }
  option.show()
  return option
}

/**
 * 创建趋势图
 * @param opts
 */
export function createLine(opts){
  opts.chartType = 'line'
  return createChart(opts)
}

/**
 * 创建柱状图
 * @param opts
 */
export function createBar(opts){
  opts.chartType = 'bar'
  return createChart(opts)
}
