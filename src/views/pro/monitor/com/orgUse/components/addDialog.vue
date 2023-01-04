<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="30%"
    >
      <el-form ref="dialogForm" v-loading="loading" :model="formItem" label-width="120px">
        <el-row :gutter="15" v-show="formItem.model == 'mobile'">
          <el-col :span="24">
            <el-form-item label="机构" prop="sysOrg"
                          :rules="[ { required: true, message:'机构不能为空', trigger:'change' } ]">
              <ti-sys-org ref="sysOrg" v-model="formItem.sysOrg"  default-first-value/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="ip" prop="serverIp"
                          :rules="[ { required: true, message:'ip不能为空', trigger:'change' } ]">
              <el-input v-model="formItem.serverIp" maxlength="32" type="text" placeholder="ip"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="服务器名称" prop="serverName"
                          :rules="[ { required: true, message:'服务器名称不能为空', trigger:'change' } ]">
              <el-input v-model="formItem.serverName" maxlength="50" type="text" placeholder="服务器名称"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import tiSysOrg from "@/views/pro/common/tiElement/tiSysOrg/tiSysOrg";
  import {add, addMobile} from '../orgUseApi'
  import {getCurrentOrgPath} from "@/views/pro/common/util/dataUtil"

  export default {
    name: 'addDialog',
    components: {tiSysOrg},
    mixins: [...mixin],
    data() {
      return {
        visible: false,
        method: '',
        title: '新增',
        loading: false, // 页面加载遮罩
        saveLoading: false, //  保存加载
        formItem: {
          model: '',
          serverIp: '',
          serverName: '',
          sysOrg: {},
          orgId: '',
          code: '',
          name: '',
          moduleType:'monitor',
          orgPath:''
        }
      }
    },
    created() {
    },
    methods: {
      init(model, id) {
        this.visible = true
        this.formItem.model = model;
        this.formItem.id = id;
        this.formItem.isUse = 1;
      },
      async save() {
        let validFlag = null;
        this.$refs.dialogForm.validate(valid => {
          validFlag = valid;
        });
        if (!validFlag) {
          return
        }

        try {
          this.saveLoading = true
          if (this.formItem.model == 'mobile') {
            let sysOrg = this.$refs.sysOrg.getSysOrg();
            let pathList=getCurrentOrgPath(sysOrg.id,this.$refs.sysOrg.treeData);
            console.log("pathList:",pathList);
            this.formItem.orgPath =pathList.join('_');
            this.formItem.orgId = sysOrg.id;
            this.formItem.code = sysOrg.code;
            this.formItem.name = sysOrg.name;
            await addMobile({}, this.formItem);
          } else {
            await add({}, this.formItem);
          }
          this.$notify.success('新增成功');
          this.$emit('refreshDataList')
          this.visible = false
        } finally {
          this.saveLoading = false
        }
      }
    }
  }
</script>
