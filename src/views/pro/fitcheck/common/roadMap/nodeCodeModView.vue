<template>
  <div class="app-container" :class="['el-card',isFull?'fullScreen':'']">
    <el-alert
      title="* 查询路网节数据->鼠标拖动节点到正确位置->鼠标左键单击一下获取坐标->保存坐标"
      type="error">
    </el-alert>
    <div style="position: relative;">
      <ti-l-map-coordinate  :params = "params"   :nodeCodeList="this.nodeCodeList" :maxZoom="18"
                            :geo-server-url="geoServerUrl"
                            @startPointSave = "this.startPointSaveMethod"
                            @endPointSave = "this.endPointSaveMethod"></ti-l-map-coordinate>
      <el-row  class="operation" align="right" >
        <el-form ref="appForm" :model="queryParams"  :show-message="false"  inline >
          <el-form-item label="版本号" prop="version" :rules="[ { required: true, message:'', trigger:'change' } ]">
            <ti-select url="/api/v1/fitcheck/nodeCodeCoordinate/version" style="width:150px;"
                       :props="{key:'version',value:'version',label:'version' }"
                       v-model="queryParams.version"
            />
          </el-form-item>
          <el-form-item label="路段" prop="sectionIdListStr" :rules="[ { required: true, message:'', trigger:'change' } ]">
            <ti-select style="width:150px;"
              :props="{key:'roadNo',value:'roadId',label:'roadName' }"
              url="/api/v1/fitcheck/nodeCodeCoordinate/findRoads"
              v-model="queryParams.sectionIdListStr"
            />
          </el-form-item>

          <el-form-item  label="类型" prop="roadNodeType" >
            <ti-select v-model="queryParams.roadNodeType" style="width:150px;"
                       :data-list="[{value:'1',name:'普通收费单元'},{value:'2',name:'省界收费单元'},{value:'3',name:'收费站'}]"
                       :props = "{key:'value', value:'value', label:'name'}"
            >

            </ti-select>
          </el-form-item>
          <el-form-item  label="行驶方向" prop="direction">
            <ti-select v-model="queryParams.direction" style="width:120px;"
                       :data-list="[{value:'1',name:'上行'},{value:'2',name:'下行'}]"
                       :props = "{key:'value', value:'value', label:'name'}"
            >

            </ti-select>
          </el-form-item>
          <el-form-item  label="节点名称" prop="roadNodeName">
            <el-input v-model="queryParams.roadNodeName" type="text" style="width:120px;" maxlength="100"/>
          </el-form-item>

          <el-form-item label="操作"  prop="sysOrgIdStr">
            <el-button type="primary" @click="submit">查询</el-button>
            <el-button type="primary" @click="this.saveEndPoint">保存坐标</el-button>
          </el-form-item>

          <el-button type="primary" :title="isFull?'还原':'全屏'" @click="isFull = !isFull">
            <i class="el-icon-full-screen" v-show="!isFull"></i>
            <i class="el-icon-copy-document" v-show="isFull"></i>
          </el-button>
        </el-form>
      </el-row>
      <el-row class="operation" v-show="endPointTableData.length>0" align="left" style="right: 0px; width: 400px;top:70px;">
        <vxe-grid
          highlight-hover-row
          border
          resizable
          sync-resize
          auto-resize
          max-height="500"
          class="vxe-table-element"
          :data="this.endPointTableData"
        >
          <vxe-table-column field="roadNodeName" title="节点名称" ></vxe-table-column>
          <vxe-table-column field="roadNodeId" title="节点编码" ></vxe-table-column>
          <vxe-table-column field="endXCode" title="纬度"></vxe-table-column>
          <vxe-table-column field="endYCode" title="经度"></vxe-table-column>
        </vxe-grid>
      </el-row>
    </div>

  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiLMapCoordinate from "@/views/pro/common/tiLMapCoordinate/tiLMapCoordinate.vue";
import TiSelectTree from "@/views/pro/common/tiElement/tiSelect/tiSelectTree";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
import {findListByVerion, saveEndPoint} from "@/views/pro/fitcheck/common/roadMap/nodeCodeModApi";
import { tibms } from '@/settings'

