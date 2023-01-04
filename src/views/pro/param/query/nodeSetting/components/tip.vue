<template>
  <div class="app-container">
    <div ng-show="!selectNode.show" class="alert alert-warning margin-top-10" role="alert">
      <span style="color:red"><strong>温馨提示</strong>&nbsp;请选择一个节点</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeSettingNodeDetailsView',
  components: {},
  data() {
    return {
    }
  },
  watch: {

  },
  mounted() {
  },
  created() {
  },
  methods: {
    async init(e) {
    }
  }
}
</script>

<style scoped>

</style>
