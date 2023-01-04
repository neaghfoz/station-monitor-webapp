<template>
  <el-select-tree
    :style="pstyle"
    ref="elSelectTree"
    :value="treeId"
    :default-expand-all="options.defaultExpandAll"
    :multiple="options.multiple"
    placeholder="请选择"
    :disabled="options.disabled"
    :popover-min-width="200"
    :data="treeData"
    :props="options.props"
    :size="options.size"
    :default-expanded-keys="defaultExpandedKeys"
    :disabled-values="options.disabledValues"
    :check-strictly="options.checkStrictly"
    :clearable="options.clearable"
    :filterable="options.filterable"
    :cache="options.cache"
    @change="onChange"
  />
</template>

<script>
/**
 * vxe-grid 每次编辑时，都会调取created钩子，所以vxe相关初始化应该在created钩子中进行；
 * 外部普通使用组件的时候，只有进入编辑页面第一次会执行created，后续重复点击modal都不会进入created钩子，故初始化需要放在dialog弹框弹出的时候执行；
 */
import {getData} from '../tiSelect/tiSelectApi'
import sysOrgConstant from "@/views/pro/common/constant/sysOrgConstant"
import {treeChildren2List} from "@/views/pro/common/util/dataUtil";

export default {
  name: 'TiSysOrg',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: { //  后续再props新增接收属性，都需要在data中新增对应tm+属性名的对应映射的属性，并在propsInitData、vxeInitData中初始化
    value: {
      type: [Number, String, Boolean, Array, Object],
      required: false
    },
    ecData: {
      type: Array,
      required: false
    },
    cache: {
      type: Boolean,
      default: false,
      required: false
    },
    multiple: {
      type: Boolean,
      default: false,
      required: false
    },
    checkStrictly: {
      type: Boolean,
      default: true,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    pstyle: {
      type: String,
      required: false
    },
    disabledValues: {
      type: Array,
      required: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: true,
      required: false
    },
    clearable: {
      type: Boolean,
      default: false,
      required: false
    },
    filterable: {
      type: Boolean,
      default: true,
      required: false
    },
    defaultExpandedKeys: {
      type: Array,
      required: false
    },
    size: {
      type: String,
      required: false
    },
    banRoot: {
      type: Boolean,
      default: false,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    data: {
      type: Object,
      default: () => {
      },
      required: false
    },
    params: {
      type: Object,
      default: () => {
      },
      required: false
    },
    isPost: {
      type: Boolean,
      default: false,
      required: false
    },
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id',
          label: 'fullName',
          children: 'children'
        }
      },
      required: false
    },
    dataFilter: {
      type: Function,
      default: (data) => data,
      required: false
    },
    defaultFirstValue: { //是否默认值，默认值第一个机构
      type: Boolean
    },
    showLevel: { //显示数据的层级，例如2，只展示路段以上的（含路段）
      type: String,
    },
    showAll: { //是否默认值，默认值第一个机构
      type: Boolean,
      default: false,
      required: false
    },
    dataList: { //静态数据
      type: Array,
      default: () => [],
      required: false
    }
  },
  data() {
    return {
      treeId: this.multiple ? [] : '',
      options: { // 以上为data属性对应 props属性
        url: this.url,
        data: this.data,
        params: this.params,
        isPost: this.isPost,
        nodeKey: this.nodeKey,
        multiple: this.multiple,
        checkStrictly: this.checkStrictly,
        disabled: this.disabled,
        defaultExpandAll: this.defaultExpandAll,
        clearable: this.clearable,
        filterable: this.filterable,
        banRoot: this.banRoot,
        size: this.size,
        disabledValues: this.disabledValues,
        props: this.props,
        cache: this.cache,
        sysOrg: null
      },
      defaultValue: '',
      checkDefault: [],
      treeData: [],
      orgList: [],
      dataList: [],
      row: null,
      column: null
    }
  },
  watch: {
    value: {
      async handler(val) {
        if (val) {
          this.treeId = this.multiple ? val.toString().split(',') : val.toString()
        } else {
          this.treeId = this.multiple ? [] : ''
        }
        // 如果当前组织机构数据还未加载，则加载一次。
        // 用于解决其他页面传参更新组织机构的值，而此时监听value变化在先，尚未获取下拉数据，
        // 因此setSysOrg获取不到当前所选组织机构的问题。wangzhd@20210830
        if (!this.dataList || this.dataList.length == 0) {
          await this.getData()
        }
        this.setSysOrg(val);
      },
      immediate: true
    },
    /*'checkDefault': function (newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          document.querySelector('.el-tree-node__content').click()
        })
      }
    }*/
  },
  async created() {
    await this.init();

    this.setDefaultFirstValue();
  },
  methods: {
    async init() {
      this.propsInitData()
      await this.getData()
    },
    propsInitData() {
      const {$props} = this
      this.$deepClone(this.options, $props)
    },

    async loadData() {
      if (this.showAll) {
        this.options.params = {
          showAll: true
        }
      }
      let data = (await getData(this.options.url ? this.options.url : 'api/v1/common/sysOrg/orgList', this.options.params, this.options.data, this.options.isPost)).data
      return data;
    },
    async getData() {
      let data = [];
      if (this.dataList.length > 0) {
        data = this.dataList;
      } else if (this.options.cache) {
        data = this.$store.state.cache.orgTree;
        if (!data || data.length == 0) {
          if (this.showAll) {
            this.options.params = {
              showAll: true
            }
          }
          data = (await getData(this.options.url ? this.options.url : 'api/v1/common/sysOrg/orgList', this.options.params, this.options.data, this.options.isPost)).data
          this.$store.dispatch('cache/cacheOrgTree',data)
          data = await this.loadData();
          this.$store.dispatch('cache/cacheOrgTree', data)
          // this.$store.dispatch("cache/cacheOrgList",treeChildren2List(data))
        }
      } else {
        data = await this.loadData()
      }

      this.orgList = treeChildren2List(data)

      //增加parentNode字段
      this.addParentNode(data);

      //用户自定义的数据过滤
      this.treeData = this.dataFilter(data);

      //显示层级级别
      this.showLevelFn(data, this.showLevel);
    },
    onChange(value) {
      this.setSysOrg(value);
      const resultStr = this.options.multiple ? value.join() : value
      this.$emit('change', resultStr, this.getSysOrg());
    },
    //前端控制显示第几层(//to do 后续不这么写，提供showRoad的方法)
    showLevelFn(data, showLevel) {
      var cut = function (arr, nodeLevel) {
        arr.forEach((item) => {
          if (item.nodeLevel == nodeLevel) {
            item.children = [];
          } else if (item.children && item.children.length > 0) {
            cut(item.children, nodeLevel);
          }
        })
      }
      cut(data, showLevel, null);
    },
    setSysOrg(e) {
      if (this.options.multiple) {
        this.options.sysOrg = this.$stream(this.orgList).filter(x => XEUtils.toString(e).split(',').indexOf(x.id) > -1).toArray();
      } else {
        this.options.sysOrg = this.$stream(this.orgList).filter(x => e == x.id).toArray()[0];
      }
    },
    //获取当前节点的对象
    getSysOrg() {
      return this.options.sysOrg;
    },
    setDefaultFirstValue() {
      if (this.defaultFirstValue) {
        let id = this.treeData[0].id;
        this.defaultValue = id;
        this.checkDefault.push(id);
        this.$emit('change', id);
        this.setSysOrg(id);
      }
    },
    //获取默认机构(废弃)
    getDefaultFirstValue() {
      return this.getSysOrg();
    },
    //增加 parentNode 字段
    addParentNode(data) {
      let setParentNode = function (arr, parent) {
        arr.forEach(x => {
          if (parent) {
            x.parentNode = parent;
          }
          if (x.children && x.children.length > 0) {
            setParentNode(x.children, x);
          }
        })
      }
      setParentNode(data, null);
    },
    // 首次选中，无法获取对象值的问题
    /*getNodeByValue(vals) {
      const org = this.getSysOrg()
      if (org) {
        return org;
      }

      let ids = []
      if (this.options.multiple) {
        ids = vals.split(',')
      } else {
        ids.push(vals)
      }
      const retObj = []
      let getNode = (arr, retObj) => {
        arr.forEach(x => {
          if (ids.indexOf(x[this.options.props.value]) > -1) {
            retObj.push(x)
          }
          if (x.children && x.children.length > 0) {
            getNode(x.children, retObj);
          }
        })
      }
      getNode(this.treeData, retObj)
      if (this.options.multiple) {
        return retObj
      } else {
        if (retObj.length > 0) {
          return retObj[0]
        }
      }
      return {}
    },*/
    initStationOrgList(stationList) {
      let sysOrg = this.getSysOrg();
      if (sysOrg.nodeLevel == sysOrgConstant.NodeLevel.station) {
        stationList.push(sysOrg);
      }

      if (!sysOrg.children || sysOrg.children.length == 0) {
        return;
      }

      sysOrg.children.forEach(x => {
        if (x.nodeLevel == sysOrgConstant.NodeLevel.station) {
          stationList.push(x);
        }
        if (x.children && x.children.length > 0) {
          return this.initStationOrgList(stationList);
        }
      })
    }
  }
}
</script>
