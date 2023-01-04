<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item
            label="当前位置"
          >
            <ti-select
              v-model="queryParams.locationNoStr"
              placeholder="请选择"
              multiple
              dict-type="tibms_toll_invoiceLocation"
            />
          </el-form-item>
          <el-form-item
            label="车道"
          >
            <el-select
              v-model="queryParams.laneNoArr"
              placeholder="请选择"
              multiple
              filterable
              clearable
            >
              <el-option
                v-for="item in renderLanes"
                :key="item.laneId"
                :label="item.laneNo"
                :value="item.laneNo"/>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收费员"
          >
            <ti-select
              v-model="queryParams.dutyOperatorNoStr"
              placeholder="请选择"
              multiple
              url="/api/v1/common/sysUser/list"
              :props="{key:'id',value:'username',label:'fullName'}"
            />
          </el-form-item>
          <el-form-item label="所在机构">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" multiple clearable/>
          </el-form-item>

          <el-form-item
            label="状态"
          >
            <ti-select
              v-model="queryParams.tagNoStr"
              placeholder="请选择"
              multiple
              dict-type="tibms_toll_invoiceStatus"
            />
          </el-form-item>
          <el-form-item
            label="发票代码"
          >
            <el-select v-model="queryParams.invCodeArr" multiple="true" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in invoiceCodes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="发票号码"
          >
            <el-col :span="11">
              <el-input type="text" v-model="queryParams.invStartNo" maxlength="8" placeholder="" @input="changeInvStartNoInput"/>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center;">至</el-col>
            <el-col :span="11">
              <el-input type="text" v-model="queryParams.invEndNo" maxlength="8" placeholder="" @input="changeInvEndNoInput"/>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['invoice:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" :max-height="this.tableHeight">

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
        >

          <template v-slot:toolbar_buttons>
            <el-button type="primary" @click="instore()" v-permission="['invoice:create']">调入</el-button>
            <el-button type="primary" @click="use()" :disabled="selections.length === 0" v-permission="['invoice:use']">领用</el-button>
            <el-button type="primary" @click="returns()" :disabled="selections.length === 0" v-permission="['invoice:return']">归还</el-button>
            <el-button type="primary" @click="out()" :disabled="selections.length === 0" v-permission="['invoice:out']">调出</el-button>
            <el-button type="primary" @click="reverseOut()" :disabled="selections.length === 0" v-permission="['invoice:reverseout']">撤销调出</el-button>
            <el-button type="danger" @click="del()" :disabled="selections.length === 0" v-permission="['invoice:delete']">删除</el-button>
            <el-button type="info" @click="exportExcel.dialog = true" v-permission="['invoice:excel']">导出</el-button>
            <span v-show="statistics.count !== ''" style="color:red;font-weight: bold;margin-left: 10px;">库存总数：{{ statistics.count }}</span>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>

    <instore-view ref="instoreDialog" @refreshData="getData"/>
    <use-view ref="useDialog" @refreshData="getData"/>
    <return-view ref="returnDialog" @refreshData="getData"/>
    <out-view ref="outDialog" @refreshData="getData"/>
    <reverse-out-view ref="reverseOutDialog" @refreshData="getData"/>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { deleteByIds, findPage, count, findLanes } from './invoiceApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import instoreView from './components/invoiceInstoreView'
import useView from './components/invoiceUseView'
import returnView from './components/invoiceReturnView'
import outView from './components/invoiceOutView'
import reverseOutView from './components/invoiceReverseOutView'
import request from 'ecip-web/utils/request'
import api from '@/views/gz/toll/shift/shiftManagement/shiftRegMainRecord/shiftRegMainRecordApi'

export default {
  name: 'gz.toll.card.invoiceandpapermng.invoice.invoiceView',
  components: { TiExportExcel, TiSelect, tiSysOrg, instoreView, useView, returnView, outView, reverseOutView },
  mixins: [...mixin],
  data() {
    return {
      inits: false,
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      invoiceCodes: [],
      renderLanes: [],
      queryParams: {
        invCodeArr: [],
        invCodeStr: '',
        locationNoStr: '',
        laneNoArr: [],
        laneNoStr: '',
        dutyOperatorNoStr: '',
        sysOrgIdStr: '',
        tagNoStr: '',
        invStartNo: '',
        invEndNo: ''
      },
      statistics: {
        count: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '发票记录id', field: 'id', minWidth: 40, showOverflow: true, align: 'center', visible: false },
          { title: '发票代码', field: 'invCode', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '发票起始号', field: 'invStartNo', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '发票终止号', field: 'invEndNo', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '发票数量', field: 'invCount', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '当前位置', field: 'locationText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '车道/收费员', field: 'useText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '所在机构', field: 'sysOrg.fullName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '操作员', field: 'operatorText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '状态', field: 'tagText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'opTime', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '调入来源地', field: 'inOrgText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '调出目的地', field: 'outOrgText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '领用责任人', field: 'dutyOperatorText', minWidth: 150, showOverflow: true, align: 'center' }
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }
      },
      tableToolbar: {
        id: 'modules.paramQuery',
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
      selections: [],
      exportExcel: {
        url: '/api/v1/invoice/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    }
  },
  mounted() {
  },
  activated() {
    this.handleReset()
    this.selections = []
    request({
      url: '/api/v1/invoicecode/list',
      method: 'post'
    }).then(res => {
      this.invoiceCodes = res.data
    })
    if (this.inits) {
      this.submit()
    }
  },
  created() {
    this.$nextTick(async() => {
      this.init()
      this.exportExcel.queryParams = this.queryParams

      const laneResp = await findLanes()
      const laneLists = laneResp.data
      let renderLanes = []
      const laneNos = []
      for (const item of laneLists) {
        if (laneNos.indexOf(item.laneNo) == -1) {
          renderLanes.push(item)
          laneNos.push(item.laneNo)
        }
      }
      renderLanes.sort(function (a, b) {
        if (parseInt(a.laneNo) > parseInt(b.laneNo)) {
          return 1
        } else {
          return -1
        }
      })
      this.renderLanes = renderLanes
    })
  },
  methods: {
    init() {
      this.getData()
      this.inits = true
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      this.queryParams.invCodeStr = this.queryParams.invCodeArr.join(',')
      this.queryParams.laneNoStr = this.queryParams.laneNoArr.join(',')
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
        this.selections = []
      })
      count(this.queryParams).then(res => {
        this.statistics = res.data
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
    },
    changeInvStartNoInput: function() {
      // 控制发票代码的整型输入
      this.queryParams.invStartNo = this.queryParams.invStartNo.replace(/[^\d]/g, '')
    },
    changeInvEndNoInput: function() {
      // 控制发票代码的整型输入
      this.queryParams.invEndNo = this.queryParams.invEndNo.replace(/[^\d]/g, '')
    },
    async detail(row) {
      this.$refs.detailDialog.init(this.queryParams.tenantId, this.queryParams.appId, row.id)
    },
    async instore() {
      this.$refs.instoreDialog.init(this.queryParams.tenantId, this.queryParams.appId)
    },
    async use() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.selections.every((x) => {
        if (x.tagNo !== 0) {
          msg = '选择记录必须为在库存状态才允许领用'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      this.$refs.useDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.selections)
    },
    async returns() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.selections.every((x) => {
        if (x.tagNo !== 5) {
          msg = '选择记录必须为已领用状态才允许领用'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      this.$refs.returnDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.selections)
    },
    async out() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.selections.every((x) => {
        if (x.tagNo !== 0) {
          msg = '选择记录必须为在库存状态才允许调出'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      this.$refs.outDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.selections)
    },
    async reverseOut() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.selections.every((x) => {
        if (x.tagNo !== 3) {
          msg = '选择记录必须为已调出状态才允许撤销调出'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      this.$refs.reverseOutDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.selections)
    },
    async del() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.selections.every((x) => {
        if (x.tagNo !== 0) {
          msg = '选择记录必须为在库存状态才允许删除'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      this.$confirm('是否删除机打发票记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selections.map((x) => x.id)
        try {
          this.saveLoading = true
          deleteByIds(ids).then(res => {
            this.$notify.success('发票删除成功')
            this.submit()
          })
        } finally {
          this.saveLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
