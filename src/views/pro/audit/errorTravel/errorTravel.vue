<template>
  <div class="app-container">
    <el-form ref="appForm" :model="mainParams" :rules="rules"  inline :label-width="'110px'">
        <el-form-item label="车牌号" prop="vehiclePlate">
          <el-input v-model="mainParams.vehiclePlate" type="text" placeholder="车牌号" maxlength="7" style="width: 199px"></el-input>
        </el-form-item>
      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
      <keep-alive>
      <el-tabs v-model="tabActiveName" type="card"  @tab-click="handleClick">
        <el-tab-pane  v-for="item in tabArr" :key="item.escapeType" :label="item.escapeName" :name="item.escapeType">

          <detail  :escapeType="item.escapeType" :vehiclePlate="item.vehiclePlate" :reSearch="item.reSearch" ></detail>

        </el-tab-pane>
      </el-tabs>
      </keep-alive>
    </el-form>



  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import moment from 'moment'

  import detail from './components/errorTravelDetail'


  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel";
  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";


  import { findEscapeTypeList} from "@/views/pro/audit/errorTravel/errorTravel";
  import {getData} from "@/views/pro/common/tiElement/tiSelect/tiSelectApi";

  export default {
    name: 'audit.errorTravel.errorTravelView',
    components: { TiExportExcel, TiSelectTree, TiSelect, TiDateRange, tiSysOrg,detail},
    mixins: [...mixin],
    data() {
      return {
        tabArr:[
          // {escapeName: '屏蔽标签',
          //   escapeType: '1' ,
          //   reSearch: true},
          // {escapeName: '一车多卡（签）',
          //   escapeType: '2'},
          // {escapeName: '大车小标',
          //   escapeType: '3'},
          // {escapeName: '一车多车型',
          //   escapeType: '4'},
        ],
        tabActiveName:'1',
        mainParams:{
          vehiclePlate:null,
        },
        mainLoading: false,
        queryParams: {
          activeName:'1',
          version:'',
          enProv:'',
          enId:'',
          exId:'',
          exProv: '44',
          vehType:'',
          sysOrgIdStr: '',
          laneNoStr: '',
          entryExitType: '',
          laneTypeStr: '',
          beginHandleTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          endHandleTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          vehicleTypeStr: '',
          vehicleClassStr: ''
        },
        loading: false,
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        tableData: [],
        columns: [{
          title: '入口站名',
          field: 'enStationName',
          align:'left',
          minWidth:160
        },{
          title: '出口站名',
          field: 'exStationName',
          align:'left',
          minWidth:160
        },{
          title: '车型',
          field: 'vehTypeName',
          align:'center',
          minWidth:100,
        },{
          title: '里程(公里)',
          field: 'mileText',
          align:'right',
          minWidth:100
        },{
          title: '金额(元)',
          field: 'feeText',
          align:'right',
          minWidth:100
        },{
          title: '95折金额(元)',
          field: 'fee95Text',
          align:'right',
          minWidth:100
        },{
          title: '收费明细',
          field: 'smallestMoneyDetailStr',
          align:'center',
          minWidth:120,
          showOverflow: true

        },{
          title: '费率版本',
          field: 'version',
          align:'center',
          minWidth:120
        },
        {
          title: '操作',
          minWidth: 100,
          fixed: 'right',
          align: 'center',
          slots: {default: 'operation'}
          }

        ]
      }
    },
    // watch: {
    //   //机构开启默认值，第一次进入页面，得用监听刷新，不能用create,用create获取不到值。
    //   'queryParams.sysOrgIdStr'(newVal,oldVal) {
    //     if (!this.queryParams.firstFlag){
    //       this.getData();
    //       this.queryParams.firstFlag = true;
    //     }
    //   }
    // },
    created() {

      this.init();
      //console.log("errorTravel create");
    },
    methods: {
      submit(){

        this.getData()

        // if (this.tabArr.length >=1 ){
        //   this.tabActiveName = this.tabArr[0].escapeType;
        //   this.tabArr[0].reSearch = false ;
        //   this.tabArr[0].reSearch = true ;
        // }
      },
      async init(){
        let data = [];
        //获取字典
        data=  await this.$dictUtils.getDictList("tibms_audit_escapeType");
        this.tabArr = [];
        for (var item  of data ){
          this.tabArr.push(Object.assign({}, {escapeName: item.label, escapeType: item.value , reSearch: false}));
        }
        if (this.tabArr.length>0) {
          this.tabArr[0].reSearch =true;
        }
        this.tabActiveName = this.tabArr[0].escapeType;
        //console.log("data",data)

      }
      ,
      async getData() {
        // 每次查询初始化checkbox selections
        this.selections = []
        if(this.mainParams.vehiclePlate.length <7) {
          //this.mainParams.vehiclePlate ='aa';
          alert("请输入正确车牌。");
          return ;
        }

        this.mainLoading = true
        const {data} = await findEscapeTypeList(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.mainParams)
        this.tabArr = data;



        if (data.length >=1 ){
          this.tabArr = data;
          this.tabActiveName = this.tabArr[0].escapeType;
          //this.tabArr[0].reSearch = false ;
          //this.tabArr[0].reSearch = true ;
        } else {
          // this.tabArr = [
          //   {escapeName: '屏蔽标签',
          //     escapeType: '1' ,
          //     reSearch: true},
          //   {escapeName: '一车多卡（签）',
          //     escapeType: '2'},
          //   {escapeName: '大车小标',
          //     escapeType: '3'},
          //   {escapeName: '一车多车型',
          //     escapeType: '4'},
          // ];

          this.init();

        }
        //this.page.total = data.total
        this.mainLoading = false
        //保存导出的查询条件
        //this.exportExcel.queryParams = this.queryParams;
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.appForm.resetFields();
      },handleClick(tab, event) {
        var index = tab.index;
        // index --;
        // console.log("index:",index);
        this.tabArr[index].reSearch = true;
      }
    }
  }
</script>
<style scoped>
  /*.el-form-item /deep/ .el-form-item__content {*/
    /*width: 60% !important;*/
  /*}*/
</style>
