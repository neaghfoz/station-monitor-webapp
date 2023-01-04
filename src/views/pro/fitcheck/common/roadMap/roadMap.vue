<template>
  <el-tabs   v-model="showType" tab-position="top">
    <el-tab-pane label="通行明细" name="list">
      <slot name="content">
        <vxe-grid v-if="showTable"
          highlight-hover-row
          border
          resizable
          sync-resize
          auto-resize
          keep-source
          highlight-current-row
          max-height="600"
          class="vxe-table-element"
          :loading="loading"
          :columns="columns"
          :data="pathList"
        >
        </vxe-grid>
        <br/>
        <div style="color: red;">* &nbsp;显示所有经过的收费单元</div>
      </slot>
    </el-tab-pane>
    <el-tab-pane v-if="mapEnabled" label="路径地图" name="direct">
      <div :class="['el-card',isFull?'fullScreen':'']">
        <div v-loading="loading" class="el-card__body" style="font-size:14px;padding: 0px;
                display: flex;flex-direction: row;min-height: 500px;">
          <div :class="['path_box',imageShowFlag?'':' min']">
            <div class="title_box">
              通行路径[&nbsp;<span style="color: #dc1d1c;">经过的所有收费单元</span>&nbsp;]
              <span class="pull-right">
            <span class="marker" style="background-color:#0db90b;"></span>
            <span style="color:#0db90b;">&nbsp;原始数据</span>
            <span style="margin-left: 20px;"></span>
            <span class="marker" style="background-color:#dc1d1c;"></span>
            <span style="color:#dc1d1c;">&nbsp;补点数据</span>
          </span>
              <div style="clear: both;"></div>
            </div>
            <div style="flex: 1;overflow-y: auto;overflow-x: hidden;">
              <ul class="el-timeline" v-show="pathList.length>0">
                <li :ref="'pathShow'+index" style="left: 10px;" :class="['el-timeline-item',item.classColor]" v-for="(item,index) in pathList" :key="index">
                  <i @click="checkBox(index)" v-if="checkShowFlag && item.serialType !=1 && item.serialType !=3"></i>
                  <div class="el-timeline-item__tail"></div>
                  <div class="line--node">
                    <p  @click="isHide(index)" style="width: 100%;height: 100%">{{ item.serialType_  }}</p>
                  </div>
                  <div class="el-timeline-item__wrapper" >
                    <div class="details_box" style="display: inline-block;vertical-align: top">
                      <div v-if="item.tollIntervalName != null"><span class="spanBox">{{ item.tollIntervalName }}</span><span style="margin-left:10px">{{ item.tradeTime }}</span></div>
                      <div  v-if="item.tollIntervalName == null"><span class="spanBox">{{ item.tollIntervalId }}</span><span style="margin-left:10px">{{ item.tradeTime }}</span></div>
                      <div style="height: 30px;color:#000000;"><span>应收金额</span><span style="margin-left: 10px"> {{ item.payFeeTxt }}</span><p style="margin-left: 25px">优惠金额</p><span style="margin-left: 10px">{{ item.discountFeeTxt }}</span></div>
                      <div style="height: 30px;color:#000000;"><span>实收金额</span><span style="margin-left: 10px">{{ item.feeTxt }}</span><p style="margin-left: 25px">单元类型</p><span style="margin-left: 10px">{{ item.intervalTypeName}}</span></div>
                    </div>
                    <div v-if="imageShowFlag" :ref="'imageHide'+index" style="margin-left: 10px;display: inline-block; vertical-align: top;">
                      <el-image :src="item.imageUrl" fit="scale-down" z-index="99999" :preview-src-list="[item.imageUrl]" style="width: 120px;height: 100px;margin-top: 8px;margin-left: 10px;"/>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

          </div>
          <div class="chart_box">
            <div style="margin-left: 10px; position: relative;">
              <el-row style="position: absolute;left: 40px;top:15px;z-index: 2;">
                <slot name="btns"></slot>
              </el-row>
              <el-row :style="{position: 'absolute',right: '10px',top:'15px',zIndex:buttonZIndex}" >
                <el-button type="primary" :title="isFull?'还原':'全屏'" @click="isFull = !isFull">
                  <i class="el-icon-full-screen" v-show="!isFull"></i>
                  <i class="el-icon-copy-document" v-show="isFull"></i>
                </el-button>
                <slot name="operation"></slot>
              </el-row>
              <component v-bind:is="curMapComponent" :map-params="mapParams" v-if="isOnline"></component>
              <!--
              <online-map :map-params="mapParams" v-if="isOnline"></online-map>
              -->
              <local-map :map-params="mapParams" v-if="!isOnline" :show-line="(!restoreTypeFlag || (restoreTypeFlag && restoreType != '2'))"></local-map>
            </div>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import {defaulrImageurl,transferPathInfo} from "@/views/pro/fitcheck/common/roadMap/pathUtil"
  import {getImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi"
  import LocalMap from "./components/localMap"
  import ImgConstant from "@/views/pro/common/constant/ImgConstant"
  import {getPathList,getCloudImg} from "./roadMapApi"
  import { tibms } from '@/settings'

  export default {
    name: 'RoadMap',
    components: { LocalMap },
    mixins: [...mixin],
    props: {
      showTable: {
        type: Boolean,
        required: false,
        default: false
      },
      showMap: {
        type: Boolean,
        required: false,
        default: true
      },
      checkShow:{
        type:Boolean,
        required: false,
        default: false
      },
      restoreTypeFlag:{
        type:Boolean,
        required: false,
        default: false
      },
      restoreType:{
        type:[String,Number],
        required: false,
      },
      buttonZIndex:{
        type:String,
        required: false,
        default: '4'
      }
    },
    data() {
      return {
        curMapComponent: null,
        loading: false,
        showType: this.mapEnabled ? 'direct' : 'list',
        isFull: false,
        checkData:{},
        pathList:[],
        mapParams:{
          pathList: [],
          version: '4520200509001'
        },
        checkShowFlag:this.checkShow,
        tableData: [],
        columns: [
          {
            title: "序号",
            type: "seq",
            width: 50,
            align: "center"
          },
          {
            minWidth: 400, field: 'tollIntervalName', title: '经过的节点名称', align: 'left', headerAlign: 'center', showOverflow: true,
            slots: {
              default: ({ row }, h) => {
                return row.tollIntervalName ? '[' + row.tollIntervalId + ']' + row.tollIntervalName : '[' + row.tollIntervalId + ']' + '未知'
              }
            }
          },
          { minWidth: 100, field: 'intervalTypeName', title: '单元类型', align: 'center', showOverflow: true },
          { minWidth: 120, field: 'tradeTime', title: '交易时间', align: 'center', showOverflow: true },
          { minWidth: 100, field: 'payFeeTxt', title: '应收金额(元)', align: 'right', headerAlign: 'center', showOverflow: true },
          { minWidth: 100, field: 'feeTxt', title: '交易金额(元)', align: 'right', headerAlign: 'center', showOverflow: true },
          { minWidth: 100, field: 'discountFeeTxt', title: '优惠金额(元)', align: 'right', headerAlign: 'center', showOverflow: true }
        ],
      }
    },
    computed:{
      loadMapOnline(){
         return () => import('./components/onlineMap')
      },
      isCloud(){
        return tibms && tibms.fitcheck.model === 'cloud'
      },
      imageShowFlag(){
        return tibms && tibms.fitcheck && tibms.fitcheck.vehicleImgShow
      },
      mapEnabled() {
        return this.showMap && tibms && tibms.fitcheck && tibms.fitcheck.mapEnabled
      },
      isOnline() {
        return this.mapEnabled && tibms.fitcheck.onlineMap
      }
    },
    mounted() {
      this.initOnlineMap();
    },
    methods: {
      initOnlineMap() {
        // 动态加载在线地图
        const self = this
        if(self.isOnline){
          self.loadMapOnline().then(()=>{
            // 动态加载模板
            self.curMapComponent = ()=> self.loadMapOnline()
          })
        }
      },
      // 获取路径明细列表
      async initData({ passId,enTime }){
        if(!this.showTable && !this.mapEnabled){
          return;
        }
        this.loading = true
        try {
          const params = {
            passId: passId,
            enTime: enTime
          }
          const { data } = await getPathList({},params)
          // 更新数据
          this.pathList = data.pathInfos
          // 转化字段
          transferPathInfo(this.pathList)

          // 地图展示
          this.initMap(data.version,this.pathList)

        }finally {
          this.loading = false
        }
      },
      initMap(version,pathList){

        this.mapParams.version = version

        this.checkData = {}

        if(pathList && pathList.length>0 && this.mapEnabled) {
          // 图片展示
          if (this.imageShowFlag) {
            this.$nextTick(() => {
              this.getImgUrl(pathList)
            })
          }

          //初始化checkBox
          this.$nextTick(()=>{
            for(let i = 0;i<this.pathList.length;i++){
              if (this.$refs['pathShow'+i][0].classList.contains('check')) {
                this.$refs['pathShow'+i][0].classList.remove('check')
              }
              if(this.$refs['pathShow'+i][0].classList.contains('hide')){
                this.$refs['pathShow'+i][0].classList.remove('hide')
                this.$refs['imageHide'+i][0].style.setProperty('display','inline-block')
              }
            }
          })
          // 更新地图
          this.updateMap(pathList)
        }
      },
      async getImgUrl(pathList){
        if(!pathList || pathList.length<=0){
          return
        }
        if(!this.isCloud){
          for(let i=0;i<pathList.length;i++){
            if(pathList[i].vehicleSignId == null || pathList[i].vehicleSignId == ''){
              pathList[i].imageUrl = 'data:image/jpg;base64,' + defaulrImageurl;
            }else{
              let length =pathList[i].tollIntervalId.length;
              if(length == 14){
                pathList[i].imageUrl = 'data:image/jpg;base64,' + (await getImgBase64(pathList[i].tollIntervalId.substring(0,11),pathList[i].tollIntervalId.substring(0,14),pathList[i].vehicleSignId + '_'+ImgConstant.gdImgFix.frontPic)).data;
              }else{
                pathList[i].imageUrl = 'data:image/jpg;base64,' + (await getImgBase64(pathList[i].tollIntervalId.substring(0,11),0,pathList[i].vehicleSignId + '_'+ImgConstant.gdImgFix.gantryImage)).data;
              }
            }
          }
        }else{
          // 云版获取图片
          for(let i=0;i<pathList.length;i++){
            if(pathList[i].vehicleSignId == null || pathList[i].vehicleSignId == ''){
              pathList[i].imageUrl = 'data:image/jpg;base64,' + defaulrImageurl;
            }else{
              let length =pathList[i].tollIntervalId.length;
              if(length == 14){
                // 云版暂无收费站图片
                pathList[i].imageUrl = 'data:image/jpg;base64,' + defaulrImageurl;
              }else{
                var tollGantryId = pathList[i].tollGantryId || pathList[i].tollIntervalId ;
                var picId = pathList[i].vehicleSignId;
                var imgUrl = (await getCloudImg({ gantryId: tollGantryId ,picId: picId })).data;
                if(imgUrl){
                  pathList[i].imageUrl = imgUrl;
                }else{
                  pathList[i].imageUrl = 'data:image/jpg;base64,' + defaulrImageurl;
                }
              }
            }
          }
        }
      },
      updateMap(pathList) {
        if (!pathList || pathList.length <= 0) {
          return
        }
        let mapDataList = [];
        for (let i = 0; i < pathList.length; i++) {
          let mapData = {
            nodeId: pathList[i].tollIntervalId,
            type: pathList[i].intervalType
          }
          mapDataList.push(mapData)
        }
        this.mapParams.pathList = mapDataList
      },
      isHide(index) {
        if(this.$refs['pathShow'+index][0].classList.contains('hide')){
          this.$refs['pathShow'+index][0].classList.remove('hide');
          this.$refs['imageHide'+index][0].style.setProperty('display','inline-block');
        }else{
          this.$refs['pathShow'+index][0].classList.add('hide');
          this.$refs['imageHide'+index][0].style.setProperty('display','none');
        }
      },
      checkBox(index) {
        let path = this.pathList[index];
        if (this.$refs['pathShow'+index][0].classList.contains('check')) {
          this.$refs['pathShow'+index][0].classList.remove('check');
          delete (this.checkData[path.serialNo]);
        } else {
          this.$refs['pathShow'+index][0].classList.add('check');
          this.checkData[path.serialNo] = {
            index: index,
          }
        }
      },
      getCheckData(){
        return this.checkData
      }
    }
  }
</script>

<style scoped>
  @import "./roadMapStyle.css";
</style>
