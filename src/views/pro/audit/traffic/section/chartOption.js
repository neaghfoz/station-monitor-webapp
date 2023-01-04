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
            data:['[完整]通行路径','[补点]通行路径'],
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
            name:'[完整]通行路径',
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
            name:'[补点]通行路径',
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
    zheMoreOption:{
        title:{
            text:'',
        },
        color:['#0088ff','#8cbfeb'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['[完整]通行路径','[补点]通行路径'],
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
            data: ['本路段进本路段出', '本路段进其它路段出', '其它路段进本路段出','途径路段'],
            axisLabel: { textStyle: {  color: "#333" } },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#EEE'
                },
            },
            axisLine:{ lineStyle:{ color:'#ddd' },show:false },
            axisTick: { show: false },
        },
        series: [
            {
                name: '[完整]通行路径',
                type: 'bar',
                barWidth: '21%'
            },
            {
                name: '[补点]通行路径',
                type: 'bar',
                barWidth: '21%'
            }
        ]
    },
    init(el){
        this.$el = el
    },
    dataFormat(dataArr,transDay){
        // 折线图数据格式化
        if (transDay){
            let datas = dataGroup(dataArr,null,function(item){
                return item.pathType
            },function(item,sum) {
                // 完整车流量
                let field = 'full'
                sum[field] = sum[field]||0
                sum[field] += item.totalNum - item.addNum
                // 补点车流量
                field = 'add'
                sum[field] = sum[field]||0
                sum[field] += item.addNum
            },function(item){
                return item.transDay == transDay
            })
            const result = {
                xdata:['本路段进本路段出', '本路段进其它路段出', '其它路段进本路段出','途径路段'],
                fullData:[],
                addData:[]
            }
          //  '本路段进本路段出', '本路段进其它路段出', '其它路段进本路段出','途径路段'
            let tmpArr = ['1_full','1_add','2_full','2_add','3_full','3_add','4_full','4_add']
            tmpArr.forEach((x)=>{
                let arr = x.split('_')
                let pathType = arr[0]
                let pathName = transferPathType(pathType)
                let type = arr[1]
                let idx = result.xdata.indexOf(pathName)
                if(!datas.hasOwnProperty(pathType)){
                    result.fullData[idx] = 0
                    result.addData[idx] = 0
                }else{
                    let vo = datas[pathType]
                    result.fullData[idx] = vo.full
                    result.addData[idx] = vo.add
                }
            })
            return result
        }else{
            // 趋势图数据格式化
            let datas = dataGroup(dataArr,['transDay'],function(item){
                return [item.transDay]
            },function(item,sum) {
                // 完整车流量
                let field = 'full'
                sum[field] = sum[field]||0
                sum[field] += item.totalNum - item.addNum
                // 补点车流量
                field = 'add'
                sum[field] = sum[field]||0
                sum[field] += item.addNum
            })
            datas.sort((a,b)=>{return a.transDay - b.transDay})
            const result = {
                xdata:[],
                fullData:[],
                addData:[]
            }
            for(let i in datas){
                let vo = datas[i]
                result.xdata.push(vo.transDay)
                result.fullData.push(vo.full)
                result.addData.push(vo.add)
            }
            return result
        }
    },
    show:function(data,transDay,clickFn){
        if(!this.myChart){
            this.myChart = echarts.init(this.$el)
        }
        let curOption = null
        if(transDay){
            // 折线图
            curOption = this.zheMoreOption
            this.myChart.off('click');//先移除，再点击
        }else{
            // 趋势图
            curOption = this.option
            this.myChart.off('click');//先移除，再点击
            this.myChart.on('click', function (e) {
                let transDay = e.name
                clickFn(transDay)
            });
        }
        curOption.xAxis.data = data.xdata
        // 完整车流量
        curOption.series[0].data = data.fullData
        // 补点车流量
        curOption.series[1].data = data.addData
        this.myChart.clear()
        this.myChart.setOption(curOption);
    }
}
