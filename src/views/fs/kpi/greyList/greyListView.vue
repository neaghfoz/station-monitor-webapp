<template>
  <div class="app-container" style="min-height: calc(100vh - 84px);display: flex;flex-direction: column;">
    <el-form ref="appForm" :model="queryParams" inline
             label-position="right" :label-width="'130px'">
      <el-form-item label="车牌号" prop="vehiclePlate">
        <el-input style="width: 150px" v-model="queryParams.vehiclePlate" type="text" maxlength="64"/>
      </el-form-item>

      <el-form-item label="ETC卡号" prop="cardId">
        <el-input style="width: 150px" v-model="queryParams.cardId" type="text" maxlength="64"/>
      </el-form-item>

      <el-form-item label="车型" prop="vehicleType">
        <ti-select :clearable="true" v-model="queryParams.vehicleType" dict-type="tibms_com_vehicleType" style="width:120px;"
                   :multiple="false"/>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <ti-select :clearable="true" v-model="queryParams.status" dict-type="tibms_sendpara_useStatus" style="width:120px;"
                   :multiple="false"/>
      </el-form-item>
      <el-form-item label="灰名单类型" prop="greyType">
        <ti-select :clearable="true" v-model="queryParams.greyType" dict-type="tibms_kpi_greyListType" style="width:120px;"
                   :multiple="false"/>
      </el-form-item>
      <el-form-item prop="beginValidDate" v-show="false"/>
      <el-form-item prop="endValidDate" v-show="false"/>
      <el-form-item label="生效时间" >
        <ti-date-range date-style="width: 240px;" v-model="queryParams" date-type="daterange" format="yyyy-MM-dd"
                       begin-key="beginValidDate" end-key="endValidDate" :clearable="true" :selectfuture="true"/>
      </el-form-item>
      <el-form-item prop="beginEndDate" v-show="false"/>
      <el-form-item prop="endEndDate" v-show="false"/>
      <el-form-item label="结束时间">
        <ti-date-range date-style="width: 240px;" v-model="queryParams" date-type="daterange" format="yyyy-MM-dd"
                       begin-key="beginEndDate" end-key="endEndDate" :clearable="true" :selectfuture="true"/>
      </el-form-item>
      <el-form-item class="searchItem">
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
          <el-button v-permission="['greyList:save']" type="primary" @click="addGreyList()">添加</el-button>
          <el-button v-permission="['greyList:enadble']" type="primary" @click="enableGreyList(null,true)">启用</el-button>
          <el-button v-permission="['greyList:enadble']" type="primary" @click="enableGreyList(null,false)">禁用</el-button>
          <el-button v-permission="['greyList:upload']"type="primary" @click="checkLog">一键下发</el-button>
          <el-button v-permission="['greyList:exp']"type="primary" @click="expWork">导出</el-button>
        </template>

        <template #operate="{row}">
          <div v-if="$refs.table.isActiveByRow(row)">
            <!-- 可编辑行-->
            <el-button type="text" v-permission="['greyList:save']" @click="saveRowEvent(row)">提交</el-button>
            <el-button type="text" v-permission="['greyList:save']" @click="cancelRowEvent(row)">取消</el-button>
          </div>
          <div v-else>
            <div v-if="row.status==0">
              <!-- 禁用状态下可删除 -->
              <el-button type="text" v-permission="['greyList:delete']" @click="removeRowEvent(row)">删除</el-button>
            </div>
          </div>
        </template>

        <template #vehicleTypeEdit="{ row,column }">
          <ti-select :disabled="row.id?true:false" v-model="row[column.property]" dict-type="tibms_com_vehicleType" :multiple="false"/>
        </template>
        <template #greyTypeEdit="{ row,column }">
          <ti-select :disabled="row.id?true:false" v-model="row[column.property]" dict-type="tibms_kpi_greyListType" :multiple="false"/>
        </template>
        <template #validTimeEdit="{ row,column }">
          <ti-date :disabled="row.id?true:false" date-style="width:100%" v-model="row[column.property]"
                   dateType="datetime" :clearable="false" :selectfuture="true"
                   format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"/>
        </template>
        <template #endTimeEdit="{ row,column }">
          <ti-date :disabled="row.id?true:false" date-style="width:100%" v-model="row[column.property]"
                   dateType="datetime" :clearable="false" :selectfuture="true"
                   format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"/>
        </template>
        <template #statusEdit="{ row,column }">
          <template v-if="row.id">
            <ti-select :disabled="true" v-model="row[column.property]" dict-type="tibms_sendpara_useStatus" :multiple="false"/>
          </template>
          <template v-else>启用</template>
        </template>

      </vxe-grid>
      <ti-export-excel :exportExcel="exportExcel" :page="table.page"></ti-export-excel>

      <check-log-win ref="log"/>
    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
  import api from "@/views/fs/kpi/greyList/greyListApi"
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import TiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg"
  import TiSysUser from "@/views/pro/common/tiElement/tiSysUser/tiSysUser"
  import TiDateRange from "@/views/pro/common/tiElement/tiDate/tiDateRange"
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import kpiUtil from "@/views/fs/kpi/common/kpiUtil"

  export default {
    name: "kpi.greyListView",
    components: { TiSelect,TiExportExcel,TiSysOrg,TiSysUser,TiDateRange,TiDate },
    mixins: [...mixin],
    data() {
      return {
        queryParams: {
          vehiclePlate:null,
          cardId:null,
          vehicleType:null,
          status:'1',
          greyType:null,
          beginValidDate:null,
          endValidDate:null,
          beginEndDate:null,
          endEndDate:null,
          beginValidTime:null,
          endValidTime:null,
          beginEndTime:null,
          endEndTime:null
        },
        userListCache: [],
        curRow:null,
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
            id: 'kpi.greyListView.toolbar',
            custom: true,
            slots: {
              buttons: 'tbars'
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
          editConfig: {
            trigger: 'manual',
            mode: 'row',
            showStatus: true,
            showIcon: false,
            autoClear: false,
            immediate: true
          },

          columns: [
            { type: 'checkbox', width: 40 },
            { field: 'vehiclePlate', title: '车牌号码', minWidth: 100, headerAlign: 'center', align: 'left', editRender: { name: '$input',props: { maxlength:20 },events: {blur: this.plateChangeEvent}} },
            { field: 'cardId', title: 'ETC卡号', minWidth: 200, headerAlign: 'center', align: 'left', editRender: { name: '$input',props: { maxlength:20 },events: {blur: this.cardIdChangeEvent}  } },
            { field: 'vehicleType', title: '车型', minWidth: 110, align: 'center',
              editRender: { },slots: { edit: 'vehicleTypeEdit' }, formatter: ({cellValue})=>this.dicFormat('tibms_com_vehicleType',cellValue)},
            { field: 'greyType', title: '灰名单类型', minWidth: 120, align: 'center' ,
              editRender: { }, slots: { edit: 'greyTypeEdit' }, formatter: ({cellValue})=>this.dicFormat('tibms_kpi_greyListType',cellValue)  },
            { field: 'validTime', title: '生效时间', minWidth: 200, align: 'center',
              editRender: { }, slots: { edit: 'validTimeEdit' }
            },
            { field: 'endTime', title: '结束时间', minWidth: 200, align: 'center',
              editRender: { }, slots: { edit: 'endTimeEdit' }
            },
            { field: 'status', title: '状态', minWidth: 80, align: 'center',
              showOverflow: true,
              editRender: { }, slots:{ edit: 'statusEdit' },
              formatter: ({cellValue})=>this.dicFormat('tibms_sendpara_useStatus',cellValue)
            },
            { field: 'remark', title: '备注', minWidth: 300, headerAlign: 'center', align: 'left', editRender: { name: '$input',props: { maxlength:20 }   } },
            { field: 'creater', title: '操作员', minWidth: 120, align: 'center', slots: {
                default: ({row}, h) => {
                  return row.createrText;
                }
              }},
            { field: 'createTime', title: '录入时间', minWidth: 160, align: 'center'},
            { title: '操作', width: 100, fixed: 'right', align: 'center', slots: { default: 'operate' } }
          ]
        },
        exportExcel: {
          url: 'api/v1/kpi/greyList/exp',
          dialog: false,
          queryParams: {},
          type: 'curpage'
        }
      }
    },

    created() {
      this.$nextTick(() => {
        this.submit()
      })
    },
    methods: {
      // 通用查询设置
      async reload(){
        this.queryParams.beginValidTime = this.queryParams.beginValidDate
        this.queryParams.beginEndTime = this.queryParams.beginEndDate
        if (this.queryParams.endValidDate == null || this.queryParams.endValidDate == '') {
          this.queryParams.endValidTime= this.queryParams.endValidDate
        } else {
          this.queryParams.endValidTime = this.queryParams.endValidDate + " 23:59:59"
        }
        if (this.queryParams.endEndDate == null || this.queryParams.endEndDate == '') {
          this.queryParams.endEndTime= this.queryParams.endEndDate
        } else {
          this.queryParams.endEndTime = this.queryParams.endEndDate + " 23:59:59"
        }
        this.table.loading = true
        const res = await api.findList({current: this.table.page.currentPage, size: this.table.page.pageSize}, this.queryParams);
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
      expWork(){
        this.exportExcel.queryParams = this.queryParams
        this.exportExcel.dialog = true
      },
      dicFormat(type,value){
        const dics = this.$dictUtils.getDictList(type)
        let result = value
        dics.forEach(x=>{ if(x.value==value) { result = x.label ; return ;} })
        return result
      },
      addGreyList(){
        // 新增一个空的行
        var row = {
          vehiclePlate: null,
          cardId: null,
          vehicleType: null,
          greyType: null,
          validTime: null,
          endTime: null,
          status: '1',
          remark: null,
          creater: this.$store.getters.userInfo.username,
          createrText: '['+this.$store.getters.userInfo.username+']'+this.$store.getters.userInfo.realName

        }
        this.table.data.splice(0,0, row)
        // 进入编辑
        this.editRowEvent(row)
      },
      // 进入编辑状态
      editRowEvent(row) {
       // row.modState=row.modState==1?true:false
        this.$refs.table.setActiveRow(row)
      },
      // 保存数据
      async saveData(row){
        this.table.loading = true
        try {
          const res = await api.addItem(null,row);
          if(res.code==200){
            const id = row['id']
            if(res.data!=null){
              kpiUtil.updateObj(res.data,row)
              this.$refs.table.clearActived()
              this.$notify.success('提交成功')
            }else{
              this.$notify.error('提交失败')
            }
          }else{
            this.table.data = []
            this.$notify.error('提交失败')
          }
        }finally {
          this.table.loading = false
        }
      },
      saveRowEvent(row) {
        this.saveData(row)
      },
      // 取消
      cancelRowEvent(row){
        this.$refs.table.remove(row)
        const idx = this.table.data.indexOf(row)
        if(idx>-1){
          this.table.data.splice(idx,1)
        }
      },
      // 删除灰名单
      removeRowEvent(row) {
        this.$confirm('确定删除' + row.vehiclePlate + '，生效时间：'+row.validTime+'吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 刷新当前页面
          const res = await api.deleteItem(row.id);
          if(res.code==200){
            this.$notify.success('删除成功')
            this.reload()
          }else{
            this.$notify.error('删除失败')
          }
          this.deleteLoading = false;
        });
      },
      // 启用、禁用灰名单
      async enableGreyList(row,flag){
        let flagText=flag?"启用":"禁用"
        const ids = []
        const vehiclePlates = []
        let entity = row
        let rows = this.$refs.table.getCheckboxRecords()
        console.log("rows:",rows)
        if (rows.length==0){
          this.$notify.warning(`请选择要`+flagText+'的灰名单')
          return
        }
        if(row){
          ids.push(row.id)
        }else{
          rows = this.$refs.table.getCheckboxRecords()
          entity = rows[0]
          rows.forEach(x=>{
            ids.push(x.id)
            vehiclePlates.push(x.vehiclePlate)
          })
          if(ids.length==1){
            row = entity
          }
        }

        console.log("rows:",rows)


        let vehiclePlatesText = vehiclePlates.join(',')
        this.$confirm('确定' + flagText + '车牌：' + vehiclePlatesText + '吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.table.loading = true
          entity['ids'] = ids.join(',')
          entity['status'] = flag?1:0
          api.enableItem(null, entity).then(res => {
            if (res.code === 200) {
              if (res.data) {
                // 更新一条记录情况
                rows.forEach(x => {
                  x.status = flag ? 1 : 0
                  x.statusText = flag ? "启用" : "禁用"
                })

                //kpiUtil.updateObj(res.data, row)
              } else {
                this.reload()
              }
              this.$notify.success(res.message)
            } else {
              this.$notify.error(res.message)
            }
          });
          this.table.loading = false
        });
      },

      validTimeChange(time){
        this.curRow['validTime'] = time
      },
      endTimeChange(time){
        this.curRow['endTime'] = time
      },
      plateChangeEvent({ row,column}){
        if (column.title == '车牌号码' && row.vehiclePlate != ''  && row.vehiclePlate != null) {
          const regex_plate= /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z挂学警港澳领试超外0-9]{3,9}$|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z0-9][A-Z0-9]{4}应急$|^默A00000$/
          if (!regex_plate.test(row.vehiclePlate)) {
            this.$message({
              message: '车牌填写格式不规范:[' + row.vehiclePlate + ']',
              type: 'error'
            })
            return false
          }
        }
      },
      cardIdChangeEvent({ row,column}){
        if (column.title == 'ETC卡号' && row.cardId != ''  && row.cardId != null) {
          const regex_cardId= /^[0-9]{20}$/
          if (!regex_cardId.test(row.cardId)) {
            this.$message({
              message: 'ETC卡号填写格式不规范:[' + row.cardId + ']，应为20位数字',
              type: 'error'
            })
            return false
          }
        }
      },
      reset() {
        this.$refs['appForm'].resetFields()
        this.queryParams.beginValidTime=null;
        this.queryParams.endValidTime=null;
        this.queryParams.beginEndTime=null;
        this.queryParams.endEndTime=null;
        console.log("this.queryParams",this.queryParams)
      },
      // 分页改变事件
      handlePageChange({currentPage, pageSize}) {
        this.table.page.currentPage = currentPage
        this.table.page.pageSize = pageSize
        this.reload()
      }
    }
  }
</script>
