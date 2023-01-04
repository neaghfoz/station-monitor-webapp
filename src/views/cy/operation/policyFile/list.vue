<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'100px'">
      <el-row>

        <el-form-item label="操作时间">
          <el-form-item>
            <el-form-item v-show="false" prop="beginOpTime" />
            <el-form-item v-show="false" prop="endOpTime" />
            <ti-date-range
              ref="dayRang"
              v-model="queryParams"
              date-style="width:293px"
              :editable="false"
              date-rule="oneMonth"
              date-type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              begin-key="beginOpTime"
              end-key="endOpTime"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            type="text"
            placeholder="请输入关键字查询"
          />
        </el-form-item>

        <el-form-item class="searchItem" style="float: right;padding-right:20px">
          <el-button type="primary" @click="submit" v-permission="['policyFileMain:list']" >查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
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
          <template v-slot:operation="{ row }">
            <el-button v-permission="['policyFileMain:details']" size="mini" type="text" @click="view(row)">查看</el-button>
            <el-button v-permission="['policyFileMain:update']" size="mini" type="text" @click="edit(row)" >编辑</el-button>
            <el-button v-permission="['policyFileMain:delete']" size="mini" type="text" @click="delRow(row)" v-if="row.publishStatus !=='publish'">删除</el-button>
          </template> 
 
          <template v-slot:toolbar_buttons>
            <el-button v-permission="['policyFileMain:save']" type="primary" @click="handleAdd()">新增</el-button>
            <el-button v-permission="['policyFileMain:delete']" type="warning" @click="delSelected()">删除</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <ti-export-excel :export-excel="exportExcel" :page="tableData.page" />
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { list, del, getUserNodeLevel } from './policyFile'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import moment from 'moment'
export default {
  name: 'OperationPolicyFileList',
  components: { TiExportExcel, TiDateRange },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      queryParams: {
        title: '',
        beginOpTime: moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD') ,
        endOpTime: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
        status: '',
        publishStatus: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '序号', type: 'index', minWidth: 50, showOverflow: true, align: 'center' },
          { title: '标题', field: 'title', minWidth: 150, showOverflow: true, align: 'left' },
          { title: '文件类别', field: 'fileCtagoryText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '文件类型', field: 'fileTypeText', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '发布单位', field: 'publisherName', minWidth: 130, showOverflow: true, align: 'center' },
          { title: '文件属性', field: 'attriButeText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '状态', field: 'publishStatusText', minWidth: 80, showOverflow: true, align: 'center' },
          { title: '发布时间', field: 'publishTimeText', minWidth: 180, showOverflow: true, align: 'center'},
          { title: '操作者', field: 'operatorName', minWidth: 135, showOverflow: true, align: 'center' },
          { title: '操作时间', field: 'lastUpdateTimeText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', fixed: 'right', align: 'center', minWidth: 160, slots: { default: 'operation' }}
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
        id: 'modules.policyFile',
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
        url: '/api/v1/sendpara/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
      selections: [],
      controlColumnShow: false
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    }
  },
  mounted() {
  },
  created() {
    // this.$nextTick(() => {
    //   if (this.$store.getters.userInfo.isSuperUser) {
    //     this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('statusText'))
    //   } else {
    //     getUserNodeLevel().then(res => {
    //       if (res.data.nodeLevel === '1') {
    //         this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('statusText'))
    //       }
    //     })
    //   }

      this.init()
      this.exportExcel.queryParams = this.queryParams
    // })
  },
  activated() {
    // this.init()
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
   
      this.tableData.loading = true 
      list(Object.assign({}, { size: this.tableData.page.pageSize, 
                  current: this.tableData.page.currentPage,type:"draft" }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
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
    detail(row) {
      this.$router.push({
        path: '/param/issue/details',
        query: { id: row.id }
      })
    },
    handleAdd() {
      this.$router.push({
        path: '/operations/policyFile/add',
        query: {}
      })
    },
    add() {
      this.$refs.roleEditDialog.init('add', this.queryParams.tenantId, this.queryParams.appId)
    },
    edit(row) {
      this.$router.push({
        path: '/operations/policyFile/edit',
        query: { id: row.id }
      })
    },
    view(row) {
      this.$router.push({
        path: '/operations/policyFile/details',
        query: { id: row.id }
      })
    },
    delRow(row) {
      this.$confirm(`确认是否删除`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.id).then((res) => {
          this.$notify.success(res.data)
          this.getData()
        })
      }).catch(() => {})
    },
    delSelected() {
      if (this.selections.length === 0) {
        this.$notify.warning('请至少选择一条记录！')
        return
      }
      var ids = ''
      try {
        this.selections.forEach((item, index) => {
          if (item.publishStatus === 'publish') {
            throw new Error()
          }
          if (index === 0) {
            ids = item.id
          } else {
            ids += ',' + item.id
          }
        })
      } catch (e) {
        this.$notify.warning('只能删除未发布状态的记录！')
        return
      }

      this.$confirm(`确认是否删除`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(ids).then((res) => {
          this.$notify.success(res.data)
          this.selections = []
          this.getData()
        })
      }).catch(() => {})
    },
    refresh() {
      this.getData()
    }
  }

}
</script>

<style scoped>
</style>
