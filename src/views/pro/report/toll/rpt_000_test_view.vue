<template>
  <div class="app-container" style="height: 100%">
    <div class="search-form">

    </div>

    <iframe id="reportFrame" frameBorder="0" border="0" style="overflow: auto;width: 100%;height:100%;"
            src="/ReportServer?reportlet=report/rpt_myTest.cpt"></iframe>

  </div>
</template>


<script>

  import mixin from 'ecip-web/utils/common-mixin';


  export default {
    name: 'report.toll.rpt_000_test_view',
    components: {},
    mixins: [...mixin],
    data() {
      return {};
    }
  }

</script>

<style scoped>

</style>
