import moment from 'moment'
import {exportExcel} from "@/views/pro/common/util/dataUtil";
import gantryFlowApi from "@/views/pro/analyse/flow/gantryFlow/gantryFlowApi";

export default  {
  returnData:{},
  roadGantryColumns: [
    {
      title: "路段名称",
      align: 'center',
      field: "roadName",
      minWidth: 120
    },
    {
      field: "gantryName",
      title: "门架名称",
      align: 'center',
      minWidth: 120
    },
    {
      field: "transTypeName",
      title: "交易类型",
      align: 'center',
      minWidth: 100
    },
    {
      title: "车型",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          field: "vehType1",
          title: "客一",
          align: 'right',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType2",
          title: "客二",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType3",
          title: "客三",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType4",
          title: "客四",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType11",
          title: "货一",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType12",
          title: "货二",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType13",
          title: "货三",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType14",
          title: "货四",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType15",
          title: "货五",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType16",
          title: "货六",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType21",
          title: "专一",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType22",
          title: "专二",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType23",
          title: "专三",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType24",
          title: "专四",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType25",
          title: "专五",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType26",
          title: "专六",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehType99",
          title: "其他车型",
          align: 'right',
          headerAlign: 'center',
          //formatter: 'integer',
          minWidth: 80
        }]
    },
    {
      title: "车种",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          field: "vehClass0",
          title: "普通车",
          align: 'right',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehClass8",
          title: "军警",
          headerAlign: 'center',
          align: 'right',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          field: "vehClass10",
          title: "紧急",
          headerAlign: 'center',
          //formatter: 'integer',
          align: 'right',
          minWidth: 80
        },
        {
          field: "vehClass14",
          title: "车队",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "vehClass21",
          title: "绿通车",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "vehClass22",
          title: "联合收割机",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 90
        },
        {
          field: "vehClass23",
          title: "抢险救灾",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "vehClass24",
          title: "J1类集装箱车",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 110
        },
        {
          field: "vehClass25",
          title: "大件运输",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "vehClass26",
          title: "应急保障车",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 90
        },
        {
          field: "vehClass27",
          title: "货车列车或半挂汽车列车",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          showOverflow: true,
          minWidth: 175
        },
        {
          field: "vehClass28",
          title: "J2类型集装箱",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 110
        },
        {
          field: "vehClass99",
          title: "其他车种",
          //formatter: 'integer',
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        }
      ]
    },
    {
      title: "合计",
      align: 'right',
      //formatter: 'integer',
      headerAlign: 'center',
      field: "total",
      minWidth: 100
    }],

  otherColumns:[
    {
      title: "序号",
      type: "seq",
      width: 50,
      headerAlign: 'center',
      align: "center"
    },
    {
      field: "vehTypeName",
      title: "车型",
      headerAlign: 'center',
      align: 'center',
      minWidth: 80
    },
    {
      title: "通行类型(单位辆)",
      align: 'center',
      minWidth: 80,
      children: [
        {
          field: "transETC",
          title: "ETC",
          headerAlign: 'center',
          align: 'right',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          title: "其它",
          field: "transOther",
          headerAlign: 'center',
          align: 'right',
          //formatter: 'integer',
          minWidth: 80
        },
        {
          title: "合计",
          field: "total",
          headerAlign: 'center',
          align: 'right',
          //formatter: 'integer',
          minWidth: 100
        },
      ]
    }
  ],

  /**
   * 根据类型获取列
   * @param type
   * @returns {[]}
   */
  getColumn (type)
  {
    let roadGantryColumnsTemp=[];
    let otherColumnsTemp = [];
    Object.assign(roadGantryColumnsTemp,this.roadGantryColumns);
    Object.assign(otherColumnsTemp,this.otherColumns);
    if(type === 'road')
    {
      roadGantryColumnsTemp.splice(1,1);
      console.log("this.roadGantryColumns:",this.roadGantryColumns);
      return roadGantryColumnsTemp;
    }else if(type === 'gantry')
    {
      return roadGantryColumnsTemp;
    }else if(type === 'vehicleType')
    {
      return otherColumnsTemp;
    }else if(type === 'vehicleClass')
    {
      otherColumnsTemp[1] =  {
        field: "vehClassName",
        title: "车种",
        headerAlign: 'center',
        align: 'center',
        minWidth: 80
      };
      return otherColumnsTemp;
    }else if(type === 'transDate')
    {
      otherColumnsTemp[1] =  {
        field: "transDate",
        title: "时间",
        headerAlign: 'center',
        align: 'center',
        minWidth: 100
      };
      return otherColumnsTemp;
    }
  },

  /**
   * 根据类型获取数据
   * @param params
   * @param data
   * @returns {Promise<void>}
   */
  async getData(params,data)
  {
    let resultData = {};
    resultData  = await gantryFlowApi.findData(params,data);
    this.returnData = resultData;
    // return  resultData;
  },
  export:function (refTable,fileName) {
    exportExcel(refTable,fileName)
  }


}
