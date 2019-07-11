<template>
  <!--地点选择组件-->
  <div class="location-box cp" @click.stop="clickBox">
    <img class="img1" src="../assert/内容区_地市选择icon.png" alt="">
    <span class="location-name">{{theLocation.name}}</span>
    <img class="img2" src="../assert/内容区_地市选择下拉icon.png" alt="">
    <div class="loc-list" v-if="showList">
      <ul>
        <li v-for="(item,index) in posList" :key="index" @click.stop="clickLi(item[theKey], item.adcode)">{{item[theKey]}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {theCityData} from '../common/mapData'
export default {
  data () {
    return {
      showList: false, // 显示列表的开关
      posList: null, // 地点列表
//      curLocation: {name: '全部市', adcode: 440000},
      theLocation: null,
      theKey: 'name'
    }
  },

  components: {},
  props: {
    curLocation: {
      type: Object,
      default: null
    },
    mapStatus: { // 地图状态
      type: Number,
      default: null
    }
  },
  watch: {
    curLocation (newVal, oldVal) {
      this.theLocation = newVal
    },
    mapStatus (newVal, oldVal) {
      if (newVal === 1) {
        this.posList = theCityData
//        this.theKey = 'name'
      } else if (newVal === 2) {
        this.posList = this.getCityHinge()
        try {
//          debugger

//          let theName = getDefaultCity()
//          this.theLocation = {name: theName, adcode: ''}
        } catch (err) {
          console.log(err)
        }
//        this.theKey = 'positionName'
      }
    }
  },

  computed: {},

  methods: {
    /**
     * 点击显示/隐藏 地点
     */
    clickBox () {
      this.showList = !this.showList
    },
    /**
     * 点击li
     * @param name 地点名字
     * @param adcode 行政号
     */
    clickLi (name, adcode) {
      debugger
      this.theLocation = {name: name, adcode: adcode}
      this.showList = false
      this.$emit('changeLocation', this.theLocation)
    },
    /**
     * 获取城市列表
     */
    getCityList () {
      const moduleName = '实时交通监测'
      let theList = getCitys(moduleName)
//      debugger
      if (!theList.length) {
        console.log('没有城市列表')
        return
      }
//      console.log(theList)
      let positionArr = []
      for (let item of theList) {
        for (let obj of theCityData) {
          if (item === obj.name) {
            positionArr.push(obj)
            break
          }
        }
//        positionArr.push({name: item})
      }
      return positionArr
    },
    /**
     * 获取城市的枢纽点数据
     */
    getCityHinge () {
      const theName = this.curLocation.name
      let me = this
      let theKey = me.theKey
      let theArr = []
      for (let obj of window.positionInfoList) {
        if (obj.city === theName) {
          let theObj = {}
          theObj[theKey] = obj.positionName
          theObj['adcode'] = ''
          theArr.push(theObj) // 枢纽点没有adcode
        }
      }
      return theArr
    }
  },

  created () {
    this.theLocation = this.curLocation
    this.posList = this.getCityList()
  },

  mounted () {
//    this.posList = theCityData
  },

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  .location-box {
    position: absolute;
    top: 26px * 1;
    left: 11px;
    /*margin: 26px 0 0 11px;*/
    width: 285px;
    height: 40px;
    background: rgba(47, 165, 255, 0.3);
    font-size: 22px;
    color: #dfe5ea;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 10;
    /*padding: 0 22px 0 14px;*/
  }
  .location-name {
    margin-left: 16px;
    position: absolute;
    left: 28px;
    top: 4px;
  }
  .img1 {
    position: absolute;
    left: 14px;
    top: 10px;
  }
  .img2 {
    position: absolute;
    right: 22px;
    top: 14px;
  }
  .loc-list {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
    background: rgba(47, 165, 255, 1);

  }
  .loc-list li {
    width: 285px;
    height: 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 6px 0 0 48px;
  }
  .loc-list li:hover {
    background: rgb(113, 196, 255);
  }
</style>