export default {
  name: 'fitcheck.common.roadMap.NodeCodeModView',
  components: {TiLMapCoordinate, TiSelectTree, TiSelect, tiSysOrg },
  mixins: [...mixin],
  data() {
    return {
      isFull: false,
      nodeCodeList: [],
      params: {pathList: [], version: ''},
      geoServerUrl: tibms.fitcheck.mapUrl,
      queryParams: {
        version: '',
        sectionId: '',
        roadNodeType: '',
        roadNodeName: '',
        sectionIdListStr: '',
        direction: ''
      },
      startPointTableData: [],
      startPointTableColumns: [
        {
          title: '节点名称',
          key: 'roadNodeName',
          field: 'roadNodeName',
          minWidth: 100,
          showOverflow: true
        },
        {title: '节点编码', key: 'roadNodeId', field: 'roadNodeId', minWidth: 100, showOverflow: true},
        {title: '开始纬度', key: 'startXCode', field: 'startXCode', minWidth: 100, showOverflow: true},
        {title: '开始经度', key: 'startYCode', field: 'startYCode', minWidth: 100, showOverflow: true},
      ],
      endPointTableData: [],
      endPointTableColumns: [
        {
          title: '节点名称',
          key: 'roadNodeName',
          field: 'roadNodeName',
          minWidth: 100,
          showOverflow: true
        },
        {title: '节点编码', key: 'roadNodeId', field: 'roadNodeId', minWidth: 100, showOverflow: true},
        {title: '结束纬度', key: 'endXCode', field: 'endXCode', minWidth: 100, showOverflow: true},
        {title: '结束经度', key: 'endYCode', field: 'endYCode', minWidth: 100, showOverflow: true},
      ]
    }
  },
  mounted() {
  },
  methods: {
    submit(){
      this.$refs['appForm'].validate((valid) => {
        if (valid) {
          this.getData();
        } else {
          return false;
        }
      })
    },
    async getData() {
      const {data} = await findListByVerion(this.queryParams);
      this.nodeCodeList= data;
      this.queryParams.roadNodeName='';
    },
    startPointSaveMethod: function(data){
      var existFlag = 0;
      for (var index =0; index < this.startPointTableData.length; index++){
        if(data.roadNodeId == this.startPointTableData[index].roadNodeId){

          existFlag = 1;
          this.startPointTableData[index].startXCode = data.startXCode;
          this.startPointTableData[index].startYCode = data.startYCode;
          break;
        }

      }

      if(!existFlag) {
        this.startPointTableData.push(Object.assign({},{roadNodeName:data.roadNodeName, roadNodeId:data.roadNodeId, startXCode:data.startXCode, startYCode:data.startYCode}));
      }

    },
    endPointSaveMethod:function(data){
      //更新结束列表
      var existFlag = 0;
      for (var index =0; index < this.endPointTableData.length; index++){
        if(data.roadNodeId == this.endPointTableData[index].roadNodeId){
          existFlag = 1;
          this.endPointTableData[index].endXCode = data.endXCode;
          this.endPointTableData[index].endYCode = data.endYCode;
          break;
        }
      }
      if(!existFlag) {
        this.endPointTableData.push(Object.assign({},{roadNodeName:data.roadNodeName, roadNodeId:data.roadNodeId, endXCode:data.endXCode, endYCode:data.endYCode}));
      }
    },
    saveEndPoint: function(){
      if(this.endPointTableData.length <=0) {
        this.$notify.error('请修正坐标后再保存')
        return
      }
      this.saveEndData();
      this.endPointTableData= [];
    } ,
    async saveEndData() {
      // 每次查询初始化checkbox selections
      const { code } = await saveEndPoint(Object.assign({}, {saveList: this.endPointTableData}));
      if(code == 200){
        this.$notify.success('保存成功')
      }
    }
  }
}
</script>

<style scoped>
  .operation{
    right:0px;position: absolute; top: 0px; z-index: 9999; background-image: -webkit-linear-gradient(right, rgba(220, 132, 158, 0.6) 0%, rgba(158, 192, 239, 0.6) 100%);padding-top:18px;padding-left:10px;padding-right:10px;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .fullScreen{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: .5em 1em;
    background-color: #fff;
    z-index: 1005;
  }
</style>
