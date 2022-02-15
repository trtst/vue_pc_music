<template>
    <div class='video'>
        <div class="item" :key="'' + item.id + index" v-for="(item, index) in videoList">
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
</template>

<script>
export default {
    components: {},
    props: ['videoList'],
    data () {
        // 这里存放数据
        return {
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
    }
}
</script>
<style scoped lang="less">
.video {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    padding-bottom: 40px;
    margin: 0 -10px;
    font-size: 0;

    .item {
        flex: 30%;
        max-width: calc(100% / 5 - 20px);
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
        padding: 15px 0;

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
