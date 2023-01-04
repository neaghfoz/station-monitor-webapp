import {dataGroup,exportExcel,mapToArray,transferVehicleClass,transferVehicleType,transferPathType ,transfer} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default  {
    //统计一天的数据，按补点和完整路劲展示
    daySum (item,hjsum,field,lstField){
        // 完整车流量
        hjsum[item.pathType+"_1"] = hjsum[item.pathType+"_1"]||{}
        hjsum[item.pathType+"_1"][field] = hjsum[item.pathType+"_1"][field]||0
        hjsum[item.pathType+"_1"][field] += item.totalNum-item.addNum
        // 最后一列合计
        hjsum[item.pathType+"_1"][lstField] = hjsum[item.pathType+"_1"][lstField]||0
        hjsum[item.pathType+"_1"][lstField] += item.totalNum-item.addNum

        // 补点车流量
        hjsum[item.pathType+"_2"] = hjsum[item.pathType+"_2"]||{}
        hjsum[item.pathType+"_2"][field] = hjsum[item.pathType+"_2"][field]||0
        hjsum[item.pathType+"_2"][field] += item.addNum
        // 最后一列合计
        hjsum[item.pathType+"_2"][lstField] = hjsum[item.pathType+"_2"][lstField]||0
        hjsum[item.pathType+"_2"][lstField] += item.addNum

        // 合计车流量
        hjsum[item.pathType+"_3"] = hjsum[item.pathType+"_3"]||{}
        hjsum[item.pathType+"_3"][field] = hjsum[item.pathType+"_3"][field]||0
        hjsum[item.pathType+"_3"][field] += item.totalNum
        // 最后一列合计
        hjsum[item.pathType+"_3"][lstField] = hjsum[item.pathType+"_3"][lstField]||0
        hjsum[item.pathType+"_3"][lstField] += item.totalNum

        // 总合计
        hjsum["5_1"] = hjsum["5_1"]||{}
        hjsum["5_1"][field] = hjsum["5_1"][field]||0
        hjsum["5_1"][field] += item.totalNum
        // 总合计最后一列合计
        hjsum["5_1"][lstField] = hjsum["5_1"][lstField]||0
        hjsum["5_1"][lstField] += item.totalNum
    },
    vcColumns : (transDay)=>{ return [{
        title: "路段车流量",
        align:'center',
        children:[
            {
                title: "通行日期",
                align:'center',
                field: "dayName",
                type:'html',
                formatter:({cellValue})=>{return `<span style="text-decoration:underline;cursor: pointer;">${cellValue}</span>`},
                visible: transDay?false:true,
                minWidth:91
            },
            {
                field: "pathTypeName",
                title: "通行路径类型",
                align:'center',
                minWidth:151
            },
            {
                field: "typeName",
                title: "路段车流量类型",
                visible: transDay?true:false,
                align: 'center',
                minWidth:120
            }
        ]},
        {
            title: "车种",
            align:'center',
            headerAlign:'center',
            children:[
                {
                    field: "vc0",
                    title: "普通车",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc6",
                    title: "公务车",
                    align:'right',
                    headerAlign:'center',
                    minWidth:80
                },
                {
                    field: "vc8",
                    title: "军警",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc10",
                    title: "紧急",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc12",
                    title: "免费车",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc14",
                    title: "车队",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc21",
                    title: "绿通车",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc22",
                    title: "联合收割机",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc23",
                    title: "抢险救灾",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc24",
                    title: "J1类集装箱车",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc25",
                    title: "大件运输",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc26",
                    title: "应急保障车",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc27",
                    title: "货车列车或半挂汽车列车",
                    headerAlign:'center',
                    minWidth:80,
                    align:'right'
                },
                {
                    field: "vc28",
                    title: "J2类型集装箱",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vc99",
                    title: "其他车种",
                    headerAlign:'center',
                    align:'right',
                    minWidth:80
                }
            ]
        },
        {
            title: "合计",
            align:'right',
            headerAlign:'center',
            field: "vcsum",
            minWidth:80
        }]
    },
    vtColumns : (transDay)=>{ return [{
        title: "路段车流量",
        align:'center',
        children:[
            {
                title: "通行日期",
                align:'center',
                field: "dayName",
                type:'html',
                formatter:({cellValue})=>{return `<span style="text-decoration:underline;cursor: pointer;">${cellValue}</span>`},
                visible: transDay?false:true,
                minWidth:91
            },
            {
                field: "pathTypeName",
                title: "通行路径类型",
                align:'center',
                minWidth:151
            },
            {
                field: "typeName",
                title: "路段车流量类型",
                visible: transDay?true:false,
                align: 'center',
                minWidth:120
            }
        ]},
        {
            title: "客车",
            align:'center',
            headerAlign:'center',
            children:[
                {
                    field: "vt1",
                    title: "客一",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt2",
                    title: "客二",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt3",
                    title: "客三",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt4",
                    title: "客四",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "kchj",
                    title: "小计",
                    align:'right',
                    minWidth:80
                }
            ]
        },
        {
            title: "货车",
            align:'center',
            headerAlign:'center',
            children:[
                {
                    field: "vt11",
                    title: "货一",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt12",
                    title: "货二",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt13",
                    title: "货三",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt14",
                    title: "货四",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt15",
                    title: "货五",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt16",
                    title: "货六",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "hchj",
                    title: "小计",
                    align:'right',
                    minWidth:80
                }
            ]
        },
        {
            title: "专项作业车",
            align:'center',
            headerAlign:'center',
            children:[
                {
                    field: "vt21",
                    title: "专一",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt22",
                    title: "专二",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt23",
                    title: "专三",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt24",
                    title: "专四",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt25",
                    title: "专五",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "vt26",
                    title: "专六",
                    align:'right',
                    minWidth:80
                },
                {
                    field: "zxhj",
                    title: "小计",
                    align:'right',
                    minWidth:80
                }
            ]
        },
        {
            field: "vt99",
            title: "其它",
            align:'right',
            minWidth:80
        },
        {
            title: "合计",
            align:'right',
            headerAlign:'center',
            field: "vtsum",
            minWidth:80
        }]
    },
    dataFormat:function(dataArr,transDay){
        let hjsum = {} // 小计 合计
        let allField = '99999999' // 最后合计标记
        // 按天统计
        if (!transDay){
            let datas = dataGroup(dataArr,["transDay","pathType"],function(item){
                return [item.transDay,item.pathType]
            },function(item,sum){
                let field = item.transDay
                if(item.vehicleClass !=null){
                    // 不合法车种，转为其它
                    if(transferVehicleClass(item.vehicleClass,true)==''){
                        item.vehicleClass = 99
                    }
                    // 按车种统计
                    field = 'vc'+item.vehicleClass
                    sum[field] = sum[field]||0
                    sum[field] += item.totalNum
                    // 天合计
                    hjsum[item.transDay] = hjsum[item.transDay]||{}
                    hjsum[item.transDay][field] = hjsum[item.transDay][field]||0
                    hjsum[item.transDay][field] += item.totalNum
                    // 总合计
                    hjsum[allField] = hjsum[allField]||{}
                    hjsum[allField][field] = hjsum[allField][field]||0
                    hjsum[allField][field] += item.totalNum

                    // 最后一列合计
                    field = 'vcsum';
                    sum[field] = sum[field]||0;
                    sum[field] += item.totalNum;
                    // 天合计
                    hjsum[item.transDay] = hjsum[item.transDay]||{}
                    hjsum[item.transDay][field] = hjsum[item.transDay][field]||0
                    hjsum[item.transDay][field] += item.totalNum
                    // 总合计
                    hjsum[allField] = hjsum[allField]||{}
                    hjsum[allField][field] = hjsum[allField][field]||0
                    hjsum[allField][field] += item.totalNum
                }
                if(item.vehicleType !=null ){
                    // 不合法车型，转为其它
                    if(transferVehicleType(item.vehicleType,true) == '' ){
                        item.vehicleType = 99
                    }
                    // 按车型统计
                    let field = 'vt'+item.vehicleType;
                    sum[field] = sum[field]||0;
                    sum[field] += item.totalNum;
                    // 天合计
                    hjsum[item.transDay] = hjsum[item.transDay]||{}
                    hjsum[item.transDay][field] = hjsum[item.transDay][field]||0
                    hjsum[item.transDay][field] += item.totalNum
                    // 总合计
                    hjsum[allField] = hjsum[allField]||{}
                    hjsum[allField][field] = hjsum[allField][field]||0
                    hjsum[allField][field] += item.totalNum

                    // 客货专小计
                    let hasType = false;
                    if(item.vehicleType>0 && item.vehicleType <5){
                        field = 'kchj';
                        hasType =true;
                    }else  if(item.vehicleType>10 && item.vehicleType <17){
                        field = 'hchj';
                        hasType =true;
                    }else  if(item.vehicleType>20 && item.vehicleType <27){
                        field = 'zxhj';
                        hasType =true;
                    }
                    if(hasType){
                        sum[field] = sum[field]||0;
                        sum[field] += item.totalNum;
                        // 天合计
                        hjsum[item.transDay] = hjsum[item.transDay]||{}
                        hjsum[item.transDay][field] = hjsum[item.transDay][field]||0
                        hjsum[item.transDay][field] += item.totalNum
                        // 总合计
                        hjsum[allField] = hjsum[allField]||{}
                        hjsum[allField][field] = hjsum[allField][field]||0
                        hjsum[allField][field] += item.totalNum
                    }

                    // 最后一列合计
                    field = 'vtsum';
                    sum[field] = sum[field]||0;
                    sum[field] += item.totalNum;
                    // 天合计
                    hjsum[item.transDay] = hjsum[item.transDay]||{}
                    hjsum[item.transDay][field] = hjsum[item.transDay][field]||0
                    hjsum[item.transDay][field] += item.totalNum
                    // 总合计
                    hjsum[allField] = hjsum[allField]||{}
                    hjsum[allField][field] = hjsum[allField][field]||0
                    hjsum[allField][field] += item.totalNum
                }
            });
            let hjRows = mapToArray(hjsum,function(key,row){
                row['transDay'] = key
            })
            datas = datas.concat(hjRows)
            // 排序和转换、添加字段
            transfer(datas,function (row) {
                row['pathTypeName'] = transferPathType(row.pathType,true)||'合计'
                row['dayName'] = row['transDay']
                if(row['pathTypeName'] == '合计' ){
                    row['pathType'] = 5
                }
                if(row['transDay'] == '99999999' ){
                    row['dayName'] = ''
                    row['pathTypeName'] = '总合计'
                }
            })
            datas.sort(function(a,b){
                return a.transDay-b.transDay||a.pathType-b.pathType
            })
            return datas
        }else{
            let daySum = this.daySum
            let datas = dataGroup(dataArr,["pathType"],function(item){
                return [item.pathType]
            },function(item,sum){
                if(item.vehicleClass !=null){
                    // 不合法车种，转为其它
                    if(transferVehicleClass(item.vehicleClass,true)==''){
                        item.vehicleClass = 99
                    }
                    // 按车种统计
                    let field = 'vc'+item.vehicleClass
                    let lstField = 'vcsum'
                    daySum(item,hjsum,field,lstField)
                }
                if(item.vehicleType !=null ){
                    // 不合法车型，转为其它
                    if(transferVehicleType(item.vehicleType,true) == '' ){
                        item.vehicleType = 99
                    }
                    // 按车型统计
                    let field = 'vt'+item.vehicleType;
                    let lstField = 'vtsum'
                    daySum(item,hjsum,field,lstField)

                    // 客货专小计
                    let hasType = false;
                    if(item.vehicleType>0 && item.vehicleType <5){
                        field = 'kchj';
                        hasType =true;
                    }else  if(item.vehicleType>10 && item.vehicleType <17){
                        field = 'hchj';
                        hasType =true;
                    }else  if(item.vehicleType>20 && item.vehicleType <27){
                        field = 'zxhj';
                        hasType =true;
                    }
                    if(hasType){
                        daySum(item,hjsum,field,lstField)
                    }
                }
            });
            datas = mapToArray(hjsum,function(key,row){
                let arr = key.split('_')
                let pathType = arr[0]
                let type = arr[1]
                row['pathType'] = pathType
                row['type'] = type
                row['order'] = key.replace('_','')
            })
            // 排序和转换、添加字段
            transfer(datas,function (row) {
                row['pathTypeName'] = transferPathType(row.pathType,true)||'总合计'
                // 设置排序字段
                let type = row['type']
                row['typeName'] = type==1?'完整路径':(type==2?'补点路径':'小计')
                if(row['pathTypeName'] == '总合计' ){
                    row['typeName'] = '总合计'
                    row['pathTypeName'] = ''
                }
            },function (item) {
                return item.transDay=transDay
            })
            datas.sort(function(a,b){
                return a.order-b.order
            })
            return datas
        }
    },
    export:function (refTable,fileName) {
        exportExcel(refTable,fileName)
    }
}
