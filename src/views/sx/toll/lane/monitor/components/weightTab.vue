<template>
  <div>
    <vxe-grid
      ref="weightVex"
      highlight-hover-row
      border
      resizable
      sync-resize
      auto-resize
      max-height="1000"
      class="vxe-table-element"
      :loading="loading"
      :start-index="(pageWeight.currentPage - 1) * pageWeight.pageSize"
      :pager-config="pageWeight"
      :columns="columnsWeight"
      :data="tableWeightData"
      @page-change="handlePageWeightChange"
    >

    </vxe-grid>

  </div>
</template>


<script>

  function getJsonLength(json){
    let jsonLength = 0
    for (const i in json) {
      jsonLength++;
    }
    return jsonLength;
  }

  import mixin from 'ecip-web/utils/common-mixin';

  export default {
    name: "weightTab",
    props:
      {
        queryParams: {
          type: Object,
          required: false
        },
      },
    components: {},
    mixins: [...mixin],
    data() {
      return {
        showSearch: true,
        loading: false,
        tableToolbar: {
          id: 'monitor.com.orgUse.orgUseView-toolbar',
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
        pageWeight: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          align: 'left',
          pageSizes: [10, 20, 50, 100, 200, 500],
          layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
          perfect: true
        },
        selectionsWeight: [],
        tableWeightData: [],
        columnsWeight: [
          {title: '车牌', field: 'VehicleId', minWidth: 150, showOverflow: true},
          {title: '总重', field: 'TotalWeight', minWidth: 150, showOverflow: true},
          {title: '限重', field: 'MaximumAllowWeight', minWidth: 150, showOverflow: true},
          {title: '轴数', field: 'VehAxleCnt', minWidth: 100, showOverflow: true},
          /*{title: '操作', width: 150, fixed: 'right', align: 'center', slots: {default: 'operation'}},*/
        ]
      }
    },
    created() {
        alert(this.weightInfo)
        this.getWeightData();
    },
    methods: {
      searchData(){
        Object.assign(this.$data.pageWeight, this.$options.data().pageWeight);
        this.getWeightData();
      },
      async getWeightData() {
        this.loading = true

        // 每次查询初始化checkbox selections
        this.selectionsWeight = []
        this.tableWeightData = this.weightInfo
        this.pageWeight.total = getJsonLength(this.weightInfo)

        this.loading = false

        alert(this.weightInfo)
      },
      handlePageWeightChange({currentPage, pageSize}) {
        this.pageWeight.currentPage = currentPage
        this.pageWeight.pageSize = pageSize
        this.getWeightData()
      }
    }
  }

</script>

<style scoped>

</style>
