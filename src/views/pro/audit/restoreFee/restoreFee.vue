<template>
  <div class="app-container">
    <el-form ref="appForm" :model="appForm" :rules="rules" :show-message="false" inline :label-width="'110px'">

      <el-form-item label="车型" prop="vehicleType">
        <ti-select style="width: 200px" :clearable="true" v-model="appForm.vehicleType"
                   dict-type="tibms_com_vehicleType"/>
      </el-form-item>

      <el-form-item  label="车种" prop="vehicleClass">
        <ti-select :clearable="true" style="width: 200px" v-model="appForm.vehicleClass"
                   dict-type="tibms_com_vehicleClass"/>
      </el-form-item>

      <el-form-item label="通行介质类型" prop="mediaType">
        <ti-select style="width: 200px" :clearable="true" v-model="appForm.mediaType" dict-type="tibms_com_mediaType"
                   :multiple="false"/>
      </el-form-item>

      <el-form-item label="入口站" prop="enStationId">
        <ti-select style="width: 200px" v-model="appForm.enStationId" :clearable="true"
                   url="/api/v1/common/station/findAllList" :props="{key:'stationId',value:'stationId',label:'stationName'}"
                   :multiple="false" aria-placeholder="入口站"/>
      </el-form-item>

      <el-form-item label="出口站" prop="exStationId">
        <ti-select style="width: 200px" v-model="appForm.exStationId" :clearable="true"
                   url="/api/v1/common/station/findAllList" :props="{key:'stationId',value:'stationId',label:'stationName'}"
                   :multiple="false" aria-placeholder="出口站"/>
      </el-form-item>

      <el-form-item label="门架编码" prop="gantryIds">
        <ti-select style="width: 300px" placeholder="请按通行顺序选择门架" v-model="appForm.gantryIds" :clearable="true"
                   url="/api/v1/common/gantry/findList"
                   :dataFilter="gantryFilter"
                   :props="{key:'gantryId',value:'gantryId',label:'gantryText'}"
                   :multiple="true" aria-placeholder="门架编码"/>
      </el-form-item>

      <el-form-item label="通行时间" prop="transTime">
        <el-date-picker style="width: 200px"
                        v-model="appForm.transTime"
                        type="datetime"
                        :clearable="true"
                        placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>



      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <vxe-grid ref="appTable"
              highlight-hover-row
              border
              resizable
              sync-resize
              auto-resize
              keep-source
              highlight-current-row
              class="vxe-table-element"
              :export-config="{}"
              :loading="table.loading"
              :columns="table.columns"
              :data="table.datas"
    />
    <div style="margin-top:20px;" v-show="table.datas.length>0">
      <ti-road-net ref="roadNet" :path-info-list="pathList" :image-show="false" :check-show="false"></ti-road-net>
    </div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import { getStation } from "@/views/pro/common/util/dataUtil"
import TiPanel from "@/views/pro/common/tiElement/tiPanel/tiPanel"
import { getData } from '@/views/pro/audit/restoreFee/restoreFeeApi'
import { transferVehicleType } from "@/views/pro/common/util/dataUtil"
import TiRoadNet from "@/views/pro/audit/comm/tiRoadNet/tiRoadNet";
import moment from 'moment'


export default {
  name: "audit.restoreFee.restoreFeeView",
  components: { TiSelect,TiPanel,TiRoadNet },
  mixins: [...mixin],
  data() {
    return {
      pathList: [],
      appForm: {
        enStationId: null,
        exStationId: null,
        gantryIds: null,
        vehicleType: '11',
        vehicleClass: '0',
        mediaType: '1',
        transTime: new Date()
      },
      rules: {
        enStationId: { type: 'string', required: true, message: '' },
        exStationId: { type: 'string', required: true, message: '' },
        vehicleType: { type: 'string', required: true, message: '' },
        vehicleClass: { type: 'string', required: true, message: '' },
        mediaType: { type: 'string', required: true, message: '' },
        transTime: { type: 'date', required: true, message: '' }
      },
      table: {
        columns: [{
          title: '入口站',
          field: 'enName',
          align:'left',
          minWidth:160
        },{
          title: '出口站',
          field: 'exName',
          align:'left',
          minWidth:160
        },{
          title: '车型',
          field: 'vehicleType',
          align:'center',
          formatter: function ({ cellValue }){
            return transferVehicleType(cellValue)
          },
          minWidth:100,
        },{
          title: '总里程(公里)',
          field: 'miles',
          align:'right',
          formatter: function ({ cellValue }){
            return (cellValue/1000.0).toFixed(2)
          },
          minWidth:100
        },{
          title: '应收金额',
          field: 'payFee',
          align:'right',
          formatter: function ({ cellValue }){
            return (cellValue/100).toFixed(2)
          },
          minWidth:100
        },{
          title: '实收金额',
          field: 'fee',
          align:'right',
          formatter: function ({ cellValue }){
            return (cellValue/100).toFixed(2)
          },
          minWidth:100
        },{
          title: '费率版本',
          field: 'version',
          align:'center',
          minWidth:120
        }],
        datas: [],
        loading: false
      }
    }
  },
  methods: {
    // 默认路段设置
    stationFilter(datas) {
      const seArr = []
      getStation(datas,seArr)
      return seArr
    },
    gantryFilter(datas){
      return datas.filter((x)=>{return x.gantryType == 1}).sort(x=>x.gantryId);
      // return datas.sort(x=>x.gantryId);
    },
    async reqApi(){
      this.table.loading = true
      const response = await getData(this.appForm)
      this.table.loading = false
      if(response.code==200){
        this.table.datas = [response.data]
        if(this.table.datas.length>0){
          const paths = this.table.datas[0].restoreResult.roadPaths
          paths.forEach(x=>{
            const serialType =  x.serialType
            // intervalType : 1--交易成功  2--代收拆点 3--交易失败 4--牌识补点 5--人工补点 6--拟合补点
            // intervalTypeName  1--交易成功  2--代收拆点 3--交易失败 4--牌识补点 5--人工补点 6--拟合补点
            x['payFeeTxt'] = (x.payFee/100.0).toFixed('2')
            x['feeTxt'] = (x.fee/100.0).toFixed('2')
            x['discountFeeTxt'] = (x.discountFee/100.0).toFixed('2')
            x['tollIntervalName'] = x.name
            x['tradeTime'] = moment(x.transTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
            if(serialType==1 || serialType==3){
              x['pathType'] = 4 // 交易成功
              x['intervalType'] = 1
              x['intervalTypeName'] = '交易成功'
            }else{
              if(x.isAdd){
                x['pathType'] = 3 // 路径缺失
                x['intervalType'] = 6
                x['intervalTypeName'] = '拟合补点'
              }else{
                x['pathType'] = 1 // 交易失败
                x['intervalType'] = 3
                x['intervalTypeName'] = '交易失败'
              }

            }
          })
          this.pathList = paths
        }
      }else{
        alert(response.message)
        this.table.loading = false
      }
    },
    submit() {
      this.$refs['appForm'].validate((valid) => {
        if (valid) {
          this.reqApi()
        } else {
          return false;
        }
      })
    },
    reset() {
      this.$refs['appForm'].resetFields()
    }
  }
}
</script>
