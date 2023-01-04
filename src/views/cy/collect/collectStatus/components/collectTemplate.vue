<template>
  <div class="app-container">
    <el-form ref="searchItem" :model="queryParams" inline :label-width="'100px'">
      <el-form-item label="路段">
        <el-input v-model="queryParams.roadName" type="text" readonly/>
      </el-form-item>
      <el-form-item label="数据表名称">
        <el-input v-model="queryParams.tableName" type="text" readonly/>
      </el-form-item>

      <el-form-item label="填报日期">
        <el-input v-model="queryParams.collectDate" type="text" readonly/>
      </el-form-item>

      <vxe-grid
        v-show="this.queryParams.type === 'edit'"
        ref="editVxe"
        highlight-hover-row
        border
        show-overflow
        show-header-overflow
        resizable
        max-height="450"
        sync-resize
        auto-resize
        keep-source
        class="vxe-table-element"
        :edit-config="{trigger: 'click', mode: 'cell',showStatus: true,activeMethod: activeRowMethod,showIcon:false}"
        :loading="loading"
        :span-method="objectSpanMethod"
        :columns="columns"
        :data="tableData"
        :toolbar="tableToolbar"
      >
        <template v-slot:toolbar_buttons> 
            <el-form ref="discountForm" :model="discountForm" :label-width="'120px'" :rules="discountFormRule" inline>
              <el-button type="success" :loading="saveLoading" v-show="allowAdd == true && (queryParams.tableId == '50')" @click="add()">新增</el-button>
              <el-button type="success" :loading="saveLoading" v-show="(opButton.save || opButton.save2) && (queryParams.tableId == '240')" @click="add()">新增</el-button>
              <el-button type="primary" v-show="opButton.import" @click="importVisible = true">导入</el-button>
              <el-button type="primary" v-show="opButton.onlineImport" @click="onlineImport()">在线录入</el-button>
              <el-button type="danger" :loading="saveLoading" v-show="opButton.save" @click="save()">保存</el-button>
              <el-button type="danger" :loading="saveLoading" v-show="opButton.save2" @click="save() && ((queryParams.tableId == '90')||(queryParams.tableId == '100')
              ||(queryParams.tableId == '110')||(queryParams.tableId == '120')||(queryParams.tableId == '130')||(queryParams.tableId == '140')
              ||(queryParams.tableId == '150')||(queryParams.tableId == '160')||(queryParams.tableId == '230')||(queryParams.tableId == '240'))">保存</el-button>
              <el-button type="primary" :loading="submitLoading" v-show="opButton.submit" @click="submit()">提交</el-button>
              <el-button type="primary" style="background-color:#FF7F50;border-color: #FF7F50;" :loading="saveLoading" v-show="opButton.clean" @click="clean()">清空数据</el-button>
                
              <el-form-item label="优惠车系数" prop="discountRate" v-show="discountFormShow && opButton.save">
                  <el-input 
                    v-model="discountForm.discountRate" 
                    type="text" 
                    placeholder="请输入优惠车系数" >
                  <i slot="suffix">%</i></el-input>
              </el-form-item>
            </el-form>
        </template>
      </vxe-grid>


      <vxe-grid
        v-show="this.queryParams.type === 'view'"
        ref="vxe"
        highlight-hover-row
        border
        show-overflow
        show-header-overflow
        resizable
        max-height="450"
        sync-resize
        auto-resize
        class="vxe-table-element"
        :loading="loading"
        :span-method="objectSpanMethod"
        :columns="columns"
        :data="tableData"
        :toolbar="tableToolbar"
      >
        <template v-slot:toolbar_buttons>
          <el-button type="success" @click="exportExcel.dialog = true">导出</el-button>
          <el-form-item label="优惠车系数" prop="discountRate" v-show="discountFormShow">
                  <el-input 
                    v-model="discountForm.discountRate" 
                    type="text" 
                    disabled ="true" >
                  <i slot="suffix">%</i></el-input>
              </el-form-item>
        </template>
      </vxe-grid>
      <div style="margin-top: 15px" v-show="queryParams.tableId == '50'">批注： 封道类别只能填写内容：交通事故、交通管制、施工、恶劣天气、其它</div>
      <div style="margin-top: 15px;margin-left:52px" v-show="queryParams.tableId == '50'">创收类别只能填写内容：压车带道、协调引流、路网引流、派发传单增设或修订指引牌、通过互联网或其它类引流</div>
      <div style="margin-top: 15px" v-show="queryParams.tableId == '20' || queryParams.tableId == '210'">批注： 如门架交易额为100万，优惠车系数为5%（0.05），优惠车系数日报统计公式：门架交易额*（1+优惠车系数），即100万*（1+0.05）=105万 </div>
      <div style="margin-top: 15px" v-show="queryParams.tableId == '110'">批注： 冲账车型只能填写内容：客一、客二、客三、客四、货一、货二、货三、货四、货五、货六、专一、专二、专三、专四、专五、专六</div>
      <div style="margin-top: 15px" v-show="queryParams.tableId == '110'">收费方式只能填写内容：ETC、湘通卡、移动支付、现金</div>
      <div style="margin-top: 15px" v-show="queryParams.tableId == '240'">批注： 若节假日存在多个日期，按对应的节日名称逐日填写（如国庆节写2021-10-01、2021-10-02...）</div>

      <div style="margin-top: 30px"> 填报日志</div>
      <div class="block" style="margin-top: 10px">
        <el-timeline>
          <el-timeline-item
            placement="top"
            v-for="(log, index) in logData"
            :key="index"
            :timestamp="log.title">
            <div v-html="log.content"/>
          </el-timeline-item>
        </el-timeline>
      </div>

    </el-form>
    <ti-export-excel :exportExcel="exportExcel"></ti-export-excel>

    <ti-import
      :upload-url="importUrl"
      :tpl-url="tplUrl"
      :title="queryParams.tableName+'导入'"
      :visible="importVisible"
      @onSuccess="importSuccess"
      @close="importVisible = false"
    />
   <ti-imp-error ref="impError"/>

  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiExportExcel from "@/views/pro/common/tiElement/tiExport/tiExportExcel"
  import TiImport from '@/views/pro/common/tiElement/tiImport/tiImport'
  import TiImpError from "@/views/pro/common/tiElement/tiImpError/tiImpError";
  import api from "./collectTemplateApi";
  import col from "./colOption";
  import colA from "./colOptionAdd"
  import CollectConstant from "../collectConstant";
  import {getTableColumnMap} from "@/views/pro/common/util/dataUtil";
  import SysOrgConstant from "@/views/pro/common/constant/sysOrgConstant";

  export default {
    name: "cy.collect.components.collectTemplate",
    components: {TiSelect, TiExportExcel, TiImport,TiImpError},
    mixins: [...mixin],
    data() {
      const validateMoney = (rule,value,callback) =>{
        if(!value){
            callback(new Error('优惠车系数不能为空'))
         }else{
          callback();
        }
    };

      return {
        discountForm:{ 
          discountRate:0.00,
          roadId:'G0015440060',
          collectDate:'2020-12-01'
        },
        initDiscountRate:0.00,
        isValid:true,
        discountFormShow:false,
        saveLoading: false,
        submitLoading: false,
        importVisible: false,
        tplUrl: '',
        importUrl: '',
        discountFormRule:{
          discountRate: [
            { required: true, message: '优惠车系数不能为空', trigger: 'blur' }, 
            {pattern: /^([-]?)(([1-9]{1}(\d{0,7}))|(0{1}))(\.\d{1,2})?$/, message: '只允许填写数字，仅保留两位小数', trigger: 'change'}
          ],
        },
        queryParams: {
          roadId: 'G0015440060',
          collectDate: '2020-12-01',
          tableId: '80',
          tableName: '实际拆分收益',
          roadName: '机荷东',
          type: 'edit',
          status: 2,
          nodeLevel: 2
        },
        allowAdd:false,
        constant: {
          collect: CollectConstant,
          sysOrg: SysOrgConstant
        },
        opButton: {
          import: false,
          save: false,
          save2: false,
          submit: false,
          onlineImport:false
        },
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'dataCollect.components.collectTemplate-toolbar',
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
        logData: [],
        initTableData: [],
        columns: [],
        columnMap: {},
        exportExcel: {
          url: '',
          dialog: false,
          queryParams: {},
          type: 'total'
        },
        onlineImportVis:false,
        importType:''
      }
    },
    created() {

      this.queryParams = this.$route.query;
      this.discountForm.roadId = this.queryParams.roadId;
      this.discountForm.collectDate = this.queryParams.roadId;
      console.log('query', this.$route.query);
      console.log('queryParams', this.queryParams);
      console.log('常量', this.constant);
 

      if (this.queryParams.type === 'edit') {
        this.tplUrl = '/api/v1/collect/collectStatus/excelTemplate/' + this.queryParams.roadId + '/'
          + this.queryParams.collectDate + '/' + this.queryParams.tableId;
        this.importUrl = '/api/v1/collect/collectStatus/importExcel/' + this.queryParams.roadId + '/'
          + this.queryParams.collectDate + '/' + this.queryParams.tableId;
      }
      this.exportExcel.url = '/api/v1/collect/collectStatus/exportExcel';
      Object.assign(this.exportExcel.queryParams, this.queryParams);
      this.$nextTick(() => {
        if(parseInt(this.queryParams.tableId) < 200){
          this.columns = col.getColumns(this.queryParams.tableId);
        }else{
          this.columns = colA.getColumns(this.queryParams.tableId);
        }
        console.log('columns', this.columns);
        var tempColumns = JSON.parse(JSON.stringify(this.columns));
        getTableColumnMap(tempColumns, this.columnMap);
        this.getData();
        this.initPermission();
      })

    },
    watch: {},
    methods: {
      initPermission() {
        let status = this.constant.collect.status;
        let queryStatus = this.queryParams.status;
        let userOrgLevel = this.queryParams.nodeLevel;
        let province = this.constant.sysOrg.NodeLevel.province;
        this.opButton.import = (userOrgLevel != province && queryStatus == status.notFillIn);
        this.opButton.save = (userOrgLevel != province && (queryStatus == status.save || queryStatus == status.edit || queryStatus == status.submitSendBack));
        this.opButton.save2 = (userOrgLevel != province && (queryStatus == status.submit));
        this.opButton.submit = (userOrgLevel != province && (queryStatus == status.save || queryStatus == status.submitSendBack));
        this.opButton.onlineImport = (userOrgLevel != province && queryStatus == status.notFillIn);
        this.opButton.clean = (userOrgLevel != province && (queryStatus == status.save || queryStatus == status.edit || queryStatus == status.submitSendBack));

      },
      async getData() {
        this.loading = true;

        if(this.queryParams.tableId == '20' || this.queryParams.tableId == '210'){
          this.discountFormShow = true;
          const discountRate =await api.findDiscount({}, this.queryParams);
          if(discountRate.data!=null){
            this.discountForm.discountRate = discountRate.data; 
            this.initDiscountRate = discountRate.data; 
          }
        }
        const {data} = await api.findList({}, this.queryParams);
        console.log('data', data);
        this.tableData = data.tableData;
        let logData = data.logData;
        this.logData = [];
        this.initTableData = [];
        this.rebuildLog(logData, this.logData);

        if (this.tableData && this.tableData.length > 0) {

          this.tableData.forEach(item => {
            let obj = {};
            Object.assign(obj, item);
            this.initTableData.push(obj);
          })

        }
        this.loading = false;
      },
      edit() {
        this.$refs.editVxe.setActiveRow();
      },
      async save() {
        
        let updateRecords = this.$refs.editVxe.getUpdateRecords(); 
       
        if (!updateRecords.length || updateRecords.length === 0) {
          if((this.queryParams.tableId == '20' || this.queryParams.tableId == '210') 
            && this.discountForm.discountRate != this.initDiscountRate){
            try {
              await Promise.all([
                this.$refs.discountForm.validate()
              ])
            }catch (error) {
              this.saveLoading = false; 
              this.$message.error('优惠车系数填写有误，请按提示修改！');
              return;
            }; 
            this.queryParams.discountRate = this.discountForm.discountRate;
            await api.saveDiscount({}, this.queryParams);
            this.$message.success('保存优惠车系数成功！'); 
            this.$route.query.status = this.constant.collect.status.save;
            this.queryParams.status = this.constant.collect.status.save;
            this.initPermission();
            this.getData();
          }else{ 
            this.$message.warning('请先修改数据');
          }
          return;
        }

        if(this.queryParams.tableId == '20' || this.queryParams.tableId == '210'){
          try {
            await Promise.all([
              this.$refs.discountForm.validate()
            ])
          }catch (error) {
            this.saveLoading = false; 
            this.$message.error('优惠车系数填写有误，请按提示修改！');
            return;
          };
        }  


        this.saveLoading = true;
        let updateList = [];
        let result = this.findKeyAndCompile(this.initTableData, updateRecords, updateList);

        if(updateList.length === 0 &&updateRecords.length !== 0&& (this.importType != 'online'))
        {
          this.$message.warning('修改前后数据相同，不需保存');
          this.saveLoading = false;
          this.importType = 'edit';
          return;
        }
 
        console.log("initTableData:"+this.initTableData);
        console.log("updateList:", updateList.length);
        console.log("this.importType:"+this.importType);
        if (result && this.importType != 'online' && updateList.length > 0) {
          let updates = {
            updates: updateList,
            roadId:'',
            collectDate:'',
            discountRate:0.0,
            tableId:''
          }
          try{ 
            if(this.queryParams.tableId == '20' || this.queryParams.tableId == '210'){
              updates.roadId = this.queryParams.roadId;
              updates.collectDate = this.queryParams.collectDate;
              updates.discountRate = this.discountForm.discountRate;
              updates.tableId = this.queryParams.tableId;
            }
            await api.save({}, updates).then(res => {
              if (res.code === 200) {
                // this.$notify.success('保存成功！')
                this.$message.success('保存成功！');
                console.log("queryStatus:",this.queryParams.status);
                if(this.queryParams.status != 3){
                this.$route.query.status = this.constant.collect.status.save;
                this.queryParams.status = this.constant.collect.status.save;}
                this.initPermission();
                this.getData();
                this.importType = 'edit';
                this.allowAdd = false;
              } else {
                //  this.$notify.error(res.message)
                this.$message.error(res.message);
              }
              this.saveLoading = false;

            });
          }catch{
            this.saveLoading = false;
          }
        }else if(this.importType == 'online'&&this.queryParams.tableId !=50){
          let onlineList = this.$refs.editVxe.getData();
          onlineList[0].roadId = this.queryParams.roadId;
          onlineList[0].collectDate = this.queryParams.collectDate;
          onlineList[0].tableId = this.queryParams.tableId;

          if(this.queryParams.tableId == '20' || this.queryParams.tableId == '210'){ 
            onlineList[0].discountRate = this.discountForm.discountRate;
          }

          try{
            await api.saveImport({}, onlineList).then(res => {
              console.log("do saveImport")
              if (res.code === 200) {
                // this.$notify.success('保存成功！')
                this.$message.success('保存成功！');
                if(this.queryParams.status != 3){
                  this.$route.query.status = this.constant.collect.status.save;
                  this.queryParams.status = this.constant.collect.status.save;}
                this.initPermission();
                this.getData();
                this.importType = 'edit';
                this.allowAdd = false;
              } else {
                //  this.$notify.error(res.message)
                this.$message.error(res.message);
              }
              this.saveLoading = false;

            });
          }catch{
            this.saveLoading = false;
          }
        }
        else if(this.importType == 'online'&&this.queryParams.tableId ==50)
        {
          let onlineList = this.$refs.editVxe.getData();
          onlineList[0].roadId = this.queryParams.roadId;
          onlineList[0].collectDate = this.queryParams.collectDate;
          onlineList[0].tableId = this.queryParams.tableId;
          if(this.queryParams.tableId == '20' || this.queryParams.tableId == '210'){ 
            onlineList[0].discountRate = this.discountForm.discountRate;
          }
          try{
            await api.saveImport({}, onlineList).then(res => {
              console.log("do saveImport")
              if (res.code === 200) {
                // this.$notify.success('保存成功！')
                this.$message.success('保存成功！');
                this.$route.query.status = this.constant.collect.status.save;
                this.queryParams.status = this.constant.collect.status.save;
                this.initPermission();
                this.getData();
                this.importType = 'edit';
                this.allowAdd = false;
              } else {
                //  this.$notify.error(res.message)
                this.$message.error(res.message);
              }
              this.saveLoading = false;

            });
          }catch{
            this.saveLoading = false;
          }
        }

        this.saveLoading = false;
      },
      add(){
        var newObj = {
          reportDate:this.initTableData[0].reportDate,
          roadId:this.initTableData[0].roadId,
          sealRoadCount: null,
          sealRoadTimeCount: null,
          estimatedLoss: null,
          leadWayCount: null,
          leadWayTimeCount: null,
          estimatedGive: null
        }
        this.tableData.push(newObj);
 		    this.initTableData.push(newObj);
 		    console.log("this.queryParams.status",this.queryParams.status);
        this.importType = 'online';
        //this.getData();
      },
      clean(){
          this.$confirm('是否清空数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          let collectStatus = {
            tableId: this.queryParams.tableId,
            roadId: this.queryParams.roadId,
            collectDate: this.queryParams.collectDate
          }
          this.submitLoading = true;

          api.clean({}, collectStatus).then(res => {
            if (res.code === 200) {
              this.$message.success('清空成功！');
              this.getData();
              this.opButton.import = true;
              this.opButton.save = false;
              this.opButton.submit = false;
              this.opButton.onlineImport = true;
              this.opButton.clean = false;
              // this.discountForm.discountRate = 0.0;
            } else {
              this.$message.error(res.message);
            }
          });
          this.submitLoading = false;
        });
      },
      async submit() {
        //如果有数据修改，提示先保存再提交
        let updateRecords = this.$refs.editVxe.getUpdateRecords();
        let updateList = [];
        let result = this.findKeyAndCompile(this.initTableData, updateRecords, updateList);

        if (updateRecords.length!=null && updateRecords.length != 0) {
          if(!(updateList.length === 0 &&updateRecords.length !== 0&& (this.importType != 'online'))){
            this.$message.warning('请先保存再提交！');
            return;
          }
        }

        if(updateRecords.length!=null && updateRecords.length == 0 && this.importType == 'online'){
          this.$message.warning('请先填报数据');
          return;
        }

        if(this.queryParams.tableId == '20' || this.queryParams.tableId == '210'){
          try {
            await Promise.all([
              this.$refs.discountForm.validate()
            ])
          }catch (error) {
            this.$message.error('优惠车系数填写有误，请按提示修改！');
            return;
          };
        }

        this.$confirm('是否提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {


          let collectStatus = {
            tableId: this.queryParams.tableId,
            roadId: this.queryParams.roadId,
            collectDate: this.queryParams.collectDate
          }
 
          if(this.queryParams.tableId == '20' || this.queryParams.tableId == '210'){
            collectStatus.discountRate = this.discountForm.discountRate;
          }

          this.submitLoading = true;

          api.submit({}, collectStatus).then(res => {
            if (res.code === 200) {
              this.$message.success('提交成功！');
              this.opButton.save = false;
              this.opButton.submit = false;
              this.opButton.clean = false;
              this.allowAdd = false; 
              this.queryParams.status = 3;
              if(!(this.queryParams.roadId == 'G5513430010')){ 
                this.getData();
              }
            } else {
              this.$message.error(res.message);
            }
          });
          this.submitLoading = false;
        });


      },
      importSuccess(resp, file, filelist) {

        if (resp.code === 200) {
          if(resp.data){
            this.$refs.impError.show(resp.data)
          }else{
              this.$alert('数据导入成功')
              this.queryParams.status = this.constant.collect.status.save
              this.$route.query.status = this.constant.collect.status.save
              this.initPermission();
              this.getData();
          }

      } else {
          // this.$notify.error(resp.message)
          this.$message.error(resp.message);
        }
        // this.getData()
      },
      rebuildLog(logData, rebuildLog) {
        if (!logData || logData.length <= 0) {
          return;
        }
        let title = '', content = '';
        let createTime = logData[0].createTime;
        for(let i = 0; i < logData.length; i++) {
          let a = logData[i];
          let b = logData[i + 1];
          if (i === logData.length - 1) {
            b = {
              createTime: ''
            }
          }
          if (a.record) {
            if (content != '') {
              content = content + ';' + a.record;
            } else {
              content = a.record;
            }

          }
          if (a.createTime === b.createTime) {
            continue;
          }
          title = a.createTime + ',' + a.operatorName + a.operate;
          rebuildLog.push({
            title: title,
            content: this.changeContent(content)
          });
          content = '';

        }

      },
      changeContent(content) {
        content = content.replace(/;/g, "</br>");
        return content;
      },
      findKeyAndCompile(initTableData, updateRecords, updateList) {
        return api.findKeyAndCompile(initTableData, updateRecords, updateList, this);
      },
      async onlineImport(){

        this.loading = true;

        let {data} = await api.findOnlineList({}, this.queryParams);
        data = JSON.parse(data);
        console.log('data', data);
        this.tableData = data.tableData;
        let logData = data.logData;
        this.logData = [];
        this.initTableData = [];
        this.rebuildLog(logData, this.logData);

        if (this.tableData && this.tableData.length > 0) {

          this.tableData.forEach(item => {
            let obj = {};
            Object.assign(obj, item);
            this.initTableData.push(obj);
          })

        }
        this.loading = false;
        this.opButton.import = false;
        this.opButton.onlineImport = false;
        this.opButton.submit = true;
        this.opButton.save = true;
        this.importType = 'online';
        this.allowAdd = true;
      },
      activeRowMethod ({ row, rowIndex }) {
        if(this.tableData!==undefined && ( this.queryParams.tableId === '40')){
          return rowIndex !== this.tableData.length-1;
        }
        else if(this.tableData!==undefined && (this.queryParams.tableId === '30'|| this.queryParams.tableId=== '60'|| this.queryParams.tableId=== '70'||this.queryParams.tableId === '10'|| this.queryParams.tableId === '20'))
        {
          if (rowIndex === this.tableData.length-3||rowIndex === this.tableData.length-2||rowIndex === this.tableData.length-1)
          {
            return false;
          }
          else{
            return true;

          }

        }

        return true;
      },

      objectSpanMethod({column, rowIndex, data}) {
        if (column.property === "sectionCnt" || column.property === "sectionProStr") {
          if(data[rowIndex].fractureSurfaceName != undefined){
            if(rowIndex < data.length-1){
              if (data[rowIndex].fractureSurfaceName === data[rowIndex+1].fractureSurfaceName ) {
                return {
                  rowspan: 2,
                  colspan: 1
                };
              }
            }
            if(rowIndex > 0 && rowIndex < data.length){
              if (data[rowIndex].fractureSurfaceName === data[rowIndex-1].fractureSurfaceName) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }

    }
  }
</script>
