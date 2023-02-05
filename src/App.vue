<template>
  <div id="app">
    <router-view @select-x='selectX'/>
    <div id="tibms-foot">
      <!-- <p>版本：1401.2208.1</p> -->
      <div :class="{sGener:sxFlag}">{{select}}</div>
    </div>
    <!-- <selectDialog v-if="showDialog"/> -->

  </div>
 </template>

<script>
import selectDialog from 'ecip-web/components/DialogPath/index.vue'
export default {
  name: 'App',
  data() {
    return{
      select:'',
      sGenerflag:false,
      sxFlag:true,
      sxFlags:false,
      showDialog: false
    }
    // return {
    //   showDialog: false
    // }
  },
  components: {
    selectDialog
  },
  computed: {
    changeRouter(){
      return this.$route.path
    }
  },
  watch:{
    changeRouter:{
      handler(val,oldval){
        //console.log('val', val)

        this.routerChange()
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    routerChange() {
      //console.log('changed')
      let router = this.$route.path
      console.log('changed', router)
      if(router == '/') {
        //console.log('true')
        this.showDialog = true
      }
    },
    selectX(aa){
      console.log(aa);
      this.select = aa
      this.sGenerflag = true
      this.sxFlags = true
      // console.log(this.$emit("selectx",this.val));
      // this.select = this.$emit("selectx",this.val)
    }
  },
}
</script>

<style lang="scss" scoped>
  #tibms-foot {
    text-align: right;
    font-size: 13px;
    float: left;
    position: fixed;
    bottom: -13px;
    right: 10px;
    width: 100%;
    //background: blue;
    color: #2d2f33;

  }

  .sGener{
    position: absolute;
    top: 50%;
    margin-top: -9.5px;
    right: 122px;
    z-index: 100001;
    color: #2d2f33;
  }

  #app {
    font-family: "Noto Sans";
  }

</style>
