<template>
  <div>
   <el-date-picker
    :style="dateStyle"
    v-model="rangeDatePicker[0]"
    :format="format"
    :value-format="valueFormat||format"
    :type="dateType"
    :clearable="clearable"
    :editable="editable" 
    :picker-options="beginPickerOptions"
    placeholder="选择起始时间"
    @change="onChange"
    @focus="showClearable"
  />
   <label class="el-form-item__label" style="padding:0 12px 0 12px">  至  </label>
  <el-date-picker
    :style="dateStyle"
    v-model="rangeDatePicker[1]"
    :format="format"
    :value-format="valueFormat||format"
    :type="dateType"
    :clearable="clearable"
    :editable="editable"
    :start-placeholder="startPlaceholder"
    :picker-options="endPickerOptions"
    placeholder="选择结束时间"
    @change="onChange"
    @focus="showClearable"
  />
  </div>

</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'

  export default {
    name: 'TiDateRang',
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
        default: 'date', //daterange , datetimerange, monthrange, yearrange
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
        default: 'width:199px',
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
      beginPickerOptions() {
        //只有日期类才有时间才能用下面规则
        if (this.dateType != 'date' && this.dateType != 'month' && this.dateType != 'year') {
          return {};
        }
        return {
          disabledDate: time => { 
            if(this.rangeDatePicker[1] != null){ 
              let curDate = new Date();
              let curDateStr;
              if (this.dateType == 'month') {
                curDateStr = moment(time).format("YYYY-MM");
              }else if(this.dateType == 'date'){
                curDateStr = moment(time).format("YYYY-MM-DD");
              }else if(this.dateType == 'year'){
                curDateStr = moment(time).format("YYYY");
              } 
              return curDateStr >= this.rangeDatePicker[1]; 
            }
            return false;
          }
        }
      },
      endPickerOptions() {
        //只有日期类才有时间才能用下面规则
        if (this.dateType != 'date' && this.dateType != 'month' && this.dateType != 'year') {
          return {};
        }
        return {
          disabledDate: time => {  
            if(this.rangeDatePicker[0] != null){ 
              let curDate = new Date();
              let curDateStr;
              if (this.dateType == 'month') {
                curDateStr = moment(time).format("YYYY-MM");
              }else if(this.dateType == 'date'){
                curDateStr = moment(time).format("YYYY-MM-DD");
              }else if(this.dateType == 'year'){
                curDateStr = moment(time).format("YYYY");
              }  
              return curDateStr <= this.rangeDatePicker[0]; 
            }
            return false;
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
      },
      dateType(val){
        console.log("dateType:" + val);
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
