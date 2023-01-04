<template>
  <div class="app-container">
    <div v-show="true" class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline label-width="100px">
        <el-form-item label="车牌号码" prop="vehiclePlate">
          <el-input v-model="queryParams.vehiclePlate" type="text" placeholder="车牌号码" style="width: 160px" />
        </el-form-item>
        <el-form-item label="车牌颜色" prop="vehicleColor">
          <ti-select style="width: 177px" v-model="queryParams.vehicleColor" dict-type="tibms_com_vehicleColor" />
        </el-form-item>
        <el-form-item label="OBU编号" prop="obuId">
          <el-input v-model="queryParams.obuId" type="text" placeholder="OBU编号" />
        </el-form-item>
        <el-form-item label="ETC卡号" prop="cardId">
          <el-input v-model="queryParams.cardId" type="text" placeholder="ETC卡号" style="width: 190px" />
        </el-form-item>
        <el-form-item label="置信冲突" prop="confidenceConflict">
          <el-select v-model="queryParams.confidenceConflict" placeholder="置信冲突" clearable style="width: 110px">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="queryData">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-form-item :label-width="'50px'" style="padding-left: 30px">
          <el-radio-group v-model="queryParams.vehicleBaseType">
            <el-radio :label="1">流水车型库</el-radio>
            <el-radio :label="2">精确车型库</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="'50px'" style="padding-left: 30px">
          <el-button type="primary" @click="downloadVehicleTypeFile">导出车辆车型库</el-button>
          <el-button type="primary" @click="edit(selectRow)">确认车型</el-button>
        </el-form-item>
      </el-form>
    </div>

    <vxe-grid
      ref="vex"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      max-height="550"
      align="center"
      row-style="row--current{background-color: #ffe5bb !important;}"
      class="vxe-table-element"
      :keyboard-config="{ isArrow: true }"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      @page-change="handlePageChange"
      @current-change="currentChangeEvent"
    >
      <template v-slot:operation="{ row }">
        <el-button type="warning" @click="edit(row)">确认车型</el-button>
      </template>
    </vxe-grid>

    <el-tabs v-model="activeName" :before-leave="beforeTabLeave">
      <el-tab-pane label="车辆基本信息" name="first">
        <div v-if="isSelectRow">
          <el-row :gutter="15" type="flex" style="padding: 10px">
            <el-col>
              <label>车辆基本信息</label>
            </el-col>
          </el-row>
          <table style="width: 100%; padding-left: 20px; text-align: center">
            <el-row :gutter="15" type="flex">
              <el-col :span="3">
                <span>车牌号码</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.vehiclePlate }}</span>
              </el-col>
              <el-col :span="3">
                <span>车牌颜色</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.vehicleColorDesc }}</span>
              </el-col>
              <el-col :span="3">
                <span>用户类型</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.userTypeDesc }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="15" type="flex">
              <el-col :span="3">
                <span>流水车型</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.vehicleTypeDesc }}</span>
              </el-col>
              <el-col :span="3">
                <span>置信度</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.vehicleTypeRatio ? selectRow.vehicleTypeRatio + '%' : '' }}</span>
              </el-col>
              <el-col :span="3"> </el-col>
              <el-col :span="4"> </el-col>
            </el-row>
            <el-row :gutter="15" type="flex">
              <el-col :span="3">
                <span>精确车型</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.confirmVehicleTypeDesc }}</span>
              </el-col>
              <el-col :span="3">
                <span>生成精确车型时间</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.confirmTime }}</span>
              </el-col>
              <el-col :span="3">
                <span>置信冲突</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.confidenceConflictDesc }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="15" type="flex">
              <el-col :span="3">
                <span>车种</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.vehicleClassDesc }}</span>
              </el-col>
              <el-col :span="3">
                <span>车轴数</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.axleCount }}</span>
              </el-col>
              <el-col :span="3">
                <span>车辆座位数/载重</span>
              </el-col>
              <el-col :span="4">
                <span>{{
                  !selectRow.vehicleType || 11 > selectRow.vehicleType ? selectRow.vehicleSeat : selectRow.vehicleWeight
                }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="15" type="flex">
              <el-col :span="3">
                <span>ETC卡号</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.cardId }}</span>
              </el-col>
              <el-col :span="3">
                <span>ETC卡类别</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.cardTypeDesc }}</span>
              </el-col>
              <el-col :span="3">
                <span>OBU单/双片标识</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.obuSignDesc }}</span>
              </el-col>
            </el-row>
            <el-row :gutter="15" type="flex">
              <el-col :span="3">
                <span>OBU编号</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.obuId }}</span>
              </el-col>
              <el-col :span="3">
                <span>首次生成时间</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.createTime }}</span>
              </el-col>
              <el-col :span="3">
                <span>最后更新时间</span>
              </el-col>
              <el-col :span="4">
                <span>{{ selectRow.updateTime }}</span>
              </el-col>
            </el-row>
          </table>

          <el-row :gutter="15" type="flex" style="padding: 10px">
            <el-col>
              <label>通行信息<span style="color: red">（仅供参考）</span></label>
            </el-col>
          </el-row>
          <vxe-table
            show-overflow
            border
            resizable
            sync-resize
            auto-resize
            keep-source
            :loading="passStatloading"
            :data="passTableData"
            align="center"
            class="vxe-table-element"
          >
            <vxe-table-column field="transTypeDesc" title="过车类型"></vxe-table-column>
            <vxe-table-column field="vehicleTypeDesc" title="计费车型"></vxe-table-column>
            <vxe-table-column field="vehicleClassDesc" title="计费车种"></vxe-table-column>
            <vxe-table-column field="passCount" title="累计通行次数"></vxe-table-column>
            <vxe-table-column field="feeSum" title="累计通行费金额（元）"></vxe-table-column>
            <vxe-table-column field="updateTime" title="更新时间"></vxe-table-column>
          </vxe-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史通行记录" name="second"> 历史通行记录 </el-tab-pane>
    </el-tabs>

    <veh-type-confirm ref="vehicleInfoBaseVehTypeConfirmDialog" @updateRowData="updateRowData" @refreshData="getData" />
  </div>
