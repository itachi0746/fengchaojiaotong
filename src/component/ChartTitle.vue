<template>
  <!--图表title组件-->
  <div>
    <div class="chart-title">
      <div class="border-rectangle border-rectangle-tl"></div>
      <div class="border-rectangle border-rectangle-tr"></div>
      <div class="border-rectangle border-rectangle-bl"></div>
      <div class="border-rectangle border-rectangle-br"></div>
      <div class="line" v-if="CTData.hasLine"></div>
      <div class="the-icon" :style="{backgroundImage: `url(${iconMap[CTData.iconId]})`}"></div>
      <div>{{CTData.font}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      iconMap: {
        1: require('../assert/icon-anlysic.png'),
        2: require('../assert/icon-list.png'),
      }
    }
  },
  props: {
    CTData: {
      iconId: {
        type: Number,
        default: null
      },
      font: {
        type: String,
        default: null
      },
      hasLine: {
        type: Boolean,
        default: false
      }
    }
  },

  components: {},

  computed: {},

  methods: {},

  created () {},

  mounted () {},

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  .chart-title {
    width: 181px;
    height: 32px;
    position: relative;
    left: 15px;
    display: flex;
    align-items: center;
    color: #f5f6f6;
    font-size: 18px;
    justify-content: center;
    background-color: rgba(12,27,60,0.5);
  }

  .border-rectangle {
    width: 8px;
    height: 8px;
    border-color: #6af6ff;
    position: absolute;
  }

  .border-rectangle-tl {
    border-top: 1px solid $ctbc;
    border-left: 1px solid $ctbc;
    top: 0;
    left: 0;
  }

  .border-rectangle-tr {
    border-top: 1px solid $ctbc;
    border-right: 1px solid $ctbc;
    top: 0;
    right: 0;
  }

  .border-rectangle-bl {
    border-bottom: 1px solid $ctbc;
    border-left: 1px solid $ctbc;
    bottom: 0;
    left: 0;
  }

  .border-rectangle-br {
    border-bottom: 1px solid $ctbc;
    border-right: 1px solid $ctbc;
    bottom: 0;
    right: 0;
  }
  .line {
    width: 3px;
    height: 16px;
    background: url("../assert/内容区_标题通用icon.png") no-repeat;
  }
  .the-icon {
    width: 18px;
    height: 18px;
    margin: 0 5px;
    background-size: 100% 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
