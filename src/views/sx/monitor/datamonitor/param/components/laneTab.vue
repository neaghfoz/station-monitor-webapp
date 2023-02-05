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
      :header-align="center"
      max-height="450"
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
        <el-row>
          <el-col>
            <el-button v-permission="['monitorLaneParam:exportExcel']" @click="exportExcel.dialog = true">导出</el-button>
            <el-button v-permission="['monitorLaneParam:colsetting']" @click="colSettingFn">列配置</el-button>
            <label style="padding-left: 20px"><span style="color:red;float: right;padding-right: 10px">*注意：表头第二行蓝色字体的数据为站当前版本</span></label>

          </el-col>
        </el-row>
      </template>
    </vxe-grid>


    <tip ref="warnTip" @refreshData="warnTipFresh"/>
    <paramDownInfo ref="paramDownInfo" @refreshData="paramDownInfoFresh"/>

    <ti-export-excel :exportExcel="exportExcel" :page="page"></ti-export-excel>
  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';
import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import {findLaneParamPage} from "../paramVersionApi";
import {findUseList} from "@/views/pro/common/colSetting/colSettingApi";
import tip from './tip'
import paramDownInfo from './paramDownInfo'

export default {
  name: 'monitor.datamonitor.param.versionView.laneTab',
  props:
    {
      queryParams: {
        type: Object,
        required: false
      },
    },
  components: {TiExportExcel, tip, paramDownInfo},
  mixins: [...mixin],
  data() {
    return {
      colSetting: {
        belongModule: 'monitorLaneParam'
      },
      exportExcel: {
        url: 'api/v1/monitor/datamonitor/laneParam/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      },
      showSearch: false,
      loading: false,
      colSettings: [],
      tableToolbar: {
        id: 'monitor.datamonitor.param.laeTab-toolbar',
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
        realTotal: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'left',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      },
      selections: [],
      tableData: [],
      columns: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.colSettings.length == 0) {
        this.loading = true
        findUseList({belongModule: this.colSetting.belongModule}).then(res => {
          this.colSettings = res.data;
          this.searchData()
        })
      } else {
        this.searchData()
      }
    },
    async searchData() {
      try {
        this.loading = true
        this.columns = []
        // 每次查询初始化checkbox selections
        this.selections = []
        const {data} = await findLaneParamPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.tableData = data.records
        this.page.total = data.total
        this.page.realTotal = data.realTotal;

        this.columns = []
        var sumData = Object.assign({}, this.tableData[0])
        this.tableData.splice(0, 1)

        let allsmallestmoneyText = sumData.allsmallestmoneyText

        var sumConfig = {}
        this.colSettings.forEach(item => {
          var columnConfig = {title: item.name, field: item.code, align: 'center'}

          var childrenConfig = Object.assign({field: item.code, title: sumData[item.code]}, JSON.parse(item.attrJson));
          if (childrenConfig.field.indexOf('CurVer') > 0) {
            childrenConfig.slots = {
              default: ({row, rowIndex, column}, h) => {
                console.log('row',row)
                var col = item.code
                var colVal = !row[col] ? '无' : row[col]
                var serverVersion = !sumData[col] ? '无' : sumData[col]

                //入口 最小费率 显示 '-'
                if (item.code.startsWith('allsmallestmoney') && row.entryExitType == 1){
                  return '-';
                }
                //obublacklistincCurVer，cardblacklistincCurVer ,相差大于半个小时才显示红色
                else if (item.code.startsWith('obublacklistinc') || item.code.startsWith('cardblacklistinc')){
                  if (colVal == '无') {
                    return [<span style="color: white;background: red;">无</span>]
                  }

                  let flag = this.$moment(serverVersion,'YYYYMMDDHHmm').add('m',-30).isBefore(this.$moment(colVal,'YYYYMMDDHHmm'))

                  return flag ? row[item.code] : [<span style="color: white;background: red;">{colVal}</span>]
                }else {
                  if (serverVersion !== colVal) {
                    if (colVal == '无') {
                      return [<span style="color: white;background: red;">无</span>]
                    }else if ("rateCurVer" == item.code) {
                      var versions = row[item.code].split('|');
                      // 终止for循环，使用break
                      for(var i = 0; i < versions.length; i++) {
                        if (versions[i].substring(2, versions[i].length) == sumData[item.code]) {
                          return row[item.code]
                        }
                      }
                    }

                    return [<span style="color: white;background: red;">{colVal}</span>]
                  } else {
                    return row[item.code]
                  }
                }

              }
            }
            columnConfig.children = [childrenConfig];
          }

          childrenConfig['headerClassName'] = 'headerFontColor'
          columnConfig.children = [childrenConfig];
          this.columns.push(columnConfig);
        })

        //显示是否启用字段
        this.columns.forEach(x=>{
          if (x.children[0].field == 'allsmallestmoneyCurVer') {
            x.children[0].title = allsmallestmoneyText
          }
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
    // change(param1, param2) {
    //   this.queryParams.sysOrg = param2;
    // },
    detail(id, exTime) {
      var timestamp = Date.parse(new Date());
      this.$router.push({
        path: '/search/list/laneExList/detail/' + timestamp,
        query: {
          id: id,
          exTime: exTime
        }
      });
    },
    colSettingFn() {
      this.$router.push({
        path: '/monitor/datamonitor/param/laneTab/colSetting',
        query: {
          belongModule: this.colSetting.belongModule
        }
      });
    },
    tip(row, column, headerTitle) {
      var tipContent = '请确认是否将' + row['laneName'] + '[' + headerTitle + ']手动更新到最新版本'
      var bsParamName = column.property.replace("CurVer", '')
      this.$refs.warnTip.init(tipContent, bsParamName, row['identifier'])
    },
    reqDown() {
      if (this.selections.length !== 1) {
        this.$notify.warning('请选择一条记录！')
        return
      }

      this.$refs.paramDownInfo.init(this.selections[0]['identifier'])
    }
  }
}
</script>

<style>

.headerFontColor {
  color: #1890ff !important;
}
</style>
