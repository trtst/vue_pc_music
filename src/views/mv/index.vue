<template>
    <div class='mv'>
        <div class="w1200">
            <div class="filter">
                <div class="filter-item">
                    <span>区域</span>
                    <em v-for="(item, index) in area" :class=" index === areaIndex ? 'active' : ''" :key="index" @click="selectType('area', index)">{{item}}</em>
                </div>
                <div class="filter-item">
                    <span>类型</span>
                    <em v-for="(item, index) in type" :class=" index === typeIndex ? 'active' : ''" :key="index" @click="selectType('type', index)">{{item}}</em>
                </div>
            </div>
            <div class="list-container">
                <div class="list-head">
                    <h2>全部MV</h2>
                    <div class="type">
                        <span v-for="(item, index) in order" :class=" index === orderIndex ? 'active' : ''" :key="index" @click="selectType('order', index)">{{item}}</span>
                    </div>
                </div>
                <mv-list class="loadMv" :mvList="list" v-infinite-scroll="loadMv"  infinite-scroll-disabled="isLoadMv" infinite-scroll-distance="50"></mv-list>
            </div>
            <template v-if="isLoading">
                <Loading />
            </template>
        </div>
    </div>
</template>

<script>
import mvList from '@components/common/mv-list'
import Loading from '@components/common/loading'
export default {
    name: 'mv',
    components: {
        mvList,
        Loading
    },
    data () {
        // 这里存放数据
        return {
            area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
            type: ['全部', '官方版', '原生', '现场版', '网易出品'],
            order: ['上升最快', '热门', '最新'],
            areaIndex: 0,
            typeIndex: 0,
            orderIndex: 0,
            params: {
                area: '',
                type: '',
                order: '',
                limit: 30,
                offset: 0
            },
            list: [],
            isLoading: true,
            isLoadMv: true
        }
    },
    // 监听属性 类似于data概念
    computed: {},
    mounted () {
        this.params.area = this.area[this.areaIndex]
        this.params.type = this.type[this.typeIndex]
        this.params.order = this.order[this.orderIndex]
    },
    // 方法集合
    methods: {
        async getMv (params) {
            const { data: res } = await this.$http.mv(params)

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            this.list = this.params.offset !== 0 ? [...this.list, ...res.data] : res.data
            this.isLoadMv = !res.hasMore
            this.isLoading = res.hasMore
        },
        selectType (type, index) {
            this[type + 'Index'] = index
            this.list = []
            this.params.offset = 0
            this.params[type] = this[type][index]
        },
        loadMv () {
            this.isLoadMv = true
            this.params.offset = this.list.length
        }
    },
    watch: {
        params: {
            handler (params) {
                this.getMv(params)
            },
            deep: true // 深度监听
        }
    }
}
</script>
<style scoped lang="less">
.list-container {
    padding-bottom: 40px;
}
.filter {
    padding: 40px 0 20px;
}
.filter-item {
    font-size: 0;
    padding-bottom: 20px;

    span {
        display: inline-block;
        width: 65px;
        font-size: 14px;
        line-height: 30px;
        font-weight: bold;
        vertical-align: top;
    }

    em {
        display: inline-block;
        font-size: 14px;
        line-height: 30px;
        padding: 0 10px;
        margin-right: 15px;
        font-style: normal;
        cursor: pointer;
        border-radius: 3px;

        &.active {
            color: #fff;
            background: #ff641e;
        }
    }
}
.list-head {
    display: flex;
    padding: 15px 0;

    h2 {
        font-size: 24px;
        line-height: 30px;
    }

    .type {
        flex: 1;
        padding: 5px 40px;

        span {
            position: relative;
            display: inline-block;
            height: 20px;
            line-height: 20px;
            margin-right: 34px;
            font-weight: 300;
            color: #333;
            cursor: pointer;

            &.active {
                font-weight: 600;
                color: #000;

                &::after {
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
}
</style>
