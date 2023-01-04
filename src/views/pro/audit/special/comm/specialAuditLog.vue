<template>
  <div>
  <vxe-virtual-tree
    ref="logVxe"
    highlight-hover-row
    border 
    resizable
    sync-resize
    auto-resize
    class="vxe-table-element"
    max-height="1000"
    :loading="loading"
    :columns="columns"
    :start-index="(page.currentPage - 1) * page.pageSize"
    :pager-config="page"
    :data="tableData"
    @page-change="handlePageChange"
  >
    <template v-slot:operation="{ row }">
      <el-button type="primary" @click="evidence(row)">查看</el-button>
    </template>

  </vxe-virtual-tree>
   <ti-evidence ref="evidence"  :params="evidenceParams"></ti-evidence>
  </div>
</template> 

<script>
  import {findPage} from "@/views/pro/audit/special/comm/specialAuditLogApi";
  import TiEvidence from "@/views/pro/audit/comm/evidence/tiEvidence"

  export default {
    name: 'specialAuditLog',
    props: {
      id: {
        type: String,
        required: true
      },
      initParam:{
        type: Object,
        required: true
      },
      isBreakPass:{
        type:Boolean,
        required:false,
        default:false
      },
      url: {
        type: String,
        required: true
      },
      columns: {
        type: Array,
        required: true
      }
    },
    components: {TiEvidence},
    data() {
      return {
        evidenceParams:{
          id:this.id
        },
        expand: false,
        loading: false,
        tableData: [],
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
        // columns: [
        //   {
        //     field: "auditAuthStr",
        //     title: "稽核权限",
        //     width: 100,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditTime",
        //     title: "稽核时间",
        //     width: 150,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditUserRealName",
        //     title: "稽核员",
        //     width: 100,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditUserOrg",
        //     title: "直属组织机构",
        //     width: 150,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditOrgLevel",
        //     title: "稽核员等级",
        //     width: 100,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditVehicleClassStr",
        //     title: "稽核车种",
        //     width: 150,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditVehicleTypeStr",
        //     title: "稽核车型",
        //     width: 100,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditVehiclePlate",
        //     title: "稽核车牌",
        //     width: 180,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditStatusStr",
        //     title: "稽核结论",
        //     width: 100,
        //     showOverflow: true
        //   },
        //   {
        //     field: "auditDescription",
        //     title: "稽核说明",
        //     width: 150,
        //     showOverflow: true
        //   },
        //   {
        //     field: "evidenceName",
        //     title: "证据文件",
        //     width: 150,
        //     fixed: 'right',
        //     align: 'center',
        //     slots: {default: 'operation'}
        //   }
        // ]
      }
    },
    watch: {
      id: {
        handler(val) {
          if (val) {
            this.id = val;
            this.getData();
          }
        },
        immediate: true
      }
    },
    methods: {
      async getData() { 
        var queryParams = {
          "id":this.initParam.id,
          "tollLaneId":this.initParam.exTollLaneId,
          "handleTime":this.initParam.exTime,
          "vehiclePlate":this.initParam.exVehiclePlate,
          "vehiclePlateColor":this.initParam.exVehiclePlateColor,
        }
        const {data} = await findPage(
          Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}),
          queryParams, this.url)
        this.tableData = data.records
        this.page.total = data.total
        this.loading = false
        this.$emit('pageChang', this.page)
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData();
      },
      evidence(row){ 
        this.$refs.evidence.dialogVisible = true;
        if(this.isBreakPass){
          row.serialNo = this.initParam.exTollLaneId + this.initParam.exTime;
        }else{
          row.serialNo = this.initParam.id;
        }
        this.$refs.evidence.init(row);
      }
    }
  }
</script>

<style scoped>

</style>
