<template>
  <div>
    <!--日历组件-->
    <div class="cal cp">
      <div class="inner-box">
        <span>{{value1}}</span>
        <img class="icon1" src="../assert/calender.png" alt="">
      </div>
      <div class="calender">
        <el-date-picker
          v-model="value1"
          :type="calType"
          :value-format="formatVal"
          placeholder="选择日期">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      theDate: '2019-05-05',
      value1: '',
      calType: 'date', // month/date 月/具体日期
      formatVal: 'yyyy-MM-dd' // yyyy-MM 月格式
    }
  },

  components: {},

  computed: {},

  methods: {
    setDate () {
      let st = new Date()
      let nowYear = st.getFullYear()
      let nowMonth = st.getMonth() + 1
      let nowDay = st.getDate()
      this.value1 = nowYear + '-' + this.add0(nowMonth) + '-' + this.add0(nowDay)
    },
    add0 (m) {
      return m < 10 ? '0' + m : m
    }
  },

  created () {},

  mounted () {
    this.setDate()
  },

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  .cal {
    position: absolute;
    top: 26px;
    /*left: 252px;*/
    left: 312px;
    z-index: 10;
    background: rgba(47, 165, 255, 0.3);
    font-size: 22px;
    color: #dfe5ea;
    width: 198px;
    height: 40px;
  }

  .calender {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .inner-box {
    width: 100%;
    height: 100%;
    line-height: 40px;
    text-align: center;
    display: flex;
    justify-content: space-around;
    align-items: center;

  }
  .inner-box span {
    width: 140px;
  }

</style>
