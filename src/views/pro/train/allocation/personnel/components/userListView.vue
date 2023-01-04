<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="700px"
      @close="close"
    >
      <div class="search-form">
        <el-form ref="searchForm" :model="queryParams" inline>
          <el-row>
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="queryParams.username"
                type="text"
                placeholder="用户名"
                maxlength="60"
                style="width: 160px"
              />
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input
                v-model="queryParams.realName"
                type="text"
                placeholder="姓名"
                maxlength="60"
                style="width: 160px"
              />
            </el-form-item>

            <el-form-item>
              <el-button v-permission="['user:view']" type="primary" @click="submit">查询</el-button>
              <el-button type="default" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
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
          row-id="username"
          :max-height="400"
          :loading="tableData.loading"
          :columns="tableData.tableColumns"
          :data="tableData.columnsDataList"
          :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
          :pager-config="tableData.page"
          :toolbar="tableToolbar"
          @page-change="handlePageChange"
          @checkbox-all="({ selection }) => {
              selections = selection
              selectChange()
            }"
          @checkbox-change="({ selection }) => {
              selections = selection
              selectChange()
            }"
        >
          <template v-slot:toolbar_buttons />
        </vxe-grid>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import moment from 'moment'
import { findPage, getRole } from '../personnelViewApi'

export default {
  name: 'VueUserChoose',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      method: '',
      title: '人员列表',
      queryParams: {},
      selectOperatorNos: [],
      formItem: {
        id: '',
        username: '',
        realName: ''
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: 'ID', field: 'id', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '用户名', field: 'username', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '姓名', field: 'realName', minWidth: 120, showOverflow: true, align: 'center' },
          { title: '注册时间', field: 'createTime', minWidth: 120, showOverflow: true, align: 'center', formatter: ({ cellValue, row, column }) => {
            const time = moment(cellValue).format('YYYY-MM-DD')
            return time
          } }
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
          storage: false
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
      roleList: []
    }
  },
  mounted() {

  },
  methods: {
    init(operatorNos) {
      if (operatorNos) {
        this.selectOperatorNos = operatorNos.split(',')
      } else {
        this.selectOperatorNos = []
      }
      this.visible = true
      this.submit()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getListData()
    },
    async getListData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false

        // 根据已选择的用户账号列表和当前查询的列表进行反选
        for (const i in this.tableData.columnsDataList) {
          const item = this.tableData.columnsDataList[i]
          if (this.selectOperatorNos.indexOf(item.username) > -1) {
            this.$refs.xTable.setCheckboxRow([item], true)
          }
        }
      })
    },
    selectChange() {
      for (let i = 0; i < this.tableData.columnsDataList.length; i++) {
        // 反选该页的选择
        const index = this.selectOperatorNos.indexOf(this.tableData.columnsDataList[i].username)
        if (index > -1) {
          this.selectOperatorNos.splice(index, 1)
        }
      }
      for (let i = 0; i < this.selections.length; i++) {
        // 赋值选中的用户账号
        if (this.selectOperatorNos.indexOf(this.selections[i].username) === -1) {
          this.selectOperatorNos.push(this.selections[i].username)
        }
      }
    },
    save() {
      this.$emit('refreshDataList', this.selectOperatorNos.join(','))
      this.visible = false
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getListData()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.queryParams = this.$options.data().queryParams
      this.submit()
    },
    close() {
      this.handleReset()
    }
  }
}
</script>

<style scoped>

</style>
