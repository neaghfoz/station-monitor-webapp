<template>
  <div class="vehicle">
    <div class="windowBox5">
      <div class="windowTop">
        手工输入全车牌
      </div>
      <div class="windowMainBox">
        <div class="topInput">
          <div>[{{ colorList[currentColor].value }}]</div>
          <div>
            <span v-for="(vehicle, idx) in vehicleChars" :key="idx" :class="(idx === currentNum) ? 'active3':''"><span v-show="idx === currentNum">[</span>{{ vehicle }}<span v-show="idx === currentNum">]</span></span>
          </div>
        </div>
        <div class="inputMain">
          <div class="inputColor">
            <div v-for="(item, idx) in colorList" :class="(idx === currentColor) ? 'active2':''" :key="idx">{{ item.text }}</div>
          </div>
          <div class="inputNumber">
            <div v-for="(item, is) in showQueue" v-show="isShow === 0" :key="is">
              <div class="inputN">{{ item }}</div>
              <div class="jianpan">
                <div v-for="(secondItem, ise) in showQueue" :key="ise" :style="(item === 5) ? (secondItem === 3 || secondItem === 6 || secondItem === 9) ? 'width:45px;':'width:26px;':''">{{ vehicleList[item][secondItem] }}</div>
              </div>
            </div>
            <div v-for="(item, ii) in showQueue" v-show="isShow !== 0" :key="ii">
              <div class="inputN">{{ item }}</div>
              <div class="province" :style="isShow === 5 && item === 6 ? 'font-size: 40px;font-weight: bold;width: 98px;text-align: center;' : ''">{{ vehicleList[isShow][item] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="windowDesc red fz12">
        按0选择车牌颜色，按1~9输入车牌，输入完成按【确定】键结束
      </div>
    </div>
  </div>
</template>

<script>
import mixin from 'ecip-web/utils/common-mixin'

export default {
  name: 'INPUTVEHICLE',
  mixins: [...mixin],
  data() {
    return {
      custom: null,
      rightColor: '',
      rightVehicle: '',
      method: '',
      colorList: [
        {
          value: '蓝',
          text: '蓝色'
        },
        {
          value: '黄',
          text: '黄色'
        },
        {
          value: '黑',
          text: '黑色'
        },
        {
          value: '白',
          text: '白色'
        },
        {
          value: '渐绿',
          text: '渐绿'
        },
        {
          value: '黄绿',
          text: '黄绿'
        },
        {
          value: '蓝白',
          text: '蓝白'
        }
      ],
      currentColor: 0,
      isShow: 0,
      vehicleChars: ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
      nextKey: '',
      currentNum: 0,
      showQueue: [7, 8, 9, 4, 5, 6, 1, 2, 3],
      vehicleList: [[],
        ['', '粤', '湘', '赣', '桂', '闽', '港', '澳', '琼', '贵'],
        ['', '鄂', '皖', '浙', '沪', '豫', '苏', '云', '鲁', '渝'],
        ['', '川', '新', '青', '藏', '陕', '宁', '晋', '蒙', '甘'],
        ['', '京', '津', '冀', '辽', '吉', '黑', '学', '挂', '警'],
        ['', '0', '0', '0', '使', '领', '应急', '试', '超', '外'],
        ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
        ['', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'],
        ['', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '0'],
        ['', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      ],
      inputVehicle: '',
      isRightVehicle: ''
    }
  },
  methods: {
    init(method, custom) {
      this.custom = custom
      const arr = this.custom.value.split(' ')
      this.rightColor = arr[0]
      this.rightVehicle = arr[1]
      this.currentColor = 0
      this.method = method
      this.vehicleChars = ['-', '-', '-', '-', '-', '-', '-', '-', '-']
      this.isShow = 0
      this.currentNum = 0
      if (this.method !== 'formalexam') {
        this.setKeyboard(true)
      }
    },
    checkQueren() {
      let vehicleTemp = ''
      for (var key of this.vehicleChars) {
        vehicleTemp += key
      }
      this.inputVehicle = vehicleTemp
      this.inputVehicle = this.inputVehicle.substr(0, this.inputVehicle.indexOf('-'))
      this.$emit('popupReturn', this.inputVehicle === this.rightVehicle && this.colorList[this.currentColor].value === this.rightColor, '车牌错误，请重新输入正确的车牌', this.custom.jump)
    },
    changeInput(val) {
      if (this.isShow === 0) {
        if (this.method !== 'formalexam') {
          this.isShow = val
          this.setKeyboard(true)
        } else {
          this.isShow = val
        }
      } else {
        this.getVehicleInput(val)
        if (this.method !== 'formalexam') {
          this.setKeyboard(true)
        }
      }
    },
    select: function(keyName, method) {
      switch (keyName) {
        case 'KEY_0':
          this.currentColor = (this.currentColor + 1) % 7
          break
        case 'KEY_1':
        case 'KEY_2':
        case 'KEY_3':
        case 'KEY_4':
        case 'KEY_5':
        case 'KEY_6':
        case 'KEY_7':
        case 'KEY_8':
        case 'KEY_9':
          this.changeInput(parseInt(keyName.split('_')[1]))
          break
        case 'KEY_QUEREN1':
        case 'KEY_QUEREN2':
          this.checkQueren()
          break
        case 'KEY_TUIGE':
          this.vehicleChars[this.currentNum] = '-'
          if (this.currentNum === 0) {
            this.setKeyboard(true)
          } else {
            this.upMove()
          }
          break
        case 'KEY_XIAYI':
          this.downMove()
          break
        case 'KEY_SHANGYI':
          this.upMove()
          break
        case 'KEY_QUXIAO':
          if (this.custom.cancelJump && this.custom.cancelJump !== -1) {
            this.$emit('popupReturn', true, '', this.custom.cancelJump)
          }
          break
        default:
          if (method !== 'formalexam') {
            this.setKeyboard(false)
          }
          break
      }
    },
    downMove() {
      // 下移操作
      this.currentNum = (this.currentNum + 1) % 9
      this.isShow = 0
      this.setKeyboard(true)
    },
    upMove() {
      // 上移操作
      if (this.currentNum === 0) {
        this.currentNum = 8
      } else {
        this.currentNum = (this.currentNum - 1) % 9
      }
      this.isShow = 0
      this.setKeyboard(true)
    },
    isCurrentRight() {
      const ch = this.vehicleChars[this.currentNum]
      if (this.rightVehicle.substring(this.currentNum).indexOf(ch) !== 0) {
        return false
      }
      return true
    },
    setKeyboard(isRight) {
      if (!this.isCurrentRight()) {
        let rightVal = this.rightVehicle.substring(this.currentNum, this.currentNum + 1)
        if (rightVal === '应') {
          rightVal = '应急'
        }
        if (rightVal !== '') {
          for (let i = 0; i < this.vehicleList.length; i++) {
            for (let j = 0; j < this.vehicleList[i].length; j++) {
              if (rightVal === this.vehicleList[i][j]) {
                if (this.isShow === 0) {
                  this.nextKey = i
                } else {
                  this.nextKey = j
                }
              }
            }
          }
        } else {
          this.nextKey = ''
        }
      } else {
        this.nextKey = ''
      }
      switch (this.nextKey) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
          this.$emit('setClickKeyboardNameReturn', 'KEY_' + this.nextKey, isRight)
          break
        default:
          this.$emit('setClickKeyboardNameReturn', '', isRight)
          break
      }
    },
    getVehicleInput(vehicleNum) {
      this.vehicleChars[this.currentNum] = this.vehicleList[this.isShow][vehicleNum]
      this.downMove()
    }
  }
}
</script>
<style scoped>
.vehicle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -500px;
  left: 300px;
}
.windowBox5{
  width: 540px!important;
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
.inputColor{
  text-align: center;
}
.inputColor>div{
  height: 32px;
  line-height: 30px;
  width: 120px;
  border: 1px solid #999;
}
.inputNumber{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 420px;
}
.inputNumber>div{
  width: 138px;
  height: 73.5px;
  border-right: 1px solid #999;
  border-bottom: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.inputN{
  text-align: center;
  line-height: 73.5px;
  width: 40px;
  background-color: rgb(62, 144, 236);
  font-weight: bold;
  font-size: 30px;
}
.windowBox5 .windowMainBox{
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
.jianpan{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-color: #f5f5f5;
  width: 97px;
}
.jianpan>div{
  width: 31px;
  height: 24px;
  border-right: 1px solid #999;
  border-bottom: 1px solid #999;
  line-height: 24px;
  text-align: center;
}
.province{
  font-weight: bold;
  font-size: 67px;
  width: 98px;
  text-align: center;
}
</style>
