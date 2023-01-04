<template>
  <el-form ref="searchItem" :model="queryParams" :rules="rules" inline :label-width="'100px'">
    <el-row>
      <el-form-item>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="日期" style="margin-left: 50px">
        <label slot="label"><span style="color:red">*</span>&nbsp;&nbsp;日期</label>
        <ti-date ref="dayDate" v-model="queryParams.msgDate" dateType="date" :clearable="false" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="isChange()"/>
      </el-form-item>

      <el-form-item class="searchItem" :label-width="'50px'" style="margin-left: 50px">
        <el-button type="primary" @click="dataRerun()" :disabled="isRerun" :loading="isLoading">重跑</el-button>
      </el-form-item>

    </el-row>
    <el-row>
      <p style="margin-left: 20px">注意：单次重跑只能重跑一天</p>
    </el-row>
    <el-row>
      <div>
        <p style="font-size:14px;color: #D3D3D3;" >
          <template>
            <slot name="remark"></slot>
          </template>
        </p>
      </div>
    </el-row>
    <vxe-grid
      ref="vxe"
      highlight-hover-row
      border
      show-overflow
      show-header-overflow
      resizable
      max-height="1000"
      sync-resize
      auto-resize
      keep-source
      class="vxe-table-element"
      :loading="loading"
      :columns="columns"
      :data="tableData.records"
      :toolbar="tableToolbar"
      :pager-config="pageConfig"
      :seq-config="{seqMethod}"
      :start-index="(tableData.current - 1) * tableData.size"
      @page-change="handlePageChange"
    >
    </vxe-grid>
  </el-form>
</template>

<script>

  import mixin from 'ecip-web/utils/common-mixin'
  import TiDate from "@/views/pro/common/tiElement/tiDate/tiDate";
  import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect';
  import { dataRerunFindPage,dataRerunMain } from './dataRerunViewApi'
  import store from '@/store';
  import { getToken } from '@/utils/auth';

  export default {
    name: 'dataRerunViewName',
    components: { TiDate,TiSelect },
    mixins: [...mixin],
    props: {
      maxSize: {
        type: [Number],
        required: false,
        default: 200
      },
      accept: {
        type: [String],
        required: false
      },
      limit: {
        type: [Number],
        required: false,
        default: 1
      }
    },
    data() {
      return {
        isRerun: true,
        isLoading: false,
        queryParams: {
          msgDate: '',
          userName: '',
          realName: '',
        },
        tableToolbar: {
          id: 'TiUploadNotify-Toolbar',
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
          zoom: true, // 最大化按钮
          // 列宽操作记录
          resizable: {
            storage: true
          },
          // 列操作记录
          setting: {
            storage: true
          }
        },
        tableData: [],
        columns: [
          { title: '序号', type: 'seq', align: 'center', showOverflow: true },
          { field: 'msgDate', title: '日期', align: 'center', minWidth: 100, showOverflow: true },
          { field: 'userOperator', title: '操作人', align: 'center', minWidth: 150, showOverflow: true },
          { field: 'createTime', title: '操作时间', align: 'center', minWidth: 80, showOverflow: true },
        ],
        pageConfig: {
          total: 0,
          currentPage: 1,
          pageSize: 5,
          align: 'right',
          pageSizes: [5, 10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      isChange() {
        // 确定时间范围之后触发的函数
        if(this.queryParams.msgDate != null) {
          this.isRerun = false;
        }
      },
      async getData() {
        //用户机构
        this.queryParams.userName = store.getters.username;
        this.queryParams.realName = store.getters.name;

        const { data } = await dataRerunFindPage(Object.assign({}, { size: this.pageConfig.pageSize,
          current: this.pageConfig.currentPage }), this.queryParams)
        this.tableData = data
        this.pageConfig.total = data.total
      },
      handlePageChange({ currentPage, pageSize }) {
        this.pageConfig.currentPage = currentPage
        this.pageConfig.pageSize = pageSize
        this.getData()
      },
      dataRerun() {
        this.isRerun = true;
        this.isLoading = true;
        this.queryParams.userOperator = this.queryParams.userName;
        dataRerunMain(this.queryParams).then((res) => {
          if(res.data == '执行成功') {
            this.$notify.success(res.data);
            this.getData();
          } else {
            this.$notify.warning(res.data);
            this.getData();
          }
          this.queryParams.msgDate = "";
          if(this.queryParams.msgDate == "") {
            this.isLoading = false;
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
