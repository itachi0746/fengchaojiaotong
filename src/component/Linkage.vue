<template>
    <!--预警联动 组件-->
    <div class="linkage">
      <div class="linkage-inner cp" @click="clickLink">
        <img src="../assert/预警icon.png" alt="">
        <span>预警联动</span>
      </div>
      <div class="msg-box" v-if="showBox">
        <div class="inner-msg-box">
          <div class="title">重度预警通知</div>
          <ul>
            <li :class="{'active': activeId===index}" v-for="(item,index) in liData" :key="index" @click="clickLi(index)">
              <div class="li-div">{{item.name}}</div>
            </li>
          </ul>
          <div class="receiver">
            <div class="r-left">接收人:</div>
            <div class="r-sel"></div>
          </div>
          <div class="btm-box">
            <div class="b-left">通知内容:</div>
            <div class="b-sel"></div>
          </div>
          <div class="action-box">
            <div class="the-btn close" @click="clickClose">关闭</div>
            <div class="the-btn">发送</div>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      liData: [
        {name: '短信通知'},
        {name: '语音通知'},
        {name: '视频通知'}
      ],
      activeId: 0,
      showBox: false // 显示联动box
    }
  },

  components: {},

  computed: {},

  methods: {
    clickLi (index) {
      this.activeId = index
    },
    clickLink () {
      this.showBox = !this.showBox
    },
    clickClose () {
      this.showBox = false
    }
  },

  created () {},

  mounted () {},

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
.linkage {
  position: absolute;
  /*top: 234px;*/
  top: 214px;
  left: 13px;
  width: 167px;
  height: 60px;
  background: url("../assert/预警联动_背景框.png") no-repeat;
  background-size: 100% 100%;
  font-size: 20px;
  color: #ffffff;
  img {
    margin-right: 10px;
  }
}
  .linkage-inner {
    width: 100%;
    height: 100%;
    @include defaultFlex;
  }

  .msg-box {
    /*width: 873px;*/
    /*height: 407px;*/
    width: 800px;
    height: 370px;
    background: url("../assert/linkageBG.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 190px;
    top: 0;
    font-size: 18px;
    color: #051538;
  }

  .inner-msg-box {
    padding-left: 19px;
  }
  .title {
    font-size: 24px;
    color: #150106;
    font-weight: bold;
    padding: 13px 0px;
    text-align: center;
  }
  ul {
    display: flex;
    font-size: 20px;
    justify-content: space-between;
  }
  li {
    width: 33.33%;
    height: 55px;
    @include defaultFlex;
    background-color: rgba(44,91,197,0.7);
  }
  .li-div {
    padding: 8px 4px;
    text-align: center;
  }
  li.active {
    background-color: rgba(47,59,181,0.8);
  }
  li.active .li-div {
    border-bottom: 3px solid #ffffff;
    color: #ffffff;
  }
  .receiver {
    margin-top: 17px;
    display: flex;
  }
  .btm-box {
    margin-top: 17px;
    display: flex;
  }
  .r-left {
    width: 96px;
    height: 45px;
    line-height: 45px;
    @include borderBox();
    padding-right: 10px;
    text-align: right;
  }
  .r-sel {
    background-color: rgba(255,255,255,0.5);
    border-radius: 5px;
    width: 630px;
    height: 45px;
  }

  .b-left {
    width: 96px;
    height: 45px;
    line-height: 45px;
    @include borderBox();
    padding-right: 10px;
    text-align: right;
  }
  .b-sel {
    background-color: rgba(255,255,255,0.5);
    border-radius: 5px;
    width: 630px;
    height: 116px;
  }
.the-btn {
  width: 84px;
  height: 35px;
  border-radius: 5px;
  @include defaultFlex;
  background-color: #24be3a;
}
  .close {
    color: #ffffff;
    margin-right: 35px;
    background-color: #be8624;
  }
  .action-box {
    padding: 15px 54px 15px 0;
    display: flex;
    justify-content: flex-end;
  }
</style>
