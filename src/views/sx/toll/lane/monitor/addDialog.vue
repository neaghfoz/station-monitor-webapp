<template>
  <div class="app-container">
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="30%"
    >
      <el-form ref="dialogForm" v-loading="loading" :model="addformItem" label-width="120px">
        <el-row :gutter="15" >
          <el-col :span="24">
            <el-form-item label="车牌" prop="VehicleId"
                          :rules="[ { required: true, message:'车牌不能为空', trigger:'change' } ]">
              <el-input v-model="addformItem.VehicleId" maxlength="15" type="text" placeholder="车牌"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="总重" prop="TotalWeight"
                          :rules="[ { required: true, message:'总重不能为空', trigger:'change' } ]">
              <el-input v-model="addformItem.TotalWeight" maxlength="10" type="text" placeholder="总重"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="限重" prop="MaximumAllowWeight"
                          :rules="[ { required: true, message:'限重不能为空', trigger:'change' } ]">
              <el-input v-model="addformItem.MaximumAllowWeight" maxlength="10" type="text" placeholder="限重"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="轴数" prop="VehAxleCnt"
                          :rules="[ { required: true, message:'轴数不能为空', trigger:'change' } ]">
              <el-input v-model="addformItem.VehAxleCnt" maxlength="10" type="text" placeholder="轴数"/>
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
        addformItem: {
          VehicleId: '',
          TotalWeight: '',
          VehAxleCnt: '',
          MaximumAllowWeight: ''
        }
      }
    },
    created() {
    },
    methods: {
      init() {
        this.visible = true
        this.addformItem.VehicleId = this.$parent.$data.addWeightformItem.VehicleId
        this.addformItem.MaximumAllowWeight = ''
        this.addformItem.TotalWeight = ''
        this.addformItem.VehAxleCnt = ''
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

          this.$parent.$data.addWeightformItem.TotalWeight = this.addformItem.TotalWeight
          this.$parent.$data.addWeightformItem.VehAxleCnt = this.addformItem.VehAxleCnt
          this.$parent.$data.addWeightformItem.MaximumAllowWeight = this.addformItem.MaximumAllowWeight
          this.saveLoading = true
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
