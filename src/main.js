import Vue from 'vue'
import App from './App.vue'
import router from './router'

//引入公共样式
import './assets/css/global.less'
//引入字体图标库
import './assets/fonts/iconfont.css'
//引入element-ui
import './plugins/element.js'
//引入axios
import './api'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
