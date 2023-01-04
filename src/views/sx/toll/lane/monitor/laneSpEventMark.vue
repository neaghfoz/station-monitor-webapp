<template>

  <el-dialog title="特情登记" width="70%"
             id="laneSpEventMarkDialog"
             :modal-append-to-body='false'
             :lock-scroll="false"
             :fullscreen="false"
             :show-close="true"
             :before-close="handleDialogClose"
             :close-on-click-modal=false
             :visible="spShow">

    <div class="app-container">
      <div style="padding: 10px 0px 10px 0px;">
        <el-form ref="form" label-width="100px">
          <el-row>
            <table class="table" id="invCodeTable" style="margin: auto;width: 100%;">
              <tr class="bg-gray">
                <td style="width:75px;" v-if="selections.length == 1"><div style="width:70px;">特殊事件：</div></td>
                <td style="min-width:110px" v-if="selections.length == 1">
                  <div>{{this.selections[0].spEvent}}</div>
                </td>
                <td style="width: 50px;" v-if="selections.length == 1">车牌：</td>
                <td v-if="selections.length == 1 && (this.selections[0].spEvent=='纸券确认'||this.selections[0].spEvent=='修改操作确认') " style="min-width:100px">
                  <el-input
                    style="width: 50%"
                    type="text"
                    v-model="reqData.vehiclePlate">
                  </el-input>
                </td>
                <td style="min-width:100px" v-if="selections.length == 1 && this.selections[0].spEvent!='纸券确认'&& this.selections[0].spEvent !='修改操作确认'"><div>{{this.selections[0].vehiclePlate}}</div></td>

<!--                <td style="width: 50px;" v-if="selections.length == 1">车牌：</td>-->
<!--                <td style="min-width:100px" v-if="selections.length == 1"><div>{{this.selections[0].vehiclePlate}}</div></td>-->
                <td style="width: 100px;" v-if="selections.length == 1">出入口类型：</td>
                <td style="min-width:50px" v-if="selections.length == 1"> <div>{{this.selections[0].entryExitTypeText}}</div></td>
                <td style="width: 60px;" v-if="selections.length == 1">车道号：</td>
                <td style="min-width:50px" v-if="selections.length == 1"> <div>{{this.selections[0].laneNo}}</div></td>
                <td  style="width:75px" v-if="selections.length > 1">
                </td>
                <td>
                  <el-checkbox-group v-model="checkSyn"  >
                      <el-checkbox :key="1" :label="1" @change="checked=>handleCheckSynChange(checked, 1)"> 同步更新</el-checkbox>
                  </el-checkbox-group>
                </td>
                <td  ></td>
              </tr>
              <tr class="bg-gray">
                <td style="width:75px;max-width:75px;"><div >备注：</div></td>
                <td colspan="8" style="width:70%">
                  <el-select :clearable="false" v-model="queryParams.dailyMark" style="width: 100%" @change="dailyMarkChange">
                    <el-option
                      v-for="item in dailyMarks"
                      :key="item.content"
                      :label="item.content"
                      :value="item.content">
                    </el-option>
                  </el-select>
                </td>
                <td style="min-width: 120px"><a  style="text-decoration-line: underline;color: #1890FF;" @click="dailyMark()"   >点击维护常用备注</a></td>
              </tr>
              <tr class="bg-gray">
                <td><div style="width:70px;"></div></td>
                <td colspan="8">
                  <el-input
                    style="width: 100%"
                    type="textarea"
                    :rows="4"
                    maxlength="2000"
                    v-model="reqData.mark">
                  </el-input>
                </td>
                <td></td>
              </tr>
            </table>
          </el-row>
          <el-row style="text-align: center;margin-top: 10px;">
            <el-button type="primary" :loading="saveLoading" @click="save()">保存</el-button>
            <el-button @click="close()">取消</el-button>
          </el-row>
        </el-form>
      </div>
      <dailyMark ref="dailyMarkDialog" @refreshData="getDailyMark"/>
    </div>

  </el-dialog>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
  import {spfindPage, registerMark, synUpdate} from './laneMonitorApi';
  import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"
  import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
  import dailyMarkApi from "./dailyMarkApi";
  import dailyMark from "./dailyMark";

  export default {
    name: 'laneSpEventMark',
    components: {TiSelect,TiSysLane, tiSysOrg, dailyMark},
    mixins: [...mixin],
    data() {
      return {
        importVisible: false,
        spShow: false,
        initFlag: false,
        saveLoading: false,
        queryParams: {
          sysOrgIdStr: '',
          vehiclePlate: '',
          entryExitType: '',
          laneNo: '',
          opType: 'register',
          status:  0
        },
        dailyMarks: {},
        checkSyn: [],
        reqData:{
          mark:'',
          vehiclePlate:''
        },
        tableHeight: null,
        selections: []
      }
    },
    watch: {

    },
    mounted() {
    },
    created() {
      this.$nextTick(() => {

      });
    },
    methods: {
      /**
       * 点击 X 关闭对话框的回调
       **/
      handleDialogClose() {
        this.spShow = false;
      },
      close(){
        this.spShow = false;
      },
      init(rows) {
        this.selections = rows
        this.queryParams.dailyMark = ''
        this.getDailyMark();
        this.checkSyn = []
        this.spShow = true;
        this.reqData.mark = ''
        this.reqData.mark = this.selections[0].mark || ''
        this.reqData.vehiclePlate = this.selections[0].vehiclePlate
      },
      getDailyMark(){
        dailyMarkApi.findList({}).then((res) => {
          if(res.code == 200) {
            this.dailyMarks = res.data
          } else {
            this.$notify.error(res.message)
            return
          }
        })
      },
      dailyMarkChange(e) {
        this.reqData.mark =  this.reqData.mark  + '' + e
      },
      save(){

        const ids = this.selections.map((x) => x.id).join(',')

        if(this.checkSyn.length > 0) {
          if(!this.reqData.mark){
            this.$notify.warning('备注信息不能为空！')
            return;
          }

          this.saveLoading = true
          synUpdate({ids: ids,vehiclePlate:this.reqData.vehiclePlate, mark:this.reqData.mark}).then((res) => {
            this.saveLoading = false
            if (res.code === 200) {
              this.$notify.success(res.message)
            } else {
              this.$notify.error(res.message)
              return
            }
            // 刷新数据
            this.reqData.mark = "";
            this.selections = []
            this.spShow = false;
            this.$emit('refreshData')

          })
          return;
        }


        if(!this.reqData.mark){
          this.$notify.warning('备注信息不能为空！')
          return;
        }
        if(this.selections.length>1){
          this.reqData.vehiclePlate = null;
        }
        registerMark({ids: ids ,vehiclePlate:this.reqData.vehiclePlate ,mark:this.reqData.mark}).then((res) => {
          if (res.code === 200) {
            this.$notify.success(res.message)
          } else {
            this.$notify.error(res.message)
            return
          }
          // 刷新数据
          this.reqData.mark = "";
          this.selections = []
          this.spShow = false;
          this.$emit('refreshData')

        })
      },
      handleCheckSynChange(checked, value) {
        console.log(checked, value, this.checkSyn)
      },
      dailyMark(){
        this.$refs.dailyMarkDialog.init()
      }
    }
  }
</script>

