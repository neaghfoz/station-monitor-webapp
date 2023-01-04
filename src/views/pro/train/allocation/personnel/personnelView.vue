<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'70px'">
        <el-row>
          <el-form-item label="用户姓名" prop="realName">
            <el-input
              v-model="queryParams.realName"
              type="text"
              placeholder="用户姓名"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="queryParams.username"
              type="text"
              maxlength="20"
              placeholder="用户名"
            />
          </el-form-item>

          <el-form-item>
            <el-button v-permission="['user:view']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" :max-height="tableHeight">

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
            <el-button v-permission="['train:examnum:user:batchSetting']" type="primary" @click="batchSet()">批量分配</el-button>
          </template>

          <template v-slot:operation="{ row }">
            <el-button v-permission="['train:examnum:user:findPage']" size="mini" type="primary" @click="examnum(row)">分配场次</el-button>
          </template>
        </vxe-grid>
      </div>
    </el-card>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage } from './personnelViewApi'

export default {
  name: 'ProTrainAllocationPersonnelPersonnelView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      queryParams: {
        realName: '',
        username: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: 'ID', field: 'id', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '用户名', field: 'username', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '姓名', field: 'realName', minWidth: 150, showOverflow: true, align: 'center' },
          // { title: '角色', field: 'roleName', minWidth: 150, showOverflow: true, align: 'center' },
          // { title: '所属单位', field: 'tenantName', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '注册时间', field: 'createTime', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '操作', width: 120, fixed: 'right', align: 'center', slots: { default: 'operation' }}
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
      selections: []
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    }
  },
  mounted() {
    this.$watch(this.$refs.xTable.getCheckboxRecords, (newValue, oldValue) => {
      this.selections = newValue
      this.oneMore = this.selections.length > 0
    })
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
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
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
    // 批量分配
    batchSet() {
      this.$router.push({
        path: '/train/allocation/batchSettingOperator',
        query: {}
      })
    },
    examnum(item) {
      const row = item || this.selections[0]
      this.$router.push({
        path: '/api/v1/train/examnumuser/findSettingNumPage',
        query: { operatorNo: row.username }
      })
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.queryParams = this.$options.data().queryParams
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
