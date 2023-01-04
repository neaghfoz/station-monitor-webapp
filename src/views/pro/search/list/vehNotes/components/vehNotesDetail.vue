<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="70%"
    >
      <vxe-grid
        ref="vxe"
        highlight-hover-row
        border
        resizable
        sync-resize
        max-height="1000"
        class="vxe-table-element"
        :auto-resize="true"
        :loading="loading"
        :start-index="(page.currentPage - 1) * page.pageSize"
        :pager-config="page"
        :columns="columns"
        :data="tableData"
        :row-style="rowStyle"
        @page-change="handlePageChange"
      >
      </vxe-grid>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import {findPage} from "../vehNotesApi"

  export default {
    name: 'search.list.vehNotes.vehNotesDetail',
    components: {},
    mixins: [...mixin],
    data() {
      return {
        visible: false,
        method: '',
        title: '',
        loading: false, // 页面加载遮罩
        saveLoading: false, //  保存加载
        queryParams: {},
        showSearch: true,
        // tableToolbar: {
        //   id: 'search.list.vehNotes.vehNotesDetail-toolbar',
        //   custom: true,
        //   slots: {
        //     buttons: 'toolbar_buttons'
        //   },
        //   zoom: true, // 最大化按钮
        //   // 列宽操作记录
        //   resizable: {
        //     storage: true
        //   },
        //   // 列操作记录
        //   setting: {
        //     storage: true
        //   }
        // },
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
          {
            title: '操作时间',
            field: 'time', minWidth: 150, showOverflow: true
          },
          {
            title: '操作员',
            field: 'operatorTxt', minWidth: 150, showOverflow: true
          },
          {
            title: '日志内容',
            field: 'log', minWidth: 500, showOverflow: true
          }
          ]
      }
    },
    created() {
   //   this.getData()
    },
    methods: {
      init (queryParams) {

        this.title = `车道日志详情`
        // 关键字
        this.keyword = queryParams.keyword
        this.queryParams.beginOpTime = queryParams.beginOpTime
        this.queryParams.endOpTime = queryParams.endOpTime
        this.queryParams.roadNo = queryParams.roadNo
        this.queryParams.stationNo = queryParams.stationNo
        this.queryParams.laneNo = queryParams.laneNo

        this.page.currentPage = queryParams.currentIndex
        this.page.pageSize = queryParams.pageSize

        this.visible = true
        this.getData()
      },
      async getData() {
        // 每次查询初始化checkbox selections
        this.selections = []
        this.loading = true

        this.queryParams.currentPage = this.page.currentPage
        this.queryParams.pageSize = this.page.pageSize

        const {data} = await findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)

        if (data && data.status &&  data.status=== "00000") {
          if(data.data.object && data.data.object.length>0 && JSON.stringify(data.data.object[0]) != "{}"){
            this.tableData = data.data.object
          }else{
            this.tableData = [];
          }
          for(let data1 of this.tableData){
            let operatorTxt = '['+data1.operatorId+']'+data1.operatorName
            this.$set(data1,'operatorTxt',operatorTxt)
          }
          this.page.total = data.data.cusPageInfo.totalSize

        } else {
          this.tableData = []
          if(data && data.message && data.message!=""){
            this.$notify({message:data.message});
          }
        }

        this.loading = false

      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
        //this.getData()
      },
      detail(queryParams) {
        this.$router.push(`/search/list/vehNotes/detail/${id}`);
      },
      change(param1, param2) {
        this.queryParams.sysOrg = param2;
      },
      rowStyle ({ row, rowIndex }) {
        if (row.log.includes(this.keyword)) {
          return {
            backgroundColor: '#2db7f5',
           // color: '#ffffff'
          }
        }
      }
    }
  }
</script>

<style scoped>
</style>
