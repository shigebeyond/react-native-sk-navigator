/**
 * 全局导航栈, 对Navigator进行以下扩展:
 *  1 兼容NavigatorIOS的api
 *    this.props.navigator.push({
 *      type: 'simple',
 *      // onLeftButtonPress: () => {}
 *      component: LoginModal,
 *      passProps: passProps,
 *      sceneConfig: {
 *        ...Navigator.SceneConfigs.VerticalDownSwipeJump,
 *        gestures: null,
 *        defaultTransitionVelocity: 10,
 *      }
 *    });
 *
 *  2 添加属性来控制导航栏的样式
 *    type属性: 1 none 不显示导航栏 2 simple 简单导航栏, 只有一个返回按钮 3 default 默认导航栏 4 transparent 透明背景的导航栏
 *
 * 通常情况下，SKNavigator导航栈中的内容如下
 * (index.ios.js ->) SKNavigator { Home > Settings/Profile/Login...}
 *                                    |-> TabBar
 *                                          |-> XXXList > XXXDetail > ...
 *                                          ...
 */
'use strict';

var React = require('react-native');
var {
  Navigator,
  Platform,
  BackAndroid,
  Dimensions
} = React;

var com = require('./common'),
    SKNavBar = require('./SKNavBar'),
    {width, height} = Dimensions.get('window');

var defaultSceneConfig = {
  ...Navigator.SceneConfigs.PushFromRight,
  defaultTransitionVelocity: 10,
  gestures: {
    ...Navigator.SceneConfigs.PushFromRight.gestures,
    pop: {
      ...Navigator.SceneConfigs.PushFromRight.gestures.pop,
      edgeHitWidth: width / 4,
    }
  }
};

var SKNavigator = React.createClass({
  _navigator: null, // 引用导航栏
  _navbar: null, // 引用导航头
  getInitialState: function(){
    return {
      type: 'default', // 导航栏类型 none/simple/default/transparent
    };
  },
  componentDidMount: function(){
    this.handleWillFocus();

    // 监听回退键事件
    if(Platform.OS == 'android'){
      BackAndroid.addEventListener('hardwareBackPress', function() {
        if (this._navigator.getCurrentRoutes().length > 1) {
          this._navigator.pop();
          return true;
        }
        return false;
      }.bind(this));
    }
  },
  componentWillUnmount: function() {
    // 清理监听器
    this._listeners && this._listeners.forEach(listener => listener.remove());
  },

  /**
   * 当前路由变化的事件处理
   * 作用：
   *    获得导航栏的样式
   *    触发tabbar的隐藏与显示
   * 调用时机：
   *    渲染第一个页面时，没有发生didfocus事件，需要在componentDidMount事件中手动调用
   *    渲染其他页面时，由didfocus事件来回调
   */
  handleWillFocus: function(event){
    // 获得路由
    var route;
    if(event){ // didfocus事件回调
      // console.log(event._type);
      route = event.data.route;
    }else{ // 渲染第一个页面时，需要手动调用
      // console.log('first scene');
      var { routeStack, presentedIndex } = this._navigator.state;
      route = routeStack[presentedIndex];
    }
    // 从路由中获得导航栏样式
    var { type } = route;
    // console.log(route);
    this._navbar && this._navbar.setState({ type: type || 'default' });
  },

  _setNavigatorRef: function(navigator) {
    if (navigator !== this._navigator) {
      this._navigator = navigator;

      if (navigator) {
        // Observe focus change events from the owner.
        this._listeners = [
          navigator.navigationContext.addListener('willfocus', this.handleWillFocus), // 监听导航事件，处理导航栏的显示、隐藏
          // navigator.navigationContext.addListener('didfocus', this.handleWillFocus),
        ];
      }
    }
  },
  render: function() {
    return (
      <Navigator
        ref={this._setNavigatorRef}
        navigationBar={(<SKNavBar ref={(navbar) => this._navbar = navbar}/>)} // 导航栏
        initialRoute={this.props.initialRoute} // 初始路由
        renderScene={(route, navigator) => { // 渲染场景（页面）
          // 解决导航栏跳转的bug:导航栏跳转到第二层页面时，导航头遮住页面内容 => 直接设置下一层的页面样式为 {marginTop: com.navBarHeight.TotalNavHeight}
          var style = (!route.type || route.type === 'default') ? {paddingTop: com.navBarHeight.TotalNavHeight} : {};
          return React.createElement(route.component, {
            ...route.passProps,
            navigator,
            style: [route.style, style]
          });
        }}
        configureScene={(route) => { // 配置场景动画（页面切换动画）
          // 弹出动画
          if (route.sceneConfig) return route.sceneConfig;
          return defaultSceneConfig;
        }}
        sceneStyle={{backgroundColor: 'white'}} // 设置每个场景的背景为白，以避免场景切换时新场景和旧场景出现重叠
        />
    );
  },
});

module.exports = SKNavigator;
