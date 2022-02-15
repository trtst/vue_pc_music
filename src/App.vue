<template>
    <el-container id='app' class="container">
        <el-header height="80px"><my-header></my-header></el-header>
        <el-main>
            <div class="layout">
                <router-view></router-view>
            </div>
            <my-footer></my-footer>
            <el-backtop target=".el-main" :bottom="backBottom">
                <img src="./assets/goTop.png" alt="">
            </el-backtop>
        </el-main>
        <Login v-if="loginDialogVisible"></Login>
        <play-bar v-show="isShowPlayBar"></play-bar>
    </el-container>
</template>

<script>
import myHeader from '@components/common/header.vue'
import myFooter from '@components/common/footer.vue'
import playBar from '@components/common/play-bar.vue'
import Login from '@components/common/login.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'app',
    components: {
        myHeader,
        myFooter,
        Login,
        playBar
    },
    data () {
        // 这里存放数据
        return {
            backBottom: 80
        }
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters(['isLogin', 'userInfo', 'loginDialogVisible']),
        isShowPlayBar () {
            return this.$route.path !== '/mv' && this.$route.path !== '/video'
        }
    },
    // 方法集合
    methods: {
    }
}
</script>
<style scoped>
.container {
    height: 100%;
}
.layout {
    min-height: calc(100vh - 80px - 40px);
}
</style>
