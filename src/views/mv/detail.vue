<template>
    <div class='mv-detail'>
        <div class="mv-video" :class="[isNight ? 'active' : '']">
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
                    <div class="mv-light" :class="[isNight ? 'active' : '']" @click="toggleLight">
                        <i class="iconfont" :class="[isNight ? 'icon-night' : 'icon-day']"></i>
                    </div>
                </div>
                <div class="mv-info">
                    <div class="mv-info-hd">
                        <div class="info-name">{{mvDetail.name}}</div>
                        <router-link :to="{ path: '/singer', query: { id: author.id }}" class="song-author" v-for="(author, k) in mvDetail.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
                        <div class="mv-info-count">
                            <span class="info-count">播放量：{{$utils.formartNum(mvDetail.playCount)}}</span><span class="info-time">发布时间：{{mvDetail.publishTime}}</span>
                        </div>
                    </div>
                    <div class="mv-desc">
                        {{mvDetail.briefDesc ? mvDetail.briefDesc : '暂无简介'}}
                    </div>
                </div>
            </div>
        </div>
        <div class="w1200">
            <div class="mv-container">
                <div class="mv-main">
                    <Comments :type="type" :id="mId"></Comments>
                </div>
                <div class="mv-aside">
                    <div class="simi-mv">
                        <h3 class="aside-title">相似MV</h3>
                        <div class="aside-main mv-main">
                            <div class="item" :key="'' + item.id + index" v-for="(item, index) in simiMv">
                                <router-link :to="{ path: '/mv', query: { id: item.id }}" class="faceImg">
                                    <i class="iconfont icon-play"></i>
                                    <el-image :src="item.cover || item.imgurl">
                                        <div slot="placeholder" class="image-slot">
                                            <i class="iconfont icon-placeholder"></i>
                                        </div>
                                    </el-image>
                                </router-link>
                                <div class="info">
                                    <router-link :to="{ path: '/mv', query: { id: item.id }}" class="mv-name">{{item.name}}</router-link>
                                    <router-link :to="{ path: '/singer', query: { id: item.artistId }}" class="mv-author" v-if="!item.publishTime">{{item.artistName}}</router-link>
                                    <div class="mv-playCount"><i class="iconfont icon-video"></i> {{$utils.formartNum(item.playCount)}}</div>
                                    <div class="mv-time" v-if="item.publishTime">发布时间：{{item.publishTime}}</div>
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
    name: 'mvDetail',
    components: {
        videoPlayer,
        Comments
    },
    data () {
        // 这里存放数据
        return {
            mId: this.$route.query.id,
            mvDetail: {},
            type: 1, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            videoOptions: {
                sources: [{
                    type: '',
                    src: '' // url地址
                }],
                qualityList: [],
                quality: {}
            },
            currentTime: 0, // 当前视频播放的时长
            simiMv: [],
            isNight: false
        }
    },
    // 监听属性 类似于data概念
    computed: {
    },
    mounted () {
        this.init()
        this.setPlayStatus(false)
    },
    // 方法集合
    methods: {
        ...mapMutations({
            setPlayStatus: 'SET_PLAYSTATUS'
        }),
        async getMvDetail () {
            const { data: res } = await this.$http.mvDetail({ id: this.mId })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.mvDetail = res.data
            this.videoOptions.qualityList = res.data.brs
            this.videoOptions.quality = res.mp
        },
        async getMvUrl (r) {
            const { data: res } = await this.$http.mvUrl({ id: this.mId, r })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.$set(this.videoOptions.sources, 0, {
                type: 'video/mp4',
                src: res.data.url
            })
        },
        async getSimiMv () {
            const { data: res } = await this.$http.simiMv({ id: this.mId })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.simiMv = res.mvs
        },
        init () {
            const a = this.$http.mvDetail({ id: this.mId })
            const b = this.$http.mvUrl({ id: this.mId })

            this.currentTime = 0
            Promise.all([a, b]).then((val) => {
                val.forEach((item, index) => {
                    const res = item.data
                    if (index === 0) {
                        if (res.code !== 200) {
                            return this.$msg.error('数据请求失败')
                        }
                        this.mvDetail = res.data
                        this.videoOptions.qualityList = res.data.brs
                        this.videoOptions.quality = { br: res.mp.dl }
                    } else {
                        if (res.code !== 200) {
                            return this.$msg.error('数据请求失败')
                        }
                        this.$set(this.videoOptions.sources, 0, {
                            type: 'video/mp4',
                            src: res.data.url
                        })
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
            this.mId = this.$route.query.id
            if (this.mId) {
                this.init()
            }
        }
    }
}
</script>
<style scoped lang="less">
.mv-video {
    width: 100%;
    padding: 40px 0 20px;

    .video-box {
        width: 100%;
    }

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

    .mv-light {
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
.mv-info-hd {
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
    .mv-info-count {
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
.mv-desc {
    line-height: 20px;
    color: #999;
}
.mv-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    margin-top: -20px;

    .mv-main {
        flex: 1;
        padding-bottom: 100px;
        overflow: hidden;
    }

    .mv-aside {
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

        .mv-name {
            display: block;
            font-size: 14px;
        }

        .mv-author, .mv-playCount, .mv-time {
            display: block;
            line-height: 24px;
            font-size: 14px;
            color: #999;
        }

        .icon-video {
            font-size: 24px;
            color: #999;
            vertical-align: top;
        }
    }
}
</style>
