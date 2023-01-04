<template>
  <el-dialog title="工单操作日志" :visible.sync="visable" :width="'1000px'">
    <vxe-grid
      ref="table"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      keep-source
      highlight-current-row
      height="'300px'"
      class="vxe-table-element"
      :loading="loading"
      :columns="columns"
      :data="data"/>
  </el-dialog>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import request from "@ecip/ecip-web/src/utils/request"

export default {
  name: "CheckLogWin",
  mixins: [...mixin],
  data() {
    return {
      visable: false,
      loading: false,
      data:[],
      columns: [
        { field: 'staffName', title: '被考核人员', minWidth: 120, align: 'center',formatter: ({ cellValue,row }) => cellValue||row.staffNo },
        { field: 'roleName', title: '操作人岗位', minWidth: 120, align: 'center'},
        { field: 'realName', title: '操作人姓名', minWidth: 120, align: 'center',formatter: ({ cellValue,row }) => cellValue||row.creater  },
        { field: 'createTime', title: '操作时间', minWidth: 180, align: 'center' },
        { field: 'opContent', title: '操作记录', minWidth: 400, headerAlign: 'center',align: 'left', showOverflow: true }
      ]
    }
  },
  methods: {
    show(module,bizId){
      this.getData(module,bizId)
      this.visable = true
    },
    // 获取数据
    async getData(module,bizIds){
      this.loading = true
      try {
        let ids = bizIds
        if(bizIds instanceof  Array){
          ids = bizIds.join(',')
        }
        if(!ids){
          this.data = []
          return
        }
        const res = await request({
          url: `api/v1/kpi/checkLog/list/${module}/${ids}`,
          method: 'get',
          params: {},
          data: {}
        });
        if(res.code==200){
          this.data = res.data
        }else{
          this.data = []
        }
      }finally {
        this.loading = false
      }
    }
  }
}
</script>
