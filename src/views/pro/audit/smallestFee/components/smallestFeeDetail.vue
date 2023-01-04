<template>
  <div class="app-container">
    <el-form ref="appForm" :model="queryParams" :rules="rules"  inline :label-width="'110px'">

      <el-form-item  label="省份" prop="prov">
        <ti-select :clearable="true" style="width: 200px" v-model="queryParams.prov"
                   dict-type="tibms_com_province"/>
      </el-form-item>

      <el-form-item label="路段" prop="road" ref="road">
        <ti-select style="width: 200px" v-model="queryParams.road"
                   url="/api/v1/common/road/findAllList" :props="{key:'roadId',value:'roadId',label:'roadName'}"
                   :watch-attr-fn="watchAttrFn" :watch-attr="queryParams.prov" :disabled="queryParams.roadIsAble"
                   :multiple="false" aria-placeholder="路段"/>
      </el-form-item>

      <el-form-item label="收费单元" prop="interval">
        <ti-select style="width: 200px" v-model="queryParams.interval" :clearable="true"
                   url="/api/v1/common/interval/findAllList" :props="{key:'intervalId',value:'intervalId',label:'intervalName'}"
                   :watch-attr-fn="watchAttrFnRoad" :watch-attr="queryParams.road"
                   :disabled="queryParams.intervalIsAble"
                   :multiple="false" aria-placeholder="收费单元"/>
      </el-form-item>


      <el-form-item class="searchItem" :label-width="'50px'">
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button type="primary"  v-permission="['smallestfee:exportDetailExcel']" @click="exportDetailExcel">导出</el-button>

        <el-button type="default" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-card :v-loading="loading" class="box-card">
      <div slot="header" class="clearfix"><span>收费数据明细</span></div>
      <el-row :gutter="5">
        <el-col :span="24">
          <div ref="baseInfoRow">
            <el-row :gutter="5">
              <el-col :span="24"><ti-detail-cell label="收费数据明细" :labelSpan="3" :value="detailItem.smallestMoneyDetailStr"/></el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <vxe-grid
      ref="smallestFeeDetailTable"
      highlight-hover-row
      border
      resizable
      sync-resize
      max-height="450"
      class="vxe-table-element"
      :auto-resize="true"
      :loading="loading"
      :start-index="(page.currentPage - 1) * page.pageSize"
      :pager-config="page"
      :columns="columns"
      :data="tableData"
      @page-change="handlePageChange"
      @checkbox-all="({ selection }) => { selections = selection }"
      @checkbox-change="({ selection }) => { selections = selection }"
    >


    </vxe-grid>


  </div>
</template>

