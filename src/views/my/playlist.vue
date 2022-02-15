<template>
    <div class='playlist'>
        <div class="cover">
            <div class="cover-img">
                <el-image :src="details.coverImgUrl">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
            </div>
            <div class="cover-info">
                <div class="cover-title">
                    {{details.name}}
                </div>
                <div class="cover-author" v-if="details.creator">
                    <el-image :src="details.creator.avatarUrl" class="cover-avatar">
                        <div slot="placeholder" class="image-slot">
                            <i class="iconfont icon-placeholder"></i>
                        </div>
                    </el-image>
                    <div class="cover-name">{{details.creator.nickname}}</div>
                    <div class="cover-date">{{$utils.formartDate(details.createTime, 'yyyy-MM-dd')}}</div>
                </div>
                <div class="cover-tags" v-if="details.tags">
                    <router-link :to="{ path: '/playlist', query: { cat: tag }}" class="tag" v-for="(tag, index) in details.tags" :key="index">#{{tag}}</router-link>
                </div>
                <div class="cover-digital">
                    <span class="cover-playCount"><i class="iconfont icon-playnum"></i> {{$utils.formartNum(details.playCount)}}次</span>
                    <span class="cover-collect"><i class="iconfont icon-collect"></i> {{$utils.formartNum(details.subscribedCount)}}</span>
                    <span class="cover-comment"><i class="iconfont icon-comment"></i> {{$utils.formartNum(details.commentCount)}}</span>
                </div>
                <div class="cover-desc" v-if="details.description">
                    <h5>歌单简介<em class="desc-close" v-if="isShowDesc" @click="isShowDesc = false"><i class="iconfont icon-closed"></i></em></h5>
                    <p v-html="details.description" @click="showAllDesc"></p>
                    <pre class="cover-desc-all" v-if="isShowDesc">
                        {{details.description}}
                    </pre>
                </div>
            </div>
        </div>
        <div class="song-header">
            <h4>歌曲列表 <em>{{total + '首歌'}}</em></h4>
            <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
        </div>
        <template v-if="isLoading">
            <Loading />
        </template>
        <template v-else>
            <song-list :songList="songList" :stripe="true"></song-list>
        </template>
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { formatSongInfo } from '@utils/song'
import songList from '@components/common/song-list'
import Loading from '@components/common/loading'
export default {
    components: {
        songList,
        Loading
    },
    data () {
        // 这里存放数据
        return {
            id: '',
            details: {},
            songList: [],
            total: 0,
            isLoading: true,
            isShowDesc: false
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    mounted () {
        this.id = this.$route.query.id
        // 歌单详情
        this.getDetail({ id: this.id, s: '' })
    },
    // 方法集合
    methods: {
        ...mapMutations({
            setPlayStatus: 'SET_PLAYSTATUS',
            setPlayList: 'SET_PLAYLIST',
            setPlayIndex: 'SET_PLAYINDEX'
        }),
        // 登录及未登录下获取歌单中歌曲的列表
        async getDetail (params) {
            this.isLoading = true
            const { data: res } = await this.$http.playlistdetail(params)

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.details = res.playlist

            const ids = res.playlist.trackIds

            this.getAllSongs(ids)
        },
        // 登录后根据ids获取所有歌曲列表
        async getAllSongs (ids) {
            const sliceArr = []
            const num = 500
            let idsArr = []

            // 数组过长 每500份一组
            for (let index = 0; index < ids.length; index += num) {
                sliceArr.push(ids.slice(index, index + num))
            }

            for (let i = 0; i < sliceArr.length; i++) {
                const arrs = []
                sliceArr[i].map(d => {
                    arrs.push(d.id)
                })
                const { data: res } = await this.$http.songDetail({ ids: arrs.join(','), timestamp: new Date().valueOf() + i })

                idsArr = idsArr.concat(this._formatSongs(res))
            }

            this.songList = idsArr
            this.total = idsArr.length
            this.isLoading = false
        },
        // 播放列表为当前歌单的全部歌曲
        playAllSongs () {
            this.playAll({
                list: this.songList
            })
        },
        // 歌单简介查看更多
        showAllDesc () {
            if (this.details.description.length > 88) {
                this.isShowDesc = !this.isShowDesc
            }
        },
        // 处理歌曲
        _formatSongs (list) {
            const ret = []
            list.songs.map((item, index) => {
                if (item.id) {
                    // 是否有版权播放
                    item.license = !list.privileges[index].cp
                    ret.push(formatSongInfo(item))
                }
            })
            return ret
        },
        ...mapActions(['playAll'])
    },
    watch: {
        $route () {
            this.id = this.$route.query.id
            // 歌单详情
            this.getDetail({ id: this.id, s: '' })
        }
    }
}
</script>
<style scoped lang="less">
.cover {
    display: flex;
}
.cover-img {
    position: relative;
    width: 200px;
    height: 200px;

    &::after {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        content: '';
        transform: scale(.95) translateX(5%);
        background: #f0f0f0;
    }
}
.cover-info {
    flex: 1;
    padding-left: 40px;

    .cover-title {
        font-size: 24px;
        font-weight: bold;
    }
}
.cover-author {
    padding: 15px 0 10px;

    .cover-avatar {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 100%;
        vertical-align: top;
    }

    .cover-name, .cover-date {
        display: inline-block;
        padding: 0 10px;
        line-height: 32px;
    }

    .cover-date {
        color: #999;
    }
}
.cover-tags {
    padding-bottom: 5px;
    line-height: 16px;

    .tag {
        display: inline-block;
        margin-right: 5px;
        font-size: 12px;
        color: @color-theme;
    }
}
.cover-playCount, .cover-collect, .cover-comment {
    display: inline-block;
    padding: 0 20px 5px 0;
    line-height: 16px;
    font-size: 14px;
    color: #999;

    i {
        vertical-align: top;
    }
}
.cover-desc {
    position: relative;

    h5 {
        padding: 10px 0 5px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
    }

    .desc-close {
        position: absolute;
        top: 30px;
        right: 0;
        z-index: 2;
        cursor: pointer;
    }

    p {
        line-height: 22px;
        font-size: 14px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        cursor: pointer;
    }

    .cover-desc-all {
        position: absolute;
        top: 50px;
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
.song-header {
    display: flex;
    padding: 30px 0 10px;

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
</style>
