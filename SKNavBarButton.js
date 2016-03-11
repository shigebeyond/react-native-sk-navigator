
'use strict'

var React = require('react-native');

var {
  Image,
  TouchableOpacity,
  StyleSheet
} = React;

/**
 * 导航栏按钮
 */
var SKNavBarButton = React.createClass({

  getDefaultProps: function(){
    return {
      type: 'left', // left / right
      icon: require('./img/nav_left.png'),
      onPress: null, // 不能直接定义(() => this.props.navigator.pop())， 否则找不到this对象
    };
  },

  render: function(){
    var style = [styles.button, styles[this.props.type + 'Button'], this.props.style],
        icon = this.props.icon,
        cb = this.props.onPress || (() => this.props.navigator.pop());
    return (
      <TouchableOpacity
        onPress={cb}
        style={style}>
        <Image source={icon}/>
      </TouchableOpacity>
    );
  },

});

var styles = StyleSheet.create({
  button:{
    position:'absolute',
    backgroundColor:'rgba(0,0,0,.5)',
    width:34,
    height:34,
    borderRadius: 17,
    top: 25,
    alignItems:'center', // 图片居中
    justifyContent:'center',
  },
  leftButton:{
    left: 12,
  },
  rightButton:{
    right: 12,
  },
});

module.exports = SKNavBarButton;
