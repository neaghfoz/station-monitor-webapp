<!--
 * 考核指标关联，支持机构联动，常见配置
 * indiType 指标类型，可空，空时不展示考核指标明细
 -->
<template>
  <el-select
    :indi-type="indiType"
    :value="indiId"
    :multiple="options.multiple"
    :disabled="options.disabled"
    :clearable="options.clearable"
    :size="options.size"
    @change="onChange"
  >
    <el-option
      v-for="item in selectDataShow"
      :key="item[options.props.key]"
      :value="item[options.props.value]"
      :label="item[options.props.label]"
    />
  </el-select>
</template>

<script>
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import {cloneDeep} from '@ecip/ecip-web/src/utils'
import request from 'ecip-web/utils/request'

export default {
  name: 'IndiSelect',
  components: { TiSelect },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String,Number],
      required: false
    },
    indiType: {
      type: [String,Number],
      required: false
    },
    dataFilter: { //数据过滤器
      type: Function,
      default: (data) => data,
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
    props: {  //自定义显示字段
      type: Object,
      default: () => {
        return {
          key: 'indiId',
          value: 'indiId',
          label: 'indiDesc'
        }
      },
      required: false
    }
  },
  data() {
    return {
      indiId: this.multiple ? [] : '',
      selectDataShow: [],
      options: {
        multiple: this.multiple,
        disabled: this.disabled,
        clearable: this.clearable,
        size: this.size
      }
    }
  },

  watch: {
    indiType: {
      handler(newVal, oldVal) {
        // 非第一次加载,设自动清空值
        if(oldVal){
          this.indiId  = null
        }
        this.getData()
      },
      immediate: true
    },
    value: {
      handler(val) {
        if(val==null) {
          this.indiId = null
          return
        }
        if (typeof val === 'object') {
          this.indiId = val
          return
        }
        if (this.multiple) {
          this.indiId = val ? val.toString().split(',') : []
        } else {
          this.indiId = val?val+'' : ''
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
      })
    },
    propsInitData() {
      const {$props} = this
      cloneDeep(this.options, $props)
    },
    async getData() {
      if(!this.indiType) {
        this.selectDataShow = []
        return
      }
      const resp = await request({
        url: 'api/v1/kpi/indicator/findList/'+this.indiType,
        method: 'get',
        params: { },
        data: {}
      });
      resp.data.forEach(x=>x.indiId = x.id)
      this.selectDataShow = resp.data;

      //数据过滤
      this.selectDataShow = this.dataFilter(this.selectDataShow);
    },
    onChange(e) {
      if(!e){
        return
      }
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
      this.$emit('change', result, resultObj)
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
