// import React, { PureComponent } from 'react'
// import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect } from 'react-native-svg'
// import { StyleSheet, View, PanResponder } from 'react-native'

// export default class CircularSlider extends PureComponent {
//   static defaultProps = {
//     radius: 100, // 半径
//     strokeWidth: 20, // 线宽
//     openingRadian: Math.PI / 4, // 开口弧度，为了便于计算值为实际开口弧度的一半
//     backgroundTrackColor: '#e8e8e8', // 底部轨道颜色
//     linearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }], // 渐变色
//     sliderstrokeLinearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }], // 渐变色
//     sliderFillLinearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }],
//     outerRingLinearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }], // 渐变色
//     outerRingWidth: 3,
//     sliderStyle: { width: 20, height: 50, strokeWidth: 0 },
//     style: { width: 100, height: 100 },
//     contentContainerStyle: { flex: 1 },
//     onStartChange: () => { },
//     endMoveChange: () => { },
//     openStatus: false,
//     min: 0, // 最小值
//     max: 100, // 最大值
//     buttonBorderColor: '#fff', // 按钮边框颜色
//     // buttonRadius: 12, // 按钮半径
//     // buttonStrokeWidth: 1, // 按钮线宽
//   }

//   constructor(props) {
//     super(props)
//     this._panResponder = PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: this._handlePanResponderGrant,
//       onPanResponderMove: this._handlePanResponderMove,
//       onPanResponderRelease: this._handlePanResponderEnd,
//       onPanResponderTerminationRequest: () => false,
//       onPanResponderTerminate: this._handlePanResponderEnd
//     })

//     this.state = {
//       value: props.value || props.min
//     }

//     this._containerRef = React.createRef()
//   }

//   /**
//    * 更新value(供外部调用)
//    * @param {*} value 
//    */
//   updateValue(value) {
//     this.setState({ value: value });
//   }

//   /**
//    * 递增
//    */
//   incremental() {
//     const value = Math.min(this.state.value + 1, this.props.max);
//     this.setState({ value });
//     this.props.onComplete && this.props.onComplete(value);
//   }

//   /**
//    * 递减
//    */
//   decrement() {
//     const value = Math.max(this.state.value - 1, this.props.min);
//     this.setState({ value });
//     this.props.onComplete && this.props.onComplete(value);
//   }

//   _handlePanResponderGrant = () => {
//     /*
//      * 记录开始滑动开始时的滑块值、弧度和坐标，用户后续值的计算
//      */
//     const { value } = this.state
//     this._moveStartValue = value
//     this._moveStartRadian = this.getRadianByValue(value)
//     this._startCartesian = this.polarToCartesian(this._moveStartRadian)
//     this._fireChangeEvent('onStartChange');
//   };

//   _handlePanResponderMove = (e, gestureState) => {
//     const { min, max, step, openingRadian } = this.props
//     let { x, y } = this._startCartesian
//     x += gestureState.dx
//     y += gestureState.dy
//     const radian = this.cartesianToPolar(x, y) // 当前弧度
//     const ratio = (this._moveStartRadian - radian) / ((Math.PI - openingRadian) * 2) // 弧度变化所占比例
//     const diff = max - min // 最大值和最小值的差
//     this.props.endMoveChange();
//     let value
//     if (step) {
//       value = this._moveStartValue + Math.round(ratio * diff / step) * step
//     } else {
//       value = this._moveStartValue + ratio * diff
//     }
//     // 处理极值
//     value = Math.max(
//       min,
//       Math.min(max, value),
//     )
//     this.setState(({ value: curValue }) => {
//       value = Math.abs(value - curValue) > diff / 4 ? curValue : value // 避免直接从最小值变为最大值
//       return { value: Math.round(value) }
//     })
//     this._fireChangeEvent('onChange');
//   }


//   _handlePanResponderEnd = (e, gestureState) => {
//     if (this.props.disabled) {
//       return;
//     }
//     this._fireChangeEvent('onComplete');
//   }

//   _fireChangeEvent = event => {
//     if (this.props[event]) {
//       this.props[event](this.state.value);
//     }
//   };

//   /**
//    * 极坐标转笛卡尔坐标
//    * @param {number} radian - 弧度表示的极角
//    */
//   polarToCartesian(radian) {
//     const { radius, strokeWidth, outerRingWidth } = this.props
//     const distance = radius - strokeWidth / 2 + this._getExtraSize() + outerRingWidth / 2 // 圆心距离坐标轴的距离
//     const x = distance + radius * Math.sin(radian)
//     const y = distance + radius * Math.cos(radian)
//     return { x, y }
//   }

