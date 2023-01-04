import mixin from 'ecip-web/utils/common-mixin'
import kpiUtil from "@/views/fs/kpi/common/kpiUtil"

export default [{
  mixins: [...mixin],
  data() {
    return {
      config: {},
      curOrg: {}
    }
  },
  async created() {
    await kpiUtil.loadConfig(this.$store)
    this.config = kpiUtil.config
    this.curOrg = kpiUtil.curOrg || {}
  },
  computed: {
    curOrgId(){
      return this.curOrg.id
    }
  }
}]
