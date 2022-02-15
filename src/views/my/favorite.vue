<template>
    <div class='favorite'>
        <div class="favorite-header">
            <h4>歌手列表 <em>({{total}})</em></h4>
        </div>
        <div class="list-container">
            <template v-if="isLoading">
                <Loading />
            </template>
            <template v-else>
                <router-link :to="{ path: '/singer', query: { id: item.id }}" class="item" :key="item.id" v-for="item in list">
                    <div class="faceImg">
                        <el-image :src="item.picUrl + '?param=120y120'">
                            <div slot="placeholder" class="image-slot">
                                <i class="iconfont icon-placeholder"></i>
                            </div>
                        </el-image>
                    </div>
                    <div class="info">
                        <div class="name">{{item.name}}</div>
                        <div class="size"><span>专辑: {{item.albumSize}}</span><span>MV: {{item.mvSize}}</span></div>
                    </div>
                </router-link>
            </template>
        </div>
    </div>
</template>

<script>
import Loading from '@components/common/loading'
export default {
    components: {
        Loading
    },
    data () {
        // 这里存放数据
        return {
            list: [],
            isLoading: true,
            total: 0
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    mounted () {
        this.getArtist()
    },
    // 方法集合
    methods: {
        async getArtist () {
            const { data: res } = await this.$http.subArtist()

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.list = res.data
            this.total = this.list.length
            this.isLoading = false
        }
    }
}
</script>
<style scoped lang="less">
.favorite-header {
    em {
        font-style: normal;
    }
}
.list-container {
    padding: 40px 0;

    .item {
        position: relative;
        display: inline-flex;
        width: 50%;
        margin: 0 0 40px;

        .el-image {
            transition: all .4s linear;
        }

        &::before {
            position: absolute;
            display: inline-block;
            content: '';
            width: 0;
            height: 100%;
            background: #fafafa;
            transition: width 0.3s ease-in-out;

            .el-image {
                transform: rotateY(180deg);
            }
        }

        &:hover {
            &::before {
                width: 100%;
            }
        }
    }

    .faceImg {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
    }

    .info {
        position: relative;
        z-index: 2;
        padding: 10px 0 0 20px;

        .name {
            line-height: 28px;
            font-size: 14px;
        }

        .size {
            color: #999;

            span {
                display: inline-block;
                padding-right: 10px;
            }
        }
    }
}
</style>
