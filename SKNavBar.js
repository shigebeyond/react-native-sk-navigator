'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Navigator,
  Text,
  TouchableOpacity,
  Image,
} = React;

var com = require('./common'),
    SKNavBarButton = require('./SKNavBarButton');

// 获得标题的样式
function getTitleStyle(type){
  var color = type == 'transparent' ? 'black' : 'white';
  return {color};
}

// 默认的导航栏组件的配置
var NavigationBarRouteMapper = {
  // 创建导航栏的左按钮
  LeftButton: function(route, navigator, index, navState) {
    if(route.type == 'none' || route.type == 'simple')
      return null;

    if((route.leftButtonIcon || route.leftButtonTitle) && route.onLeftButtonPress || index > 0){ // 当index > 0,即非首页,默认显示返回按钮
      var style = [styles.navBarButton, styles.navBarLeftButton],
          icon = route.leftButtonIcon || (route.leftButtonTitle ? null : require('./img/nav_left.png')),
          cb = route.onLeftButtonPress ? route.onLeftButtonPress : () => navigator.pop();
      return (
        <TouchableOpacity
          onPress={cb}
          style={style}>
          {
            icon ?
              <Image source={icon}/> :
              <Text style={[styles.navBarText, getTitleStyle(route.type)]}>{route.leftButtonTitle}</Text>
          }
        </TouchableOpacity>
      );
    }
    return null;
  },

  // 创建导航栏的右按钮
  RightButton: function(route, navigator, index, navState) {
    if(route.type == 'none' || route.type == 'simple')
      return null;

    if((route.rightButtonIcon || route.rightButtonTitle) && route.onRightButtonPress){
      var style = [styles.navBarButton, styles.navBarRightButton];
      return (
        <TouchableOpacity
          onPress={route.onRightButtonPress}
          style={style}>
          {
            route.rightButtonIcon ?
              <Image source={route.RightButtonIcon}/> :
              <Text style={[styles.navBarText, getTitleStyle(route.type)]}>{route.rightButtonTitle}</Text>
          }
        </TouchableOpacity>
      );
    }
    return null;
  },

  Title: function(route, navigator, index, navState) {
    if(route.type == 'none' || route.type == 'simple')
      return null;

    return (
      <View style={styles.navBarTitleBox}>
        <Text style={[styles.navBarText, styles.navBarTitleText, getTitleStyle(route.type)]}>
          {route.title}
        </Text>
    </View>
    );
  },
};

/**
 * 导航头
 * 特性：
 *    type状态: 1 none 不显示导航栏 2 simple 简单导航栏, 只有一个返回按钮 3 default 默认导航栏 4 transparent 透明
 *
 * 实现注意
 *    当样式为default时，是代理NavigatorNavigationBar
 *    代理NavigatorNavigationBar需要做到以下两点
 *    1 代替接收属性： 给NavigatorNavigationBar传递他需要的属性，如navigator/navState
 *    2 代理方法调用： 如updateProgress
 */
var SKNavBar = React.createClass({
  getInitialState: function(){
    return {
      type: 'default', // 导航栏类型 none/simple/default/transparent
    };
  },
  // 代理NavigatorNavigationBar的updateProgress()方法，否则导航栏文字总是显示上一个route的名字，而不是当前route
  updateProgress: function(
    /*number*/progress,
    /*number*/fromIndex,
    /*number*/toIndex
  ) {
    this.refs.defaultNavBar && this.refs.defaultNavBar.updateProgress(progress, fromIndex, toIndex);
  },
  render: function(){
    var { type } = this.state;
    if (type === 'none') { // 无导航栏
      return null;
    }

    if (type === 'simple') { // 简单导航栏: 只有一个返回按钮的导航栏组件
      return ( <SKNavBarButton navigator={this.props.navigator} /> );
    }

    var style = [styles.navBar];
    if (type === 'transparent') { // 透明导航栏
      style.push({ backgroundColor: 'transparent' });
    }

    // 默认导航栏
    return (
      <Navigator.NavigationBar
        {...this.props} // 必须给NavigatorNavigationBar传递props(navigator/navState)，否则渲染出错
        ref='defaultNavBar'
        routeMapper={NavigationBarRouteMapper}
        style={style}
        />
    );
  }
});

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: com.navBar.barTintColor,
  },
  navBarTitleBox: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 9,
  },
  navBarButton: {
    // backgroundColor: 'green',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBarLeftButton: {
    paddingLeft: 12.5,
    justifyContent: 'flex-start',
  },
  navBarRightButton: {
    paddingRight: 10,
    justifyContent: 'flex-end',
  },
  navBarButtonText: {
    color: 'white',
  },
});

module.exports = SKNavBar;
