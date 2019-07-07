<template>
  <div>
    <!--底部图表-->
    <div class="BtmChartBox cd" v-if="activeId!==2">
      <div class="bc-tab-box">
        <div :class="['bc-tab', 'cp', {'active': activeTab===0}]" @click="clickLTab(0)">
          实时监测
        </div>
        <div :class="['bc-tab', 'cp', {'active': activeTab===1}]" @click="clickLTab(1)">
          历史分析
        </div>
      </div>
      <div class="bc-main">
        <div class="main-top">
          <!--客流监测-->
          <BtmChartTab1 v-if="activeTab===0 && activeId===0"></BtmChartTab1>
          <!--人群画像-->
          <BtmChartTab2 v-if="activeTab===0 && activeId===1"></BtmChartTab2>
          <!--历史客流-->
          <BtmChartTab3 v-if="activeTab===1 && activeId===0"></BtmChartTab3>
          <!--来源去向 todo-->
          <!--历史画像-->
          <BtmChartTab4 v-if="activeTab===1 && activeId===1"></BtmChartTab4>
        </div>
        <div class="main-btm">
          <div class="main-btm-inner">
            <div class="points">
              <div class="point"></div>
              <div class="point"></div>
              <div class="point"></div>
            </div>
            <div :class="['btm-tab', 'cp', {'active': activeId===index}]" v-for="(item,index) in dataObj" :key="index"
                 @click="clickTab(index)">{{item.name}}
            </div>
            <div class="points">
              <div class="point"></div>
              <div class="point"></div>
              <div class="point"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--另一个底部-->
    <div class="btm2" v-if="activeTab===1 && activeId===2">
      <div class="main-btm2">
        <div class="main-btm-inner">
          <div class="points">
            <div class="point"></div>
            <div class="point"></div>
            <div class="point"></div>
          </div>
          <div :class="['btm-tab', 'cp', {'active': activeId===index}]" v-for="(item,index) in dataObj" :key="index"
               @click="clickTab(index)">{{item.name}}
          </div>
          <div class="points">
            <div class="point"></div>
            <div class="point"></div>
            <div class="point"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import BtmChartTab1 from './BtmChartTab1.vue'
import BtmChartTab2 from './BtmChartTab2.vue'
import BtmChartTab3 from './BtmChartTab3.vue'
import BtmChartTab4 from './BtmChartTab4.vue'
export default {
  data () {
    return {
      dataObj1: [
        {name: '客流监测'},
        {name: '人群画像'}
      ],
      dataObj2: [
        {name: '客流监测'},
        {name: '人群画像'},
        {name: '来源去向'}
      ],
      dataObj: null, // 要显示的
      activeId: 0, // 底部tab
      activeTab: 0 // 当前显示的tab(左tab)
    }
  },
  props: {
  },
  components: {
    BtmChartTab1,
    BtmChartTab2,
    BtmChartTab3,
    BtmChartTab4
  },

  computed: {},

  methods: {
    /**
     * 点击下面的tab
     * @param i
     */
    clickTab (i) {
      this.activeId = i
      if (i === 1 && this.activeTab === 2) { // 点击的是来源去向
        this.$emit('showLaiyuan', true)
      } else {
        this.$emit('showLaiyuan', false)
      }
    },
    /**
     * 点击左边的tab
     * @param i
     */
    clickLTab (i) {
      i === 0 ? this.dataObj = this.dataObj1 : this.dataObj = this.dataObj2
      this.activeTab = i
      this.activeId = 0 // 重置为0
    }
  },

  created () {},

  mounted () {
    this.dataObj = this.dataObj1
  },

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  .BtmChartBox {
    /*height: 346px;*/
    height: 306px;
    width: 100%;
    background: rgba(0,0,0,0.5);
    position: absolute;
    z-index: 1001;
    bottom: 0;
    left: 0;
    display: flex;
  }
  .btm2 {
    /*height: 346px;*/
    height: 100px;
    width: 100%;
    /*background: rgba(0,0,0,0.5);*/
    background: url("../assert/btm2bg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    z-index: 1001;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bc-tab-box {
    /*width: 50px;*/
    width: 2.6%;
    height: 100%;
    font-size: 20px;
    color: #021324;
  }
  .bc-tab {
    height: 50%;
    background-color: #6fadeb;
    @include borderBox();
    padding: 0 15px;
    display: flex;
    align-items: center;
  }
  .bc-tab.active {
    height: 50%;
    background-color: #065db3;
    color: #ffffff;
  }
  .bc-main {
    width: 97.4%;
  }
  .btm-tab {
    width: 127px;
    height: 50px;
    background: url("../assert/底部导航栏_正常.png") no-repeat;
    background-size: 100% 100%;
    @include defaultFlex;
    margin: 0 18px;
  }
  .points {
    width: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .point {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #b2b9d4;
    margin: 0 6px;
  }
  .btm-tab.active {
    background: url("../assert/底部导航栏_选中.png") no-repeat;
    background-size: 100% 100%;
    color: #e8eef0;
  }
  .main-top {
    height: 83%;
  }
  .main-btm {
    /*height: 50px;*/
    height: 17%;
    @include defaultFlex;
    font-size: 18px;
    color: #88c3ff;
  }
  .main-btm2 {
    margin-top: 20px;
    height: 50px;
    /*height: 100%;*/
    @include defaultFlex;
    font-size: 18px;
    color: #88c3ff;
  }
  .main-btm-inner {
    display: flex;
    justify-content: center;
  }

</style>
