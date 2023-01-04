<template>
  <div id="map" ref="rootmap">
<!--    <img src= '~@/assets/img/arrow.png' />-->
  </div>
</template>

<script>
// 引入类库
import 'ol/ol.css'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Map, View, Feature } from 'ol'
import { Style, Icon, Stroke, Circle } from 'ol/style'
import Text from 'ol/style/Text'
import Fill from 'ol/style/Fill'
import { Point, LineString } from 'ol/geom'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import axios from 'axios'
import { getData } from './tiMapApi'

export default {
  name: 'TiMap',
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
      default: 14,
      required: false
    },
    // 路径颜色
    lineColor: {
      type: Array,
      default: function() {
        return [0, 51, 204, 0.8]
      },
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
      mapView: null,
      routeLayer: null,
      nodesLayer: null,
      pathList: []
    }
  },
  mounted() {
    this.initMap()
    // this.getData()
    this.getData(this.params)
  },
  watch: {
    params: {
      handler: function(newParams, oldParams) {
        console.log('paths change111 newParams', newParams)
        this.getData(newParams)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 初始化地图
    initMap: function() {
      this.mapLayer = this.initMapLayer()
      console.log('this.mapLayer', this.mapLayer)
      var defaultOption = {
        target: this.$refs.rootmap,
        layers: [this.mapLayer],
        view: new View({
          // 深圳经纬度
          center: [114.07, 22.62],
          zoom: this.zoom,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          projection: 'EPSG:4326',
          extent: [73.66, 3.86, 135.05, 53.55]
        })
      }
      this.map = new Map(defaultOption)
      // console.log('this.map', this.map)
    },
    // 获取
    initMapLayer: function() {
      var _url = this.geoServerUrl
      var defaultOption = {
        source: new XYZ({
          url: _url
        })
      }
      return new TileLayer(defaultOption)
    },
    addNodes: function() {
      var iconFeatures = this.getNodes()
      var vectorSource = new VectorSource({
        features: iconFeatures
      })
      var nodesLayer = new VectorLayer({
        source: vectorSource
      })
      this.nodesLayer = nodesLayer
      this.map.addLayer(nodesLayer)
    },
    getNodes: function() {
      var markerList = []
      for (let i = 0; i < this.pathList.length; i++) {
        var marker = new Feature({
          geometry: new Point([this.pathList[i].ycode, this.pathList[i].xcode]),
          population: 4000,
          rainfall: 500
        })
        // 获取图片前缀
        var prefix
        switch (i) {
          case 0 :
            prefix = 'start_'
            break
          case this.pathList.length - 1 :
            prefix = 'end_'
            break
          default:
            prefix = 'middle_'
            break
        }

        var iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 31],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            // src: require('@/assets/img/' + prefix + this.pathList[i].type + '.png')
            src: require('@/assets/img/' + prefix + '1' + '.png')
          }),
          text: new Text({
            textAlign: 'center',
            //text: this.pathList[i].title,
            text: 'test',
            offsetX: 30,
            offsetY: -18
          })
        })
        marker.setStyle(iconStyle)
        markerList.push(marker)
      }
      return markerList
    },
    addLine: function() {
      // const _that = this
      if (this.pathList.length <= 0) {
        return
      }
      // 路径坐标集合
      const linePaths = []
      for (let i = 0; i < this.pathList.length; i++) {
        //linePaths.push([this.pathList[i].ycode, this.pathList[i].xcode])
        linePaths.push([this.pathList[i].x, this.pathList[i].y])
      }
      // 标记数据集
      var source = new VectorSource()
      // 标记层
      var layer = new VectorLayer({
        source: new VectorSource()
      })
      var geometry = new LineString([])
      for (var i = 0; i < linePaths.length; i++) {
        geometry.appendCoordinate(linePaths[i])
        // 创建一个Feature，并设置好在地图上的位置
        var anchor = new Feature({
          geometry: new Point(linePaths[i])
        })
        // 设置样式，在样式中就可以设置图标
        anchor.setStyle(new Style({
          image: new Circle({
            radius: 10,
            stroke: new Stroke({
              color: '#fff'
            }),
            fill: new Fill({
              color: '#3399CC'
            })
          })
        }))
        // 添加到之前的创建的layer中去
        layer.getSource().addFeature(anchor)
      }

      var feature = new Feature({
        geometry: geometry
      })
      source.addFeature(feature)

      // 标记点集
      var routeLayer = new VectorLayer({
        source: source,
        style: this.styleFunction
      })
      this.routeLayer = routeLayer
      this.map.addLayer(routeLayer)
    },
    // 获取样式
    styleFunction: function(feature) {
      var geometry = feature.getGeometry()
      // 线段样式
      var styles = [
        new Style({
          fill: new Fill({
            color: this.lineColor
          }),
          stroke: new Stroke({
            lineDash: [1, 3, 5],
            width: 2,
            color: [255, 0, 0, 1]
          })
        })
      ]
      // 箭头样式
      geometry.forEachSegment(function(start, end) {
        var arrowLonLat = [(end[0] + start[0]) / 2, (end[1] + start[1]) / 2]
        var dx = end[0] - start[0]
        var dy = end[1] - start[1]
        var rotation = Math.atan2(dy, dx)
        styles.push(new Style({
          geometry: new Point(arrowLonLat),
          image: new Icon({
            // src: require('../../assets/img/arrow.png'),
            src: require('@/assets/img/arrow.png'),
            anchor: [0.75, 0.5],
            rotateWithView: true,
            rotation: -rotation
          })
        }))
      })
      return styles
    },
    // 清除线路，标点图层
    clearLayers: function() {
      // 先移除现有图层
      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer)
        this.routeLayer = null
      }
      if (this.nodesLayer) {
        this.map.removeLayer(this.nodesLayer)
        this.nodesLayer = null
      }
    },
    async getData(params) {
      // var pathList = new Array()
      // var point1 = { nodeId: 'G0004440010040', type: 1 }
      // var point2 = { nodeId: 'G0004440010060', type: 3 }
      // var point3 = { nodeId: 'G0004440020010', type: 4 }
      // pathList.push(point1)
      // pathList.push(point2)
      // pathList.push(point3)
      //
      // var reqParam = { pathList: pathList, version: '4420200101001' }
      //console.log('reqparams', params)
      const res = await getData(params)
      this.clearLayers()
      if (res.code === 200) {
        console.log('res', res)
        //this.pathList = res.data.pathList
        this.pathList = res.data.coordinates
        console.log("res.data.coordinates", res.data.coordinates)
        this.addNodes()
        this.addLine()
      }
    }
    // ,
    // async getData2(param) {
    //   const _that = this
    //   await axios.post('http://127.0.0.1:18001/api/layui/v1/roadnet_api/test').then(function(response) {
    //     _that.pathList = response.data.data.pathList
    //   }).catch(function(error) {
    //
    //   })
    // }
  }
}
</script>

<style>
  #map {height: 100%;}
</style>
