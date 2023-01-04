<template>
  <div class="app-container">
    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      :auto-resize="true"
      max-height="1000"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @page-change="handlePageChange"
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
    >
      <template v-slot:toolbar_buttons>

      </template>

      <template v-slot:sortNum_operation="{ row }">
        <el-input-number v-model="row.sortNum" @change="update(row)" />
      </template>

      <template v-slot:isUse_operation="{ row }">
        <el-switch
          v-model="row.isUse"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="0"
          @change="update(row)"
        />
      </template>

    </vxe-grid>

  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import {findPage,update} from './colSettingApi'

  export default {
    name: 'com.colSettingView',
    components: {},
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          belongModule: this.$route.query.belongModule
        },
        showSearch: false,
        loading: false,
        tableToolbar: {
          id: 'com.colSettingView-toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: true, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 200,
          align: 'left',
          pageSizes: [200],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        columns: [
          // {title: '类型', field: 'typeText', minWidth: 150, showOverflow: true},
          {title: '名称', field: 'name', minWidth: 150, showOverflow: true},
          {title: '编码', field: 'code', minWidth: 150, showOverflow: true},
          {title: '排序', field: 'sortNum', minWidth: 150, showOverflow: true,slots: { default: 'sortNum_operation' }},
          {title: '是否启用', field: 'isUse', minWidth: 150, showOverflow: true,slots: { default: 'isUse_operation' }},
        ]
      }
    },
    created() {
      this.getData();
    },
    watch: {},
    methods: {
      async getData() {
        this.loading = true

        // 每次查询初始化checkbox selections
        this.selections = []
        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.tableData = data.records
        this.page.total = data.total

        this.loading = false
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      async update(row) {
        try {
          this.loading = true
          const { message } = await update(row)
          this.$notify.success(message)
          await this.getData()
        } finally {
          this.loading = false
        }
      },
    }
  }
</script>

<style scoped>

</style>
