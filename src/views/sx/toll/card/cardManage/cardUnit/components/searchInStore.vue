<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form v-show="detailShow" ref="form" v-loading="loading"  label-width="100px">
        <el-form-item label="卡单元数量">
          {{cardUnitCount}}
        </el-form-item>

        <el-form-item label="卡数量">
          {{totalCount}}
        </el-form-item>

        <el-form-item label="在库存卡数量">
          {{instoreCardCount}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import {getCardUnitMessage} from '../cardUnitApi'
import { cloneDeep } from 'ecip-web/utils'

export default {
  name: 'searchInStoreForm',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      detailShow: false,
      title: '卡库存情况',
      cardUnitCount: '',
      totalCount:'',
      instoreCardCount:''
    }
  },
  methods: {
    init: function(method, tenantId, appId, queryParams, cardUnitCount) {
      this.visible = true;
      this.detailShow = false;
      this.$nextTick(async() => {

        try {

          const { data } = await getCardUnitMessage(queryParams);
          if (null == data) {
            this.cardUnitCount = 0;
            this.totalCount = 0;
            this.instoreCardCount = 0;
          } else {
            this.render(tenantId, appId);
            this.cardUnitCount = cardUnitCount;
            this.totalCount = data.totalCount;
            this.instoreCardCount = data.instoreCardCount;
          }
        } finally {
          //this.loading = false
        }
      })

    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.detailShow = true;
      this.$refs.form.clearValidate();
      //this.formItem.tenanId = tenantId
      //this.formItem.appId = appId
    },
    getData: function() {
    }
  }
}
</script>

<style scoped>

</style>
