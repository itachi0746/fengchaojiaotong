<template>
  <div>
    <!--来源去向table-->
    <div class="laiyuan-box">
      <div class="l-table">
        <table id="table1" class="table1" v-if="table1Data.length">
          <thead>
            <tr>
              <th>排行</th>
              <th>{{tableType}}</th>
              <th>人数</th>
              <th>占比</th>
            </tr>
          </thead>
          <tr :class="{alt: index%2===0}" v-for="(item,index) in table1Data" :key="index">
            <td>{{rankStartNum+index}}</td>
            <td>{{item[keyType]}}</td>
            <td>{{item.num}}</td>
            <td>{{item.ratio}}%</td>
          </tr>
        </table>
      </div>
      <div class="pagination-box">
        <div class="p-btn pre-box" @click="clickPre"></div>
        <div class="num-box">
          <span>{{curPage}}</span>
          <span>/{{totalPage}}</span>
        </div>
        <div class="p-btn next-box" @click="clickNext"></div>
      </div>
    </div>
    <!--切换tab-->
    <!--来源去向 省内省外tab-->
    <div class="l-tab">
      <div class="l-tab1 shadow-inset">
        <div class="inner">
          <div :class="['tab-item', {'active': activeId===index}]" v-for="(item,index) in dataObj" :key="index" @click="clickItem1(index,item)">{{item}}</div>
        </div>
      </div>
      <div class="l-tab2 shadow-inset">
        <div class="inner">
          <div :class="['tab-item2', {'active': activeId2===index}]" v-for="(item,index) in dataObj2" :key="index" @click="clickItem2(index,item.scope)">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {utils, postData} from '../common'
