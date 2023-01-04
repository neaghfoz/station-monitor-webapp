<template>
  <div class="rk-datetime">
    <div class="windowBox6">
      <div class="windowTop">
        请输入入口时间
      </div>
      <div class="windowMainBox">
        <div class="datetime-item-box">
          <span class="datetime-item-name">入口日期</span>
          <input id="INPUT_DATE" ref="entranceDate" v-model="entranceDate" :disabled="isStation" type="text" maxlength="8" name="INPUT_DATE">
        </div>
        <div>
          <span class="datetime-item-name">入口时间</span>
          <input id="INPUT_TIME" ref="entranceTime" v-model="entranceTime" :disabled="!isStation" type="text" maxlength="6" name="INPUT_TIME">
        </div>
        <div class="datetime-remind">
          <p>输入格式：</p>
          <p>2021年1月5日为20210105</p>
          <p>10点1分15秒为100115</p>
        </div>
      </div>
      <div class="windowDesc red fz12">
        按数字键输入日期和时间，按取消键取消计费
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'INPUTRUKOUSHIJIAN',
  data() {
    return {
      custom: null,
      entranceDate: '',
      entranceTime: '',
      nextKey: '',
      method: '',
      isStation: false,
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
      this.entranceDate = ''
      this.entranceTime = ''
      this.nextKey = ''
      this.method = method
      this.isStation = false
      if (method !== 'formalexam') {
        this.setKeyboard(this.custom.value, true)
      }
      this.$refs.entranceDate.focus()
    },
    changeInput(ch) {
      if (this.method !== 'formalexam') {
        this.dateTimeInput(ch)
        this.setKeyboard(this.custom.value, true)
        if ((this.entranceDate.length === 8 && !this.isStation) || (this.entranceTime.length === 6 && this.isStation)) {
          this.$emit('setClickKeyboardNameReturn', 'KEY_QUEREN1', true)
        }
      } else {
        this.dateTimeInput(ch)
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
            if (this.isStation) {
              if (this.entranceTime) {
                this.entranceTime = this.entranceTime.slice(0, this.entranceTime.length - 1)
              }
            } else {
              if (this.entranceDate) {
                this.entranceDate = this.entranceDate.slice(0, this.entranceDate.length - 1)
              }
            }
            if (this.method !== 'formalexam') {
              this.setKeyboard(this.custom.value, true)
            }
            hasItemName = true
            break
          case 'KEY_QUEREN1':
          case 'KEY_QUEREN2':
            hasItemName = true
            if (!this.isStation) {
              if (this.entranceDate !== this.custom.value.substr(0, 8)) {
                this.$emit('popupReturn', false, '入口日期错误，请输入正确的入口日期', this.custom.jump)
              } else {
                this.isStation = true
                this.$refs.entranceTime.focus()
                this.setKeyboard(this.custom.value, true)
              }
            } else {
              if (this.entranceTime !== this.custom.value.substr(8)) {
                this.$emit('popupReturn', false, '入口时间错误，请输入正确的入口时间', this.custom.jump)
              } else {
                this.$emit('popupReturn', true, '', this.custom.jump)
              }
            }
            break
          case 'KEY_QUXIAO':
            hasItemName = true
            if (this.custom.cancelJump && this.custom.cancelJump !== -1) {
              this.$emit('popupReturn', true, '', this.custom.cancelJump)
            }
            break
          default:
            if (len === (idx + 1) && !hasItemName && this.method !== 'formalexam') {
              this.setKeyboard(this.custom.value, false)
            }
            break
        }
        if (hasItemName) {
          return
        }
      })
    },
    dateTimeInput(val) {
      if (!this.isStation) {
        if (this.entranceDate.length < 8) {
          this.entranceDate = this.entranceDate + val
        }
      } else {
        if (this.entranceTime.length < 6) {
          this.entranceTime = this.entranceTime + val
        }
      }
    },
    setKeyboard(value, isRight) {
      this.nextKey = value.substr((this.entranceDate.length + this.entranceTime.length), 1)
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
.rk-datetime {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.windowBox6{
  width: 450px;
  border: 1px solid #999;
}
.windowTop {
  background: linear-gradient(rgb(76, 144, 245), #fff);
  height: 36px;
  padding-left: 8px;
  font-weight: bold;
  line-height: 36px;
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
.windowBox6 .windowMainBox {
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}
.windowMainBox input{
  border: 1px solid #e1e1e1;
  width: 200px;
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
  outline: none;
  font-size:14px;
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
.datetime-item-box{
  margin-bottom: 15px;
}
.datetime-item-name{
  display: inline-block;
  margin-right: 15px;
  font-size: 16px;
}
.datetime-remind{
	margin-top: 20px;
	font-size: 14px;
	color: #333;
}
.datetime-remind p{
	margin: 5px;
}
</style>
