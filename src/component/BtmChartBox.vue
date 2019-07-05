<template>
  <!--底部图表-->
  <div class="BtmChartBox cd">
    <div class="bc-tab-box">
      <div class="bc-tab active">
        实时监测
      </div>
      <div class="bc-tab">
        历史分析
      </div>
    </div>
    <div class="bc-main">
      <div class="main-top">
        <!--实时监测-->
        <div class="main-top-box">
          <div class="main-top-item"></div>
          <div class="main-top-item"></div>
          <div class="main-top-item"></div>
        </div>
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
</template>

<script>
export default {
  data () {
    return {
      dataObj: [
        {name: '实时监测'},
        {name: '来源去向'},
        {name: '人群画像'}
      ],
      activeId: 0
    }
  },

  components: {},

  computed: {},

  methods: {
    clickTab (i) {
      this.activeId = i
    }
  },

  created () {},

  mounted () {},

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
  .main-btm-inner {
    display: flex;
    justify-content: center;
  }
  .main-top-item {
    width: 33.33%;
    height: 100%;
  }
  .main-top-box {
    width: 100%;
    height: 100%;
    display: flex;

  }
</style>
