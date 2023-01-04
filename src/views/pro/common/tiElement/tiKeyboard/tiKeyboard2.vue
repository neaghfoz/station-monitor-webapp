<template>
  <div class="keyboard-main">
    <div ref="liTitle" class="liTitle">高速公路专用收费键盘</div>
    <div ref="opDesc" class="opDesc">
      <div>使用说明：</div>
      <div>1、使用鼠标点击对应按钮；</div>
      <div>2、在输入入口信息的页面中，轴重键代表A，双胎键代表B，备三键代表C，货车键代表D，客车键代表E，预留键代表F。例如需要输入F，则点击预留键，以此类推。</div>
    </div>
    <div class="jianpanMain">
      <div class="jianpanLeft" :style="'height: ' + keyboardHeight">
        <el-image
          v-for="(item,index) in keyboardLeftList"
          :key="index"
          :class="'jianpanLeftImage '+ keyboardActive(item.keyName)"
          :src="item.imgUrl"
          fit="contain"
          @click="clickKeyboard(item.keyName,index,'L',item)"
        />
      </div>
      <div class="jianpanRight" :style="'height: ' + keyboardHeight">
        <el-image
          v-for="(item,index) in keyboardRightList"
          :key="index"
          :class="'jianpanRightImage '+ keyboardActive(item.keyName)"
          :src="item.imgUrl"
          fit="contain"
          @click="clickKeyboard(item.keyName,index,'R',item)"
        />
      </div>
      <div class="jianpanRightThird" :style="'height: ' + keyboardHeight">
        <el-image
          v-for="(item,index) in keyboardRightThirdList"
          :key="index"
          :class="'jianpanRightThirdImage '+ keyboardActive(item.keyName)"
          :src="item.imgUrl"
          fit="contain"
          @click="clickKeyboard(item.keyName,index,'RT',item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TiKeyboard',
  components: {},
  props: {
    method: {
      type: [String],
      default: ''
    },
    keyboardName: {
      type: [String],
      default: ''
    }
  },
  data() {
    return {
      keyboardLeftList: [
        { name: '备一|上移', keyName: 'KEY_YIDONGZHIFU|KEY_SHANGYI', imgUrl: require('@/assets/img/train/practical/jianpan2/type_1.png') },
        { name: '坏卡', keyName: 'KEY_HUAIKA', imgUrl: require('@/assets/img/train/practical/jianpan2/type_2.png') },
        { name: '丢卡', keyName: 'KEY_DIUKA', imgUrl: require('@/assets/img/train/practical/jianpan2/type_3.png') },
        { name: '换卡', keyName: 'KEY_HUANKA', imgUrl: require('@/assets/img/train/practical/jianpan2/type_4.png') },
        { name: '备二', keyName: 'KEY_XIAYI', imgUrl: require('@/assets/img/train/practical/jianpan2/type_5.png') },
        { name: '车队', keyName: 'KEY_CHEDUI', imgUrl: require('@/assets/img/train/practical/jianpan2/type_6.png') },
        { name: '倒车', keyName: 'KEY_DAOCHE', imgUrl: require('@/assets/img/train/practical/jianpan2/type_7.png') },
        { name: '挂车', keyName: 'KEY_GUACHE', imgUrl: require('@/assets/img/train/practical/jianpan2/type_8.png') },
        { name: '包缴车', keyName: 'KEY_BAOJIAOCHE', imgUrl: require('@/assets/img/train/practical/jianpan2/type_9.png') },
        { name: '军警车', keyName: 'KEY_JUNJINGCHE', imgUrl: require('@/assets/img/train/practical/jianpan2/type_10.png') },
        { name: '手工', keyName: 'KEY_SHOUGONG', imgUrl: require('@/assets/img/train/practical/jianpan2/type_11.png') },
        { name: '重打', keyName: 'KEY_CHONGDA', imgUrl: require('@/assets/img/train/practical/jianpan2/type_12.png') },
        { name: '抬杆', keyName: 'KEY_TAIGAN', imgUrl: require('@/assets/img/train/practical/jianpan2/type_13.png') },
        { name: '公务车', keyName: 'KEY_GONGWUCHE', imgUrl: require('@/assets/img/train/practical/jianpan2/type_14.png') },
        { name: '免费车', keyName: 'KEY_MIANFEICHE', imgUrl: require('@/assets/img/train/practical/jianpan2/type_15.png') },
        { name: '未付车', keyName: 'KEY_WEIFUCHE', imgUrl: require('@/assets/img/train/practical/jianpan2/type_16.png') },
        { name: '降杆', keyName: 'KEY_JIANGGAN', imgUrl: require('@/assets/img/train/practical/jianpan2/type_17.png') },
        { name: '管理', keyName: 'KEY_GUANLI', imgUrl: require('@/assets/img/train/practical/jianpan2/type_18.png') },
        { name: '查询', keyName: 'KEY_CHEXUN', imgUrl: require('@/assets/img/train/practical/jianpan2/type_19.png') },
        { name: '交班', keyName: 'KEY_JIAOBAN', imgUrl: require('@/assets/img/train/practical/jianpan2/type_20.png') }
      ],
      keyboardRightList: [
        { name: '轴重', keyName: 'KEY_ZHOUZHONG', 'letter': 'A', imgUrl: require('@/assets/img/train/practical/jianpan2/num1.png') },
        { name: '双胎', keyName: 'KEY_SHUANGTAI', 'letter': 'B', imgUrl: require('@/assets/img/train/practical/jianpan2/num2.png') },
        { name: '备三', keyName: 'KEY_BEISAN', 'letter': 'C', imgUrl: require('@/assets/img/train/practical/jianpan2/num3.png') },
        { name: '7', keyName: 'KEY_7', imgUrl: require('@/assets/img/train/practical/jianpan2/num4.png') },
        { name: '8', keyName: 'KEY_8', imgUrl: require('@/assets/img/train/practical/jianpan2/num5.png') },
        { name: '9', keyName: 'KEY_9', imgUrl: require('@/assets/img/train/practical/jianpan2/num6.png') },
        { name: '4', keyName: 'KEY_4', imgUrl: require('@/assets/img/train/practical/jianpan2/num7.png') },
        { name: '5', keyName: 'KEY_5', imgUrl: require('@/assets/img/train/practical/jianpan2/num8.png') },
        { name: '6', keyName: 'KEY_6', imgUrl: require('@/assets/img/train/practical/jianpan2/num9.png') },
        { name: '1', keyName: 'KEY_1', imgUrl: require('@/assets/img/train/practical/jianpan2/num10.png') },
        { name: '2', keyName: 'KEY_2', imgUrl: require('@/assets/img/train/practical/jianpan2/num11.png') },
        { name: '3', keyName: 'KEY_3', imgUrl: require('@/assets/img/train/practical/jianpan2/num12.png') },
        { name: '货车', keyName: 'KEY_HUOCHE', 'letter': 'D', imgUrl: require('@/assets/img/train/practical/jianpan2/num13.png') },
        { name: '0', keyName: 'KEY_0', imgUrl: require('@/assets/img/train/practical/jianpan2/num14.png') },
        { name: '客车', keyName: 'KEY_KECHE', 'letter': 'E', imgUrl: require('@/assets/img/train/practical/jianpan2/num15.png') }
      ],
      keyboardRightThirdList: [
        { name: '取消', keyName: 'KEY_QUXIAO', imgUrl: require('@/assets/img/train/practical/jianpan2/right_1.png') },
        { name: '修改|退格', keyName: 'KEY_XIUGAI|KEY_TUIGE', imgUrl: require('@/assets/img/train/practical/jianpan2/right_2.png') },
        { name: '预留', keyName: 'KEY_YULIU', 'letter': 'F', imgUrl: require('@/assets/img/train/practical/jianpan2/right_3.png') },
        { name: '确认', keyName: 'KEY_QUEREN1', imgUrl: require('@/assets/img/train/practical/jianpan2/right_4.png') }
      ],
      timer: null, // 定时器
      keyboardHeight: '28.6vh'
    }
  },
  created() {
    this.imgReady()
  },
  mounted() {
    // this.$nextTick(function() {
    //   if (this.labelSpan !== 10) {
    //     this.cell.labelWidhPer = this.labelSpan * 100 / 24
    //   }
    //   this.$refs.label.style.setProperty('--labelWidhPer', this.cell.labelWidhPer + '%')
    // })
    // const that = this
    // that.timer = setInterval(() => {
    //   console.log(document.readyState)
    //   if (document.readyState === 'complete') {
    //     this.$emit('isLoadFinish')
    //     window.clearInterval(that.timer)
    //   }
    // }, 1000)
    window.addEventListener('resize', () => {
      this.$nextTick(() => {
        this.setKeyboardH()
      })
    })
  },
  methods: {
    // 动态设置键盘区域按键高度
    setKeyboardH() {
      const h = this.viewportToPixels('42.5vh') // document.getElementById('rightBottomBox').offsetHeight
      const titH = this.$refs.liTitle.offsetHeight
      const descH = this.$refs.opDesc.offsetHeight
      const diff = h - titH - descH - 3
      // console.log(h, titH, descH)
      // console.log(this.viewportToPixels('42.5vh') + 47)
      this.keyboardHeight = diff + 'px'
    },
    // 点击键盘
    clickKeyboard(name, idx, type, items) {
      const letter = items.letter || ''
      this.$emit('clickKeyboard', name, idx, type, letter)
    },
    // 按键心跳效果处理
    keyboardActive(name) {
      const { keyboardName, method } = this
      let hasName = false
      const nameArr = name.split('|')
      for (const item in nameArr) {
        if (nameArr[item] === keyboardName) {
          hasName = true
          break
        }
      }
      if (hasName && method !== 'formalexam') {
        return 'cur'
      } else {
        return ''
      }
    },
    imgReady() {
      const pics = this.keyboardLeftList.concat(this.keyboardRightList, this.keyboardRightThirdList)
      const picsAll = pics.map((item) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = item.imgUrl
          img.onload = () => resolve(item)
          img.onerror = () => reject(new Error(item.imgUrl + ' load error'))
        })
      })
      Promise.all(picsAll).then(() => {
        console.log('load all success')
        this.$emit('isLoadFinish', true)
      }).catch((e) => {
        this.$emit('isLoadFinish', false)
      })
    },
    viewportToPixels(value) {
      const parts = value.match(/([0-9\.]+)(vh|vw)/)
      const q = Number(parts[1])
      const side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
      return side * (q / 100)
    }
  }
}
</script>

