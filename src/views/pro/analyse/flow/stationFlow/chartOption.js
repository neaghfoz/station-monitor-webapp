import { createChart,init } from '@/views/pro/common/util/echartUtil'

// 转成成表格数据
export default  {
  chart: {
    myChart:null
  },
  init(el,dataArr,type){
    // 初始化,不同图表公用一个div
    if(!this.chart.myChart)
    {
      this.chart.myChart = init(el);
    }
    this.show(dataArr,type);
  },
  show:function(dataArr, type){
    console.log("dataArr:",dataArr);

    let chartType = 'bar';
    if(type ==='collectDate')
    {
      chartType = 'line';
    }

    if(!this.chart[chartType]){
      this.chart[chartType] = createChart({
        chartType: chartType,
        unitText: '单位(辆)',
        legendData: ['车流量']
      })
      this.chart[chartType].myChart = this.chart.myChart
    }

    if(type==='station'){
      // x轴字图倾斜 展示
      this.chart[chartType].xAxis.axisLabel.rotate = 35
    }else{
      this.chart[chartType].xAxis.axisLabel.rotate = 0
    }
    this.chart[chartType].series[0].name = '车流量'

    let data = {
      xData:[],
      passCnt:[],
      yData:[]
    }
    for(let i in dataArr){
      let vo = dataArr[i]
      if(type === 'road')
      {
        data.xData.push(vo.roadName)
      }else if(type === 'station'){
        data.xData.push(vo.stationName)
      }
      else if(type === 'vehicleType')
      {
        data.xData.push(vo.vehTypeName)
      }else if(type === 'vehicleClass')
      {
        data.xData.push(vo.vehClassName)
      }else if(type ==='collectDate'){
        data.xData.push(vo.transTime)
      }

      data.passCnt.push(vo.passCnt)
    }

    data.yData.push(data.passCnt);

    this.chart[chartType].setData(data.xData,data.yData);

  },
}
