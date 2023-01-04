<template>
  <div class="app-container" >
    <el-dialog
      title="定额发票库存检查信息"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >

      <el-table
        :data="showData"
        border
        style="width: 100%">
        <el-table-column
          label="收费站"
          width="100">
          <template slot-scope="scope">
            [{{scope.row.stationNo}}]{{scope.row.stationName}}
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          width="100">
          <template slot-scope="scope">
            {{manualInvTypeMap[scope.row.invType]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="invRationMoney"
          label="面额"
          width="47">
        </el-table-column>
        <el-table-column
          prop="invStartNo"
          label="检查起始号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="invEndNo"
          label="检查结束号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="notInInvStartNo"
          label="不在库存起始号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="notInInvEndNo"
          label="不在库存结束号"
          width="120">
        </el-table-column>
      </el-table>

    <span slot="footer" class="dialog-footer" style="margin-left: 110px;">
       <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import dictUtils from '@ecip/ecip-web/src/utils/dictUtils'

export default {
  name: 'toll-shift-invoiceCodeStock',
  components: { },
  mixins: [...mixin],
  props: {
    showData: {
      type: Array,
      default: null,
      require: false
    }
  },
  data() {
    return {
      visible: false,
      manualInvTypeMap:{}
    }
  },
  watch: {},
  methods: {
    init(){
      this.visible = true
      let manualInvTypes = dictUtils.getDictList('tibms_toll_rinvoiceType')
      for(let data of manualInvTypes){
        this.manualInvTypeMap[data.value] = data.label
      }
    }
  }
}
</script>

<style scoped>

</style>
