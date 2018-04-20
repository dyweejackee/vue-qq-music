// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'
import store from './store'
import VueResource from 'vue-resource'
import MuseUI from 'muse-ui'
import VueLazyload from 'vue-lazyload'

import 'muse-ui/dist/muse-ui.css'
import './common/style/index.scss'
import '../static/css/reset.css'
import 'swiper/dist/css/swiper.css'
// import FastClick from 'fastclick'

// FastClick.attach(document.body)

Vue.use(VueResource)
Vue.use(MuseUI)
// Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(VueLazyload,{
   preload: 1,
   loading: require('./assets/loading.gif'),
   error: require('./assets/imgError.jpg'),
   attempt: 3
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