//   /**
//    * 笛卡尔坐标转极坐标
//    * @param {*} x 
//    * @param {*} y 
//    */
//   cartesianToPolar(x, y) {
//     const { radius, strokeWidth, outerRingWidth } = this.props
//     const distance = radius - strokeWidth / 2 + this._getExtraSize() + outerRingWidth / 2 // 圆心距离坐标轴的距离
//     if (x === distance) {
//       return y > distance ? 0 : Math.PI / 2
//     }
//     const a = Math.atan((y - distance) / (x - distance)) // 计算点与圆心连线和 x 轴的夹角
//     return (x < distance ? Math.PI * 3 / 2 : Math.PI / 2) - a
//   }

//   /**
//    * 获取当前弧度
//    */
//   getCurrentRadian() {
//     return this.getRadianByValue(this.state.value)
//   }

//   /**
//    * 根据滑块的值获取弧度
//    * @param {*} value 
//    */
//   getRadianByValue(value) {
//     const { openingRadian, min, max } = this.props
//     return (Math.PI - openingRadian) * 2 * (max - value) / (max - min) + openingRadian
//   }

//   /**
//    * 获取除半径外额外的大小，返回线宽和按钮直径中较大的
//    */
//   _getExtraSize() {
//     const { strokeWidth, sliderStyle } = this.props
//     return Math.max(strokeWidth, sliderStyle.height + sliderStyle.strokeWidth / 2);
//   }

//   _onLayout = () => {
//     const ref = this._containerRef.current
//     if (ref) {
//       ref.measure((x, y, width, height, pageX, pageY) => {
//         this.vertexX = pageX
//         this.vertexY = pageY
//       })
//     }
//   }

//   render() {
//     const {
//       radius,
//       strokeWidth,
//       backgroundTrackColor,
//       openingRadian,
//       linearGradient, sliderstrokeLinearGradient,
//       outerRingLinearGradient, outerRingWidth, sliderFillLinearGradient,
//       sliderStyle,
//       buttonBorderColor,
//       buttonFillColor,
//       openStatus,
//       style,
//       contentContainerStyle,
//       children
//     } = this.props
//     // console.log("--> " + this._getExtraSize());
//     const svgSize = radius * 2 - strokeWidth + this._getExtraSize() * 2 + outerRingWidth;
//     const startRadian = 2 * Math.PI - openingRadian // 起点弧度
//     const startPoint = this.polarToCartesian(startRadian)
//     const endPoint = this.polarToCartesian(openingRadian)
//     const currentRadian = this.getCurrentRadian() // 当前弧度
//     const curPoint = this.polarToCartesian(currentRadian)

//     const rootStyle = [styles.container, style, style && { width: Math.max(svgSize, style.width || 0), height: Math.max(svgSize, style.height || 0) }];
//     const cententPositionStyle = { width: radius * 2 - strokeWidth, height: radius * 2 - strokeWidth, position: 'absolute' };
//     const contentStyle = [
//       contentContainerStyle,
//       cententPositionStyle
//     ]

//     return (
//       <View onLayout={this._onLayout} ref={this._containerRef} style={rootStyle}>
//         <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}>
//           <Defs>
//             <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="gradient">
//               {
//                 linearGradient.map((item, index) => (
//                   <Stop
//                     key={index}
//                     offset={item.offset}
//                     stopColor={item.color}
//                   />
//                 ))
//               }
//             </LinearGradient>
//           </Defs>

//           <LinearGradient x1="-5%" y1="25%" x2="10%" y2="0%" id="outer_ring_gradient">
//             {
//               outerRingLinearGradient.map((item, index) => (
//                 <Stop
//                   key={index}
//                   offset={item.offset}
//                   stopColor={item.color}
//                 />
//               ))
//             }
//           </LinearGradient>

