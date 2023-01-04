<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="当前位置" prop="unitLocationStr">
            <ti-select v-model="queryParams.unitLocationStr" dict-type="tibms_toll_CardUnitLocation" multiple/>
          </el-form-item>
          <el-form-item label="机构" prop="sysOrgIdStr">
            <ti-sys-org  ref="sysOrg" v-model="queryParams.sysOrgIdStr" default-first-value />
          </el-form-item>
          <el-form-item label="卡单元编号" prop="unitStr">
            <ti-select v-model="queryParams.unitStr" url="/api/v1/toll/cardUnit/cardUnits" :props="{key:'unitNo',value:'unitNo',label:'unitNo'}" multiple/>
          </el-form-item>
          <el-form-item label="卡单元类型" prop="unitTypeStr">
            <ti-select v-model="queryParams.unitTypeStr" dict-type="tibms_toll_cardUnitType" multiple/>
          </el-form-item>
          <el-form-item label="状态" prop="unitStatusStr">
            <ti-select v-model="queryParams.unitStatusStr" dict-type="tibms_toll_CardUnitStatus" multiple/>
          </el-form-item>
          <el-form-item label="通行卡卡号" prop="passCardNo">
            <el-input v-model="queryParams.passCardNo" maxlength="18" style="width: 199px" />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['cardUnit:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
	<el-card shadow="never" :max-height="this.tableHeight">

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
	      @checkbox-all="({ selection }) => { selections = selection }"
	      @checkbox-change="({ selection }) => { selections = selection }"
	    >

        <template v-slot:toolbar_buttons>
          <el-button type="primary" v-permission="['cardUnit:create']" @click="add()">卡单元录入</el-button>
          <el-button type="danger" v-permission="['cardUnit:delete']" @click="del()">删除</el-button>
          <el-button type="info" v-permission="['cardUnit:excel']" @click="exportExcel.dialog = true">导出</el-button>
          <el-button type="primary" @click="searchInStore()">库存情况</el-button>
        </template>

        <template v-slot:operation="{ row }">
          <el-button v-permission="['cardUnit:edit']" v-if="row.used == 0" type="warning" @click="edit(row)">修改</el-button>
          <el-button v-permission="['cardUnit:clear']" v-if="row.cardCount != 0 && row.used == 0" type="danger" @click="clear(row)">清空</el-button>
          <el-button v-permission="['cardUnit:detail']" v-if="row.cardCount != 0" type="warning" @click="detail(row.unitNo)">详情</el-button>
        </template>
	    </vxe-grid>
	  </div>
	</el-card>

    <edit-card-unit ref="editCardUnitDialog" @refreshData="submit" />
    <add-card-unit ref="addCardUnitDialog" @refreshData="submit" />
    <search-in-store ref="searchInStoreDialog" @refreshData="submit" />
    <ti-export-excel :exportExcel="exportExcel" :page="tableData.page"></ti-export-excel>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';
  import { findPage, checkIsUsed, deleteByIds, clear } from './cardUnitApi'

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import addCardUnit from './components/addCardUnit.vue';
  import editCardUnit from './components/editCardUnit.vue';
  import searchInStore from './components/searchInStore.vue';
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";

  export default {
    name: 'cardUnitListView',
    components: { TiSelectTree, TiSelect, tiSysOrg, addCardUnit, editCardUnit, searchInStore, TiExportExcel },
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        showSearchForm: true,
        stationFlag: true,
        queryParams: {
        },
        exportExcel: {
          url: 'api/v1/toll/cardUnit/export',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        },
        tableData: {
          loading: false,
          columnsDataList: [],
          tableColumns: [
            { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
			      { title: '卡单元编号', field: 'unitNo', minWidth: 100, showOverflow: true, align: 'center' },
            { title: '卡单元类型', field: 'unitTypeText', minWidth: 100, showOverflow: true, align: 'center' },
            { title: '卡数量', field: 'cardCount', minWidth: 80, showOverflow: true , align: 'center' },
            { title: '当前位置', field: 'locationNoText', minWidth: 120, showOverflow: true, align: 'center'  },
            { title: '所在机构', field: 'orgNameText', minWidth: 120, showOverflow: true, align: 'center'  },
            // { title: '车道', field: 'laneNo', minWidth: 60, showOverflow: true, align: 'center'  },
            { title: '状态', field: 'usedText', minWidth: 100, showOverflow: true, align: 'center'  },
            { title: '经办人', field: 'handlerText', minWidth: 160, showOverflow: true, align: 'center'  },
            { title: '操作人', field: 'userText', minWidth: 160, showOverflow: true, align: 'center'  },
            { title: '最近操作时间', field: 'opTime', minWidth: 160, showOverflow: true, align: 'center'  },
            { title: '操作', align: 'center', minWidth: 210, slots: { default: 'operation' }, fixed: 'right'}
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
          slots: {
            buttons: 'toolbar_buttons'
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        tableHeight: null,
        selections: []
      }
    },
    watch: {
      deptFilterText(val) {
        this.$refs.paramTree.filter(val)
      }
    },
    mounted() {
    },
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        this.getData()
      },
      submit() {
        this.tableData.page.currentPage = 1
        this.getData()
      },
      async getData() {
		 // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
        this.tableData.loading = true
        findPage(Object.assign({}, { size: this.tableData.page.pageSize, current: this.tableData.page.currentPage }), this.queryParams).then(res => {
          this.tableData.columnsDataList = res.data.records
          this.tableData.page.total = res.data.total
          this.tableData.loading = false

          //保存导出的查询条件
          this.exportExcel.queryParams = this.queryParams;
        })
      },
      handlePageChange({ currentPage, pageSize }) {
        this.tableData.page.currentPage = currentPage
        this.tableData.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields()
      },

      async add() {
        this.$refs.addCardUnitDialog.init(this.queryParams.tenantId, this.queryParams.appId);
       /* this.$router.push({
          path: '/toll/card/cardManage/cardUnit/create'
        });*/
      },
      async detail(unitNo) {
        let timestamp = Date.parse(new Date());
        this.$router.push({
          path: '/toll/card/cardManage/cardUnit/detail/'+timestamp,
          query: {
            unitNo: unitNo
          }
        });
      },
      async edit(row) {
        let res = await checkIsUsed(row.unitNo, 1);
        if(res.data.flag){
          var msg = "卡单元编号为" + row.unitNo + "的卡单元已被使用，不允许修改";
          this.$notify.warning(msg);

        }else{
          this.$refs.editCardUnitDialog.init('edit', this.queryParams.tenantId, this.queryParams.appId, row);
        }
      },
      async del(){
        if (this.selections.length == 0) {
          this.$notify.warning("至少选择一条记录!");
          return;
        }

        let cardUnits = this.selections.map((x) => x.unitNo).join(",");
        this.$confirm('确定删除卡单元？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteByIds(cardUnits).then((res) => {
            if(res.data.flag){
              this.$alert(res.data.msg);
              this.getData()
            }else{
              this.$alert(res.data.msg);
            }

          })
        })
      },
      async clear(row){
        var msg = "确定清空卡单元：" + row.unitNo + "[所在机构：" + row.orgNameText + "，卡数：" + row.cardCount + "]吗？";
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          clear(row.unitNo).then((res) => {
            this.$notify.success(res.data);
            this.getData();
          })
        })
      },
      async searchInStore(){
        this.$refs.searchInStoreDialog.init('edit', this.queryParams.tenantId, this.queryParams.appId, this.queryParams, this.tableData.page.total);
      }
    }
  }
</script>

<style scoped>

</style>
