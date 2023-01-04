<template>
  <div class="vehicle">
    <div class="windowBox7">
      <div class="windowTop">
        手工输入全车牌
        <span class="windowInputmode">{{ currentType === 1 ? '中文输入模式' : currentType === 2 ? '字母输入模式' : '车牌颜色输入模式' }}</span>
      </div>
      <div class="windowMainBox">
        <div class="topInput">
          <div :class="(currentType === 0) ? 'active3':''"><span v-show="currentType === 0">[</span>{{ selectColor | formatterColor }}<span v-show="currentType === 0">]</span></div>
          <div>
            <span v-for="(vehicle, idx) in vehicleChars" :key="idx" :class="(idx === currentNum) ? 'active3':''"><span v-show="idx === currentNum">[</span>{{ vehicle }}<span v-show="idx === currentNum">]</span></span>
          </div>
        </div>
        <div class="inputMain">
          <div class="inputKeyCont">
            <div
              v-for="(item, idx) in vehicleList"
              :key="idx"
              :class="item.name === '删除' || currentType === 0 ? item.color : ''"
            >{{ currentType === 0 ? (item.name === '删除' ? item.name : item.colorNameText) : (currentType === 1 || item.name === '删除') ? item.letter + item.name : item.letter }}</div>
          </div>
          <div class="inputOperate">
            <div v-for="(item, idx) in operateList" :key="idx" :class="item.color">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="windowDesc red fz12">
        按对应键盘按键输入车牌，输入完成按【确定】键结束
      </div>
    </div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

