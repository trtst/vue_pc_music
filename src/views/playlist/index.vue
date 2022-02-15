<template>
    <div class='playlist'>
        <div class="w1200">
            <div class="filter">
                <div class="filter-item" v-for="(item, index) in categories" :key="index">
                    <div class="filter-title">{{ item.name }}</div>
                    <div class="filter-box">
                        <span :class="['item-box', curType === sub.name ? 'active' : '']" v-for="sub in item.children.slice(0, 8)" :key="sub.name"><em @click="selectType(sub)">{{ sub.name }}</em></span>
                        <el-popover trigger="click">
                            <span :class="['item-box', 'filter-more', moreTxt[index] ? 'active' : '']" slot="reference" v-if="item.children.length > 9"><em>{{ moreTxt[index] ? curType : '更多'}}<i class="iconfont icon-arrow"></i></em></span>
                            <div class="filter-drop">
                                <span :class="['item-box', curType === sub.name ? 'active' : '']" v-for="sub in item.children.slice(9)" :key="sub.name"><em @click="selectType(sub, index)">{{ sub.name }}</em></span>
                            </div>
                        </el-popover>
                    </div>
                </div>
            </div>
            <div class="list-container">
                <div class="list-head">
                    <h2>{{curType}} <em v-if="curType !== allList.name" class="filter-close" @click="closed"><i class="iconfont icon-closed"></i></em></h2>
                    <div class="type">
                        <span :class="params.order === 'hot' ? 'active' : ''" @click="selectOrder('hot')">热门</span>
                        <span :class="params.order === 'new' ? 'active' : ''" @click="selectOrder('new')">最新</span>
                    </div>
                </div>
                <PlayList :params="params" :isScroll="true"></PlayList>
            </div>
        </div>
    </div>
</template>

<script>
import PlayList from '@components/common/playlist.vue'
export default {
    name: 'PlayListWrap',
    components: {
        PlayList
    },
    created () {
        this.params.cat = this.$route.query.cat
        this.getCatlist()
    },
    data () {
        // 这里存放数据
        return {
            sub: [],
            categories: [],
            curType: '',
            moreTxt: {},
            allList: {},
            params: {
                order: 'hot',
                cat: '',
                limit: 50,
                offset: 0
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {
    },
    // 方法集合
    methods: {
        async getCatlist () {
            const { data: res } = await this.$http.catlist()
            this.sub = res.sub

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }

            for (const k in res.categories) {
                const params = { name: res.categories[k] }

                params.children = this.sub.filter(subItem => { return subItem.category === Number(k) })
                this.categories.push(params)
            }

            this.curType = this.$route.query.cat ? this.$route.query.cat : res.all.name
            this.allList = res.all
            this.getMoreTxt()
        },
        selectType (item) {
            this.$router.push({ path: 'playlist', query: { cat: item.name, order: this.params.order } })
        },
        closed () {
            this.$router.push({ path: 'playlist' })
        },
        selectOrder (type) {
            this.$router.push({ path: 'playlist', query: { cat: this.params.cat, order: type } })
        },
        getMoreTxt () {
            // 查询当前显示的歌单分类详情，如：全部歌单、华语
            const itemInfo = this.sub.find(subItem => { return subItem.name === this.curType })
            this.moreTxt = {}
            if (itemInfo) {
                // 若有歌单分类，且分类歌单的索引在更多里面，则渲染moreText数据
                const index = this.categories[itemInfo.category].children.indexOf(itemInfo)
                index >= 8 && (this.moreTxt[itemInfo.category] = itemInfo)
            }
        }
    },
    watch: {
        '$route' (newVal, oldVal) {
            const { cat, order } = newVal.query

            this.curType = cat || this.allList.name
            this.params = Object.assign({}, { order: 'hot', cat: '', limit: 50, offset: 0 }, { cat: cat || '', order: order || 'hot' })
            this.getMoreTxt()
        }
    }
}
</script>
<style scoped lang="less">
.filter {
    display: flex;
    padding: 40px 0;
}
.filter-item {
    flex: 2;
    border-left: 1px solid #f5f5f5;
    padding-left: 35px;

    .filter-title {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .filter-box {
        font-size: 0;
    }

    .item-box {
        display: inline-block;
        width: calc(100% / 3);
        vertical-align: top;

        em {
            display: inline-block;
            font-style: normal;
            font-size: 14px;
            line-height: 26px;
            margin-top: 4px;
            cursor: pointer;
        }

        &.active {

            em {
                padding: 0 6px 0 5px;
                margin: 4px -5px 0;
                color: #fff;
                font-style: normal;
                background: @color-theme;
            }
        }
    }

    .filter-more {
        width: 50px;

        &.active {

            em {
                width: 40px;
                overflow: hidden;
                height: 26px;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: top;
            }
        }
    }

    &:first-child {
        flex: 1;
        border: 0;
        padding-left: 0;

        .item-box {
            width: 50%;
        }
    }
}
.filter-drop {

    .item-box {
        display: inline-block;
        line-height: 26px;
        padding: 0 15px;
        font-size: 14px;

        em {
            display: inline-block;
            font-style: normal;
            cursor: pointer;
        }

        &.active {

            em {
                padding: 0 5px;
                margin: 0 -5px;
                color: #fff;
                font-style: normal;
                background: @color-theme;
            }
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

    .filter-close {
        display: inline-block;
        line-height: 16px;
        vertical-align: top;
        cursor: pointer;
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
