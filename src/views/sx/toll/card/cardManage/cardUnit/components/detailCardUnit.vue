<template>
  <div class="app-container">

    <el-form ref="form" v-loading="loading" label-width="100px">
      <el-row style="width: 25%;">
        <el-form-item label="通行卡卡号">
          <el-input type="text" v-model="passCardNo" placeholder="请输入需要查询的卡号"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="卡单元编码">
          {{unitNo}}
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="通行卡" >
          <el-ul class="list-group list-unstyled list-inline">
            <el-li class="list-group-item" v-show="passCardNoFilter(item)" v-for="item in passCardDynList">{{item.passCardNo}}</el-li>
          </el-ul>
        </el-form-item>
      </el-row>


      <el-row style="text-align: center;">
        <el-button v-permission="['cardUnit:detailExcel']" type="primary" @click="exportDetail()">导出</el-button>
        <el-button @click="close()">关闭</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { detail, exportDetail } from '../cardUnitApi'
import { cloneDeep, download } from 'ecip-web/utils'
import { Notification } from 'element-ui'

export default {
  name: 'detailCardUnitForm',
  components: {  },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      unitNo: '',
      title: '卡单元详情',
      passCardNo:'',
      passCardDynList:[]

    }
  },
  created() {
    this.detail(this.$route.query.unitNo);
  },
  methods: {
    detail(unitNo) {
      this.visible = true;
      this.unitNo = unitNo;
      this.$nextTick(async() => {

        try {
          const { data } = await detail(unitNo);
          if (null == data) {
            Notification({
              message: '数据不存在或已被删除，无法查看详情',
              type: 'error',
              offset: 50,
              duration: 5 * 1000
            })

            // 找不到数据的情况下，自动重新加载列表
            this.$emit('refreshData');
            this.visible = false;
            this.close();
          } else {
            console.log(data);
            this.$data.passCardDynList = data.passCardDynList;
          }
        } finally {
          //this.loading = false
        }
      })
    },
    getData() {
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
      this.$router.go(-1);
    },
    passCardNoFilter(e) {
      if (this.passCardNo != 'undefined' && this.passCardNo != '') {
        return e.passCardNo.indexOf(this.passCardNo) != -1;
      } else {
        return true;
      }
    },
    async exportDetail(){
      let params = {exportType: 'total'};
      await download({url: '/api/v1/toll/cardUnit/exportDetail', method: 'post', params: params, data: {unitNo : this.unitNo}})
      this.$notify.success("导出成功！");
    }
  }
}
</script>

<style scoped>
  .list-group {
    padding-left: 0;
    margin-bottom: 20px;
  }
  .list-inline {
    padding-left: 0;
    list-style: none;
  }
  .list-inline>li {
    display: inline-block;
  }
  .list-group-item {
    position: relative;
    padding: 7px 10px;
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  ul, li {
    list-style: none;
  }
  li {
    text-align: -webkit-match-parent;
  }
</style>
