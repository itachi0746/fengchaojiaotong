<template>
  <div>
    <!--显示人数的框-->
    <div class="people-num-name">
      <i></i>
      <span>{{numFont}}</span>
    </div>
    <div class="people-num" v-if="numStrArr">
      <ul>
        <li v-for="(item,index) in numStrArr[0].split('')" :key="index">{{item}}</li>
      </ul>
      <i></i>
      <ul>
        <li v-for="(item,index) in numStrArr[1].split('')" :key="index">{{item}}</li>
      </ul>
      <span>万</span>
    </div>
    <!--比例-->
    <div class="proportion" v-if="showP">
      <div class="p-inner">
        <div class="tb" v-if="tbObj">
          <span>同比:</span>
          <span :class="tbObj.cls">{{tbObj.val}} </span>
          <img :src="tbObj.img" alt="">
        </div>
        <div class="tb" v-if="hbObj">
          <span>环比:</span>
          <span :class="hbObj.cls">{{hbObj.val}} </span>
          <img :src="hbObj.img" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { utils, postData } from '../common'

export default {
  data () {
    return {
      numFont: '全部枢纽实时总人数',
      numStrArr: null, // 人数字符串数组
      areaFlowNum: null, // 人数
      tbObj: null, // 同比
      hbObj: null, // 环比
      mapObj: {
        high: require('../assert/同比icon_上升.png'),
        low: require('../assert/同比icon_下降.png')
      },
      showP: true // 显示同比
    }
  },
  props: {
    positionId: { // 地点id
      type: String,
      default: null
    },
    showLaiyuan: { // 显示来源去向时  不显示同比
      type: Boolean,
      default: null
    }
  },
  watch: {
    areaFlowNum (newVal, oldVal) {
      this.handleFlowNum(newVal)
    },
    showLaiyuan (newVal, oldVal) {
      this.showP = !newVal
    }
  },

  components: {},

  computed: {},

  methods: {
    /**
     * 处理枢纽人数, 把数字转为字符串数组
     */
    handleFlowNum (num) {
      let theNum = num
      this.numStrArr = utils.getStrArr(theNum)
    },
    /**
     * 处理比例
     * @param str 比例字符串  tb: "7.14%", hb: "-3.23%",
     */
    handleProportion (str) {
      let theStr = str
      let theObj = {}
      if (theStr.indexOf('-') !== -1) {
        theObj['val'] = str.replace('-', '')
        theObj['img'] = this.mapObj['low']
        theObj['cls'] = 'low'
      } else {
        theObj['val'] = str
        theObj['img'] = this.mapObj['high']
        theObj['cls'] = 'high'
      }
      return theObj
    },
    getPositionFlowAndCompare () {
      if (!this.positionId) {
        console.log(`没有地点id: ${this.positionId}`)
        return
      }
      const url = '/position/getPositionFlowAndCompare?positionId=' + this.positionId
      const data = {}
      postData(url, data).then((res) => {
        console.log(res)
        this.areaFlowNum = res.data.num
        this.hbObj = this.handleProportion(res.data.hb)
        this.tbObj = this.handleProportion(res.data.tb)
      })
    }
  },

  created () {
    this.showP = true
    this.getPositionFlowAndCompare()
  },

  mounted () {
    this.handleFlowNum(this.areaFlowNum)
  },

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>

  .people-num-name {
    font-size: 24px;
    /*margin: 0 0 24px 21px;*/
    position: absolute;
    /*top: 101px;*/
    top: 95px;
    left: 21px;
    display: flex;
    align-items: center;
    i {
      width: 20px;
      height: 21px;
      background: url("../assert/内容区_枢纽总人数icon.png") no-repeat;
      background-size: contain;
      margin-right: 8px;
    }
  }

  .people-num {
    position: absolute;
    /*top: 145px;*/
    top: 140px;
    left: 23px;
    display: flex;
    align-items: flex-end;
    font-family: unidreamledregular;
    font-size: 45px;
    ul {
      display: flex;
    }
    li {
      width: 42px;
      height: 57px;
      background: url("../assert/内容区_总人数背景色.icon.png") no-repeat;
      background-size: contain;
      margin-right: 11px;
      @include defaultFlex;
    }
    i {
      height: 10px;
      width: 6px;
      background-color: #ffffff;
      margin: 0 10px 10px 0;
      margin-left: -5px;
    }
    span {
      font-size: 24.5px;
    }
  }
  .proportion {
    position: absolute;
    top: 142px;
    left: 223px;
    width: 127px;
    height: 56px;
    background: rgba(46,162,255,0.6);
    box-shadow: inset 0 0 8px 3px #46d7ff;
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .high {
    color: #1ee44c;
  }
  .low {
    color: #e41e3e;
  }

</style>
