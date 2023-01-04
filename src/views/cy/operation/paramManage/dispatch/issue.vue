<template slot-scope="scope">
  <div class="app-container">

    <el-row :gutter="24">
      <el-col :span="7">
        <el-card ref="paramTreeInput" shadow="never">
          <div slot="header" class="clearfix" :style="{ height: '20px' }">
            <span>下发参数表</span>
          </div>
          <div :style="{ height: '45px' }">
            <el-input
              v-if="paramTreeList.length > 0"
              v-model="paramFilterText"
              style="margin-bottom: 15px"
              clearable
              placeholder="输入名称进行过滤"
            />
          </div>
          <div class="comDIv" :style="{ height: (screenHeight * 0.56) + 'px' }">
            <el-tree
              ref="paramTree"
              :style="{ overflow:'auto',height: '100%'}"
              :props="{ label: 'label', children: 'children'} "
              :data="paramTreeList"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterParamNode"
              node-key="id"
              highlight-current
              :show-checkbox="true"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card ref="orgTreeInput" shadow="never">
          <div slot="header" class="clearfix" :style="{ height: '20px' }">
            <span>机构</span>
          </div>

          <div :style="{ height: '45px' }">
            <el-input
              v-if="orgList.length > 0"
              v-model="orgFilterText"
              style="margin-bottom: 15px"
              clearable
              placeholder="输入名称进行过滤"
            />
          </div>
          <div :style="{ height: (screenHeight * 0.56) + 'px' }">
            <el-tree
              ref="orgTree"
              :style="{ overflow:'auto',height: '100%'}"
              :props="{ label: 'name', children: 'children'} "
              :data="orgList"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterOrgNode"
              node-key="id"
              highlight-current
              :show-checkbox="true"
              @check="checkNode"
            />
          </div>
        </el-card>
      </el-col>
      <el-col id="paramInfoId" :span="11">
        <el-card shadow="never" :max-height="this.tableHeight" class="el-card-define">

          <div slot="header" class="clearfix" :style="{ height: '20px' }">
            <span>下发位置</span>
          </div>
          <div style="margin-top:10px;padding-left: 10px" :style="{ height: (35 + screenHeight * 0.56) + 'px' }">
            <div>

              <span>可选车道：</span>
              <div><el-checkbox v-model="laneCheckAll" @change="handleLaneCheckAllChange">全选</el-checkbox></div>
              <el-checkbox-group v-model="checkedLaneTypes" :type="{ float: 'left' }">
                <el-checkbox v-for="item in laneTypes" :key="item.key" :label="item.key" @change="checked=>handleLaneChange(checked, item.key)">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </div>

            <div id="lanePanel" class="box" style="overflow-y:auto;border:1px solid #EBEEF5;padding: inherit;margin-top: 10px;" :style="{ height: (screenHeight * 0.6* 0.8) + 'px' }">
              <el-checkbox-group v-model="checkedLanes" :type="{ float: 'left' }">

                <div v-for="item in useLanes">
                  <el-checkbox :key="item.laneId" :label="item.laneId">{{ '(' + stationMap[item.stationId] + ')' + '-' + item.laneNo + '-' + laneTypeMap[item.laneType] + '-' + item.serverIp }}</el-checkbox>
                </div>

              </el-checkbox-group>
            </div>
          </div>

        </el-card>
      </el-col>
    </el-row>

    <div style="text-align:center">
      <el-button type="primary" :loading="saveLoading" @click="save">保存</el-button>
      <el-button @click="close()">关闭</el-button>
    </div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'
