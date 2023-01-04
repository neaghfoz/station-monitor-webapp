<template>
  <el-dialog
    title="稽核证据"
    :params="params"
    :initFlag = "initFlag"
    :visible.sync="dialogVisible"
    :uploadFlag="uploadFlag"
    :modal-append-to-body='false'
    append-to-body
    width="70%">
    <el-form ref="evidenceSearchForm" :inline="true" :model="evidenceParams">
      <el-form-item label="文件名" :label-width="'120px'">
        <el-input style="width: auto" v-model="evidenceParams.fileName"
                  placeholder="请输入文件名"></el-input>
      </el-form-item>
      <el-form-item label="上传时间" :label-width="'120px'">
        <ti-date-range ref="dateRang" format="yyyy-MM-dd HH:mm:ss"
                       value-format="yyyy-MM-dd HH:mm:ss" date-type="datetimerange"
                       v-model="evidenceParams" begin-key="beginDate"
                       end-key="endDate"/>
      </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <!--          <ti-evidence-upload/>-->
      </el-form-item>
    </el-form>
    <vxe-grid
      ref="evidence"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      highlight-current-row
      max-height="1000"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      :toolbar="tableToolbar"
      @page-change="handlePageChange">
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
      >

      <template v-slot:operation="{ row }">
        <el-button type="warning" :loading="downLoading" @click="downLoad(row)">下载</el-button>
        <el-button type="warning" :style="{ display: uploadFlag ? '':'none' }" :loading="deleteLoading" @click="deleteFile(row)">删除</el-button>
      </template>

      <template v-slot:toolbar_buttons>
        <!--          <el-button style="float: right" @click="uploadEvidence">添加证据文件</el-button>-->
        <ti-evidence-upload  v-show="uploadFlag" ref="evidenceUpload" :serial-no="params.serialNo" @refreshDataList="refreshData"/>
      </template>



    </vxe-grid>
    <div slot="footer" class="dialog-footer" >
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import TiEvidenceUpload from "@/views/pro/audit/comm/evidence/tiEvidenceUpload";
  import {findPage,deleteFile} from "@/views/pro/audit/comm/evidence/tiEvidenceApi";
  import {download} from "ecip-web/utils"
  import moment from "moment";

  export default {
    name: "tiEvidence",
    components: {TiEvidenceUpload, TiDateRange},
    props: {
      value: {
        type: [String, Number, Object]
      },
      params: {
        type: [Object]
      },
      initFlag:{
        type: Boolean,
        default: false,
        required: false
      },
      uploadFlag: {
          type: Boolean,
          default: false,
          required: false
        }
    },
    data() {
      return {
        downLoading:false,
        deleteLoading:false,
        evidenceResult:{},
        evidenceParams: {
          serialNo: '',
          transTime: '',
          fileName: '',
          beginDate: moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00',
          endDate: moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
        },
        dialogVisible: false,
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'audit.comm.evidence-toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
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
        selections: [],
        tableData: [],
        columns: [
          {
            field: "fileName",
            title: "文件名",
            align: "center",
            showOverflow: true
          }, {
            field: "uploadUserId",
            align: "center",
            title: "上传用户Id",
            showOverflow: true
          }, {
            field: "uploadUserName",
            align: "center",
            title: "上传用户名称",
            showOverflow: true
          }, {
            field: "createTime",
            title: "上传时间",
            align: "center",
            showOverflow: true
          }, {
            field: "remark",
            title: "证据说明",
            align: "center",
            showOverflow: true
          }, {
            title: "操作",
            align: "center",
            fixed: "right",
            slots: {default: 'operation'},
            width: 200
          }
        ],

      };
    },
    watch: {
      dialogVisible(v) {
        if (v) {
          if(!this.initFlag){
            this.init();
          }
        }
      }
    },
    methods: {
      init() {
        this.evidenceParams.fileName= ''
        this.evidenceParams.beginDate= moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00'
        this.evidenceParams.endDate= moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
        this.$nextTick(async () => {
          this.evidenceParams.serialNo = this.params.serialNo;
          this.getData();
        });
      },
      initParams(params){
        this.evidenceParams.serialNo = params.serialNo;
        this.evidenceParams.fileName= ''
        this.evidenceParams.beginDate= moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00'
        this.evidenceParams.endDate= moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
        this.$nextTick(async () => {
          this.getData();
        });
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      submit(){
        // Object.assign(this.$data.page, this.$options.data().page);
        this.$data.page.currentPage=1
        this.getData()
      },
      async getData() {
        this.loading = true;
        const {data} = await findPage(
          Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
          this.evidenceParams);
        this.tableData = data.records
        this.page.total = data.total
        this.loading = false
      },
      refreshData()
      {
        Object.assign(this.$data.page, this.$options.data().page);
         this.getData();
         this.evidenceResult = this.$refs.evidenceUpload.evidenceResult;
         this.$emit('evidenceFileInfo');
         console.log("evidenceResult",this.evidenceResult);
      },
      async downLoad(row)
      {
        this.downLoading = true;
        console.log("row:",row);

        await download({url:'api/v1/audit/comm/evidence/downLoad',method:'post',data:row})
        this.downLoading = false;
      },
      async deleteFile(row)
      {
        this.deleteLoading = true;
        console.log("row:",row);
        let respone = {};
        await deleteFile({},row).then(res =>{
          respone = res;
          this.getData();
        });

        if(respone.success) {
          this.$notify.success('删除成功!');
        }else
        {
          this.$notify.error(respone.message);
        }
        this.deleteLoading = false;
      }
    }
  }
</script>

<style scoped>

</style>
