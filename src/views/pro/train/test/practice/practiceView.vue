<template>
  <div class="app-container">
    <div class="search-form">
      <el-form ref="searchForm" :model="queryParams" inline :label-width="'80px'">
        <el-row>
          <el-form-item label="流程ID" prop="id">
            <el-input
              v-model="queryParams.id"
              type="text"
              placeholder="流程ID"
              maxlength="11"
              oninput="value=value.replace(/[^\d]/g, '')"
            />
          </el-form-item>
          <el-form-item label="关键字" prop="name">
            <el-input
              v-model="queryParams.name"
              type="text"
              placeholder="请输入"
              maxlength="60"
            />
          </el-form-item>

          <el-form-item label="难度" prop="level">
            <ti-select
              v-model="queryParams.level"
              placeholder="不限"
              dict-type="tibms_train_question_level"
            />
          </el-form-item>

          <el-form-item label="所属章节/知识点" :label-width="'120px'">
            <el-cascader
              v-model="queryParams.parentIds"
              placeholder="请选择"
              :options="parentTree"
              :props="{ checkStrictly: true }"
              style="min-width: 292px"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-button v-permission="['train:question:findPage']" type="primary" @click="submit">查询</el-button>
            <el-button type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

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
          @checkbox-all="({ selection }) => { selections = selection }"
          @checkbox-change="({ selection }) => { selections = selection }"
        >

          <template v-slot:toolbar_buttons>
            <el-form ref="form" v-loading="loading" class="form-box" status-icon :model="formItem" :rules="rules">
              <el-form-item
                label="执行次数:"
                prop="num"
                inline-message
              >
                <el-input v-model.number="formItem.num" class="input-time no-margin-left" placeholder="请填写" />
                <!-- <div>最多重复5次，请输入不大于5的数字。</div> -->
              </el-form-item>
            </el-form>
            <el-button v-permission="['train:exam:num:save']" type="primary" :loading="saveLoading" @click="startTraining">开始训练</el-button>
          </template>

        </vxe-grid>
      </div>
    </el-card>

    <!-- 试卷 -->
    <PracticalExercises ref="saasTestPaperDialog" @handInThePapers="handPapers" />
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
// import moment from 'moment'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import { getParentTree, findPage } from '@/views/pro/train/testmng/question/questionViewApi'
// import { operationtrainStart } from './practiceViewApi'
import PracticalExercises from './components/practicalExercisesView'

export default {
  name: 'ProTrainTestPracticePracticeView',
  components: { TiSelect, PracticalExercises },
  mixins: [...mixin],
  data() {
    const validateNum = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        callback(new Error('请填写执行次数'))
      } else {
        if (value < 1 || value > 5) {
          callback(new Error('请填写1 ~ 5 之间的数值'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      saveLoading: false,
      importVisible: false,
      showSearchForm: true,
      stationFlag: true,
      oneMore: true, //  工具栏删除按钮是否禁用，当选中条数为0的时候禁用
      queryParams: {
        id: '',
        name: '',
        parentIds: [],
        subjectId: '2', // 科目id
        sectionId: '', // 章节id
        knowledgeId: '', // 知识点id
        level: ''
      },
      formItem: {
        num: 1,
        ids: '' // 为试题列表，多个用逗号隔开
      },
      examType: 1,
      rules: {
        num: [
          { required: true, message: '请填写执行次数', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ]
      },
      tableData: {
        loading: false,
        columnsDataList: [],
        tableColumns: [
          { type: 'checkbox', width: 60, fixed: 'left', align: 'center' },
          { title: 'ID', field: 'id', minWidth: 150, showOverflow: true, align: 'center' },
          { title: '流程内容', field: 'mainContentText', minWidth: 200, showOverflow: true, align: 'center' },
          { title: '难度', field: 'levelText', minWidth: 200, showOverflow: true, align: 'center' }
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
      selections: [],
      parentTree: []
    }
  },
  watch: {
    deptFilterText(val) {
      this.$refs.paramTree.filter(val)
    }
  },
  mounted() {
    this.$watch(this.$refs.xTable.getCheckboxRecords, (newValue, oldValue) => {
      this.selections = newValue
      this.oneMore = this.selections.length > 0
    })
  },
  created() {
    //
  },
  activated() {
    Object.assign(this.queryParams, this.$route.query)
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      getParentTree({ subjectId: 2 }).then(res => {
        this.parentTree = res.data
        this.getData()
      })
    },
    submit() {
      this.tableData.page.currentPage = 1
      this.getData()
    },
    async getData() {
      const { parentIds } = this.queryParams
      if (parentIds.length > 0) {
        const ids = parentIds[parentIds.length - 1]
        const splitId = ids.split('_')
        this.queryParams.sectionId = splitId[1] ? splitId[1] : ''
        this.queryParams.knowledgeId = splitId[2] ? splitId[2] : ''
      } else {
        this.queryParams.sectionId = ''
        this.queryParams.knowledgeId = ''
      }
      // 看能否直接用查询权限判断，若无查询权限，不调用查询页面请求
      this.tableData.loading = true
      findPage(Object.assign({}, {
        size: this.tableData.page.pageSize,
        current: this.tableData.page.currentPage
      }), this.queryParams).then(res => {
        this.tableData.columnsDataList = res.data.records
        this.tableData.page.total = res.data.total
        this.tableData.loading = false
      })
    },
    // 开始训练
    startTraining() {
      console.log(this.selections)
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.selections.length === 0) {
            this.$notify.warning('请选择实操流程')
            return
          }
          const selectIds = this.selections.map(item => item.id)
          this.$refs.saasTestPaperDialog.init(this.formItem.num, selectIds)
          // try {
          //   this.saveLoading = true
          //   let selectIds = this.selections.map(item => item.id)
          //   this.formItem.ids = selectIds.join()
          //   console.log(this.formItem)
          //   await operationtrainStart(this.examType,this.formItem).then(res => {
          //     let _data = res.data
          //     // this.$notify.success('抽取试题成功，正在转入试卷页面')
          //     this.$refs.saasTestPaperDialog.init(_data.examHistoryId,this.formItem.num)
          //     this.saveLoading = false
          //   }).catch(err => {
          //     this.saveLoading = false
          //   })
          // } finally {
          //   this.saveLoading = false
          // }
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
      this.getData()
    },
    changeType(val) {

    }
  }
}
</script>

<style scoped>
.form-box{
  display: inline-block;
  width: 200px;
}
.input-time{
  margin-right: 10px;
  width: 90px;
}
/* .form-box >>> .el-form-item--small .el-form-item__error{
  position: static;
  display: inline-block;
} */
</style>
