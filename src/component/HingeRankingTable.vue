<template>
  <!--枢纽表格-->
  <div>
    <div class="table-tab-box">
      <ul>
        <li :class="{'active': activeId===index}" v-for="(item,index) in liData" :key="index" @click="clickLi(index)">{{item.name}}</li>
      </ul>
    </div>
    <div class="table-box">
      <table id="table1" class="table">
        <tr :class="{alt: index%2===0}" v-for="(item,index) in numRankList" :key="index">
          <td>{{++index}}</td>
          <td>{{item.city}}</td>
          <td>{{item.positionName}}</td>
          <td>{{item.num}}</td>
          <td>{{item.positionType}}</td>
          <td>{{item.type}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { postData } from '../common/server'

export default {
  data () {
    return {
      numRankList: [], // 枢纽人数列表
      maxNum: 8, // 最多显示条数
      activeId: 0,
      liData: [
        {name: '全部'},
        {name: '客运站'},
        {name: '机场'},
        {name: '火车站'},
        {name: '服务区'},
        {name: '收费站'}
      ],
      theList: null // 请求返回的数组
    }
  },
  props: {
  },

  components: {},

  computed: {},

  methods: {
    /**
     * 获取枢纽人数排行列表
     */
    getPositionNum () {
      const url = 'position/getPositionNum?city=全部市&positionType=全部'
      const data = {}
      postData(url, data).then((res) => {
        console.log(res)
        let len = res.data.length
        this.theList = res.data
        if (len <= 0) {
          console.log(`getPositionNum 没有数据: ${this.theList}`)
          return
        }
        //      debugger
        len = len < this.maxNum ? len : this.maxNum
        for (let i = 0; i < len; i++) {
          this.numRankList.push(this.theList[i])
        }
      })
    },
    /**
     * 点击切换li
     * @param index 索引
     */
    clickLi (index) {
      this.activeId = index
      this.handleData(this.activeId)
    },
    /**
     * 处理数据 把要显示的数据放到数组
     * @param activeId 当前id
     */
    handleData (activeId) {
      this.numRankList = [] // 清空
      const mapObj = {
        0: '全部',
        1: '客运站',
        2: '机场',
        3: '火车站',
        4: '服务区',
        5: '收费站'
      }
      const theKey = mapObj[activeId]
      if (theKey === '全部') {
        this.handleAllList()
      } else {
        this.handleOtherList(theKey)
      }
    },
    /**
     * 当前激活为 全部 的时候 , 处理数组
     */
    handleAllList () {
      let len = this.theList.length
      if (len <= 0) {
        console.log(`getPositionNum 没有数据: ${this.theList}`)
        return
      }
      //      debugger
      len = len < this.maxNum ? len : this.maxNum
      for (let i = 0; i < len; i++) {
        this.numRankList.push(this.theList[i])
      }
    },
    /**
     * 当前激活不是 全部 的时候 , 处理数组
     * @param tab 当前tab
     */
    handleOtherList (tab) {
      let otherList = []
      for (let obj of this.theList) {
        if (obj.positionType === tab) {
          otherList.push(obj)
        }
      }
      let len = otherList.length
      if (len <= 0) {
        console.log(`getPositionNum 没有数据: ${otherList}`)
        return
      }
      //      debugger
      len = len < this.maxNum ? len : this.maxNum
      for (let i = 0; i < len; i++) {
        this.numRankList.push(otherList[i])
      }
    }
  },

  created () {
    this.getPositionNum()
  },

  mounted () {},

  beforeDestroy () {}
}
</script>

<style lang='scss' scoped>
  .table-tab-box {
    padding: 20px 0 7px;
    ul {
      display: flex;
      color: #ffbc3c;
      font-size: 14px;
    }
    li {
      width: 63px;
      height: 24px;
      @include defaultFlex
    }
    li.active {
      background-color: #278bdb;
      color: #ffffff;
      border: none;
      border-radius: 11px;
    }
  }
  .table {
    font-size: 14px;
    color: #e8ebf0;
    width: 100%;
  }
  .table td {
    padding: 5px 10px;
    padding-left: 16px;
    padding-right: 0;
  }
  .table tr.alt td {
    background-color: rgba(1,43,91,0.5);
  }
  .table-box {
    padding-right: 36px;
  }
</style>
