<template>
  <!--各行业人数分析饼图-->
  <div class="chart-l1" ref="chart-l1"></div>
</template>

<script>
import { utils, postData } from '../common'
import echarts from 'echarts'

export default {
  data () {
    return {
      chartL1: null
    }
  },

  components: {},
  props: {
    curCity: {
      type: String,
      default: null
    }
  },
  computed: {},

  methods: {
    /**
     * 初始化图表
     * @param data 图表数据
     */
    initChart (data) {
      this.chartL1 = echarts.init(this.$refs['chart-l1'])
      let option = {
        title: {
          text: '各行业人数分析',
          subtext: '',
          x: 'center',
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          show: false
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          show: false,
          data: ['客运站', '火车站', '机场', '服务区', '收费站']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['20%', '60%'],
            center: ['50%', '60%'],
            //            data: [
            //              {value: 33.5, name: '客运站'},
            //              {value: 31.0, name: '火车站'},
            //              {value: 23.4, name: '机场'},
            //              {value: 13.5, name: '服务区'},
            //              {value: 15.48, name: '收费站'}
            //            ],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animation: false,
            label: {
              normal: {
                show: true,
                //                position: 'inside',
                position: 'outside',
                formatter: '{b} {c}%',
                padding: [0, 0],
                fontSize: '20'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            }
          }
        ]
      }
      // 把配置和数据放这里
      this.chartL1.setOption(option)
    },
    /**
     * 获取各枢纽类型人数
     */
    getPositionTypeNum () {
      const theName = this.curCity
      const url = 'position/getPositionTypeNum?city=' + theName
      const data = {}
      postData(url, data).then((res) => {
        console.log(res)
        let theData = []
        let totalNum = 0 // 总数
        for (let obj of res.data) {
          totalNum += obj.num
        }
        for (let obj of res.data) {
          let val = obj.num / totalNum * 100
          theData.push({value: val, name: obj.positionType})
        }
        this.initChart(theData)
      })
    }
  },

  created () {
    this.getPositionTypeNum()
  },

  mounted () {},

  beforeDestroy () {
    if (!this.chartL1) {
      return
    }
    this.chartL1.dispose()
    this.chartL1 = null
  }
}
</script>

<style lang='scss' scoped>

</style>
