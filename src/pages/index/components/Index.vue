<template>
  <div class="index">
    <!--地图容器-->
    <div class="map" id="container">
      <!--头部-->
      <Header @getHeaderHeight="getHeaderHeight"></Header>
      <!--主要内容区域-->
      <div class="main-box cd">
        <div class="the-bg bg-l" :style="{height: bgHeight}">
          <!--left-->
          <Location></Location>
          <div class="people-num-name">
            <i></i>
            <span>{{numFont}}</span>
          </div>
          <div class="people-num" v-if="numStrArr">
            <ul>
              <li v-for="(item,index) in numStrArr[0].split('')" :key="index">{{item}}</li>
            </ul>
            <i></i>
            <ul>
              <li v-for="(item,index) in numStrArr[1].split('')" :key="index">{{item}}</li>
            </ul>
            <span>万</span>
          </div>
          <div class="chart-l1-box">
            <ChartTitle :CTData="CTDataObj1"></ChartTitle>
            <div class="chart-l1" ref="chart-l1"></div>
          </div>
          <div class="chart-l2-box">
            <ChartTitle :CTData="CTDataObj2"></ChartTitle>
            <AnalysisTable></AnalysisTable>
          </div>
          <!--left-->
        </div>
        <div class="the-bg bg-r" :style="{height: bgHeight}">
          <!--right-->
          <div class="total-num-box">
            监测枢纽总数:
            <i>{{totalHinge}}</i>
          </div>
          <div class="meter-box">
            <div class="meter meter-normal">
              <div>
                <div class="meter-num">
                  <i>{{normalHinge}}</i>
                  个
                </div>
                <div class="meter-type">正常</div>
              </div>
            </div>
            <div class="meter meter-warning">
              <div>
                <div class="meter-num">
                  <i>{{warningHinge}}</i>
                  个
                </div>
                <div class="meter-type">告警</div>
              </div>

            </div>
          </div>
          <div class="chart-r1-box" v-if="AreaFlowAndWarningList">
            <ChartTitle :CTData="CTDataObj3"></ChartTitle>
            <HingeTable :tableData="AreaFlowAndWarningList"></HingeTable>
          </div>
          <div class="chart-r2-box">
            <ChartTitle :CTData="CTDataObj4"></ChartTitle>
            <HingeRankingTable></HingeRankingTable>
          </div>
          <!--right-->
        </div>
      </div>
      <!--<div>-->
      <!--<div id="panel" class="scrollbar1">-->
      <!--<ul id="area-tree">-->
      <!--</ul>-->
      <!--</div>-->

      <!--</div>-->
    </div>
  </div>
</template>

<script>
import { utils } from '../../../common'
import echarts from 'echarts'
import Header from '../../../component/Header.vue'
import ChartTitle from '../../../component/ChartTitle.vue'
import HingeTable from '../../../component/HingeTable.vue'
import HingeRankingTable from '../../../component/HingeRankingTable.vue'
import AnalysisTable from '../../../component/AnalysisTable.vue'
import Location from '../../../component/Location.vue'
import { theCitys } from '../../../common/mapData'
import { postData } from '../../../common/server'

