<template>
    <div class='album' v-if="details">
        <div class="w1200">
            <div class="album-cover">
                <div class="album-img">
                    <el-image :src="details.picUrl">
                        <div slot="placeholder" class="image-slot">
                            <i class="iconfont icon-placeholder"></i>
                        </div>
                    </el-image>
                </div>
                <div class="album-info">
                    <div class="album-title">
                        {{details.name}}
                        <span>{{'#' + details.type}}</span>
                    </div>
                    <div class="album-singer">歌手：<router-link :to="{ path: '/singer', query: { id: author.id }}" class="song_name" v-for="(author, k) in details.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link></div>
                    <div class="album-time">发行时间：{{$utils.formartDate(details.publishTime, 'yyyy-MM-dd')}}</div>
                    <div class="album-company">发行公司：{{details.company}}</div>
                    <div class="album-desc" v-if="details.description">
                        <h5>歌单简介<em class="desc-close" v-if="isShowDesc" @click="isShowDesc = false"><i class="iconfont icon-closed"></i></em></h5>
                        <p  @click="showAllDesc">{{details.description}}</p>
                        <pre class="album-desc-all" v-if="isShowDesc">
                            {{details.description}}
                        </pre>
                    </div>
                </div>
            </div>
            <div class="detail-container">
                <div class="detail-main">
                    <div class="song-header">
                        <h4>包含歌曲列表 <em>{{details.size + '首歌'}}</em></h4>
                        <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
                        <span :class="['collect', dynamic.isSub ? 'active' : '']" @click="subAlbum"><i :class="['iconfont', 'icon-collect' + (dynamic.isSub ? '-active' : '')]"></i> {{ dynamic.isSub ? '已收藏' : '收藏'}}</span>
                    </div>
                    <song-list :songList="songList" :stripe="true"></song-list>
                    <div class="album-comments" ref=comment>
                        <Comments :type="type" :id="albumId"></Comments>
                    </div>
                </div>
                <div class="detail-aside">
                    <h3 class="aside-title">{{details.artists[0].name}}的其他专辑<router-link :to="{ path: '/singer', query: { id: details.artists[0].id, type: 'album' }}" class="album-more">全部>></router-link></h3>
                    <div class="aside-main aside-album-main">
                        <router-link class="aside-album-item" :to="{ path: '/album', query: { id: item.id }}" v-for="item in hotAlbums" :key="item.id">
                            <el-image :src="item.picUrl">
                                <div slot="placeholder" class="image-slot">
                                    <i class="iconfont icon-placeholder"></i>
                                </div>
                            </el-image>
                            <div class="aside-album-info">
                                <div class="aside-album-name">{{item.name}}</div>
                                <div class="aside-album-time">
                                    {{$utils.formartDate(details.publishTime, 'yyyy-MM-dd')}}
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { formatSongInfo } from '@utils/song'
import songList from '@components/common/song-list'
import Comments from '@components/common/comments.vue'
export default {
    name: 'albumDetail',
    components: {
        songList,
        Comments
    },
    mounted () {
        this.albumId = this.$route.query.id
        this._initialize()
    },
    data () {
        // 这里存放数据
        return {
            // 歌单详情
            albumId: '',
            details: null,
            songList: [],
            dynamic: {},
            hotAlbums: [],
            comments: [],
            type: 3, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            isShowDesc: false
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
        ...mapMutations({
            setPlayStatus: 'SET_PLAYSTATUS',
            setPlayList: 'SET_PLAYLIST',
            setPlayIndex: 'SET_PLAYINDEX'
        }),
        // 相关歌单推荐
        async getAlbum (params) {
            const { data: res } = await this.$http.album(params)

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            this.details = res.album
            this.songList = this._formatSongs(res.songs)
            this.getArtistAlbum()
        },
        async getAlbumDynamic (params) {
            const { data: res } = await this.$http.albumDynamic(params)

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.dynamic = res
        },
        async getArtistAlbum () {
            const { data: res } = await this.$http.artistAlbum({ id: this.details.artists[0].id, limit: 5 })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.hotAlbums = res.hotAlbums
        },
        // 专辑简介查看更多
        showAllDesc () {
            if (this.details.description.length > 120) {
                this.isShowDesc = !this.isShowDesc
            }
        },
        playAllSongs () {
            this.playAll({
                list: this.songList
            })
        },
        async subAlbum () {
            const { data: res } = await this.$http.albumSub({ id: this.albumId, t: Number(!this.dynamic.isSub) })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.dynamic.isSub = Number(!this.dynamic.isSub)
        },
        // 处理歌曲
        _formatSongs (list) {
            const ret = []
            list.map((item, index) => {
                if (item.id) {
                    // 是否有版权播放
                    item.license = !list[index].privilege.cp
                    ret.push(formatSongInfo(item))
                }
            })
            return ret
        },
        _initialize () {
            this.getAlbum({ id: this.albumId })
            this.getAlbumDynamic({ id: this.albumId })
        },
        ...mapActions(['playAll'])
    },
    watch: {
        $route (newId, oldId) {
            this.albumId = this.$route.query.id
            if (this.albumId) {
                this._initialize()
            }
        }
    }
}
</script>
<style scoped lang="less">
.detail-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
}
.detail-main {
    flex: 1;
    padding-bottom: 100px;
    overflow: hidden;
}
.detail-aside {
    width: 300px;
    padding-left: 20px;

    .aside-title {
        position: relative;
        font-size: 16px;
        line-height: 24px;

        .album-more {
            display: inline-block;
            position: absolute;
            right: 0;
            top: 0;
            font-weight: normal;
            font-size: 12px;
            color: #666;
        }

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
}
.album-cover {
    display: flex;
    padding: 40px 0;
}
.album-img {
    position: relative;
    width: 260px;
    height: 260px;

    .el-image {
        z-index: 2;
    }

    &::after {
        display: inline-block;
        content: '';
        position: absolute;
        top: 0;
        right: -40px;
        width: 100%;
        height: 100%;
        background: url('../../assets/disc.png') no-repeat;
        background-size: contain;
        transition: all 0.4s linear;
    }
}
.album-info {
    flex: 1;
    padding-left: 70px;

    .album-title {
        padding-bottom: 20px;
        font-size: 24px;
        font-weight: bold;

        span {
            display: inline-block;
            font-size: 14px;
            font-weight: normal;
            color: @color-theme;
        }
    }
    .album-singer, .album-time, .album-company {
        line-height: 22px;
        font-size: 14px;
        color: #999;
    }

    .album-desc {
        position: relative;

        h5 {
            padding: 30px 0 5px;
            line-height: 20px;
            font-size: 14px;
            color: #333;
        }

        .desc-close {
            position: absolute;
            top: 30px;
            right: 0;
            cursor: pointer;
        }

        p {
            display: -webkit-box;
            line-height: 22px;
            font-size: 14px;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre-line;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            word-break: break-all;
            cursor: pointer;
        }

        .album-desc-all {
            position: absolute;
            top: 70px;
            left: 10px;
            z-index: 1;
            width: calc(~'100% - 20px');
            padding: 10px;
            margin: -10px;
            max-height: 250px;
            line-height: 22px;
            font-size: 14px;
            white-space: pre-line;
            font-family: inherit;
            color: #999;
            background: #fff;
            overflow-y: scroll;
            box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
        }
    }
}
.song-header {
    display: flex;
    padding: 0 0 10px;

    h4 {
        flex: 1;
        font-size: 20px;
        line-height: 40px;

        em {
            display: inline-block;
            padding-left: 10px;
            font-size: 12px;
            line-height: 14px;
            font-style: normal;
            font-weight: normal;
            color: #666;
            vertical-align: baseline;
        }
    }

    span {
        display: flex;
        line-height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        padding: 7px 20px;
        cursor: pointer;
        margin: 5px 0 5px 15px;
        transition: all .4s;
        background: #f0f0f0;
        color: #333;

        i {
            margin-right: 3px;
        }
    }

    .play-all {
        color: #fff;
        background: @color-theme;

        i {
            color: #fff;
        }
    }

    .collect.active, .collect.active i {
        color: @color-theme;
    }
}
.aside-album-item {
    display: flex;
    padding: 10px 0;

    .el-image {
        width: 60px;
        height: 60px;
        border-radius: 4px;
        overflow: hidden;
    }

    .aside-album-info {
        flex: 1;
        padding-left: 10px;
    }

    .aside-album-name {
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

    .aside-album-time {
        height: 20px;
        line-height: 20px;
        margin-top: 20px;
        font-size: 12px;
        color: #999;
    }
}
</style>
