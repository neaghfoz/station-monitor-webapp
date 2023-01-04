<template>
  <div class="app-container" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :model="queryParams" inline label-position="right" :label-width="'100px'">

 <!--     <el-form-item label="管理中心" prop="serviceOrgId">
        <ti-select ref="centerOrg" v-model="queryParams.serviceOrgId"
                   url="api/v1/common/center/findListByAuth"
                   :props="{key:'centerId',value:'centerId',label:'centerName'}"/>
      </el-form-item>-->
      <el-form-item label="管理中心" prop="serviceOrgId">
        <mgr-select :clearable="true" style="width:160px" v-model="queryParams.serviceOrgId"/>
      </el-form-item>

      <el-form-item label="工单类型" prop="dataTypes">
        <ti-select v-model="queryParams.workOrderType" dict-type="tibms_kpi_workOrderType" style="width:120px;"
                   :multiple="false"/>
      </el-form-item>

      <el-form-item label="工单状态" prop="dataTypes">
        <ti-select v-model="queryParams.workOrderStatusStr" dict-type="tibms_kpi_workOrderStatus" style=" width:120px;"
                   :multiple="true"/>
      </el-form-item>

      <el-form-item label="工单编号" prop="workOrderId">
        <el-input v-model="queryParams.workOrderId" type="text" maxlength="20" style="width: 199px"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <ti-date-range date-style="width: 240px;" v-model="queryParams" date-type="daterange" format="yyyy-MM-dd"
                       begin-key="beginCreateDate" end-key="endCreateDate" :clearable="true"/>
      </el-form-item>

      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </el-form-item>

    </el-form>
    <div style="flex:1;min-height: 400px;">
      <vxe-grid
        ref="table"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        keep-source
        highlight-current-row
        height="auto"
        class="vxe-table-element"
        :loading="table.loading"
        :start-index="(table.page.currentPage - 1) * table.page.pageSize"
        :pager-config="table.page"
        :columns="table.columns"
        :data="table.data"
        :toolbar="table.tableToolbar"
        :editConfig="table.editConfig"
        @page-change="handlePageChange">
        >
        <template v-slot:tbars>
          <el-button type="primary" v-permission="['workOrder:imp']" @click="importVisible = true">导入生成工单</el-button>
          <el-button type="primary" v-permission="['workOrder:exp']" @click="expWork">导出</el-button>
        </template>

        <template v-slot:operation="{ row }">
          <el-button type="text" v-permission="['workOrder:detail']" v-show="hasPermission(row,'detail')" @click="detailRowEvent(row)">详情</el-button>
          <el-button type="text" v-permission="['workOrder:delete']" v-show="hasPermission(row,'delete')" :loading="deleteLoading" @click="deleteRowEvent(row)">删除</el-button>
          <el-button type="text" v-permission="['workOrder:detail']" v-show="hasPermission(row,'edit')" @click="editRowEvent(row)">处理</el-button>
        </template>
      </vxe-grid>
      <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>

      <ti-import
        :upload-url="importUrl"
        :tpl-url="tplUrl"
        title="导入生成工单"
        :visible="importVisible"
        @onSuccess="importFinish"
        @error=""
        @close="importVisible = false"
      />
      <ti-imp-error ref="impError"/>
    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel"
  import TiImport from '@/views/pro/common/tiElement/tiImport/tiImport'
  import api from "@/views/fs/kpi/workOrder/workOrderApi"
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import TiImpError from "@/views/pro/common/tiElement/tiImpError/tiImpError"
  import MgrSelect from "@/views/fs/kpi/common/mgrSelect/mgrSelect"

  export default {
    name: "kpi.workOrderView",
    components: {MgrSelect,TiSelect, TiDateRange, TiExportExcel, TiImport, TiImpError},
    mixins: [...mixin],
    data() {
      return {
        deleteLoading: false,
        importVisible: false,
        tplUrl: '',
        importUrl: '',
        queryParams: {
          serviceOrgId: null,
          workOrderType: null,
          workOrderStatusStr: '1,2',
          workOrderId: null,
          beginCreateDate: null,
          endCreateDate: null,
          beginDateStr: null,
          endDateStr: null
        },
        table: {
          loading: false,
          data: [],
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
          tableToolbar: {
            id: 'kpi.workOrderView.toolbar',
            custom: true,
            slots: {
              buttons: 'tbars'
            },
            zoom: false, // 最大化按钮
            // 列宽操作记录
            resizable: {
              storage: true
            },
            // 列操作记录
            setting: {
              storage: true
            }
          },
          editConfig: {
            trigger: 'manual',
            mode: 'row',
            showStatus: true,
            showIcon: false
          },
          columns: [
            {type: 'seq', title: '序号', width: 50, align: 'center'},
            {field: 'workOrderId', title: '工单编号', minWidth: 180, align: 'center'},
            {field: 'workOrderTypeText', title: '工单类型', minWidth: 80, align: 'center'},
            {field: 'progress', title: '工单处理进度', minWidth: 120, align: 'center'},
            {field: 'workOrderStatusText', title: '工单状态', minWidth: 80, align: 'center'},
            {field: 'serviceOrgName', title: '管理中心', minWidth: 100, align: 'center', showOverflow: true},
            {field: 'createrText', title: '创建人', minWidth: 100, align: 'center', showOverflow: true},
            {field: 'createTimeTxt', title: '创建时间', minWidth: 160, align: 'center', showOverflow: true},
            {field: 'completeTime', title: '工单完成时间', minWidth: 160, align: 'center', showOverflow: true},
            {field: 'durationText', title: '工单历时', minWidth: 80, align: 'center', showOverflow: true},
            {title: '操作', width: 120, fixed: 'right', align: 'center', slots: {default: 'operation'}}
          ]
        },
        exportExcel: {
          url: 'api/v1/kpi/workOrder/exp',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        }
      }
    },
    created() {
      this.reload();
      this.exportExcel.queryParams = this.queryParams
      this.tplUrl = '/api/v1/kpi/workOrderIdImp/excelTemplate';
      this.importUrl = '/api/v1/kpi/workOrderIdImp/importExcel';
    },
    methods: {
      hasPermission(row, opType) {
        //超级管理员不给看操作列
        if (this.$store.getters.userInfo.isSuperUser) {
          console.log('注意，超级管理员没有操作列!');
          return false;
        }
        let flag = false;
        let rowWorkOrderStatus = row.workOrderStatus;
        switch (opType) {
          case 'detail':
            flag = true;
            break;
          case 'delete':
            flag = rowWorkOrderStatus == 1;
            break;
          case 'edit':
            flag = rowWorkOrderStatus != 3;
            break;
          default :
            flag = false;
        }
        return flag;
      },
      detailRowEvent(row) {
        let url = row.dataType == 1 ? '/kpi/relatedEnlist/view' : '/kpi/relatedExlist/view'
        this.$router.push({
          path: url,
          query: {
            workOrderId: row.workOrderId,
            startDay : row.minTime,
            endDay : row.maxTime,
            type: 'detail'
          }
        });
      },
      editRowEvent(row) {
        let url = row.dataType == 1 ? '/kpi/relatedEnlist/view' : '/kpi/relatedExlist/view'
        this.$router.push({
          path: url,
          query: {
            workOrderId: row.workOrderId,
            startDay : row.minTime,
            endDay : row.maxTime,
            type: 'edit'
          }
        });
      },
      // 通用查询设置
      async reload() {
        this.queryParams.beginDateStr = this.queryParams.beginCreateDate
        if (this.queryParams.endCreateDate == null || this.queryParams.endCreateDate == '') {
          this.queryParams.endDateStr = this.queryParams.endCreateDate
        } else {
          this.queryParams.endDateStr = this.queryParams.endCreateDate + " 23:59:59"
        }
        this.table.loading = true
        const res = await api.findWorkOrders({current: this.table.page.currentPage, size: this.table.page.pageSize}, this.queryParams);
        if (res.code == 200) {
          this.table.data = res.data.records
          this.table.page.total = res.data.total
        } else {
          this.table.data = []
          this.table.page.total = 0
        }
        this.table.loading = false
      },
      submit() {
        this.$refs.appForm.validate((valid) => {
          if (valid) {
            this.table.page.currentPage = 1
            this.reload()
          } else {
            return false;
          }
        })
      },
      // 删除工单
      async deleteRowEvent(row) {
        this.$confirm('确定删除工单' + row.workOrderId + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteLoading = true;
          console.log("row:", row);
          api.deleteItem({}, row).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功！');
              this.reload();
            } else {
              this.$message.error(res.message);
            }
          });
          this.deleteLoading = false;
        });
      },
      reset() {
        this.queryParams.serviceOrgId = null,
          this.queryParams.workOrderType = null,
          this.queryParams.workOrderStatusStr = '1,2',
          this.queryParams.workOrderId = null,
          this.queryParams.beginCreateDate = null,
          this.queryParams.endCreateDate = null;
      },
      // 分页改变事件
      handlePageChange({currentPage, pageSize}) {
        this.table.page.currentPage = currentPage
        this.table.page.pageSize = pageSize
        this.reload()
      },
      expWork(){
        this.exportExcel.queryParams = this.queryParams
        this.exportExcel.dialog = true
      },
      importFinish(resp, file, filelist) {
        if (resp.code != '200') {
          this.$alert(resp.message);
        } else if (resp.data.flag == 'false' && resp.data.errorMessage) {
          // this.$refs.impError.show(resp.data.errorMessage)
          this.$alert(resp.data.errorMessage);
        } else if (resp.data.flag == 'false' && resp.data.failList) {
          this.$refs.impError.show(resp.data.failList)
          this.$alert('导入发生异常，请检查文件内容格式稍后重试！')
        } else if (resp.data.flag == 'false' && resp.data.repeatData) {
          console.log(resp.data.repeatData);
          this.$alert("数据重复，请检查!");
        } else {
          //成功
          this.$notify.success("导入成功!")
        }
      },
/* 废弃
      importSuccess(resp, file, filelist) {
        if (resp.code != '200') {
          this.$alert(resp.message);
        } else if (resp.data.flag == 'false' && resp.data.errorMessage) {
          this.$alert(resp.data.errorMessage);
        } else if (resp.data.flag == 'false' && resp.data.failList) {
          console.log(resp.data.failList);
          let res = '';
          resp.data.failList.forEach(x => {
            res += '第' + x.importExcelRowNum + '行：' + x.importExcelErrorMsg + ';'
          });
          this.$alert(res);
        } else if (resp.data.flag == 'false' && resp.data.repeatData) {
          console.log(resp.data.repeatData);
          this.$alert("数据重复，请检查!");
        } else {
          if (resp.data.repeatList) {
            let res = '';
            resp.data.repeatList.forEach(x => {
              res += x.listNo + ','
            });
            res += '已存在，剔除后导入'
            this.$alert(res);
          }
          //成功
          this.$notify.success("导入成功!")
        }
      }
*/

    }
  }
</script>
