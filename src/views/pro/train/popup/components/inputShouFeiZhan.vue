<template>
  <div class="shoufeizhan">
    <div class="windowBox2">
      <div class="windowTop">
        输入入口信息
      </div>
      <div class="windowMainBox">
        <div class="borderMain">
          <div class="lineTitle">入口路网输入</div>
          <input ref="provinceRef" v-model="provinceNo" :disabled="isStation" type="text" maxlength="4">
          <span class="fz12">{{ provinceName }}</span>
        </div>
        <div class="borderMain">
          <div class="lineTitle">路段站输入</div>
          <input ref="stationRef" v-model="stationNo" :disabled="!isStation" type="text" maxlength="4">
          <span class="fz12">入口站：{{ stationList.length > 0 ? stationList[stationIndex].bean.name : '' }}</span>
        </div>

        <div class="textAreaBox" style="margin-top: 30px;">
          <div style="margin-right: 30px;padding:10px" class="borderMain">
            <div class="lineTitle">路段信息</div>
            <div ref="roadScrollContainer" class="divList sInfo1" :style="{ overflow:'auto',height: '250px'}">
              <div v-for="(item, idx) in roadList" :id="'road_' + idx" :key="idx" :class="(idx === roadIndex) ? (isRoadSelect ? 'stItem active' : 'stItem active2'):'stItem'" data-id="">{{ item.bean.name }}</div>
            </div>
          </div>
          <div class="borderMain" style="padding:10px; ">
            <div class="lineTitle">站信息</div>
            <div ref="stationScrollContainer" class="divList sInfo2" :style="{ overflow:'auto',height: '250px'}">
              <div v-for="(item, idx) in stationList" :id="'station_' + idx" :key="idx" :class="(idx === stationIndex) ? (isRoadSelect ? 'stItem active2' : 'stItem active'):'stItem'" data-id="">{{ item.bean.name }}</div>
            </div>
          </div>
        </div>

      </div>
      <div class="windowDesc red fz12">
        按数字键输入路段站编码，按【管理】键切换选择列表，按【确认】键确认选择，按【取消】键放弃输入
      </div>
    </div>
  </div>
</template>

