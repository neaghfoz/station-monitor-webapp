<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">

        <el-form-item label="机构" prop="sysOrgIdStr">
          <ti-sys-org ref="sysOrg" v-model="queryParams.sysOrgIdStr" show-level="2" multiple default-first-value/>
        </el-form-item>

        <el-form-item label="数据表名称" prop="tableIdStr">
          <ti-select v-model="queryParams.tableIdStr" url="api/v1/collect/collectTableInfo/findList" :params="{collectType:queryParams.collectType}"
                     :props="{key:'id',value:'id',label:'tableName'}" multiple/>
        </el-form-item>

        <el-form-item label="填报月份">
          <ti-date-range
            v-model="queryParams"
            date-type="monthrange"
            begin-key="startDate"
            end-key="endDate"
            format="yyyy-MM"
            :clearable="true"
            start-placeholder="起始月份"
            end-placeholder="结束月份"
          />
        </el-form-item>

        <el-form-item v-show="statusDictTypeV == 'province'" label="状态" prop="statusStr">
          <ti-select  v-model="queryParams.statusStr" dict-type="tibms_cy_collect_provice_status"  :clearable="false" multiple/>
        </el-form-item>
        <el-form-item v-show="statusDictTypeV == 'road'" label="状态" prop="statusStr">
          <ti-select v-model="queryParams.statusStr" dict-type="tibms_cy_collect_road_status"  :clearable="false" multiple/>
        </el-form-item>

        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>

      </el-form>
    </div>

    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      resizable
      sync-resize
      :auto-resize="true"
      max-height="1000"
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
      </template>

      <template v-slot:operation="{ row }">
        <el-button v-permission="['collectStatus:detail']" type="primary" v-show="hasPermission(row,'detail')" @click="detail(row)">查看</el-button>
        <el-button v-permission="['collectStatus:add']" type="primary" v-show="hasPermission(row,'add')" @click="add(row)">去填报</el-button>
        <el-button v-permission="['collectStatus:edit']" type="primary" v-show="hasPermission(row,'edit')" @click="edit(row)">编辑</el-button>
        <el-button v-permission="['collectStatus:apply']" type="primary" v-show="hasPermission(row,'apply')" @click="apply(row)">申请修改</el-button>
        <el-button v-permission="['collectStatus:auth']" type="primary" v-show="hasPermission(row,'auth')" @click="showAuth(row)">授权修改</el-button>
        <el-button v-permission="['collectStatus:commit']" type="primary" v-show="hasPermission(row,'commit')" @click="commit(row)">提交</el-button>
        <el-button v-permission="['collectStatus:roadAuth']" type="primary" v-show="hasPermission(row,'roadAuth')" @click="showRoadApply(row)">允许提交</el-button>
      </template>
    </vxe-grid>


    <el-dialog title="提示" :visible.sync="roadAuthVisible" @closed="roadAuthVisible=false" width="20%">
      <div>
        <h3>请选择“通过”或者“回退”。</h3>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="roadAuth()">通过</el-button>
        <el-button type="warning" @click="roadSendBack()">回退</el-button>
        <el-button @click="roadAuthVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="authVisible" @closed="authVisible=false" width="20%">
      <div>
        <h3>请选择“通过”或者“回退”。</h3>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="auth()">通过</el-button>
        <el-button type="warning" @click="sendBack()">回退</el-button>
        <el-button @click="authVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="新增修改申请"
      :visible.sync="applyVisible"
      width="50%"
      :rules="rules"
      :before-close="handleClose">
      <el-form ref="applyForm" :rules="applyRules" :model="applyForm" label-width="100px">
        <el-form-item label="数据表名称">
          <el-input v-model="applyForm.tableName" disabled></el-input>
        </el-form-item>
        <el-form-item label="填报日期">
          <el-input v-model="applyForm.collectDate" disabled></el-input>
        </el-form-item>
        <el-form-item label="路段">
          <el-input v-model="applyForm.roadName" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人"  prop="applyName">
          <el-input v-model="applyForm.applyName"></el-input>
        </el-form-item>
        <el-form-item label="修改原因" prop="reason">
          <el-input type="textarea" v-model="applyForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyVisible = false">取 消</el-button>
        <el-button type="primary" @click="applyApi()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import api from "./collectStatusApi"
  import TiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi"
  import moment from "moment"
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
  import CollectConstant from "./collectConstant";
  import SysOrgConstant from "@/views/pro/common/constant/sysOrgConstant"

  export default {
    name: 'cy.collect.collectStatus.month',
    mixins: [...mixin],
    components: {TiSelect, TiDateRange, tiSysOrg},
    data() {
      return {
        queryParams: {
          sysOrgIdStr: '',
          tableIdStr: '',
          statusStr: '',
          startDate: moment(new Date()).add(0, 'month').format('YYYY-MM'),
          endDate: moment(new Date()).add(0, 'month').format('YYYY-MM'),
          collectType: CollectConstant.type.month
        },
        constant: {
          collect: CollectConstant,
          sysOrg: SysOrgConstant
        },
        userOrg: {},
        statusDictType:"tibms_cy_collect_road_status",
        statusDictTypeV:"province",
        /*opButton: {
          detail: false,
          add: false,
          edit: false,
          apply: false,
          auth: false,
        },*/
        showSearch: false,
        tempRow: {},
        authVisible: false,
        roadAuthVisible:false,
         applyVisible:false,
        loading: false,
        tableToolbar: {
          id: 'search.list.laneEnList.laneEnListView-toolbar',
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
        columns: [
          /*{type: 'checkbox', width: 40, fixed: 'left', align: 'center'},*/
          {type: 'seq', title: '序号'},
          {title: '路段名称', field: 'roadText', minWidth: 120, showOverflow: true},
          {title: '数据表名称', field: 'tableName', minWidth: 150, showOverflow: true},
          {title: '填报月份', field: 'collectMonth', minWidth: 100, showOverflow: true},
          {title: '状态', field: 'statusText', minWidth: 110, showOverflow: true},
          {title: '操作者', field: 'operatorText', minWidth: 100, showOverflow: true},
          {title: '操作时间', field: 'updateTime', minWidth: 200, showOverflow: true},
          {title: '操作', minWidth: 200, maxWith: 400, fixed: 'right', align: 'center', slots: {default: 'operation'}}
        ],
        applyForm:{
          roadId:'',
          roadName:'',
          tableName:'',
          tableId:'',
          collectDate:'',
          applyName:'',
          reason:'',
        },
         applyRules: {
          tableName: [
            { required: true, message: '请输入表名', trigger: 'blur' }
          ],
          roadName: [
            { required: true, message: '请输入路段名', trigger: 'blur' }
          ],
          collectDate: [
            { required: true, message: '请输入采集日期', trigger: 'blur' }
          ],
          applyName: [
            { required: true, message: '申请人不能为空', trigger: 'blur' },
            { max: 10, message: '长度不能超过10个中文', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '申请原因不能为空', trigger: 'blur' },
            { max: 500, message: '原因不能超过500个汉字', trigger: 'blur' }
          ] 
        }
      }
    },
    watch: {
      //机构开启默认值，第一次进入页面，得用监听刷新，不能用create,用create获取不到值。
      // 'queryParams.sysOrgIdStr'(newVal, oldVal) {
      //   if (!this.queryParams.firstFlag) {
      //     this.getCurUserOrg();
      //     this.getData();
      //     this.queryParams.firstFlag = true;
      //   }
      // }
    },
    created() {
      this.getCurUserOrg();
      this.getData();
      this.queryParams.firstFlag = true;
    },
    methods: {
      hasPermission(row, opType) {
        //超级管理员不给看操作列
        if (this.$store.getters.userInfo.isSuperUser) {
          console.log('注意，超级管理员没有操作列!');
          return false;
        }

        let flag = false;
        let userOrgLevel = this.userOrg.nodeLevel;
        let province = this.constant.sysOrg.NodeLevel.province; 
        let status = this.constant.collect.status;
        let rowStatus = row.status;
        switch (opType) {
          case 'detail':
            flag = (userOrgLevel == province && (rowStatus == status.submit || rowStatus == status.sendBack || rowStatus == status.check)) || (userOrgLevel != province && rowStatus != status.notFillIn);
            break;
          case 'add':
            flag = userOrgLevel != province && rowStatus == status.notFillIn;
            break;
          case 'edit':
            flag = userOrgLevel != province && (rowStatus == status.edit || rowStatus == status.save || rowStatus == status.submitSendBack);
            break;
          case 'apply':
            flag = userOrgLevel != province && (rowStatus == status.submit || rowStatus == status.sendBack);
            break;
          case 'auth':
            flag = userOrgLevel == province && rowStatus == status.check;
            break;
          case 'roadAuth':
            flag = userOrgLevel != province && rowStatus == status.submitAudit;
            break;
          default :
            flag = false;
        }
        return flag;
      },
      submit() {
        Object.assign(this.$data.page, this.$options.data().page);
        this.getData();
      },
      async getCurUserOrg() {
        let {data} = await TiUserApi.getCurUserOrg();
        this.userOrg = data; 
        this.queryParams.sysOrgIdStr = data.id;
        this.statusDictType = (this.userOrg.nodeLevel == this.constant.sysOrg.NodeLevel.province) ? 'tibms_cy_collect_provice_status':'tibms_cy_collect_road_status';
        this.statusDictTypeV = (this.userOrg.nodeLevel == this.constant.sysOrg.NodeLevel.province)? 'province':'road';
      },
      async getData() {
        this.loading = true

        //设置查询条件
        if (this.userOrg) {
          this.queryParams.nodeLevel = this.userOrg.nodeLevel; 
          if(this.queryParams.startDate!=null && this.queryParams.startDate!=''){
            this.queryParams.startDate = this.queryParams.startDate.substring(0,7) + '-01';
          }
          if(this.queryParams.endDate!=null && this.queryParams.endDate!=''){
            this.queryParams.endDate = this.queryParams.endDate.substring(0,7) + '-01';
          }
        }

        // 每次查询初始化checkbox selections
        this.selections = []
        const {data} = await api.findPage(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.tableData = data.records
        this.page.total = data.total
        this.page.realTotal = data.realTotal;

        this.loading = false
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr = this.$refs.sysOrg.getDefaultFirstValue();
      },
      /*change(param1, param2) {
        this.queryParams.sysOrg = param2;
      },*/
      add(row) {
        this.$router.push({
          path: '/collectStatus/add/' + Date.parse(new Date()),
          query: {
            roadId: row.roadId,
            collectDate: row.collectDate,
            tableId: row.tableId,
            tableName: row.tableName,
            roadName: row.roadName,
            type: this.constant.collect.opType.edit,
            status: row.status,
            nodeLevel: this.userOrg.nodeLevel
          }
        });
      },
      edit(row) {
        this.$router.push({
          path: '/collectStatus/edit/' + Date.parse(new Date()),
          query: {
            roadId: row.roadId,
            collectDate: row.collectDate,
            tableId: row.tableId,
            tableName: row.tableName,
            roadName: row.roadName,
            type: this.constant.collect.opType.edit,
            status: row.status,
            nodeLevel: this.userOrg.nodeLevel
          }
        });
      },
      detail(row) {
        this.$router.push({
          path: '/collectStatus/detail/' + Date.parse(new Date()),
          query: {
            roadId: row.roadId,
            collectDate: row.collectDate,
            tableId: row.tableId,
            tableName: row.tableName,
            roadName: row.roadName,
            type: this.constant.collect.opType.view,
            status: row.status,
            nodeLevel: this.userOrg.nodeLevel
          }
        });
      },
      apply(row) { 
        this.applyForm.roadId = row.roadId;
        this.applyForm.roadName = row.roadName;
        this.applyForm.tableId = row.tableId;
        this.applyForm.collectDate = row.collectDate;
        this.applyForm.tableName = row.tableName;
        this.applyForm.applyName = this.$store.getters.userInfo.realName;
        this.applyVisible = true;
      },

      applyApi(){
        this.$refs['applyForm'].validate((valid) => {
          if (valid) {
              api.apply({}, this.applyForm).then(res => {
                if (res.code === 200) {
                  this.$message.success('申请成功！');
                  this.applyVisible = false;
                  this.getData();
                } else {
                  this.$message.error(res.message);
                }
              });
            } else {
            // this.$notify.error("请按规则填写")
            return false;
          }
        });
      },
      showAuth(row) {
        this.authVisible = true;
        this.tempRow = row;
      },
      showRoadApply(row) {
        this.roadAuthVisible = true;
        this.tempRow = row;
      },
      auth() {
        let param = {
          roadId: this.tempRow.roadId,
          tableId: this.tempRow.tableId,
          collectDate: this.tempRow.collectDate
        };
        console.log('auth')
        api.auth({}, param).then(res => {
          if (res.code === 200) {
            this.$message.success('成功授权！');
            this.getData();
          } else {
            this.$message.error(res.message);
          }
          this.authVisible = false;
        }); 
      },
      sendBack() {
        let param = {
          roadId: this.tempRow.roadId,
          tableId: this.tempRow.tableId,
          collectDate: this.tempRow.collectDate
        };
        console.log('sendBack')
        api.sendBack({}, param).then(res => {
          if (res.code === 200) {
            this.$message.success('成功退回！');
            this.getData();
             this.authVisible = false;
          } else {
            this.$message.error(res.message);
          }
        });
      },
      roadAuth() {
        let param = {
          roadId: this.tempRow.roadId,
          tableId: this.tempRow.tableId,
          collectDate: this.tempRow.collectDate
        };
        console.log('roadAuth')
        api.roadAuth({}, param).then(res => {
          if (res.code === 200) {
            this.$message.success('成功授权！');
            this.getData();
            this.roadAuthVisible = false;
          } else {
            this.$message.error(res.message);
          }
        });
      },
      roadSendBack() {
        let param = {
          roadId: this.tempRow.roadId,
          tableId: this.tempRow.tableId,
          collectDate: this.tempRow.collectDate
        };
        console.log('roadSendBack')
        api.roadSendBack({}, param).then(res => {
          if (res.code === 200) {
            this.$message.success('成功退回！');
            this.roadAuthVisible = false;
            this.getData();
          } else {
            this.$message.error(res.message);
          }
        });
      },
    }
  }
</script>
<style scoped lang="scss">

</style>
