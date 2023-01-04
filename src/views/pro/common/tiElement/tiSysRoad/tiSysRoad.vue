<!--
 * 路段选择框，常见配置
 -->
<template>
  <el-select
    :value="roadId"
    :multiple="options.multiple"
    :disabled="options.disabled"
    :clearable="options.clearable"
    :size="options.size"
    :props="options.props"
    :default-first-option="options.defaultFirstValue"
    @change="onChange"
  >
    <el-option
      v-for="item in selectDataShow"
      :key="item[options.props.value]"
      :value="item[options.props.value]"
      :label="item[options.props.label]"
    />
  </el-select>
</template>

<script>
import {cloneDeep} from "@ecip/ecip-web/src/utils";
import {getData} from "@/views/pro/common/tiElement/tiSelect/tiSelectApi";

export default {
  name: 'TiSysRoad',
  components: {  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String],
      required: false
    },
    size: {
      type: String,
      default: '',
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
      default: false,
      required: false
    },
    defaultFirstValue: { //是否默认值，默认值第一个机构
      type: Boolean,
      default: false,
      required: false
    },
    props: {  //自定义显示字段
      type: Object,
      default: () => {
        return {
          key: 'roadId',
          value: 'roadId',
          label: 'roadText'
        }
      },
      required: false
    }
  },
  data() {
    return {
      selectDataShow: [],
      roadId: this.multiple ? [] : '',
      options: {
        multiple: this.multiple,
        disabled: this.disabled,
        clearable: this.clearable,
        size: this.size,
        props: this.props
      }
    }
  },

  watch: {
    value: {
      handler(val) {
        if(val==null) {
          this.roadId = null
          return
        }
        if (typeof val === 'object') {
          this.roadId = val
          return
        }
        if (this.multiple) {
          this.roadId = val ? val.toString().split(',') : []
        } else {
          this.roadId = val || ''
        }
      },
      immediate: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(async () => {
        this.propsInitData()
        this.getData();
      })
    },
    propsInitData() {
      const {$props} = this
      cloneDeep(this.options, $props)
    },
    async getData() {
      this.selectDataShow = (await getData('api/v1/common/road/findListByAuth', {}, {}, false)).data;
      //选中第一个
      if (this.defaultFirstValue && this.selectDataShow.length>0) {
        this.roadId = this.selectDataShow[0][this.options.props.value]
        this.onChange(this.roadId)
      }
    },
    onChange(e) {
      const result = this.options.multiple ? e.join() : e
      let resultVal = e
      if(!this.options.multiple){
        resultVal = [e]
      }
      let resultObj = []
      resultVal.forEach(x=>{
        this.selectDataShow.forEach(item=>{
          if(item[this.options.props.value] == x){
            resultObj.push(item)
          }
        })
      })
      if(!this.options.multiple){
        resultObj = resultObj[0]
      }
      this.$emit('change', result, e?resultObj:this.options.multiple?[]:{})
    }
  }
}
</script>

<style scoped>
.el-select__tags {
  flex-wrap: nowrap !important;
  overflow: hidden !important;
}
</style>
