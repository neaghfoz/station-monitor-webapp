// import TiUserApi from "@/views/pro/common/tiApi/tiUser/tiUserApi"
import TiSysOrgApi from "@/views/pro/common/tiApi/tiSysOrg/tiSysOrgApi"
import request from 'ecip-web/utils/request'

const config = {
  curOrg: {},
  centerLevel: null,
  config: {},
  configKey: 'kpi',
  /**
   * 判定当前登录人，是否属于管理中心，否则属于管理部
   * @returns {Promise<boolean>}
   */
  isMgrCenter(){
    const org = this.getCurOrg()
    const centerLevel = this.getCenterLevel()
    if(org.levels <= centerLevel ){
      return true
    }
    return false
  },

  /**
   * 获取管理中心结构组织结构
   * @param orgNode 传入的机构树选中的对象
   * @returns {Promise<*>}
   */
  getCenterOrg(orgNode){
    const clevel = this.getCenterLevel()
    while(orgNode.parentNode && orgNode.levels != clevel ){
      orgNode = orgNode.parentNode
    }
    return orgNode.levels == clevel?orgNode:null
  },

  getCurOrg(){
    return this.curOrg
  },

  async loadConfig(store){
    if(!store.state.cache.config.hasOwnProperty(this.configKey)){
      const resp = await request({
        url: 'api/v1/kpi/properties',
        method: 'get',
        params: {},
        data: {}
      });
      this.config = resp.data
    }else{
      this.config = store.state.cache.config[this.configKey]
      // this.curOrg = this.config['curOrg']
      // return
    }
    // 每次都加载当前用户的组织机构信息@20210926，避免未分配的用户使用上一个登录用户的组织机构而有了新增工单等权限
    //if(Object.keys(this.curOrg).length==0){
      let { data } = await TiSysOrgApi.getCurUserOrg();
      this.config['curOrg'] = data
      this.curOrg = data
    //}
    store.dispatch("cache/cacheConfig",{'kpi':this.config})
  },

  getCenterLevel(){
    this.centerLevel = this.config.centerLevel
    return this.centerLevel
  },

  updateObj(oriObj,targetObj){
    const keys = Object.keys(targetObj)
    const exitsKeys = []
    Object.keys(oriObj).forEach(x=>{
      targetObj[x]=oriObj[x]
      exitsKeys.push(x)
    })
    let notKeys = keys.filter(x => exitsKeys.indexOf(x)==-1)
    notKeys.forEach(x=>{
      targetObj[x]=null
    })
  },
  async loadAllUser(store) { // 加载系统用户信息
    console.log(store.state.cache.userList)
    if (!store.state.cache.userList || store.state.cache.userList.length === 0){
      console.log('load userList at first time...')
      // 加载用户岗位信息，追加用户组织机构信息
      const param = { havePositionList: true, haveSysOrg: true }
      const { userList } = (await request({
        url: 'api/v1/common/sysUser/list',
        method: 'get',
        params: param,
        data: {}
      })).data

      // eslint-disable-next-line require-atomic-updates
      store.state.cache.userList = userList
    } else {
      console.log('userList is loaded...')
    }
  }
}

export default config
