<template>
  <!--城市人数分析表格-->
  <div>
    <div class="table-box-outer">
      <div class="table-inner" ref="table-inner">
        <!--线背景-->
        <div class="line-bg" ref="line-bg">
          <div class="line" v-for="(item,index) in lineNum" :key="index">
              <span>
                <i>{{(maximum / lineNum) * (lineNum - index - 1)}}</i>
              </span>
          </div>
        </div>
        <div class="the-table">
          <div class="table-main" ref="table-main">
            <ul>
              <li :style="{height: tableLiHeight + 'px'}" v-for="item in 10" :key="item">
                <div class="li-inner"></div>
                <div class="li-name">广州</div>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { utils } from '../common'

export default {
  data () {
    return {
      maximum: 2000, // 表的纵坐标最大值
      lineNum: 10, // 背景线的数量
      tableLiHeight: null // li的高度
    }
  },

  components: {},

  computed: {},

  methods: {
    /**
     * 设置table-main的高度
     */
    setHeight () {
      const theHeight = this.$refs['table-inner'].offsetHeight
      this.tableLiHeight = theHeight
//      this.$refs['table-main'].style.height = theHeight + 'px'
//      this.$refs['table-li'].style.height = theHeight + 'px'
    }
  },

  created () {},

  mounted () {
    utils.hasSetRem(this.setHeight)
  },

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  .table-box-outer {
    height: 256px;
    width: 363px;
    /*padding: 34px 0px 20px 63px;*/
    padding: 4px 0px 20px 63px;
    position: relative;
    /*background-color: #fff;*/
    color: #e3f3f3;
    font-size: 14px;
  }
  .table-inner {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .the-table {
    width: 100%;
    height: 115%;
    position: absolute;
    top: 0;
    left: 0;
    overflow-x: auto;
  }
  .the-table::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/
    /*width:10px;*/
    height:10px;
  }
  .the-table::-webkit-scrollbar-button{/*滚动条两端的按钮，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置2）*/
    background:#74D334;
    display: none;
  }
  .the-table::-webkit-scrollbar-track{/*外层轨道，可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果（位置3）*/
    background:#48566f;
  }
  .the-table::-webkit-scrollbar-track-piece{/*内层轨道，滚动条中间部分（位置4）*/
    background:#48566f;
  }
  .the-table::-webkit-scrollbar-thumb{/*滚动条里面可以拖动的那部分（位置5）*/
    background:#b3baca;
    border-radius:5px;
  }
  .the-table::-webkit-scrollbar-corner {/*边角（位置6）*/
    background:#82AFFF;
  }
  .the-table::-webkit-scrollbar-resizer  {/*定义右下角拖动块的样式（位置7）*/
    background:#FF0BEE;
    display: none;
  }
  .the-table {
    scrollbar-arrow-color: #f4ae21; /**//*三角箭头的颜色*/
    scrollbar-face-color: #333; /**//*立体滚动条的颜色*/
    scrollbar-3dlight-color: #666; /**//*立体滚动条亮边的颜色*/
    scrollbar-highlight-color: #666; /**//*滚动条空白部分的颜色*/
    scrollbar-shadow-color: #999; /**//*立体滚动条阴影的颜色*/
    scrollbar-darkshadow-color: #666; /**//*立体滚动条强阴影的颜色*/
    scrollbar-track-color: #666; /**//*立体滚动条背景颜色*/
    scrollbar-base-color:#f8f8f8; /**//*滚动条的基本颜色*/
  }
  .line {
    width: 100%;
    height: 2px;
    background-color: rgba(255,255,255,0.15);
    position: relative;
    span {
      position: absolute;
      left: -50px;
      top: -10px;
      text-align: right;
      width: 40px;
      height: 20px;
      line-height: 20px;
    }
  }
  .line-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .table-main {

    ul {
      width: 10000px;
    }
    li {
      height: 100px;
      width: 15px;
      background-color: rgba(67,186,254,0.25);
      margin-right: 31px;
      margin-left: 10px;
      position: relative;
      border-radius: 7.5px;
      float: left;
    }
    .li-name {
      position: absolute;
      bottom: -25px;
      right: -15px;
      width: 47px;
      height: 28px;
      @include defaultFlex;
    }
    .li-inner {
      background-color: #43bafe;
      border-radius: 7.5px;
      width: 100%;
      height: 50%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
</style>
