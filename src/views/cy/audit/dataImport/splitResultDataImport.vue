<template>
  <div class="app-container">
    <el-form ref="searchItem" :model="queryParams" :rules="rules" inline :label-width="'100px'">
      <ti-upload-notify accept=".zip" :limit="limit" max-size="2048">
        <span slot="remark">
          注意：数据文件仅支持csv格式，请将文件压缩为zip格式后上传，压缩包内不可包含多个数据文件，压缩包不可大于2G；<br/>
          【导入文件名格式要求：数据接口名称+数据时间，示例入口通行数据 enPass20210418.zip】
        </span>
      </ti-upload-notify>
    </el-form>
  </div>
</template>

<script>

import TiUploadNotify from '@/views/pro/common/tiUploadNotify/tiUploadNotify'

export default {
  name: 'audit.dataImport.splitResultDataImport',
  components: {TiUploadNotify},
  data() {
    return {
      limit: 2
    }
  }
}
</script>

<style scoped>

</style>
