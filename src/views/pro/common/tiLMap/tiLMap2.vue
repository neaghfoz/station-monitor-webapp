<template>
  <div id="map" >
  </div>
</template>

<script>
// 引入类库
import { getData } from './tiLMap2Api'

import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator"
import { tibms } from '@/settings'

export default {
  name: 'TiLMap2',
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
        // 注：现有编辑 1、2、3 使用浅蓝 4、5、6 使用粉红
        start_1 :{
          iconUrl: require('@/assets/img/start_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        start_2 :{
          iconUrl: require('@/assets/img/start_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        start_3 :{
          iconUrl: require('@/assets/img/start_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        start_4 :{
          iconUrl: require('@/assets/img/start_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        start_5 :{
          iconUrl: require('@/assets/img/start_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        start_6 :{
          iconUrl: require('@/assets/img/start_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_1 :{
          iconUrl: require('@/assets/img/middle_green.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_2 :{
          iconUrl: require('@/assets/img/middle_green.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_3 :{
          iconUrl: require('@/assets/img/middle_green.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_4 :{
          iconUrl: require('@/assets/img/middle_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_5 :{
          iconUrl: require('@/assets/img/middle_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_6 :{
          iconUrl: require('@/assets/img/middle_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_1 :{
          iconUrl: require('@/assets/img/end_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_2 :{
          iconUrl: require('@/assets/img/end_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_3 :{
          iconUrl: require('@/assets/img/end_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_4 :{
          iconUrl: require('@/assets/img/end_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_5 :{
          iconUrl: require('@/assets/img/end_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_6 :{
          iconUrl: require('@/assets/img/end_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
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
      if (res.code == 200 && res.data.pathList.length >0) {
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
      var pathList = this.data.pathList;
      var markerVoList = this.data.markerVoList;


      if ( pathList ==null || pathList.length ==0) {
        return
      }

      this.lineLayer =  new L.LayerGroup();
      this.arrowLayer=  new L.LayerGroup();
      this.markerLayer =  new L.LayerGroup();

      console.log("markerVoList", markerVoList);


      var tmpIcon;
      var marker;
      for (let i = 0; i < markerVoList.length; i++) {
        tmpIcon = this.icons['middle_' + markerVoList[i].type];

        if (markerVoList[i].roadNodeType == '3') {
          if (i == 0) {
            tmpIcon = this.icons['start_' + markerVoList[i].type];
          } else {
            tmpIcon = this.icons['end_' + markerVoList[i].type];
          }
          marker = L.marker([markerVoList[i].xcode, markerVoList[i].ycode],
            {draggable: true, icon: tmpIcon, zIndexOffset: 3000})
          .bindPopup(markerVoList[i].roadNodeName + '站', {autoClose: false}).openPopup();

        } else {
          marker = L.marker([markerVoList[i].xcode, markerVoList[i].ycode],
            {draggable: true, icon: tmpIcon})
          .bindPopup(markerVoList[i].roadNodeName, {autoClose: false}).openPopup();

        }
        this.markerLayer.addLayer(marker);
      }


      const linePaths = []
      for (let j = 0; j < pathList.length; j++) {
        linePaths.push([pathList[j].y,pathList[j].x])
      }

      var path = L.polyline(linePaths, {color: this.lineColor, lineCap:"square",fillRule:"nonzero",noClip:"true", draggable: true, weight:10});


      var arrow = L.polylineDecorator(linePaths, {
        patterns: [
          {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions: {fillOpacity: 1, weight: 0, color:'#FFFFFF'}})}
        ]
      })

      this.arrowLayer.addLayer(arrow);
      this.lineLayer.addLayer(path);

      this.map.addLayer(this.markerLayer)
      this.map.addLayer(this.arrowLayer)
      this.map.addLayer(this.lineLayer)

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
</style>
