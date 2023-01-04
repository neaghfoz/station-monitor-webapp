<template>
  <el-date-picker
    :style="dateStyle"
    v-model="momVal"
    :size="size"
    :type="dateType"
    :clearable="clearable"
    :disabled="disabled"
    :format="format"
    :value-format="valueFormat||format"
    :picker-options="pickerOptions"
    placeholder="选择日期时间"
    @change="onChange"
  />
</template>
<script>
  import moment from 'moment'

  export default {
    name: 'TiDate',
    // 2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 这个牛逼
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      placeholder: {
        type: String,
        default: '',
        required: false
      },
      dateType: {
        type: String,
        default: 'date',  //  date , datetime, month, year
        required: false
      },
      dateStyle: {
        type:String,
        default:'width: 199px',
        required:false
      },
      value: {
        type: [String, Date],
        required: false
      },
      format: {
        type: String,
        default: 'yyyy-MM-dd',
        required: false
      },
      valueFormat: {
        type: String,
        required: false
      },
      // 此属性可以被废弃了
      triggerChange: {
        type: Boolean,
        required: false,
        default: false
      },
      readOnly: {
        type: Boolean,
        required: false,
        default: false
      },
      size: {
        type: String,
        default: '',
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      showTime: {
        type: Boolean,
        required: false,
        default: false
      },
      getCalendarContainer: {
        type: Function,
        default: () => document.body
      },
      clearable: {
        type: Boolean,
        default: true
      },
      selectfuture:{
        type: Boolean,
        default: false,
        required: false
      },
      //允许选择未来的天数 ， 默认1天
      futuredays:{
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        decorator: '',
        momVal: this.value,
        pickerOptions: {
          disabledDate: time => {
            return !this.selectfuture && (moment(time).format("YYYY-MM-DD") > moment(new Date()).add(this.futuredays, 'days').format("YYYY-MM-DD"));
          }
        }
      }
    },
    watch: {
      value(val) {
        this.momVal = val || ''
      }
    },
    methods: {
      onChange(e) {
        this.$emit('change', e)
      }
    }
  }
</script>
