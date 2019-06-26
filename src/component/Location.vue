<template>
  <!--地点选择组件-->
  <div class="location-box cp" @click.stop="clickBox">
    <img class="img1" src="../assert/内容区_地市选择icon.png" alt="">
    <span class="location-name">{{curLocation.name}}</span>
    <img class="img2" src="../assert/内容区_地市选择下拉icon.png" alt="">
    <div class="loc-list" v-if="showList">
      <ul>
        <li v-for="(item,index) in posList" :key="index" @click.stop="clickLi(item.name, item.adcode)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {postData} from '../common'
import {theCityData} from '../common/mapData'
export default {
  data () {
    return {
      showList: false, // 显示列表的开关
      posList: null, // 地点列表
      curLocation: {name: '全部地市', adcode: ''},
      resData: null // 请求返回的数据
    }
  },

  components: {},

  computed: {},

  methods: {
    /**
     * 点击显示/隐藏 地点
     */
    clickBox () {
      this.showList = !this.showList
    },
    getData () {
      const url = 'position/getPositionInfoList'
      const data = {}
      postData(url, data).then((res) => {
        console.log(res)
        this.resData = res.data
      })
    },
    /**
     * 点击li
     * @param name 地点名字
     * @param adcode 行政号
     */
    clickLi (name, adcode) {
      this.curLocation = {name: name, adcode: adcode}
      this.showList = false
      this.$emit('changeLocation', this.curLocation)
    }
  },

  created () {
    this.getData()
  },

  mounted () {
    this.posList = theCityData
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
    @include borderBox();
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
    li {
      width: 285px;
      height: 40px;
      @include borderBox();
      padding: 6px 0 0 48px;
    }
    li:hover {
      background: rgb(113, 196, 255);
    }
  }
</style>
