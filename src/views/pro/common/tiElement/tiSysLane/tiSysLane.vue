<!--
 * 车道选择框，支持按站联动，常见配置
 * stationId 收费站国标编码，可空，空时不展示车道列表
 * cache 缓存开关，可以设置成true,默认关闭缓存
 -->
<template>
  <el-select
    style="width:100%;"
    :station-id="stationId"
    :cache="options.cache"
    :value="laneNo"
    :multiple="options.multiple"
    :disabled="options.disabled"
    :filterable="options.filterable"
    :clearable="options.clearable"
    :size="options.size"
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
import TiSelect from "@/views/pro/common/tiElement/tiSelect/tiSelect"
import {getData} from '@/views/pro/common/tiElement/tiSelect/tiSelectApi'
import {cloneDeep} from '@ecip/ecip-web/src/utils'

export default {
  name: 'TiSysLane',
  components: {TiSelect},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String],
      required: false
    },
    stationId: {
      type: [String],
      required: false
    },
    entryExitType: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    filterable: {
      type: Boolean,
      default: false,
      required: false
    },
    showAll: {
      type: Boolean,
      default: false,
      required: false
    },
    cache: {
      type: Boolean,
      default: false,
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
          key: 'laneNo',
          value: 'laneNo',
          label: 'laneNo'
        }
      },
      required: false
    }
  },
  data() {
    return {
      laneNo: this.multiple ? [] : '',
      selectData: [],
      selectDataShow: [],
      options: {
        url: this.url,
        multiple: this.multiple,
        disabled: this.disabled,
        clearable: this.clearable,
        size: this.size,
        cache: this.cache,
        filterable: this.filterable,
        obj: null
      },
      isWatch: false
    }
  },

  watch: {
    value: {
      handler(val) {
        this.setObj(val);

        if (val == null) {
          this.laneNo = null
          return
        }
        if (typeof val === 'object') {
          this.laneNo = val
          return
        }
        if (this.multiple) {
          this.laneNo = val ? val.toString().split(',') : []
        } else {
          this.laneNo = val || ''
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
      if (this.options.cache) {
        this.selectData = this.$store.state.cache.laneList
      }
      if (!this.selectData || this.selectData.length == 0) {
        this.selectData =
          (await getData(this.options.url ? this.options.url : '/api/v1/common/lane/listWithUserAuth', this.options.params, this.options.data, this.options.isPost)).data;
        if (this.options.cache && this.selectData) {
          this.$store.dispatch("cache/cacheLaneList", this.selectData)
        }
      }

      //车道类型过滤
      if (this.entryExitType) {
        this.selectData = this.$stream(this.selectData).filter(x => this.entryExitType == x.entryExitType).toArray();
      }

      // 加载数据后再监听
      if (this.isWatch) {
        return
      }
      this.$watch('stationId', function (newVal, oldVal) {
        // 非第一次加载,设自动清空值
        if (oldVal) {
          this.laneNo = null
        }
        this.filter(newVal, oldVal, this.selectData)
      }, {immediate: true})
      this.isWatch = true
    },
    onChange(e) {
      this.setObj(e);
      const result = this.options.multiple ? e.join() : e
      this.$emit('change', result, this.getObj())
    },
    // stationId发生变化时
    filter(newVal, oldVal, selectData) {
      this.selectDataShow = []
      if (!newVal && !this.showAll) {
        return
      }
      // 根据站过滤出车道
      let laneJson = {}
      selectData.forEach(x => {
        if (newVal == x.stationId) {
          laneJson[x.laneNo] = x;
        }
      })
      //变回数组
      let laneList = [];
      for(var key in laneJson) {
        laneList.push(laneJson[key]);
      }
      //排序（顺序）
      laneList.sort(function (x, y) {
        return x.laneNo - y.laneNo;
      });

      if (this.showAll && laneList.length == 0) {
        laneJson = {}
        selectData.forEach(x => {
          laneJson[x.laneNo] = x
        })
        for(var key in laneJson) {
          laneList.push(laneJson[key]);
        }
        //排序（顺序）
        laneList.sort(function (x, y) {
          return x.laneNo - y.laneNo;
        });
      }
      this.selectDataShow = laneList
    },
    setObj(e) {
      if (this.options.multiple) {
        this.options.obj = this.$stream(this.selectDataShow).filter(x => XEUtils.toString(e).split(',').indexOf(x[this.options.props.value]) > -1).toArray();
      } else {
        this.options.obj = this.$stream(this.selectDataShow).filter(x => e == x[this.options.props.value]).toArray()[0];
      }
      // console.log(this.options.obj);
    },
    getObj() {
      return this.options.obj;
    },
  }
}
</script>

<style scoped>
.el-select__tags {
  flex-wrap: nowrap !important;
  overflow: hidden !important;
}
</style>
