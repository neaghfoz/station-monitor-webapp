<template>
  <div class="app-container" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :model="queryParams" inline :label-width="'100px'">

      <el-form-item label="考核指标类型" prop="dataTypes">
        <ti-select v-model="queryParams.indiType" dict-type="tibms_kpi_indiType" style="width:160px;"
                   :multiple="false"/>
      </el-form-item>

      <el-form-item label="考核对象" prop="indiTargets">
        <!--
        <ti-select v-model="queryParams.indiTarget" style="width:120px;"
                   url="/api/v1/position/sysrPosition/list" :is-post="true"
                   :props="{key:'code',value:'code',label:'name'}"
                   :multiple="false" aria-placeholder="考核对象"/>-->
        <ti-select ref="indiTargets" v-model="queryParams.indiTarget" style="width:120px;"
                   :data-list="positions" :is-post="true"
                   :props="{key:'id',value:'id',label:'name'}"
                   :multiple="true" aria-placeholder="考核对象"/>
      </el-form-item>

      <el-form-item label="绩效类型" prop="dataTypes">
        <ti-select v-model="queryParams.scoreType" dict-type="tibms_kpi_scoreType" style="width:120px;"
                   :multiple="false"/>
      </el-form-item>



      <el-form-item label="状态" prop="dataTypes">
        <ti-select  v-model="queryParams.status" dict-type="tibms_kpi_indiStatus" style="width:120px;"
                   :multiple="false"/>
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
          <el-button v-permission="['indicator:save']" type="primary" @click="addIndicator">新增</el-button>
          <el-button v-permission="['indicator:exp']" type="primary" @click="expWork">导出</el-button>
        </template>

        <template #statusEdit="{ row,column }">
          <template v-if="row.id">
            <ti-select :disabled="true" v-model="row[column.property]" dict-type="tibms_kpi_indiStatus" :multiple="false"/>
          </template>
          <template v-else>待提交</template>
        </template>

        <template #indiTypeEdit="{ row,column }">
          <ti-select :disabled="row.id?true:false" v-model="row[column.property]" dict-type="tibms_kpi_indiType" :multiple="false"/>
        </template>
        <template #indiTargetEdit="{ row,column }">
          <ti-select :disabled="row.id?true:false" v-model="row['indiTarget']"
                     :data-list="positions"
                     :props="{key:'id',value:'id',label:'name'}"
                     :multiple="true" aria-placeholder="考核对象"/>
        </template>
        <template #scoreTypeEdit="{ row,column }">
          <ti-select :disabled="row.id?true:false" v-model="row[column.property]" dict-type="tibms_kpi_scoreType" :multiple="false" @change="changeScore(row)"/>
        </template>

        <template #scoreValEdit="{ row,column }">
          <el-input-number v-model="row[column.property]" :precision="2" :step="0.01" controls-position="right"
                           :min="initMinScoreVal" :max="initMaxScoreVal"
                           />
        </template>

        <template #maxScoreValEdit="{ row,column }">
          <el-input-number v-model="row[column.property]" :disabled="!row.modState" :precision="2" :step="0.01" controls-position="right"
                           :min="!row.modState ? null : (row.scoreType == 3 ? 0.00 : 0.01)" :max="!row.modState ? null : (row.scoreType == 3 ? 0.00 : 100.00)"
                          @blur="maxScoreBlurEvent"/>
        </template>

        <template #operate="{ row }">
          <template v-if="row.status!=2">
            <template v-if="$refs.table.isActiveByRow(row)">
              <el-button type="text" v-permission="['indicator:save']" @click="saveRowEvent(row)">提交</el-button>
              <el-button type="text" v-permission="['indicator:save']"  @click="cancelRowEvent(row)">取消</el-button>
            </template>
            <template v-else>
              <el-button type="text" v-permission="['indicator:save']" @click="editRowEvent(row)">修改</el-button>
              <el-button type="text" v-permission="['indicator:save']"  @click="removeRowEvent(row)">删除</el-button>
            </template>
          </template>
        </template>
      </vxe-grid>
      <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>
    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
  import { findIndicators, insertIndicator, queryPositions } from "@/views/fs/kpi/indicator/indicatorApi"
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi";
  import kpiUtil from "@/views/fs/kpi/common/kpiUtil";

  export default {
    name: "kpi.indicatorView",
    components: { TiSelect,TiExportExcel },
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          indiType:null,
          indiTarget:null,
          scoreType:null,
          status: '1'
        },
        positions:[],
        initMinScoreVal: 0.00,
        initMaxScoreVal: 100.00,
        curOldRow: null,
        table:{
          loading: false,
          data:[],
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
            id: 'kpi.indicatorView.toolbar',
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
            showIcon: false,
            autoClear: false
          },
          columns: [
            { title:'序号', type: 'seq', width: 60, align: 'center' },
            { field: 'id', title: '指标编号', minWidth: 120, align: 'left',headerAlign: 'center' },
            { field: 'indiType', title: '考核指标类型', minWidth: 120, align: 'center',
              editRender: {} ,slots:{ edit: 'indiTypeEdit' },
              formatter: ({cellValue})=>this.dicFormat('tibms_kpi_indiType',cellValue)
            },
            { field: 'indiTargetStr', title: '考核对象', minWidth: 120, align: 'center',
              editRender: {} ,slots:{ edit: 'indiTargetEdit' }
            },
            { field: 'indiDesc', title: '考核细则', minWidth: 300, headerAlign: 'center', align: 'left', editRender: { name: '$input',props: { maxlength:200 }   } },
            { field: 'scoreType', title: '绩效类型', minWidth: 120, align: 'center',
              editRender: {} ,slots:{ edit: 'scoreTypeEdit' },
              formatter: ({cellValue})=>this.dicFormat('tibms_kpi_scoreType',cellValue)
            },
            { field: 'scoreVal', title: '绩效分值', minWidth: 150, align: 'center', showOverflow: true,
              editRender: { }, slots: { edit: 'scoreValEdit' }
              ,formatter: ({cellValue})=>{ return parseFloat(cellValue).toFixed(2)}
            },
            { field: 'modState', title: '允许修改分值', minWidth: 150, align: 'center', showOverflow: true,
              editRender: { name: '$switch', props: { openValue: 1, closeValue: 0 } ,events:{change:this.modStateChange}},
              formatter: ({ cellValue }) => { return cellValue == 1 ? '是' : '否' } },
            { field: 'maxScoreVal', title: '最大分值', minWidth: 150, align: 'center', showOverflow: true,
              editRender: { }, slots: { edit: 'maxScoreValEdit' } ,formatter: ({cellValue})=>{
              return !cellValue ? null : parseFloat(cellValue).toFixed(2)}},
            { field: 'remark', title: '备注', minWidth: 200, headerAlign: 'center', align: 'left', editRender: { name: '$input',props: { maxlength:255 }} },
            { field: 'creater', title: '创建人', minWidth: 100, align: 'center', showOverflow: true },
            { field: 'createTime', title: '创建时间', minWidth: 100, align: 'center', showOverflow: true },
            { field: 'status', title: '状态', minWidth: 100, align: 'center',
              showOverflow: true,
              editRender: { }, slots:{ edit: 'statusEdit' },
              formatter: ({cellValue})=>this.dicFormat('tibms_kpi_indiStatus',cellValue)
            },
            { title: '操作', width: 150, fixed: 'right', align: 'center', slots: { default: 'operate' } }
          ]
        },
        exportExcel: {
          url: 'api/v1/kpi/indicator/exp',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        }
      }
    },
    mounted() {

    },
    created() {
      this.loadPositions();
      this.$nextTick(() => {
        this.submit()
      })
    },
    methods: {
      async loadPositions(){
        const result = await queryPositions({},{});
        this.positions = result.data;
        this.$refs['indiTargets'].selectDataShow = this.positions;
      },
      formatPosition(id){
        let result = id
        if(this.positions && this.positions.length > 0){
          this.positions.forEach(x=>{if(x.id==id){result = x.name;return;}})
        }
        return result;
      },
      dicFormat(type,value){
        const dics = this.$dictUtils.getDictList(type)
        let result = value
        dics.forEach(x=>{ if(x.value==value) { result = x.label ; return ;} })
        return result
      },
      // 新增指标
      addIndicator(){
        // 新增一个空的行
        var row = {
          indiType: 'YWJN',
          scoreType: null,
          scoreVal: 0.01,
          maxScoreVal: 100.00,
          modState: 0,
          status:0
        }
        this.table.data.splice(0,0, row)
        // 进入编辑
        this.editRowEvent(row)
      },
      // 进入编辑状态
      editRowEvent(row) {
        row.modState=row.modState==1?true:false
        this.curOldRow = Object.assign({},row)
        this.$refs.table.setActiveRow(row)
      },

      // 保存数据
      async saveDate(row){
        this.table.loading = true
        try {
          const res = await insertIndicator(null,row);
          if(res.code==200){
            const id = row['id']
            if(row.status==2){
              this.reload()
            }
            if(res.data!=null){
              Object.assign(row,res.data)
              if(id){
                this.$notify.success('操作成功.')
              }else{
                this.$notify.success('提交成功.')
              }
              if(this.$refs.table.isActiveByRow(row)){
                this.$refs.table.clearActived()
              }
            }else{
              if(id){
                this.$notify.error('操作失败.')
              }else{
                this.$notify.error('提交失败.')
              }
            }
          }else{
            this.table.data = []
            this.$notify.error('提交失败.')
          }
        }finally {
          this.table.loading = false
        }
      },
      saveRowEvent(row) {
        row.modState=row.modState?1:0
        this.saveDate(row)
      },
      // 取消
      cancelRowEvent(row){
        // 用旧值覆盖@20210924，避免编辑修改后取消，显示的是新值
        kpiUtil.updateObj(this.curOldRow,row)
        this.$refs.table.clearActived();
      },
      // 删除指标
      removeRowEvent(row) {
        if(!row['id']){
          this.$refs.table.remove(row)
          const idx = this.table.data.indexOf(row)
          if(idx>-1){
            this.table.data.splice(idx,1)
          }
          return ;
        }
        this.$confirm('删除后无法使用该指标进行新的考核，确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status=2
          this.saveDate(row)
        });
      },

      // 通用查询设置
      async reload(){
        this.table.loading = true
        const res = await findIndicators({ current: this.table.page.currentPage,size : this.table.page.pageSize },this.queryParams);
        if(res.code==200){
          this.table.data = res.data.records
          this.table.page.total = res.data.total
        }else{
          this.table.data = []
          this.table.page.total = 0
        }
        this.table.loading = false
      },
      submit(){
        this.$refs.appForm.validate((valid) => {
          if (valid) {
            this.table.page.currentPage = 1
            this.reload()
          } else {
            return false;
          }
        })
      },
      reset() {
        this.queryParams.indiType = null
        this.queryParams.scoreType = null
        this.queryParams.status = null
        this.queryParams.indiTarget = null
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
      modStateChange({ row,column},obj){
        if(!obj.value){// 如果不允许修改分值，则清空最大分值
          row.maxScoreVal = null
        }else{
          row.maxScoreVal = 0.01
        }
      },
      maxScoreBlurEvent(event){
        //console.log(event)
      },
      changeScore(row){
        // console.log(row)
        if(row.scoreType == 3){
          this.initMinScoreVal = 0.00
          this.initMaxScoreVal = 0.00
          row.scoreVal = 0.00
          row.maxScoreVal = 0.00
        }else{
          this.initMinScoreVal = 0.01
          this.initMaxScoreVal = 100.00
          if(row.scoreVal == 0.00){
            row.scoreVal = this.initMinScoreVal
          }
          if(row.maxScoreVal == 0.00){
            row.maxScoreVal = this.initMinScoreVal
          }
        }
      }
    }
  }
</script>
