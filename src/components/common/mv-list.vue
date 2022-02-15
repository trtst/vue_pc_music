<template>
    <div class='mv'>
        <!-- 列表有重复的MV， 相同id的key会报错，加上字符串的index -->
        <div class="item" :key="'' + item.id + index" v-for="(item, index) in mvList">
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
</template>

<script>
export default {
    components: {},
    props: ['mvList'],
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
.mv {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
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
