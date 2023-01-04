<template>
  <div>
    <vxe-grid
      ref="laneVex"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
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
        <el-button v-permission="['orgUse:updateBatch']" @click="updateBatch('1')">启用</el-button>
        <el-button v-permission="['orgUse:updateBatch']" @click="updateBatch('0')">禁用</el-button>
      </template>

      <template v-slot:isUse_operation="{ row }">
        <el-switch
          v-model="row.paramUse"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="0"
          @change="update(row)"
        />
      </template>

      <template v-slot:operation="{ row }">
        <el-button v-permission="['orgUse:add']" type="warning" @click="add(row.id)">新增</el-button>
        <el-button v-permission="['orgUse:delete']" type="warning" @click="del(row.useId)">删除</el-button>
      </template>

    </vxe-grid>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';

  import {del, findPage, update, updateBatch} from '../downConfigApi';


  export default {
    name: "laneTab",
    props:
      {
        queryParams: {
          type: Object,
          required: false
        },
      },
    components: {},
    mixins: [...mixin],
    data() {
      return {
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'param.downConfig.components.laneTab-toolbar',
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
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        columns: [
          {type: 'checkbox', width: 40, fixed: 'left', align: 'center'},
          {title: '路段', field: 'roadText', minWidth: 150, showOverflow: true},
          {title: '收费站', field: 'stationText', minWidth: 150, showOverflow: true},
          {title: '出入口类型', field: 'entryExitTypeText', minWidth: 150, showOverflow: true},
          {title: '车道号', field: 'laneNo', minWidth: 100, showOverflow: true},
          {title: '车道类型', field: 'laneTypeText', minWidth: 150, showOverflow: true},
          {title: 'ip', field: 'serverIp', minWidth: 150, showOverflow: true},
          {title: '服务器', field: 'serverName', minWidth: 100, showOverflow: true},
          {title: '是否启用', field: 'paramUse', minWidth: 100, showOverflow: true, slots: {default: 'isUse_operation'}},
          /*{title: '操作', width: 150, fixed: 'right', align: 'center', slots: {default: 'operation'}},*/
        ]
      }
    },
    created() {
      if (this.queryParams.model == 'lane'){
        this.getData();
      }
    },
    methods: {
      searchData(){
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
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
      async add(id) {
        this.$refs.addDialog.init(id)
      },
      async update(row) {
        try {
          this.loading = true
          await update({}, {model: this.queryParams.model, useId: row.useId, isUse: row.paramUse,moduleType:'param'})
          this.$notify.success("修改成功!")
          await this.getData()
        } finally {
          this.loading = false
        }
      },
      async del(useId) {
        try {
          this.loading = true
          await del({}, {model: this.queryParams.model, useId: useId})
          this.$notify.success("删除成功!")
          await this.getData()
        } finally {
          this.loading = false
        }
      },
      async updateBatch(flag) {
        try {
          if (this.selections.length == 0) {
            this.$notify.warning("至少选择一条记录!");
            return;
          }

          this.loading = true
          let useIdList = this.selections.map((x) => x.useId);
          await updateBatch({}, {model: this.queryParams.model, useIdList: useIdList, isUse: flag,moduleType:'param'});
          this.$notify.success("批量修改成功!")
          await this.getData()
        } finally {
          this.loading = false
        }
      }
    }
  }

</script>

<style scoped>

</style>
