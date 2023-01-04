<template>
  <div class="app-container">
    <el-form
      ref="form"
      v-loading="loading"
      :model="formItem"
      label-width="100px"
      style="width: 90%"
    >
        <el-form-item
          label="标题"
          prop="title"
          :rules="[{ required: true, message: '标题不能为空', trigger: 'blur' }, {max: 100,message: '标题长度不能超过100字符' }]"
        >
        <el-input v-model="formItem.title" type="text" placeholder="标题" />
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="文件类别"
            prop="fileCatgory"
            :rules="[
              { required: true, message: '文件类别不能为空', trigger: 'blur' }
            ]"
          >
            <ti-select
              v-model="formItem.fileCatgory"
              placeholder="请选择"
              dict-type="tibms_operation_fileCatgory"
              @change="handlefileCatgoryChange"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="文件类型"
            prop="fileType"
            :rules="[
              {
                required: this.fileTypeRequired,
                message: '文件类型不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <ti-select
              v-model="formItem.fileType"
              placeholder="请选择"
              dict-type="tibms_operation_fileType"
              :disabled="this.fileTypeDisabled"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="发布单位"
        prop="publisherName"
        :rules="[
          { required: true, message: '发布单位不能为空', trigger: 'blur' },{max: 200,message: '发布单位长度不能超过200字符' }
        ]"
      >
        <el-input
          v-model="formItem.publisherName"
          type="text"
          placeholder="发布单位"
        />
      </el-form-item>
      <el-form-item
        label="文件属性"
        prop="attriBute"
        :rules="[
          { required: true, message: '文件属性不能为空', trigger: 'blur' },
        ]"
      >
        <ec-radio-group
          v-model="formItem.attriBute"
          dict-type="tibms_operation_attriBute"
        />
      </el-form-item>
      <el-form-item
        label="正文"
        prop="content"
        :rules="[{ required: true, message: '正文不能为空', trigger: 'blur' },{max: 30000,message: '发布单位长度不能超过15000字' }]"
      >
        <Ti-Ec-Editor ref="editor2" v-model="formItem.content" />
      </el-form-item>

      <el-form-item label="附件">
        <EcFileModal
          action="/api/v1/policyFile/upload"
          :show-file-list="true"
          :multiple="true"
          @onSuccess="uploadSuccess"
          :onRemove="uploadFileRemove"
          @beforeUpload="beforeUpload"
          @onError="uploadFileError"
          v-permission="['policyFile:upload']"
        />
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button type="primary" :loading="saveLoading" @click="daSave(0,'form')"
        >保存草稿</el-button
      >
      <el-button type="primary" :loading="saveLoading" @click="daSave(1,'form')"
        >直接发布</el-button
      >
      <el-button @click="close()">关闭</el-button>
    </div>
  </div>
</template>

<script>
import mixin from "ecip-web/utils/common-mixin";
import { save } from "./policyFile";
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect";
import TiEcEditor from "@/views/cy/common/tiEcEditor/tiEcEditor";
import EcFileModal from "./EcFileModal";
export default {
  name: "OperationPolicyFileAdd",
  components: { TiSelect, EcFileModal, TiEcEditor },
  mixins: [...mixin],
  data() {
    return {
      loading: false,
      saveLoading: false,
      fileTypeRequired: false,
      fileTypeDisabled: false,
      publishTimeDisabled: true,
      startTimeRequired: false,
      role: {},
      method: "",
      title: "",
      formItem: {
        title: "",
        fileCatgory: "policyFile",
        fileType: "chargePolicy",
        publishStatus: "",
        publisherName: "",
        attriBute: "contry",
        content: "",
        startTime: "",
        endTime: "",
        policyFileInfoList: [],
        status: 0,
      },
      fileList: [],

      uploadingFileList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
        this.formItem.title = "";
        this.formItem.fileCatgory = "";
        this.formItem.fileType = "";
        this.formItem.publishStatus = "";
        this.formItem.publisherName = "";
        this.formItem.attriBute = "";
        this.formItem.content = "";
        this.formItem.startTime = "";
        this.formItem.endTime = "";
        this.formItem.policyFileInfoList = [];
        this.formItem.status = "";
    },
    getData() {},
    daSave(status,formName) {
      this.$refs[formName].validate(valid => {
          if (!valid) {
            this.$notify.error("请按提示正确填写表单")
          }else{
            var statusText = "";
            if (status === 0) {
              statusText = "保存草稿";
              this.formItem.publishStatus = "draft";
            } else if (status === 1) {
              statusText = "直接发布";
              this.formItem.publishStatus = "publish";
            }


            if (this.uploadingFileList.length > 0) {
              this.$confirm(`有文件正在上传,是否继续` + statusText, "提示", {
                confirmButtonText: "继续",
                cancelButtonText: "等待",
                type: "warning",
              })
                .then(() => {
                  this.formItem.status = status;
                  if (status === 0) {
                    this.save();
                  } else if (status === 1) {
                    this.validateSave();
                  }
                })
                .catch(() => {});
            } else {
              this.formItem.status = status;
              if (status === 0) {
                this.save();
              } else if (status === 1) {
                this.validateSave();
              }
            }
          }
      });
    },
    validateSave() {
      console.log(this.uploadingFileList);
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.save();
        }
      });
    },
    save() {
      try {
        this.saveLoading = true;
        this.formItem.policyFileInfoList = [];
        this.fileList.forEach((item, index) => {
          if (!item.response && item.url) {
            this.formItem.policyFileInfoList.push(item);
          }
          if (item.response && item.response.code === 200) {
            this.formItem.policyFileInfoList.push(item.response.data);
          }
        });
        save(this.formItem).then((res) => {
          this.$notify.success(res.data);
          //调用全局挂载的方法
          this.$store.dispatch('tagsView/delView', this.$route)
          console.log()
          if(this.formItem.publishStatus == 'draft'){
            this.$router.go(-1);
          }else{
            this.$router.push({path: '/operation/policyFile/publish/list'});
          }
          //返回上一步路由

        });
      } finally {
        this.saveLoading = false;
      }
    },
    uploadSuccess(resp, file, filelist) {
      this.fileList = filelist;
      this.uploadingFileList = this.uploadingFileList.filter((item) => {
        return item.uid !== file.uid;
      });
    },
    handlefileCatgoryChange(result) {
      if (result === "policyFile") {
        this.fileTypeRequired = true;
        this.fileTypeDisabled = false;
      } else {
        this.formItem.fileType = "";
        this.fileTypeRequired = false;
        this.fileTypeDisabled = true;
      }
    },
    publishStatusChange(val) {
      if (val === "publish") {
        this.publishTimeDisabled = false;
        this.startTimeRequired = true;
      } else {
        this.formItem.startTime = "";
        this.formItem.endTime = "";
        this.publishTimeDisabled = true;
        this.startTimeRequired = false;
      }
    },
    uploadFileRemove(file, fileList) {
      this.uploadingFileList  = this.uploadingFileList.filter(item =>item.name!==file.name);
      this.fileList = fileList;
    },
    uploadFileError(e,file, fileList) {
      this.uploadingFileList  = this.uploadingFileList.filter(item =>item.name!==file.name);
      this.fileList = fileList;
    },
    close() {
      /*this.$store.state.tagsView.visitedViews.splice(
        this.$store.state.tagsView.visitedViews.findIndex(
          (item) => item.path === this.$route.path
        ),
        1
      );
      this.$router.go(-1);*/
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1);
      this.$router.go(-1);
    },
    beforeUpload(file, fileList) {
      this.uploadingFileList.push(file);
    },
  },
};
</script>

<style scoped>
</style>
