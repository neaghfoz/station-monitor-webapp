<template>
  <!--  <div>-->
  <!--    <el-dialog-->
  <!--      ref="tinymceUEditorModal"-->
  <!--      :visible.sync="modalShow"-->
  <!--      title="富文本编辑"-->
  <!--      :width="'1400px'"-->
  <!--    >-->
  <div>
    <TiTinymce
      ref="editor"
      v-model="content"
      :height="height"
      :toolbar="toolbar"
      :menubar="menubar"
      :width="width"
      @input="changeContent"
    />
  </div>
  <!--    </el-dialog>-->
  <!--  </div>-->
</template>
<script>
import TiTinymce from '@/views/pro/common/TiTinymce/index.vue'
export const escape2Html = (str) => {
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
    return arrEntities[t]
  })
}
export const html2Escape = (str) => {
  return str.replace(/[<>&"]/g, function(c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
  })
}

export default {
  name: 'TiEcEditor',
  components: { TiTinymce },
  // 2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 这个牛逼
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String],
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      content: escape2Html(this.value)
    }
  },
  watch: {
    value(val) {
      this.content = escape2Html(this.value)
    }
  },
  created() {
    this.$emit('createdOk', 'ok')
  },
  methods: {
    getInstance() {
      this.$nextTick(() => {
        return this.$refs.editor
      })
    },
    changeContent(val) {
      this.$emit('change', html2Escape(val))
    }
  }
}
</script>

<style scoped>

</style>
