<template>
  <div id="map" >
  </div>
</template>

<script>
// 引入类库
import { getData } from './tiLMapNumApi'

import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator"
import { tibms } from '@/settings'

export default {
  name: 'TiLMapNum',
  components: {},
  props: {
    // 瓦片地图url
    geoServerUrl: {
      type: String,
      //default: 'http://10.44.76.143:8888/OSM/map/{z}/{x}/{y}.png', // 深高瓦片服务地址
      //default: 'http://10.173.235.140:8888/OSM/map/{z}/{x}/{y}.png', // 测试瓦片服务地址
      default: tibms.mapUrl,
      required: false
    },
    coordinateUrl: {
      type: String,
      default: '/api/v1/audit/nodeCodeCoordinate/coordinate', // 坐标参数地址
      required: false
    },
    zoom: {
      type: Number,
      default: 14,
      required: false
    },
    minZoom: {
      type: Number,
      default: 10,
      required: false
    },
    maxZoom: {
      type: Number,
      default: 18,
      required: false
    },
    // 路径颜色
    lineColor: {
      type: String,
      default: '#00C957',
      required: false
    },
    // 路径
    params: {
      type: Object,
      default: null,
      required: false
    },
    // 参数版本
    version: {
      type: String,
      default: '0',
      required: false
    },
    //图层透明度
    opacity:{
      type: String,
      default: '0.5',
      required: false
    }
  },
  data() {
    return {
      map: null,
      mapLayer: null,
      pointLayer: null,
      lineLayer: null,
      arrowLayer: null,
      markerLayer:null,
      data:[],
      markers: {
        // 注：现有编辑 1 正常 2 异常
        num_1 :{
          iconUrl: require('@/assets/img/num_1.png'),
          iconSize:     [42, 60], // size of the icon
          iconAnchor:   [21, 60], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -61]
        },
        num_2 :{
          iconUrl: require('@/assets/img/num_2.png'),
          iconSize:     [42, 60], // size of the icon
          iconAnchor:   [21, 60], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -61]
        }
      },
      icons: {},
      colors:{},

    }
  },
  mounted() {
    this.initMap()
    this.initIcons()
    this.initColors()
    this.getData(this.params)
  },
  watch: {
    params: {
      handler: function(newParams, oldParams) {
        //console.log('paths change111 newParams', newParams)
        this.getData(newParams)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 初始化地图
    initMap: function() {

      //设置地图底图 + 版权信息
      this.mapLayer = L.tileLayer(  this.geoServerUrl, {
           attribution: '&copy; <a href="http://my.hgits.cn">Hgits Soft</a> contributors', opacity: this.opacity});

      var defaultOption = {
        center: [22.681739, 114.030937],
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        crs: L.CRS.EPSG3857,
        opacity: 0.6,
      }

      this.map = L.map(
        'map',
        defaultOption
      );

      this.map.addLayer(this.mapLayer)

    },
    // 初始化icons
    initIcons: function() {
      for(var key in  this.markers) {
        // console.log('this.markers', key)
        // console.log('this.markers values', this.markers[key]);
        this.icons[key] = L.icon(this.markers[key]);
      }
      // console.log("this.icons", this.icons);

    },
    initColors:function(){
      this.colors[1] = '#00ff58'
      this.colors[2] = '#00ff58'
      this.colors[3] = '#00ff58'
      this.colors[4] = '#ec7070'
      this.colors[5] = '#ec7070'
      this.colors[6] = '#ec7070'



    },
    // 清除线路，标点图层
    clearLayers: function() {
      // 先移除现有图层
      if (this.lineLayer) {
        this.map.removeLayer(this.lineLayer)
        this.lineLayer = null
      }
      if (this.arrowLayer) {
        this.map.removeLayer(this.arrowLayer)
        this.arrowLayer = null
      }
      if (this.markerLayer) {
        this.map.removeLayer(this.markerLayer)
        this.markerLayer = null
      }

    },
    async getData(params) {
      //console.log("params11", params);
      var this_ = this;
      const res = await getData(this.coordinateUrl,params)
      this.clearLayers();
      //this_.clearLayers();
      if (res.code == 200 && res.data.markerVoList.length >0) {
        //console.log('res', res)
        //this.pathList = res.data.pathList
        //console.log("this.data = res.data;", res.data.routeList);
        this.data = res.data;
        this.reDraw();
        //console.log("res.data.coordinates", res.data)
        //根据 data 绘制收费单元与线路
        //this.addNodes()
        //this.addLine()
      }
    },
    reDraw: function () {
      //var pathList = this.data.pathList;
      var markerVoList = this.data.markerVoList;


      if ( markerVoList ==null || markerVoList.length ==0) {
        return
      }

      //this.lineLayer =  new L.LayerGroup();
      //this.arrowLayer=  new L.LayerGroup();
      this.markerLayer =  new L.LayerGroup();

      console.log("markerVoList", markerVoList);


      var myIcon = L.divIcon({className: 'my-div-icon'});



      var tmpIcon;
      var marker;
      const linePaths = []
      for (let i = 0; i < markerVoList.length; i++) {


            tmpIcon = this.icons['num_' + markerVoList[i].type];


          //L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
          //
          // marker = L.marker([markerVoList[i].xcode, markerVoList[i].ycode],
          //   {icon: myIcon});
          // let svgContent = `<svg class="icon" width="30" height="30" fill="#1afa29" aria-hidden="true"><use xlink:href="#icon-tubiao_jingdongtieta" /></svg>`;
          // // let divContent = `<p style="color:white">${this.placeName}</p>`;
          // let customColorIcon = L.divIcon({
          //   iconSize: [30, 30],
          //   className: "custom-color-icon",
          //   html: svgContent
          // });
          //
          // marker = L.marker([markerVoList[i].xcode, markerVoList[i].ycode], {
          //   icon: customColorIcon
          //   , place: item.place
          // });
          marker = L.marker([markerVoList[i].xcode, markerVoList[i].ycode],
            {draggable: true, icon: tmpIcon, opacity:0.8 })
          ;

          var htmlContent = "<div style='line-height:80px;display: flex;align-items: center;justify-content: center;'><font face='宋体' size=5 color='#f0f8ff'>" + (i+1) + "</font></div>";
          this.markerLayer.addLayer(marker);
          var myIcon = L.divIcon({className: 'my-div-icon', html:htmlContent,         iconSize: [42, 60],//marker宽高
            iconAnchor:  [20, 76] , popupAnchor:[0,-61], zIndexOffset: 4000});
          marker = L.marker([markerVoList[i].xcode, markerVoList[i].ycode], {icon: myIcon}).bindPopup(markerVoList[i].roadNodeName , {autoClose: false}).openPopup()
          this.markerLayer.addLayer(marker);
          linePaths.push([markerVoList[i].xcode, markerVoList[i].ycode]);


      }


      var path = L.polyline(linePaths, {color: this.lineColor, lineCap:"square",fillRule:"nonzero",noClip:"true", draggable: true, weight:10});

      //debugger;
      this.map.addLayer(this.markerLayer)

      this.map.fitBounds(path.getBounds());



    }
  }
}
</script>

<style  scoped>
  /* 设置样式否则 高度为0 */
  #map {
    width: 100%;
    height: calc(100vh);
    z-index: 1;
  }
  .my-div-icon{
    align-content: center;
  }
</style>