<style scoped>
.liTitle{
  height:4vh;
  line-height: 4vh;
  font-weight: bold;
}
.jianpanMain{
  width: 100%;
  padding: 0 2%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.jianpanLeft{
  width: 46%;
  height: 29vh;
  margin-right: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.jianpanLeftImage{
  width: 25%;
  height: 20%;
}
.jianpanRight{
  width: 37%;
  height: 29vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.jianpanRightImage{
  width: 33%;
  height: 20%;
}
.opDesc{
  text-align: left;
  font-size: 12px;
  color: red;
  padding: 0 3%;
  padding-bottom: 0.5vh;
  line-height: 18px;
}
.centerImage{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.jianpanRightThird{
	width: 13%;
    height: 29vh;
    display: flex;
    margin-left: 2%;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}
.jianpanRightThirdImage{
	width: 100%;
    height: 20%;
}
.jianpanRightThirdImage:last-child{
	height: 40%;
}

@keyframes myfirst {
  0% {
    transform:scale(1);
  }
  50% {
    transform:scale(1.2);
  }
  100% {
    transform:scale(1);
  }
}
@keyframes myfirst2 {
  0% {
    transform:scale(1);
  }
  50% {
    transform:scale(1.2);
  }
  100% {
    transform:scale(1);
  }
}

.jianpanLeftImage.cur,.jianpanRightImage.cur,.jianpanRightThirdImage.cur{
  animation: myfirst 1.2s infinite;
}
.shua-btn.cur{
  animation: myfirst2 1.2s infinite;
}

/* @media (max-width: 1366px) {
  .jianpanLeft, .jianpanRight{
    height: 25.5vh;
  }
} */
</style>
