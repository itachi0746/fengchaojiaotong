<template>
  <div class="index">
    <!--地图容器-->
    <div ref="chartMap" class="mapview" id="mapview">

    </div>
    <!--头部-->
    <Header @getHeaderHeight="getHeaderHeight"></Header>

    <!--主要内容区域-->
    <div class="main-box cd">
      <div class="the-bg bg-l" :style="{height: bgHeight}">
        <!--left-->
        <Location @changeLocation="changeLocation" :curLocation="curLocation" :mapStatus="mapStatus"></Location>
        <Calender v-if="mapStatus===3" @changeDate="changeDate" :curDate="curDate"></Calender>
        <!--<LaiyuanTab v-if="mapStatus===3 && showLaiyuan"></LaiyuanTab>-->
        <!--人数组件-->
        <PeopleNum v-if="resData && mapStatus!==3" :areaFlowNum="resData.areaFlow.num"></PeopleNum>
        <!--人数+比例组件-->
        <PeopleNumC v-if="mapStatus===3" :positionId="positionId" :showLaiyuan="showLaiyuan"></PeopleNumC>
        <Linkage v-if="mapStatus===3 && !showLaiyuan"></Linkage>
        <div class="chart-l1-box" v-if="mapStatus!==3">
          <ChartTitle :CTData="CTDataObj1"></ChartTitle>
          <ClearFix></ClearFix>
          <AnalysisTable3 v-if="showChartL1" :curCity="curLocation.name"></AnalysisTable3>
          <AnalysisTable2 v-if="!showChartL1" :curCity="curLocation.name"></AnalysisTable2>
        </div>
        <div class="chart-l2-box" v-if="mapStatus!==3">
          <ChartTitle :CTData="CTDataObj2"></ChartTitle>
          <ClearFix></ClearFix>
          <AnalysisTable :curLocation="curLocation" :mapStatus="mapStatus"></AnalysisTable>
        </div>
        <!--left-->
      </div>
      <div class="the-bg bg-r" v-if="mapStatus!==3" :style="{height: bgHeight}">
        <!--right-->

        <div class="total-num-box">
          监测枢纽总数: <i>{{totalHinge}}</i>
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
        <div class="chart-r1-box">
          <ChartTitle :CTData="CTDataObj3"></ChartTitle>
          <ClearFix></ClearFix>
          <HingeTable  v-if="resData" :tableData="resData"></HingeTable>
        </div>
        <div class="chart-r2-box">
          <ChartTitle :CTData="CTDataObj4"></ChartTitle>
          <ClearFix></ClearFix>
          <HingeRankingTable :curLocation="curLocation"></HingeRankingTable>
        </div>
        <!--right-->
      </div>
      <!--返回按钮-->
      <div class="return-btn" v-if="showReturnBtn" @click="clickReturnBtn">
        <img src="../assets/返回icon.png" alt="">
        <span>返回</span>
      </div>
      <!--来源去向-->
      <LaiyuanTable v-if="mapStatus===3 && showLaiyuan" :positionId="positionId" :curDate="curDate" @drawLine="drawLine"></LaiyuanTable>
    </div>

    <!--底部tab-->
    <BtmTab v-if="mapStatus===2" @showHingeName="handleShowHingeName" @changeHingePart="changeShowHingeType"></BtmTab>
    <!--底部图表-->
    <BtmChartBox v-if="mapStatus===3" @showLaiyuan="handleShowLaiyuan" :curDate="curDate" :positionId="positionId"></BtmChartBox>
  </div>
</template>

<script>
import { utils, postData } from '../../../common'
import Header from '../../../component/Header.vue'
import ChartTitle from '../../../component/ChartTitle.vue'
import HingeTable from '../../../component/HingeTable.vue'
import HingeRankingTable from '../../../component/HingeRankingTable.vue'
import AnalysisTable from '../../../component/AnalysisTable.vue'
import AnalysisTable2 from '../../../component/AnalysisTable2.vue'
import AnalysisTable3 from '../../../component/AnalysisTable3.vue'
import Location from '../../../component/Location.vue'
import BtmTab from '../../../component/BtmTab.vue'
import BtmChartBox from '../../../component/BtmChartBox.vue'
import PeopleNum from '../../../component/PeopleNum.vue'
import PeopleNumC from '../../../component/PeopleNumC.vue'
import Calender from '../../../component/Calendar.vue'
import Linkage from '../../../component/Linkage.vue'
import ClearFix from '../../../component/ClearFix.vue'
import EchartAMap from '../../../component/EchartAMap.vue'
import LaiyuanTable from '../../../component/LaiyuanTable.vue'
import LaiyuanTab from '../../../component/LaiyuanTab.vue'
import { theCitys, theCityData, rectangleDataObj } from '../../../common/mapData'
import CityCodeMap from '../../../utils/CityCodeMap'
import GpsUtil from '../../../utils/GpsUtil'
import PlacePointView from '../../../common/data'
import TrafficView from '../../../common/traffic'
import MapBase from '../../../common/reli'

