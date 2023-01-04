<template>
  <el-dialog title="文件上传校验结果"  :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="visable" :width="'80%'">
    <div style="min-height:500px; max-height: 700px">
    <vxe-grid
      ref="table"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      height="auto"
      class="vxe-table-element"
      :columns="columns"
      :data="data"/>
    </div>
  </el-dialog>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

export default {
  name: "TiImpError",
  mixins: [...mixin],
  data() {
    return {
      visable: false,
      data:[],
      columns: [
        { field: 'importExcelRowNum', title: '行号',align: 'center', minWidth: 80 },
        { field: 'importExcelErrorMsg', title: '错误信息', minWidth: 500, headerAlign: 'center', align: 'left'}
      ]
    }
  },
  methods: {
    show(data){
      this.data = data
      this.visable = true
    }
  }
}
</script>
