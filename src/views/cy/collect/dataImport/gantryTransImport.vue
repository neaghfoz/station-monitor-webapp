<template>
  <div class="app-container">
    <el-form ref="searchItem" :model="queryParams" inline :label-width="'100px'">
     <el-form-item label="路段" prop="roadId">
        <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
      </el-form-item>
      <el-form-item label="导入日期"> 
        <el-form-item prop="startTime" v-show="false"/>
        <el-form-item prop="endTime" v-show="false"/>
        <ti-date-range ref="dayRang" :editable="false" v-model="queryParams"
                      date-type="daterange"
                      format="yyyy-MM-dd" value-format="yyyy-MM-dd" begin-key="startTime"
                      end-key="endTime"/>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
      <vxe-grid
        ref="vxe"
        highlight-hover-row
        border
        show-overflow
        show-header-overflow
        resizable
        max-height="400"
        sync-resize
        auto-resize
        keep-source
        class="vxe-table-element" 
        :loading="loading"
        :columns="columns"
        :data="tableData.records"
        :toolbar="tableToolbar"
        :pager-config="pageConfig"
        :seq-config="{seqMethod}" 
        :start-index="(tableData.current - 1) * tableData.size" 
        @page-change="handlePageChange"
      >
      <template v-slot:toolbar_buttons> 
          <el-button type="primary" v-permission="['gantryTranImport:import']"  @click="importVisible = true">导入</el-button>
      </template>
      </vxe-grid> 
    </el-form> 
 
    <el-dialog
        title="数据导入"
        :visible.sync="importVisible"
        width="700px"
        @close="importVisible = false"
        v-loading="dialogLoading"
        element-loading-background="rgba(0, 0, 0, 0)"
      >
      <el-container>
        <el-form label-width="180px" :rules="uploadRules">  
          <el-row> 
            <el-form-item label="导入日期" prop="collectDate">
              <el-date-picker
                  v-model="uploadForm.collectDate"
                  type="date" 
                  placeholder="选择日期时间"
                  :picker-options="expireTimeOption"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="模板下载">
              <el-button  icon="el-icon-download" @click="downloadTpl">上传数据模板下载</el-button>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="数据上传">
                <el-upload
                  ref="uploadRef"
                  class="avatar-uploader"
                  :action="importUrl"
                  :limit="limit"
                  :auto-upload="false" 
                  :on-change="(file, fileList) => { hasData = fileList.length > 0 }"
                  :on-remove="(file, fileList) => { hasData = fileList.length > 0 }"
                  :before-upload="beforeUpload"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :on-exceed="onExceed" 
                >
                <el-button slot="trigger" type="primary">选取数据文件</el-button>
                <el-button style="margin-left: 10px;" type="success"  :disabled="!hasData" :loading="uploadLoading" @click="submitUpload">导入数据</el-button>
              </el-upload>
            </el-form-item> 
          </el-row>
          <el-row>
            <div style="width:80%;padding-left:18%;">
              <p style="font-size:14px;color: #606266;font-weight:bold">
              <!-- 导入说明：导入时需要设置导入日期，如果选择了相同日期的数据，则会把此日期
              以前导入的数据和自然日汇总数据删除！<br/> -->
               导入说明：导入压缩包格式只支持zip格式，数据文件只支持Excel的.xls或.xlsx文件
            </p>
            </div> 
          </el-row>
        </el-form>
      <!-- <el-main>
        <el-alert  title="说明：
          1、一次只能上传一个文件，可通过浏览本地文件选取文件上传
          2、导入数据按钮默认置灰，选好文件后才可点击，点击导入数据按钮可导入文件数据"
          type="success" closable="false">
        </el-alert>
      </el-main> -->
    </el-container>

  </el-dialog>

  <el-dialog
    title="提示"
    :visible.sync="tipDialogVisible"
    width="30%" >
    <span>有错误信息无法导入，请按错误文件信息修改流水数据后重新上传文件</span>
    <el-button icon="el-icon-download" @click="downloadErrorTpl">错误流水下载</el-button>

    <span slot="footer" class="dialog-footer">
      <el-button @click="tipDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="tipDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>


  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel"
  import TiImport from '@/views/pro/common/tiElement/tiImport/tiImport' 
  import {findList,checkIsAllow} from "./collectDataImportApi"; 
  import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import dateUtil from "@/views/pro/common/util/dateUtil";
  import { getToken } from '@/utils/auth'
  import TiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi"
  import moment from "moment"
  
  export default {
    name: "cy.collect.dataImport.gantryTransImport",
    components: {TiSelect, TiExportExcel, TiImport,TiSysOrg,TiDateRange},
    mixins: [...mixin],
    data() {
      return {
        limit: 1,
        saveLoading:false,
        submitLoading:false,
        importVisible: false,
        hasData: false, // 判断是否有文件上传
        isAllowUpload:false,//判断是否允许上传
        tplUrl: '',
        errorTpl:'',
        importUrl: '',
        queryParams: {
          roadId: 'S0060140430',
          startTime:dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD'),
          endTime:dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD')
        }, 
        uploadLoading:false,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tipDialogVisible:false,
        tableToolbar: {
          id: 'dataCollect.components.actualSplitIncome-toolbar',
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
        tableData: [],
        logData:[],
        initTableData:[],
        columns: [
            {title: "序号", type:"seq",align: 'center',fixed:'center',minWidth: 50,showOver: true},
            {field: "roadName",title: "路段名称",align: 'center',fixed:'center',minWidth: 180,showOver: true},
            {field: "collectTime",title: "导入日期",align: 'center',fixed:'center',minWidth: 180,showOver: true},
            {field: "operatorId",title: "操作者",align: 'center',fixed:'center',minWidth: 180,showOver: true},
            {field: "createTime",title: "操作时间",align: 'center',fixed:'center',minWidth: 180,showOver: true}
        ],
        pageConfig: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }, 
        userOrg:{

        },
        dialogLoading:false,
        columnMap:{},
        uploadForm:{
          collectDate:dateUtil.getNextDate(new Date(), 'days', 1, 'YYYY-MM-DD')
        },
        uploadRules:{
          collectDate: [
            {
              validator: async(rule,value,callback) =>{
                // let _this = this
                //  let checkData = {
                //    "collectTime":this.uploadForm.collectDate,
                //    "roadId":this.queryParams.roadId
                //  }
                //  const {data} = await checkIsAllow(checkData); 
                //  console.log("data:"+data)
                //  if(data){ 
                  this.importUrl = '/api/v1/collect/dataImport/importExcel/' + this.queryParams.roadId + '/'
                      + this.uploadForm.collectDate+'?token='+getToken();
                   this.isAllowUpload = true; 
                   callback();
                //  }else{
                //    this.isAllowUpload = false;
                //    callback(new Error("当前日期未存在录入任务"))
                //  }
              }
            }
          ],
        },
         expireTimeOption: {
          disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      }
    },
    created() {
      this.getCurUserOrg();
      this.getData();
      this.tplUrl = '/api/v1/collect/dataImport/excelTemplate/' + this.queryParams.roadId + '/'
          + moment(new Date()).add(0, 'month').format('yyyy-MM-DD');
      this.importUrl = '/api/v1/collect/dataImport/importExcel/' + this.queryParams.roadId + '/'
                + this.uploadForm.collectDate+'?token='+getToken();
    },
    watch:{

    },
    methods: {
      async getData() {
        this.loading = true;
        const {data} = await findList(Object.assign({}, {size: this.pageConfig.pageSize, 
                  current: this.pageConfig.currentPage}),this.queryParams);
        this.tableData = data;
        this.pageConfig.total = data.total;
        this.loading = false;
      },  
      downloadTpl() { // 下载模板
        window.open(`${this.tplUrl}?token=${getToken()}`)
      },
      downloadErrorTpl(){//错误下载
        window.open(`${this.errorTpl}?token=${getToken()}`)
      },
      submitUpload() { //  手动上传  
        this.$refs.uploadRef.submit()
      },
      onSuccess(resp, file, filelist) { 
        if (!resp.success) {
          this.onError(resp, file, filelist)
          return
        }
        const data = resp.data
        const respFile = { status: 'success', url: data }
        this.$notify.success('文件上传成功!')
        this.uploadLoading = false;
        
        this.dialogLoading = false;
        this.importVisible = false; 
        this.$refs.uploadRef.clearFiles();
        this.getData();
        this.uploadForm.collectDate = '';
      }, 
     
      onError(e, file, filelist) {  
        if(e.code == '10001'){
          this.errorTpl = '/api/v1/collect/dataImport/errorRecord/'+e.message; 
          this.importVisible = false;
          this.tipDialogVisible = true; 
          this.$notify.error('数据校验错误！');
        } else{
          this.$notify.error(e.message);
        }
        this.$refs.uploadRef.clearFiles();
        this.uploadLoading = false;
        this.dialogLoading = false;
      },
      handlePageChange({ currentPage, pageSize }) {
        this.pageConfig.currentPage = currentPage
        this.pageConfig.pageSize = pageSize
        this.getData()
      },
      onExceed(files, fileList) {
        this.$notify.warning(`限制选择 ${this.limit} 个文件`)
      },
      seqMethod ({ rowIndex }) {
        return `${rowIndex+1}`
      },
      beforeUpload(file){
        this.dialogLoading = true; 
      },
       hasPermission() {
          //超级管理员不给看操作列
          if (this.$store.getters.userInfo.isSuperUser) { 
            return false;
          }
          if(this.userOrg.nodeLevel == 2){
            return true;
          }         
          return false;
       },
       async getCurUserOrg() {
        let {data} = await TiUserApi.getCurUserOrg();
        this.userOrg = data; 
        this.queryParams.roadId = this.userOrg.roadId;
      },
    }
  }
</script>

<style scoped>

</style>
