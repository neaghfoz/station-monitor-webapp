<template>
  <div class="kahao">
    <div class="windowBox1">
      <div class="windowTop">
        请输入16位坏卡卡号
      </div>
      <div class="windowMainBox">
        <input id="INPUT_KAHAO" ref="cardNo" v-model="cardNo" type="text" maxlength="16" name="INPUT_KAHAO">
      </div>
      <div class="windowDesc fz12">
        输入完成之后，按【确定】键结束...
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      custom: null,
      cardNo: '',
      nextKey: '',
      method: '',
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
      }
    }
  },
  mounted() {
  },
  methods: {
    init(method, custom) {
      this.custom = custom
      this.cardNo = ''
      this.nextKey = ''
      this.method = method
      if (method !== 'formalexam') {
        this.setKeyboard(this.custom.value, true)
      }
    },
    changeInput(ch) {
      if (this.method !== 'formalexam') {
        this.cardNoInput(ch)
        this.setKeyboard(this.custom.value, true)
      } else {
        this.cardNoInput(ch)
      }
    },
    select: function(keyName) {
      // 处理输入框按键
      if (this.inputKey[keyName]) {
        this.changeInput(this.inputKey[keyName])
        return
      }
      // 处理其他按键
      const nameArr = keyName.split('|')
      const len = nameArr.length
      let hasItemName = false
      nameArr.map((item, idx) => {
        switch (item) {
          case 'KEY_TUIGE':
            this.cardNo = this.cardNo.substr(0, this.cardNo.length - 1)
            if (this.method !== 'formalexam') {
              this.setKeyboard(this.custom.value, true)
            }
            hasItemName = true
            break
          case 'KEY_QUEREN1':
          case 'KEY_QUEREN2':
            hasItemName = true
            this.$emit('popupReturn', this.cardNo === this.custom.value, '卡号错误，请重新输入正确的卡号', this.custom.jump)
            break
          case 'KEY_QUXIAO':
            if (this.custom.cancelJump && this.custom.cancelJump !== -1) {
              this.$emit('popupReturn', true, '', this.custom.cancelJump)
            }
            hasItemName = true
            break
          default:
            if (len === (idx + 1) && !hasItemName && this.method !== 'formalexam') {
              this.setKeyboard(this.custom.value, false)
            }
            break
        }
      })
    },
    cardNoInput(val) {
      if (this.cardNo.length < 16) {
        this.cardNo = this.cardNo + val
      }
    },
    setKeyboard(value, isRight) {
      this.nextKey = value.substr(this.cardNo.length, 1)
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
.kahao {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -400px;
  left: 360px;
}
.windowBox1{
  width: 402px!important;
  height: 115px!important;
  border: 1px solid #999;
}
.windowTop {
  background: linear-gradient(rgb(76, 144, 245), #fff);
  height: 30px;
  padding-left: 3px;
  font-weight: bold;
  line-height: 30px;
  font-size: 14px;
}
.windowDesc {
  height: 30px;
  line-height: 30px;
  padding-left: 3px;
  font-size: 16px;
  color: #333;
  background-color: #f5f5f5;
}
.windowBox1 .windowMainBox {
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
  height: 52px;
}
.windowMainBox input{
  border: 1px solid #e1e1e1;
  width: 200px;
  height: 25px;
  line-height: 25px;
  padding-left: 5px;
  outline: none;
  font-size:13px;
}
input[type=number] {
  -moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.fz12{
  font-size: 12px;
}
</style>