export default {
  name: 'INPUTVEHICLE',
  filters: {
    formatterColor(val) {
      const _val = val || '-'
      return _val
    }
  },
  mixins: [...mixin],
  data() {
    return {
      custom: null,
      rightColor: '',
      rightVehicle: '',
      method: '',
      selectColor: null,
      isShow: 0,
      vehicleChars: ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
      nextKey: '',
      currentNum: null,
      vehicleList: [
        { 'letter': 'A', 'name': '晋', 'keyNum': 'KEY_YIDONGZHIFU', 'colorName': '蓝', 'colorNameText': 'A蓝', 'color': 'color-a' },
        { 'letter': 'B', 'name': '冀', 'keyNum': 'KEY_HUAIKA', 'colorName': '黄', 'colorNameText': 'B黄', 'color': 'color-b' },
        { 'letter': 'C', 'name': '鲁', 'keyNum': 'KEY_DIUKA', 'colorName': '白', 'colorNameText': 'C白', 'color': 'color-c' },
        { 'letter': 'D', 'name': '豫', 'keyNum': 'KEY_HUANKA', 'colorName': '黑', 'colorNameText': 'D黑', 'color': 'color-d' },
        { 'letter': 'E', 'name': '辽', 'keyNum': 'KEY_ZHOUZHONG', 'colorName': '白绿', 'colorNameText': 'E白绿', 'color': 'color-e' },
        { 'letter': 'F', 'name': '吉', 'keyNum': 'KEY_SHUANGTAI', 'colorName': '黄绿', 'colorNameText': 'F黄绿', 'color': 'color-f' },
        { 'letter': 'G', 'name': '黑', 'keyNum': 'KEY_BEISAN', 'colorName': '蓝白', 'colorNameText': 'G蓝白', 'color': 'color-g' },
        { 'letter': 'H', 'name': '京', 'keyNum': 'KEY_XIAYI', 'colorName': '临', 'colorNameText': 'H临牌', 'color': 'color-h' },
        { 'letter': 'J', 'name': '津', 'keyNum': 'KEY_CHEDUI', 'colorName': '绿', 'colorNameText': 'I绿色', 'color': 'color-j' },
        { 'letter': 'K', 'name': '蒙', 'keyNum': 'KEY_DAOCHE', 'colorName': '红', 'colorNameText': 'J红色', 'color': 'color-k' },
        { 'letter': 'L', 'name': '陕', 'keyNum': 'KEY_GUACHE', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '7', 'name': '青', 'keyNum': 'KEY_7', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '8', 'name': '甘', 'keyNum': 'KEY_8', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '9', 'name': '宁', 'keyNum': 'KEY_9', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'M', 'name': '泸', 'keyNum': 'KEY_BAOJIAOCHE', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'N', 'name': '渝', 'keyNum': 'KEY_JUNJINGCHE', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'P', 'name': '川', 'keyNum': 'KEY_SHOUGONG', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'Q', 'name': '藏', 'keyNum': 'KEY_CHONGDA', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '4', 'name': '云', 'keyNum': 'KEY_4', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '5', 'name': '贵', 'keyNum': 'KEY_5', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '6', 'name': '新', 'keyNum': 'KEY_6', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'R', 'name': '苏', 'keyNum': 'KEY_TAIGAN', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'E', 'name': '浙', 'keyNum': 'KEY_GONGWUCHE', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'T', 'name': '皖', 'keyNum': 'KEY_MIANFEICHE', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'U', 'name': '闽', 'keyNum': 'KEY_WEIFUCHE', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '1', 'name': '湘', 'keyNum': 'KEY_1', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '2', 'name': '鄂', 'keyNum': 'KEY_2', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '3', 'name': '赣', 'keyNum': 'KEY_3', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'V', 'name': '粤', 'keyNum': 'KEY_JIANGGAN', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'W', 'name': '桂', 'keyNum': 'KEY_GUANLI', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'X', 'name': '琼', 'keyNum': 'KEY_CHEXUN', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'Y', 'name': '台', 'keyNum': 'KEY_JIAOBAN', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': 'Z', 'name': '警', 'keyNum': 'KEY_HUOCHE', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '0', 'name': '临', 'keyNum': 'KEY_0', 'colorName': '', 'colorNameText': '', 'color': '' },
        { 'letter': '', 'name': '删除', 'keyNum': 'KEY_KECHE', 'colorName': '', 'colorNameText': '', 'color': 'color-del' }
      ],
      operateList: [
        { 'name': '←', 'color': '' },
        { 'name': '→', 'color': '' },
        { 'name': '切换', 'color': '' },
        { 'name': '确认', 'color': 'color-comfire' }
      ],
      inputVehicle: '',
      isRightVehicle: '',
      currentType: 0 // 当前输入的类型  0 颜色 1省份 2 车牌
    }
  },
  methods: {
    init(method, custom) {
      this.custom = custom
      const arr = this.custom.value.split(' ')
      this.rightColor = arr[0]
      this.rightVehicle = arr[1]
      this.selectColor = null
      this.method = method
      this.vehicleChars = ['-', '-', '-', '-', '-', '-', '-', '-', '-']
      this.isShow = 0
      this.currentNum = null
      this.currentType = 0
      if (this.method !== 'formalexam') {
        this.setKeyboard(true)
      }
    },
    getInputVehicleProvince() {
      return this.vehicleChars[0]
    },
    getInputVehicleValue() {
      let vehicleTemp = ''
      const chars = [].concat(this.vehicleChars)
      chars[0] = ''
      // 去除末尾的连续-后，再进行判断
      for (let i = chars.length - 1; i >= 0; i--) {
        if (chars[i] === '-') {
          chars[i] = ''
        } else {
          break
        }
      }
      for (var key of chars) {
        vehicleTemp += key
      }
      return vehicleTemp
    },
    checkQueren() {
      this.inputVehicle = this.getInputVehicleProvince() + this.getInputVehicleValue()
      this.$emit('popupReturn', this.inputVehicle === this.rightVehicle && this.selectColor === this.rightColor, '车牌错误，请重新输入正确的车牌', this.custom.jump)
    },
    select: function(keyName, method) {
      switch (keyName) {
        case 'KEY_QUXIAO': // ←
          this.leftRightMove(1)
          break
        case 'KEY_XIUGAI|KEY_TUIGE': // →
          this.leftRightMove(2)
          break
        case 'KEY_YULIU': // 切换
          if (this.currentType === 0) {
            this.currentType = 1
            this.currentNum = 0
          } else if (this.currentType === 1) {
            this.currentType = 2
            this.currentNum = 1
          } else {
            this.currentType = 0
            this.currentNum = null
          }
          this.setKeyboard(true)
          break
        case 'KEY_QUEREN1': // 确认
        case 'KEY_QUEREN2':
          this.checkQueren()
          break
        case 'KEY_KECHE': // 删除
          if (this.currentType === 0) {
            this.selectColor = null
          } else {
            this.$set(this.vehicleChars, this.currentNum, '-')
          }
          this.setKeyboard(true)
          break
        default:
          this.setKeyboard(false, keyName)
          break
      }
    },
    leftRightMove(type) {
      // 任何位下，左移右移均有效
      if (type === 1) {
        if (this.currentType === 0) {
          // 颜色位下左移，判定移至车牌位的第几位
          const vehicle = this.getInputVehicleValue()
          this.currentType = 2
          if (vehicle.length === 8) {
            this.currentNum = 8
          } else {
            this.currentNum = vehicle.length + 1
          }
        } else if (this.currentType === 1) {
          // 省份位下左移，即切换至颜色位
          this.currentType = 0
          this.currentNum = null
        } else {
          // 车牌位下左移
          // 左移
          if (this.currentNum > 1) {
            this.currentNum = this.currentNum - 1
          } else {
            // 左移的顶端就是省份位，切换至省份位
            this.currentType = 1
            this.currentNum = 0
          }
        }
      } else {
        if (this.currentType === 0) {
          // 颜色位下右移，切换至省份位
          this.currentType = 1
          this.currentNum = 0
        } else if (this.currentType === 1) {
          // 省份位下右移，即切换至车牌位的第一位
          this.currentType = 2
          this.currentNum = 1
        } else {
          // 车牌位下右移，判定是否移至下一位还是倒回颜色位
          const vehicle = this.getInputVehicleValue()
          // 实际车牌和当前位相差1（即中间有横杠出现导致）或者直接在最末位，切换至颜色位
          if (vehicle.length < this.currentNum || this.currentNum === 8) {
            this.currentType = 0
            this.currentNum = null
          } else {
            this.currentNum += 1
          }
        }
      }
      this.setKeyboard(true)
    },
    isCurrentRight() {
      const ch = this.vehicleChars[this.currentNum]
      if (this.rightVehicle.substring(this.currentNum).indexOf(ch) !== 0) {
        return false
      }
      return true
    },
    setKeyboard(isRight, keyName) {
      // 有键值情况下
      if (keyName) {
        // 格式化键值，|分隔
        const nameArr = keyName.split('|')
        for (const item in nameArr) {
          const hasItem = this.vehicleList.find(n => n.keyNum === nameArr[item])
          if (hasItem) {
            // 颜色输入时
            if (this.currentType === 0) {
              if (hasItem.colorName) {
                // 有颜色的按键
                this.selectColor = hasItem.colorName
                // 颜色输入完毕，需要自动跳到省份位，即自动触发预留按键
                this.select('KEY_YULIU')
              } else {
                this.setClickError()
              }
            } else {
              if (this.currentType === 1) {
                this.$set(this.vehicleChars, this.currentNum, hasItem.name)
                // 省份输入完毕，需要自动跳到车牌位，即自动触发预留按键
                this.select('KEY_YULIU')
              } else {
                this.$set(this.vehicleChars, this.currentNum, hasItem.letter)
                // 优先判断当前是否第八位且所有位均有值，则自动切换到颜色位
                if (this.currentNum === 8) {
                  const vehicleTemp = this.getInputVehicleValue()
                  if (vehicleTemp.length === 8) {
                    this.select('KEY_YULIU')
                  }
                } else {
                  // 默认右移，即下一位
                  this.leftRightMove(2)
                }
              }
            }
            break
          }
        }
      } else {
        this.setKeyboardHeartbeat(isRight)
      }
    },
    setClickError() {
      this.$emit('setClickKeyboardNameReturn', '', false)
    },
    async setKeyboardHeartbeat(isRight) {
      if (this.currentType === 1) {
        if (this.vehicleChars[0] !== this.rightVehicle.substring(0, 1)) {
          // 某位非正确值时心跳
          const hasItem = this.vehicleList.find(n => n.name === this.rightVehicle.substring(this.currentNum, this.currentNum + 1))
          if (hasItem) {
            this.nextKey = hasItem.keyNum
            isRight = true
          }
        } else {
          this.nextKey = ''
          isRight = true
        }
      } else if (this.currentType === 2) {
        const _str = this.rightVehicle.substring(this.currentNum, this.currentNum + 1)
        const curStr = this.vehicleChars[this.currentNum]
        if (_str) {
          if (curStr !== _str) {
            const hasItem = this.vehicleList.find(n => n.letter === _str)
            if (hasItem) {
              this.nextKey = hasItem.keyNum
              isRight = true
            }
          } else {
            this.nextKey = ''
            isRight = true
          }
        } else if (curStr !== '-') {
          // 删除
          this.nextKey = 'KEY_KECHE'
          isRight = true
        } else {
          this.nextKey = ''
          isRight = true
        }
      } else {
        if (this.selectColor !== this.rightColor) {
          // 某位非正确值时心跳
          const hasItem = this.vehicleList.find(n => n.colorName === this.rightColor)
          if (hasItem) {
            this.nextKey = hasItem.keyNum
            isRight = true
          }
        } else {
          this.nextKey = ''
          isRight = true
        }
      }
      this.$emit('setClickKeyboardNameReturn', this.nextKey, isRight)
    }
  }
}
</script>
<style scoped>
.vehicle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.windowBox7{
  width: 496px!important;
  border: 1px solid #999;
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}

.topInput{
  height: 40px;
  color: red;
  background-color: #fff;
  border-bottom: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.inputMain{
  display: flex;
  justify-content: space-between;
}
.windowBox7 .windowMainBox{
  background-color: #fff;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
}
.windowMainBox input{
  border: 1px solid #e1e1e1;
  width: 200px;
  height: 25px;
  line-height: 25px;
  padding-left: 5px;
  outline: none;
}
.windowTop {
  position: relative;
  background: linear-gradient(rgb(76, 144, 245), #fff);
  height: 30px;
  padding-left: 3px;
  font-weight: bold;
  line-height: 30px;
  font-size: 14px;
}
.active2{
  background-color: #3d95ff;
  color: red;
}
.active3{
  font-size: 30px;
}
.windowDesc {
  height: 30px;
  line-height: 30px;
  padding-left: 3px;
  font-size: 16px;
  color: #333;
  background-color: #f5f5f5;
}
.red{
  color: red;
}
.fz12{
  font-size: 12px;
}
.windowInputmode{
  position: absolute;
	top: 0;
	right: 5px;
}
.inputKeyCont{
	padding: 5px 0 5px 5px;
	display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 475px;
  color: black;
}
.inputOperate{
	padding: 5px 5px 5px 0;
	text-align: center;
}
.inputKeyCont>div,.inputOperate>div{
	margin: 3px;
	width: 54px;
	height: 32px;
	line-height: 32px;
	font-size: 14px;
	border: 1px solid #b4b4b4;
	text-align: center;
}
.inputOperate>div{
	margin-bottom: 6px;
}
.inputOperate>div:last-child{
	margin-bottom: 3px;
	height: 70px;
  line-height: 70px;
}
.color-a{
  background: #00a2ff;
}
.color-b{
  background: #ffd200;
}
.color-c{
  background: #fff;
}
.color-d{
  background: #494949;
}
.color-e{
  background: #93eeb7;
}
.color-f{
  background: #d3fa7f;
}
.color-g{
  background: #bff5ff;
}
.color-h{
  background: #807e78;
}
.color-j{
  background: #098123;
}
.color-k{
  background: #ff0000;
}
.color-del{
  color: #333;
  background: #f50c0d;
}
.color-comfire{
  color: #333;
  background: #00d90f;
}
</style>
