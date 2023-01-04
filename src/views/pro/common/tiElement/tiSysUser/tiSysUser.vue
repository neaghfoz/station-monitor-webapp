<!--
 * 用户选择框，支持机构联动，常见配置
 * orgId 组织结构id，可空，空时不展示用户列表
 * roleId 角色Id，可空，可作为数据过滤条件
 * withPosition 是否待岗位查询
 * withHaveOrgUser 是否获取下级用户
 -->
<template>
  <el-select
    style="width:100%"
    :org-id="orgId"
    :role-ids="roleIds"
    :value="userId"
    :filterable="filterable"
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :org-filterable="orgFilterable"
    :size="size"
    :cache="cache"
    :allow-create="allowCreate"
    @change="onChange"
  >
    <el-option
      v-for="item in selectDataShow"
      :key="item[options.props.key]"
      :value="item[options.props.value]"
      :label="item[options.props.label]"
    />
  </el-select>
</template>

<script>
import TiSelect from '@/views/pro/common/tiElement/tiSelect/tiSelect'
import {cloneDeep} from '@ecip/ecip-web/src/utils'
import request from 'ecip-web/utils/request'

export default {
  name: 'TiSysUser',
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
    orgId: {
      type: [String],
      required: false
    },
    roleIds: {
      type: [String, Array],
      required: false
    },
    positionIds: {
      type: [String, Array],
      required: false
    },
    withPosition: {
      type: [Boolean],
      required: false
    },
    withHaveOrgUser: {
      type: [Boolean],
      required: false
    },
    withHaveSysOrg: {
      type: [Boolean],
      required: false
    },
    cache: {
      type: Array,
      required: false,
      default: () => []
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
    filterable: {
      type: Boolean,
      default: false,
      required: false
    },
    clearable: {
      type: Boolean,
      default: false,
      required: false
    },
    orgFilterable: {
      type: Boolean,
      default: false,
      required: false
    },
    props: { // 自定义显示字段
      type: Object,
      default: () => {
        return {
          key: 'username',
          value: 'username',
          label: 'fullName'
        }
      },
      required: false
    },
    allowCreate: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      userId: this.multiple ? [] : '',
      selectDataShow: [],
      options: {
        multiple: this.multiple,
        disabled: this.disabled,
        clearable: this.clearable,
        cache: this.cache,
        size: this.size,
        filterable: this.filterable,
        orgFilterable: this.orgFilterable // 是否根据org过滤,默认为false,当为true时过滤指定机构用户@20210627
        ,allowCreate: this.allowCreate
      }
    }
  },

  watch: {
    orgId: {
      handler(newVal, oldVal) {
        // alert("newVal=" + newVal + ",oldVal=" + oldVal)
        // 非第一次加载,设自动清空值
        if (oldVal) {
          this.userId = null
        }
        if (newVal && (!oldVal || newVal != oldVal)) {
          // 指定需要重新reload才加载，有些用户下拉框是固定的就不需要再重新加载，直接使用缓存
          // if (this.options.reload) {
          this.options.cache = []
          this.getData()
          // }
        }
        // this.getData()
      },
      immediate: true
    },
    value: {
      handler(val) {
        if (val == null) {
          this.userId = null
          return
        }
        if (typeof val === 'object') {
          this.userId = val
          return
        }
        if (this.multiple) {
          this.userId = val ? val.toString().split(',') : []
        } else {
          this.userId = val || ''
        }
      },
      immediate: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    getUserById(username) {
      let userInfo = null
      if (this.options.cache) {
        this.options.cache.forEach(x => {
          if (x[this.options.props.key] == username) {
            userInfo = x
            return
          }
        })
      }
      return userInfo
    },
    init() {
      this.$nextTick(async () => {
        this.propsInitData()
      })
    },
    propsInitData() {
      const {$props} = this
      cloneDeep(this.options, $props)
    },
    async getData() {
      if (!this.orgId) {
        this.selectDataShow = []
        return
      }
      // this.options.cache = this.$store.state.cache.userList;
      if (!this.options.cache || this.options.cache.length === 0) {
        const param = {deptId: this.orgId}
        if (this.withPosition) {
          param.havePositionList = true
        }
        if (this.withHaveOrgUser) {
          param.haveOrgUser = true
        }
        if (this.withHaveSysOrg) {
          param.haveSysOrg = true
        }
        if (this.roleIds && this.roleIds.length > 0) {
          param.haveRoleList = true
        }

        const userList = (await request({
          url: 'api/v1/common/sysUser/list',
          method: 'get',
          params: param,
          data: {}
        })).data

        if (userList && userList.length > 0) {
          // this.$store.state.cache.userList = userList
          this.options.cache = userList
          this.addParent(userList)
        }
      }
      // this.selectDataShow = this.filter(this.$store.state.cache.userList)
      this.selectDataShow = this.filter(this.options.cache)
    },
    filter(userList) {
      if (!userList || userList.length === 0) {
        return []
      }
      // 如果都没传过滤条件，则直接返回
      if (!this.roleIds && !this.positionIds && !this.orgId) {
        return userList
      }

      const userNewArr = []
      if (this.roleIds && !(this.roleIds instanceof Array)) {
        this.roleIds = this.roleIds.split(',')
      }
      if (this.positionIds && !(this.positionIds instanceof Array)) {
        this.positionIds = this.positionIds.split(',')
      }
      // console.log(this.options.orgFilterable)
      // 多条件同时过滤
      userList.forEach(x => {
        let orgMatch = false
        if (this.orgId && this.options.orgFilterable) {
          // 1.机构过滤,包括下级
          if (x.sysOrg && (x.sysOrg.id === this.orgId || x.sysOrg.parentId === this.orgId)) {
            orgMatch = true
          }
        } else {
          orgMatch = true // 如果未传该条件，设置为true
        }
        let roleMatch = false
        if (this.roleIds && x.roleIds && x.roleIds.length > 0) {
          // 2.角色过滤
          if (x.roleIds) {
            this.roleIds.forEach(y => {
              if (x.roleIds.indexOf(y) > -1) {
                roleMatch = true
              }
            })
          }
        } else {
          roleMatch = true // 如果未传该条件，设置为true
        }
        let positionMatch = false
        if (this.withPosition && this.positionIds && this.positionIds.length > 0) {
          // 3.岗位过滤
          if (x.positionList) {
            x.positionList.forEach(z => {
              if (z && this.positionIds.indexOf(z.code) > -1) {
                positionMatch = true
              }
            })
          }
        } else {
          positionMatch = true // 如果未传该条件，设置为true
        }
        if (orgMatch && roleMatch && positionMatch) {
          userNewArr.push(x)
        }
      })

      // 过滤机构@20210624
      /* if (this.orgId) {
        userList.forEach(x => {
          // console.log(x)
          if (x.sysOrg && x.sysOrg.id == this.orgId) {
            userNewArr.push(x)
          }
        })
      }

      if (this.roleIds && x.roleIds && x.roleIds.length > 0) {
        userList.forEach(x => {
          // 角色过滤
          if (x.roleIds) {
            this.roleIds.forEach(y => {
              if (x.roleIds.indexOf(y) > -1) {
                userNewArr.push(x)
              }
            })
          }
        })
      }

      if (this.withPosition && this.positionIds && this.positionIds.length > 0) {
        userList.forEach(x => {
          // 岗位过滤
          if (x.positionList) {
            x.positionList.forEach(z => {
              if (z && this.positionIds.indexOf(z.code) > -1) {
                userNewArr.push(x)
              }
            })
          }
        })
      }*/
      // console.log(userNewArr)
      if (userNewArr.length === 0) {
        return userList
      }
      return userNewArr
    },
    addParent(userList) {
      const userMap = {}
      userList.forEach(x => {
        userMap[x.id] = x
      })
      const userIds = Object.keys(userMap)
      userList.forEach(x => {
        if (userMap.hasOwnProperty(x.superior)) {
          x.parent = userMap[x.superior]
        }
      })
    },
    onChange(e) {
      const result = this.options.multiple ? e.join() : e
      let resultVal = e
      if (!this.options.multiple) {
        resultVal = [e]
      }
      let resultObj = []
      resultVal.forEach(x => {
        this.selectDataShow.forEach(item => {
          if (item[this.options.props.value] == x) {
            resultObj.push(item)
          }
        })
      })
      if (!this.options.multiple) {
        resultObj = e ? resultObj[0] : {}
      }
      this.$emit('change', result, resultObj)
    }
  }
}
</script>

<style scoped>
.el-select__tags {
  flex-wrap: nowrap !important;
  overflow: hidden !important;
}
</style>
