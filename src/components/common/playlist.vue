<template>
    <div class='wrapper infinite-list' v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50">
        <play-list :playList="list"></play-list>
        <template v-if="isLoading">
            <Loading />
        </template>
    </div>
</template>

<script>
import playList from '@components/common/play-list'
import Loading from '@components/common/loading'
export default {
    name: 'PalyList',
    components: {
        playList,
        Loading
    },
    created () {
        this.getPlayList(this.params)
    },
    props: {
        params: {
            type: Object,
            default: () => {}
        },
        // 是否有滚动条
        isScroll: {
            type: Boolean,
            default: false
        }
    },
    data () {
        // 这里存放数据
        return {
            list: [],
            isLoading: true,
            busy: true
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
        async getPlayList (params) {
            const { data: res } = await this.$http.playList(params)

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            this.list = this.params.offset !== 0 ? [...this.list, ...res.playlists] : res.playlists
            this.busy = this.list.length >= res.total
            this.isLoading = !this.busy
        },
        loadMore () {
            if (this.isScroll) {
                this.busy = true
                this.params.offset = this.list.length
            }
        }
    },
    watch: {
        params: {
            handler (newVal, oldVal) {
                if (newVal.cat !== oldVal.cat) {
                    this.list = []
                }
                this.getPlayList(newVal)
            },
            deep: true // 深度监听
        }
    }
}
</script>
<style scoped lang="less">
.wrapper {
    min-height: 500px;
}
.item {
    width: 18%;
    padding: 20px 2% 30px 0;
    margin-right: -22px;

    .faceImg {
        display: block;
        position: relative;
        height: 216px;

        &::after, &::before {
            content: "";
            width: 100%;
            height: 100%;
            background-color: #d9d9d9;
            position: absolute;
            top: 0;
        }

        &::before {
            border: 1px solid #d6d6d6;
            right: -4px;
            -webkit-transform: scale(.85);
            -ms-transform: scale(.85);
            transform: scale(.85);
            -webkit-transform-origin: 100% 50%;
            -ms-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
            z-index: 2;
            border-radius: 2px;
            transition: all .4s linear;
        }

        &::after {
            border: 1px solid #c4c4c4;
            right: -8px;
            -webkit-transform: scale(.73);
            -ms-transform: scale(.73);
            transform: scale(.73);
            -webkit-transform-origin: 100% 50%;
            -ms-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
            z-index: 1;
            border-radius: 2px;
            opacity: .5;
            transition: all .4s linear .1s;
        }
    }

    .el-image {
        width: 100%;
        height: 100%;
        z-index: 3;
        border-radius: 4px;
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

        .icon-playnum {
            color: #fff;
        }

        em {
            display: inline-block;
            padding-left: 5px;
            font-style: normal;
        }
    }

    &:hover {
        .faceImg {
            position: relative;

            &::after, &::before {
                background: #ff960080
            }

            &::before {
                right: -6px;
            }

            &::after {
                right: -12px;
            }
        }

        .info_name {
            color: #000;
        }
    }
}

.info_name {
    display: block;
    font-size: 16px;
    line-height: 22px;
    margin-top: 15px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
}

.tags {
    padding: 5px 0;
    .tag {
        font-size: 12px;
        color: @color-theme;
    }
}
</style>
