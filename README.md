# react-native-sk-navigator

##What is it

react-native-sk-navigator is a component wraps Navigator, supports:

1 Delegate Navigator

you can define it just like Navigator, by using Navigator's properties and methods

2 Be compatible with NavigatorIOS's api

```javascript

this.props.navigator.push({
  type: 'simple',
  component: LoginModal,
  passProps: passProps,
  leftButtonIcon: require('image!left_button'),
  onLeftButtonPress: () => this.props.navigator.pop(),
  rightButtonIcon: require('image!right_button'),
  onRightButtonPress: () => console.log('test')
  sceneConfig: {
    ...Navigator.SceneConfigs.VerticalDownSwipeJump,
    gestures: null,
    defaultTransitionVelocity: 10,
  }
});

```

3 Supports 3 types of navigation bar:

3.1 none: no navigation bar.

3.2 simple: navigation bar has only left button which go back.

3.3 default: navigation bar has title, left button and right button.

3.4 transparent: same with 'default', and its background is transparent.

##How to use it

1. `npm install react-native-sk-navigator@latest --save`

2. Write this in index.ios.js / index.android.js

```javascript

'use strict';
import React, {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Dimensions,
} from 'react-native';


var {SKNavigator} = require('react-native-sk-navigator');

// descript each type of navigation bar
var descriptions = {
  none: 'no navigation bar',
  simple: 'navigation bar has only left button which go back',
  default: 'navigation bar has title, left button and right button',
  transparent: 'navigation bar has title, left button and right button, \n and its background is transparent'
};

var Page = React.createClass({
  render() {
    return (
      <View style={styles.page}>
        {/* type */}
        <Text style={styles.title}>{'NavBar type: ' + this.props.type}</Text>
        {/* descript type */}
        <Text style={styles.desc}>{descriptions[this.props.type]}</Text>
        {/* back button */}
        <TouchableHighlight
          style={[styles.button, styles.goback]}
          underlayColor='#c8c7cc'
          onPress={() => this.props.navigator.pop()}
        >
          <Text>go back</Text>
        </TouchableHighlight>
      </View>
    );
  }
});


var Home = React.createClass({
  // push a new page and show different navigation bar according to type
  showPage(type){
    this.props.navigator.push({
      type: type, // none / simple / default / transparent
      title: 'NavBar type: ' + type,
      component: Page,
      passProps: {
        navigator: this.props.navigator,
        type: type
      },
      leftButtonIcon:require('./img/nav_left.png'),
      // leftButtonTitle: 'back',
      onLeftButtonPress: () => this.props.navigator.pop(),
      // rightButtonIcon:require('./img/nav_right.png'),
      rightButtonTitle: 'submit',
      onRightButtonPress: () => AlertIOS.alert('Submit', 'Are you want to submit?', [{text: 'yes'}]),
    });
  },

  renderButton(type, i){
    return (
      <TouchableHighlight
        key={i}
        style={styles.button}
        underlayColor='#c8c7cc'
        onPress={() => this.showPage(type)}
      >
        <Text>{type}</Text>
      </TouchableHighlight>
    )
  },

  render() {
    var types = ['none', 'simple', 'default', 'transparent'];
    return (
      <View style={styles.container}>
        {types.map(this.renderButton)}
      </View>
    );
  }
});

var test = React.createClass({
  render() {
    return (
      <SKNavigator
        initialRoute={{
           component: Home,
           title: 'Home',
           type: 'none',
           passProps: {
           }
         }}/>
    );
  }
});

var styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  page:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  desc: {
    fontSize: 14,
    color: 'green',
  },
  goback: {
    marginTop: 10
  }
};

AppRegistry.registerComponent('test', () => test);

```
![](https://raw.githubusercontent.com/shigebeyond/react-native-sk-navigator/master/demo.gif)

##SKNavigator's properties

Any [Navigator property](http://facebook.github.io/react-native/docs/navigator.html#props)

##SKNavigator's methods

Any [Navigator method](http://facebook.github.io/react-native/docs/navigator.html#navigator-methods)

##Route's properties

| Prop | Description | Default |
|---|---|---|
|**`component`**|Component to render in the next scense. |*None*|
|**`passProps`**|Properties which will be passed to component. |*None*|
|**`title`**|Title in the middle of navigation bar. |*None*|
|**`leftButtonTitle`**|Title of left button. |*None*|
|**`leftButtonIcon`**|Icon of left button. |*None*|
|**`onLeftButtonPress`**|Callback when left button pressed. |*None*|
|**`rightButtonTitle`**|Title of right button. |*None*|
|**`rightButtonIcon`**|Icon of right button. |*None*|
|**`onRightButtonPress`**|Callback when left button pressed. |*None*|
