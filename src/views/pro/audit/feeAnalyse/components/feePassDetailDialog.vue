<template>
  <el-dialog
    title="流水明细"
    :visible.sync="dialogVisible"
    :params="params"
    width="85%">
    <div class="app-container">
      <div class="roadnet">
        <div class="blue_title">基础信息</div>

        <div class="jc_box">
          <div>
            <div><p>交易车牌：{{ baseData.vehiclePlateStr }}</p></div>
            <div><p>入口站：{{ baseData.pathFirsnName }}</p></div>
            <div><p>出口站：{{ baseData.pathLastnName }}</p></div>
          </div>
          <div>
            <div><p>计费车型：{{ baseData.vehicleTypeStr }}</p></div>
            <div><p>入口交易时间：{{ baseData.pathFirsnTime }}</p></div>
            <div><p>出口交易时间：{{ baseData.pathLastnTime }}</p></div>
          </div>
          <div>
            <div><p>计费车种：{{ baseData.vehicleClassStr }}</p></div>
            <div><p>通行介质：{{ baseData.mediaType==1?'OBU':'CPC' }}</p></div>
            <div><p>出口计费类型：{{ baseData.exitFeeTypeStr }}</p></div>
          </div>
        </div>

      </div>

      <vxe-grid
        ref="feePassDetailDialog"
        highlight-hover-row
        border
        resizable
        sync-resize
        auto-resize
        keep-source
        highlight-current-row
        max-height="1000"
        class="vxe-table-element"
        :toolbar="tableToolbar"
        :loading="loading"
        :columns="columns"
        :data="tableData">
        >

        <template v-slot:toolbar_buttons>
          <span style="position: absolute;left: 17px;top: 10px;">通行路径明细</span>
        </template>

      </vxe-grid>
    </div>
  </el-dialog>
</template>

<script>
  import mixin from 'ecip-web/utils/common-mixin'
  import TiDetailCell from "@/views/pro/common/tiElement/tiDetail/tiDetailCell"
  // import {findPathInfos} from "@/views/pro/test/feeAnalyse/components/feePassListApi"

  export default {
    name: "audit.feeAnalyse.components.feePassDetailDialog",
    components: {TiDetailCell},
    mixins: [...mixin],
    props: {
      value: {
        type: [String, Number, Object]
      },
      params: {
        type: [String, Number, Object],
        required: true
      },

    },
    data() {
      return {
        dialogVisible: false,
        baseData: {},
        loading: false,
        banState1: true, // 工具栏编辑按钮是否禁用，只有当且仅当选择一条记录的时候才可编辑
        banState2: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
        tableToolbar: {
          id: 'audit.feeAnalyse.components.feePassDetailDialog-toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: false, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        columns: [
          {
            title: "序号",
            type: "seq",
            width: 50,
            align: "center"
          },
          {
            minWidth: 150, field: 'tollIntervalName', title: '收费单元', align: 'center', showOverflow: true,
            slots: {
              default: ({row}, h) => {
                return row.tollIntervalName ? '[' + row.tollIntervalId + ']' + row.tollIntervalName : '[' + row.tollIntervalId + ']' + '未知'
              }
            }
          },
          {minWidth: 150, field: 'tradeTime', title: '交易时间', align: 'center', showOverflow: true},
          {minWidth: 150, field: 'payFeeTxt', title: '应收金额(元)', align: 'left', showOverflow: true},
          {minWidth: 150, field: 'feeTxt', title: '交易金额(元)', align: 'left', showOverflow: true},
          {minWidth: 150, field: 'discountFeeTxt', title: '优惠金额(元)', align: 'left', showOverflow: true},
          {minWidth: 150, field: 'splitFeeTxt', title: '拆分金额(元)', align: 'left', showOverflow: true}
        ],
        tableData: []
      }
    },
    watch: {
      dialogVisible(v) {
        if (v) {
          this.init();
        }
      }
    },
    methods: {
      init() {

        this.$nextTick(async => {
            this.getData();
          }
        );
      },
      async getData() {
        // console.log("params:",params);
        // console.log("params:", this.params);
        // this.loading = true;
        // const {data} = await findPathInfos(this.params);
        // this.baseData = data.passInfo;
        // this.tableData = data.allPathInfo;
        // this.loading = false;
      }
    }
  }
</script>

<style scoped>
  .roadnet {
    padding: 15px 30px;
  }

  .roadnet .blue_title {
    color: #0088ff;
    margin-bottom: 10px;
  }

  .roadnet .jc_box {
    display: flex;
    display: -webkit-flex;
    margin-bottom: 30px;
  }

  .roadnet .jc_box > div {
    flex: 1;
  }

  .roadnet .jc_box > div > div {
    position: relative;
    color: #333;
    padding-left: 100px;
    margin-bottom: 5px;
    /*padding-top:30px*/
    min-height: 18px;
  }

  .roadnet .jc_box > div > div p {
    position: absolute;
    left: 0;
    top: 0;
    color: #999;
  }

</style>
