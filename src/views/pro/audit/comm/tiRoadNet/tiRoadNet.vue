<template>
  <div :class="['el-card',isFull?'fullScreen':'']">
    <div class="el-card__body" style="font-size:14px;padding: 0px;
                display: flex;flex-direction: row;min-height: 500px;">
      <div :class="['path_box',imageShowFlag?'':' min']">
        <div class="title_box">
          通行路径
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
                  <div style="height: 30px"><span>应收金额</span><span style="margin-left: 10px"> {{ item.payFeeTxt }}</span><p style="margin-left: 25px">优惠金额</p><span style="margin-left: 10px">{{ item.discountFeeTxt }}</span></div>
                  <div style="height: 30px"><span>实收金额</span><span style="margin-left: 10px">{{ item.feeTxt }}</span><p style="margin-left: 25px">单元类型</p><span style="margin-left: 10px">{{ item.intervalTypeName}}</span></div>
                </div>
                <div v-if="imageShowFlag" :ref="'imageHide'+index" style="margin-left: 10px;display: inline-block; vertical-align: top;">
                  <el-image :src="item.imageUrl" fit="scale-down" :preview-src-list="[item.imageUrl]" style="width: 120px;height: 100px;margin-top: 8px;margin-left: 10px;"/>
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
<!--            <div class="btn_box">-->
<!--              -->
<!--            </div>-->
          </el-row>
          <el-row :style="{position: 'absolute',right: '10px',top:'15px',zIndex:buttonZIndex}" >
            <el-button type="primary" :title="isFull?'还原':'全屏'" @click="isFull = !isFull">
              <i class="el-icon-full-screen" v-show="!isFull"></i>
              <i class="el-icon-copy-document" v-show="isFull"></i>
            </el-button>
            <slot name="operation"></slot>
          </el-row>
          <div v-if="(!restoreTypeFlag || (restoreTypeFlag && restoreType != '2')) && pathList.length>0">
            <ti-l-map  :params = "mapParams"  ></ti-l-map>
          </div>
          <div v-if="restoreTypeFlag && restoreType == '2' && pathList.length>0">
            <ti-l-map-num :params = "mapParams"  ></ti-l-map-num>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin';
  import {defaulrImageurl,transferPathInfo} from "@/views/pro/audit/comm/util/pathUtil"
  import {getImgBase64} from "@/views/pro/common/tiApi/tiImage/tiImageApi";
  import TiLMap from "@/views/pro/common/tiLMap/tiLMap2";
  import TiLMapNum from "@/views/pro/common/tiLMap/tiLMapNum"
  import ImgConstant from "@/views/pro/common/constant/ImgConstant";

  export default {
    name: "tiRoadNet",
    components: {TiLMap,TiLMapNum},
    mixins: [...mixin],
    props:{
      pathInfoList:{
        type:Array,
        required:false
      },
      imageShow:{
        type:Boolean,
        required: false,
        default: false
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
        isFull: false,
        // geoServerUrl:'http://10.173.235.140:8888/OSM/map/{z}/{x}/{y}.png',
        checkData:{},
        pathList:[],
        mapParamsFlag:true,
        mapParams:{
          pathList: [],
          version: '4420200101001'
        },
        imageShowFlag:this.imageShow,
        checkShowFlag:this.checkShow
      }
    },
    watch:{
      pathInfoList:{
        handler: function(newParams, oldParams) {
          console.log("newParams:",newParams);
          this.initData(newParams);
        }
      }
    },
    async created() {
      // const {data} = getVersion();
      // this.mapParams.version = data;
      this.initData(this.pathInfoList)
    },
    // computed:{
    //   pathList(){
    //     let pathList = [];
    //     if(this.pathInfoList && this.pathInfoList.length>0){
    //       pathList = transferPathInfo(this.pathInfoList);
    //       this.getImgUrl(pathList);
    //       this.mapParams.pathList = this.setMapDataList(pathList);
    //     }
    //     return pathList;
    //   },
    // },
    methods: {
      initData(pathList){
        this.checkData = {};
        if(pathList && pathList.length>0){
         transferPathInfo(pathList);
          if(this.mapParamsFlag){
            this.setMapDataList(pathList);
          }
          if(this.imageShowFlag){
            this.$nextTick(()=>{
              this.getImgUrl(pathList);
            })
          }

          this.pathList = pathList;
          //初始化checkBox
          this.$nextTick(()=>{
          for(let i = 0;i<this.pathList.length;i++){
            if (this.$refs['pathShow'+i][0].classList.contains('check')) {
              this.$refs['pathShow'+i][0].classList.remove('check');
            }
            if(this.$refs['pathShow'+i][0].classList.contains('hide')){
              this.$refs['pathShow'+i][0].classList.remove('hide');
              this.$refs['imageHide'+i][0].style.setProperty('display','inline-block');
            }
          }
          });
        }
        // console.log("pathList11111:",this.pathList);

      },
      async  getImgUrl(pathList){
        if(!pathList || pathList.length<=0){
          return;
        }
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
       // return  'data:image/jpg;base64,' + (await getImgBase64(item.vehicleSignId + '_frontPic')).data;
        // return item.imageUrl;

      },
      setMapDataList(pathInfoList) {

        if (!pathInfoList || pathInfoList.length <= 0) {
          return;
        }
        let mapDataList = [];
        for (let i = 0; i < pathInfoList.length; i++) {
          let mapData = {
            nodeId: pathInfoList[i].tollIntervalId,
            type: pathInfoList[i].intervalType
          }
          mapDataList.push(mapData);
        }
        this.mapParams.pathList = mapDataList;
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
        return this.checkData;
      }
    }
  }
</script>

<style scoped>
  @import "../../../fitcheck/common/roadMap/roadMapStyle.css";
</style>
