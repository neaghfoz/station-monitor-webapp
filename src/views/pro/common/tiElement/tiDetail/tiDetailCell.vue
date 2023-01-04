<template>
  <div style="width: 100%">
    <div class="el-form-item el-form-item--small" style="width: 100%;border: 1px solid #ebebeb ;margin-bottom: 5px;" :title="value">
      <label class="el-form-item__label labelWidhPer" ref="label" style="background: #faf8f8;" v-text="label"/>
      <div class="el-form-item__content contentWidhPer" ref="content" style="padding-left: 12px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap ;" v-text="value"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TiDetailCell',
    components: {},
    props: {
      label: {
        type: [String],
        required: true
      },
      value: {
        type: [String, Number, Object]
      },
      labelSpan: {
        type: Number,
        default: 10
      },
      labelWidhPer: {
        type: Number,
      }
    },
    data() {
      return {
        cell: {
          labelWidhPer: this.labelWidhPer ? this.labelWidhPer : this.labelSpan * 100 / 24,
          contentWidhPer:100 - this.labelSpan * 100 / 24
        }
      };
    },
    mounted() {
      this.$nextTick(function () {
        if (this.labelSpan != 10) {
          this.cell.labelWidhPer = this.labelSpan * 100 / 24;
          this.contentWidhPer =100-this.cell.labelWidhPer
        }
        this.$refs.label.style.setProperty("--labelWidhPer", this.cell.labelWidhPer + '%')
        this.$refs.content.style.setProperty("--contentWidhPer", this.cell.contentWidhPer + '%')

      })

    }
  }
</script>

<style scoped>
  .labelWidhPer {
    width: var(--labelWidhPer);
  }
  .contentWidhPer {
    width: var(--contentWidhPer);
  }
</style>
