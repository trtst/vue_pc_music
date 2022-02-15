<template>
    <div class='video'>
        <video
            ref="videoPlayer"
            class="video-js video-skin"
        ></video>
    </div>
</template>

<script>
import videojs from 'video.js'
import '@plugins/video-quality.js'
import 'video.js/dist/video-js.css'
import '@assets/css/video.less'
window.videojs = videojs
require('video.js/dist/lang/zh-CN')
export default {
    name: 'videoPlayer',
    components: {},
    props: {
        options: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        // 这里存放数据
        return {
            opt: {
                playbackRates: [0.5, 1, 1.5, 2], // 播放速度
                controls: true,
                autoplay: true, // 如果true,浏览器准备好时开始播放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                // language: 'zh-cn', // 设置无效
                // languages: {
                //     'zh-CN': {
                //         Play: '播放',
                //         Pause: '暂停',
                //         Mute: '静音',
                //         Unmute: '取消静音',
                //         'Playback Rate': '播放速度'
                //     }
                // },
                aspectRatio: '16:9', // 播放器的比例。用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，播放器将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                // sources: [{
                //     type: '',
                //     src: '' // url地址
                // }],
                // poster: '', // 你的封面地址
                notSupportedMessage: '此视频暂无法播放，请稍后再试', // 无法播放媒体源时显示的默认信息。
                controlBar: {
                    currentTimeDisplay: true, // 当前播放时长
                    timeDivider: true, // 当前播放时间与总时间的斜杆分隔符
                    durationDisplay: true, // 总时长
                    remainingTimeDisplay: false, // 是否显示剩下的时间
                    volumePanel: { // 音量组件
                        inline: false // 调整音量调方向为纵向或者横向
                    },
                    QualitySelector: true,
                    children: [
                        'playToggle', // 播放暂停按钮
                        'volumePanel', // 音量按钮
                        'progressControl', // 视频进度条
                        'currentTimeDisplay', // 当前播放时长
                        'timeDivider', //  ‘/’ 分隔符
                        'durationDisplay', // 视频总时长
                        'PlaybackRateMenuButton', // 播放速度
                        'qualityButton', // 视频高清切换
                        'fullscreenToggle' // 全屏按钮
                    ]
                },
                qualityList: [], // 当前可播放视频的分辨率列表
                quality: {}, // 当前播放视频的分辨率
                qualityType: { // 视频分辨率分类
                    240: '标清',
                    360: '普清',
                    480: '高清',
                    720: '超清',
                    1080: '1080P'
                },
                errorDisplay: false,
                posterImage: false,
                bigPlayButton: true,
                textTrackDisplay: false
            },
            player: null
        }
    },
    mounted () {
        const self = this

        this.$nextTick(() => {
            const d = { ...this.opt, ...this.options }
            this.player = videojs(this.$refs.videoPlayer, d, function onPlayerReady () {
                self.$emit('ready', this, '视频加载完成')

                this.on('loadstart', () => {
                    self.$emit('loadstart', this, '开始请求数据')
                })
                this.on('progress', () => {
                    self.$emit('progress', this, '正在请求数据')
                })
                this.on('loadedmetadata', () => {
                    self.$emit('loadedmetadata', this, '获取资源长度完成')
                })
                this.on('canplaythrough', () => {
                    self.$emit('canplaythrough', this, '视频源数据加载完成')
                })
                this.on('waiting', () => {
                    self.$emit('waiting', this, '等待数据')
                })
                this.on('play', () => {
                    self.$emit('play', this, '视频开始播放')
                })
                this.on('playing', () => {
                    self.$emit('playing', this, '视频播放中')
                })
                this.on('pause', () => {
                    self.$emit('pause', this, '视频暂停播放')
                })
                this.on('ended', () => {
                    self.$emit('ended', this, '视频播放结束')
                })
                this.on('error', () => {
                    self.$emit('error', this, 'error')
                })
                this.on('seek', () => {
                    self.$emit('seek', this, '视频跳转')
                })
                this.on('seeking', () => {
                    self.$emit('seeking', this, '视频跳转中')
                })
                this.on('seeked', () => {
                    self.$emit('seeked', this, '视频跳转结束')
                })
                this.on('ratechange', () => {
                    self.$emit('ratechange', this, '播放速率改变')
                })
                this.on('timeupdate', () => {
                    self.$emit('timeupdate', this, '播放时长改变')
                })
                this.on('volumechange', () => {
                    self.$emit('volumechange', this, '音量改变')
                })
                this.on('stalled', () => {
                    self.$emit('stalled', this, '网速异常')
                })
                this.on('qualityChange', (a, b, c) => {
                    self.$emit('qualityChange', this, '高清视频切换')
                })
            })
        })
    },
    beforeDestroy () {
        if (this.player) {
            this.player.dispose()
        }
    },
    // 监听属性 类似于data概念
    computed: {
        src () {
            return this.options.sources[0].src
        }
    },
    // 方法集合
    methods: {
    },
    watch: {
        src () {
            this.player.src(this.src)
            // 切换MV视频 直接播放
            this.player.play()
        }
    }
}
</script>
<style scoped lang="less">
/deep/.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar {
    visibility: visible;
    opacity: 1;
}
</style>
