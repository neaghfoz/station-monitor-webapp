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

      <template v-slot:monitorUse="{ row }">
        <el-switch
          v-model="row.monitorUse"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="0"
          @change="update(row,'monitorUse', 'monitor')"
        />
      </template>


      <template v-slot:laneMonitorUse="{ row }">
        <el-switch
          v-model="row.laneMonitorUse"
          active-color="#13ce66"
          :active-value="1"
          :inactive-value="0"
          @change="update(row,'laneMonitorUse','laneMonitor')"
        />
      </template>
      <template v-slot:operation="{ row }">
        <el-button v-permission="['orgUse:add']" type="warning" @click="add(row.id)">新增</el-button>
        <el-button v-permission="['orgUse:delete']" type="warning" @click="del(row.useId)">删除</el-button>
      </template>

    </vxe-grid>

    <add-dialog ref="addDialog" @refreshDataList="getData"/>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';

  import {del, findPage, update, updateBatch, findLaneListCount} from '../orgUseApi';
  import addDialog from "./addDialog";


  export default {
    name: "laneTab",
    props:
      {
        queryParams: {
          type: Object,
          required: false
        },
      },
    components: {addDialog},
    mixins: [...mixin],
    data() {
      return {
        showSearch: true,
        loading: false,
        laneCountLimit: null,
        tableToolbar: {
          id: 'monitor.com.orgUse.orgUseView-toolbar',
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
          {title: '传输监视是否启用', field: 'monitorUse', minWidth: 150, showOverflow: true, slots: {default: 'monitorUse'}},
          {title: '车道监控是否启用', field: 'laneMonitorUse', minWidth: 150, showOverflow: true, slots: {default: 'laneMonitorUse'}},
          /*{title: '操作', width: 150, fixed: 'right', align: 'center', slots: {default: 'operation'}},*/
        ]
      }
    },
    created() {

    },
    methods: {
      searchData(){
        this.laneCountLimit = this.$dictUtils. getDictLabel('tibms_config', 'toll_laneMonitor_laneCountLimit',  50)
        console.log(this.laneCountLimit)
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
      async update(row, column, moduleType) {
        try {
          var flag = false
          if(row[column] == 1 && moduleType == 'laneMonitor' ) {

            const { data } = await findLaneListCount({}, {model: this.queryParams.model,laneMonitorUse: 1})
            if((data + 1) > this.laneCountLimit) {
              flag = true
              this.$confirm(`当前已启用车道数已超过` + this.laneCountLimit + `条，数据量较大会导致车道监控反应时间变长，是否确认继续添加？`,"提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                this.dealUpdate(row, column, moduleType)

              }).catch((e) => {
                if(e === 'cancel') {
                  row[column] = 0
                }

              });
            }
          }
          if(!flag) {
            this.dealUpdate(row, column, moduleType)
          }
        } finally {
          this.loading = false
        }
      },
      dealUpdate(row, column, moduleType) {
        update({}, {model: this.queryParams.model, useId: row.useId, isUse: row[column],moduleType:moduleType}).then(res => {
          if (res.code === 200) {
            this.$notify.success("修改成功!")
          } else {
            this.$notify.warn(res.message)
          }
          this.getData()
        })
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
          let useIdList = this.selections.map((x) => x.useId);
          var moduleType = 'monitor'
          if(flag == "1") {

            var confirm = false
            const { data } = await findLaneListCount({}, {model: this.queryParams.model,laneMonitorUse: 1})
            if((data + this.selections.length) > this.laneCountLimit) {
              await this.$confirm(`当前已启用车道数已超过` + this.laneCountLimit + `条，数据量较大会导致车道监控反应时间变长，是否确认继续添加？`,"提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                confirm = true
                moduleType += ',laneMonitor'
              })
            } else {
              moduleType += ',laneMonitor'
            }
          } else {
            moduleType += ',laneMonitor'
          }

          updateBatch({}, {model: this.queryParams.model, useIdList: useIdList, isUse: flag,moduleType:moduleType}).then(res => {
            if (res.code === 200) {
              this.$notify.success("修改成功!")
              this.getData()
            } else {
              this.$notify.warn(res.message)
            }
            this.getData()
          })
        } finally {
          this.loading = false
        }
      }
    }
  }

</script>

<style scoped>

</style>
