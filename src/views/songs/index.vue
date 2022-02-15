<template>
    <div v-if="info" class="song-container">
        <div class="w1200">
            <div class="song-sidebar">
                <div class="sidebar">
                    <div class="cover">
                        <div class="cover-img" :class="[isCurSong ? 'active' : '']" @click.stop="plyaing(info)">
                            <img src="@/assets/stylus.png" class="cover-stylus" />
                            <el-image :src="info.album.picUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                        </div>
                        <div class="cover-desc" v-if="coverDesc">
                            <h5>专辑简介</h5>
                            <p>{{coverDesc}}</p>
                        </div>
                        <div class="simi-song">
                            <h6>相似歌曲</h6>
                            <div class="simi-main">
                                <div class="simi-item" v-for="simiItem in simiSong" :key="simiItem.id">
                                    <div class="simi-info">
                                        <router-link class="simi-name" :to="{ path: '/song', query: { id: simiItem.id }}">
                                            {{ simiItem.name }}
                                        </router-link>
                                        <div class="simi-author"><router-link :to="{ path: '/singer', query: { id: author.id }}" class="song-author" v-for="(author, k) in simiItem.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link></div>
                                    </div>
                                    <div class="simi-song-status">
                                        <i v-if="simiItem.vip" class="iconfont icon-vip"></i>
                                        <i v-else @click="plyaing(simiItem)" :class="['iconfont', playSimiIcon(simiItem)]"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="song-main">
                <h3 class="song-name">
                    {{info.name}}
                    <router-link class="mv-name" :to="{ path: '/mv', query: { id: info.mvId }}" v-if="info.mvId">
                        <i class="iconfont icon-video"></i>
                    </router-link>
                    <i v-if="info.vip" class="iconfont icon-vip"></i>
                    <div class="audio-icon" v-if="isCurSong">
                        <div class="column" style="animation-delay: -1.2s;"></div>
                        <div class="column"></div>
                        <div class="column" style="animation-delay: -1.5s;"></div>
                        <div class="column" style="animation-delay: -0.9s;"></div>
                        <div class="column" style="animation-delay: -0.6s;"></div>
                    </div>
                </h3>
                <p><router-link :to="{ path: '/singer', query: { id: author.id }}" class="song-author" v-for="(author, k) in info.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link></p>
                <p class="song-info">
                    <span>专辑：<router-link class="song-album" :to="{ path: '/album', query: { id: info.album.id }}">{{ info.album.name }}</router-link></span>
                    <span>发行时间：<em>{{info.publishTime}}</em></span>
                </p>
                <div class="song-oper">
                    <span :class="['play-btn','play-all', songDisable]" @click="plyaing(info)"><i :class="['iconfont', playFontIcon]"></i> {{info.vip ? 'VIP尊享' : '立即播放'}}</span>
                    <template v-if="!isLogin">
                        <span class="play-btn play-collect" @click="showAddList"><i class="iconfont icon-collect"></i> 收藏</span>
                    </template>
                    <el-popover placement="bottom" trigger="click" ref="popAddList" v-else>
                        <span class="play-btn play-collect" slot="reference"><i class="iconfont icon-collect"></i> 收藏</span>
                        <add-list :tracks="info.id" @closeAddListPop="closeAddListPop"></add-list>
                    </el-popover>
                    <span class="play-btn play-comment" @click="jumpComment"><i class="iconfont icon-comment"></i> 评论</span>
                </div>
                <div class="song-lyric">
                    <Lyrics :sId="sId" local="page"></Lyrics>
                </div>
                <div class="song-comments" ref=comment>
                    <Comments :type="type" :id="sId"></Comments>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { formatSongInfo } from '@utils/song'
