import echarts from 'echarts'
import tableOption from "@/views/pro/audit/traffic/gantry/tableOption"

// 转成成表格数据
export default  {
    /**
     * 趋势图
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
            data:['门架原始车流量','清洗修正车流量','拟合补全车流量'],
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
            name: '单位（车次）',
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
            name:'门架原始车流量',
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
            name:'清洗修正车流量',
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
        },{
            name:'拟合补全车流量',
            type: 'line',
            symbol: 'circle',
            symbolSize:10,
            itemStyle:{
                color:'#f97f7f',
            },
            emphasis:{
                itemStyle:{
                    color:'#fff',
                    borderWidth:3,
                    borderColor: "#21d4b6"
                },
            },
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            smooth: true
        }]
    },
    init(el){
        this.$el = el
    },
    dataFormat(dataArr,gantryId,gantryMap){
        // 使用同个数据源
        let datas  = tableOption.dataFormat(dataArr,gantryId,gantryMap)
        let groupByField = null
        if (gantryId){
            groupByField = 'transDay'
        }else{
            groupByField = 'gantryName'
        }
        const result = {
            xdata:[],
            oriData:[],
            pathData:[],
            lastData:[]
        }
        for(let i in datas){
            let vo = datas[i]
            let xf = vo[groupByField]
            // 忽略汇总列
            if(xf == '合计' || xf == ''){
                continue
            }
            let type = vo.type
            if(result.xdata.indexOf(xf)==-1) {
                result.xdata.push(xf)
            }
            // 取vt合计
            if(type==1) {
                result.oriData.push(vo.vtsum)
            }else if(type==2){
                result.pathData.push(vo.vtsum)
            }else {
                result.lastData.push(vo.vtsum)
            }
        }
        return result
    },
    show(data,gantryId,clickFn,gantryMap){
        if(!this.myChart){
            this.myChart = echarts.init(this.$el)
        }
        let curOption = this.option
        this.myChart.off('click');//先移除，再点击
        if(!gantryId){
            this.myChart.on('click', function (e) {
                let gantryName = e.name
                let gantryId = gantryName
                for(let key in gantryMap){
                    let val = gantryMap[key]
                    if(val == gantryName){
                        gantryId = key
                        break
                    }
                }
                clickFn(gantryId)
            });
        }
        curOption.series[0].data = data.oriData;
        curOption.series[1].data = data.pathData;
        curOption.series[2].data = data.lastData;
        curOption.xAxis.data = data.xdata;
        this.myChart.clear()
        this.myChart.setOption(curOption);
    }
}
