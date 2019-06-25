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
        <tr :class="{alt: index%2===0}" v-for="(item,index) in warningList" :key="index">
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
export default {
  data () {
    return {
      warningList: [], // 预警枢纽列表
      maxNum: 8, // 最多显示条数
      activeId: 0,
      liData: [
        {name: '全部'},
        {name: '轻度'},
        {name: '中度'},
        {name: '重度'}
      ],
      typeObj: { // 拥挤程度对象
        'warningList_yz': '重度',
        'warningList_zd': '中度',
        'warningList_qd': '轻度',
        'warningList_ss': '舒适'
      }
    }
  },
  props: {
    tableData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  components: {},

  computed: {},

  methods: {
    /**
     * 当前激活tab为全部时
     */
    calWarningList () {
      this.warningList = [] // 清空
      const theArr = ['warningList_yz', 'warningList_zd', 'warningList_qd', 'warningList_ss'] // 注意排序 从严重到舒适
      let theList = []
      for (let item of theArr) {
        let type = this.typeObj[item] // 拥挤程度
        for (let obj of this.tableData[item]) {
          obj['type'] = type
        }
        theList = theList.concat(this.tableData[item])
      }
      let len = theList.length
      if (len <= 0) {
        console.log(`tableData没有数据: ${theList}`)
        return
      }
      //      debugger
      len = len < this.maxNum ? len : this.maxNum
      for (let i = 0; i < len; i++) {
        this.warningList.push(theList[i])
      }
    },
    /**
     * 点击切换li
     * @param index 索引
     */
    clickLi (index) {
      this.activeId = index
      if (this.activeId === 0) {
        this.calWarningList()
      } else {
        this.calWarningList2()
      }
    },
    /**
     * 当前激活tab不是全部时
     */
    calWarningList2 () {
      this.warningList = [] // 清空
      const mapObj = {
        1: 'warningList_qd',
        2: 'warningList_zd',
        3: 'warningList_yz'
      }
      const theKey = mapObj[this.activeId]
      let theList = this.tableData[theKey]
      let len = theList.length
      if (len <= 0) {
        console.log(`tableData没有数据: ${theList}`)
        return
      }
      //      debugger
      len = len < this.maxNum ? len : this.maxNum
      for (let i = 0; i < len; i++) {
        this.warningList.push(theList[i])
      }
    }
  },

  created () {},

  mounted () {
    this.calWarningList()
  },

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
