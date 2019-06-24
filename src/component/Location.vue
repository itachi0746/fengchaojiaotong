<template>
  <!--地点选择组件-->
  <div class="location-box cp">
    <img class="img1" src="../assert/内容区_地市选择icon.png" alt="">
    <span class="location-name">全部地市</span>
    <img class="img2" src="../assert/内容区_地市选择下拉icon.png" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
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
</style>
