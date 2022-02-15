import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import less from 'less'
import * as getApi from '@apis/http'
import utils from '@utils/utils'
import {
  Swiper as SwiperClass,
  Pagination,
  Mousewheel,
  Autoplay
} from 'swiper/core'
import infiniteScroll from 'vue-infinite-scroll'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'

import '@assets/css/global.css'
import '@assets/fonts/font.css'
import 'swiper/swiper-bundle.css'
import './plugins/elements.js'
import '@assets/less/reset.less'

import '@utils/directive'

SwiperClass.use([Pagination, Mousewheel, Autoplay])

Vue.use(less)
Vue.use(infiniteScroll)
Vue.use(getAwesomeSwiper(SwiperClass))

Vue.config.productionTip = false
Vue.prototype.$http = getApi
Vue.prototype.$utils = utils

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// router.beforeEach((to, from, next) => {
//   if (to.path === '/my' && !store.state.isLogin) {
//     console.log(store.state)
//     store.state.loginDialogVisible = true
//   } else {
//     next()
//   }
// })
