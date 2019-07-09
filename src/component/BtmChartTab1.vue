<template>
  <!--客流监测-->
  <div class="main-top-box">
    <div class="main-top-item">
      <ChartTitle :CTData="CTDataObj1"></ChartTitle>
      <ClearFix></ClearFix>
      <div class="chart-div" ref="chart1"></div>
    </div>
    <div class="main-top-item">
      <ChartTitle :CTData="CTDataObj2"></ChartTitle>
      <ClearFix></ClearFix>
      <div class="chart-div" ref="chart2"></div>
    </div>
    <div class="main-top-item">
      <ChartTitle :CTData="CTDataObj3"></ChartTitle>
      <ClearFix></ClearFix>
      <div class="chart-div" ref="chart3"></div>
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
      CTDataObj1: {hasLine: false, iconId: 3, font: '实时客流量'},
      CTDataObj2: {hasLine: false, iconId: 4, font: '实时人口变化'},
      CTDataObj3: {hasLine: false, iconId: 5, font: '实时驻留时长'},
      hourArr: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '>8'], // 时间段数组
      hourMap: { // 横坐标映射
        0: '0-1',
        1: '1-2',
        2: '2-3',
        3: '3-4',
        4: '4-5',
        5: '5-6',
        6: '6-7',
        7: '7-8',
        8: '>8'
      },
      xData: [], // 横坐标数据(小时)
      chart1: null,
      chart2: null,
      chart3: null,
    }
  },

  components: {
    ChartTitle,
    ClearFix
  },
  computed: {},
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
  watch: {
    curDate (newVal, oldVal) {
      this.getPositionFlowTrend()
      this.getPositionInAndOutTrend()
      this.getPositionLinger()
    },
    positionId (newVal, oldVal) {
      this.getPositionFlowTrend()
      this.getPositionInAndOutTrend()
      this.getPositionLinger()
    }
  },

  methods: {
    /**
     * 获取实时客流量
     */
    getPositionFlowTrend () {
      const url = `/position/getPositionFlowTrend?positionId=${window.positionId}&countDate=${window.curDate}`
      postData(url, {}).then((res) => {
        console.log(res)
        let d = []
        for (let obj of res.data) {
          let tempArr = obj.countTime.split(' ')
          let hour = utils.strDelZero(tempArr[tempArr.length - 1])
          let objArr = [hour, obj.num]
          d.push(objArr)
        }
        this.initChart1(d)
      })
    },
    /**
     * 实时人口变化
     */
    getPositionInAndOutTrend () {
      const url = `/position/getPositionInAndOutTrend?positionId=${window.positionId}&countDate=${window.curDate}`
      postData(url, {}).then((res) => {
        console.log(res)
        let inArr = []
        let outArr = []
        let positionInList = res.data.positionInList // 进入人数
        let positionOutList = res.data.positionOutList // 离开人数
        for (let obj of positionInList) {
          let tempArr = obj.countTime.split(' ')
          let hour = utils.strDelZero(tempArr[tempArr.length - 1])
          let objArr = [hour, obj.numIn]
          inArr.push(objArr)
        }
        for (let obj of positionOutList) {
          let tempArr = obj.countTime.split(' ')
          let hour = utils.strDelZero(tempArr[tempArr.length - 1])
          let objArr = [hour, obj.numOut]
          outArr.push(objArr)
        }
        this.initChart2(inArr, outArr)
      })
    },
    /**
     * 获取枢纽驻留时长
     */
    getPositionLinger () {
      const url = `/position/getPositionLinger?positionId=${window.positionId}&countDate=${window.curDate}`
      postData(url, {}).then((res) => {
        console.log(res)
        let realTimeList = []
        let historyList = []
        let positionLingerList = res.data.positionLingerList // 实时驻留
        let positionLingerHistoryList = res.data.positionLingerHistoryList // 历史驻留
        for (let obj of positionLingerList) {
          let zb = obj.timeGroupZb
//          let hour = this.hourMap[obj.timeGroup]
//          let objArr = [hour, zb]
          realTimeList.push(zb)
        }
        for (let obj of positionLingerHistoryList) {
          let zb = obj.timeGroupZb
//          let hour = this.hourMap[obj.timeGroup]
//          let objArr = [hour, zb]
          historyList.push(zb)
        }
        this.initChart3(realTimeList, historyList)
      })
    },
    /**
     * 初始化实时客流量图表
     * @param data 数据
     */
    initChart1 (data) {
      if (!this.chart1) {
        this.chart1 = echarts.init(this.$refs['chart1'])
      }
      let me = this
      let option = {
        title: {
          text: '实时客流量',
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
          formatter: function (params) {
            //            console.log(params)
            return params[params.length - 1].data[1] + '人'
          },
          backgroundColor: '#065f89',
          padding: 10,
          borderColor: '#28eefb',
          borderWidth: 1,
          axisPointer: {
            lineStyle: {
              color: '#68e5ff'
            }
          }
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
        series: [
          {
            name: '实时客流量',
            type: 'line',
            smooth: true,
            //            symbol: 'none',
            stack: 'a',
            label: {
              normal: {
                show: false
              }
            },
            // 填充区域样式
            areaStyle: {
              normal: {
                // color: bdColor,
                // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#183d74' // 0% 处的颜色
                  }, {
                    offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            lineStyle: {
              color: '#28eefb'
            },
            data: data
          }
        ]
      }
      this.chart1.setOption(option)
    },
    /**
     * 初始化实时人口变化图表, 两条线
     * @param inData 进入人数数组
     * @param outData 离开人数数组
     */
    initChart2 (inData, outData) {
      if (!this.chart2) {
        this.chart2 = echarts.init(this.$refs['chart2'])
      }
      let me = this
      let legend1 = '进入人数'
      let legend2 = '离开人数'
      let option = {
        title: {
          text: '实时人口变化',
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
          backgroundColor: '#065f89',
          padding: 10,
          borderColor: '#28eefb',
          borderWidth: 1,
          axisPointer: {
            lineStyle: {
              color: '#68e5ff'
            }
          }
        },
        legend: { // 图例组件
          data: [legend1, legend2],
          textStyle: {
            color: 'rgb(255,255,255)',
            fontSize: 15,
            fontFamily: 'Microsoft YaHei'
          }
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
          },
          show: true
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
        series: [
          {
            name: legend1,
            type: 'line',
            //            smooth: true,
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
            data: inData
          },
          {
            name: legend2,
            type: 'line',
            //            smooth: true,
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
            data: outData
          }
        ]
      }

      this.chart2.setOption(option)
    },
    /**
     * 初始化 实时驻留时长 图表
     * @param realTimeData 实时驻留数组
     * @param historyData 历史驻留数组
     */
    initChart3 (realTimeData, historyData) {
      if (!this.chart3) {
        this.chart3 = echarts.init(this.$refs['chart3'])
      }
      let me = this
      let legend1 = '实时'
      let legend2 = '近30日'
      let option = {
        title: {
          text: '世界人口总量',
          subtext: '数据来自网络',
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: [legend1, legend2],
          textStyle: {
            color: 'rgb(255,255,255)',
            fontSize: 15,
            fontFamily: 'Microsoft YaHei'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          // 分割线
          splitLine: {
            show: false
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#ffffff'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: me.hourArr,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#ffffff'
            }
          }
        },
        series: [
          {
            name: legend1,
            type: 'bar',
            data: realTimeData
          },
          {
            name: legend2,
            type: 'bar',
            data: historyData
          }
        ],
//        series: [
//          {
//            name: legend1,
//            type: 'bar',
//            data: [18203, 23489, 29034, 104970, 131744, 630230, 131744, 131744, 131744]
//          },
//          {
//            name: legend2,
//            type: 'bar',
//            data: [19325, 23438, 31000, 121594, 134141, 681807, 104970, 104970, 104970]
//          }
//        ],
      }
      this.chart3.setOption(option)
    }
  },

  created () {
    for (let i = 0; i < 25; i++) { // 时间(小时)
      this.xData.push(i)
    }
    this.getPositionFlowTrend()
    this.getPositionInAndOutTrend()
    this.getPositionLinger()
  },

  mounted () {},

  beforeDestroy () {
//    if (!this.chart1) {
//      return
//    }
    this.chart1.dispose()
    this.chart2.dispose()
    this.chart3.dispose()
    this.chart1 = null
    this.chart2 = null
    this.chart3 = null
  }
}
</script>

<style lang='scss' scoped>
  .main-top-item {
    width: 33.33%;
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
