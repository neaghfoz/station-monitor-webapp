import moment from 'moment'
import {exportExcel} from "@/views/pro/common/util/dataUtil";
import gantrySpecialApi from "@/views/pro/analyse/special/gantry/gantrySpecialApi";

export default {
  returnData:{},
  roadGantryColumns: [
    {
      title: "序号",
      type: "seq",
      width: 50,
      headerAlign: 'center',
      align: "center"
    },
    {
      title: "路段名称",
      align: 'center',
      field: "sectionName",
      minWidth: 120
    },
    {
      field: "gantryName",
      title: "门架名称",
      align: 'center',
      minWidth: 320
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
      field: "specialTypeText",
      title: "特情类型名称",
      headerAlign: 'center',
      align: 'center',
      minWidth: 80
    },
    {
      field: "specialCnt",
      title: "特情流水量",
      headerAlign: 'center',
      //formatter: 'integer',
      align: 'center',
      minWidth: 80
    },
    {
      field: "specialRate",
      title: "特情占比",
      headerAlign: 'center',
      align: 'center',
      minWidth: 80
    }
  ],

  /**
   * 根据类型获取列
   * @param type
   * @returns {[]}
   */
  getColumn (colSettings, params)
  {
    let type = params.activeName
    let roadGantryColumnsTemp=[];
    let otherColumnsTemp = [];
    Object.assign(roadGantryColumnsTemp,this.roadGantryColumns);
    Object.assign(otherColumnsTemp,this.otherColumns);
    if(type === 'section')
    {
      roadGantryColumnsTemp.splice(2,1);
      for (var col in colSettings) {
        if(params.valueType === '1'){
          roadGantryColumnsTemp.push(
            {title: colSettings[col],
              field: col,
              minWidth: 150,
              //formatter: 'integer',
            });
        } else if(params.valueType === '2') {
          roadGantryColumnsTemp.push(
            {
              title: colSettings[col],
              field: col,
              minWidth: 150,
              formatter:(params) =>  {  //格式化数据的函数
                console.log('我的参数',params)  //打印出来的数据
                //未定义 返回  0.00%
                if ( !params.cellValue ) {
                  params.cellValue = '0.00%';
                }
                return params.cellValue;
              },
            });
        }

      }
      return roadGantryColumnsTemp;
    }else if(type === 'gantry')
    {
      for (var col in colSettings) {
        if(params.valueType === '1'){
          roadGantryColumnsTemp.push(
            {title: colSettings[col],
              field: col,
              minWidth: 150,
              //formatter: 'integer',
            });
        } else if(params.valueType === '2') {
          roadGantryColumnsTemp.push(
            {
              title: colSettings[col],
              field: col,
              minWidth: 150,
              formatter:(params) =>  {  //格式化数据的函数
                //未定义 返回  0.00%
                if ( !params.cellValue ) {
                  params.cellValue = '0.00%';
                }
                return params.cellValue;
              },
            });
        }
      }
      return roadGantryColumnsTemp;
    }else if(type === 'specialType')
    {
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
    resultData  = await gantrySpecialApi.findData(params,data);
    this.returnData = resultData;
    // return  resultData;
  },
  export:function (refTable,fileName) {
    exportExcel(refTable,fileName)
  }


}
