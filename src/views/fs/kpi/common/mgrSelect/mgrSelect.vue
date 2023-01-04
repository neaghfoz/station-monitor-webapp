<template>
  <el-select
    :value="orgId"
    :multiple="options.multiple"
    :disabled="options.disabled"
    :clearable="options.clearable"
    :size="options.size"
    :props="options.props"
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
import {cloneDeep} from '@ecip/ecip-web/src/utils'
import kpiUtil from "@/views/fs/kpi/common/kpiUtil"
import request from 'ecip-web/utils/request'

export default {
  name: 'MgrSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String,Number],
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
    defaultFirstValue: { //是否默认值，默认值第一个值
      type: Boolean
    },
    props: {  //自定义显示字段
      type: Object,
      default: () => {
        return {
          key: 'id',
          value: 'id',
          label: 'name'
        }
      },
      required: false
    }
  },
  data() {
    return {
      orgId: this.multiple ? [] : '',
      selectDataShow: [],
      options: {
        multiple: this.multiple,
        disabled: this.disabled,
        clearable: this.clearable,
        size: this.size,
        obj: null,
      }
    }
  },
  async created() {
    await kpiUtil.loadConfig(this.$store)
    this.init()
  },
  watch: {
    value: {
      handler(val) {
        if(val==null) {
          this.orgId = null
          return
        }
        if (typeof val === 'object') {
          this.orgId = val
          return
        }
        if (this.multiple) {
          this.orgId = val ? val.toString().split(',') : []
        } else {
          this.orgId = val?val+'' : ''
        }

        this.setObj(val);
      },
      immediate: true
    }
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
      const resp = await request({
        url: 'api/v1/common/sysOrg/findByEntityWithAuth',
        method: 'post',
        params: {},
        data: { nodeLevel: kpiUtil.getCenterLevel() }
      });
      this.selectDataShow = resp.data;

      //选中第一个
      if (this.defaultFirstValue) {
        let value = this.selectDataShow[0][this.options.props.value];
        this.defaultValue = value;
        this.$emit('change', value)
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
      this.$emit('change', result, resultObj);
    },
    setObj(e) {
      if (this.options.multiple) {
        this.options.obj = [];
        this.selectDataShow.forEach(item => {
          if (e.split(',').indexOf(item[this.options.props.value]) > -1) {
            this.options.obj.push(item);
          }
        })
      } else {
        this.selectDataShow.forEach(item => {
          if (item[this.options.props.value] == e) {
            this.options.obj = item;
          }
        })
      }
    },
    getObj() {
      return this.options.obj;
    },
    getDefaultFirstValue() {
      return this.selectDataShow[0];
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
