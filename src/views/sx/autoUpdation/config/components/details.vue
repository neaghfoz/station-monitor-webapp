<template>
  <div class="app-container">
    <el-form ref="form" v-loading="loading" :model="formItem" label-width="150px" >
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item
            label="批次号"
            prop="versionId"
            :rules="[{required: true}]"
          >
            <el-input v-model="formItem.versionId" type="text" placeholder="版本号" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item
            label="创建时间"
            prop="createTime"
          >
            <el-input v-model="formItem.createTime" type="text" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="下发更新时间"
            prop="sendTimeText"
          >
            <el-input v-model="formItem.sendTimeText" type="text" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="创建人"
            prop="creatorName"
          >
            <el-input v-model="formItem.creatorName" type="text" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="更新说明"
            prop="remark"

          >
            <el-input v-model="formItem.releaseNote" type="textarea" :autosize="{minRows: 5, maxRows: 10}" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="24">
          <el-form-item label="配置包">
            <span v-for="item in formItem.uploadFiles" style="text-decoration:underline;color: #3B9DF7;">
              <a href="javascript:void(0)" @click="down(item.id)">{{ item.fileName }}</a>
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center">
      <el-button type="primary" v-permission="['autoUpdationConfig:addUpdation']" @click="issue">新增下发车道</el-button>
      <el-button v-permission="['configUpdateHistory:export']" @click="exportExcel.dialog = true">导出</el-button>
      <el-button @click="close()">关闭</el-button>
    </div>
    <el-card shadow="never" style="margin-top: 30px;">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="机构" prop="sysOrgIdStr">
            <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" @change="orgChange" show-level="4" default-first-value />
          </el-form-item>
          <el-form-item label="车道编号" prop="laneNoStr">
            <ti-sys-lane clearable v-model="queryParams.laneNoStr"  :cache="true" :station-id="appForm.stationId" :multiple="true" />
          </el-form-item>
          <el-form-item label="出入口类型" prop="enexType">
            <ti-select
              v-model="queryParams.enexType"
              placeholder="全部"
              dict-type="tibms_auto_enexType"
            />
          </el-form-item>
          <el-form-item label="状态" prop="statusStr">
            <ti-select :multiple="true"
              v-model="queryParams.statusStr"
              placeholder="全部"
              dict-type="tibms_auto_terminalUpdateStatus"
            />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-form-item v-show="false" prop="startTime" />
            <el-form-item v-show="false" prop="endTime" />
            <ti-date-range
              v-model="queryParams"
              date-type="daterange"
              format="yyyy-MM-dd"
              begin-key="startTime"
              end-key="endTime"
              date-style="width:470px"
            />
          </el-form-item>

          <el-form-item class="searchItem" style="float: right;padding-right:20px">
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
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
          :max-height="600"
          :loading="tableData.loading"
          :columns="tableData.tableColumns"
          :data="tableData.columnsDataList"
          :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
          :pager-config="tableData.page"
          :toolbar="tableToolbar"
          @page-change="handlePageChange"
        >
          <template v-slot:operation="{ row }">

            <el-button  v-permission="['autoUpdationConfig:reAddUpdation']"  v-if="row.status == 5" type="warning" @click="reAddUpdation(row)">重新下发</el-button>
            <span v-if="row.status != 5"  >--</span>
          </template>

        </vxe-grid>
        <ti-export-excel :exportExcel="exportExcel" :page="tableData.page" ></ti-export-excel>
      </div>
    </el-card>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import { reAddUpdation, detail, updateHistoryList} from '../config'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import moment from 'moment'
import { getToken } from '@/utils/auth'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"

export default {
  name: 'autoUpdation.config.details',
  components: { TiSelect, tiSysOrg, TiDateRange, TiExportExcel,TiSysLane },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      method: '',
      title: '',
      appId: '',
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      appForm: {
        stationId: '',
      },
      formItem: {
        versionId: '',
        createTime: '',
        creatorName: '',
        sendTimeText: '',
        releaseNote: '',
        uploadFiles: []
      },
      systemInfoList: [],
      downUrl: '/api/v1/version/upload/',
      queryParams: {
        sysOrgIdStr: '',
        stationId: '',
        laneNo: '',
        laneNoStr: '',
        versionId: '',
        enexType: '',
        status: '',
        statusStr: '',
        startTime: moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'),
        endTime: moment(new Date()).add(0, 'days').format('YYYY-MM-DD'),
        type: 2
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { title: '路段', field: 'roadText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '收费站', field: 'stationText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '车道号', field: 'laneNo', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '车道类型', field: 'terminalTypeText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '出入口类型', field: 'enexTypeText', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '状态更新时间', field: 'genTime', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '更新状态', field: 'statusText', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '错误原因', field: 'detail', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '操作', align: 'center', minWidth: 135, slots: { default: 'operation' }}
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }},
      tableToolbar: {
        id: 'modules.paramQuery',
        custom: true,
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
      tableHeight: null,
      exportExcel: {
        url: '/api/v1/config/history/exportExcel',
        dialog: false,
        queryParams: {},
        type: 'curpage'
      }
    }
  },
  watch: {
  },
  created() {
    this.init()
  },
  methods: {
    orgChange(val,org){
      if(org){
        this.appForm.stationId = org.stationId
      }
    },
    init() {
      this.queryParams.versionId = this.$route.query.versionId
      detail(this.queryParams.versionId).then(res => {
        this.formItem = res.data
      })
      this.submit()
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      console.log(this.queryParams)
      this.tableData.loading = true
      updateHistoryList(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
      this.exportExcel.queryParams = this.queryParams
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    down(id) {
      window.open(this.downUrl + id + '?token=' + getToken())
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.$refs.sysOrg.setDefaultFirstValue();

    },
    issue() {
      this.$router.push({
        path: '/autoUpdation/config/issue',
        query: { versionId: this.queryParams.versionId }
      })
    },
    add() {
      this.$refs.addDialog.init('add')
    },
    reAddUpdation(row) {

      reAddUpdation(row).then((res) => {
        this.$notify.success(res.message)
      })
    }
  }
}
</script>

<style scoped>
  .el-form .el-select-tree  >>> .el-input{
    min-width: 180px !important;
    max-width: 180px !important;
  }

  .el-form .el-select >>> .el-input{
    min-width: 180px!important;
    max-width: 180px!important;
  }
  .el-form .el-input {
    min-width: 180px !important;
    max-width: 180px !important;
  }

  .el-form .el-date-editor {
    width: 470px!important;
  }
</style>
