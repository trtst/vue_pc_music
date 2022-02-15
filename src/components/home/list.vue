<template>
    <div class='list'>
        <div class="w1200">
            <div class="h_title">
                <h3>推荐歌单</h3>
                <span v-for="(item, index) in tags" :key="item.id" :class="index == curIndex ? 'active' : ''" @click="chooseTag(index)">{{item.name}}</span>
            </div>
            <div class="wrapper">
                <el-row :gutter="20">
                    <el-col :span="8" class="item" v-for="item in list" :key="item.id">
                        <router-link to="/song" class="img">
                            <el-image :src="item.coverImgUrl" lazy></el-image>
                        </router-link>
                        <div class="info">
                            <router-link to="/song" class="info_name"> {{item.name}} </router-link>
                            <router-link to="/song" class="info_copywriter" tag="p"> {{item.copywriter}} </router-link>
                            <div class="tags">
                                <router-link to="/song" class="tag" v-for="(tag, index) in item.tags" :key="index"> #{{tag}} </router-link>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    created () {
        this.getTags()
        this.getList()
    },
    data () {
        // 这里存放数据
        return {
            tags: [],
            list: [],
            curIndex: 0
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
        async getTags () {
            const { data: res } = await this.$http.highqualitytag()

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            this.tags = res.tags.splice(0, 5)
        },
        async getList () {
            const { data: res } = await this.$http.playList({ limit: 5 })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            this.list = res.playlists
        },
        chooseTag (index) {
            this.curIndex = index
        }
    }
}
</script>
<style scoped lang="less">
    .h_title {
        display: flex;
        height: 40px;
        line-height: 40px;
        margin: 30px 0 20px;

        h3 {
            font-size: 28px;
            margin-right: 40px;
        }

        span {
            position: relative;
            display: inline-block;
            height: 20px;
            line-height: 20px;
            margin: 10px 20px;
            font-weight: 300;
            color: #333;
            cursor: pointer;

            &.active {
                position: relative;
                font-weight: 600;
                color: #000;
                &:after {
                    position: absolute;
                    content: "";
                    left: 0;
                    bottom: 1px;
                    width: 100%;
                    height: 6px;
                    background: @color-theme;
                    z-index: -1;
                }
            }
        }
    }
    .item {
        display: flex;
        margin: 10px 0;
        font-size: 0;
        vertical-align: top;

        .info_name {
            font-size: 14px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-weight: 700;
            line-height: 18px;
            color: #333;
        }

        .info_copywriter {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            margin: 5px 0;
            font-size: 12px;
            color: #999
        }

        .tags {
            font-size: 0;
        }

        .tag {
            font-size: 12px;
            color: @color-theme;
        }

        .info {
            flex: 1;
            padding: 10px 10px 10px 30px;
            border-radius: 4px;
            background: #f8f8f8;

            &:hover {
                .info_name {
                    color: @color-theme;
                }
            }
        }
    }

    .img {
        position: relative;
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        background: #f7f8f9;

        .el-image {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background: #f5f7fa;
            box-shadow: inset 1px 1px 0 rgba(0,0,0,.05), inset -1px -1px 0 rgba(0,0,0,.05);
        }

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            display: inline-block;
            content: '';
            width: 100%;
            height: 100%;
            transform: translateX(15%);
            background: url('../../assets/disc.png') no-repeat;
            background-size: cover;
            transition: all .3s ease-in-out;
        }

        &:hover {
            &::after {
                transform: translateX(20%);
            }
        }
    }
</style>
