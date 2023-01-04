import { createChart,init } from '@/views/pro/common/util/echartUtil'

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
    if(type ==='transDate')
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

    if(type==='gantry'){
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
      data.xData.push(vo.xname);
      data.passCnt.push(vo.total);
    }

    data.yData.push(data.passCnt);

    this.chart[chartType].setData(data.xData,data.yData);
  },
}
