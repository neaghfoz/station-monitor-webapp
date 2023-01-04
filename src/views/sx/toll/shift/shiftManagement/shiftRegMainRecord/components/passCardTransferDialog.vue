<template>
  <div class="app-container" >
    <el-dialog
      title="卡单元交接信息确认"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >

      <el-table
        :data="showData"
        border
        style="width: 100%;text-align: center;">
        <el-table-column
          label="卡单元"
          prop="cardUnitNo"
          width="180">
        </el-table-column>
        <el-table-column
          prop="cpcCardCount"
          label="卡数量"
          width="160">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="383">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="scope.row.isTransfer" label="1">交接</el-radio>
            <el-radio class="radio" v-model="scope.row.isTransfer" label="0">不交接</el-radio>
          </template>
        </el-table-column>

      </el-table>

    <span slot="footer" class="dialog-footer" style="margin-left: 110px;">
      <el-button type="primary" @click="transferAll">全部交接</el-button>
      <el-button type="primary" @click="transferSubmit">确认</el-button>
      <el-button  @click="visible = false">取消</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'

export default {
  name: 'toll-shift-passCardTransfer',
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
    },
    transfer(index, val){
      let data = {
        index : index,
        isTransfer : val
      }
      this.$emit('refreshData', data)
    },
    transferAll(){
      this.$emit('transferAll')
      this.visible = false
    },
    transferSubmit(){
      let canSubmit = true
      for(let data of this.showData){
        if (null == data.isTransfer || typeof data.isTransfer == 'undefined' || data.isTransfer == '') {
          canSubmit = false
        }
      }
      if(!canSubmit){
        this.$alert('请填写需要交接的卡单元！')
        return
      }
      this.$emit('transferSubmit')
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
