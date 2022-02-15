<template>
    <div>
        <div :class="['lyrics-main', lyricName]">
            <div class="lyrics" ref="lyrics" v-if="lyricObj.length" :style="transform">
                <p :class="[isCurLyric(index)]" v-for="(item, index) in lyricObj" :key="index">{{item.txt}}</p>
            </div>
            <div v-else class="lyric-empty">
                <p v-if="lyric">纯音乐，无歌词</p>
                <p v-else>歌词加载中......</p>
            </div>
        </div>
        <div class="lyric-more" v-if="local === 'page' && lyricObj.length > 6">
            <p v-if="!isFull">...</p>
            <span @click.stop="fullLyric">{{ this.isFull ? '收起' : '展开'}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'lyrics',
    components: {},
    props: {
        sId: {
            type: [Number, String],
            default: 0
        },
        currentTime: {
            type: Number,
            default: 0
        },
        local: {
            type: String,
            default: ''
        }
    },
    data () {
        // 这里存放数据
        return {
            lyric: null,
            lyricObj: [],
            curIndex: 0,
            isFull: false
        }
    },
    mounted () {
        this.getLyrics(this.sId)
    },
    // 监听属性 类似于data概念
    computed: {
        lyricName () {
            return [this.local === 'page' ? 'page-lyrics' : '', this.isFull ? 'fullLyrics' : '']
        },
        isCurLyric () {
            return (index) => {
                return index === this.curIndex && !this.local ? 'active' : ''
            }
        },
        // 歌词实时滚动
        transform () {
            if (this.curIndex > 6) {
                return `transform: translateY(-${30 * (this.curIndex - 6)}px)`
            } else {
                return 'transform: translateY(0)'
            }
        }
    },
    // 方法集合
    methods: {
        async getLyrics (id) {
            const { data: res } = await this.$http.lyrics({ id: id })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.formartLyric(res.lrc)
        },
        formartLyric (lrc) {
            const lrcReg = /^\[(\d{2}):(\d{2}.\d{2,})\]\s*(.+)$/
            if (!lrc) {
                this.lyric = true
                return
            }
            const lyricLis = lrc.lyric.split('\n')

            this.lyric = lrc.lyric
            lyricLis.forEach(item => {
                const arr = lrcReg.exec(item)

                if (!arr) {
                    return
                }

                this.lyricObj.push({ t: arr[1] * 60 * 1 + arr[2] * 1, txt: arr[3] })
            })

            // 根据时间轴重排顺序
            this.lyricObj.sort((a, b) => {
                return a.t - b.t
            })
        },
        findCurIndex (t) {
            for (let i = 0; i < this.lyricObj.length; i++) {
                if (t <= this.lyricObj[i].t) {
                    return i
                }
            }
            return this.lyricObj.length
        },
        // 页面歌词可以展开查看更多
        fullLyric () {
            this.isFull = !this.isFull
        }
    },
    watch: {
        sId (newVal, oldVal) {
            this.lyric = null
            this.lyricObj = []
            this.curIndex = 0
            this.getLyrics(newVal)
        },
        currentTime (newVal, oldVal) {
            // 无歌词的时候 不做动画滚动
            if (!this.lyricObj.length) {
                return
            }
            this.curIndex = this.findCurIndex(newVal) - 1
        }
    }
}
</script>
<style scoped lang="less">
.lyrics-main {
    height: 100%;
    max-height: 390px;
    overflow-y: auto;
    transition: all 1.5s ease-in-out;
}

.lyrics {
    font-size: 0;
    transform: translateY(0);
    transition: transform 1.5s ease-in-out;

    /deep/p {
        margin: 0;
        line-height: 30px;
        font-size: 14px;
        font-weight: 300;

        &.active {
            color: @color-theme;
        }
    }
}
.lyric-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 100px;
    color: @color-theme;

    ~ .more-lyric {
        display: none;
    }
}
.page-lyrics {
    color: #666;
    overflow: hidden;

    .lyric-empty {
        justify-content: left;
    }

    &.fullLyrics {
        max-height: none;
    }
}

.lyric-more span {
    display: inline-block;
    line-height: 30px;
    cursor: pointer;
    color: @color-theme;
}
</style>
