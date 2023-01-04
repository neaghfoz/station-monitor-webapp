<template>
  <div class="app-container">
    <el-dialog
      title="纸券删除确认"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <el-table
        :data="deleteData"
        height="250"
        style="width: 100%">
        <el-table-column
          prop="seq"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="paperStartNo"
          label="纸券起始号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="paperEndNo"
          label="纸券终止号">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="method !== 'view'" type="primary" :loading="saveLoading" @click="paperDelete">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import mixin from 'ecip-web/utils/common-mixin'
import { deleteByIds } from '../paperApi'

export default {
  name: 'PaperDeleteForm',
  components: {},
  mixins: [...mixin],
  data() {
    return {
      visible: false,
      loading: false,
      saveLoading: false,
      method: '',
      deleteData: [],
      ids: ''
    }
  },
  methods: {
    init: function(tenantId, appId, papers, ids) {
      this.visible = true

      this.$nextTick(async () => {
        this.render(tenantId, appId)

        // 填充数据
        const shows = []
        for (let i = 0; i < papers.length; i++) {
          const item = papers[i]
          shows.push({
            seq: i + 1,
            paperStartNo: item.paperStartNo,
            paperEndNo: item.paperEndNo
          })
        }

        this.deleteData = shows
        this.ids = ids.join(',')
      })
    },
    render: function(tenantId, appId) {
      // 清空初始化
      this.$data.deleteData = []
    },
    getData: function() {
    },
    paperDelete: async function() {
      try {
        this.saveLoading = true
        await deleteByIds(this.ids)
        this.$notify.success('纸券删除成功')
        this.$emit('refreshData')
        this.visible = false
      } finally {
        this.saveLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
