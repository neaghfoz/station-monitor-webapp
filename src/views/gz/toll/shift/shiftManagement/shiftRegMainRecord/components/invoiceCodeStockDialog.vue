<template>
    <el-dialog
      title="机打发票库存检查信息"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="50%"
      append-to-body
    >

      <el-table
        :data="showData"
        border
        style="width: 100%">
        <el-table-column
          prop="stationName"
          label="收费站"
          width="135">
        </el-table-column>
        <el-table-column
          prop="invStartNo"
          label="检查起始号"
          width="148">
        </el-table-column>
        <el-table-column
          prop="invEndNo"
          label="检查结束号"
          width="148">
        </el-table-column>
        <el-table-column
          prop="notInInvStartNo"
          label="不在库存起始号"
          width="148">
        </el-table-column>
        <el-table-column
          prop="notInInvEndNo"
          label="不在库存结束号"
          width="148">
        </el-table-column>
      </el-table>

    <span slot="footer" class="dialog-footer" style="margin-left: 110px;">
       <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'

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
      visible: false
    }
  },
  watch: {},
  methods: {
    init(){
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
