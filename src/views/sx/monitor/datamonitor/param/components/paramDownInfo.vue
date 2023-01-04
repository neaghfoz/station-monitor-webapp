<template>

  <el-dialog title="手动请求（指定版本）" width="70%"
             :modal-append-to-body='false'
             :lock-scroll="false"
             :fullscreen="false"
             :show-close="true"
             :before-close="handleDialogClose"
             :close-on-click-modal=false
             append-to-body="true"
             :visible="spShow"
  >

    <div class="app-container">
      <div class="search-form">
        <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
          <div>
            <el-button type="primary" @click="getData">刷新</el-button>
          </div>


        </el-form>

      </div>

        <div class="box">

          <vxe-grid
            ref="xTable2"
            keep-source
            highlight-hover-row
            highlight-current-row
            border
            show-header-overflow
            sync-resize
            auto-resize
            class="vxe-table-element"
            :max-height="550"
            :loading="tableData.loading"
            :data="tableData.columnsDataList"
            :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
            :pager-config="tableData.page"
            :toolbar="tableToolbar"
            :columns="tableData.tableColumns"
            @page-change="handlePageChange"
            @current-change="currentChangeEvent"
          >
            <template v-slot:operation="{ row }">
              <el-button size="mini" type="text"  :loading="true"  v-show="row.showReq">请求中</el-button>
              <el-button type="primary" @click="edit(row)" v-show=" !row.showReq ">更新</el-button>
            </template>

            <template v-slot:manualOperationVersionEdit="{ row,column }" >
              <el-input type="text" name="manualOperationVersion"   v-model="row.manualOperationVersion" min="1" maxlength="14"/>
            </template>
          </vxe-grid>
        </div>
    </div>

  </el-dialog>

</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import {findDownPage, reqDown} from '../paramVersionApi';
  import {deepClone} from "@ecip/ecip-web/src/utils";

  export default {
    name: 'paramDownInfo',
    components: {},
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        spShow: false,
        initFlag: false,
        saveLoading: false,
        queryParams: {
          identifier: '',
          model: "station"
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { title: '收费站', field: 'stationName', minWidth: 80, showOverflow: true, align: 'center' },
            { title: '参数表名', field: 'paramMark', minWidth: 60, showOverflow: true, align: 'center'  },
            { title: '省中心版本号', field: 'lastestVersion', minWidth: 60, showOverflow: true, align: 'center'  },
            { title: '当前版本号', field: 'version', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '请求版本号', field: 'manualOperationVersion', minWidth: 100, align: 'center',slots: { default: 'manualOperationVersionEdit' }  },
            { title: '结果', field: 'mark', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '操作', align: 'center', minWidth: 135, slots: { default: 'operation' }}
          ],
          page: {
            total: 0,
            currentPage: 1,
            pageSize: 10,
            align: 'right',
            pageSizes: [5, 10, 20],
            layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
            perfect: true
          }
        },
        tableToolbar: {
          id: 'modules.paramDownInfo',
          custom: true,
          zoom: true, // 最大化按钮
          slots: {
          }
        },
        tableHeight: null,
        selections: []
      }
    },
    methods: {
      /**
       * 点击 X 关闭对话框的回调
       **/
      handleDialogClose() {
        this.spShow = false;
      },
      close(){
        this.spShow = false;
      },
      init(identifier) {
        this.spShow = true
        this.queryParams.identifier = identifier
        this.getData();
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      async getData(val) {
        this.selectRow = {}
        // 加载遮挡
        this.tableData.loading = true;
        // 加载数据
        findDownPage(Object.assign({}, {
          size: this.tableData.page.pageSize,
          current: this.tableData.page.currentPage
        }), this.queryParams).then(res => {
          res.data.records.forEach((item, index) => {
            item.showReq = false
          })
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false
        });
      },
      currentChangeEvent({row}) {
        this.selectRow = row || {};
      },
      edit(row) {
        if (!row.manualOperationVersion) {
          this.$notify.warning('请求版本号不能为空！')
          return
        }
        // this.$confirm(`是否执行`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // })
        /*
        * 2022/04/20 王宁修改弹出提示
        * */
        this.$confirm(`请确认手动请求版本号为：`+row.manualOperationVersion + `请确认当前的版本号为：`+row.version , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.showReq = true
          var identifier = row.identifier || this.queryParams.identifier
          reqDown(row.bsMonitorParamName, row.manualOperationVersion,{identifier: identifier}).then(res => {
            if (res.code === 200) {
              this.$notify.success("已成功请求")
            } else {
              this.$notify.error(data.message)
            }
          }).catch(e => {
            console.log('异常信息:' + e);
          }).finally(x=>{
            row.showReq = false
          })
        })
      }
    }
  }
</script>

