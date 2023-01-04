<template>
  <div>
    <el-dialog
      v-loading="loading"
      title="导出"
      :visible.sync="exportExcel.dialog"
      width="300px"
      :modal-append-to-body="true"
      append-to-body
      class="exportExcelDialog"
      :z-index="zIndex"
      ref="exportDialog"
    >
      <el-radio v-show="page" v-model="exportExcel.type" label="curpage">当前页导出</el-radio>
      <el-radio v-model="exportExcel.type" label="total">全量导出</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportExcel.dialog = false">取 消</el-button>
        <el-button type="primary" @click="exportExcelFn()" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import dictUtils from 'ecip-web/utils/dictUtils';
import request from "ecip-web/utils/request";
import { download } from 'ecip-web/utils'
export default {
  name: 'TiExportExcel',
  components: {},
  props: {
    exportExcel: {
      type: Object,
      default: null,
      require: false
    },
    page: {
      type: Object,
      default: null,
      require: false
    },
    isVehNotes: {
      type: Boolean,
      default: false,
      required: false
    },
    zIndex: {
      type: Number,
      default: 20001,
      required: false
    }
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {
    'exportExcel.dialog': {
      handler(n, o) {
        if (n) {
          this.zIndex = this.zIndex && (this.zIndex > 20001 ? this.zIndex : 20001)
        }
      },
      immediate: true
    }
  },
  activated() {
    console.log(1)
  },
  methods: {
    async exportExcelFn () {
      this.loading = true;
      let limitCnt = await dictUtils.getDictLabel('tibms_config', 'exportLimitCount', '30000');
      try {
        //01.导出
        if (this.page && this.page.total == 0) {
          this.$alert("没有数据，无需导出！", "导出");
          return;
        } else if (!this.isVehNotes && this.exportExcel.type == 'total' && this.page && this.page.total > limitCnt) {
          this.$alert('不能超过' + limitCnt + '条！', "导出");
          return;
        } else {
          let params = { exportType: this.exportExcel.type };
          params =
            this.exportExcel.type == 'curpage' ? this.page ? Object.assign(params, { size: this.page.pageSize, current: this.page.currentPage }) : Object.assign(params, {}) :
              Object.assign(params, { total: this.page ? this.page.total : 0 });
          var res = await download({ url: this.exportExcel.url, method: 'post', params: params, data: this.exportExcel.queryParams });
        }
        console.log(res, 'inTry');

        //03.计算导出条数
        this.exportExcel.dialog = false;
        this.saveLoading = false;
        if (this.exportExcel.type == 'curpage') {
          let page = this.page.total / this.page.pageSize;
          let remainder = this.page.total % this.page.pageSize;
          let size = 0;
          if (this.page.currentPage > page) {
            size = remainder;
          } else {
            size = this.page.pageSize;
          }
          this.$alert('本次成功导出' + size + '条！', "导出");
        } else {
          if (this.page != null) {
            this.$alert('本次成功导出' + this.page.total + '条！', "导出");
          }
        }
      } catch (e) {
        this.$alert('导出失败！' + e.message, "导出");
      } finally {
        this.loading = false;
      }
    }
    , download (option, handle) {
      return new Promise((resolve, reject) => {
        var options = Object.assign({ method: 'get', responseType: 'blob' }, option)
        request(options).then(response => {
          var resData = response.data;
          //错误信息
          if (resData.type == 'application/json') {
            var fileReader = new FileReader()
            fileReader.readAsText(resData, 'utf-8');
            fileReader.onloadend = () => {
              var jsonData = JSON.parse(fileReader.result);
              console.log(jsonData);
              if (jsonData.code != 200) {
                reject(jsonData);
                return;
              }
            }
          } else {  //正常文件
            console.log('insuccess');
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(new Blob([response.data]))
            link.target = '_blank'
            let filename = response.headers['content-disposition']
            if (filename.indexOf('filename=') > -1) {
              filename = filename.split('filename=')[1]
            }
            link.download = decodeURI(filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            resolve();
          }

        }).catch(error => {
          console.log('download', error);
        }).finally(x => {
          this.loading = false;
        })
      })
    }
  }
}
</script>

<style>
div.el-message-box__wrapper[aria-label='导出'] {
  z-index: 9999999 !important;
}
</style>


