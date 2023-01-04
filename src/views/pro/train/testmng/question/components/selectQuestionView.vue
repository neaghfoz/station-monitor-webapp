<template>
  <div class="app-container">
    <el-dialog
      title="选择试题"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'150px'">
        <el-row>
          <el-form-item
            label="试题ID"
          >
            <el-input
              v-model="queryParams.id"
              type="text"
              placeholder="试题ID"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g, '')"
              style="width: 199px"
            />
          </el-form-item>
          <el-form-item
            label="所属科目/章节/知识点"
          >
            <el-cascader
              v-model="queryParams.parentIds"
              placeholder="请选择"
              :options="parentTree"
              :props="{ checkStrictly: true }"
            />
          </el-form-item>
          <el-form-item label="试题题目" prop="mainContent">
            <el-input
              v-model="queryParams.mainContent"
              type="text"
              placeholder="试题题目"
              maxlength="500"
              style="width: 199px"
            />
          </el-form-item>
          <el-form-item
            label="题型分类"
          >
            <ti-select
              v-model="queryParams.type"
              disabled
              placeholder="请选择"
              dict-type="tibms_train_question_type"
            />
          </el-form-item>
          <el-form-item
            v-show="showChoice === 0"
            label="题型"
          >
            <ti-select
              v-model="queryParams.choice"
              disabled
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item
            v-show="showChoice === 1"
            label="题型"
          >
            <ti-select
              v-model="queryParams.choice"
              disabled
              placeholder="请选择"
              dict-type="tibms_train_question_choice1"
            />
          </el-form-item>
          <el-form-item
            v-show="showChoice === 2"
            label="题型"
          >
            <ti-select
              v-model="queryParams.choice"
              placeholder="请选择"
              disabled
              dict-type="tibms_train_question_choice2"
            />
          </el-form-item>
          <el-form-item
            label="难度"
          >
            <ti-select
              v-model="queryParams.level"
              placeholder="请选择"
              dict-type="tibms_train_question_level"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-card shadow="never" :max-height="tableHeight">
        <div class="box">
          <vxe-grid
            ref="xTable"
            highlight-hover-row
            border
            show-overflow
            show-header-overflow
            resizable
            sync-resize
            auto-resize
            class="vxe-table-element"
            :max-height="600"
            :loading="tableData.loading"
            :columns="tableData.tableColumns"
            :data="tableData.columnsDataList"
            :start-index="(tableData.page.currentPage - 1) * tableData.page.pageSize"
            :pager-config="tableData.page"
            :toolbar="tableToolbar"
            @page-change="handlePageChange"
            @checkbox-all="({ selection }) => {
              selections = selection
              selectChange()
            }"
            @checkbox-change="({ selection }) => {
              selections = selection
              selectChange()
            }"
          >
            <template v-slot:toolbar_buttons />
          </vxe-grid>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="selects">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { findPage, getParentTree } from '../questionViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'

export default {
  name: 'pro.train.testmng.question.selectQuestionView',
  components: { TiSelect },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      showSearchForm: true,
      showChoice: 0,
      parentTree: [],
      queryParams: {
        id: '',
        mainContent: '',
        parentIds: [],
        subjectId: '',
        type: '',
        choice: '',
        level: ''
      },
      selectQuestionIds: [],
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
          { title: '试题ID', field: 'id', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '所属科目', field: 'subjectName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '所属章节', field: 'sectionName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '所属知识点', field: 'knowledgeName', minWidth: 100, showOverflow: true, align: 'center' },
          { title: '试题题目', field: 'mainContentText', minWidth: 200, showOverflow: true, align: 'left' },
          { title: '难度', field: 'levelText', minWidth: 50, showOverflow: true, align: 'center' }
        ],
        page: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }
      },
      tableToolbar: {
        id: 'modules.paramQuery',
        custom: true,
        zoom: true, // 最大化按钮
        // 列宽操作记录
        resizable: {
          storage: true
        },
        slots: {
          buttons: 'toolbar_buttons'
        },
        // 列操作记录
        setting: {
          storage: true
        }
      },
      tableHeight: null,
      selections: []
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    }
  },
  mounted() {
  },
  created() {
    this.$nextTick(() => {
      // this.init()
    })
  },
  methods: {
    selectChange() {
      for (let i = 0; i < this.tableData.columnsDataList.length; i++) {
        // 反选该页的选择
        const index = this.selectQuestionIds.indexOf(this.tableData.columnsDataList[i].id)
        if (index > -1) {
          this.selectQuestionIds.splice(index, 1)
        }
      }
      for (let i = 0; i < this.selections.length; i++) {
        // 赋值选中的试题
        if (this.selectQuestionIds.indexOf(this.selections[i].id) === -1) {
          this.selectQuestionIds.push(this.selections[i].id)
        }
      }
    },
    init(parentIds, type, choice, selectQuestionIds) {
      this.visible = true
      // 清空已有的查询项
      this.queryParams.id = ''
      this.queryParams.mainContent = ''
      this.queryParams.level = ''
      this.queryParams.parentIds = parentIds

      this.queryParams.type = type + ''
      this.showChoice = type
      this.queryParams.choice = choice + ''
      this.selectQuestionIds = selectQuestionIds

      // 每次都要从第一页开始
      this.tableData.page.currentPage = 1

      const obj = {}
      obj.subjectId = parentIds[0]
      if (parentIds.length > 1) {
        obj.sectionId = parentIds[1].split('_')[1]
      }
      if (parentIds.length > 2) {
        obj.id = parentIds[2].split('_')[2]
      }

      getParentTree(obj).then(res => {
        this.parentTree = res.data
        const maxCount = this.queryParams.parentIds.length
        this.setDisable(this.parentTree, 1, maxCount)
        this.getData()
      })
    },
    setDisable(data, count, maxCount) {
      if (count < maxCount) {
        data.forEach(v => {
          v.disabled = true
          if (count === maxCount - 1) {
            return
          }

          if (v.children && v.children.length) {
            this.setDisable(v.children, count + 1, maxCount) // 子级循环时把这一层数据的count传入
          }
        })
      }
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false

        for (const i in this.tableData.columnsDataList) {
          const item = this.tableData.columnsDataList[i]
          if (this.selectQuestionIds.indexOf(item.id) > -1) {
            this.$refs.xTable.setCheckboxRow([item], true)
          }
        }
      })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tableData.page.currentPage = currentPage
      this.tableData.page.pageSize = pageSize
      this.getData()
    },
    handleReset() {
      this.queryParams = this.$options.data().queryParams
    },
    selects() {
      this.$emit('refreshData', parseInt(this.queryParams.type), parseInt(this.queryParams.choice), this.selectQuestionIds)
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
