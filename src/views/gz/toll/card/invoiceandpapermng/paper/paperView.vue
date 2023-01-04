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
              dict-type="tibms_toll_paperLocation"
            />
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
              dict-type="tibms_toll_paperStatus"
            />
          </el-form-item>
          <el-form-item
            label="纸券号码"
          >
            <el-col :span="11">
              <el-input type="text" v-model="queryParams.paperStartNo" maxlength="14" placeholder="" @input="changePaperStartNoInput"/>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center;">至</el-col>
            <el-col :span="11">
              <el-input type="text" v-model="queryParams.paperEndNo" maxlength="14" placeholder="" @input="changePaperEndNoInput"/>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['paper:findPage']" type="primary" @click="submit">查询</el-button>
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
            <el-button type="primary" @click="instore()" v-permission="['paper:create']">调入</el-button>
            <el-button type="primary" @click="use()" :disabled="selections.length === 0" v-permission="['paper:use']">领用</el-button>
            <el-button type="primary" @click="returns()" :disabled="selections.length === 0" v-permission="['paper:return']">归还</el-button>
            <el-button type="primary" @click="out()" :disabled="selections.length === 0" v-permission="['paper:out']">调出</el-button>
            <el-button type="primary" @click="reverseOut()" :disabled="selections.length === 0" v-permission="['paper:reverseout']">撤销调出</el-button>
            <el-button type="danger" @click="del()" :disabled="selections.length === 0" v-permission="['paper:delete']">删除</el-button>
            <el-button type="info" @click="exportExcel.dialog = true" v-permission="['paper:excel']">导出</el-button>
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
import { findPage, deleteByIds, count } from './paperApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import instoreView from './components/paperInstoreView'
import useView from './components/paperUseView'
import returnView from './components/paperReturnView'
import outView from './components/paperOutView'
import reverseOutView from './components/paperReverseOutView'

export default {
  name: 'gz.toll.card.invoiceandpapermng.paper.paperView',
  components: { TiExportExcel, TiSelect, tiSysOrg, instoreView, useView, returnView, outView, reverseOutView },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        locationNoStr: '',
        dutyOperatorNoStr: '',
        sysOrgIdStr: '',
        tagNoStr: '',
        paperStartNo: '',
        paperEndNo: ''
      },
      statistics: {
        count: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '纸券记录id', field: 'id', minWidth: 40, showOverflow: true, align: 'center', visible: false },
          { title: '纸券起始号', field: 'paperStartNo', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '纸券终止号', field: 'paperEndNo', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '纸券数量', field: 'paperCount', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '当前位置', field: 'locationText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '收费员', field: 'useText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '所在机构', field: 'sysOrg.fullName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '操作员', field: 'operatorText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '状态', field: 'tagText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'opTime', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '调入来源地', field: 'inOrgText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '调出目的地', field: 'outOrgText', minWidth: 150, showOverflow: true, align: 'center' }
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
        url: '/api/v1/paper/exportExcel',
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
    this.selections = []
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.exportExcel.queryParams = this.queryParams
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
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
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
    changePaperStartNoInput: function() {
      // 控制发票代码的整型输入
      this.queryParams.paperStartNo = this.queryParams.paperStartNo.replace(/[^\d]/g, '')
    },
    changePaperEndNoInput: function() {
      // 控制发票代码的整型输入
      this.queryParams.paperEndNo = this.queryParams.paperEndNo.replace(/[^\d]/g, '')
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
    async cancel() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }

      let msg = ''
      const result = this.selections.every((x) => {
        if (x.tagNo === 7 || x.tagNo === 0) {
          msg = '有部分纸劵未被使用，不允许进行核销'
          return false
        }

        if (x.tagNo === 2) {
          msg = '有部分纸劵已核销，不允许重复核销'
          return false
        }

        return true
      })

      if (!result) {
        this.$notify.warning(msg)
        return
      }

      const ids = this.selections.map((x) => x.id)

      this.$refs.cancelDialog.init(this.queryParams.tenantId, this.queryParams.appId, this.selections, ids)
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

      this.$confirm('是否删除纸券记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selections.map((x) => x.id)
        try {
          this.saveLoading = true
          deleteByIds(ids).then(res => {
            this.$notify.success('纸券删除成功')
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
