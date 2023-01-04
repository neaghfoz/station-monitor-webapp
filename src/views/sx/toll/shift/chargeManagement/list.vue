<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row>
        <el-form-item label="缴费类型" prop="opStatusStr">
          <ti-select
            v-model="queryParams.opStatusStr"
            placeholder="请选择"
            dict-type="tibms_toll_shiftChargeOpType"
            multiple
          />
        </el-form-item>
        <el-form-item label="工班" prop="squadNoStr">
          <ti-select
            v-model="queryParams.squadNoStr"
            placeholder="请选择"
            url="api/v1/common/squad/list"
            :props="{key:'squadNo',value:'squadNo',label:'squadNameText'}"
            multiple
          />
        </el-form-item>
        <el-form-item label="传输状态" prop="status">
          <ti-select
            v-model="queryParams.status"
            placeholder="请选择"
            dict-type="tibms_toll_shiftChargeStatus"
          />
        </el-form-item>
        <el-form-item label="工班日期">
          <el-form-item v-show="false" prop="beginSquadDateStr" />
          <el-form-item v-show="false" prop="endSquadDateStr" />
          <ti-date-range
            v-model="queryParams"
            date-type="daterange"
            format="yyyy-MM-dd"
            begin-key="beginSquadDateStr"
            end-key="endSquadDateStr"
            date-rule="oneMonth"
          />
        </el-form-item>
        <el-form-item class="searchItem" style="float: right;padding-right:20px">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-card shadow="never" :max-height="this.tableHeight" >

      <div class="box">
        <vxe-grid
          ref="xTable"
          highlight-hover-row
          border
          show-overflow
          show-header-overflow
          resizable
          sync-resize
          auto-resize
          class="vxe-table-element"
          :max-height="600"
          :loading="tableData.loading"
          :columns="tableData.tableColumns"
          :data="tableData.columnsDataList"
          :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
          :pager-config="tableData.page"
          :toolbar="tableToolbar"
          @page-change="handlePageChange"
          @checkbox-all="({ selection }) => { selections = selection }"
          @checkbox-change="({ selection }) => { selections = selection }"
          :tooltip-config="{enterable: true, contentMethod: showTooltipMethod}"
        >

          <template v-slot:toolbar_buttons>
            <el-button v-permission="['shiftCharge:save']" type="primary" @click="add()">添加</el-button>
            <el-button v-permission="['shiftCharge:update']" type="primary" @click="edit()">修改</el-button>
            <el-button v-permission="['shiftCharge:delete']" type="danger" @click="del()">删除</el-button>
            <el-button v-permission="['shiftCharge:submit']" type="success" @click="chargeSubmit()">提交</el-button>
            <el-button v-permission="['shiftCharge:transvoid']" type="primary" @click="transvoid()">冲减流水</el-button>
            <el-button v-permission="['shiftCharge:updatePrintCount']" type="success" @click="print()">打印发票</el-button>
            <el-button v-permission="['shiftCharge:exportExcel']" type="warning" @click="exportExcel.dialog = true">导出</el-button>

          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :export-excel="exportExcel" :page="tableData.page" />

    <add ref="addDialog" @refreshData="getData" />
    <print ref="printDialog" @refreshData="getData" />
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { list, deleteByIds, submitByIds, transvoidByIds } from './charge'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import add from './add'
import print from './print'
import moment from 'moment'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'

