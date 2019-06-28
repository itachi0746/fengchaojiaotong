<template>
  <div class="chart-l1">
    <!--各行业人数分析 表格-->
    <div class="chart-box">
      <div class="inner">
        <ul v-if="list.length">
          <li v-for="(item,index) in list" :key="index">
            <div class="li-inner" :style="{width: item.percent}"></div>
            <div class="li-name">{{item.name}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { postData } from '../common'

export default {
  data () {
    return {
      list: [],
      maximum: 0 // 表的纵坐标最大值
    }
  },
  props: {
    curCity: {
      type: String,
      default: null
    }
  },

  watch: {
    curCity (newVal, oldVal) {
      this.getData(newVal)
    }
  },
  components: {},

  computed: {},

  methods: {
    /**
     * 请求数据
     * @param cityName string 城市名字
     */
    getData (cityName) {
      const url = 'position/getPositionTypeNum?city=' + cityName
      const data = {}
      this.list = []
      postData(url, data).then((res) => {
        console.log(res)
        let theList = res.data
        let theMaxNum = 0 // 记录最大值
        for (let obj of theList) { // 遍历 找出最大人数值
          let objNum = obj.num
          if (typeof objNum !== 'number') {
            console.log(`人数类型错误: ${objNum}`)
            return
          }
          theMaxNum = objNum > theMaxNum ? objNum : theMaxNum
        }
        this.maximum = this.handleMaxNum(theMaxNum)
        for (let obj of theList) { // 遍历 编入表格数据
          let thePercent = (obj.num / this.maximum * 100) + '%'
          let theName = obj.positionType
          this.list.push({name: theName, percent: thePercent})
        }
      })
    },
    /**
     * 处理最大值
     */
    handleMaxNum (theMaxNum) {
      let theNum = theMaxNum + 10000
      theNum = parseInt(theNum / 10000) * 10000
      return theNum
    }
  },

  created () {
    this.getData(this.curCity)
  },

  mounted () {},

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  .chart-l1 {
    width: 100%;
    height: 85%;
  }
  .inner {
    height: 100%;
  }
  .chart-box {
    height: 184px;
    width: 430px;
    @include borderBox();
    padding-left: 75px;
    position: relative;
    margin-top: 25px;
    font-size: 14px;
    color: #e3f3f3;
    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }
    li {
      width: 100%;
      height: 17px;
      background-color: rgba(67,186,254,0.25);
      border-radius: 7.5px;
      position: relative;
    }
  }
  .li-inner {
    border-radius: 7.5px;
    height: 100%;
    /*width: 50%;*/
    position: absolute;
    bottom: 0;
    left: 0;
    background: linear-gradient(to right, #51fcc4 , #44bdfc); /* 标准的语法（必须放在最后） */
  }
  .li-name {
    position: absolute;
    bottom: -5px;
    left: -58px;
    width: 50px;
    height: 28px;
    @include defaultFlex;
  }
</style>
