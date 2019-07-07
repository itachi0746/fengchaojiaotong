<template>
  <!--来源去向 省内省外tab-->
  <div class="l-tab">
    <div class="l-tab1 shadow-inset">
      <div class="inner">
        <div :class="['tab-item', {'active': activeId===index}]" v-for="(item,index) in dataObj" :key="index" @click="clickItem1(index)">{{item}}</div>
      </div>
    </div>
    <div class="l-tab2 shadow-inset">
      <div class="inner">
        <div :class="['tab-item2', {'active': activeId2===index}]" v-for="(item,index) in dataObj2" :key="index" @click="clickItem2(index)">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataObj: ['来源', '去向'],
      dataObj2: ['省内', '省外', '境外'],
      activeId: 0,
      activeId2: 0
    }
  },

  components: {},

  computed: {},

  methods: {
    clickItem2 (index) {
      this.activeId2 = index
    },
    clickItem1 (index) {
      this.activeId = index
    }
  },

  created () {},

  mounted () {},

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
.l-tab {
  position: absolute;
  top: 26px;
  /*left: 252px;*/
  left: 510px;
  z-index: 10;
  /*background: rgba(47, 165, 255, 0.3);*/
  font-size: 22px;
  color: #dfe5ea;
  /*width: 198px;*/
  height: 40px;
  display: flex;
}
  .l-tab1 {
    width: 196px;
    height: 100%;
    margin-right: 16px;
    background-color: #2a91e8;
    padding: 5px;
    @include borderBox()
  }
  .l-tab2 {
    width: 280px;
    height: 100%;
    background-color: #2a91e8;
    padding: 5px;
    @include borderBox()

  }
  .tab-item {
    width: 50%;
    height: 100%;
    @include defaultFlex;
    border-radius: 5px;
  }
  .tab-item2 {
    width: 33.33%;
    height: 100%;
    @include defaultFlex;
    border-radius: 5px;
  }
  .tab-item.active {
    background-color: #1f3ce8;
  }
  .tab-item2.active {
    background-color: #1f3ce8;
  }
  .inner {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>
