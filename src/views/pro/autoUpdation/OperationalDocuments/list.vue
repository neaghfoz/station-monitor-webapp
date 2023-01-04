<template>
  <div class="app-container">
    <el-form v-if="showSearchForm" ref="searchForm" :model="queryParams" inline :label-width="'155px'">
      <el-row>

        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>

      </el-row>

    </el-form>

    <ti-export-excel :export-excel="exportExcel" :page="tableData.page" />

  </div>

</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import tiSysOrg from '@/views/pro/common/tiElement/tiSysOrg/tiSysOrg'
import TiDateRange from '@/views/pro/common/tiElement/tiDate/tiDateRange'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiExportExcel from '@/views/pro/common/tiElement/tiExport/tiExportExcel'
import TiSysLane from "@/views/pro/common/tiElement/tiSysLane/tiSysLane"

export default {
  name: 'AutoUpdationOperationalDocumentsListView',
  components: { tiSysOrg, TiDateRange, TiSelect, TiExportExcel,TiSysLane },
  mixins: [...mixin],
  data() {
    return {
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }

}
</script>

<style scoped>
  .el-card{
    margin-bottom:20px;
  }
  /deep/ #paramInfoId>.el-card>.el-card__body{
    padding: 5px;
  }
  /deep/ #paramInfoId>.el-card>.el-card__header{
    padding: 10px;
  }
  .el-form .el-select-tree  >>> .el-input{
    min-width: 180px !important;
    max-width: 180px !important;
  }

  .el-form .el-select >>> .el-input{
    min-width: 180px!important;
    max-width: 180px!important;
  }
  .el-form .el-input {
    min-width: 180px !important;
    max-width: 180px !important;
  }

  .el-form .el-date-editor {
    width: 470px!important;
  }
</style>
