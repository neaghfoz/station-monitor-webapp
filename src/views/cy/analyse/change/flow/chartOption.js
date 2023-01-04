import echarts from 'echarts'

// 转成成表格数据
export default  {
  /**
   *折线图
   */
  lineOption:{
    title:{
      text:'车流分析折线图',
      textStyle:{
        color:'#999',
        fontSize: 12,
        fontWeight: 'normal'
      },
      top:'13%',
      right:'3%',
    },
    legend:{
      data:[]
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
        rotate:0,//倾斜度 -90 至 90 默认为0
        margin:10
      }, 
      axisTick: { show: false },
      axisLine:{ lineStyle:{ color:'#ddd' } }
    },
    yAxis: {
      type: 'value',
      name: '单位（辆）',
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
      name:'特情流水数',
      type: 'line',
      symbol: 'circle',
      symbolSize:10,
      itemStyle:{
        normal:{
          color:'#0088ff',
          label:{
            show:true
          }
        }
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
  countMonth:[
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ],
  init(el){
    this.$el = el
  },
  show:function(dataArr, params){
    if(!this.myChart){
      this.myChart = echarts.init(this.$el)
    }
    console.log("dataArr:",dataArr); 
    this.lineOption.legend.data = [];
    this.lineOption.series = [];
    for(let i in dataArr){
      let vo = dataArr[i];
      console.log(vo);
      this.lineOption.legend.data.push(vo.countYear+''); 
      this.lineOption.yAxis.name='单位（辆）';
      var temp={
        name:vo.countYear,
        type:'line',
        tack: '总量',
        data:[]
      };
      temp.data.push(vo.sumOfJanuary,
        vo.sumOfFebruary,
        vo.sumOfMarch,
        vo.sumOfApril,
        vo.sumOfMay,
        vo.sumOfJune,
        vo.sumOfJuly,
        vo.sumOfAugust,
        vo.sumOfSeptember,
        vo.sumOfOctober,
        vo.sumOfNovember,
        vo.sumOfDecember);
      this.lineOption.series.push(temp);
      this.lineOption.tooltip.formatter = null; 
    }
    let curOption = {}
    curOption = this.lineOption
    curOption.xAxis.data = this.countMonth; 
    this.myChart.clear()
    this.myChart.setOption(curOption);
  },
}
