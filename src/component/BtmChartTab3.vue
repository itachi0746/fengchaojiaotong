<template>
  <!--历史客流-->
  <div class="main-top-box">
    <div class="main-top-item">
      <ChartTitle :CTData="CTDataObj1"></ChartTitle>
      <ClearFix></ClearFix>
      <div class="chart-div" ref="chart1"></div>
    </div>
  </div>
</template>

<script>
import ChartTitle from './ChartTitle.vue'
import ClearFix from './ClearFix.vue'
import { utils, postData } from '../common'
import echarts from 'echarts'
export default {
  data () {
    return {
      CTDataObj1: {hasLine: false, iconId: 4, font: '近一个月历史客流趋势'},
      xData: [], // 横坐标数据
      chart1: null,

    }
  },

  components: {
    ChartTitle,
    ClearFix
  },

  computed: {},

  methods: {
    /**
     * 获取枢纽历史客流趋势
     */
    getPositionFlowHistoryTrend () {
      //      const url = `/position/getPositionFlowTrend?positionId=${window.positionId}&countDate=${window.curDate}`
      const url = `/position/getPositionFlowHistoryTrend?positionId=${window.positionId}`
      postData(url, {}).then((res) => {
        console.log(res)
        let arrivalData = []
        let leaveData = []
        let totalData = []
        for (let obj of res.data) {
          let tempArr = obj.dateTime.split('-')
          let day = utils.strDelZero(tempArr[tempArr.length - 1])
          let arrivalItem = [day, obj.arrival]
          let leaveItem = [day, obj.leave]
          let totalItem = [day, obj.num]
          arrivalData.push(arrivalItem)
          leaveData.push(leaveItem)
          totalData.push(totalItem)
        }
        this.initChart1(arrivalData, leaveData, totalData)
      })
    },
    /**
     * 初始化 近一个月历史客流量趋势  图表
     * @param arrivalData 到达旅客 数组
     * @param leaveData 出发旅客 数组
     * @param totalData 总人数 数组
     */
    initChart1 (arrivalData, leaveData, totalData) {
      this.chart1 = echarts.init(this.$refs['chart1'])
      let me = this
      let legend1 = '出发旅客'
      let legend2 = '到达旅客'
      let legend3 = '当日客流总量'
      let option = {
        title: {
          text: '近一个月历史客流量趋势',
          textStyle: {
            color: 'rgb(221,243,255)',
            fontSize: 18,
            fontFamily: 'Microsoft YaHei'
          },
          show: false
        },
        tooltip: { // 提示框样式
          trigger: 'axis',
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          // formatter: "{c}人",
//          formatter: function (params) {
//            //            console.log(params)
//            return params[params.length - 1].data[1] + '人'
//          },
//          backgroundColor: '#065f89',
//          padding: 10,
//          borderColor: '#28eefb',
//          borderWidth: 1,
//          axisPointer: {
//            lineStyle: {
//              color: '#68e5ff'
//            }
//          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          //          name: '时点',
          name: '',
          data: me.xData,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisLabel: { // 横坐标 间隔
            interval: 1
          }
        },
        yAxis: {
          boundaryGap: [0, '50%'],
          type: 'value',
          //          name: '人',
          name: '',
          // 轴 样式
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#ffffff'
            }
          },
          // 分割线
          splitLine: {
            show: true
          }
        },
        legend: { // 图例组件
          data: [legend1, legend2, legend3],
          textStyle: {
            color: 'rgb(255,255,255)',
            fontSize: 15,
            fontFamily: 'Microsoft YaHei'
          }
        },
        series: [
          {
            name: legend1,
            type: 'line',
            smooth: true,
            //            symbol: 'none',
//            stack: 'a',
            label: {
              normal: {
                show: false
              }
            },
            lineStyle: {
              color: '#28eefb'
            },
            data: arrivalData
          },
          {
            name: legend2,
            type: 'line',
            smooth: true,
            //            symbol: 'none',
//            stack: 'a',
            label: {
              normal: {
                show: false
              }
            },
            lineStyle: {
              color: '#38fb89'
            },
            data: leaveData
          },
          {
            name: legend3,
            type: 'line',
            smooth: true,
            //            symbol: 'none',
//            stack: 'a',
            label: {
              normal: {
                show: false
              }
            },
            lineStyle: {
              color: '#fbd567'
            },
            data: totalData
          },
        ]
      }
      this.chart1.setOption(option)
    }
  },

  created () {
    this.xData = []
    for (let i = 1; i < 31; i++) {
      this.xData.push(i)
    }
    this.getPositionFlowHistoryTrend()
  },

  mounted () {},

  beforeDestroy () {
    this.chart1.dispose()
    this.chart1 = null
  }
}
</script>

<style lang='scss' scoped>
  .main-top-item {
    /*width: 33.33%;*/
    width: 100%;
    height: 100%;
    @include borderBox();
    padding-top: 5px;
  }
  .main-top-box {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .chart-div {
    width: 100%;
    height: 220px;
  }
</style>
