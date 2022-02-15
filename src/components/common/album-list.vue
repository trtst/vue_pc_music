<template>
    <div class='album'>
        <router-link :to="{ path: '/album', query: { id: item.id }}" class="item" :key="item.id" v-for="item in albumList">
            <div class="faceImg">
                <el-image :src="item.picUrl + '?param=120y120'">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
            </div>
            <div class="info">
                <div class="album-type">{{item.type}}</div>
                <div class="album-name" v-if="item.name">{{item.name}}</div>
                <div class="artist-name" v-if="item.artist">{{item.artist.name}}</div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    components: {},
    props: ['albumList'],
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
.album {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left;
    padding-bottom: 40px;
    margin: 0 -10px;
    font-size: 0;

    .item {
        display: flex;
        flex: 30%;
        max-width: calc(100% / 3 - 20px);
        margin: 20px 10px 0;
        border-radius: 4px;
        background: #f0f0f0;

        &:hover {
            .album-name {
                color: @color-theme;
            }
        }
    }

    .faceImg {
        display: block;
        position: relative;
        width: 120px;
        height: 120px;

        &::after {
            display: inline-block;
            content: '';
            position: absolute;
            top: 0;
            right: -20px;
            width: 100%;
            height: 100%;
            background: url('../../assets/disc.png') no-repeat;
            background-size: contain;
            transition: all .4s linear;
        }

        &:hover {
            &::after {
                right: -25px;
                transform: rotate(90deg);
            }
        }
    }

    .el-image {
        border-radius: 4px;
        z-index: 2;
    }

    .info {
        position: relative;
        flex: 1;
        margin-left: 40px;
        overflow: hidden;

        .album-name {
            padding: 30px 15px 10px 0;
            font-size: 16px;
            color: #333;
            word-break: break-all;
        }

        .artist-name {
            font-size: 14px;
            color: #999;
        }

        .album-type {
            position: absolute;
            top: 5px;
            right: -30px;
            width: 100px;
            line-height: 24px;
            font-size: 12px;
            transform: rotate(45deg);
            text-align: center;
            color: #fff;
            background-color: @color-theme;
        }
    }
}
</style>