import { filterNode } from 'ecip-web/utils/tableUtil'
import dictUtils from 'ecip-web/utils/dictUtils'
import { getUseTable, getData, findUseLanes, save } from './dispatch'
const laneTypes = [{ key: 'MTC', label: 'MTC', tableLaneType: ['2', '3', '5', '6'] }, { key: 'ETC', label: 'ETC', tableLaneType: ['1', '3', '4', '6'] }, { key: 'ENT', label: '入口', tableLaneType: ['1', '2', '3'] }, { key: 'EXI', label: '出口', tableLaneType: ['4', '5', '6'] }]
export default {
  name: 'DispatchIssueView',
  components: { },
  mixins: [...mixin],
  data() {
    return {
      importVisible: false,
      showSearchForm: true,
      stationMap: {},
      checkedLaneTypes: [],
      checkedLanes: [],
      stationCheckAll: false,
      laneCheckAll: false,
      paramFilterText: '',
      orgFilterText: '',
      queryParams: {
        sysOrgIdStr: '',
        mainId: '',
        tableName: '',
        status: ''
      },
      paramTreeList: [],
      orgList: [],
      tableHeight: null,
      laneTypes: laneTypes,
      screenHeight: document.body.clientHeight,
      useLanes: [],
      laneTypeMap: {},
      laneTypeRefMap: {},
      useTable: [],
      saveLoading: false
    }
  },
  watch: {
    paramFilterText(val) {
      this.$refs.paramTree.filter(val)
    },
    orgFilterText(val) {
      this.$refs.orgTree.filter(val)
    },
    screenHeight(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val
        this.timer = true
        const that = this
        setTimeout(function() {
          that.timer = false
        }, 400)
      }
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
  },
  created() {
    this.queryParams.mainId = this.$route.query.id
    this.init()
  },
  methods: {
    init() {
      // eslint-disable-next-line no-undef
      var tablesClass = dictUtils.getDictList('tibms_param_tableClass')
      var laneType = dictUtils.getDictList('tibms_param_laneType')

      if (laneType) {
        laneType.forEach((item, index) => {
          this.laneTypeMap[item.value] = item.label
        })
      }

      laneTypes.forEach((item, index) => {
        this.laneTypeRefMap[item.key] = item.tableLaneType
      })

      // 设置头
      var data = []
      data.push({ label: '所有参数表', id: 0 })
      if (tablesClass) {
        tablesClass.forEach((item, index) => {
          data.push({ label: item.label, id: 'table' + item.value, pid: 0 })
        })

        getUseTable({}).then((res) => {
          this.useTable = res.data
          res.data.forEach((item, index) => {
            item.label = item.tableShowName
            item.pid = 'table' + item.tableClass
            data.push(item)
          })

          this.paramTreeList = this.buildTree(data, 'pid', 'id', 'children')

          console.log(this.paramTreeList)
        })
      }
      getData('api/v1/common/sysOrg/orgList', {}, {}, false).then((res) => {
        console.log(res.data)
        this.orgList = res.data
      })
    },
    submit() {
      this.getData()
    },
    getData() {

    },
    handleReset() {
      this.$refs.searchForm.resetFields()
    },
    filterParamNode(value, data, node) {
      return filterNode(value, data, node, 'title')
    },
    filterOrgNode(value, data, node) {
      return filterNode(value, data, node, 'name')
    },
    async getParamTree() {
      this.paramTreeList = []
    },
    buildTree(list, pidStr, idStr, childrenStr) {
      const listOjb = {} // 用来储存{key: obj}格式的对象
      const treeList = [] // 用来储存最终树形结构数据的数组
      // 将数据变换成{key: obj}格式，方便下面处理数据
      for (let i = 0; i < list.length; i++) {
        listOjb[list[i][idStr]] = list[i]
      }
      // 根据pid来将数据进行格式化
      for (let j = 0; j < list.length; j++) {
        // 判断父级是否存在
        const haveParent = listOjb[list[j][pidStr]]
        if (haveParent) {
          // 如果有没有父级children字段，就创建一个children字段
          !haveParent[childrenStr] && (haveParent[childrenStr] = [])
          // 在父级里插入子项
          haveParent[childrenStr].push(list[j])
        } else {
          // 如果没有父级直接插入到最外层
          treeList.push(list[j])
        }
      }
      return treeList
    },
    handleLaneCheckAllChange() {
      if (this.laneCheckAll) {
        this.laneTypes.forEach((item, index) => {
          this.checkedLaneTypes.push(item.key)
        })
        this.useLanes.forEach((item, index) => {
          this.checkedLanes.push(item.laneId)
        })
      } else {
        this.checkedLaneTypes = []
        this.checkedLanes = []
      }
    },
    handleLaneChange(checked, value) {
      var laneTypeArr = this.laneTypeRefMap[value]
      if (checked) {
        this.useLanes.forEach((item, index) => {
          if (laneTypeArr.indexOf(item.laneType + '') >= 0) {
            this.checkedLanes.push(item.laneId)
          }
        })
      } else {
        var delArr = []
        this.useLanes.forEach((item, index) => {
          if (laneTypeArr.indexOf(item.laneType + '') >= 0) {
            delArr.push(item.laneId)
          }
        })

        for (var i = 0; i < this.checkedLanes.length;) {
          if (delArr.indexOf(this.checkedLanes[i]) >= 0) {
            this.checkedLanes.splice(i, 1)
            console.log(this.checkedLanes)
          } else {
            i++ // 只有在没有删除元素时才对索引 i++
          }
        }
      }
    },
    checkNode() {
      this.useLanes = []
      var stationIdStrs = ''
      this.$refs.orgTree.getCheckedNodes().forEach((item, index) => {
        this.stationMap[item.stationId] = item.name
        if (index === 0) {
          stationIdStrs += item.stationId
        } else {
          stationIdStrs += ',' + item.stationId
        }
      })
      if (!stationIdStrs) {
        this.checkedLanes = []
        return
      }

      findUseLanes({ stationIdStr: stationIdStrs }).then((res) => {
        this.useLanes = res.data
        console.log(this.checkedLanes)

        this.checkedLaneTypes.forEach((item, index) => {
          this.handleLaneChange(true, item)
        })
      })
    },
    save() {
      var data = { sendParaList: [], sendRecordMainList: [] }
      this.$refs.paramTree.getCheckedNodes().forEach((item, index) => {
        if (item.tableName) {
          data.sendParaList.push(item)
        }
      })
      if (data.sendParaList.length === 0) {
        alert('请选中下发参数表！')
        return
      }

      if (this.checkedLanes.length === 0) {
        alert('请选中下发车道！')
        return
      }

      var laneMap = {}

      this.useLanes.forEach((item, index) => {
        laneMap[item.laneId] = item
      })

      this.checkedLanes.forEach((item, index) => {
        var lane = laneMap[item]
        var obj = {}
        obj.roadNo = lane.roadNo
        obj.stationNo = lane.stationNo
        obj.laneNo = lane.laneNo
        obj.computerIP = lane.serverIp
        obj.terminalType = 3
        obj.terminalInfo = lane.laneId
        obj.sectionId = lane.roadId
        obj.roadNodeId = lane.stationId
        data.sendRecordMainList.push(obj)
      })
      this.saveLoading = true
      save(data).then((res) => {
        this.saveLoading = false
        this.$notify.success(res.message)
      },
      // eslint-disable-next-line handle-callback-err
      err => {
        this.saveLoading = false
      })
    },
    close() {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.go(-1)
    }

  }

}
</script>

<style scoped>
  .el-card{
    margin-bottom:20px;
  }

</style>
