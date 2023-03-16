import echarts from 'echarts'
import {dataGroup,transferPathType} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default  {
    /**
     *折线图
     */
    lineOption:{
        title:{
            text:'收费站通行费分析',
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
      text:'收费站通行费分析',
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
      barWidth: '60%',
      itemStyle:{
        color:'#0088ff'
      }
    }
    ]
  },
    init(el){
        this.$el = el
    },
    show:function(dataArr, type){
      if(!this.myChart){
        this.myChart = echarts.init(this.$el)
      }
      let data = {
        xdata:[],
        totalFee:[]
      }
      for(let i in dataArr){
        let vo = dataArr[i]
        data.xdata.push(vo.xname)
        data.totalFee.push(parseFloat(vo.totalFee.replace(/,/g,'')).toFixed(2))
      }
      let curOption = {}
      console.log(type)
      if (type ==='time') {
        curOption = this.lineOption
      }else{
        curOption = this.barOption
      }
      curOption.xAxis.data = data.xdata
      // 金额
      curOption.series[0].data = data.totalFee
      console.log(data.totalFee)
      this.myChart.clear()
      var typeName = '';
      switch (type){
        case 'road':
          typeName = '路段'
          break;
        case 'station':
          typeName = '收费站'
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
      curOption.title.text = '收费站通行费分析'+ typeName + '图表';
      this.myChart.setOption(curOption);
    },
  toYuan(num){
    // 转元(数字)
    return (parseFloat(num)).toFixed(2);
  }
}