<script>

  import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange";
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import moment from "moment";


  import request from "ecip-web/utils/request";



  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"



  export default {
    name: 'audit.smallestFee.smallestFeeDetail',
    components: { TiSelectTree, TiSelect, TiDateRange, tiSysOrg, TiDetailCell},
    data() {
      return {
        queryParams: {
          version:'',
          prov:'',
          road:'',
          interval:'',
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
          vehicleClassStr: '',
          roadIsAble: true,
          intervalIsAble: true
        },
        detailItem:{
          smallestMoneyDetailStr:''
        },
        rules: {
          version: [{  required: true, message: '请选择版本号' }],
          enProv: [{  required: true, message: '请选择入口省份' }],
          enId: [{  required: true, message: '请选择入口站'  }],
          exId: [{  required: true, message: '请选择出口站'}]
        },
        importVisible: false,
        showSearch: true,
        loading: false,
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selections: [],
        tableData: [],
        dataSource:[],
        columns: [
          { title: '序号',
            type: 'index',
            field: 'index',
            minWidth: 30,
            showOverflow: true,
            align: 'center'
          },{
            title: '类型',
            field: 'type',
            align:'left',
            minWidth:30
          },{
            title: '省份/路段',
            field: 'roadName',
            align:'left',
            minWidth:50
          },{
            title: '门架/收费站',
            field: 'stationName',
            align:'center',
            minWidth:400,
          },{
            title: '应收金额',
            field: 'payFeeText',
            align:'right',
            minWidth:30
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
      this.detail(this.$route.query.row);
    },
    methods: {
      submit(){
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            Object.assign(this.$data.page, this.$options.data().page);
            this.getData()
          } else {
            return false;
          }
        })


        //this.getData();
      },
      getData() {
        // 每次查询初始化checkbox selections


        this.loading = true
        let datas = [];
        if( this.queryParams.interval.length >1 ) {
          datas =this.filterInterval(this.queryParams.interval);
        }else if (this.queryParams.road.length >1){
          datas =this.filterRoad(this.queryParams.road);
        } else if(this.queryParams.prov.length >1){

          datas =this.filterProv(this.queryParams.prov);
        }else {
          datas = this.dataSource
        }
        this.tableData = datas;
        this.page.total = datas.length
        this.page.pageSize = datas.length
        this.loading = false


        //保存导出的查询条件
        //this.exportExcel.queryParams = this.queryParams;
      },
      filterInterval( value ){
        let datas=[];
        let dataSource = this.dataSource;
        for ( var i =0 ; i< dataSource.length; i ++){
          if (dataSource[i].intervalId == value) {
            datas.push(dataSource[i]);
          }
        }
        return datas;
      },
      filterRoad( value ){
        let datas=[];
        let dataSource = this.dataSource;
        for ( var i =0 ; i< dataSource.length; i ++){
          if (dataSource[i].roadId == value) {
            datas.push(dataSource[i]);
          }
        }
        return datas;
      },
      filterProv( value ){
        let datas=[];
        let dataSource = this.dataSource;
        for ( var i =0 ; i< dataSource.length; i ++){
          if (dataSource[i].province == value) {
            datas.push(dataSource[i]);
          }
        }

        return datas;
      },
      handlePageChange({currentPage, pageSize}) {
        this.page.currentPage = currentPage
        this.page.pageSize = pageSize
        this.getData()
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.queryParams.sysOrgIdStr=this.$refs.sysOrg.getDefaultFirstValue();
        //this.getData()
      },

      watchAttrFn(newVal, oldVal, selectData) {

        let selectDataShow = [];

        if (newVal == "44") {

          selectDataShow = selectData;
          this.queryParams.roadIsAble = false
        } else {

          this.queryParams.enId = '';
          this.queryParams.roadIsAble = true;
        }

        return selectDataShow;

      },
      watchAttrFnRoad(newVal, oldVal, selectData) {

        let selectDataShow = [];

        if (newVal != "" ) {

          selectDataShow = selectData;
          this.queryParams.intervalIsAble = false
        } else {

          this.queryParams.interval = '';
          this.queryParams.intervalIsAble = true;
        }

        return selectDataShow;

      },
      handleReset() {
        this.$refs.appForm.resetFields();
        this.queryParams.enProv = '44'
        //Object.assign(this.$data.page, this.$options.data().page)
        // this.getData()
      },detail(list){
        this.loading = true
        var arr = [];
        arr= list.splitProvinceVoList;
        this.detailItem.smallestMoneyDetailStr = list.smallestMoneyDetailStr;
        this.tableData = arr;
        this.dataSource = arr;
        //this.tableData = 1
        this.page.total = arr.length
        this.page.pageSize = arr.length
        this.page.pageSizes =   new Array(arr.length);
        this.loading = false
        //debugger;
      } ,exportDetailExcel () {
        var refTable = this.$refs.smallestFeeDetailTable;
        var fileName = "最小费率查询-详情"
        var tableData = this.tableData;

        //const {data} = await exportDetail(Object.assign({}, {size: this.page.pageSize, current: this.page.currentPage}), this.queryParams)
        this.exportDetail();
        //debugger;
        //exportExcel(refTable,fileName)
      }, async exportDetail(){
        if ( !this.tableData.length > 0) {
          const h = this.$createElement;
          this.$message({
            message: h('p', null, [
              h('span', null, '请选择数据再导出 '),
              h('i', { style: 'color: teal' }, )
            ]),
            duration: 1500
          });
          return ;
        }
        var tableData = { smallDetailList: this.tableData}
        var option = {url: "/api/v1/audit/list/smallestFee/exportDetailExcel", method: 'post',  data: tableData}
        //await exportDetailExcel(Object.assign({}, tableData ));
        var res = await this.download(option);

      }
      ,download(option, handle) {
        return new Promise((resolve, reject) => {
          var options = Object.assign({method: 'get', responseType: 'blob'}, option)
          request(options).then(response => {
            var resData = response.data;
            //错误信息
            if (resData.type == 'application/json') {
              var fileReader = new FileReader()
              fileReader.readAsText(resData, 'utf-8');
              fileReader.onloadend = () => {
                var jsonData = JSON.parse(fileReader.result);
                console.log(jsonData);
                if (jsonData.code != 200) {
                  reject(jsonData);
                  return;
                }
              }
            } else {  //正常文件
              console.log('insuccess');
              const link = document.createElement('a')
              link.href = window.URL.createObjectURL(new Blob([response.data]))
              link.target = '_blank'
              let filename = response.headers['content-disposition']
              if (filename.indexOf('filename=') > -1) {
                filename = filename.split('filename=')[1]
              }
              link.download = decodeURI(filename)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              resolve();
            }

          }).catch(error => {
            console.log('download', error);
          }).finally(x => {
            this.loading = false;
          })
        })
      }

    }
  }
</script>

<style scoped>
  .baseInfoHeight {
    height: var(--baseInfoHeight);
  }
</style>
