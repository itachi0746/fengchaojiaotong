<template>
  <!--枢纽表格-->
  <div>
    <div class="table-tab-box">
      <ul>
        <li class="active">全部</li>
        <li>轻度</li>
        <li>中度</li>
        <li>轻度</li>
      </ul>
    </div>
    <div class="table-box">
      <table id="table1" class="table">
        <tr :class="{alt: index%2===0}" v-for="(item,index) in tableData" :key="index">
          <td v-if="item.index">{{item.index}}</td>
          <td>{{item.name}}</td>
          <td>{{item.hinge}}</td>
          <td>{{item.number}}</td>
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
      tableData: [
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
        {
          //          index: 1,
          name: '广州',
          hinge: '广州南站',
          number: '3万',
          type: '重度'
        },
      ]
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
