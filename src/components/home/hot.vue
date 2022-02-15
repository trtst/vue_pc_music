<template>
    <div class='top'>
        <div class="w1200">
            <router-link to="/song" v-for="item in hotList" :key="item.id" class="item">{{item.name}}</router-link>
            <router-link to="/song" class="more">更多</router-link>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    created () {
        this.getHotList()
    },
    data () {
        // 这里存放数据
        return {
            hotList: []
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    // 方法集合
    methods: {
        async getHotList () {
            const { data: res } = await this.$http.hotList(10, 'hot')

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            this.hotList = res.tags
        }
    }
}
</script>
<style scoped lang="less">
    .top {
        padding: 20px 0;

        .item {
            display: inline-block;
            margin-right: 15px;
            color: #606266;
            padding: 0 30px;
            height: 40px;
            line-height: 40px;
            background: #f8f8f8;
            border-radius: 40px;
            text-decoration: none;

            &:hover {
                background: #f0f0f0;
            }
        }

        .more {
            padding: 0;
            margin: 0 0 0 64px;
            color: #909399;
            background: none;
            text-decoration: none;
        }
    }
</style>
