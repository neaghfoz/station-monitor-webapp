<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-form
      :model="appForm"
      ref="appForm"
      :rules="rules"
      :show-message="false"
      label-width="90px"
      label-position="right"
      :inline="true"
    >
      <el-row>
        <el-form-item label="路段" prop="sysOrgIdStr">
<!--          <ti-sys-org
            ref="sysOrg"
            v-model="appForm.sysOrgIdStr"
            show-level="2"
            :props="{   value: 'id',label: 'name', children: 'children'}"
            style="width: 177px"
            :clearable="true"
          />-->
          <ti-select
            style="width: 177px"
            v-model="appForm.sysOrgIdStr"
            :clearable="true"
            url="/api/v1/common/road/findListByAuth"
            :props="{ key: 'roadId', value: 'roadId', label: 'roadName' }"
            :multiple="false"
            :dataFilter="sectionFilter"
            aria-placeholder="路段"
          />
        </el-form-item>
        <el-form-item label="出站日期" prop="dataRange">
          <ti-date-range
            date-style="width:260px"
            v-model="appForm.dataRange"
            date-type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            date-rule="singleMonth"
            begin-key="startDay"
            start-placeholder="起始日期"
            end-key="endDay"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item class="searchItem" :label-width="'50px'">
          <el-button type="primary" @click="submit">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="图表方式">
          <el-radio-group v-model="showDefault" size="mini">
            <el-radio label="table" border style="margin-right: 0">表格</el-radio>
            <el-radio label="chart" border>图表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="统计方式" v-show="showDefault == 'table'" style="margin-right: 0">
          <el-radio-group v-model="table.showDefault" size="mini">
            <el-radio label="vt" border style="margin-right: 0">按车型</el-radio>
            <el-radio label="vc" border style="margin-right: 10px">按车种</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="totalDay">
          <button
            type="button"
            class="vxe-button type--button size--mini theme--primary"
            @click="
              $data.totalDay = ''
              reload(true)
            "
          >
            <span class="vxe-button--content">{{ totalDay }}</span>
            &nbsp;
            <em class="vxe-button--icon vxe-icon--close"></em>
          </button>
        </el-form-item>
      </el-row>
    </el-form>

    <!-- 数据表格 -->
    <vxe-grid
      v-show="showDefault == 'table'"
      ref="appTable"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      max-height="1000"
      class="vxe-table-element"
      :export-config="{}"
      :toolbar="tableToolbar"
      @toolbar-button-click="toolbarEvent"
      :loading="table.loading"
      :columns="columns"
      :data="table.datas"
      :span-method="mergeRowMethod"
      @cell-click="cellClickEvent"
      :scroll-x="{ enabled: false, gt: -1 }"
      :scroll-y="{ enabled: false, gt: -1 }"
    >
    </vxe-grid>
    <div ref="myChart" style="height: 500px" v-show="showDefault == 'chart'"></div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
import tableOption from "@/views/pro/fitcheck/traffic/section/tableOption"
import { listByReqParam } from "@/views/pro/fitcheck/traffic/section/api/auditFittingRoadPathtypeRptApi"
import moment from "moment";
import chartOption from "@/views/pro/fitcheck/traffic/section/chartOption"
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"

export default {
  name: 'fitcheck.traffic.section.sectionTrafficView',
  mixins: [...mixin],
  components: { TiSelect, TiDateRange, tiSysOrg },
  data () {
    return {
      tableToolbar: {
        buttons: [
          { code: 'excelExport', icon: 'fa fa-download' }
        ]
      },
      appForm: {
        sysOrgIdStr: null,
        startDay: null,
        endDay: null,
        dataRange: {
          startDay: moment().format('YYYY-MM') + '-01',
          endDay: moment().format('YYYY-MM-DD')
        }
      },
      rules: {
        dataRange: [{
          type: 'array',
          required: true,
          message: '',
          fields: {
            startDay: { type: 'string', required: true, message: '' },
            endDay: { type: 'string', required: true, message: '' }
          }
        }]
      },
      dataSource: [],
      showDefault: 'table', // table chart
      totalDay: '', // 按天统计标记

      // 表格配置
      table: {
        loading: false,
        showDefault: 'vc',
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
        datas: []
      },
      tableInfo: {
        roadName: null,
        beginDay: null,
        endDay: null
      },
      sectionMap: {}
    }
  },
  watch: {
    showDefault (val) {
      this.reload(true)
    }
  },
  computed: {
    columns () {
      return this.table.showDefault == 'vc' ? tableOption.vcColumns(this.totalDay,this.tableInfo) : tableOption.vtColumns(this.totalDay,this.tableInfo)
    }
  },
  mounted () {
    // 初始化图表
    chartOption.init(this.$refs['myChart'])
    this.submit()
  },
  methods: {
    // 默认路段设置
    sectionFilter (datas) {
      datas.forEach((x) => {
        this.sectionMap[x.roadId] = x.roadName
      })
      return datas
    },
    cellClickEvent ({ row, column }) {
      if (column.property == 'dayName') {
        let transDay = XEUtils.get(row, column.property)
        if (transDay) {
          this.totalDay = transDay
          this.reload(true)
        }
      }
    },
    async reload (isCache) {

      this.tableInfo.roadName = this.appForm.sysOrgIdStr?(this.sectionMap[this.appForm.sysOrgIdStr]||this.appForm.sysOrgIdStr):''
      this.tableInfo.beginDay = this.totalDay || this.appForm.startDay
      this.tableInfo.endDay = this.totalDay || this.appForm.endDay

      this.table.loading = true
      // 远程获取数据
      if (!isCache) {
        const res = await listByReqParam(this.appForm);
        if (res.code == 200) {
          this.dataSource = res.data
        }
      }
      if (this.showDefault == 'table') {
        let datas = tableOption.dataFormat(this.dataSource, this.totalDay)
        // 替换数据源
        this.table.datas = datas
      } else {
        let datas = chartOption.dataFormat(this.dataSource, this.totalDay)
        this.$nextTick(() => {
          chartOption.show(datas, this.totalDay, this.chartClick)
        })
      }
      this.table.loading = false
    },
    chartClick (transDay) {
      this.totalDay = transDay
      this.reload(true)
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    mergeRowMethod ({ row, rowIndex, column, data }) {
      const fields = this.totalDay ? ['pathTypeName'] : ['dayName']
      const cellValue = XEUtils.get(row, column.property)
      if (cellValue && fields.includes(column.property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },

    submit () {
      Object.assign(this.$data.table.page, this.$options.data().table.page);
      this.$refs['appForm'].validate((valid) => {
        if (valid) {
          this.appForm.startDay = this.appForm.dataRange.startDay
          this.appForm.endDay = this.appForm.dataRange.endDay
          this.totalDay = ''
          this.reload()
        } else {
          return false;
        }
      })
    },
    toolbarEvent ({ code }) {
      if (code && code == 'excelExport') {
        this.export()
      }
    },
    export () {
      tableOption.export(this.$refs.appTable, '路段车流量统计')
    },
    reset () {
      this.$refs['appForm'].resetFields();
    },

    // 分页改变事件
    handlePageChange ({ currentPage, pageSize }) {
      this.page.currentPage = currentPage
      this.page.pageSize = pageSize
    }
  }
}
</script>
<style scoped lang="scss">
</style>
