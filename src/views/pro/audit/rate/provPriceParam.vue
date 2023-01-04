<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-form ref="appForm" :model="appForm" :rules="rules" :show-message="false" label-width="90px" label-position="right" :inline="true">
      <el-row>
        <el-form-item label="收费路段" prop="sectionId">
          <ti-select ref="sectionId" style="width: 177px" v-model="appForm.sectionId"
                     url="/api/v1/common/road/findAllList"
                     :props="{key:'roadId',value:'roadId',label:'roadText'}"
                     :clearable="false"
                     :multiple="false" aria-placeholder="收费路段"/>
        </el-form-item>
        <el-form-item label="收费单元" prop="tollIntervalId">
          <ti-select
            ref="tollIntervalId"
            v-model="appForm.tollIntervalId"
            check-strictly
            url="api/v1/common/interval/findAllList"
            :props="{key:'intervalId',value:'intervalId',label:'intervalTxt'}"
            :watch-attr="appForm.sectionId"
            :watch-attr-fn="watchAttrFn"
            :multiple="false"
          />
        </el-form-item>
        <el-form-item label="车型" prop="vehicleType">
          <ti-select v-model="appForm.vehicleType" dict-type="tibms_com_vehicleType"
                     :multiple="false"/>
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
          <el-button type="success" @click="exportExcel.dialog = true">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <vxe-grid
      ref="appTable"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      class="vxe-table-element"
      :export-config="{}"
      :loading="table.loading"
      :columns="table.columns"
      :data="table.datas"
      :start-index="(table.page.currentPage - 1) * table.page.pageSize"
      :pager-config="table.page"
      @current-change="currentChangeEvent"
      @page-change="handlePageChange"
    >
    </vxe-grid>
    <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
import { exportExcel } from '@/views/pro/common/util/dataUtil'
import { findProvPriceParamList } from '@/views/pro/audit/rate/rateManage'

export default {
  name: 'auditRateProvPriceParamView',
  components: { TiSelect, TiExportExcel, findProvPriceParamList },
  mixins: [...mixin],
  data() {
    return {
      tableToolbar: {
        buttons: [
          { code: 'excelExport', icon: 'fa fa-download' }
        ]
      },
      selectRowIndex: 0,
      appForm: {
        sectionId: null,
        tollIntervalId: null,
        vehicleType: null,
        version: null,
        paramType: null
      },
      rules: {
      },
      // 表格配置
      table: {
        loading: false,
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump',
            'Total'],
          perfect: true
        },
        datas: [],
        columns: [{
          field: 'version',
          title: '版本',
          minWidth: 80,
          showOverflow: true
        },
        {
          field: 'tollRoadName',
          title: '收费公路',
          minWidth: 100,
          showOverflow: true
        },
        {
          field: 'sectionName',
          title: '收费路段',
          minWidth: 80,
          showOverflow: true
        },
        {
          field: 'tollIntervalName',
          title: '收费单元',
          minWidth: 320,
          showOverflow: true
        },
        {
          field: 'vehicleTypeName',
          title: '车型',
          minWidth: 80,
          showOverflow: true
        },
        {
          field: 'fee',
          title: '通行费额(元)',
          minWidth: 80,
          showOverflow: true
        },
        {
          field: 'validTime',
          title: '生效时间',
          minWidth: 100,
          showOverflow: true
        }]
      },
      exportExcel: {
        url: 'api/v1/audit/rate/provPriceParam/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  created() {
    this.appForm.version = this.$route.query.paramVersion
    this.appForm.paramType = this.$route.query.paramType
  },
  mounted() {
    this.submit()
  },
  methods: {
    currentChangeEvent({ row }) {
      this.selectRowIndex = this.$refs.appTable.getRowIndex(row)
    },
    async reload(isCache) {
      this.table.loading = true
      const res = await findProvPriceParamList({ current: this.table.page.currentPage, size: this.table.page.pageSize }, this.appForm)
      if (res.code == 200) {
        this.table.datas = res.data.records
        this.table.page.total = res.data.total
      }
      this.table.loading = false
      //保存导出的查询条件
      this.exportExcel.queryParams = this.appForm;
    },
    submit() {
      this.$refs['appForm'].validate((valid) => {
        if (valid) {
          this.table.page.currentPage = 1
          this.selectRowIndex = 0
          this.reload()
        } else {
          return false
        }
      })
    },
    reset() {
      this.$refs['appForm'].resetFields()
    },
    exportEx() {
      exportExcel(this.$refs['appTable'], '省内计费参数')
    },
    // 分页改变事件
    handlePageChange({ currentPage, pageSize }) {
      this.table.page.currentPage = currentPage
      this.table.page.pageSize = pageSize
      this.reload()
    },
    watchAttrFn(newVal,oldVal,selectData){
      let selectDataShow = [];
      //改变下拉列表
      if (newVal) {
        selectData.forEach(x => {
            if ((',' + newVal + ',').indexOf(',' + x.roadId + ',') > -1) {
              selectDataShow.push(x)
            }
          }
        );
      }else{
        selectDataShow = selectData;
      }
      return selectDataShow;
    }
  }
}
</script>
<style scoped lang="scss">

</style>