</template>

<script>
import request from "ecip-web/utils/request";
import mixin from 'ecip-web/utils/common-mixin'
import moment from "moment";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"

import { getData } from "@/views/pro/audit/vehicleBase/api/vehicleInfoBaseApi"
import { listByVehicle } from "@/views/pro/audit/vehicleBase/api/vehiclePassStatApi"
import VehTypeConfirm from './components/vehTypeConfirm'

export default {
  name: 'audit.vehicleBase.vehicleInfoBaseView',
  mixins: [...mixin],
  components: { VehTypeConfirm, TiSelect },
  data () {
    return {
      queryParams: {
        vehiclePlate: '',
        vehicleColor: '',
        obuId: '',
        cardId: '',
        confidenceConflict: '',
        vehicleBaseType: 1
      },
      loading: false,
      passStatloading: false,
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'right',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
          'Total'],
        perfect: true
      },
      activeName: 'first',
      selections: [],
      tableData: [],
      passTableData: [],
      selectRowIndex: 0,
      selectRow: {},
      isSelectRow: false,
      downloadVehicleTypeFileUrl: 'api/v1/audit/vehicleBase/vehicleInfoBase/downloadVehTypeFile',
      columns: [
        {
          title: "序号",
          type: "seq",
          width: 70,
          align: "center"
        },
        { title: '车牌号码', field: 'vehiclePlate', tableField: 'vehiclePlate', minWidth: 180 },
        { title: '车牌颜色', field: 'vehicleColorDesc', tableField: 'vehicleColor', minWidth: 180 },
        { title: '流水车型', field: 'vehicleTypeDesc', tableField: 'vehicleType', minWidth: 180 },
        {
          title: '置信度', field: 'vehicleTypeRatio', tableField: 'vehicleTypeRatio', minWidth: 180, slots: {
            default: ({ row, column }) => {
              return [<span>{row.vehicleTypeRatio ? row.vehicleTypeRatio + '%' : ''}</span>]
            },
          },
        },
        { title: '精确车型', field: 'confirmVehicleTypeDesc', tableField: 'confirmVehicleType', minWidth: 180 },
        /* { title: '操作', width: 150, fixed: 'right', align: 'center', slots: { default: 'operation' } } */
      ]

    }
  },
  created () {
    // 阻止频繁操作
    this.getVehiclePassStatData = this.debounce(this.getVehiclePassStatData, 500)
    if (this.$route.params.vehicleBaseVehiclePlate) {
      this.queryParams.vehiclePlate = this.$route.params.vehicleBaseVehiclePlate
      this.queryParams.vehicleColor = this.$route.params.vehicleBaseVehicleColor
      if (this.queryParams.vehicleColor === 0) {
        this.queryParams.vehicleColor = '0'
      }
    }
    this.getData();
  },
  watch: {
    fullVehiclePlate: function (newVal) {
      const curFullVehiclePlate = (this.queryParams.vehiclePlate + "_" + this.queryParams.vehicleColor)
      if (newVal && newVal != curFullVehiclePlate) {
        Object.assign(this.$data.queryParams, this.$options.data().queryParams)
        this.queryParams.vehiclePlate = this.$route.params.vehicleBaseVehiclePlate
        this.queryParams.vehicleColor = this.$route.params.vehicleBaseVehicleColor
        if (this.queryParams.vehicleColor === 0) {
          this.queryParams.vehicleColor = '0'
        }
        this.getData();
      }
    }
  },
  computed: {
    fullVehiclePlate: function () {
      if (this.$route.params.vehicleBaseVehiclePlate) {
        const tempFullVehiclePlate = (this.$route.params.vehicleBaseVehiclePlate + "_" + this.$route.params.vehicleBaseVehicleColor)
        return tempFullVehiclePlate
      }
      return ""
    }
  },
  methods: {
    queryData () {
      this.$data.page.currentPage = 1
      this.getData();
    },
    async getData () {
      this.loading = true;
      try {
        const { data } = await getData(
          Object.assign({}, { size: this.page.pageSize, current: this.page.currentPage }),
          this.queryParams)
        this.tableData = data.records
        this.page.total = data.total
        this.isSelectRow = this.tableData.length > 0
        if (this.isSelectRow) {
          const _this = this
          this.$nextTick(function () {
            _this.selectRow = this.tableData[0]
            _this.$refs.vex.setCurrentRow(this.tableData[0])
            _this.getVehiclePassStatData({ 'vehiclePlate': this.selectRow.vehiclePlate, 'vehicleColor': this.selectRow.vehicleColor })
          })
        } else {
          this.selectRow = {}
          this.passTableData = []
        }
      } finally {
        this.loading = false
      }
    },
    async getVehiclePassStatData (queryParams) {
      this.passStatloading = true
      try {
        const { data } = await listByVehicle(queryParams)
        this.passTableData = data
      } finally {
        this.passStatloading = false
      }
    },
    edit (row) {
      if (!row.vehiclePlate) {
        this.$message.error('请选择车辆信息')
        return
      }
      const record = row || this.selections[0]
      this.$refs.vehicleInfoBaseVehTypeConfirmDialog.init('edit', record)
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.page.currentPage = currentPage
      this.page.pageSize = pageSize
      this.getData()
    },
    currentChangeEvent ({ row }) {
      if (this.selectRow && row) {
        if (this.selectRow.vehiclePlate === row.vehiclePlate
          && this.selectRow.vehicleColor === row.vehicleColor) {
          return
        }
      }
      this.selectRowIndex = this.$refs.vex.getRowIndex(row);
      this.selectRow = row
      this.getVehiclePassStatData({ 'vehiclePlate': this.selectRow.vehiclePlate, 'vehicleColor': this.selectRow.vehicleColor })
    },
    updateRowData (newRow) {
      Object.assign(this.selectRow, newRow || {})
      this.$refs.vex.reloadRow(this.tableData, this.selectRow)
    },
    handleReset () {
      this.$refs.searchForm.resetFields();
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (activeName === 'second') {
        this.$router.push({ name: 'audit.passResult.passDirectView', params: { passResultVehiclePlate: this.selectRow.vehiclePlate, passResultVehicleColor: this.selectRow.vehicleColor } })
        return false
      }
    },
    downloadVehicleTypeFile () {
      this.download({ url: this.downloadVehicleTypeFileUrl, method: 'post', params: { vehicleBaseType: this.queryParams.vehicleBaseType } }).catch(errData => {
        if (errData instanceof Blob) {
          var fileReader = new FileReader()
          fileReader.readAsText(errData, 'utf-8')
          fileReader.onloadend = () => {
            var jsonData = JSON.parse(fileReader.result);
            if (jsonData.message) {
              this.$message.error(jsonData.message)
            } else {
              this.$message.error('下载失败')
            }
          }
        } else {
          this.$message.error('下载失败')
        }
      })
    },
    download (option) {
      return new Promise((resolve, reject) => {
        const options = Object.assign({ method: 'get', responseType: 'blob' }, option)
        request(options).then(response => {
          if (!response) {
            resolve('下载失败')
            return
          }
          let filename = response.headers['content-disposition']
          if (!filename) {
            reject(response.data)
          } else {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(new Blob([response.data]))
            link.target = '_blank'
            if (filename.indexOf('filename=') > -1) {
              filename = filename.split('filename=')[1]
            }
            link.download = decodeURI(filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            resolve('下载成功')
          }
        }).catch((error) => {
          console.info(error)
          resolve('下载失败')
        })
      })
    }
  }
}
</script>

 <style scoped lang="scss">
table .el-col {
  border: 1px solid;
  background-color: whitesmoke;
  padding-top: 5px;
  padding-bottom: 5px;
}
table .el-col-3 {
  background-color: gainsboro;
}

.app-container ::v-deep {
  .vxe-table .vxe-body--row.row--current {
    background-color: lightskyblue;
  }
}
</style>
