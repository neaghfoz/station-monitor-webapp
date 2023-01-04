<template>
  <div class="app-container" id="tip">
    <el-dialog
      ref="tipDialog"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="800px"
      :modal-append-to-body='false'
      :z-index="zIndex"
    >
      <span slot="title" class="dialog-footer">
        <span class="el-dialog__title">{{title}}</span>
      </span>
       <el-row>
         <el-col :span="24">
           <div  id= 'infoListDiv' style=" overflow: auto;height: 200px;width: 100%;border:1px solid #cdcdcd;" >
             <div   class="infoDiv" v-for="item in infoList">
               {{item.infoText}}
             </div>
           </div>
         </el-col>
       </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { cloneDeep } from 'ecip-web/utils'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
export default {
  name: 'VueRoleSysrRoleForm',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      row: {},
      infoList: {},
      collectDate: '',
      method: '',
      title: '',
      formItem: {
        recNo: '',
        tableName: '',
        tableShowName: '',
        recvFileName: '',
        tableClass: '',
        isUsed: '1'
      },
      zIndex: 2000
    }
  },
  methods: {
    init(title, infoList, zIndex) {
      this.zIndex = parseInt(zIndex) + 2001
      this.infoList = infoList
      this.title = title
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
  .infoDiv {
    text-align: left;
    margin-left: 10px;
    margin-top: 10px;
    font-size: 14px;
    color: #606266;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
  }
  #tip .el-dialog__footer {
    text-align: center;
  }
  #tip .el-dialog__body {
    padding: 20px 20px;
  }
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 0px;
    }
  }
</style>
