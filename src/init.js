import Vue from 'vue'
import {DEFAULT_LAYOUT, DEFAULT_THEME, DEVICE, FIXED_HEADER, LANGUAGE, MAIN_TABS, MAIN_TABS_ACTIVE_NAME, NAVBAR_LAYOUT_TYPE, SHOW_SETTINGS, SIDEBAR, SIDEBAR_LAYOUT_SKIN, SIDEBAR_LOGO, SIZE, SUPPORT_PINYIN_SEARCH, TAGS_VIEW, TITLE} from '@/store/mutation-types'
import store from '@/store'
import config from '@/settings'
import {version} from "@/views/sx/base/base";

function initSettings(key) {
  store.commit('settings/CHANGE_SETTING', { key: key, value: Vue.ls.get(key, config[key]) })
}
/**
 *  需要强制清理客户端localstorage缓存可以修改以下版本号
 */
const clearVersion = config.clearVersion || '1'
const init = (callback) => {
  if (!Vue.ls.get('clearVersion:' + clearVersion)) {
    Vue.ls.set('clearVersion:' + clearVersion, clearVersion)
    Vue.ls.remove(SIDEBAR)
    Vue.ls.remove(DEVICE)
    Vue.ls.remove(SIZE)
    Vue.ls.remove(TITLE)
    Vue.ls.remove(LANGUAGE)
    Vue.ls.remove(DEFAULT_THEME)
    Vue.ls.remove(DEFAULT_LAYOUT)
    Vue.ls.remove(NAVBAR_LAYOUT_TYPE)
    Vue.ls.remove(SIDEBAR_LAYOUT_SKIN)
    Vue.ls.remove(SHOW_SETTINGS)
    Vue.ls.remove(TAGS_VIEW)
    Vue.ls.remove(FIXED_HEADER)
    Vue.ls.remove(SIDEBAR_LOGO)
    Vue.ls.remove(SUPPORT_PINYIN_SEARCH)
    Vue.ls.remove(MAIN_TABS)
    Vue.ls.remove(MAIN_TABS_ACTIVE_NAME)
  }
  store.commit('app/SET_SIDEBAR', Vue.ls.get(SIDEBAR, config[SIDEBAR]))
  store.commit('app/TOGGLE_DEVICE', Vue.ls.get(DEVICE, config[DEVICE]))
  store.commit('app/SET_LANGUAGE', Vue.ls.get(LANGUAGE, config[LANGUAGE]))
  store.commit('app/SET_SIZE', Vue.ls.get(SIZE, config[SIZE]))
  store.commit('settings/CHANGE_SETTING', { key: TITLE, value: config[TITLE] })
  // initSettings(TITLE)
  initSettings(DEFAULT_THEME)
  initSettings(DEFAULT_LAYOUT)
  initSettings(NAVBAR_LAYOUT_TYPE)
  initSettings(SIDEBAR_LAYOUT_SKIN)
  initSettings(TAGS_VIEW)
  initSettings(FIXED_HEADER)
  initSettings(SIDEBAR_LOGO)
  initSettings(SUPPORT_PINYIN_SEARCH)
  initSettings(MAIN_TABS)
  initSettings(MAIN_TABS_ACTIVE_NAME)

  store.commit('settings/CHANGE_SETTING', { key: SHOW_SETTINGS, value: config[SHOW_SETTINGS] })

  projectFun();
}
const INIT = {
  init: init
}

var projectFun = () => {
  //系统版本
  version().then(res => {
    console.log('>>>>>>>>>>>  当前系统后台版本：' + res.data + '，前端版本：' + config.clearVersion + '  >>>>>>>>>>>>>>>>');
  })
}
export default INIT