//           <Circle
//             cx={svgSize / 2}
//             cy={svgSize / 2}
//             r={radius + strokeWidth / 2 + outerRingWidth / 2}
//             fill='none'
//             stroke='url(#outer_ring_gradient)'
//             strokeWidth={outerRingWidth}
//           />
//           {/* <Path
//             strokeWidth={strokeWidth}
//             stroke={backgroundTrackColor}
//             fill="none"
//             strokeLinecap="square"
//             d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${startRadian - openingRadian >= Math.PI ? '1' : '0'},1,${endPoint.x},${endPoint.y}`}
//           /> */}
//           {openStatus && <Path
//             strokeWidth={strokeWidth}
//             stroke={openStatus ? "url(#gradient)" : "none"}
//             fill="none"
//             strokeLinecap="butt"
//             d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${startRadian - currentRadian >= Math.PI ? '1' : '0'},1,${curPoint.x},${curPoint.y}`}
//           />}
//           <Path
//             strokeWidth={strokeWidth}
//             stroke={openStatus ? "url(#gradient)" : "none"}
//             fill="none"
//             strokeLinecap="butt"
//             d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${startRadian - currentRadian >= Math.PI ? '1' : '0'},1,${curPoint.x},${curPoint.y}`}
//           />
//           <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="border_gradient">
//             {
//               sliderstrokeLinearGradient.map((item, index) => (
//                 <Stop
//                   key={index}
//                   offset={item.offset}
//                   stopColor={item.color}
//                 />
//               ))
//             }
//           </LinearGradient>
//           <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="fill_gradient">
//             {
//               sliderFillLinearGradient.map((item, index) => (
//                 <Stop
//                   key={index}
//                   offset={item.offset}
//                   stopColor={item.color}
//                 />
//               ))
//             }
//           </LinearGradient>
//           {
//             openStatus && <Rect
//               x={curPoint.x - sliderStyle.width / 2}
//               y={curPoint.y - strokeWidth / 2}
//               width={sliderStyle.width}
//               height={sliderStyle.height}
//               fill="url(#fill_gradient)"
//               stroke="url(#border_gradient)"
//               strokeWidth={sliderStyle.strokeWidth}
//               transform={"rotate(" + (-currentRadian) / Math.PI * 180 + " " + curPoint.x + " " + curPoint.y + ")"}
//             // {...this._panResponder.panHandlers} 
//             />
//           }
//           <Rect
//             x={curPoint.x - sliderStyle.width / 2 - 25}
//             y={curPoint.y - strokeWidth / 2 - 25}
//             width={sliderStyle.width + 50}
//             height={sliderStyle.height + 50}
//             fill={"none"}
//             transform={"rotate(" + (-currentRadian) / Math.PI * 180 + " " + curPoint.x + " " + curPoint.y + ")"}
//             {...this._panResponder.panHandlers}
//           />
//         </Svg>
//         <View style={contentStyle} >
//           {children}
//         </View>
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
// })


import React, { PureComponent } from 'react'
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect } from 'react-native-svg'
import { StyleSheet, View, PanResponder } from 'react-native'

