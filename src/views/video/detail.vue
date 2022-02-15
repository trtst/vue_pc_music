<template>
    <div class='video-detail'>
        <div class="v-video" :class="[isNight ? 'active' : '']">
            <div class="w1200">
                <div class="video-main">
                    <video-player
                        v-if="videoOptions.sources[0].src"
                        :options="videoOptions"
                        @play="onPlay"
                        @pause="onPause"
                        @seeking="onSeeking"
                        @qualityChange="onQualityChange"
                        />
                    <div class="v-light" :class="[isNight ? 'active' : '']" @click="toggleLight">
                        <i class="iconfont" :class="[isNight ? 'icon-night' : 'icon-day']"></i>
                    </div>
                </div>
                <div class="v-info">
                    <div class="v-info-hd">
                        <div class="info-name">{{videoDetail.title}}</div>
                        <router-link :to="{ path: '/user', query: { id: videoDetail.creator.userId }}" v-if="videoDetail.creator" class="song-author">By. {{videoDetail.creator.nickname}}</router-link>
                        <div class="v-info-count">
                            <span class="info-count">播放量：{{$utils.formartNum(videoDetail.playTime)}}</span><span class="info-time">发布时间：{{$utils.formartDate(videoDetail.publishTime, 'yyyy-MM-dd')}}</span>
                        </div>
                    </div>
                    <div class="v-desc">
                        {{videoDetail.briefDesc ? videoDetail.briefDesc : '暂无简介'}}
                    </div>
                </div>
            </div>
        </div>
        <div class="w1200">
            <div class="v-container">
                <div class="v-main">
                    <Comments :type="type" :id="vId"></Comments>
                </div>
                <div class="v-aside">
                    <div class="simi-video">
                        <h3 class="aside-title">相关视频</h3>
                        <div class="aside-main v-main">
                            <div class="item" :key="'' + item.id + index" v-for="(item, index) in simiVideo">
                                <router-link :to="{ path: item.type ? '/video' : '/mv', query: { id: item.vid }}" class="faceImg">
                                    <i class="iconfont icon-play"></i>
                                    <el-image :src="item.coverUrl">
                                        <div slot="placeholder" class="image-slot">
                                            <i class="iconfont icon-placeholder"></i>
                                        </div>
                                    </el-image>
                                    <span class="playCount"><i class="iconfont icon-video"></i><em>{{$utils.formartNum(item.playTime)}}</em></span>
                                    <div class="v-time">{{$utils.formatSongTime(item.durationms)}}</div>
                                </router-link>
                                <div class="info">
                                    <router-link :to="{ path: '/video', query: { id: item.vid }}" class="v-name">{{item.title}}</router-link>
                                    <router-link :to="{ path: '/user', query: { uid: author.userId }}" class="v-author" v-for="(author, k) in item.creator" :key="k">By. {{ k !== 0 ? ' / ' + author.userName : author.userName }}</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import videoPlayer from '@components/common/video'
