<!--
 * 门架选择框，支持路段联动，常见配置
 * sectionId 路段id，可空，空时不展示列表
 * cache 缓存开关，可以设置成true,默认关闭缓存
 -->
<template>
  <el-select
    :select-id="sectionId"
    :value="gantryId"
    :cache="options.cache"
    :multiple="options.multiple"
    :disabled="options.disabled"
    :clearable="options.clearable"
    :size="options.size"
    :showAll="options.showAll"
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
  name: 'TiSysGantry',
  components: { TiSelect },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String],
      required: false
    },
    cache: {
      type: Boolean,
      default: false,
      required: false
    },
    sectionId: {
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
    showAll: {
      type: Boolean,
      default: false,
      required: false
    },
    props: {  //自定义显示字段
      type: Object,
      default: () => {
        return {
          key: 'gantryId',
          value: 'gantryId',
          label: 'gantryText'
        }
      },
      required: false
    }
  },
  data() {
    return {
      gantryId: this.multiple ? [] : '',
      selectData: [],
      selectDataShow: [],
      options: {
        multiple: this.multiple,
        disabled: this.disabled,
        clearable: this.clearable,
        size: this.size,
        cache: this.cache,
        showAll: this.showAll
      }
    }
  },

  watch: {
    value: {
      handler(val) {
        if(val==null) {
          this.gantryId = null
          return
        }
        if (typeof val === 'object') {
          this.gantryId = val
          return
        }
        if (this.multiple) {
          this.gantryId = val ? val.toString().split(',') : []
        } else {
          this.gantryId = val || ''
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
        this.getData()
      })
    },
    propsInitData() {
      const {$props} = this
      cloneDeep(this.options, $props)
    },
    async getData() {
      if(this.options.cache){
        this.selectData = this.$store.state.cache.gantryList
      }
      if(!this.selectData || this.selectData.length==0 ){
        this.selectData = (await request({
          url: 'api/v1/common/gantry/findListByAuth',
          method: 'get',
          params: {},
          data: {}
        })).data;
        if(this.options.cache && this.selectData){
          this.$store.dispatch("cache/cacheGantryList",this.selectData)
        }
      }
      // 加载数据后再监听
      this.$watch('sectionId', function(newVal, oldVal){
        // 非第一次加载,设自动清空值
        if(oldVal){
          this.gantryId  = null
        }
        this.filter(newVal, oldVal, this.selectData)
      }, {immediate: true})
    },
    // sectionId发生变化时
    filter(newVal, oldVal, selectData) {
      this.selectDataShow = []
      if(!newVal && this.showAll) this.selectDataShow = selectData
      if(!newVal) return []
      this.selectDataShow =  selectData.filter((x)=>{return x.roadId == newVal})
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
