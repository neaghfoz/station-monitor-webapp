<template>
  <div>
    <el-button style="float: right"   @click="dialogVisible = true">添加证据文件</el-button>
    <el-dialog
      title="添加稽核证据"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :serialNo="serialNo"
      :modal="false"
      width="40%" append-to-body
    >
      <el-form  ref="evidenceUploadForm" :rules="evidenceUploadRules" :model="evidenceUpload" enctype="multipart/form-data">
        <el-form-item label="证据文件">
          <div class="el-input el-input--small" style="width: 80%">
            <input  style="height:40px"  class="el-input__inner" ref="uploadFileInput"  v-on:change="evidenceFile"    type="file"/>
          </div>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
            <ti-select :clearable="false" style="width: 100px" v-model="evidenceUpload.fileType"
                       dict-type="tibms_audit_evidenceFileType"/>
        </el-form-item>
        <el-form-item label="证据说明" prop="remark">
          <el-input style="width: 60%" type="textarea" maxlength="255" v-model="evidenceUpload.remark" :rows="2" placeholder="证据说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
  import {save} from "@/views/pro/audit/comm/evidence/tiEvidenceApi"


  export default {
    name: "tiEvidenceDetail",
    components: {TiSelect},
    props: {
      value: {
        type: [String, Number, Object]
      },
      serialNo: {
        type: String
      },
    },
    data() {
      return {
        dialogVisible: false,
        evidenceResult:{},
        evidenceUpload: {
          evidenceFile: {},
          fileType:'other',
          remark:''
        },
        evidenceUploadRules:{
          evidenceFile:{required:true,message:'文件不能为空',trigger: 'change'},
          fileType:{required:true,message:'文件类型不能为空',trigger: 'change'},
          remark:{required:true,message:'描述不能为空',trigger: 'change'}
        },
      }
    },
    methods:{
      evidenceFile()
      {
        var file = this.$refs.uploadFileInput.files;
        this.evidenceUpload.evidenceFile = file[0];

      },
      submit()
      {
        this.$refs.evidenceUploadForm.validate((valid) => {
          if (valid) {
            // console.log("evidenceUpload",this.evidenceUpload);
            let file = this.evidenceUpload.evidenceFile.name;
            if( file == undefined){
              this.$notify.warning("文件不能为空！");
              return  false;
            }
            this.saveData();
          }else {
            return false;
          }
        });

      },
      async saveData()
      {
        let fd = new FormData();
        let respone = {};

        fd.append('evidenceFile',this.evidenceUpload.evidenceFile)
        fd.append('serialNo',this.serialNo)
        fd.append('remark',this.evidenceUpload.remark)
        fd.append('fileType',this.evidenceUpload.fileType)
        await this.$http.post('api/v1/audit/comm/evidence/upload',fd).then(function(res)
        {
          respone = res;
        });

        if(respone.success) {
          this.evidenceResult = respone.data;
          this.$notify.success('上传稽核证据成功!');
          this.$emit('refreshDataList');
          this.evidenceUpload.evidenceFile = {};
          this.evidenceUpload.remark = '';
          this.evidenceUpload.fileType = 'other';
          this.dialogVisible = false;
        }else
        {
          this.$notify.error(res.message);
        }

      }
    }
  }
</script>

<style scoped>

</style>
