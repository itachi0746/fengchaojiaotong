<template>
  <!--人流画像-->
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
      CTDataObj1: {hasLine: false, iconId: 6, font: '性别'},
      CTDataObj2: {hasLine: false, iconId: 7, font: '年龄'},
      CTDataObj3: {hasLine: false, iconId: 7, font: '消费能力'},
      sexMap: { // 性别映射
        0: '未知',
        1: '男',
        2: '女'
      },
      ageArr: ['0-20', '20-30', '30-40', '40-50', '50-60', '>60'], // 年龄段数组
      consumeArr: ['低', '中低', '中等', '中高', '高'], // 年龄段数组
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

  methods: {
    /**
     * 获取枢纽实时人群画像（性别、年龄、消费能力）
     */
    getPositionPortraitRealTime () {
      //      const url = `/position/getPositionFlowTrend?positionId=${window.positionId}&countDate=${window.curDate}`
      const url = `/position/getPositionPortraitRealTime?positionId=${window.positionId}`
      postData(url, {}).then((res) => {
        console.log(res)
        let positionSexList = res.data.positionSexList // 性别
        let positionAgeList = res.data.positionAgeList // 年龄
        let positionConsumeList = res.data.positionConsumeList // 消费能力
        let sexData = []
        let ageData = []
        let consumeData = []
        for (let obj of positionSexList) {
          let val = obj.ratio
          let sex = this.sexMap[obj.sex]
          sexData.push({value: val, name: sex})
        }
        for (let obj of positionAgeList) {
          ageData.push(obj.num)
        }
        for (let obj of positionConsumeList) {
          consumeData.push(obj.num)
        }
        this.initChart1(sexData)
        this.initChart2(ageData)
        this.initChart3(consumeData)
      })
    },
    /**
     * 初始化性别比例图表
     * @param data 数据
     */
    initChart1 (data) {
      this.chart1 = echarts.init(this.$refs['chart1'])
      let legend1 = '男'
      let legend2 = '女'
      let option = {
        title: {
          text: '同名数量统计',
          subtext: '纯属虚构',
          x: 'center',
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: { // 图例组件
          data: [legend1, legend2],
          textStyle: {
            color: 'rgb(255,255,255)',
            fontSize: 15,
            fontFamily: 'Microsoft YaHei'
          }
        },
        series: [
          {
            name: '性别',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chart1.setOption(option)
    },
    /**
     * 初始化 年龄 图表
     * @param data 数组
     */
    initChart2 (data) {
      this.chart2 = echarts.init(this.$refs['chart2'])
      let me = this
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
          data: [],
          show: false
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '5%',
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
          data: me.ageArr,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#ffffff'
            }
          }
        },
        series: [
          {
            name: '年龄',
            type: 'bar',
            data: data
          }
        ]
      }
      this.chart2.setOption(option)
    },
    /**
     * 初始化 消费能力 图表
     * @param data 数组
     */
    initChart3 (data) {
      this.chart3 = echarts.init(this.$refs['chart3'])
      let me = this
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
          data: [],
          show: false
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '5%',
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
          data: me.consumeArr,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#ffffff'
            }
          }
        },
        series: [
          {
            name: '消费能力',
            type: 'bar',
            data: data
          }
        ]
      }
      this.chart3.setOption(option)
    }
  },

  created () {
    this.getPositionPortraitRealTime()
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
