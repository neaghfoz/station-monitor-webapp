import moment from 'moment'
import {exportExcel} from "@/views/pro/common/util/dataUtil";
import gantryTollApi from "@/views/pro/analyse/toll/gantryToll/gantryTollApi";

export default {
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
          field: "tollFeeType1",
          title: "客一",
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeType2",
          title: "客二",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType3",
          title: "客三",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType4",
          title: "客四",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType11",
          title: "货一",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType12",
          title: "货二",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType13",
          title: "货三",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType14",
          title: "货四",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType15",
          title: "货五",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType16",
          title: "货六",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType21",
          title: "专一",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType22",
          title: "专二",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType23",
          title: "专三",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType24",
          title: "专四",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType25",
          title: "专五",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType26",
          title: "专六",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        },
        {
          field: "tollFeeType99",
          title: "其他车型",
          align: 'right',
          headerAlign: 'center',
          minWidth: 80
        }]
    },
    {
      title: "车种",
      align: 'center',
      headerAlign: 'center',
      children: [
        {
          field: "tollFeeClass0",
          title: "普通车",
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeClass8",
          title: "军警",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeClass10",
          title: "紧急",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeClass14",
          title: "车队",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeClass21",
          title: "绿通车",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeClass22",
          title: "联合收割机",
          headerAlign: 'center',
          align: 'right',
          minWidth: 90
        },
        {
          field: "tollFeeClass23",
          title: "抢险救灾",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeClass24",
          title: "J1类集装箱车",
          headerAlign: 'center',
          align: 'right',
          minWidth: 110
        },
        {
          field: "tollFeeClass25",
          title: "大件运输",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          field: "tollFeeClass26",
          title: "应急保障车",
          headerAlign: 'center',
          align: 'right',
          minWidth: 90
        },
        {
          field: "tollFeeClass27",
          title: "货车列车或半挂汽车列车",
          headerAlign: 'center',
          align: 'right',
          showOverflow: true,
          minWidth: 175
        },
        {
          field: "tollFeeClass28",
          title: "J2类型集装箱",
          headerAlign: 'center',
          align: 'right',
          minWidth: 110
        },
        {
          field: "tollFeeClass99",
          title: "其他车种",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        }
      ]
    },
    {
      title: "合计",
      align: 'right',
      headerAlign: 'center',
      field: "totalFee",
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
          field: "tollFeeTransETC",
          title: "ETC",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          title: "其它",
          field: "tollFeeTransOther",
          headerAlign: 'center',
          align: 'right',
          minWidth: 80
        },
        {
          title: "合计",
          field: "totalFee",
          headerAlign: 'center',
          align: 'right',
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
    resultData  = await gantryTollApi.findData(params,data);
    this.returnData = resultData;
    // return  resultData;
  },
  export:function (refTable,fileName) {
    exportExcel(refTable,fileName)
  }


}
