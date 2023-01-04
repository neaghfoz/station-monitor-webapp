<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-form ref="form" v-loading="loading" status-icon :model="formItem" label-width="120px">
        <el-form-item
          label="场次名称"
          prop="name"
          :rules="[
            {required: true, message:'场次名称不能为空', trigger:'blur'},
            {max: 100, message:'场次名称长度应在1-100字之间', trigger:'blur'}
          ]"
        >
          <el-input v-model="formItem.name" :disabled="hasExam" type="text" placeholder="场次名称" />
        </el-form-item>

        <el-form-item label="场次状态" prop="status" :rules="[{ required: true, message: '请选择', trigger: 'change'}]">
          <ec-radio-group v-model="formItem.status" :ec-data="[{ value: 1, label: '开启' }, { value: 0, label: '关闭' }]" />
        </el-form-item>

        <!--  :rules="[{required: true, message:'请上传', trigger:'change'}]" -->
        <el-form-item label="场次缩略图" prop="thumb">
          <TiEcImgModal
            action="/api/v1/train/richtext/uploadImage"
            :show-file-list="false"
            :multiple="false"
            accept=".jpg,.jpeg,.png"
            :data="{'belongs': 'version'}"
            :value-field="formItem.thumb"
            :file-list="fileList"
            :on-remove="uploadFileRemove"
            @onSuccess="uploadSuccess"
            @beforeUpload="beforeUpload"
          />
        </el-form-item>

        <!-- v-if="!formItem.testPaperId" -->
        <el-form-item
          label="考试科目"
          prop="subjectId"
          :rules="[
            {required: true, message:'请选择考试科目', trigger:'change'}
          ]"
        >
          <ti-select
            v-model="formItem.subjectId"
            placeholder="选择科目"
            url="/api/v1/train/subject/list"
            :is-post="true"
            :disabled="hasExam"
          />
        </el-form-item>

        <el-form-item v-if="method != 'edit'" label="所属考试" prop="examId" :rules="[{required: true, message:'请选择所属考试', trigger:'change'}]">
          <ti-select
            v-model="formItem.examId"
            placeholder="选择所属考试"
            url="/api/v1/train/exam/list"
            :is-post="true"
            :props="{key:'id',value:'id',label:'name'}"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="温馨提示"
      :close-on-click-modal="false"
      :visible.sync="comfireVisible"
      width="300"
    >
      <div>当前所选科目与绑定的试卷科目不一致，是否要清除所属试卷及考试时间范围？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="delLoading" @click="bingExamDel">确定</el-button>
        <el-button @click="comfireVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { getById, save, update } from './../examnumViewApi'
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import TiEcImgModal from '@/views/pro/common/tiElement/tiEcImgModal/TiEcImgModal'

export default {
  name: 'VueExamnumSaasTenantForm',
  components: { TiSelect, TiEcImgModal },
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      comfireVisible: false,
      loading: false, // 页面加载遮罩
      saveLoading: false, //  保存加载
      delLoading: false,
      method: '',
      title: '',
      tenant: {},
      formItem: {
        name: '',
        status: 1,
        thumb: '',
        subjectId: '',
        examId: ''
      },
      fileList: [],
      uploadingFileList: [],
      hasExam: false
    }
  },
  methods: {
    init(method, row) {
      this.method = method
      this.tenant = row
      if (method === 'add') {
        this.title = `新增场次`
      } else if (method === 'edit') {
        this.title = `修改场次` // -${row.name}-信息
      } else if (method === 'view') {
        this.title = `查看场次` // -${row.name}-信息
      }
      this.hasExam = row ? (!!row.testPersonNum) : false
      this.fileList = []
      this.delLoading = false
      this.saveLoading = false
      this.comfireVisible = false
      this.visible = true
      this.loading = false
      this.$nextTick(async() => {
        // this.$refs.form.clearValidate()
        this.$refs['form'].resetFields()
        Object.assign(this.$data.formItem, this.$options.data().formItem)
        if (method === 'edit' || method === 'view') { // 修改或者查看
          try {
            this.loading = true
            const { data } = await getById(row.id)
            data.subjectId = data.subjectId.toString()
            Object.assign(this.formItem, data)
            this.tenant = data
            this.hasExam = data ? (!!data.testPersonNum) : false
          } finally {
            this.loading = false
          }
        } else {
          // 新增情况下，需要清空试卷和时间范围信息等其他信息，避免前一个修改引起多余信息赋值
          this.formItem = this.$options.data().formItem
        }
      })
    },
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { tenant, hasExam } = this
          if (!hasExam && tenant && tenant.testPaperId && this.formItem.subjectId !== tenant.subjectId) {
            this.comfireVisible = true
            return
          }
          try {
            this.saveLoading = true
            if (this.method === 'edit') {
              await update(this.formItem.id, this.formItem)
            } else {
              await save(this.formItem)
            }
            this.$notify.success('保存成功')
            this.$emit('refreshDataList')
            this.visible = false
          } finally {
            this.saveLoading = false
          }
        }
      })
    },
    async bingExamDel() {
      try {
        this.delLoading = true
        if (this.method === 'edit') {
          await update(this.formItem.id, this.formItem)
        } else {
          await save(this.formItem)
        }
        this.$notify.success('保存成功')
        this.$emit('refreshDataList')
        this.delLoading = false
        this.comfireVisible = false
        this.visible = false
      } finally {
        this.delLoading = false
      }
    },
    uploadSuccess(resp, file, filelist) {
      if (resp.code === 200) {
        this.formItem.thumb = resp.data.url
      }

      this.fileList = filelist
      this.uploadingFileList = this.uploadingFileList.filter((item) => {
        return item.uid !== file.uid
      })
    },
    uploadFileRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file, fileList) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传场次缩略图只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      this.uploadingFileList.push(file)
    }
  }
}
</script>

<style scoped>

</style>
