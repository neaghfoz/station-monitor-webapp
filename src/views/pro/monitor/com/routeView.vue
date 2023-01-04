<template>
  <div>
    <keep-alive>
      <router-view v-if="!noCache" />
    </keep-alive>
    <router-view v-if="noCache" />
  </div>
</template>

<script>
  export default {
    name: 'pro.monitor.com.routeView',
    computed: {
      noCache() {
        return this.$route.meta.noCache
      },
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.path
      }
    },
    created() { 
      const route = this.$route.matched.find(item => item.name === this.$options.name)
      if (route) this.$store.dispatch('tagsView/addCachedView', route)
    }
  }


</script>
