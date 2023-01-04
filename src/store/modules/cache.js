const state = {
  orgTree: [],  //带children
  orgList: [],
  laneList: [],
  gantryList: [],
  userList: [],
  config: {},
  tempdata: {}, //临时缓存，充当全局变量
}

const getters = {
  getTempdata: (state) => {
    return state.tempdata;
  },
  getTempdataItem: (state) => (key) => {
    return state.tempdata[key];
  },
}

const mutations = {
  setOrgTree(state, orgTree) {
    state.orgTree = orgTree
  },
  setOrgList(state, orgList) {
    state.orgList = orgList
  },
  setLaneList(state, laneList) {
    state.laneList = laneList
  },
  setGantryList(state, gantryList) {
    state.gantryList = gantryList
  },
  setUserList(state, userList) {
    state.userList = userList
  },
  setConfig(state, config) {
    Object.keys(config).map((key) => {
      state.config[key] = config[key]
    })
  },
  setTempdata(state, data) {
    state.tempdata = data;
  },
  addTempdata(state, data) {
    state.tempdata[data.key] = data.data
  },
  removeTempdataItem(state,key){
    delete state.tempdata[key]
  }
}

const actions = {
  cacheOrgTree({commit}, orgTree) {
    commit('setOrgTree', orgTree)
  },
  cacheOrgList({commit}, orgList) {
    commit('setOrgList', orgList)
  },
  cacheLaneList({commit}, laneList) {
    commit('setLaneList', laneList)
  },
  cacheGantryList({commit}, gantryList) {
    commit('setGantryList', gantryList)
  },
  cacheUserList({commit}, userList) {
    commit('setUserList', userList)
  },
  cacheConfig({commit}, config) {
    commit('setConfig', config)
  },
  cleaAll({commit}) {
    commit('setOrgTree', [])
    commit('setOrgList', [])
    commit('setLaneList', [])
    commit('setGantryList', [])
    commit('setUserList', [])
    commit('setConfig', [])
    commit('setTempdata', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
