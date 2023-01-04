<template>
  <div class="map-container" style="height: 100vh">
    <div id="container" style="height: 100vh;"></div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin';
import { amapApi } from '@ecip/roadnet/src/controller/amap_api'
import '@ecip/roadnet/src/extend/roadnet_api.css'
import '@ecip/roadnet/src/extend/roadnet.css'
export default {
  name: "OnlineMap",
  mixins: [...mixin],
  props: {
    // 路径
    mapParams: {
      type: Object,
      default: () => {
        return {
          //{
          //   nodeId:"S2201450010020",
          //   type: 1  // 图标后缀，标记是交易成功1，交易失败2，有图无交易3，路径缺失4
          // }
          pathList: [],
          version: '4420200101001'
        }
      },
      required: false
    }
  },
  watch: {
    mapParams: {
      handler: function (newParams, oldParams) {
        this.initMap(newParams)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initMap(param) {
      //画路径方法

      /**
       *  TRADE_SUCCESS(1, "交易成功"),
       SPLIT_COLLECT(2, "代收拆点"),
       TRADE_FAIL(3, "交易失败"),
       HAS_IMG_NO_TRADE(4, "牌识补点"),
       MANUAL_POINT(5, "人工补点"),
       RESTORE_POINT(6, "拟合补点");
       */
        // 1：交易成功，2：交易失败，3：有图无交易，4：路径缺失
      const newPathList = []
      param.pathList.forEach(x => {
        let intervalType = x.type
        if (intervalType === 1 || intervalType === 2) {
          intervalType = 1
        } else if (intervalType === 3) {
          intervalType = 2
        } else if (intervalType === 4) {
          intervalType = 4
        } else if (intervalType === 5 || intervalType === 6) {
          intervalType = 4
        }
        newPathList.push({
          nodeId: x.nodeId,
          type: intervalType
        })
      })
      amapApi.viewPath([newPathList], param.version)
    }
  }
}
</script>

