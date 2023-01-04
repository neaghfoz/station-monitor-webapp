import {dataGroup,exportExcel,mapToArray,transferVehicleClass,transferVehicleType,transferPathType ,transfer} from "@/views/pro/common/util/dataUtil"

// 转成成表格数据
export default  {
    // 统计数据
    totalSum: (groupField,item,hjsum,field,lstField,isSum)=>{
        // 门架原始车流量
        hjsum[item[groupField]+"_1"] = hjsum[item[groupField]+"_1"]||{}
        hjsum[item[groupField]+"_1"][field] = hjsum[item[groupField]+"_1"][field]||0
        hjsum[item[groupField]+"_1"][field] += item.oriNum
        // 最后一列合计
        if(isSum){
            hjsum[item[groupField]+"_1"][lstField] = hjsum[item[groupField]+"_1"][lstField]||0
            hjsum[item[groupField]+"_1"][lstField] += item.oriNum
        }


        // 门架修正车流量
        hjsum[item[groupField]+"_2"] = hjsum[item[groupField]+"_2"]||{}
        hjsum[item[groupField]+"_2"][field] = hjsum[item[groupField]+"_2"][field]||0
        hjsum[item[groupField]+"_2"][field] += item.pathNum
        // 最后一列合计
        if(isSum){
            hjsum[item[groupField]+"_2"][lstField] = hjsum[item[groupField]+"_2"][lstField]||0
            hjsum[item[groupField]+"_2"][lstField] += item.pathNum
        }


        // 门架拟合补全车流量
        hjsum[item[groupField]+"_3"] = hjsum[item[groupField]+"_3"]||{}
        hjsum[item[groupField]+"_3"][field] = hjsum[item[groupField]+"_3"][field]||0
        hjsum[item[groupField]+"_3"][field] += item.lastNum
        // 最后一列合计
        if(isSum){
            hjsum[item[groupField]+"_3"][lstField] = hjsum[item[groupField]+"_3"][lstField]||0
            hjsum[item[groupField]+"_3"][lstField] += item.lastNum
        }

        // 总合计原始车流量
        hjsum["Z999999999999999999_1"] = hjsum["Z999999999999999999_1"]||{}
        hjsum["Z999999999999999999_1"][field] = hjsum["Z999999999999999999_1"][field]||0
        hjsum["Z999999999999999999_1"][field] += item.oriNum
        // 总合计最后一列合计
        if(isSum){
            hjsum["Z999999999999999999_1"][lstField] = hjsum["Z999999999999999999_1"][lstField]||0
            hjsum["Z999999999999999999_1"][lstField] += item.oriNum
        }

        // 总合计修正车流量
        hjsum["Z999999999999999999_2"] = hjsum["Z999999999999999999_2"]||{}
        hjsum["Z999999999999999999_2"][field] = hjsum["Z999999999999999999_2"][field]||0
        hjsum["Z999999999999999999_2"][field] += item.pathNum
        // 总合计最后一列合计
        if(isSum){
            hjsum["Z999999999999999999_2"][lstField] = hjsum["Z999999999999999999_2"][lstField]||0
            hjsum["Z999999999999999999_2"][lstField] += item.pathNum
        }

        // 总合计拟合补全车流量
        hjsum["Z999999999999999999_3"] = hjsum["Z999999999999999999_3"]||{}
        hjsum["Z999999999999999999_3"][field] = hjsum["Z999999999999999999_3"][field]||0
        hjsum["Z999999999999999999_3"][field] += item.lastNum
        // 总合计最后一列合计
        if(isSum){
            hjsum["Z999999999999999999_3"][lstField] = hjsum["Z999999999999999999_3"][lstField]||0
            hjsum["Z999999999999999999_3"][lstField] += item.lastNum
        }
    },
    vcColumns : (gantryId)=>{ return [ {
        title: "门架信息",
        align:'center',
        children:[
            {
                title: "门架名称",
                align:'center',
                field: "gantryName",
                type:'html',
                formatter:({cellValue})=>{return `<span style="text-decoration:underline;cursor: pointer;">${cellValue}</span>`},
                visible: gantryId?false:true,
                minWidth:120
            },
            {
                field: "tollGantryId",
                title: "门架编码",
                align:'center',
                visible: gantryId?false:true,
                minWidth:120
            }
        ]},
        {
            title: "通行日期",
            align:'center',
            field: "transDay",
            visible: gantryId?true:false,
            minWidth:91
        },
        {
            field: "typeName",
            title: "类型",
            align: 'center',
            minWidth:120
        },
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
                    align:'right',
                    minWidth:80
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
    vtColumns : (gantryId)=>{ return [{
        title: "门架信息",
        align:'center',
        children:[
            {
                title: "门架名称",
                align:'center',
                field: "gantryName",
                type:'html',
                formatter:({cellValue})=>{return `<span style="text-decoration:underline;cursor: pointer;">${cellValue}</span>`},
                visible: gantryId?false:true,
                minWidth:120
            },
            {
                field: "tollGantryId",
                title: "门架编码",
                align:'center',
                visible: gantryId?false:true,
                minWidth:120
            }
        ]},
        {
            title: "通行日期",
            align:'center',
            field: "transDay",
            visible: gantryId?true:false,
            minWidth:91
        },
        {
            field: "typeName",
            title: "类型",
            align: 'center',
            minWidth:120
        },
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
    dataFormat:function (dataArr,gantryId,gantryMap){
        let hjsum = {} // 小计 合计
        let groupByField = null
        let whereFn = null
        if (gantryId){
            groupByField = 'transDay'
            whereFn = (item)=>{return item['tollGantryId'] == gantryId}
        }else{
            groupByField = 'tollGantryId'
        }
        let $totalSum = this.totalSum
        let datas = dataGroup(dataArr,null,function(item){
            return [item[groupByField]]
        },function(item,sum){
            if(item.vehicleClass !=null){
                // 不合法车种，转为其它
                if(transferVehicleClass(item.vehicleClass,true)==''){
                    item.vehicleClass = 99
                }
                // 按车种统计
                let field = 'vc'+item.vehicleClass
                let lstField = 'vcsum'
                $totalSum(groupByField,item,hjsum,field,lstField,true)
            }
            if(item.vehicleType !=null ){
                // 不合法车型，转为其它
                if(transferVehicleType(item.vehicleType,true) == '' ){
                    item.vehicleType = 99
                }
                // 按车型统计
                let field = 'vt'+item.vehicleType;
                let lstField = 'vtsum'
                $totalSum(groupByField,item,hjsum,field,lstField,true)

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
                    $totalSum(groupByField,item,hjsum,field,lstField,false)
                }
            }
        },whereFn);
        datas = mapToArray(hjsum,function(key,row){
            let arr = key.split('_')
            let gFieldVal = arr[0]
            let type = arr[1]
            row[groupByField] =gFieldVal
            // 转换 和 新增列
            row['type'] = type
            row['typeName'] = type==1?'门架原始车流量':(type==2?'清洗修正车流量':'拟合补全车流量')

            if(groupByField=='tollGantryId'){
                // 翻译门架名称
                row['gantryName'] = gantryMap[gFieldVal]||gFieldVal
                if(gFieldVal=='Z999999999999999999'){
                    row['gantryName'] = ''
                }
            }
        })
        datas.sort(function(a,b){
            return a[groupByField].localeCompare(b[groupByField])||a['type']-b['type']
        })
        if(datas.length>0){
            datas[datas.length-1][groupByField] = '合计'
            datas[datas.length-2][groupByField] = '合计'
            datas[datas.length-3][groupByField] = '合计'
        }
        return datas
    },
    export:function (refTable,fileName) {
        exportExcel(refTable,fileName)
    }
}
