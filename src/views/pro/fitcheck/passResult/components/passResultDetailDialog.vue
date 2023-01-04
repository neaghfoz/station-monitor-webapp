<template>
  <el-dialog :close-on-press-escape="false" title="流水明细" :visible.sync="dialogVisible" width="85%">
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span style="color: #0088ff">基础信息</span></div>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="交易车牌" :value="baseData.vehiclePlateStr" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="计费车型" :value="baseData.vehicleTypeStr" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="计费车种" :value="baseData.vehicleClassStr" />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="入口站" :value="baseData.pathFirsnName" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="入口交易时间" :value="baseData.pathFirsnTime" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="通行介质" :value="baseData.mediaTypeStr" />
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <ti-detail-cell label="出口站" :value="baseData.pathLastnName" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="出口交易时间" :value="baseData.pathLastnTime" />
          </el-col>
          <el-col :span="8">
            <ti-detail-cell label="出口计费类型" :value="baseData.exitFeeTypeStr" />
          </el-col>
        </el-row>
      </el-card>
      <road-map ref="roadMap" show-table :check-show="false">
        <template slot="operation">
          <slot name="operation"/>
        </template>
      </road-map>
    </div>
  </el-dialog>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
import RoadMap from "@/views/pro/fitcheck/common/roadMap/roadMap.vue"

export default {
  name: "fitcheck.passResult.components.passResultDetailDialog",
  components: { TiDetailCell,RoadMap },
  mixins: [...mixin],
  props: {
    value: {
      type: [String, Number, Object]
    }
  },
  data () {
    return {
      dialogVisible: false,
      baseData: {}
    }
  },
  methods: {
    init (params) {
      this.dialogVisible = true;
      this.baseData = params;
      this.$nextTick(async => {
          this.getPathDetail();
        }
      );
    },
    // 获取路径明细列表
    async getPathDetail(){
      this.$refs.roadMap.initData({
        passId: this.baseData.passId,
        enTime: this.baseData.enTime
      })
    }
  }
}
</script>
