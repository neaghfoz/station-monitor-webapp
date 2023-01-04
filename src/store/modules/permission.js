import { constantRoutes } from '@/router'
import { getRouterReq } from 'ecip-web/api/routers'
import { backendMenusToRouters } from '@/utils/auth'
import { appId, allApp } from '@/settings'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: JSON.parse(window.sessionStorage.getItem('routes'))||[],
  addRoutes: JSON.parse(window.sessionStorage.getItem('StateRoute'))||[],
  appUrlMap: JSON.parse(window.sessionStorage.getItem('appUrlMap') )||{}
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    window.sessionStorage.setItem('routes',JSON.stringify(routes))
    window.sessionStorage.setItem('StateRoute',JSON.stringify(constantRoutes.concat(routes)))
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_APP_URL_MAP: (state, appUrlMap) => {
    window.sessionStorage.setItem('appUrlMap',appUrlMap)
    state.appUrlMap = appUrlMap


  }
}

function findActualRoute(route) {
  const usefulRoute = []
  route.forEach(item => {
    if (item.appId === appId) {
      if (!item.children) {
        usefulRoute.push(item)
      } else {
        item.children.forEach(child => {
          child.component = './layout'
        })
        usefulRoute.push(...item.children)
      }
    }
  })
  return usefulRoute
}

const actions = {
  generateRoutes({ commit }, roles) {
    // return new Promise(resolve => {
    //   let accessedRoutes
    //   if (roles.includes('admin')) {
    //     accessedRoutes = asyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
    return new Promise((resolve, reject) => {
      try {
        getRouterReq({ appId, allApp }).then(res => {
          const allIframeList = []
          console.log(appId,'appId');
          console.log(allApp,'allApp');

          console.log(res.data,'89');


          const whiteList = ['传输监视', '车道监控', '节点连通性监视', '数据上传完整性监视', '参数版本监控', '车道监视', '特情登记查询', '监控机构', '监控机构配置', '系统管理', '用户管理', '组织机构', '角色管理']
          let route = res.data

          let menu = res.data.filter(item => {
            let children = []
            if (item.children && item.children.length !== 0) {
              children = item.children.filter(c => {
                if (whiteList.includes(c.meta.title)) return c
              })
            }
            item.children = children
            console.log("ITEMCHILDREN: " + JSON.stringify(children))
            if (whiteList.includes(item.meta.title)) return item
          })
          console.log("MENU: " + JSON.stringify(menu))
          // console.log(men,'menu');
          // console.log(allApp,'allApp');
          if (allApp) {
            commit('SET_APP_URL_MAP', res.data.appUrlMap)
            route = findActualRoute(res.data.route)
            menu = res.data.route
          }
          const accessedRoutes = backendMenusToRouters(route, allIframeList)
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          console.log(accessedRoutes,'accrouters');

          commit('SET_ROUTES', accessedRoutes)
          sessionStorage.setItem('allMenuList', JSON.stringify(menu || '[]'))
          sessionStorage.setItem('allIframeList', JSON.stringify(allIframeList || '[]'))
          // sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
          // sessionStorage.setItem('dictList', JSON.stringify(data.dictList || '[]'))
          resolve(accessedRoutes)
        }).catch(err => {
          sessionStorage.setItem('allMenuList', '[]')
          sessionStorage.setItem('allIframeList', '[]')
          // sessionStorage.setItem('permissions', '[]')
          // sessionStorage.setItem('dictList', '[]')
          reject(err)
        })
      } catch (error) {
        sessionStorage.setItem('allMenuList', '[]')
        sessionStorage.setItem('allIframeList', '[]')
        // sessionStorage.setItem('permissions', '[]')
        // sessionStorage.setItem('dictList', '[]')
        reject(error)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
