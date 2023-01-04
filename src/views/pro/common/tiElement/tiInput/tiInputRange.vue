<template>
  <div class="hy-input-wrapper" :style="myStyle">
    <div  class="hy-input" style="padding-left: 0px">
      <input :type="type" :placeholder="startPlaceholder" v-model="inputMap.start"  @input="inputValue"  autocomplete="off"  class="hy-input__inner" >
    </div>
    <div class="connect">{{connectText}}</div>
    <div  class="hy-input">
      <input :type="type" :placeholder="endPlaceholder" v-model="inputMap.end"  @input="inputValue" class="hy-input__inner" >
    </div>
  </div>
</template>
<script>
export default {
  name: "tiInputRange",
  data(){
    return {
      inputMap: {...this.value}
    }
  },
  props: {
    startPlaceholder: {type: String, default: '请输入起始值'},
    endPlaceholder: {type: String, default: '请输入结束值'},
    type: {type: String, default: 'text'},
    connectText: {type: String, default: '至'},
    value: {type: Object, default: function(){
        return {start: '',end: ''}
      }
    },  //v-model绑定的值
    myStyle: {type: Object, default: function(){
        return  {width: '580px'}
      }
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    'value.start'(val) {
      this.inputMap.start = val;
    },
    'value.end'(val) {
      this.inputMap.end = val;
    }
  },
  created(){ },
  mounted(){ },
  methods: {
    inputValue(event){
      this.$emit("change",{...this.inputMap})
    }
  }
}
</script>
<style scoped>
.hy-input-wrapper{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.connect{
  font-size: 14px;
  font-weight: bold;
  color: #606266
}
.hy-input {
  position: relative;
  font-size: 13px;
  display: inline-block;
  padding: 0 10px 0 10px;
  width: 100%;
}
.hy-input__inner {
  -webkit-appearance: none;
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}
.hy-input__inner:focus {
  border-color: #409EFF;
  outline: 0;
}
</style>
