<template>
  <div id="map" >
    <div id="latitude"></div>
    <div id ="longitude"></div>

  </div>
</template>

<script>
// 引入类库


import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator"
import "leaflet.markercluster"

// L.MarkerEx = L.Marker.extend({
//   _customAttr:{},
//   setAttr(options){
//     Object.assign(this._customAttr,options)
//   },
//   getAttr(){
//     return this._customAttr;
//   },
//   markerEx(latlng, options){
//     return new L.Marker(latlng, options);
//   }
//
// });

//扩展marker增加data 属性
L.MarkerEx = L.Marker.extend({
  _customAttr:{},
  setAttr(options){
    Object.assign(this._customAttr,options)
  },
  getAttr(){
    return this._customAttr;
  }
});

L.markerEx=function(latlon){
  return new L.MarkerEx(latlon);
}

L.markerEx=function (latlng, options) {
  return new L.MarkerEx(latlng, options);
}





export default {
  name: 'TiLMapCoordinate',
  components: {},
  props: {
    // 瓦片地图url
    geoServerUrl: {
      type: String,
      // default: 'http://10.173.235.140:8888/OSM/map/{z}/{x}/{y}.png',
      required: false
    },
    zoom: {
      type: Number,
      default: 7,
      required: false
    },
    minZoom: {
      type: Number,
      default: 10,
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
    },
    nodeCodeList: {
      type: Array,
      default:[],
      required: false
    }

  },
  data() {
    return {
      map: null,
      mapLayer: null,
      markerLayer: null,
      lineLayer: null,
      arrowLayer:null,
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
    //this.getData(this.params)
  },
  watch: {
    params: {
      handler: function(newParams, oldParams) {
        //console.log('paths change111 newParams', newParams)
        //this.getData(newParams)
      },
      deep: true,
      immediate: true
    },
    nodeCodeList:{
      handler: function(newParams, oldParams) {
        //console.log('paths change111 newParams', newParams)
        this.reDraw(newParams)
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
           attribution: '&copy; <a href="http://my.hgits.cn">Hgits Soft</a> contributors' ,opacity: 0.7,});

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
        //console.log('this.markers', key)
        //console.log('this.markers values', this.markers[key]);
        this.icons[key] = L.icon(this.markers[key]);
      }
      //console.log("this.icons", this.icons);

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
    // 清除线路，标点图层
    clearLayers: function() {



      // 先移除现有图层
      if (this.lineLayer) {
        this.map.removeLayer(this.lineLayer)
      }
      this.lineLayer = null ;

      if (this.arrowLayer) {
        for (var i ; i< this.arrowLayer.length; i ++) {
          this.map.removeLayer(this.arrowLayer[i])
        }
      }
      this.arrowLayer = null ;

      console.log("this.markerLayer", this.markerLayer)

      if (this.markerLayer) {
        for (var i ; i< this.markerLayer.length; i ++) {
          this.map.removeLayer(this.markerLayer[i])
        }
        this.markerLayer.clearLayers();
      }

      this.markerLayer = null ;

      console.log("this.markerLayer", this.markerLayer)

    },
    reDraw: function(nodeCodeList){
      var this_ = this;

      console.log("nodeCodeList", nodeCodeList);
      //console.log("this.data", this.data)
      if ( nodeCodeList.length <= 0) {
        return
      }
      // 路径坐标集合
      this.clearLayers();

      // this.lineLayer = new Array();
      // this.arrowLayer= new Array();
      // this.markerLayer = new Array();

      this.lineLayer =  new L.LayerGroup();
      this.arrowLayer=  new L.LayerGroup();
      this.markerLayer =  new L.LayerGroup();

      var lastLine  = null;




      for (let i = 0; i < nodeCodeList.length; i++) {

        if(nodeCodeList[i].roadNodeType =='3') {

          var startMarker  = L.markerEx([nodeCodeList[i].startXCode, nodeCodeList[i].startYCode ], {draggable: true,icon: this.icons['start_2']})
          //.addTo(this.map)
          .bindPopup(nodeCodeList[i].roadNodeName + '站-起点', {autoClose:false}).openPopup();
          //startMarker.setAttr({name:"张三",sex:"未知",age:"18"});
          startMarker.setAttr(Object.assign({},nodeCodeList[i],{startType:1}));
          startMarker.on('click',function (evt) {
            var LatLng = evt.target.getLatLng();
            var result = Object.assign({},nodeCodeList[i],{startType:1},{startXCode: LatLng.lat.toFixed(6)}, {startYCode: LatLng.lng.toFixed(6)})
            this_.$emit('startPointSave',result)
          })


          var endMarker  = L.markerEx([nodeCodeList[i].endXCode, nodeCodeList[i].endYCode ], {draggable: true,icon: this.icons['end_3'] , opacity: 0.7})
          //.addTo(this.map)
          .bindPopup(nodeCodeList[i].roadNodeName + '站-终点', {autoClose:false}).openPopup();
          //startMarker.setAttr({name:"张三",sex:"未知",age:"18"});
          endMarker.setAttr(Object.assign({},nodeCodeList[i],{startType:2}));
          endMarker.on('click',function (evt) {
            var LatLng = evt.target.getLatLng();
            var result = Object.assign({},nodeCodeList[i],{startType:2},{endXCode: LatLng.lat.toFixed(6)}, {endYCode: LatLng.lng.toFixed(6)})
            this_.$emit('endPointSave', result);
          })
          //this.markerLayer.push(startMarker);
          //this.markerLayer.push(endMarker);
          this.markerLayer.addLayer(endMarker);
          //debugger;
          //this.markerLayer.addLayer(startMarker);
          //this.markerLayer.addLayer(endMarker);
          //debugger;
        } else {
          //debugger;
          // const linePaths = []
          // linePaths.push([nodeCodeList[i].startXCode, nodeCodeList[i].startYCode]);
          // linePaths.push([nodeCodeList[i].endXCode, nodeCodeList[i].endYCode]);
          // var path = L.polyline(linePaths, {color: this.randomColor(), lineCap:"square",fillRule:"nonzero",noClip:"true", draggable: true});
          // //this.lineLayer.push(path);
          // //path.addTo(this.map);
          // //markers.addLayer(path);
          // lastLine= path;
          //
          //
          //
          // var arrow = L.polylineDecorator(linePaths, {
          //   patterns: [
          //     {offset: 25, repeat: 50, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {fillOpacity: 1, weight: 0}})}
          //   ]
          // })//.addTo(this.map);
          //
          //
          //
          // var startMarker  = L.markerEx([nodeCodeList[i].startXCode, nodeCodeList[i].startYCode ], {draggable: true,icon: this.icons['start_2']})
          // .addTo(this.map)
          // .bindPopup(nodeCodeList[i].roadNodeName + '起点', {autoClose:false}).openPopup();
          // //startMarker.setAttr({name:"张三",sex:"未知",age:"18"});
          // startMarker.setAttr(Object.assign({},nodeCodeList[i],{startType:1}));
          // startMarker.on('click',function (evt) {
          //   var LatLng = evt.target.getLatLng();
          //   var result = Object.assign({},nodeCodeList[i],{startType:1},{startXCode: LatLng.lat.toFixed(6)}, {startYCode: LatLng.lng.toFixed(6)})
          //   this_.$emit('startPointSave',result)
          // })




          //this.markerLayer.addLayer(startMarker);

          //this.arrowLayer.addLayer(arrow);
          //this.lineLayer.addLayer(path);

          var endMarker  = L.markerEx([nodeCodeList[i].endXCode, nodeCodeList[i].endYCode ], {draggable: true,icon: this.icons['end_3'], opacity: 0.7})
          .addTo(this.map)
          .bindPopup(nodeCodeList[i].roadNodeName + '终点', {autoClose:false}).openPopup();
          //startMarker.setAttr({name:"张三",sex:"未知",age:"18"});
          endMarker.setAttr(Object.assign({},nodeCodeList[i],{startType:2}));
          endMarker.on('click',function (evt) {
            var LatLng = evt.target.getLatLng();
            var result = Object.assign({},nodeCodeList[i],{startType:2},{endXCode: LatLng.lat.toFixed(6)}, {endYCode: LatLng.lng.toFixed(6)})
            this_.$emit('endPointSave', result);
          })

          this.markerLayer.addLayer(endMarker);
        }
        //
        // this.markerLayer.push(startMarker);
        // this.markerLayer.push(endMarker);
        // this.arrowLayer.push(arrow)
        // this.lineLayer.push(path)


      }

      // debugger;
      //
      // debugger;
      // this.map.addLayer(this.arrowLayer)
      // debugger;
      // this.map.addLayer(this.lineLayer)
      // debugger;
      //   if ( lastLine != null ) {
      //     this.map.setView(lastLine.getCenter());
      //   }
      this.map.addLayer(this.markerLayer)

    },
    randomColor: function(){

      return '#'+Math.floor(Math.random()*16777215).toString(16);

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