export default {
  data () {
    return {
      dataObj: ['来源', '去向'],
      dataObj2: [
        {name: '省内', scope: '1'},
        {name: '省外', scope: '2'},
        {name: '境外', scope: '3'}
      ],
      activeId: 0,
      activeId2: 0,
      table1Data: [], // 显示的数据  10条
      curPage: 1, // 当前页
      totalPage: 1, // 总页数
      scope: '1', // 默认范围 省内
      type: '来源', // 默认 显示 来源
      resData: null, // 请求返回的数组
      tableType: null, // 来源地 还是 去向地
      keyType: null, // 字段 origin 还是 leave
      rankStartNum: 1, // 排名 开始的数字
      lineArr: [] // 画线的数组
    }
  },

  components: {
  },
  props: {
    curDate: { // 日历当前日期
      type: String,
      default: null
    },
    positionId: { // 当前地点id
      type: String,
      default: null
    }
  },
  computed: {},
  watch: {
    curPage (newVal, oldVal) {
      this.handleTableData()
    },
    curDate (newVal, oldVal) {
      this.getPositionOriginAndLeave()
    },
    positionId (newVal, oldVal) {
      this.getPositionOriginAndLeave()
    }
  },

  methods: {
    // 点击 省内省外境外
    clickItem2 (index, scope) {
      this.activeId2 = index
      this.scope = scope
      this.getPositionOriginAndLeave()
    },
    // 点击来源去向tab
    clickItem1 (index, item) {
      this.activeId = index
      this.type = item
      this.tableType = this.type === '来源' ? '来源地' : '去向地'
      this.keyType = this.type === '来源' ? 'origin' : 'leave'
      this.getPositionOriginAndLeave()
    },
    /**
     * 获取枢纽来源去向（scope：0市内，1省内，2省外，3境外）
     */
    getPositionOriginAndLeave () {
      this.resData = null
      this.table1Data = []
      const url = `position/getPositionOriginAndLeave?positionId=${window.positionId}&type=${this.type}&scope=${this.scope}&countDate=${window.curDate}`
      const data = {}
      postData(url, data).then((res) => {
        console.log(res)
        const theKey = this.type === '来源' ? 'positionOriginList' : 'positionLeaveList'
//        for (let i = 0; i < 30; i++) { // 测试
//          res.data[theKey].push(res.data[theKey][0])
//        }
        this.resData = res.data[theKey]
        this.handleTableData()
        this.lineArr = this.handleResData()
        if (!this.lineArr.length) {
          console.log('来源去向: 没有画线数据')
//          return
        }
        this.$emit('drawLine', {items: this.lineArr, name: '', scope: this.scope}) // 发起画线事件
      })
    },
    /**
     * 处理表格数据
     */
    handleTableData () {
      const total = 10 // 显示最多10条
      const pageNum = this.curPage // 当前页
      const startIndex = (pageNum - 1) * 10 // 开始的索引,例如第一页, 就是0
      this.rankStartNum = startIndex + 1
      let endIndex = startIndex + total // 结束索引,例如第一页, 就是10
      this.totalPage = Math.ceil(this.resData.length / total) // 总页数,向上取整ceil
      if (this.resData.length < 10) { // 如果数据少于10条, 结束索引=条数
        endIndex = this.resData.length
      }
      this.table1Data = []
      for (let i = startIndex; i < endIndex; i++) {
        let obj = this.resData[i]
        if (obj) { // 判断一下 , 去掉undefined的情况
          this.table1Data.push(obj)
        }
      }
    },
    /**
     * 点击下一页
     */
    clickNext () {
      this.curPage = this.curPage < this.totalPage ? ++this.curPage : this.totalPage
    },
    /**
     * 点击上一页
     */
    clickPre () {
      this.curPage = this.curPage <= 1 ? 1 : --this.curPage
    },
    /**
     * 获得枢纽所在的城市
     *  返回城市名
     */
    getHingeCity () {
      const theId = this.positionId
      let theCity = null
      for (let obj of window.positionInfoList) {
        if (theId === obj.positionId) {
          theCity = obj.city
          break
        }
      }
      if (!theCity) {
        console.log(`没有找到positionId对应的城市: ${theId}`)
      }
      return theCity
    },
    /**
     * 处理要画线的数据
     */
    handleResData () {
      const theCity = this.getHingeCity()
      let lineArr = [] // 画线的数组
      let me = this
      let lineObj = {}
      for (let obj of this.resData) {
        if (me.keyType === 'leave') {
          lineObj = {
            from: theCity, // 出发城市
            to: obj[me.keyType], // 到达城市
            value: obj.num // 人数
          }
        } else {
          lineObj = {
            to: theCity, // 出发城市
            from: obj[me.keyType], // 到达城市
            value: obj.num // 人数
          }
        }
        lineArr.push(lineObj)
      }
      return lineArr
    }
  },

  created () {
    this.tableType = this.type === '来源' ? '来源地' : '去向地'
    this.keyType = this.type === '来源' ? 'origin' : 'leave'

    this.getPositionOriginAndLeave()
  },

  mounted () {},

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
.laiyuan-box {
  position: absolute;
  right: 13px;
  /*top: 170px;*/
  /*top: 130px;*/
  top: 70px;
  z-index: 1001;
  /*width: 682px;*/
  width: 592px;

}
  .l-table {
    width: 100%;
    /*height: 748px;*/
    height: 648px;
    background: url("../assert/内容区数据背景框.png") no-repeat;
    background-size: 100% 100%;
    padding: 28px;
    @include borderBox()
  }
  .pagination-box {
    width: 100%;
    height: 40px;
    @include defaultFlex;
    margin-top: 5px;
  }
  .table1 {
    width: 100%;
    /*height: 100%;*/
    font-size: 16px;
    color: #def1ff;
    thead {
      color: #15fffc;
      font-size: 20px;
      border-bottom: 1px solid #ffffff;
    }
    td {
      text-align: center;
    }
    tr {
      height: 52px;
    }
    thead tr {
      height: 50px;
    }
  }
  .table1 tr.alt td {
    background-color: rgba(12,27,60,0.4);
  }
  .p-btn {
    width: 84px;
    height: 100%;
  }
  .pre-box {
    background: url("../assert/内容区-页数选择.png") no-repeat;
    background-size: 100% 100%;
  }
  .next-box {
    background: url("../assert/内容区-页数选择-下一页.png") no-repeat;
    background-size: 100% 100%;
  }
  .num-box {
    width: 120px;
    height: 100%;
    font-size: 18px;
    @include defaultFlex;
  }
  .num-box span:nth-child(1) {
    color: #def1ff;
  }
  .num-box span:nth-child(2) {
    color: #021c2f;
  }
.l-tab {
  position: absolute;
  top: 26px;
  /*left: 252px;*/
  left: 525px;
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
  padding: 3px;
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
  background-color: #054881;
}
.tab-item2.active {
  background-color: #054881;
}
.inner {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