export default {
  data () {
    return {
      numFont: '全部枢纽实时总人数',
      peopleNum: null, // 人数
      defaultFeatures: ['bg', 'building', 'point'], // 地图默认特征
      roadFeatures: ['bg', 'building', 'point', 'road'], // 显示公路的 特征
      CTDataObj1: {hasLine: true, iconId: 1, font: '各行业人数分析'},
      CTDataObj2: {hasLine: true, iconId: 1, font: '城市人数分析'},
      CTDataObj3: {hasLine: true, iconId: 2, font: '预警枢纽列表'},
      CTDataObj4: {hasLine: true, iconId: 1, font: '枢纽人数排行'},
      chartL1: null,
      bgHeight: null, // 左右背景的高度
      numStrArr: null, // 人数字符串数组
      AreaFlowAndWarningList: null, // 区域实时总人数及该区域预警枢纽列表
      totalHinge: null, // 总枢纽数
      normalHinge: null, // 正常枢纽数
      warningHinge: null, // 告警枢纽数

    }
  },
  components: {
    Header,
    ChartTitle,
    HingeTable,
    AnalysisTable,
    Location,
    HingeRankingTable
  },
  mounted () {
    window.echarts = echarts
    this.initMap()
    this.initDistrict()
    this.renderMarkers()
  },
  created () {
    this.getAreaFlowAndWarningList()
    this.getPositionTypeNum()
  },
  methods: {
    /**
     * 初始化地图
     */
    initMap () {
      const theDefaultMapStyle = 'amap://styles/785cdb67af60cfce35e24e8d6c56ed75' // 默认地图样式
      const theCenterPoint = [113.275824, 22.994826] // 默认地图中心
      let theMap = new AMap.Map('container', {
        pitch: 45,
        mapStyle: theDefaultMapStyle,
        viewMode: '3D', // 地图模式
        center: theCenterPoint,
        features: this.defaultFeatures,
        //        zoom: 7.5,
        expandZoomRange: true, // 改变最大缩放等级
        //        zooms: [7.5, 20], // 改变最大缩放等级
        keyboardEnable: false,
        layers: [
          //satellite,
          // building,
          //roadNet
        ]
      })
      window.theMap = theMap
    },
    /**
     * 初始化行政区
     */
    initDistrict () {
      let me = this
      let colors = [
        '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
        '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707',
        '#651067', '#329262', '#5574a6', '#3b3eac'
      ]
      AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function (DistrictExplorer, $) {
        // 创建一个实例
        let districtExplorer = window.districtExplorer = new DistrictExplorer({
          eventSupport: true, // 打开事件支持
          map: theMap
        })

        // 当前聚焦的区域
        let currentAreaNode = null

        // 鼠标hover提示内容
        let $tipMarkerContent = $('<div class="tipMarker top"></div>')

        let tipMarker = new AMap.Marker({
          //          content: $tipMarkerContent.get(0),
          content: '<div></div>',
          offset: new AMap.Pixel(0, 0),
          bubble: true
        })

        // 根据Hover状态设置相关样式
        function toggleHoverFeature (feature, isHover, position) {
          tipMarker.setMap(isHover ? theMap : null)

          if (!feature) {
            return
          }

          let props = feature.properties

          if (isHover) {
            // 更新提示内容
            $tipMarkerContent.html(props.adcode + ': ' + props.name)
            // 更新位置
            tipMarker.setPosition(position || props.center)
          }

          $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover)

          // 更新相关多边形的样式
          let polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode)
          for (let i = 0, len = polys.length; i < len; i++) {
            polys[i].setOptions({
              fillOpacity: isHover ? 0.5 : 0.2
            })
          }
        }

        // 监听feature的hover事件
        districtExplorer.on('featureMouseout featureMouseover', function (e, feature) {
          toggleHoverFeature(feature, e.type === 'featureMouseover',
            e.originalEvent ? e.originalEvent.lnglat : null)
        })

        // 监听鼠标在feature上滑动
        districtExplorer.on('featureMousemove', function (e, feature) {
          // 更新提示位置
          tipMarker.setPosition(e.originalEvent.lnglat)
        })

        // feature被点击
        districtExplorer.on('featureClick', function (e, feature) {

          let props = feature.properties

          // 如果存在子节点
          if (props.childrenNum > 0) {
            // 切换聚焦区域
            switch2AreaNode(props.adcode)
          }
        })

        // 外部区域被点击
        districtExplorer.on('outsideClick', function (e) {
          districtExplorer.locatePosition(e.originalEvent.lnglat, function (error, routeFeatures) {

            if (routeFeatures && routeFeatures.length > 1) {
              // 切换到省级区域
              switch2AreaNode(routeFeatures[1].properties.adcode)
            } else {
              // 切换到全国
              switch2AreaNode(100000)
            }

          }, {
            levelLimit: 2
          })
        })

        // 绘制区域面板的节点
        function renderAreaPanelNode (ele, props, color) {

          let $box = $('<li/>').addClass('lv_' + props.level)

          let $h2 = $('<h2/>').addClass('lv_' + props.level).attr({
            'data-adcode': props.adcode,
            'data-level': props.level,
            'data-children-num': props.childrenNum || void(0),
            'data-center': props.center.join(',')
          }).html(props.name).appendTo($box)

          if (color) {
            $h2.css('borderColor', color)
          }

          // 如果存在子节点
          if (props.childrenNum > 0) {

            // 显示隐藏
            $('<div class="showHideBtn"></div>').appendTo($box)

            // 子区域列表
            $('<ul/>').addClass('sublist lv_' + props.level).appendTo($box)

            $('<div class="clear"></div>').appendTo($box)

            if (props.level !== 'country') {
              $box.addClass('hide-sub')
            }
          }

          $box.appendTo(ele)
        }

        // 填充某个节点的子区域列表
        function renderAreaPanel (areaNode) {

          let props = areaNode.getProps()

          let $subBox = $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').siblings('ul.sublist')

          if (!$subBox.length) {
            // 父节点不存在，先创建
            renderAreaPanelNode($('#area-tree'), props)
            $subBox = $('#area-tree').find('ul.sublist')
          }

          if ($subBox.attr('data-loaded') === 'rendered') {
            return
          }

          $subBox.attr('data-loaded', 'rendered')

          let subFeatures = areaNode.getSubFeatures()

          // 填充子区域
          for (let i = 0, len = subFeatures.length; i < len; i++) {
            renderAreaPanelNode($subBox, areaNode.getPropsOfFeature(subFeatures[i]), colors[i % colors.length])
          }
        }

        // 绘制某个区域的边界
        function renderAreaPolygons (areaNode) {
          // 更新地图视野
          theMap.setBounds(areaNode.getBounds(), null, null, true)

          // 清除已有的绘制内容
          districtExplorer.clearFeaturePolygons()

          // 绘制子区域
          districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
            let fillColor = colors[i % colors.length]
            let strokeColor = colors[colors.length - 1 - i % colors.length]

            return {
              cursor: 'default',
              bubble: true,
              strokeColor: strokeColor, // 线颜色
              strokeOpacity: 1, // 线透明度
              strokeWeight: 1, // 线宽
              fillColor: fillColor, // 填充色
              fillOpacity: 0.35, // 填充透明度
            }
          })

          // 绘制父区域
          districtExplorer.renderParentFeature(areaNode, {
            cursor: 'default',
            bubble: true,
            strokeColor: 'black', // 线颜色
            strokeOpacity: 1, // 线透明度
            strokeWeight: 1, // 线宽
            fillColor: null, // 填充色
            fillOpacity: 0.35, // 填充透明度
          })
        }

        // 切换区域后刷新显示内容
        function refreshAreaNode (areaNode) {

          districtExplorer.setHoverFeature(null)

          renderAreaPolygons(areaNode)

          // 更新选中节点的class
          let $nodeEles = $('#area-tree').find('h2')

          $nodeEles.removeClass('selected')

          let $selectedNode = $nodeEles.filter('h2[data-adcode=' + areaNode.getAdcode() + ']').addClass('selected')

          // 展开下层节点
          $selectedNode.closest('li').removeClass('hide-sub')

          // 折叠下层的子节点
          $selectedNode.siblings('ul.sublist').children().addClass('hide-sub')
        }

        // 切换区域
        function switch2AreaNode (adcode, callback) {

          if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
            return
          }

          loadAreaNode(adcode, function (error, areaNode) {

            if (error) {

              if (callback) {
                callback(error)
              }

              return
            }

            currentAreaNode = window.currentAreaNode = areaNode

            // 设置当前使用的定位用节点
            districtExplorer.setAreaNodesForLocating([currentAreaNode])

            refreshAreaNode(areaNode)

            if (callback) {
              callback(null, areaNode)
            }
          })
        }

        // 加载区域
        function loadAreaNode (adcode, callback) {

          districtExplorer.loadAreaNode(adcode, function (error, areaNode) {

            if (error) {

              if (callback) {
                callback(error)
              }

              console.error(error)

              return
            }

            renderAreaPanel(areaNode)

            if (callback) {
              callback(null, areaNode)
            }
          })
        }

        $('#area-tree').on('mouseenter mouseleave', 'h2[data-adcode]', function (e) {

          if (e.type === 'mouseleave') {
            districtExplorer.setHoverFeature(null)
            return
          }

          let adcode = $(this).attr('data-adcode')

          districtExplorer.setHoverFeature(currentAreaNode.getSubFeatureByAdcode(adcode))
        })

        $('#area-tree').on('click', 'h2[data-children-num]', function () {

          let adcode = $(this).attr('data-adcode')

          switch2AreaNode(adcode)
        })

        $('#area-tree').on('click', '.showHideBtn', function () {

          let $li = $(this).closest('li')

          $li.toggleClass('hide-sub')

          if (!$li.hasClass('hide-sub')) {

            // 子节点列表被展开
            let $subList = $li.children('ul.sublist')

            // 尚未加载
            if (!$subList.attr('data-loaded')) {

              $subList.attr('data-loaded', 'loading')

              $li.addClass('loading')

              // 加载
              loadAreaNode($li.children('h2').attr('data-adcode'), function () {

                $li.removeClass('loading')
              })
            }
          }
        })

        // 默认切到广东
        switch2AreaNode(440000)
        //        switch2AreaNode(100000)
      })
    },
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
     * 设置背景的高度
     * @param height 头部高度
     */
    getHeaderHeight (height) {
      console.log(`头部高度:${height}`)
      this.bgHeight = utils.getClientHeight() - height + 'px'
    },
    /**
     * 画点
     */
    renderMarkers () {
      for (let theCityName in theCitys) {
        let thelngLat = theCitys[theCityName]
        let thelngLats = thelngLat.split(',')
        let marker = new AMap.Marker({
          position: new AMap.LngLat(parseFloat(thelngLats[0]), parseFloat(thelngLats[1])), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: theCityName,
//          content: '<div style="color:white;width: 3em;font-size:10px;font-weight:bold;">' + theCityName + '</div>'
          content: '<div class="the-point"></div>'
        })
        theMap.add(marker)
      }
    },
    /**
     * 获取区域实时总人数及该区域预警枢纽列表
     */
    getAreaFlowAndWarningList () {
      const url = 'position/getAreaFlowAndWarningList?city=全部市'
      const data = {}
      postData(url, data).then((res) => {
        console.log(res)
        this.AreaFlowAndWarningList = res.data
        this.handleFlowNum()
        this.calHingeNum()
      })
    },
    /**
     * 获取各枢纽类型人数
     */
    getPositionTypeNum () {
      const url = 'position/getPositionTypeNum?city=全部市'
      const data = {}
      postData(url, data).then((res) => {
        console.log(res)
        let theData = []
        for (let obj of res.data) {
          theData.push({value: obj.num, name: obj.positionType})
        }
        this.initChart(theData)
      })
    },

    /**
     * 处理枢纽人数, 把数字转为字符串数组
     */
    handleFlowNum () {
      let theNum = this.AreaFlowAndWarningList.areaFlow.num
      this.numStrArr = utils.getStrArr(theNum)
    },
    /**
     * 计算枢纽数量
     */
    calHingeNum () {
      const theArr = ['warningList_qd', 'warningList_ss', 'warningList_yz', 'warningList_zd']
      let normalNum = 0
      let totalNum = 0
      for (let item of theArr) {
        let len = this.AreaFlowAndWarningList[item].length
        totalNum += len
        if (item === 'warningList_ss') {
          normalNum = len
        }
      }
      this.totalHinge = totalNum
      this.normalHinge = normalNum
      this.warningHinge = totalNum - normalNum
    }
  },
  beforeDestroy () {
    if (!this.chartL1) {
      return
    }
    this.chartL1.dispose()
    this.chartL1 = null
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .index {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }

  #container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .main-box-inner {
    width: 100%;
    height: 100%;
    position: relative;
    pointer-events: none;
  }

  .main-box {
    /*position: absolute;*/
    /*z-index: 1000;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*color: #ffffff;*/
    /*padding-top: 80px;*/
    position: relative;
    z-index: 1000;
    color: #ffffff;
  }

  .shadow-inset {
    /*box-shadow: 3px 3px 3px rgba(80,241,255,0.5); // 选中的阴影*/
    box-shadow: inset 0px 0px 5px 1px rgb(80, 241, 255); // 选中的阴影
  }

  .the-bg {
    position: absolute;
    width: 584px;
    /*height: 998px;*/
    top: 0;
  }

  .bg-l {
    background: url("../assets/内容区_左侧数据背景底色.png") no-repeat;
    background-size: 100% 100%;
    left: 0;
  }

  .bg-r {
    background: url("../assets/内容区_右侧数据背景底色.png") no-repeat;
    background-size: 100% 100%;
    right: 0;
  }

  .people-num-name {
    font-size: 24px;
    /*margin: 0 0 24px 21px;*/
    position: absolute;
    /*top: 101px;*/
    top: 95px;
    left: 21px;
    display: flex;
    align-items: center;
    i {
      width: 20px;
      height: 21px;
      background: url("../assets/内容区_枢纽总人数icon.png") no-repeat;
      background-size: contain;
      margin-right: 8px;
    }
  }

  .people-num {
    position: absolute;
    /*top: 145px;*/
    top: 140px;
    left: 23px;
    display: flex;
    align-items: flex-end;
    font-family: unidreamledregular;
    font-size: 45px;
    ul {
      display: flex;
    }
    li {
      width: 42px;
      height: 57px;
      background: url("../assets/内容区_总人数背景色.icon.png") no-repeat;
      background-size: contain;
      margin-right: 11px;
      @include defaultFlex;
    }
    i {
      height: 10px;
      width: 6px;
      background-color: #ffffff;
      margin: 0 10px 10px 0;
      margin-left: -5px;
    }
    span {
      font-size: 24.5px;
    }
  }

  .chart-l1-box {
    width: 500px;
    /*height: 368px;*/
    height: 36.87%;
    position: absolute;
    left: 0;
    /*top: 238px;*/
    bottom: 39.17%;
  }

  .chart-l2-box {
    width: 500px;
    /*height: 391px;*/
    height: 39.17%;
    position: absolute;
    left: 0;
    /*top: 606px;*/
    bottom: 0;
  }

  .chart-r1-box {
    width: 430px;
    /*height: 373px;*/
    height: 37.37%;
    position: absolute;
    right: 0;
    /*top: 233px;*/
    bottom: 37.37%;;
  }

  .chart-r2-box {
    width: 430px;
    /*height: 373px;*/
    height: 37.37%;
    position: absolute;
    right: 0;
    /*top: 606px;*/
    bottom: 0;
  }

  .total-num-box {
    position: absolute;
    top: 18px;
    right: 227px;
    font-size: 22px;
    color: #53fdff;
    i {
      font-size: 36px;
      color: #14ecb2;
      font-family: unidreamledregular;
    }
  }

  .meter {
    width: 136px;
    height: 136px;
    @include defaultFlex;
    font-size: 19px;
  }

  .meter-num {
    font-size: 20px;
    i {
      font-family: unidreamledregular;
      font-size: 24px;
    }
  }

  .meter-type {
    text-align: center;
  }

  .meter-box {
    width: 430px;
    position: absolute;
    right: 0;
    top: 70px;
    display: flex;
  }

  .meter-normal {
    color: #14ecb2;
    margin-right: 81px;
    margin-left: 10px;
    background: url("../assets/内容区_监测枢纽总数图.png") no-repeat;
    background-size: 100% 100%;
  }

  .meter-warning {
    color: #ca3750;
    margin-right: 64px;
    background: url("../assets/内容区_监测枢纽总数图_告警.png") no-repeat;
    background-size: 100% 100%;
  }

  .chart-l1 {
    width: 100%;
    height: 85%;
  }

  // 地点面板
  #panel {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    overflow: auto;
    width: 300px;
    z-index: 999;
    border-left: 1px solid #eaeaea;
    background: #fff;
  }

  .scrollbar1::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
  }

  .scrollbar1::-webkit-scrollbar {
    width: 6px;
    background-color: #fff;
  }

  .scrollbar1::-webkit-scrollbar-thumb {
    background-color: #aaa;
  }

  .clear {
    clear: both;
  }

  .tipMarker {
    color: #555;
    background-color: rgba(255, 254, 239, 0.8);
    border: 1px solid #7E7E7E;
    padding: 2px 6px;
    font-size: 12px;
    white-space: nowrap;
    display: inline-block;
  }

  .tipMarker:before,
  .tipMarker:after {
    content: '';
    display: block;
    position: absolute;
    margin: auto;
    width: 0;
    height: 0;
    border: solid transparent;
    border-width: 5px 5px;
  }

  .tipMarker.top {
    transform: translate(-50%, -110%);
  }

  .tipMarker.top:before,
  .tipMarker.top:after {
    bottom: -9px;
    left: 0;
    right: 0;
    border-top-color: rgba(255, 254, 239, 0.8);
  }

  .tipMarker.top:before {
    bottom: -10px;
    border-top-color: #7E7E7E;
  }

  #area-tree h2 {
    display: inline-block;
    font-weight: 500;
    font-size: 13px;
    padding: 3px 5px;
    margin: 0;
    border: 1px solid #2ca02c;
    border-width: 1px 3px;
    cursor: pointer;
  }

  #area-tree h2:hover,
  #area-tree h2.hover,
  #area-tree h2.selected {
    background: #3366cc;
    color: #fff;
  }

  #area-tree h2.lv_outside {
    border-color: #666;
    padding: 3px 10px;
  }

  #area-tree h2.lv_country {
    border-color: #d62728;
    padding: 3px 27px;
    margin: 5px 0;
  }

  #area-tree h2.lv_province {
    border-color: #ff7f0e;
    padding: 3px 10px;
  }

  #area-tree h2.lv_district {
    border-color: #dd4477
  }

  #area-tree ul {
    margin-left: 23px;
    clear: both;
  }

  #area-tree li {
    float: left;
    margin: 5px 5px 0 0;
    font-size: 12px;
  }

  #area-tree li.lv_province {
    margin: 5px 5px 5px 0;
  }

  .showHideBtn {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    overflow: hidden;
    vertical-align: middle;
    margin: 0;
    cursor: pointer;
  }

  @-webkit-keyframes rotate-forever {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  .loading > .showHideBtn {
    -webkit-animation: 1s ease-in-out infinite rotate-forever;
  }

  .showHideBtn:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 4px;
    left: 4px;
    border: solid rgba(0, 0, 0, 0);
    border-width: 10px 6px;
    border-top-color: #aaa;
    transition-property: all;
    transition-duration: .2s;
  }

  .hide-sub .showHideBtn:after {
    transform-origin: 50% 20%;
    transform: rotate(-90deg);
  }

  .hide-sub > ul {
    display: none;
  }
  // 地点面板

</style>
