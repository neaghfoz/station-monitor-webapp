import echarts from 'echarts'
import {dataGroup,transferPathType} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default  {
    /**
     * 双线趋势图
     */
    option:{
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
            data:['路段校核应收金额','省中心拆分路段收益金额'],
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
            name: '单位（万元）',
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
            name:'路段校核应收金额',
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
        },{
            name:'省中心拆分路段收益金额',
            type: 'line',
            symbol: 'circle',
            symbolSize:10,
            itemStyle:{
                color:'#21d4b6',
            },
            emphasis:{
                itemStyle:{
                    color:'#fff',
                    borderWidth:3,
                    borderColor: "#21d4b6"
                },
            },
            smooth: true
        }
        ]
    },
    init(el){
        this.$el = el
    },
    show:function(dataArr){
      if(!this.myChart){
        this.myChart = echarts.init(this.$el)
      }
      let data = {
        xdata:[],
        auditFee:[],
        settleFee:[]
      }
      for(let i in dataArr){
        let vo = dataArr[i]
        data.xdata.push(vo.transDay)
        data.auditFee.push(this.toYuan(vo.auditFee))
        data.settleFee.push(this.toYuan(vo.settleFee))
      }
      let curOption = this.option

      curOption.xAxis.data = data.xdata
      // 路段校核应收金额
      curOption.series[0].data = data.auditFee
      // 省中心拆分路段收益金额
      curOption.series[1].data = data.settleFee
      this.myChart.clear()
      this.myChart.setOption(curOption);
    },
  toYuan(num){
    // 转W元
    return (parseFloat(num)/1000000).toFixed(2);
  }
}
