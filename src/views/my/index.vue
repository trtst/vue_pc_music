<template>
    <div class='my'>
        <div class="w1200">
            <div class="my-container">
                <div class="my-aside">
                    <h3 class="my-favorite active" @click="jump">我收藏的歌手 <i class="iconfont icon-arrow"></i></h3>
                    <h3 @click="toggleSlide('1')" :class="[slideBox1 ? 'active' : '']"><span>创建的歌单 ({{createdList.length}})</span> <i class="iconfont icon-arrow"></i></h3>
                    <div :class="['playlist-main', slideBox1 ? 'active' : '']">
                        <router-link :to="{ name: 'myPlaylist', query: { id: item.id } }" :class="['item', String(id) === String(item.id) ? 'active' : '']" class="item" v-for="(item, index) in createdList" :key="item.id">
                            <el-image :src="item.coverImgUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                            <div class="info">
                                <div class="name">{{item.name}}</div>
                                <div class="author">
                                    {{item.trackCount}}首 By. <span>{{ item.creator.nickname }}</span>
                                    <i class="iconfont icon-del" @click="delPlayList(item, index, 'created')" v-if="index"></i>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <h3 @click="toggleSlide('2')" :class="[slideBox2 ? 'active' : '']"><span>收藏的歌单 ({{collectList.length}})</span> <i class="iconfont icon-arrow"></i></h3>
                    <div :class="['playlist-main', slideBox2 ? 'active' : '']">
                        <router-link :to="{ name: 'myPlaylist', query: { id: item.id } }" :class="['item', String(id) === String(item.id) ? 'active' : '']" class="item" v-for="(item, index) in collectList" :key="item.id">
                            <el-image :src="item.coverImgUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                            <div class="info">
                                <div class="name">{{item.name}}</div>
                                <div class="author">
                                    {{item.trackCount}}首 By. <span>{{ item.creator.nickname }}</span>
                                    <i class="iconfont icon-del" @click="delPlayList(item, index, 'collect')"></i>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div class="my-main">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    components: {},
    created () {
        if (this.$route.path.indexOf('/my') >= 0 && !this.isLogin) {
            this.$router.push({ path: '/' })
        }
    },
    data () {
        // 这里存放数据
        return {
            createdList: [],
            collectList: [],
            slideBox1: false,
            slideBox2: false,
            id: this.$route.query.id
        }
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters(['isLogin', 'userInfo'])
    },
    mounted () {
        if (this.isLogin) {
            this.getUserPlayList()
        }
    },
    // 方法集合
    methods: {
        async getUserPlayList () {
            const { data: res } = await this.$http.playlistUser({ uid: this.userInfo.userId, limit: '', offset: '' })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.createdList = res.playlist.filter(item => {
                return !item.subscribed
            })
            this.collectList = res.playlist.filter(item => {
                return item.subscribed
            })

            if (!this.id && this.$route.path !== '/my/favorite') {
                this.id = this.createdList[0].id
                this.$router.push({ path: 'my/playlist', query: { id: this.id } })
            }
        },
        toggleSlide (index) {
            this['slideBox' + index] = !this['slideBox' + index]
        },
        async delPlayList (item, index, type) {
            const { data: res } = await this.$http.subPlayList({ id: item.id, t: (item.subscribed ? 2 : 1) })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            // 删除收藏歌单后，默认显示我喜欢的音乐
            this[type + 'List'].splice(index, 1)
            this.id = this.createdList[0].id
            this.$router.push({ path: '/my/playlist', query: { id: this.createdList[0].id } })
        },
        jump () {
            this.$router.push({ path: '/my/favorite' })
        }
    },
    watch: {
        $route () {
            this.id = this.$route.query.id

            if (!this.id && this.$route.path !== '/my/favorite') {
                this.id = this.createdList[0].id
                this.$router.push({ path: 'my/playlist', query: { id: this.id } })
            }
        }
    }
}
</script>
<style scoped lang="less">
.my-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
}
.my-aside {
    width: 300px;
    padding: 10px 0;
    margin: 40px 0;
    border-radius: 4px;
    overflow-y: auto;
    box-shadow: 0 0 20px 0 rgba(65,67,70,.05);

    h3 {
        display: flex;
        padding: 0 20px;
        line-height: 40px;
        font-size: 14px;
        justify-content: space-between;
        cursor: pointer;

        .iconfont {
            transition: all .3s ease-in-out;
        }

        &.active {
            .iconfont {
                transform: rotate(-90deg);
            }
        }
    }

    .my-favorite {
        cursor: pointer;
    }
}
.my-main {
    flex: 1;
    padding: 0 20px;
    margin: 40px 0;
    overflow-y: auto;
}
.playlist-main {
    overflow: hidden;

    .el-image {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
    }

    .item {
        display: flex;
        padding: 10px 20px;
        cursor: pointer;

        .icon-del {
            display: none;
        }

        &:hover {
            background:#f5f5f5;

            .icon-del {
                display: block;
            }
        }

        &.active {
            background:#f5f5f5;
        }
    }

    .info {
        flex: 1;
        padding-left: 10px;
    }

    .name {
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
        cursor: pointer;
    }

    .author {
        position: relative;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #999;

        span {
            display: inline-block;
            color: #666;
        }

        .icon-del {
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }

    &.active {
        height: 0;
    }
}

</style>