import Lyrics from '@components/common/lyrics.vue'
import Comments from '@components/common/comments.vue'
import addList from '@components/common/addlist.vue'
export default {
    name: 'song-detail',
    components: {
        Lyrics,
        Comments,
        addList
    },
    created () {
    },
    data () {
        // 这里存放数据
        return {
            info: null,
            sId: '0',
            type: 0, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            simiSong: []
        }
    },
    mounted () {
        this.sId = String(this.$route.query.id)
        this.init()
        window.addEventListener('scroll', this.handleScroll, true)
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters(['isLogin', 'playList', 'playIndex', 'isPlayed']),
        isCurSong () {
            return this.isPlayed && this.curSongInfo && this.curSongInfo.id === this.sId
        },
        // 当前播放状态
        playFontIcon () {
            return this.isCurSong ? 'icon-audio-pause' : 'icon-audio-play'
        },
        // 若是无版权获取vip歌曲 播放按钮置灰
        songDisable () {
            return (this.info.license || this.info.vip) ? 'disable' : ''
        },
        // 显示歌曲简介
        coverDesc () {
            return this.info.alia.join(' / ')
        },
        playSimiIcon () {
            return function (item) {
                return String(item.id) === this.curSongInfo.id && this.isPlayed ? 'icon-audio-pause' : 'icon-audio-play'
            }
        },
        curSongInfo () {
            return this.playList[this.playIndex]
        }
    },
    // 方法集合
    methods: {
        ...mapMutations({
            setLoginDialog: 'setLoginDialog',
            setPlayStatus: 'SET_PLAYSTATUS',
            setPlayList: 'SET_PLAYLIST',
            setPlayIndex: 'SET_PLAYINDEX'
        }),
        async getSongDetail () {
            const { data: res } = await this.$http.songDetail({ ids: this.sId, timestamp: new Date().valueOf() })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            // 是否有版权播放
            res.songs[0].license = !res.privileges[0].cp
            this.info = formatSongInfo(res.songs[0])
        },
        // 获取相似音乐
        async getSimiSong () {
            const { data: res } = await this.$http.simiSong({ id: this.sId })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            this.simiSong = res.songs.map(item => {
                return {
                    id: String(item.id),
                    name: item.name,
                    mvId: item.mvid,
                    singer: item.artists,
                    album: item.album,
                    alia: item.alias,
                    duration: this.$utils.formatSongTime(item.duration),
                    url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
                    vip: item.fee === 1,
                    license: item.license,
                    publishTime: item.publishTime
                }
            })
        },
        plyaing (params) {
            // 若当前唔歌曲 或者 当前播放歌曲不是本页显示的歌曲  立即播放当前页面歌曲
            if (!this.curSongInfo || this.curSongInfo.id !== params.id) {
                // 无版权及vip不可播放
                if (params.license) {
                    this.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
                    return
                }

                if (params.vip) {
                    this.$msg.error('付费歌曲，请在网易云音乐播放')
                    return
                }

                this.selectPlay({
                    list: [params]
                })
            } else {
                this.setPlayStatus(!this.isPlayed)
            }
        },
        closeAddListPop () {
            this.$refs.popAddList.doClose()
        },
        jumpComment () {
            this.$refs.comment.scrollIntoView(true)
        },
        init () {
            this.getSongDetail()
            this.getSimiSong()
        },
        showAddList () {
            if (!this.isLogin) {
                this.setLoginDialog(true)
                return false
            }
        },
        ...mapActions(['selectPlay', 'playAll'])
    },
    watch: {
        $route: {
            handler () {
                this.sId = this.$route.query.id
                this.init()
            },
            deep: true
        }
    }
}
</script>
<style scoped lang="less">
.song-container {
    padding: 40px 0;

    .song-sidebar {
        position: fixed;
        width: 310px;
    }

    .song-main {
        position: relative;
        margin-left: 400px;
    }
}

.cover {
    position: relative;
}
.cover-img {
    position: relative;
    width: 190px;
    padding: 40px;
    font-size: 0;
    background: url('../../assets/disc.png') no-repeat;
    background-size: contain;
    cursor: pointer;

    .cover-stylus {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        display: inline-block;
        width: 30px;
        height: 120px;
        transition: all .3s;
        transform-origin: 23px 5px;
        transform: rotateZ(-30deg);
    }

    .el-image {
        width: 190px;
        height: 190px;
        border-radius: 100%;
        animation: soundPaying 15s linear infinite;
        animation-play-state: paused;
    }

    &.active {
        .cover-stylus {
            transform: rotateZ(0);
        }

        .el-image {
            animation-play-state: running;
        }
    }

    // &::after {
    //     content: '';
    //     position: absolute;
    //     top: 50%;
    //     left: 50%;
    //     z-index: 2;
    //     width: 30px;
    //     height: 30px;
    //     border-radius: 100%;
    //     transform: translate(-50%,-50%);
    //     background: #000;
    //     box-shadow: 0px 2px 10px 20px rgba(150, 150, 150, 0.5);
    // }

    .iconfont {
        position: absolute;
        z-index: 3;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: #fff;
    }
}

.cover-desc {

    h5 {
        margin-top: 40px;
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 600;
        height: 30px;
        line-height: 30px;
    }

    p {
        width: 100%;
        font-size: 14px;
        color: #999;
        line-height: 21px;
        word-break: break-all;
    }
}

.simi-song {
    h6 {
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }
    .simi-name {
        line-height: 20px;
        font-size: 12px;
        color: #000;
    }

    .simi-author {
        font-size: 0;

        a {
            font-size: 12px;
            color: #999;
        }
    }

    .simi-item {
        display: flex;
        padding-top: 5px;
        border-bottom: 1px solid #f2f2f2;
        margin-bottom: 5px;
    }

    .simi-info {
        flex: 1;
    }

    .simi-song-status {
        line-height: 48px;

        i {
            cursor: pointer;
        }
    }
}

.song-name {
    font-size: 30px;
    line-height: 60px;
    padding-bottom: 10px;

    .iconfont {
        margin-right: 10px;
        font-size: 24px;
        color: @color-theme;
    }

    .audio-icon {
        display: inline-flex;
    }
}
.song-author {
    display: inline-block;
    font-size: 18px;
    color: #666;
    line-height: 18px;
}

.song-info {
    padding: 20px 0;
    font-size: 0;
    color: #999;

    span {
        display: inline-block;
        padding-right: 30px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
    }

    a, em {
        color: #333;
        font-style: normal;
    }
}

.song-oper {
    .play-btn {
        display: inline-block;
        line-height: 16px;
        align-items: center;
        border-radius: 50px;
        padding: 7px 15px;
        cursor: pointer;
        margin: 5px 15px 5px 0;
        background: #f0f0f0;
        color: #333;
    }

    .play-all {
        color: #fff;
        background: @color-theme;
        i {
            color: #fff;
        }
    }

    .disable {
        background: #ccc;
        cursor: not-allowed;
    }
}

@keyframes soundPaying {
    from {
        -webkit-transform: rotate(10deg);
        transform: rotate(10deg)
    }

    to {
        -webkit-transform: rotate(370deg);
        transform: rotate(370deg)
    }
}

.song-lyric {
    margin: 30px 0 10px;
    overflow-y: auto;
}

.song-comments {
    margin: 10px 0 30px;
}
</style>