import Comments from '@components/common/comments.vue'
import { mapMutations } from 'vuex'
export default {
    name: 'videoDetail',
    components: {
        videoPlayer,
        Comments
    },
    data () {
        // 这里存放数据
        return {
            vId: this.$route.query.id,
            videoDetail: {},
            type: 5, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            videoOptions: {
                sources: [{
                    type: '',
                    src: '' // url地址
                }],
                qualityList: [],
                quality: {}
            },
            currentTime: 0, // 当前视频播放的时长
            simiVideo: [],
            isNight: false
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    mounted () {
        this.init()
        this.setPlayStatus(false)
    },
    // 方法集合
    methods: {
        ...mapMutations({
            setPlayStatus: 'SET_PLAYSTATUS'
        }),
        async getVideoDetail () {
            const { data: res } = await this.$http.videoDetail({ id: this.vId })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.videoDetail = res.data
            this.videoOptions.qualityList = res.data.brs
            this.videoOptions.quality = res.mp
        },
        async getMvUrl (r) {
            const { data: res } = await this.$http.videoUrl({ id: this.vId, r })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.$set(this.videoOptions.sources, 0, {
                type: 'video/mp4',
                src: res.urls[0].url
            })
        },
        async getSimiMv () {
            const { data: res } = await this.$http.simiVideo({ id: this.vId })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.simiVideo = res.data
        },
        init () {
            const a = this.$http.videoDetail({ id: this.vId })
            const b = this.$http.videoUrl({ id: this.vId })

            this.currentTime = 0
            Promise.all([a, b]).then((val) => {
                val.forEach((item, index) => {
                    const res = item.data
                    if (index === 0) {
                        if (res.code !== 200) {
                            return this.$msg.error('数据请求失败')
                        }
                        this.videoDetail = res.data
                        this.videoOptions.qualityList = res.data.resolutions.map(item => {
                            const obj = {}
                            obj.br = item.resolution
                            obj.size = item.size
                            return obj
                        })
                    } else {
                        if (res.code !== 200) {
                            return this.$msg.error('数据请求失败')
                        }
                        this.$set(this.videoOptions.sources, 0, {
                            type: 'video/mp4',
                            src: res.urls[0].url
                        })
                        this.videoOptions.quality = { br: res.urls[0].r }
                    }
                })
            })
            this.getSimiMv()
        },
        onPlay (play) {
            play.currentTime(this.currentTime)
        },
        onSeeking (play) {
            this.currentTime = play.currentTime()
        },
        onPause (play) {
            this.currentTime = play.currentTime()
            play.pause()
        },
        onQualityChange (play) {
            // 切换清晰度时候的后续操作
            // 暂停MV播放
            this.onPause(play)
            // 记录当前播放时长
            this.currentTime = play.currentTime()
            // 重新设置视频url
            this.getMvUrl(play.quality.val)
        },
        toggleLight () {
            this.isNight = !this.isNight
        }
    },
    watch: {
        $route (newId, oldId) {
            this.vId = this.$route.query.id
            if (this.vId) {
                this.init()
            }
        }
    }
}
</script>
<style scoped lang="less">
.v-video {
    width: 100%;
    padding: 40px 0 20px;

    &.active {
        background: #1f1f1f;

        .info-name {
            color: #fff;
        }
    }
}
.video-main {
    position: relative;
    height: 675px;
    font-size: 0;

    .v-light {
        position: absolute;
        top: 50%;
        right: 0;
        width: 50px;
        height: 50px;
        line-height: 50px;
        margin-top: -25px;
        text-align: center;
        border-radius: 10px 0 0 10px;
        background: #fff;
        cursor: pointer;

        .iconfont {
            color: #000;
            font-size: 30px;
        }

        &.active {
            background: #333;

            .iconfont {
                color: #fff;
            }
        }
    }
}
.v-info-hd {
    display: flex;
    padding: 20px 0;

    .info-name {
        padding-right: 20px;
        font-size: 24px;
        line-height: 24px;
    }
    .song-author {
        line-height: 24px;
        color: #666;
    }
    .v-info-count {
        flex: 1;
        text-align: right;

        span {
            display: inline-block;
            padding-left: 20px;
            line-height: 24px;
            color: #999;
        }
    }
}
.v-desc {
    line-height: 20px;
    color: #999;
}
.v-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    margin-top: -20px;

    .v-main {
        flex: 1;
        padding-bottom: 100px;
        overflow: hidden;
    }

    .v-aside {
        width: 300px;
        padding: 40px 0 0 20px;
    }
}
.aside-title {
    position: relative;
    font-size: 16px;
    line-height: 24px;

    &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 18px;
        margin: 3px 5px 0 0;
        border-radius: 2px;
        background: @color-theme;
        vertical-align: top;
    }
}

.item {
    flex: 30%;
    margin: 20px 10px 0;
    border-radius: 4px;

    &:hover {
        .el-image {
            transform: scale(1.1);
        }

        .icon-play {
            opacity: 1;
            transform: scale(1);
        }
    }

    .faceImg {
        display: block;
        position: relative;
        width: 100%;
        height: 123px;
        overflow: hidden;

    }

    .playCount {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 4;
        font-size: 12px;
        display: block;
        width: 45%;
        text-align: center;
        color: #fff;
        line-height: 30px;
        border-radius: 0 4px 0 0;
        /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,000000+100&0+0,0.5+97 */
        background: -moz-linear-gradient(left,  rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 97%, rgba(0,0,0,0.5) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(left,  rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 97%,rgba(0,0,0,0.5) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right,  rgba(0,0,0,0) 0%,rgba(0,0,0,0.5) 97%,rgba(0,0,0,0.5) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#80000000',GradientType=1 ); /* IE6-9 */

        .icon-video {
            font-size: 18px;
            color: #fff;
        }

        em {
            display: inline-block;
            padding-left: 5px;
            font-style: normal;
        }
    }

    .v-time {
        position: absolute;
        left: 10px;
        bottom: 10px;
        z-index: 4;
        font-size: 14px;
        color: #fff;
        text-shadow: -2px 1px rgba(0,0,0,.4);
    }

    .icon-play {
        position: absolute;
        top: 50%;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
        margin-top: -30px;
        font-size: 60px;
        text-align: center;
        color: #fff;
        opacity: 0;
        transform: scale(.5);
        transition: all .4s linear;
        text-shadow: 2px 2px 10px #000;
    }

    .el-image {
        display:flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        z-index: 2;
        transition: all .4s linear;

        /deep/ img {
            height: auto;
        }
    }

    .info {
        position: relative;
        padding: 15px 0 0;

        .v-name {
            display: block;
            font-size: 14px;
        }

        .v-author {
            display: block;
            line-height: 24px;
            font-size: 14px;
            color: #999;
        }
    }
}
</style>
