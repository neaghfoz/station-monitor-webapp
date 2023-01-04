<template>
  <div :class="[isFull?'is--maximize':'','vxe-grid']" style="z-index: 1005;">
    <slot name="buttons">
      <el-button class="el-dialog__headerbtn"  circle :title="isFull?'还原':'全屏'" @click="isFull = !isFull">
        <i class="vxe-button--icon vxe-icon--zoomin" v-show="!isFull"></i>
        <i class="vxe-button--icon vxe-icon--zoomout" v-show="isFull"></i>
      </el-button>
    </slot>
    <div lass="vxe-table border--none is--group has--height" style="height:100%;">
      <div class="vxe-table--render-wrapper" style="height:100%;">
        <div class="vxe-table--main-wrapper" style="height:100%;">
          <div class="vxe-table--body-wrapper body--wrapper" style="height: 100%;">
            <table cellspacing="0" cellpadding="0" border="0" class="vxe-table--body"
                   style="width: 100%;height: 100%;">
              <colgroup>
                <col style="width: 100%;">
              </colgroup>
              <tbody>
              <tr class="vxe-body--row">
                <td class="vxe-body--column" valign="top">
                  <slot/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'TiPanel',
    props: {
      isFullscreen: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data(){
      return {
         isFull: this.isFullscreen
      }
    }
  }
</script>