export default class CircularSlider extends PureComponent {
  static defaultProps = {
    radius: 100, // 半径
    strokeWidth: 20, // 线宽
    openingRadian: Math.PI / 4, // 开口弧度，为了便于计算值为实际开口弧度的一半
    backgroundTrackColor: '#e8e8e8', // 底部轨道颜色
    linearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }], // 渐变色
    sliderstrokeLinearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }], // 渐变色
    sliderFillLinearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }],
    outerRingLinearGradient: [{ stop: '0%', color: '#1890ff' }, { stop: '100%', color: '#f5222d' }], // 渐变色
    outerRingWidth: 3,
    sliderStyle: { width: 20, height: 50, strokeWidth: 0 },
    style: { width: 100, height: 100 },
    contentContainerStyle: { flex: 1 },
    onStartChange: () => { },
    endMoveChange: () => { },
    openStatus: false,
    min: 0, // 最小值
    max: 100, // 最大值
    buttonBorderColor: '#fff', // 按钮边框颜色
    // buttonRadius: 12, // 按钮半径
    // buttonStrokeWidth: 1, // 按钮线宽
  }

  constructor(props) {
    super(props)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: this._handlePanResponderEnd
    })

    this.state = {
      value: props.value || props.min
    }

    this._containerRef = React.createRef()
  }

  /**
   * 更新value(供外部调用)
   * @param {*} value 
   */
  updateValue(value) {
    this.setState({ value: value });
  }

  /**
   * 递增
   */
  incremental() {
    const value = Math.min(this.state.value + 1, this.props.max);
    this.setState({ value });
    this.props.onComplete && this.props.onComplete(value);
  }

  /**
   * 递减
   */
  decrement() {
    const value = Math.max(this.state.value - 1, this.props.min);
    this.setState({ value });
    this.props.onComplete && this.props.onComplete(value);
  }

  _handlePanResponderGrant = () => {
    /*
     * 记录开始滑动开始时的滑块值、弧度和坐标，用户后续值的计算
     */
    const { value } = this.state
    this._moveStartValue = value
    this._moveStartRadian = this.getRadianByValue(value)
    this._startCartesian = this.polarToCartesian(this._moveStartRadian)
    this._fireChangeEvent('onStartChange');
  };

  _handlePanResponderMove = (e, gestureState) => {
    const { min, max, step, openingRadian } = this.props
    let { x, y } = this._startCartesian
    x += gestureState.dx
    y += gestureState.dy
    const radian = this.cartesianToPolar(x, y) // 当前弧度
    const ratio = (this._moveStartRadian - radian) / ((Math.PI - openingRadian) * 2) // 弧度变化所占比例
    const diff = max - min // 最大值和最小值的差
    this.props.endMoveChange();
    let value
    if (step) {
      value = this._moveStartValue + Math.round(ratio * diff / step) * step
    } else {
      value = this._moveStartValue + ratio * diff
    }
    // 处理极值
    value = Math.max(
      min,
      Math.min(max, value),
    )
    this.setState(({ value: curValue }) => {
      value = Math.abs(value - curValue) > diff / 4 ? curValue : value // 避免直接从最小值变为最大值
      return { value: Math.round(value) }
    })
    this._fireChangeEvent('onChange');
  }


  _handlePanResponderEnd = (e, gestureState) => {
    if (this.props.disabled) {
      return;
    }
    this._fireChangeEvent('onComplete');
  }

  _fireChangeEvent = event => {
    if (this.props[event]) {
      this.props[event](this.state.value);
    }
  };

  /**
   * 极坐标转笛卡尔坐标
   * @param {number} radian - 弧度表示的极角
   */
  polarToCartesian(radian) {
    const { radius, strokeWidth, outerRingWidth } = this.props
    const distance = radius - strokeWidth / 2 + this._getExtraSize() + outerRingWidth / 2 // 圆心距离坐标轴的距离
    const x = distance + radius * Math.sin(radian)
    const y = distance + radius * Math.cos(radian)
    return { x, y }
  }

  /**
   * 笛卡尔坐标转极坐标
   * @param {*} x 
   * @param {*} y 
   */
  cartesianToPolar(x, y) {
    const { radius, strokeWidth, outerRingWidth } = this.props
    const distance = radius - strokeWidth / 2 + this._getExtraSize() + outerRingWidth / 2 // 圆心距离坐标轴的距离
    if (x === distance) {
      return y > distance ? 0 : Math.PI / 2
    }
    const a = Math.atan((y - distance) / (x - distance)) // 计算点与圆心连线和 x 轴的夹角
    return (x < distance ? Math.PI * 3 / 2 : Math.PI / 2) - a
  }

  /**
   * 获取当前弧度
   */
  getCurrentRadian() {
    return this.getRadianByValue(this.state.value)
  }

  /**
   * 根据滑块的值获取弧度
   * @param {*} value 
   */
  getRadianByValue(value) {
    const { openingRadian, min, max } = this.props
    return (Math.PI - openingRadian) * 2 * (max - value) / (max - min) + openingRadian
  }

  /**
   * 获取除半径外额外的大小，返回线宽和按钮直径中较大的
   */
  _getExtraSize() {
    const { strokeWidth, sliderStyle } = this.props
    return Math.max(strokeWidth, sliderStyle.height + sliderStyle.strokeWidth / 2);
  }

  _onLayout = () => {
    const ref = this._containerRef.current
    if (ref) {
      ref.measure((x, y, width, height, pageX, pageY) => {
        this.vertexX = pageX
        this.vertexY = pageY
      })
    }
  }

  render() {
    const {
      radius,
      strokeWidth,
      backgroundTrackColor,
      openingRadian,
      linearGradient, sliderstrokeLinearGradient,
      outerRingLinearGradient, outerRingWidth, sliderFillLinearGradient,
      sliderStyle,
      buttonBorderColor,
      buttonFillColor,
      openStatus,
      style,
      contentContainerStyle,
      children
    } = this.props
    // console.log("--> " + this._getExtraSize());
    const svgSize = radius * 2 - strokeWidth + this._getExtraSize() * 2 + outerRingWidth;
    const startRadian = 2 * Math.PI - openingRadian // 起点弧度
    const startPoint = this.polarToCartesian(startRadian)
    const endPoint = this.polarToCartesian(openingRadian)
    const currentRadian = this.getCurrentRadian() // 当前弧度
    const curPoint = this.polarToCartesian(currentRadian)

    const rootStyle = [styles.container, style, style && { width: Math.max(svgSize, style.width || 0), height: Math.max(svgSize, style.height || 0) }];
    const cententPositionStyle = { width: radius * 2 - strokeWidth, height: radius * 2 - strokeWidth, position: 'absolute' };
    const contentStyle = [
      contentContainerStyle,
      cententPositionStyle
    ]

    return (
      <View onLayout={this._onLayout} ref={this._containerRef} style={rootStyle}>
        <Svg width={svgSize} height={svgSize} viewBox={"0 0 " + svgSize + " " + svgSize}>
          <Defs>
            <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="gradient">
              {
                linearGradient.map((item, index) => (
                  <Stop
                    key={index}
                    offset={item.offset}
                    stopColor={item.color}
                  />
                ))
              }
            </LinearGradient>
          </Defs>

          <LinearGradient x1="-5%" y1="25%" x2="10%" y2="0%" id="outer_ring_gradient">
            {
              outerRingLinearGradient.map((item, index) => (
                <Stop
                  key={index}
                  offset={item.offset}
                  stopColor={item.color}
                />
              ))
            }
          </LinearGradient>

          <Circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius + strokeWidth / 2 + outerRingWidth / 2}
            fill='none'
            stroke='url(#outer_ring_gradient)'
            strokeWidth={outerRingWidth}
          />
          {/* <Path
            strokeWidth={strokeWidth}
            stroke={backgroundTrackColor}
            fill="none"
            strokeLinecap="square"
            d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${startRadian - openingRadian >= Math.PI ? '1' : '0'},1,${endPoint.x},${endPoint.y}`}
          /> */}
          {/* <Path
            strokeWidth={strokeWidth}
            stroke={openStatus ? "url(#gradient)" : "none"}
            fill="none"
            strokeLinecap="butt"
            d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${startRadian - currentRadian >= Math.PI ? '1' : '0'},1,${curPoint.x},${curPoint.y}`}
          /> */}
          {
            openStatus && <Path
            strokeWidth={strokeWidth}
            stroke={openStatus ? "url(#gradient)" : "none"}
            fill="none"
            strokeLinecap="butt"
            d={`M${startPoint.x},${startPoint.y} A ${radius},${radius},0,${startRadian - currentRadian >= Math.PI ? '1' : '0'},1,${curPoint.x},${curPoint.y}`}
          />
          }

          <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="border_gradient">
            {
              sliderstrokeLinearGradient.map((item, index) => (
                <Stop
                  key={index}
                  offset={item.offset}
                  stopColor={item.color}
                />
              ))
            }
          </LinearGradient>
          <LinearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="fill_gradient">
            {
              sliderFillLinearGradient.map((item, index) => (
                <Stop
                  key={index}
                  offset={item.offset}
                  stopColor={item.color}
                />
              ))
            }
          </LinearGradient>
          {
            openStatus && <Rect
              x={curPoint.x - sliderStyle.width / 2}
              y={curPoint.y - strokeWidth / 2}
              width={sliderStyle.width}
              height={sliderStyle.height}
              fill="url(#fill_gradient)"
              stroke="url(#border_gradient)"
              strokeWidth={sliderStyle.strokeWidth}
              transform={"rotate(" + (-currentRadian) / Math.PI * 180 + " " + curPoint.x + " " + curPoint.y + ")"}
            // {...this._panResponder.panHandlers} 
            />
          }
          <Rect
            x={curPoint.x - sliderStyle.width / 2 - 25}
            y={curPoint.y - strokeWidth / 2 - 25}
            width={sliderStyle.width + 50}
            height={sliderStyle.height + 50}
            fill={"none"}
            transform={"rotate(" + (-currentRadian) / Math.PI * 180 + " " + curPoint.x + " " + curPoint.y + ")"}
            {...this._panResponder.panHandlers}
          />
        </Svg>
        <View style={contentStyle} >
          {children}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
})