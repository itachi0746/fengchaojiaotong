<template>
  <!--底部-->
  <div class="btm-box cd">
    <div :class="['btm-tab', 'cp', {'active': activeId===index}]" v-for="(item,index) in dataObj" :key="index"
         @click="clickTab(index)">{{item.name}}
    </div>
    <div class="switch-box">
      <el-switch
        v-model="value"
        active-color="#ffcd2e"
        inactive-color="#d5d5d5">
      </el-switch>
      <span>显示枢纽名称</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeId: 0,
      dataObj: [
        {name: '全部'},
        {name: '交通枢纽'},
        {name: '服务区'},
        {name: '收费站'}
      ],
      value: true // 显示枢纽名称开关
    }
  },

  components: {},
  watch: {
    value (newVal, oldVal) {
      this.$emit('showHingeName', newVal)
    }
  },
  computed: {},

  methods: {
    clickTab (i) {
      this.activeId = i
      this.$emit('changeHingePart', i)
    }
  },

  created () {},

  mounted () {},

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  /*底部*/
  .btm-box {
    position: absolute;
    bottom: 30px;
    left: 640px;
    width: 770px;
    height: 50px;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #88c3ff;
    font-size: 18px;
  }

  .btm-tab {
    width: 127px;
    height: 50px;
    background: url("../assert/底部导航栏_正常.png") no-repeat;
    background-size: 100% 100%;
    @include defaultFlex;
  }

  .btm-tab.active {
    background: url("../assert/底部导航栏_选中.png") no-repeat;
    background-size: 100% 100%;
    color: #e8eef0;
  }

  .switch-box {
    display: flex;
    align-items: center;
    position: relative;
    left: -10px;
    color: #ffffff;
  }
</style>
