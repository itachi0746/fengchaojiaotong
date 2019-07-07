<template>
  <!--来源去向组件-->
  <div class="laiyuan-box">
    <div class="l-table">
      <table id="table1" class="table1">
        <thead>
          <tr>
            <th>排行</th>
            <th>来源</th>
            <th>人数</th>
            <th>占比</th>
          </tr>
        </thead>
        <tr :class="{alt: index%2===0}" v-for="(item,index) in table1Data" :key="index">
          <td>{{++index}}</td>
          <td>{{item.name}}</td>
          <td>{{item.num}}</td>
          <td>{{item.zb}}</td>
        </tr>
      </table>
    </div>
    <div class="pagination-box"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      table1Data: [
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
        {name: '广东省', num: 2000, zb: '10%'},
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
.laiyuan-box {
  position: absolute;
  right: 20px;
  /*top: 170px;*/
  top: 130px;
  z-index: 1001;
  /*width: 682px;*/
  width: 632px;

}
  .l-table {
    width: 100%;
    /*height: 748px;*/
    height: 688px;
    background: url("../assert/内容区数据背景框.png") no-repeat;
    background-size: 100% 100%;
    padding: 28px;
  }
  .pagination-box {
    width: 100%;
    height: 40px;
  }
  .table1 {
    width: 100%;
    height: 100%;
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
  }
.table1 tr.alt td {
  background-color: rgba(12,27,60,0.5);
}
</style>
