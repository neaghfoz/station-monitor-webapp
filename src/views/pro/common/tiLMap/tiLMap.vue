<template>
  <div id="map" >
  </div>
</template>

<script>
// 引入类库
import { getData } from './tiLMapApi'

import L from 'leaflet'
import "leaflet/dist/leaflet.css";

export default {
  name: 'TiLMap',
  components: {},
  props: {
    // 瓦片地图url
    geoServerUrl: {
      type: String,
      default: 'http://127.0.0.1:8888/openlayers/map/{z}/{x}/{y}.png',
      required: false
    },
    zoom: {
      type: Number,
      default: 7,
      required: false
    },
    minZoom: {
      type: Number,
      default: 13,
      required: false
    },
    maxZoom: {
      type: Number,
      default: 17,
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
    }
  },
  data() {
    return {
      map: null,
      mapLayer: null,
      pointLayer: null,
      lineLayer: null,
      data:[],
      markers: {
        start_1 :{
          iconUrl: require('@/assets/img/start_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        start_2 :{
          iconUrl: require('@/assets/img/start_2.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        start_3 :{
          iconUrl: require('@/assets/img/start_3.png'),
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
        middle_1 :{
          iconUrl: require('@/assets/img/middle_green.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_2 :{
          iconUrl: require('@/assets/img/middle_2.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_3 :{
          iconUrl: require('@/assets/img/middle_3.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        middle_4 :{
          iconUrl: require('@/assets/img/middle_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },        end_1 :{
          iconUrl: require('@/assets/img/end_blue.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_2 :{
          iconUrl: require('@/assets/img/end_2.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_3 :{
          iconUrl: require('@/assets/img/end_3.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        },
        end_4 :{
          iconUrl: require('@/assets/img/end_red.png'),
          iconSize:     [19, 31], // size of the icon
          iconAnchor:   [10, 31], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -31]
        }
      },
      icons: {}

    }
  },
  mounted() {
    this.initMap()
    this.initIcons()
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
           attribution: '&copy; <a href="http://my.hgits.cn">Hgits Soft</a> contributors'});

      var defaultOption = {
        center: [22.681739, 114.030937],
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        crs: L.CRS.EPSG3857,
      }

      this.map = L.map(
        'map',
        defaultOption
      );
      this.mapLayer.addTo(this.map);

    },
    // 初始化icons
    initIcons: function() {
      for(var key in  this.markers) {
        console.log('this.markers', key)
        console.log('this.markers values', this.markers[key]);
        this.icons[key] = L.icon(this.markers[key]);
      }
      console.log("this.icons", this.icons);

    },
    addLine: function() {
      // const _that = this
      //console.log("this.data", this.data)
      if ( this.data.lineList.length <= 0) {
        //console.log("this.data", this.data)
        return
      }
      // 路径坐标集合
      const linePaths = []
      for (let i = 0; i < this.data.lineList.length; i++) {
        //linePaths.push([this.pathList[i].ycode, this.pathList[i].xcode])
        linePaths.push([this.data.lineList[i].y, this.data.lineList[i].x])

      }

      var path = L.polyline(linePaths, {color: this.lineColor, lineCap:"square",fillRule:"nonzero",noClip:"true"});
      this.lineLayer = path;
      path.addTo(this.map);
      //this.map.setView(path.getCenter());

    },
    addNodes: function() {
      // const _that = this
      if (typeof (this.data)== "undefined" || this.data.pointList.length <= 0) {
        return
      }
      //开始结束坐标
      var startIndex = 0;
      var endIndex = this.data.pointList.length -1;
      var prefix ;

      var pointLayer  = L.featureGroup();

      for (let i = 0; i < this.data.pointList.length; i++) {

        if (i == startIndex) {
          prefix = 'start_' + this.data.pointList[i].type;
        }  else if (i == endIndex) {
          prefix = 'end_' + this.data.pointList[i].type;
        } else {
          prefix = 'middle_' + this.data.pointList[i].type;
        }
        var marker  = L.marker([this.data.pointList[i].xcode, this.data.pointList[i].ycode ], {icon: this.icons[prefix]})
                      .bindTooltip(this.data.pointList[i].title).openTooltip();
        pointLayer.addLayer(marker);
      }

      this.pointLayer = pointLayer;
      this.pointLayer.addTo(this.map);


    },
    // 清除线路，标点图层
    clearLayers: function() {
      // 先移除现有图层
      if (this.pointLayer) {
        this.map.removeLayer(this.pointLayer)
        this.pointLayer = null
      }
      if (this.lineLayer) {
        this.map.removeLayer(this.lineLayer)
        this.lineLayer = null
      }
    },
    async getData(params) {
      const res = await getData(params)
      this.clearLayers()
      if (res.code === 200) {
        //console.log('res', res)
        //this.pathList = res.data.pathList
        this.data = res.data;
        //console.log("res.data.coordinates", res.data)
        //根据 data 绘制收费单元与线路
        this.addNodes()
        this.addLine()
      }
    }
  }
}
</script>

<style  scoped>
  /* 设置样式否则 高度为0 */
  #map {
    width: 100%;
    height: calc(100vh);
  }
</style>
