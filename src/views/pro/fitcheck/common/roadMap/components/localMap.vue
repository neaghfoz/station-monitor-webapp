<template>
  <div>
    <div v-if="showLine">
      <ti-l-map  coordinate-url="api/v1/fitcheck/nodeCodeCoordinate/coordinate" :geo-server-url="geoServerUrl" :params ="mapParams"  ></ti-l-map>
    </div>
    <div v-if="!showLine">
      <ti-l-map-num coordinate-url="api/v1/fitcheck/nodeCodeCoordinate/coordinate"  :geo-server-url="geoServerUrl" :params ="mapParams"  ></ti-l-map-num>
    </div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';
import TiLMap from "@/views/pro/common/tiLMap/tiLMap2";
import TiLMapNum from "@/views/pro/common/tiLMap/tiLMapNum"
import { tibms } from '@/settings'

export default {
  name: "LocalMap",
  components: {TiLMap,TiLMapNum},
  mixins: [...mixin],
  props:{
    showLine:{
      type:Boolean,
      required: false,
      default: true
    },
    // 路径
    mapParams: {
      type: Object,
      default: () => {
        return {
          pathList: [],
          version: '4420200101001'
        }
      },
      required: false
    }
  },
  data() {
    return {
      geoServerUrl: tibms.fitcheck.mapUrl
    }
  }
}
</script>
