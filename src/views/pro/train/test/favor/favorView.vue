<template xmlns="http://www.w3.org/1999/html">
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'100px'">
        <el-row>
          <el-form-item label="题型" type>
            <ti-select
              v-model="queryParams.questionChoice"
              placeholder="请选择"
              dict-type="tibms_train_question_choice1"
            />
          </el-form-item>
          <el-form-item label="错题模式" favorType>
            <ti-select
              v-model="queryParams.type"
              placeholder="请选择"
              dict-type="tibms_train_exam_type"
            />
          </el-form-item>
          <el-form-item>
            <el-button v-permission="['train:test:favorFind']" type="primary" @click="getData(1)">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-card shadow="never" :max-height="this.tableHeight"  v-loading="loading">
      <el-card shadow="never">
        <!--默认删除按钮不能点击, 当选中某一checkbox时可以删除-->
        <label style="float:left;margin:5px" >
          <input type='checkbox' class='input-checkbox' @change='checkedAll()' :checked="selections.length === dataList.length" >全选
        </label>
        <label style="float:left;margin:5px">
          <el-button :disabled="selections.length == 0" type="primary" @click="del()">删除</el-button>
        </label>
      </el-card>
      <el-card
        shadow="never"
        class="subject-card"
        v-for="(item, idx) in dataList"
        :key="idx">
        <div slot="header" class="clearfix">
          <input type="checkbox" :checked="selections.indexOf(item.id)>=0" @change="checkedOne(item.id)" style="margin:5px"/>
          <span class="serial-num" style="margin:5px">{{idx + 1}}</span>
          <el-button class="add-btn"  @click="delById(item)" style="font-weight: bolder">x</el-button>
        </div>
        <div class="subject-title" v-html="formatterCont(item.mainContent)"></div>
        <el-divider></el-divider>
        <div v-html="formatterCont(item.selectContent)"></div>
        <el-divider></el-divider>
        <div class="analysis-info">
          <div class="item-type">正确答案：</div>
          <p class="item-cont">{{item.answer}}</p>
        </div>
        <div class="analysis-info"><span class="item-type2">所在章：</span>{{item.sectionName}} </div>
        <div class="analysis-info item-cont"><span class="item-type2">知识点：</span>{{item.knowledgeName}} </div>
        <div class="analysis-info item-cont"><span class="item-type2">题型：</span>{{item.questionChoiceName}} </div>
        <div class="analysis-info item-cont"><span class="item-type2">错题模式：</span>{{item.typeName}} </div>
        <div>
          <div class="item-type2">答案解析</div>
          <div v-html="formatterCont(item.describe)"></div>
        </div>
      </el-card>
      <ul class="ul"  style="" >
        <li v-for="n in pages" v-bind:class="current == n ? 'active':''" v-on:click="getData(n)">
          <a v-text="n"></a>
        </li>
        <li style="width:100px" >共{{total}}条数据</li>
      </ul>
    </el-card>
  </div>
</template>

<script>

import { favorFind, del, deleteByIds } from './favorViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import iconWrong from '@/assets/img/train/icon_wrong.png'
import iconYes from '@/assets/img/train/icon_yes.png'
import mixin from 'ecip-web/utils/common-mixin'

export default {
  name: 'pro.train.test.favor.favorView',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false, // 页面加载遮罩
      method: '',
      queryParams: {
        type: '',
        questionChoice: ''
      },
      testPaper: {},
      iconWrong,
      iconYes,
      tableHeight: null,
      total: 0, // 总条数
      pages: 1, // 总页数
      size: 10, // 一页显示10条
      current: 1, // 当前页
      dataList: [], // 前端模拟后每一页显示的数据
      selections: [] // 初始化全选按钮, 默认不选
    }
  },
  mounted() {
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.getData(1)
    },
    async getData(current) {
      if (current) {
        this.current = current
      } else {
        this.current = 1
      }
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.loading = true
      this.selections = []
      this.dataList = []
      favorFind(this.queryParams, this.size, this.current).then(res => {
        this.dataList = res.data.records
        this.total = res.data.total // 获取数据总条数
        this.pages = res.data.pages
        this.loading = false
      })
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
    },
    formatterCont(txt) {
      const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
      return txt.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
        return arrEntities[t]
      })
    },
    delById(item) {
      del(Object.assign({}, {
        id: item.id
      }, this.formItem)).then(res => {
        this.$notify.success('删除成功！')
        this.getData()
      })
    },
    checkedOne(id) {
      const idIndex = this.selections.indexOf(id)
      if (idIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.selections.splice(idIndex, 1)
      } else {
        // 选中该checkbox
        this.selections.push(id)
      }
    },
    checkedAll() {
      const isCheckedAll = this.selections.length === this.dataList.length
      if (!isCheckedAll) {
        // 全选时
        this.selections = []
        this.dataList.forEach(function(item) {
          this.selections.push(item.id)
        }, this)
      } else {
        this.selections = []
      }
    },
    async del() {
      if (this.selections.length === 0) {
        this.$notify.warning('至少选择一条记录!')
        return
      }
      const ids = this.selections.join(',')
      this.$confirm(`是否确定删除错题集`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteByIds(ids).then((res) => {
          this.$notify.success(res.data)
          this.getData(1)
          this.selections = []
        })
      })
    }
  }
}
</script>

<style scoped>
.question-type{
  margin-bottom: 30px;
  padding: 10px;
  color: #333;
  font-weight: bold;
  background-color: #f5f5f5;
}
.subject-card{
  margin-bottom: 20px;
}
.subject-card >>> .el-card__body{
  position: relative;
}
.add-btn{
  float: right;
  /* padding: 3px 0; */
}
.subject-card >>> .el-divider{
  background-color: #EBEEF5;
}
.serial-num{
  display: inline-block;
  padding: 0 9px;
  min-width: 3em;
  line-height: 2em;
  color: #fff;
  background-color: #3a87ad;
  border-radius: 9px;
  text-align: center;
}
.subject-title{
  color: #c09853;
}
.answer-result{
  position: absolute;
  top: 0;
  right: 10%;
  width: 200px;
  height: 200px;
}
.analysis-info{
  margin-bottom: 10px;
}
.item-cont{
  color: #468847;
}
.item-type{
  color: #b94a48;
}
.item-type2{
  color: #3a87ad;
}

.scoreArea {
  right: 80px;
  top: 0;
  position: absolute;
  z-index: 99;
  font-size: 120px;
  color: #FF0000;
  font-family: "MV Boli";
}

.active {background:#2d8cf0;}
.active a{color:#fff !important;}
.ul {list-style:none;margin:20px;float:right}
.ul li {float:left;line-height:28px;width:30px;border:1px solid #ccc;border-radius: 4px;height:30px;text-align:center;margin:5px}
.ul li.disabled{color:#333}
.ul li a{color:#333}

</style>