export default {
  name: 'SxTollShiftChargeManagementList',
  components: { TiSelect, TiExportExcel, add, TiDateRange, print },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        opStatusStr: '',
        beginSquadDateStr: moment(new Date()).add(-1, 'months').format('YYYY-MM-DD'),
        endSquadDateStr: moment(new Date()).format('YYYY-MM-DD'),
        squadNoStr: '',
        status: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '工班日期', field: 'squadDateText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '传输状态', field: 'statusText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '发票号码', field: 'allVnoInfo', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '收费员', field: 'operatorText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '费率版本', field: 'priceVerNo', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '入口站名称', field: 'enStationNameText', minWidth: 130, showOverflow: true, align: 'center' },
          { title: '缴费类型', field: 'opStatusText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '缴费金额', field: 'btotalTollText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '出口站名称', field: 'exStationNameText', minWidth: 130, showOverflow: true, align: 'center' },
          { title: '全车牌', field: 'fullVehPlate', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '车型', field: 'vehTypeNoText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'opTimeText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '打印次数', field: 'printCount', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '工班号', field: 'squadNoText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '备注', field: 'remarks', minWidth: 150, showOverflow: true, align: 'center' }
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }},
      tableToolbar: {
        id: 'modules.chargeManagement',
        custom: true,
        zoom: true, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        slots: {
          buttons: 'toolbar_buttons'
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      tableHeight: null,
      exportExcel: {
        url: '/api/v1/shift/shiftCharge/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
      selections: []
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.getData()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      console.log(this.selections)
      this.tableData.loading = true
      list(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
      this.exportExcel.queryParams = this.queryParams
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue()
    },
    showTooltipMethod ({ type, column, row, items, _columnIndex }) {
      const { property } = column
      // 重写默认的提示内容
      if (property === 'allVnoInfo') {
        if (type === 'header') {
          return column.title
        } else if (type === 'footer') {
          return column.title
        }
        var content = row[property]
        var  arr = row.allVnoInfo.split(',')
        if (arr.length > 1) {
          var cArr = []

          content = ''
          arr.forEach((item,index) => {
            if(index == 0) {
              content = item
            } else {
              content = content + '；\n' + item
            }
          })
        }
        return  content? content : ''
      }
      // 其余的单元格使用默认行为
      return null
    },
    add() {
      this.$refs.addDialog.init('add')
    },
    print() {
      if (this.selections.length !== 1) {
        this.$notify.warning('请选择一条记录!')
        return
      }
      this.$refs.printDialog.init('print', this.selections[0].id)
    },
    edit() {
      if (this.selections.length !== 1) {
        this.$notify.warning('请选择一条记录!')
        return
      }
      try {
        this.selections.forEach((item, index) => {
          if (item.status && item.status !== 1) {
            throw new Error()
          }
        })
      } catch (e) {
        this.$notify.warning('已传输/已冲减状态的记录不允许修改')
        return
      }
      this.$refs.addDialog.init('edit', this.selections[0].id)
    },
    chargeSubmit() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      const ids = this.selections.map((x) => x.id).join(',')

      this.$confirm(`是否提交？提交后无法删除！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        submitByIds(ids).then((res) => {
          if (res.code === 200) {
            this.$notify.success(res.data)
            this.getData()
          } else {
            this.$notify.warn(res.message)
          }
        })
      })
    },
    transvoid() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }
      try {
        this.selections.forEach((item, index) => {
          if (item.status !== 2) {
            throw new Error()
          }
        })
      } catch (e) {
        this.$notify.warning('请选择已传输状态的记录！')
        return
      }
      const ids = this.selections.map((x) => x.id).join(',')

      let invs = this.selections.map(x=>x.allVnoInfo).join(',')

      this.$confirm(`是否冲减？冲减后发票（${invs}）将作废！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        transvoidByIds(ids).then(res => {
          if (res.code === 200) {
            this.$notify.success(res.data)
            this.getData()
          } else {
            this.$notify.warn(res.message)
          }
        })
      })
    },
    async del() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }
      try {
        this.selections.forEach((item, index) => {
          if (item.status && item.status !== 1) {
            throw new Error()
          }
        })
      } catch (e) {
        this.$notify.warning('已传输/已冲减状态的记录不允许删除')
        return
      }

      const ids = this.selections.map((x) => x.id).join(',')

      this.$confirm(`是否删除！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByIds(ids).then((res) => {
          if (res.code === 200) {
            this.$notify.success(res.data)
            this.getData()
          } else {
            this.$notify.warn(res.message)
          }
        })
      })
    }
  }

}
</script>

<style scoped>
  .el-card{
    margin-bottom:20px;
  }
</style>
