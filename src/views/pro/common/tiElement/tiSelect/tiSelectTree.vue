<template>
  <el-select-tree
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
    @change="onChange"
  />
</template>

<script>
  /**
   * vxe-grid 每次编辑时，都会调取created钩子，所以vxe相关初始化应该在created钩子中进行；
   * 外部普通使用组件的时候，只有进入编辑页面第一次会执行created，后续重复点击modal都不会进入created钩子，故初始化需要放在dialog弹框弹出的时候执行；
   */
  import {getData} from './tiSelectApi'
  import {cloneDeep} from '@ecip/ecip-web/src/utils'

  export default {
    name: 'TiSelectTree',
    model: {
      prop: 'value',
      event: 'change'
    },
    props: { //  后续再props新增接收属性，都需要在data中新增对应tm+属性名的对应映射的属性，并在propsInitData、vxeInitData中初始化
      value: {
        type: [Number, String, Boolean, Array],
        required: false
      },
      ecData: {
        type: Array,
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
        default: true,
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
        required: true
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
            label: 'name',
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
          props: this.props
        },
        treeData: [],
        row: null,
        column: null
      }
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            this.treeId = this.multiple ? val.toString().split(',') : val.toString()
          } else {
            this.treeId = this.multiple ? [] : ''
          }
        },
        immediate: true
      }
    },
    created() {
      this.init();
    },
    methods: {
      async init() {
        this.$nextTick(() => {
          this.propsInitData()
          this.getData()
        })
      },
      propsInitData() {
        const {$props} = this
        cloneDeep(this.options, $props)
      },
      async getData() {
        const {data} = await getData(this.options.url, this.options.params, this.options.data, this.options.isPost)
        this.treeData = this.dataFilter(data);

        //选中第一个
        if (this.defaultFirstValue) {
          this.$emit('change',this.treeData[0].id,this.treeData[0])
        }

      },
      onChange(e) {
        const result = this.options.multiple ? e.join() : e
        this.$emit('change', result, this.options.multiple ? this.$refs.elSelectTree.getCheckedNodes() : this.$refs.elSelectTree.getCurrentNode())
      }
    }
  }
</script>
