<template>
  <div>


    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      stripe
      round
      size="small"
      resizable
      sync-resize
      :auto-resize="true"
      :header-align = "center"
      max-height="450"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @page-change="handlePageChange"
      @radio-change="radioChange"
    >
      <template v-slot:toolbar_buttons>
        <el-row>
          <el-col>
            <el-button v-permission="['monitorStationParam:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
            <el-button v-permission="['monitorStationParam:colsetting']" @click="colSettingFn">列配置</el-button>
            <el-button type="primary"  v-permission="['monitorStationParam:reqDown']" @click="reqDown()"  >手动请求</el-button>
            <label style="padding-left: 20px"><span style="color:red;float: right;padding-right: 10px">*注意：表头第二行蓝色字体的数据为省中心当前版本</span></label>

          </el-col>
        </el-row>
      </template>
    </vxe-grid>


    <tip ref="warnTip" @refreshData="warnTipFresh" />
    <paramDownInfo ref="paramDownInfo" @refreshData="paramDownInfoFresh" />

    <ti-export-excel :exportExcel="exportExcel" :page="page" ></ti-export-excel>
  </div>

</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import {findServerParamPage} from "../paramVersionApi";
  import {findUseList} from "@/views/pro/common/colSetting/colSettingApi";
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import tip from './tip'
  import paramDownInfo from './paramDownInfo'

  export default {
    name: 'monitor.datamonitor.param.versionView.stationTab',
    props:
      {
        queryParams: {
          type: Object,
          required: false
        },
      },
    components: {TiExportExcel, tip, paramDownInfo },
    mixins: [...mixin],
    data() {
      return {
        colSetting: {
          belongModule: 'monitorStationParam'
        },
        exportExcel: {
          url: 'api/v1/monitor/datamonitor/serverParam/exportExcel',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        colSettings: [],
        loading: false,
        tableToolbar: {
          id: 'monitor.datamonitor.param.stationTab-toolbar',
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
          },
        },
        page: {
          total: 0,
          realTotal: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selectedRow: {},
        tableData: [],
        columns: []
      }
    },
    created() {
    },
    // watch: {
    //   //机构开启默认值，第一次进入页面，得用监听刷新，不能用create,用create获取不到值。
    //   'queryParams.sysOrgIdStr'(newVal,oldVal) {
    //     if (!this.queryParams.firstFlag){
    //       this.getData();
    //       this.queryParams.firstFlag = true;
    //     }
    //   }
    // },
    methods: {
      init(){
        if(this.colSettings.length == 0) {
          this.loading = true
          findUseList({belongModule: this.colSetting.belongModule}).then(res => {
            this.colSettings = res.data;
            this.searchData()
          })
        } else {
          this.searchData()
        }
      },
      radioChange({ row }) {
        this.selectedRow = row
      },
      async searchData() {
        try {
          this.loading = true
          this.columns = []
          this.selectedRow = {}
          const {data} = await findServerParamPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
          this.tableData = data.records
          this.page.total = data.total
          this.page.realTotal = data.realTotal;

          this.columns = []
          var sumData = Object.assign({}, this.tableData[0])
          this.tableData.splice(0, 1)

          var sumConfig = {}
          this.columns.push({title: '', align: 'center', type :'radio'});
          this.colSettings.forEach(item => {
            var columnConfig ={title: item.name, field: item.code, align: 'center'}

            var childrenConfig = Object.assign({ field: item.code, title: sumData[item.code] },JSON.parse(item.attrJson));
            if (childrenConfig.field.indexOf('CurVer') > 0) {
              childrenConfig.slots = {
                default: ({row,rowIndex,column}, h) => {
                  var col = item.code
                  var colVal = (row[col] == '' || row[col] == null  || typeof(row[col]) == "undefined")? '无' : row[col]
                  var serverVersion = (sumData[col] == '' || sumData[col] == null || typeof(sumData[col]) == "undefined")? '无' : sumData[col]
                  if (serverVersion !== colVal) {
                    return [<a style= "color: white;background: red;text-decoration:underline" onClick={() => this.tip(row, column, item.name)}>{ colVal }</a>]
                  } else {
                    return row[ item.code]
                  }
                }
              }
              columnConfig.children = [childrenConfig];
            }

            childrenConfig['headerClassName'] = 'headerFontColor'
            columnConfig.children = [childrenConfig];
            this.columns.push(columnConfig);
          })

          //保存导出的查询条件
          this.exportExcel.queryParams = this.queryParams;
        } finally {
          this.loading = false
        }

      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.searchData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.$refs.sysOrg.setDefaultFirstValue();
        // this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue();
        //this.getData()
      },
      colSettingFn() {
        this.$router.push({
          path: '/monitor/datamonitor/param/stationTab/colSetting',
          query: {
            belongModule: this.colSetting.belongModule
          }
        });
      },
      tip(row, column,headerTitle) {
        var tipContent = '请确认是否将' + row['stationName'] + '【' +headerTitle + '】手动更新至省中心当前版本'
        var bsParamName = column.property.replace("CurVer", '')
        this.$refs.warnTip.init(tipContent,bsParamName, row['identifier'])
      },
      reqDown(){
        if (JSON.stringify(this.selectedRow) === "{}") {
          this.$notify.warning('请选择一条记录！')
          return
        }
        this.$refs.paramDownInfo.init(this.selectedRow['stationId'])
      }
    }
  }
</script>

<style>

  .headerFontColor {
    color:#1890ff !important;
  }
</style>
