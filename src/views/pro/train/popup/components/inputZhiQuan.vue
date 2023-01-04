<template>
  <div class="zhiquan">
    <div class="windowBox3">
      <div class="windowTop">
        请输入纸券券号
      </div>
      <div class="windowMainBox">
        <input v-model="zhiQuanHao" type="text" maxlength="14">
        <span class="fz12">请输入纸券上14位数字的券号</span>
      </div>
      <div class="windowDesc red fz12">
        输入完成之后，按【确定】键结束...
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'INPUTZHIQUAN',
  data() {
    return {
      custom: null,
      method: '',
      zhiQuanHao: '',
      inputKey: {
        'KEY_0': '0',
        'KEY_1': '1',
        'KEY_2': '2',
        'KEY_3': '3',
        'KEY_4': '4',
        'KEY_5': '5',
        'KEY_6': '6',
        'KEY_7': '7',
        'KEY_8': '8',
        'KEY_9': '9'
        // 'KEY_YIDONGZHIFU': 'F',
        // 'KEY_MIANFEICHE': 'E',
        // 'KEY_LVTONG': 'D',
        // 'KEY_TUOCHE': 'B',
        // 'KEY_CHONGSHIBIE': 'A',
        // 'KEY_HUOCHE': 'C'
      }
    }
  },
  mounted() {

  },
  methods: {
    init(method, custom) {
      this.method = method
      this.custom = custom
      this.zhiQuanHao = ''
      if (method !== 'formalexam') {
        this.setKeyboard(this.custom.value, true)
      }
    },
    changeInput(ch) {
      if (this.method !== 'formalexam') {
        this.zhiquanInput(ch)
        this.setKeyboard(this.custom.value, true)
        if (this.zhiQuanHao.length === 14) {
          this.$emit('setClickKeyboardNameReturn', 'KEY_QUEREN1', true)
        }
      } else {
        this.zhiquanInput(ch)
      }
    },
    select: function(keyName) {
      // 处理输入框按键
      if (this.inputKey[keyName]) {
        this.changeInput(this.inputKey[keyName])
        return
      }
      const nameArr = keyName.split('|')
      const len = nameArr.length
      let hasItemName = false
      nameArr.map((item, idx) => {
        // 处理其他按键
        switch (item) {
          case 'KEY_TUIGE':
            this.zhiQuanHao = this.zhiQuanHao.substr(0, this.zhiQuanHao.length - 1)
            if (this.method !== 'formalexam') {
              this.setKeyboard(this.custom.value, true)
            }
            hasItemName = true
            break
          case 'KEY_QUEREN1':
          case 'KEY_QUEREN2':
            hasItemName = true
            this.$emit('popupReturn', this.zhiQuanHao === this.custom.value, '纸券号错误，请重新输入正确的纸券号', this.custom.jump)
            break
          case 'KEY_QUXIAO':
            hasItemName = true
            if (this.custom.cancelJump && this.custom.cancelJump !== -1) {
              this.$emit('popupReturn', true, '', this.custom.cancelJump)
            }
            break
          default:
            if (this.method !== 'formalexam') {
              if (len === (idx + 1) && !hasItemName) {
                this.setKeyboard(this.custom.value, false)
              }
            }
            break
        }
        if (hasItemName) {
          return
        }
      })
    },
    zhiquanInput(val) {
      if (this.zhiQuanHao.length < 14) {
        this.zhiQuanHao = this.zhiQuanHao + val
      }
    },
    setKeyboard(value, isRight) {
      this.nextKey = value.substr(this.zhiQuanHao.length, 1)
      switch (this.nextKey) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.$emit('setClickKeyboardNameReturn', 'KEY_' + this.nextKey, isRight)
          break
        default:
          this.$emit('setClickKeyboardNameReturn', '', isRight)
          break
      }
    }
  }
}
</script>
<style scoped>
.zhiquan {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 9999;
}
.windowBox3{
  width: 450px!important;
}
.windowTop {
  background: linear-gradient(rgb(76, 144, 245), #fff);
  height: 36px;
  padding-left: 8px;
  font-weight: bold;
  line-height: 36px;
  font-family: 微软雅黑;
  font-size: 16px;
}
.windowDesc {
  height: 30px;
  line-height: 30px;
  padding-left: 3px;
  font-size: 14px;
  color: #333;
  background-color: #f5f5f5;
}
.windowBox3 .windowMainBox {
  padding:10px 20px;
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}
.windowMainBox input{
  border: 1px solid #e1e1e1;
  width: 200px;
  height: 29px;
  line-height: 29px;
  padding-left: 5px;
  outline: none;
}
input[type=number] {
  -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.red{
    color: red;
  }
.fz12{
  font-size: 12px;
}
</style>
