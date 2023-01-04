<template>
  <el-select
    :style="pstyle"
    :value="selected"
    :multiple="multiple"
    :size="size"
    :clearable="clearable"
    :filterable="filterable"
    :disabled="disabled"
    :collapse-tags="collapseTags"
    :placeholder="placeholder"
    :watchAttr="watchAttr"
    :watchAttrFn="watchAttrFn"
    v-el-select-loadmore:rangeNumber="loadMore(rangeNumber)"
    @change="onChange"
  >
    <el-option
       v-for="item in selectDataShow.slice(0, rangeNumber)"
      :key="item[options.props.value]"
      :value="item[options.props.value]"
      :label="item[options.props.label]"
    />
  </el-select>
</template>

<script>

import {getData} from './tiSelectApi'
import {cloneDeep} from '@ecip/ecip-web/src/utils'
import Vue from "vue";
Vue.directive(
  'el-select-loadmore', {
    bind(el, binding) {
      let self = this
      // 获取element-ui定义好的scroll盒子
      const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
      SELECTWRAP_DOM.addEventListener('scroll', function () {
        /**
         * scrollHeight 获取元素内容高度(只读)
         * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
         * clientHeight 读取元素的可见高度(只读)
         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
         */
        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
        if (condition) binding.value()
      });
    }
  }
)



export default {
  name: 'TiLazySelect',
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Number, String, Boolean, Array],
      required: false
    },
    multiple: {
      type: Boolean,
      default: false,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    clearable: {
      type: Boolean,
      default: true,
      required: false
    },
    pstyle: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      default: '请选择',
      required: false
    },
    filterable: {
      type: Boolean,
      default: true,
      required: false
    },
    collapseTags: {
      type: Boolean,
      default: true,
      required: false
    },
    size: {
      type: String,
      default: '',
      required: false
    },
    dictType: { //  字典和url只能2选一，同时设置，字典生效
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    params: {
      type: Object,
      default: () => {
      },
      required: false
    },
    data: { //payload
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
    props: {  //自定义显示字段
      type: Object,
      default: () => {
        return {
          key: 'value',
          value: 'value',
          label: 'label'
        }
      },
      required: false
    },
    dataFilter: { //数据过滤器
      type: Function,
      default: (data) => data,
      required: false
    },
    watchAttr: {  //监听字段
      type: [String, Object],
      required: false
    },
    watchAttrFn: { //监听实现
      type: Function,
      default: () => {
      },
      required: false
    },
    dataList: { //静态数据
      type: Array,
      default: () => [],
      required: false
    },
    defaultFirstValue: { //是否默认值，默认值第一个值
      type: Boolean
    },
  },
  data() {
    return {
      rangeNumber: 10,
      options: {
        multiple: this.multiple,
        filterable: this.filterable,
        clearable: this.clearable,
        disabled: this.disabled,
        size: this.size,
        collapseTags: this.size,
        labelValue: {},
        props: this.props,
        obj: null,
      },
      selected: this.multiple ? [] : '',
      selectData: [],
      selectDataShow: [],
      checked: false,
    }
  },
  watch: {
    watchAttr: {
      handler(newVal, oldVal) {
        let showData = this.watchAttrFn(newVal, oldVal, this.selectData);
        this.selectDataShow = showData;
        //改变选中的值
        if (this.selected && this.selected.length > 0) {
          var newSelected = [];
          this.selectDataShow.forEach(x => {
            if (this.selected.indexOf(x[this.props.value]) > -1) {
              newSelected.push(x[this.props.value])
            }
          });
          this.$emit('change', newSelected.join())
        }
        ;
      },
      deep: true
    },
    value: {
      handler(val) {
        if (typeof val === 'object') {
          this.selected = val
          return
        }
        if (this.multiple) {
          this.selected = val ? val.toString().split(',') : []
        } else {
          this.selected = this.dictType ? (val ? val + '' : '') : (val || '')
        }

        //给对象赋值
        this.setObj(val);
      },
      immediate: true
    },
  },
  created() {
    this.init();
  },
  methods: {
    loadMore(n){
      //n是默认初始展示的条数会在渲染的时候就可以获取,具体可以打log查看
      //if(n < 8) this.rangeNumber = 10 //elementui下拉超过7条才会出滚动条,如果初始不出滚动条无法触发loadMore方法
      return () => this.rangeNumber += 5 //每次滚动到底部可以新增条数  可自定义
    },

    async init() {
      //如果是字典就不执行
      if (!this.dictType) {
        this.propsInitData()
        await this.getData();
      } else {
        this.selectData = await this.$dictUtils.getDictList(this.dictType);
        this.selectDataShow = this.selectData;
      }

      //设置默认选择第一个
      this.setDdefaultFirstValue();
    },
    propsInitData() {
      const {$props} = this
      cloneDeep(this.options, $props)
    },
    async getData() {
      let data = null;
      if (this.options.url) {
        data = (await getData(this.options.url, this.options.params, this.options.data, this.options.isPost)).data;
      } else if (this.options.dataList) {
        data = this.options.dataList;
      }
      this.selectData = this.dataFilter(data);
      if (this.watchAttr) {
        this.selectDataShow = this.watchAttrFn(this.watchAttr, null, this.selectData);
      } else {
        this.selectDataShow = this.selectData;
      }
    },
    onChange(e) {
      const result = this.options.multiple ? e.join() : e
      this.options.labelValue = this.selectDataShow.find((item) => {
        return item[this.props.value] === result;
        //筛选出匹配数据，是对应数据的整个对象
      });
      let resultVal = e
      if (!this.options.multiple) {
        resultVal = [e]
      }
      let resultObj = []
      resultVal.forEach(x => {
        this.selectDataShow.forEach(item => {
          if (item[this.options.props.value] == x) {
            resultObj.push(item)
          }
        })
      })
      if (!this.options.multiple) {
        resultObj = resultObj[0]
      }
      this.$emit('change', result, resultObj)
    },
    setDdefaultFirstValue() {
      if (this.defaultFirstValue) {
        let value = this.selectDataShow[0][this.options.props.value];
        this.defaultValue = value;
        this.$emit('change', value)
      }
    },
    setObj(e) {
      if (this.options.multiple) {
        this.options.obj = this.$stream(this.selectDataShow).filter(x => XEUtils.toString(e).split(',').indexOf(x[this.options.props.value]) > -1).toArray();
      } else {
        this.options.obj = this.$stream(this.selectDataShow).filter(x => e == x[this.options.props.value]).toArray()[0];
      }
    },
    getObj() {
      return this.options.obj;
    },
    change(e) {
      const result = this.options.multiple ? e.join() : e
      this.options.labelValue = this.selectDataShow.find((item) => {
        return item[this.props.value] === result;
        //筛选出匹配数据，是对应数据的整个对象
      });
      this.$emit('change', result)
    },
    getDefaultFirstValue() {
      return this.selectDataShow[0];
    }
  }
}
</script>

<style>
.el-select__tags {
  flex-wrap: nowrap !important;
  overflow: hidden !important;
}
</style>
