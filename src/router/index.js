import Vue from 'vue'
import VueRouter from 'vue-router'
import Favorite from '@views/my/favorite.vue'
import Playlist from '@views/my/playlist.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/', redirect: '/index'
    }, {
        path: '/index', name: 'index', component: resolve => { require(['@views/index/index.vue'], resolve) }
    }, {
        path: '/rank', name: 'rank', component: resolve => { require(['@views/rank/index.vue'], resolve) }
    }, {
        path: '/playlist', name: 'playlist', component: resolve => { require(['@views/playlist/index.vue'], resolve) }
    }, {
        path: '/playlist/detail', name: 'playlistdetail', component: resolve => { require(['@views/playlist/detail.vue'], resolve) }
    }, {
        path: '/song', name: 'songs', component: resolve => { require(['@views/songs/index.vue'], resolve) }
    }, {
        path: '/singer', name: 'singer', component: resolve => { require(['@views/singer/index.vue'], resolve) }
    }, {
        path: '/album', name: 'album', component: resolve => { require(['@views/album/index.vue'], resolve) }
    }, {
        path: '/mvlist', name: 'mvlist', component: resolve => { require(['@views/mv/index.vue'], resolve) }
    }, {
        path: '/mv', name: 'mv', component: resolve => { require(['@views/mv/detail.vue'], resolve) }
    }, {
        path: '/my', name: 'my', children: [{ path: '/my/favorite', name: 'myFavorite', component: Favorite }, { path: '/my/playlist', name: 'myPlaylist', component: Playlist }], component: resolve => { require(['@views/my/index.vue'], resolve) }
    }, {
        path: '/artist', name: 'artist', component: resolve => { require(['@views/artist/index.vue'], resolve) }
    }, {
        path: '/search', name: 'search', component: resolve => { require(['@views/search/index.vue'], resolve) }
    }, {
        path: '/video', name: 'video', component: resolve => { require(['@views/video/detail.vue'], resolve) }
    }, {
        path: '/user', name: 'user', component: resolve => { require(['@views/user/index.vue'], resolve) }
    }
]

const router = new VueRouter({
    mode: 'hash',
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes
})

export default router