<script>
import { getTree } from './hexMapping'
export default {
  name: 'INPUTSHOUFEIZHAN',
  data() {
    return {
      custom: {},
      rightProvinceNo: '',
      rightProvinceName: '',
      provinceNo: '',
      provinceName: '',
      rightStationNo: '',
      stationNo: '',
      isStation: false,
      roadList: [],
      stationList: [],
      isRoadSelect: true,
      hexs: null,
      roadIndex: 0,
      stationIndex: 0,
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
      },
      letter: ''
    }
  },
  watch: {
    provinceNo() {
      if (this.hexs) {
        if (this.provinceNo !== this.rightProvinceNo) {
          this.provinceName = ''
          this.roadList = []
          this.stationList = []
        } else {
          this.provinceName = this.rightProvinceName
          this.resetRoad()
          this.resetStation()
        }
      }
    },
    stationNo() {
      if (this.hexs) {
        this.resetRoad()
        this.resetStation()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  methods: {
    async init(method, custom) {
      // 不参与心跳提示
      this.custom = custom
      this.rightProvinceNo = custom.value.slice(0, 4)
      this.rightStationNo = custom.value.slice(4, 8)
      this.hexs = null
      this.provinceNo = this.rightProvinceNo
      this.stationNo = ''
      this.roadIndex = 0
      this.stationIndex = 0
      this.isStation = false
      await this.getTree()
    },
    async getData() {

    },
    async getTree() {
      this.hexs = null
      getTree({ 'hex': this.provinceNo }).then(res => {
        for (const i in res.data) {
          if (res.data[i].hex === this.provinceNo) {
            this.hexs = res.data[i]
            this.rightProvinceName = res.data[i].bean.name
            this.provinceName = this.rightProvinceName
            break
          }
        }

        if (this.hexs) {
          this.resetRoad()
          this.resetStation()
        }
      })
      this.$refs.provinceRef.focus()
    },
    resetRoad() {
      if (this.stationNo.length === 0) {
        this.roadList = this.hexs.children
      } else {
        let roadPrefix = this.provinceNo
        if (this.stationNo.length === 1) {
          roadPrefix = roadPrefix + this.stationNo.slice(0, 1)
        } else {
          roadPrefix = roadPrefix + this.stationNo.slice(0, 2)
        }
        const roadLists = this.hexs.children
        this.roadList = []
        for (const index in roadLists) {
          const item = roadLists[index]
          if (item.hex.indexOf(roadPrefix) === 0) {
            this.roadList.push(item)
          }
        }
      }

      this.roadIndex = 0
      this.$refs.roadScrollContainer.scrollTop = this.roadIndex * 30
    },
    resetStation() {
      this.stationList = []
      this.stationIndex = 0
      if (this.roadList.length > 0) {
        const stations = this.roadList[this.roadIndex].children
        for (const i in stations) {
          const station = stations[i]
          if (station.hex.indexOf(this.provinceNo + this.stationNo) === 0) {
            this.stationList.push(station)
          }
        }
      }

      this.$refs.stationScrollContainer.scrollTop = this.stationIndex * 30
    },
    select: function(keyName, letter) {
      // 如果在输入字符映射中找到，则处理输入框逻辑
      if (this.inputKey[keyName] || letter) {
        if (letter) {
          this.changeInput(letter)
        } else {
          this.changeInput(this.inputKey[keyName])
        }
        return
      }
      // 其他按键处理
      const nameArr = keyName.split('|')
      const len = nameArr.length
      let hasItemName = false
      nameArr.map((item, idx) => {
        switch (item) {
          case 'KEY_QUEREN1':
          case 'KEY_QUEREN2':
            if (!this.isStation) {
              if (this.provinceNo !== this.rightProvinceNo) {
                this.$emit('popupReturn', false, '省份错误，请输入正确的省份信息', this.custom.jump)
              } else {
                this.isStation = true
                this.$refs.stationRef.focus()
              }
            } else {
              const rightHex = this.rightProvinceNo + this.rightStationNo
              if (this.stationList.length > 0) {
                if (this.stationList[this.stationIndex].hex === rightHex) {
                  this.$emit('popupReturn', true, '', this.custom.jump)
                } else {
                  this.$emit('popupReturn', false, '站错误，请输入正确的站信息', this.custom.jump)
                }
              } else {
                if (this.rightStationNo === this.stationNo) {
                  this.$emit('popupReturn', true, '', this.custom.jump)
                } else {
                  this.$emit('popupReturn', false, '站错误，请输入正确的站信息', this.custom.jump)
                }
              }
            }
            hasItemName = true
            break
          case 'KEY_QUXIAO':
            if (this.custom.cancelJump && this.custom.cancelJump !== -1) {
              this.$emit('popupReturn', true, '', this.custom.cancelJump)
            }
            hasItemName = true
            break
          case 'KEY_SHANGYI':
            this.upAndDownSelect('SHANGYI')
            hasItemName = true
            break
          case 'KEY_XIAYI':
            this.upAndDownSelect('XIAYI')
            hasItemName = true
            break
          case 'KEY_TUIGE':
            if (this.isStation) {
              if (this.stationNo) {
                this.stationNo = this.stationNo.slice(0, this.stationNo.length - 1)
              }
            } else {
              if (this.provinceNo) {
                this.provinceNo = this.provinceNo.slice(0, this.provinceNo.length - 1)
              }
            }
            hasItemName = true
            break
          case 'KEY_GUANLI':
            this.isRoadSelect = !this.isRoadSelect
            hasItemName = true
            break
          default:
            if (len === (idx + 1) && !hasItemName && this.method !== 'formalexam') {
              this.$emit('setClickKeyboardNameReturn', '', false)
            }
            break
        }
        if (hasItemName) {
          return
        }
      })
    },
    upAndDownSelect(type) {
      if (this.isRoadSelect) {
        if (this.roadList.length > 0) {
          if (type === 'XIAYI') {
            this.roadIndex = (this.roadIndex + 1) % this.roadList.length
          } else {
            if (this.roadIndex === 0) {
              this.roadIndex = this.roadList.length - 1
            } else {
              this.roadIndex -= 1
            }
          }
          this.$refs.roadScrollContainer.scrollTop = this.roadIndex * 30
          this.resetStation()
        }
      } else {
        if (this.stationList.length > 0) {
          if (type === 'XIAYI') {
            this.stationIndex = (this.stationIndex + 1) % this.stationList.length
          } else {
            if (this.stationIndex === 0) {
              this.stationIndex = this.stationList.length - 1
            } else {
              this.stationIndex -= 1
            }
          }
          this.$refs.stationScrollContainer.scrollTop = this.stationIndex * 30
        }
      }
    },
    changeInput(ch) {
      // 改变路网输入框或收费站输入框内容
      if (this.isStation) {
        if (this.stationNo.length < 4) {
          this.stationNo = this.stationNo + ch
        }
      } else {
        if (this.provinceNo.length < 4) {
          this.provinceNo = this.provinceNo + ch
        }
      }
    }
  }
}
</script>
<style scoped>
  .shoufeizhan {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: -630px;
    left: 290px;
  }
  .windowBox2 input{
    width: 250px;
  }
  .windowBox2 .divList{
    width: 200px;
    height: 250px;
    border: 1px solid #ddd;
  }
  .windowBox2 .windowMainBox{
    padding:5px 20px;
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
  .windowTop{
    background: linear-gradient(rgb(76, 144, 245), #fff);
    height: 30px;
    padding-left: 3px;
    font-weight: bold;
    line-height: 30px;
    font-size: 14px;
  }
  .borderMain{
    border: 1px #999 solid ;
    border-radius: 5px;
    padding: 10px 20px;
    position: relative;
    margin:20px 0;
  }
  .lineTitle{
    font-weight: bold;
    font-size: 12px;
    margin-bottom: 10px;
    position: absolute;
    background-color: #fff;
    padding: 0 5px;
    left: 16px;
    top: -10px;
  }
  .fz12{
    font-size: 12px;
  }
  .textAreaBox{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .stItem{
    width: 100%;
    color: red;
    height: 30px;
    line-height: 30px;
    padding-left: 4px;
    font-size: 12px;
  }
  .active2{
    background-color: #e2e3e4;
  }
  .active{
    background-color: #3d95ff;
  }
  .windowDesc{
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
</style>
