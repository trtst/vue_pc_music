<template>
    <div class="songs-list-main">
        <div class="list-header flex">
            <div class="columnIndex">序号</div>
            <div class="columnSong">歌曲</div>
            <div class="columnSinger">歌手</div>
            <div class="columnAlbum" v-if="typeSize !== 'mini'">专辑</div>
            <div class="columnTime">时长</div>
        </div>
        <div class="list-scroll" :style="{height: height + 'px'}" ref="curSongRef">
            <div class="list-main" :style="curSongSty">
                <div :class="isCurSong(item, index)" v-for="(item, index) in list" :key="item.id" @click.stop="tips($event, item)">
                    <div class="columnIndex">
                        <span class="songlist-index">{{indexMethod(index)}}</span>
                        <div class="audio-icon">
                            <div class="column" style="animation-delay: -1.2s;"></div>
                            <div class="column"></div>
                            <div class="column" style="animation-delay: -1.5s;"></div>
                            <div class="column" style="animation-delay: -0.9s;"></div>
                            <div class="column" style="animation-delay: -0.6s;"></div>
                        </div>
                        <i :class="playIcon(item)" @click="currentSong(item)"></i>
                    </div>
                    <div class="columnSong songlist-name">
                        <router-link :class="typeSize" :to="{ path: '/song', query: { id: item.id }}">
                            {{ item.name }}
                        </router-link>
                        <template v-if="typeSize !== 'mini'">
                            <router-link class="mv-name" :to="{ path: '/mv', query: { id: item.mvId }}" v-if="item.mvId">
                                <i class="iconfont icon-video"></i>
                            </router-link>
                            <i v-if="item.vip" class="iconfont icon-vip"></i>
                        </template>
                    </div>
                    <div class="columnSinger songlist-singer">
                        <!--- 返回的数据里用户的uid有可能为0 --->
                        <router-link :to="{ path: '/singer', query: { id: author.id }}" class="song_name" v-for="(author, k) in item.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
                    </div>
                    <div class="columnAlbum" v-if="typeSize !== 'mini'">
                        <router-link class="songlist-album" :to="{ path: '/album', query: { id: item.album.id }}" v-if="item.album">{{ item.album.name }}</router-link>
                    </div>
                    <div class="columnTime">
                        <div class="songlist-time">
                            {{item.duration}}
                        </div>
                        <div class="songlist-oper">
                            <i class="iconfont icon-add" title="添加到列表" v-if="typeSize !== 'mini'" @click="addSongList(item)"></i>
                            <el-popover placement="bottom" trigger="click" ref="popAddList">
                                <i class="iconfont icon-add-list" title="添加到歌单" slot="reference" @click="closeAddListPop"></i>
                                <!-- <add-list :tracks="item.id" @closeAddListPop="closeAddListPop"></add-list> -->
                            </el-popover>
                            <i class="iconfont icon-collect" @click="likeSong(item)"></i>
                            <i class="iconfont icon-del" title="删除" v-if="typeSize === 'mini'" @click.stop="delList(index)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination" v-if="isShowPagination">
            <el-pagination
                background
                @current-change="currentChange"
                :page-size="this.pageSize"
                :current-page.sync="currentPage"
                layout="prev, pager, next"
                :total="this.songList.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    name: 'songList',
    components: {
    },
    props: {
        songList: {
            type: Array,
            required: true
        },
        typeSize: { // 播放列表展示类型， 默认normal是歌单下的展示列表，mini是播放条下的歌曲列表的
            type: String,
            default: 'normal'
        },
        stripe: { // 隔行变色
            type: Boolean,
            default: false
        },
        offset: { // 若是列表有分页，偏移数量
            type: Number,
            default: 0
        },
        height: {
            type: [Number, String],
            default: 'auto'
        },
        // 分页加载 || 无限滚动加载
        isScroll: {
            type: Boolean,
            default: false
        },
        isShowTips: {
            type: Boolean,
            default: true
        }
    },
    data () {
        // 这里存放数据
        return {
            pageSize: 30,
            currentPage: 1,
            playing: false,
            timer: null,
            curScroll: -1 || 1
        }
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters(['playList', 'playIndex', 'isPlayed']),
        list () {
            if (!this.isScroll) { // 分页加载数据
                return this.songList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            } else {
                return this.songList
            }
        },
        isCurSong () {
            const self = this

            return (item, index) => {
                return ['list-item', self.stripe ? (index % 2 === 0 ? 'stripe' : '') : '', self.isPlayed && (item.id === self.curSongInfo.id) ? 'active' : '', (item.license || item.vip) ? 'disable' : '', item.vip ? 'vip' : '']
            }
        },
        isShowPagination () {
            return this.songList.length > this.pageSize && !this.isScroll
        },
        playIcon () {
            const self = this

            return (item) => {
                return ['iconfont', 'playicon', this.isPlayed && (item.id === self.curSongInfo.id) ? 'icon-pause' : 'icon-play']
            }
        },
        curSongSty () {
            return `transform: translateY(${this.curScroll}px)`
        },
        curSongInfo () {
            return this.playList[this.playIndex]
        }
    },
    mounted () {
        this.scrollCurSong(this.curSongInfo)
    },
    // 方法集合
    methods: {
        ...mapMutations({
            setPlayStatus: 'SET_PLAYSTATUS',
            setPlayList: 'SET_PLAYLIST',
            setPlayListTips: 'setPlayListTips',
            setPlayIndex: 'SET_PLAYINDEX'
        }),
        // 全局设置当前播放歌曲
        currentSong (item) {
            // 若当前唔歌曲 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
            if (!this.curSongInfo || item.id !== this.curSongInfo.id) {
                this.selectPlay({ list: [item] })
                if (this.isShowTips) {
                    this.setPlayListTips({ flag: true, txt: '已开始播放' })
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.setPlayListTips({ flag: false, txt: '已开始播放' })
                    }, 2000)
                }
            } else {
                this.setPlayStatus(!this.isPlayed)
            }
        },
        // 表格列表序号格式化
        indexMethod (page) {
            if (!this.isScroll) {
                return (this.currentPage - 1) * this.pageSize + page + 1 + this.offset
            } else {
                return page + 1
            }
        },
        // 歌曲列表分页功能
        currentChange (page) {
            this.currentPage = page
        },
        // 添加当前歌曲到播放列表
        addSongList (item) {
            this.addList({ list: [item] })

            if (this.isShowTips) {
                this.setPlayListTips({ flag: true, txt: '已添加到播放列表' })
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.setPlayListTips({ flag: false, txt: '已添加到播放列表' })
                }, 2000)
            }
        },
        // 在播放列表删除当前歌曲
        delList (index) {
            this.playList.splice(index, 1)
            this.setPlayList(this.playList)
        },
        // 喜欢该歌曲
        async likeSong (item) {
            const { data: res } = await this.$http.likeSong({ id: item.id, like: !item.like })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.$msg.success('收藏成功')
        },
        tips (e, item) {
            if (e.target.nodeName !== 'A') {
                if (item.license) {
                    this.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
                }

                if (item.vip) {
                    this.$msg.error('付费歌曲，请在网易云音乐播放')
                }
            }
        },
        closeAddListPop () {
            this.$refs.popAddList.forEach(item => {
                item.doClose()
            })
        },
        // 滚动到当前播放音乐的位置
        scrollCurSong (cur) {
            const self = this
            if (self.isScroll) {
                const curIndex = self.songList.findIndex(item => {
                    return item.id === cur.id
                })

                if (curIndex > 7 && curIndex < self.songList.length - 8) {
                    self.curScroll = -(curIndex - 4) * 50
                } else if (curIndex >= (self.songList.length - 8) && self.songList.length - 8 > 0) {
                    self.curScroll = -(self.songList.length - 8) * 50
                } else {
                    self.curScroll = 0
                }
                self.$refs.curSongRef.addEventListener('wheel', (event) => {
                    if (event.wheelDelta > 0 || event.detail < 0) {
                        self.curScroll = Math.abs(self.curScroll) > 0 ? self.curScroll + 50 : 0
                    } else {
                        self.curScroll = Math.abs(self.curScroll) < (self.songList.length - 8) / 2 * 100 ? self.curScroll - 50 : self.curScroll
                    }
                })
            }
        },
        ...mapActions(['selectPlay', 'addList'])
    },
    watch: {
        curSongInfo: {
            handler (val, oldVal) {
                this.scrollCurSong(val)
            },
            deep: true
        },
        songList () {
            this.currentPage = 1
        }
    },
    beforeDestroy () {
        clearTimeout(this.timer)
    }
}
</script>
<style scoped lang="less">
.list-header {
    display: flex;
    line-height: 50px;
    border-bottom: 1px solid #EBEEF5;
    font-weight: bold;
    color: #999;
}
.columnIndex {
    width: 70px;
    line-height: 50px;
    padding-left: 10px;
}
.columnSong {
    display: flex;
    flex: 1.5;
    padding-right: 10px;
    overflow: hidden;
    align-items: center;
}
.columnSinger {
    flex: 2;
    padding-right: 10px;
    overflow: hidden;
}
.columnAlbum {
    width: 200px;
}
.columnTime {
    width: 140px;
    padding-right: 10px;
    text-align: right;
}
.list-scroll {
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
    overflow-y: hidden;
}
.list-main {
    transition: transform .3s;
}
.list-item {
    display: flex;
    line-height: 0;

    .iconfont {
        margin-left: 10px;
        font-size: 22px;
        cursor: pointer;

        &:hover {
            color: @color-theme;
        }
    }

    .songlist-index {
        display: inline-block;
        width: 24px;
        text-align: center;
    }

    .playicon {
        display: none;
        margin-left: 0;
    }

    .songlist-name {
        a {
            display: inline-block;
            max-width: 60%;
            line-height: 50px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: top;
        }

        .mini {
            max-width: 100%;
        }

        i:hover {
            color: @color-theme;
            cursor: pointer;
        }
    }

    .songlist-singer, .songlist-album {
        display: inline-block;
        max-width: 100%;
        line-height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .songlist-time {
        line-height: 50px;
    }

    .songlist-oper {
        display: none;
        line-height: 50px;
    }

    &.stripe {
        background: #FAFAFA;
    }

    &.active {
        background: #f0f0f0;

        .songlist-index, .playicon {
            display: none;
        }

        .audio-icon {
            display: flex;
        }

        &:hover {
            .playicon {
                display: block;
                color: @color-theme;
            }
            .audio-icon {
                display: none;
            }
        }
    }

    &:hover {
        background: #f0f0f0;

        .songlist-time, .songlist-index {
            display: none;
        }

        .songlist-oper, .playicon {
            display: block;
        }
    }

    .icon-vip {
        font-size: 30px;
        color: @color-theme;
    }

    &.disable {
        color: #ccc;

        a {
            color: #ccc;
        }

        .playicon, .songlist-oper {
            display: none;
        }

        .songlist-index, .songlist-time {
            display: block;
        }
    }

    &.vip {
        color: @color-theme;

        a {
            color: @color-theme;
        }
    }
}

.song-list {

    .songlist-singer {
        display: inline-block;
        width: 100px;
        height: 23px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .songlist-name {
        width: 210px;

        a {
            display: inline-block;
            max-width: 185px;
            height: 23px;
            margin-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        i:hover {
            color: @color-theme;
            cursor: pointer;
        }
    }

    .songlist-album {
        display: inline-block;
        width: 95%;
        height: 23px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .songlist-oper {
        display: none;

        .iconfont {
            margin-left: 15px;
            font-size: 22px;
            cursor: pointer;

            &:hover {
                color: @color-theme;
            }
        }
    }
}
.pagination {
    padding: 50px 0 0;
    text-align: center;
}
</style>