export default {
  data () {
    return {
      defaultFeatures: ['bg', 'building', 'point'], // 地图默认特征
      roadFeatures: ['bg', 'building', 'point', 'road'], // 显示公路的 特征
      CTDataObj1: {hasLine: true, iconId: 1, font: '各行业人数分析'},
      CTDataObj2: {hasLine: true, iconId: 1, font: '城市人数分析'},
      CTDataObj3: {hasLine: true, iconId: 2, font: '预警枢纽列表'},
      CTDataObj4: {hasLine: true, iconId: 1, font: '枢纽人数排行'},
      bgHeight: null, // 左右背景的高度
      resData: null, // 区域实时总人数及该区域预警枢纽列表(接口返回的数据)
      totalHinge: null, // 总枢纽数
      normalHinge: null, // 正常枢纽数
      warningHinge: null, // 告警枢纽数
      curLocation: {name: '全部市', adcode: 440000}, // 当前位置, 默认全部(广东省)
      preLocation: null, // 记录上一个位置
      cityMarkers: [], // 存放地图标记点(城市)
      hingeMarkers: [], // 存放地图标记点(枢纽)
      warningList: [], // 处理后的枢纽预警列表
      showReturnBtn: false, // 返回按钮显示开关
      showChartL1: true, // 省界面 各行业人数分析表 显示开关
      positionInfoList: [], // 枢纽数据列表 名称 id等
      showHingeName: true, // 显示枢纽点名称 开关
      positionId: null, // 当前枢纽id
      curDate: null, // 当前全局日期
      showLaiyuan: false, // 显示来源去向
      lineData: null, // 来源去向线数据
      level: 1,
      areaMod: 1,
      colors: ['#ff5555', '#ff8155', '#ffc955', '#cafd4f', '#4ffd5f', '#4ffdca', '#4fe2fd', '#4f99fd', '#3b4dff', '#644cdb'],
      scope: null // 1:省内 2:省外 3:境外   来源去向的tab状态记录

    }
  },
  components: {
    Header,
    ChartTitle,
    HingeTable,
    AnalysisTable,
    Location,
    HingeRankingTable,
    BtmTab,
    AnalysisTable2,
    PeopleNum,
    PeopleNumC,
    Calender,
    Linkage,
    AnalysisTable3,
    BtmChartBox,
    ClearFix,
    EchartAMap,
    LaiyuanTable,
    LaiyuanTab
  },
  computed: {
    mapStatus () { // 地图状态 1代表省(默认) 2代表市 3代表区 跟随curLocation改变而改变
      const adcode = this.curLocation.adcode
      if (!adcode) { // 枢纽
        return 3
      } else if (adcode !== 440000 && adcode !== 100000) { // 地市
        return 2
      } else if (adcode === 440000) { // 广东省
        return 1
      } else if (adcode === 100000) { // 全国
        return 0
      }
    }
  },
  watch: {
    curLocation (newVal, oldVal) {
      console.log(`当前位置： ${newVal.name}`)
      this.preLocation = oldVal
      window.curLocation = newVal
      window.positionId = this.positionId = this.getPositionId()
      const status = this.mapStatus
      window.mapStatus = this.mapStatus
      window.traffic.removePaths() // 清除画的框
      window.mapbase.removeReli() // 清除热力
      if (status === 1) { // 省
        this.showCityMarkers()
        this.removeHingeMarkers()
        this.showReturnBtn = false
        this.showChartL1 = true
      } else if (status === 2) { // 地市
        this.hideCityMarkers()
        this.removeHingeMarkers()
        this.renderHingeMarkers(this.findCityHinge())
        this.showReturnBtn = true
        this.showChartL1 = false
      } else { // 枢纽点
        this.hideHingeMarkers()
        this.moveToPoint()
        return
      }
      this.switch2AreaNode(newVal.adcode)
      window.theMap.setPitch(45)
      this.getAreaFlowAndWarningList()
    },
    lineData (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.refresh(newValue)
      }
    }
  },
  mounted () {
    window.echarts = echarts
    window.mapbase = new MapBase()
//    this.initMap()
    this.initChart()
    this.initDistrict()
//    this.refresh({name: '', items: [{from: '广州南站', to: '北京', value: 1000}]})
  },
  created () {
    this.setDate()
    this.getAreaFlowAndWarningList()
    this.getPositionInfoList()
  },
  methods: {
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
          map: window.theMap
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
//          let props = feature.properties
//          console.log(props.adcode)
//          me.curLocation.name = props.name // 改变地点
//          me.curLocation.adcode = props.adcode // 改变地点
//          // 如果存在子节点
//          if (props.childrenNum > 0) {
//            // 切换聚焦区域
//            switch2AreaNode(props.adcode)
//          }
        })

        // 外部区域被点击
        districtExplorer.on('outsideClick', function (e) {
//          districtExplorer.locatePosition(e.originalEvent.lnglat, function (error, routeFeatures) {
//            if (routeFeatures && routeFeatures.length > 1) {
//              // 切换到省级区域
//              switch2AreaNode(routeFeatures[1].properties.adcode)
//            } else {
//              // 切换到全国
//              switch2AreaNode(100000)
//            }
//
//          }, {
//            levelLimit: 2
//          })
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
          window.theMap.setBounds(areaNode.getBounds(), null, null, true)
          if (window.mapStatus === 2) {
            window.theMap.setZoom(9.5) // todo 不同城市同一缩放级别有显示问题
          }
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
//            return
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

        me.switch2AreaNode = function (adcode) {
          switch2AreaNode(adcode)
        }
        window.switch2AreaNode = switch2AreaNode

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
            //            me.getAreaNode(areaNode)
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
//                switch2AreaNode(100000)
      })
    },
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
        zoom: 7.5,
        expandZoomRange: true, // 改变最大缩放等级
        zooms: [7.5, 20], // 改变最大缩放等级
        keyboardEnable: false,
        layers: [
          //satellite,
          // building,
          //roadNet
        ]
      })
      window.theMap = theMap
      window.pointControl = new PlacePointView(window.theMap)
      window.traffic = new TrafficView(window.theMap)
    },
    initChart () {
      var me = this
      this.chartMap = window.echarts.init(this.$refs.chartMap)
      this.chartMap.setOption({
        backgroundColor: '',
        title: {
          text: '',
          //subtext: '数据覆盖率',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        amap: {
          maxPitch: 60,
          pitch: 45, //45 俯仰角
          viewMode: '3D',
          zoom: 7.5,
          expandZoomRange: true,
          mapStyle: 'amap://styles/785cdb67af60cfce35e24e8d6c56ed75', //地图主题
          center: [113.275824, 22.994826], //中心点
          rotation: 0,  //顺时针旋转角度
          resizeEnable: true,
          zooms: [4.5, 20], // 改变最大缩放等级
          keyboardEnable: false,
          layers: [
            //satellite,
            // building,
            //roadNet
          ],
          defaultFeatures: ['bg', 'building', 'point']
        },
        animation: false,
        series: []
      })
      window.theMap = this.chartMap.getModel().getComponent('amap').getAMap()
      window.theMap.setFeatures(this.defaultFeatures)
      var layer = this.chartMap.getModel().getComponent('amap').getLayer()
      window.pointControl = new PlacePointView(window.theMap)
      window.traffic = new TrafficView(window.theMap)
      layer.render = function () {
        var theOptions = me.chartMap.getOption()
        me.chartMap.setOption({
          series: theOptions.series
        })
      }
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
     * 创建hover地图点的 dom (城市)
     * @param dataObj 数据对象
     */
    createInfoDiv (dataObj) {
      let thePoint = document.createElement('div')
      let infoDiv = document.createElement('div')
      let line1 = document.createElement('div')
      let line2 = document.createElement('div')
      let line3 = document.createElement('div')
      let line4 = document.createElement('div')

      thePoint.className = 'the-point'
      infoDiv.className = 'info-div'
      line1.innerHTML = dataObj.name
      line2.innerHTML = `枢纽点总人数: ${utils.num2Wan(dataObj.totalNum)}万`
      line3.innerHTML = `所有枢纽数: ${dataObj.totalHinge}个`
      line4.innerHTML = `预警枢纽数: ${dataObj.warningHinge}个`
      infoDiv.appendChild(line1)
      infoDiv.appendChild(line2)
      infoDiv.appendChild(line3)
      infoDiv.appendChild(line4)
      thePoint.appendChild(infoDiv)
      thePoint.onclick = () => {
        this.clickCityMarker(dataObj.name)
      }
      return thePoint
    },
    /**
     * 创建hover地图点的 dom (枢纽)
     * @param dataObj 数据对象
     */
    createInfoDiv2 (dataObj) {
      let imgObj = {
        '轻度预警': require('../assets/枢纽点_轻度_正常.png'),
        '中度预警': require('../assets/枢纽点_中度_正常.png'),
        '重度预警': require('../assets/枢纽点_重度_正常.png'),
        '舒适': '' // todo 没有图片
      }
      let thePoint = document.createElement('div')
      let infoDiv = document.createElement('div')
      let hoverDiv = document.createElement('div')
      let line1 = document.createElement('div')
      let line2 = document.createElement('div')
      let line3 = document.createElement('div')
      let img = document.createElement('img')

      thePoint.className = 'hinge-point'
      infoDiv.className = 'hinge-name'
      infoDiv.style.display = this.showHingeName ? 'block' : 'none' // 根据状态显示隐藏
      hoverDiv.className = 'hinge-hover'
//      debugger
      if (dataObj.status) {
        img.src = imgObj[dataObj.status]
      } else { // todo 没有状态 默认图片
        img.src = imgObj['轻度预警']
      }
      infoDiv.innerHTML = dataObj.positionName
      line1.innerHTML = dataObj.positionName
      line2.innerHTML = `实时总人数: ${utils.num2Wan(dataObj.totalNum)}万`
      line3.innerHTML = `状态: ${dataObj.status}`
      hoverDiv.appendChild(line1)
      hoverDiv.appendChild(line2)
      hoverDiv.appendChild(line3)
      thePoint.appendChild(infoDiv)
      thePoint.appendChild(img)
      thePoint.appendChild(hoverDiv)
      thePoint.onclick = () => {
        this.clickHingeMarker(dataObj)
      }
      return thePoint
    },
    /**
     * 点击地图点(城市的地图点)
     * @param name 地点名字
     */
    clickCityMarker (name) {
      const theName = name
      let theObj = null
      for (let obj of theCityData) {
        if (theName === obj.name) {
          theObj = {name: obj.name, adcode: obj.adcode}
        }
      }
      if (!theObj) {
        console.log('没有对应的地点')
        return
      }
      this.curLocation = theObj
    },
    /**
     * 点击地图点(枢纽的地图点)
     * @param dataObj 地点数据对象
     */
    clickHingeMarker (dataObj) {
      const theName = dataObj.positionName
      this.curLocation = {name: theName, adcode: ''}
    },
    /**
     * 画城市点
     */
    renderCityMarkers () {
      if (this.cityMarkers) { // 清空
        this.removeCityMarkers()
      }
      for (let obj of theCitys) {
        let theDom = this.createInfoDiv(obj)
        let thelngLat = obj.lnglat
        let thelngLats = thelngLat.split(',')
        let marker = new AMap.Marker({
          position: new AMap.LngLat(parseFloat(thelngLats[0]), parseFloat(thelngLats[1])), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '',
          //          content: '<div style="color:white;width: 3em;font-size:10px;font-weight:bold;">' + theCityName + '</div>'
          content: theDom
        })
        this.cityMarkers.push(marker)
        window.theMap.add(marker)
      }
    },
    /**
     * 画枢纽点
     * @param theList 枢纽点 数组
     */
    renderHingeMarkers (theList) {
      if (this.hingeMarkers) { // 清空
        this.removeHingeMarkers()
      }
      for (let obj of theList) {
        let theDom = this.createInfoDiv2(obj)
        let thelngLat = obj.lnglat
        let thelngLats = thelngLat.split(',')
        let marker = new AMap.Marker({
          position: new AMap.LngLat(parseFloat(thelngLats[0]), parseFloat(thelngLats[1])), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '',
          //          content: '<div style="color:white;width: 3em;font-size:10px;font-weight:bold;">' + theCityName + '</div>'
          content: theDom
        })
        this.hingeMarkers.push(marker)
        window.theMap.add(marker)
      }
    },
    /**
     * 隐藏markers
     */
    hideCityMarkers () {
      for (let m of this.cityMarkers) {
        m.hide()
      }
    },
    hideHingeMarkers () {
      for (let m of this.hingeMarkers) {
        m.hide()
      }
    },
    /**
     * 显示markers
     */
    showCityMarkers () {
      for (let m of this.cityMarkers) {
        m.show()
      }
    },
    showHingeMarkers () {
      for (let m of this.hingeMarkers) {
        m.show()
      }
    },
    /**
     * 删除markers
     */
    removeCityMarkers () {
      window.theMap.remove(this.cityMarkers)
    },
    removeHingeMarkers () {
      window.theMap.remove(this.hingeMarkers)
    },
    /**
     * 获取区域实时总人数及该区域预警枢纽列表
     */
    getAreaFlowAndWarningList () {
      const theName = this.curLocation.name
      const url = 'position/getAreaFlowAndWarningList?city=' + theName
      const data = {}
      this.resData = null
      postData(url, data).then((res) => {
        console.log(res)
        if (!res.data) {
          console.log(`getAreaFlowAndWarningList: ${theName} 没有数据`)
          return
        }
        this.resData = res.data
        this.calHingeNum()
        const status = this.mapStatus
        if (status === 1) {
          this.calWarningList()
          this.renderCityMarkers()
        } else if (status === 2) {
          this.calHingeList()
          this.renderHingeMarkers(this.findCityHinge())
        }
      })
    },

    /**
     * 计算枢纽数量
     */
    calHingeNum () {
      const theArr = ['warningList_qd', 'warningList_ss', 'warningList_yz', 'warningList_zd']
      let normalNum = 0
      let totalNum = 0
      for (let item of theArr) {
        this.warningList = this.warningList.concat(this.resData[item])
        let len = this.resData[item].length
        totalNum += len
        if (item === 'warningList_ss') {
          normalNum = len
        }
      }
      this.totalHinge = totalNum
      this.normalHinge = normalNum
      this.warningHinge = totalNum - normalNum
    },
    /**
     * 计算各个城市的 总人数 总枢纽数 预警的枢纽数
     */
    calWarningList () {
      for (let cityObj of theCitys) {
        cityObj['totalNum'] = 0 // 总人数
        cityObj['totalHinge'] = 0 // 总枢纽数
        cityObj['warningHinge'] = 0 // 预警枢纽数
      }
      const theKeyArr = ['warningList_qd', 'warningList_ss', 'warningList_yz', 'warningList_zd']

      for (let item of theKeyArr) {
        let theArr = this.resData[item]
        for (let obj of theArr) {
          for (let cityObj of theCitys) {
            if (obj.city === cityObj.name) { // 相等才进行操作
              cityObj['totalNum'] += obj.num // 人数
              cityObj['totalHinge']++ // 枢纽数
              if (item !== 'warningList_ss') {
                cityObj['warningHinge']++ // 预警的枢纽数
              }
            }
          }
        }
      }
    },
    /**
     * 计算枢纽的总人数, 预警状态
     */
    calHingeList () {
      for (let hingeObj of this.positionInfoList) {
        hingeObj['totalNum'] = 0 // 总人数
        hingeObj['status'] = '' // 枢纽状态 轻度 中度 重度
      }
      const theKeyArr = ['warningList_qd', 'warningList_ss', 'warningList_yz', 'warningList_zd']
      const statusMap = {
        'warningList_qd': '轻度预警',
        'warningList_ss': '舒适',
        'warningList_yz': '重度预警',
        'warningList_zd': '中度预警'
      }
      for (let item of theKeyArr) {
        let theArr = this.resData[item]
        for (let obj of theArr) {
          for (let hingeObj of this.positionInfoList) {
            if (obj.positionName === hingeObj.positionName) { // 相等才进行操作
              hingeObj['totalNum'] += obj.num // 人数
              hingeObj['totalHinge']++ // 枢纽数
              hingeObj['status'] = statusMap[item]
            }
          }
        }
      }
    },
    /**
     * 改变地点
     * @param posObj 位置对象 {name: string, adcode: number}
     */
    changeLocation (posObj) {
      console.log(posObj)
      this.curLocation = posObj
    },
    /**
     * 点击返回按钮
     */
    clickReturnBtn () {
      const status = this.mapStatus
      window.mapStatus = this.mapStatus
      if (status === 1) { // 省

      } else if (status === 2) { // 市 返回省视图
        this.curLocation = {name: '全部市', adcode: 440000}
      } else { // 枢纽 返回市视图
        const theName = this.curLocation.name
        this.showLaiyuan = false // 隐藏来源去向
        for (let pos of this.positionInfoList) {
          if (theName === pos.positionName) { // 找到枢纽
            this.curLocation = {name: pos.city, adcode: pos.adcode}
          }
        }
        this.lineData = {name: '', items: []} // 清除航线
      }
    },
    /**
     * 请求全部枢纽 名称 id 等数据 列表
     */
    getPositionInfoList () {
      const url = 'position/getPositionInfoList'
      const data = {}
      postData(url, data).then((res) => {
        console.log('getPositionInfoList:', res)
        this.positionInfoList = res.data
        this.findHingeLngLat()
        this.findCityAdcode()
        this.findHingeRectData()
      })
    },
    /**
     * 匹配枢纽点对应的坐标数据
     */
    findHingeLngLat () {
      const placePoints = window.pointControl.PlacePoints // 地图点数组 有经纬度数据
      for (let obj of this.positionInfoList) {
        let have = false
        for (let point of placePoints) {
          if (obj.positionName === point['枢纽名称']) {
            obj.lnglat = point['地址'][0]['lnglat']
            have = true
          }
        }
        if (!have) {
          console.log(`${obj.positionName} 没有坐标数据.`)
        }
      }
//      console.log(this.positionInfoList)
    },
    /**
     * 找到positionInfoList里对象的adcode
     */
    findCityAdcode () {
      for (let obj of this.positionInfoList) {
        let have = false
        for (let city of theCityData) { // 城市adcode 数据
          if (obj.city === city['name']) {
            obj.adcode = city.adcode
            have = true
          }
        }
        if (!have) {
          console.log(`${obj.city} 没有行政区号数据.`)
        }
      }
//      console.log(this.positionInfoList)
    },
    /**
     * 找到枢纽的画框的数据
     */
    findHingeRectData () {
      for (let obj of this.positionInfoList) {
        let have = false
        for (let name in rectangleDataObj) {
          if (obj.positionName === name) {
            obj.rectData = rectangleDataObj[name]
            have = true
            break
          }
        }
        if (!have) {
//          console.log(`${obj.city} 没有行政区号数据.`)
        }
      }
      window.positionInfoList = this.positionInfoList
    },
    /**
     * 找城市的枢纽点
     * @param type 枢纽类型 0:全部(默认全部) 1:交通枢纽 2:服务区 3:收费站
     */
    findCityHinge (type = 0) {
      const typeMap = {
        0: ['火车站', '客运站', '高速', '机场', '港口', '服务区', '收费站'],
        1: ['火车站', '客运站', '高速', '机场', '港口'],
        2: ['服务区'],
        3: ['收费站']
      }
      const typeArr = typeMap[type]
      const theCity = this.curLocation.name
      let theHingeArr = []
      for (let obj of this.positionInfoList) {
        if (obj.city === theCity) { // 取同一个名字的城市
          for (let theType of typeArr) {
            if (obj.positionType === theType) { // 取对应类型的站点
              theHingeArr.push(obj)
            }
          }
        }
      }
      return theHingeArr
    },
    /**
     * 处理显示隐藏枢纽名字
     * @param show boolean
     */
    handleShowHingeName (show) {
      this.showHingeName = show
      let domArr = document.getElementsByClassName('hinge-name')
      let theStyle = this.showHingeName ? 'block' : 'none'
      for (let dom of domArr) {
        dom.style.display = theStyle
      }
    },
    /**
     * 改变显示枢纽的种类
     * @param type 0:全部 1:交通枢纽 2:服务区 3:收费站
     */
    changeShowHingeType (type) {
      this.renderHingeMarkers(this.findCityHinge(type))
    },
    /**
     * 点击枢纽点后 移动放大到枢纽
     */
    moveToPoint () {
      window.districtExplorer.clearFeaturePolygons()
      let theName = this.curLocation.name
      for (let obj of this.positionInfoList) {
        if (theName === obj.positionName) {
          let lng = obj.lnglat.split(',')[0]
          let lat = obj.lnglat.split(',')[1]
          let arg = [parseFloat(lng), parseFloat(lat)]
          let theZoom = 18
          window.pointControl.MoveToPoint(arg, theZoom)
          window.traffic.drawTheRectangle(obj.rectData)
          window.mapbase.drawReli(theName, 1000) // todo 传枢纽点人数
        }
      }
    },
    /**
     * 日期改变
     * @param date 日期 字符串
     */
    changeDate (date) {
      this.curDate = date
      window.curDate = date
    },
    /**
     * 获取枢纽id
     * @returns {*}
     */
    getPositionId () {
      const theName = this.curLocation.name
      let theId = null
      for (let obj of this.positionInfoList) {
        if (theName === obj.positionName) {
          theId = obj.positionId
          break
        }
      }
      if (!theId) {
        console.log(`没有对应id: ${theName}`)
      }
      return theId
    },
    /**
     * 设置全局日期
     */
    setDate () {
      let st = new Date()
      let nowYear = st.getFullYear()
      let nowMonth = st.getMonth() + 1
      let nowDay = st.getDate()
      this.curDate = nowYear + '-' + utils.add0(nowMonth) + '-' + utils.add0(nowDay)
      window.curDate = this.curDate
      window.testDate = '2019-06-25' // 测试用
    },
    /**
     * 来演去向
     * @param bool
     */
    handleShowLaiyuan (bool) {
      this.showLaiyuan = bool
    },
    /*根据名字得到经纬度**/
    geoCoordMap (name) {
//      if (this.areaMod === 1) {
//        let theCityCode = CityCodeMap.getCountyCode('广东省', this.cityName, name)
//        //debugger;
//        return GpsUtil.getByAreaCode(theCityCode)
//      }
//      else {
//        return GpsUtil.getByCityName(name)
//      }
      return GpsUtil.getByCityName(name)

    },
    /**根据名称转换经纬度*/
    convertData (data) {
      var res = []
      if (!data) {
        return {
          lines: [],
          points: []
        }
      }
      var theValidPoints = []
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i]
//        debugger
        var fromCoord = this.geoCoordMap(dataItem.from)
        var toCoord = this.geoCoordMap(dataItem.to)
        if (fromCoord && toCoord) {
          fromCoord = [parseFloat(fromCoord[0]), parseFloat(fromCoord[1])]
          toCoord = [parseFloat(toCoord[0]), parseFloat(toCoord[1])]
          var theLine = {
            fromName: dataItem.from,
            toName: dataItem.to,
            coords: [fromCoord, toCoord],
            //设置线段颜色
            lineStyle: {
              normal: {
                color: this.colors[i > 10 ? 9 : i],
                width: 2,
                curveness: 0.2
              }
            }
          }
          theValidPoints.push(dataItem)
          res.push(theLine)
        }
      }
      return {
        lines: res,
        points: theValidPoints
      }
    },
    /**根据数据进行呈现*/
    refresh (data) {
      var theMapName = data.name
      // var theMapPath = this.getMapPath(theMapName);
      var me = this
//      if (this.mapName !== theMapName) {
//        this.mapName = theMapName
//        this.navigateAddress(this.amap, this.mapName)
//      }
      // debugger;
      me.drawMap(data)
    },
    /**根据数据呈现到地图上*/
    drawMap (data) {
      // name
      // from to value
      var me = this
      var theMapName = data.name
      var theItems = data.items || []
      var theMapHash = {}

      var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'

      var theConvertResult = this.convertData(data.items)

      var thePoints = theConvertResult.points
      var theLines = theConvertResult.lines

      var thePintHash = {};
      var theValidPoints = [];
      for (var i = 0; i < thePoints.length; i++) {
        var thePoint = thePoints[i];
        if (!thePintHash[thePoint.from]) {
          thePintHash[thePoint.from] = true;
          theValidPoints.push(thePoint.from);
        }
        if (!thePintHash[thePoint.to]) {
          thePintHash[thePoint.to] = true;
          theValidPoints.push(thePoint.to);
        }
      }
      //var color = ['#a6c84c', '#ffa022', '#46bee9'];
      var color = ['#49ffff']//
      var series = []

      series.push(
        {
          // name: item[0] + ' Top10',
          type: 'lines',  //静态线
          zlevel: 1,
          'coordinateSystem': 'amap',
          effect: {
            show: false,
            period: 6,
            trailLength: 0.7,
            color: '#49ffff',//'#fff',
            symbolSize: 3
          },
          lineStyle: {
            normal: {
              color: '#49ffff',//color[i],
              width: 1,
              curveness: 0.2
            }
          },
          data: theLines,
        },
        {
          //name: item[0] + ' Top10',
          type: 'lines',  //动态线
          zlevel: 2,
          'coordinateSystem': 'amap',
          effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbol: 'arrow',
            symbolSize: 5,
            // shadowBlur: 10,
          },
          lineStyle: {
            normal: {
              color: color[0],
              width: 1,
              opacity: 0.5,
              curveness: 0.2,
              type: 'solid',
              // shadowBlur: 5,
              // shadowColor: color[i],
            }
          },
          // emphasis: {
          //   lineStyle: {
          //     color: {
          //       type: 'linear',
          //       x: 0,
          //       y: 0,
          //       x2: 0,
          //       y2: 1,
          //       colorStops: [{
          //           offset: 0, color: 'red' // 0% 处的颜色
          //       }, {
          //           offset: 1, color: 'blue' // 100% 处的颜色
          //       }],
          //       globalCoord: false // 缺省为 false
          //     }
          //   }
          // },
          symbol: ['none', 'arrow'],
          symbolSize: 10,
          data: theLines,

        },
        {
          //name: item[0] + ' Top10',
          type: 'effectScatter',
          'coordinateSystem': 'amap',
          // symbol:'emptyCircle',
          // markPoint: {
          //   symbol: 'circle',
          //   data: [
          //     {
          //       name: '某个坐标',
          //       coord: [110.365554,21.276724],
          //       value:965,

          //     }
          //   ]
          // },
          //   animationDelayUpdate: function (idx) {
          //     return 1000;
          // },
          effectType: 'ripple',

          hoverAnimation: true,
          // coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: '{b}'
            }
          },
          symbolSize: function (val) {
            return 8 + (val[2] / 10000)
          },
          itemStyle: {
            normal: {
              color: color[0],
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: theValidPoints.map(function (dataItem) {
//            var theLngLatPoints = me.geoCoordMap(me.queryDirection == 1 ? dataItem.from : dataItem.to)
//            var thePoss = [parseFloat(theLngLatPoints[0]), parseFloat(theLngLatPoints[1])]
//            return {
//              name: me.queryDirection == 1 ? dataItem.from : dataItem.to,
//              value: thePoss.concat([dataItem.value])
//            }
            var theLngLatPoints = me.geoCoordMap(dataItem);
            var thePoss = [parseFloat(theLngLatPoints[0]), parseFloat(theLngLatPoints[1])];
            return {
              name: dataItem,
              value: thePoss.concat([10])
            };
          }),
        }
      )
      var option = {
        series: series
      }

      // this.chartMap.clear();
      this.chartMap.setOption(option)

    },
    /**
     * 画线方法
     * @param dataobj
     */
    drawLine (dataobj) {
//      debugger
      this.lineData = dataobj
      this.scope = dataobj.scope // 1:省内 2:省外 3:境外
      if (this.scope === '1') {
        this.switch2AreaNode(440000)
      } else if (this.scope === '2') {
        this.switch2AreaNode(100000)
      } else {

      }
      this.drawLineCB()
    },
    /**
     * 画航线后的回调
     */
    drawLineCB () {
      window.mapbase.removeReli() // 去除热力
      let theCenter = [117.474401, 38.741769] // 设置中心
      window.theMap.setCenter(theCenter)
    }
  },
  beforeDestroy () {

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
  .mapview {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
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
    position: relative;
    z-index: 1000;
    color: #ffffff;
  }

  .the-bg {
    position: absolute;
    /*width: 584px;*/
    width: 554px;
    top: 0;
    /*pointer-events: none;*/
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
  .chart-l1-box {
    width: 500px;
    /*height: 368px;*/
    height: 36.87%;
    position: absolute;
    left: 0;
    /*top: 238px;*/
    bottom: 39.17%;
    /*display: none;*/
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

.return-btn {
  position: absolute;
  top: 18px;
  right: 13px;
  width: 100px;
  height: 40px;
  color: #f0ffff;
  font-size: 20px;
  display: flex;
  justify-content: space-around;
  border-radius: 19px;
  background-color: #2470c2;
  align-items: center;
  @include borderBox();
  padding: 0 8px;
}

</style>
