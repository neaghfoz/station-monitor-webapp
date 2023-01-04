<template>
  <div>
    <el-date-picker
      :style="dateStyle"
      v-model="rangeDatePicker"
      :size="size"
      :format="format"
      :value-format="valueFormat||format"
      :type="dateType"
      :clearable="clearable"
      :editable="editable"
      :disabled="disabled"
      range-separator="至"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :picker-options="pickerOptions"
      :default-time="['00:00:00', '23:59:59']"
      @change="onChange"
      @focus="showClearable"
    />
  </div>

</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'

  export default {
    name: 'TiDateRange',
    model: {
      name: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: Object,
        required: true
      },
      dateType: {
        type: String,
        default: 'daterange', //daterange , datetimerange, monthrange, yearrange
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
      dateStyle: {
        type: String,
        default: 'width:508px',
        required: false
      },
      startPlaceholder: {
        type: String,
        default: '开始时间',
        required: false
      },
      endPlaceholder: {
        type: String,
        default: '结束时间',
        required: false
      },
      beginKey: { //  开始时间字段
        type: String,
        required: true
      },
      endKey: { //  结束时间字段
        type: String,
        required: true
      },
      size: {
        type: String,
        default: '',
        required: false
      },
      dateRule: {
        type: String, // 只在daterange和datetimerange下起作用。是否数据过滤，[singleMonth,singleYear,lastMonth]
      },
      clearable: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      selectfuture:{
        type: Boolean,
        default: false,
        required: false
      },
      editable: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    data() {
      return {
        rangeDatePicker: [],
        selectDate: null
      }
    },
    computed: {
      pickerOptions() {
        //只有日期类才有时间才能用下面规则
        if (this.dateType != 'daterange' && this.dateType != 'datetimerange' && this.dateType != 'monthrange') {
          return {};
        }
        return {
          disabledDate: time => {
            let curDate = new Date();
            let curDateStr, flag;
            if (this.dateType == 'monthrange') {
              curDateStr = moment(time).format("YYYY-MM");
            }else{
              curDateStr = moment(time).format("YYYY-MM-DD");
              if(!this.selectfuture){
                flag = curDateStr > moment(curDate).add(1, 'days').format("YYYY-MM-DD");
              }
            }

            if (this.dateRule == 'lastMonth') {
              flag = flag || curDateStr < moment(curDate).add(-31, 'days').format("YYYY-MM-DD");
            }

            if (!this.selectDate) {
              return flag;
            } else {
              switch (this.dateRule) {
                case 'singleDay':
                  flag = flag || (moment(this.selectDate).format("YYYY-MM-DD") != moment(time).format(
                    "YYYY-MM-DD"));
                  break;
                case 'singleMonth':
                  flag = flag || (moment(this.selectDate).format("YYYY-MM") != moment(time).format(
                    "YYYY-MM"));
                  break;
                case 'singleYear':
                  flag = flag || (moment(this.selectDate).format("YYYY") != moment(time).format(
                    "YYYY"));
                  break;
                case 'oneDay':
                  flag = flag || (curDateStr < moment(this.selectDate).add(-1, 'days').format(
                    "YYYY-MM-DD")
                    || curDateStr > moment(this.selectDate).add(0, 'days').format("YYYY-MM-DD"))
                  break;
                case 'oneMonth':
                  flag = flag || (curDateStr < moment(this.selectDate).add(-30, 'days').format(
                    "YYYY-MM-DD")
                    || curDateStr > moment(this.selectDate).add(30, 'days').format("YYYY-MM-DD"))
                  break;
                case 'oneYear':
                  flag = curDateStr < moment(this.selectDate).add(-12, 'months').format(
                    "YYYY-MM-DD") || curDateStr > moment(this.selectDate).add(12, 'months').format("YYYY-MM-DD")
                  break;
              }
            }
            return flag;

          },
          onPick: date => {
            // 如果只选择一个则保存至selectDate 否则selectDate 为空
            if (date.minDate && !date.maxDate) {
              this.selectDate = date.minDate
            } else {
              this.selectDate = null
            }
          }

        }
      },

    },
    watch: {
      beginKey: {
        handler(val) {
          if (this.value[val]) {
            this.rangeDatePicker[0] = this.value[val]
          }
        },
        immediate: true,
        deep: true
      },
      endKey: {
        handler(val) {
          if (this.value[val]) {
            this.rangeDatePicker[1] = this.value[val]
          }
        },
        immediate: true,
        deep: true
      },
      value: {
        handler(val) {
          this.rangeDatePicker = []
          if (val[this.beginKey]) {
            this.rangeDatePicker.push(val[this.beginKey])
            if (val[this.endKey]) {
              this.rangeDatePicker.push(val[this.endKey])
            }
          } else {
            if (val[this.endKey]) {
              this.rangeDatePicker.push(val[this.endKey])
              this.rangeDatePicker.push(val[this.endKey])
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    mounted() {
      // var cs = document.querySelector('.el-picker-panel').innerHTML;
      // var cs = this.$refs.tiDateRange;
      // console.log(cs);

      // console.log($('.el-picker-panel').html());
    },
    methods: {
      onChange(e) {
        const result = Object.assign({}, this.value)
        Vue.set(result, this.beginKey, this.rangeDatePicker ? this.rangeDatePicker[0] : '')
        Vue.set(result, this.endKey, this.rangeDatePicker ? this.rangeDatePicker[1] : '')
        this.$emit('change', result)
      },
      showClearable() {
        //不显示清空按钮
        if (!this.clearable) {
          var tmp = document.querySelector("div.el-picker-panel__footer > .el-button--text");
          if (tmp != null) {
            tmp.style.display = 'none';
          }
        }
      }
    }

  }
</script>

<style scoped>
  /* .el-picker-panel
   {
     .el-picker-panel__footer  .el-button--text
     {
       display: none !important;
     }
   }*/
  /*.a /deep/ .el-picker-panel  {
    display: none !important;
  }*/

</style>
