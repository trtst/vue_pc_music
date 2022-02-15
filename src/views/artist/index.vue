<template>
    <div class='artist'>
        <div class="w1200">
            <div class="filter">
                <div class="filter-item">
                    <span v-for="(item, index) in initial" :key="index" :class=" index === initialIndex ? 'active' : ''" @click="selectType('initial', index)">{{item.label}}</span>
                </div>
                <div class="filter-item">
                    <span v-for="(item, index) in area" :key="index" :class=" index === areaIndex ? 'active' : ''" @click="selectType('area', index)">{{item.label}}</span>
                </div>
                <div class="filter-item">
                    <span v-for="(item, index) in type" :key="index" :class=" index === typeIndex ? 'active' : ''" @click="selectType('type', index)">{{item.label}}</span>
                </div>
            </div>
            <div class="list-container" v-infinite-scroll="loadMore">
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
                        <div class="albumSize">专辑：{{item.albumSize}}</div>
                    </div>
                </router-link>
            </div>
            <template v-if="isLoading">
                <Loading />
            </template>
        </div>
    </div>
</template>

<script>
import Loading from '@components/common/loading'
export default {
    name: 'artist',
    components: {
        Loading
    },
    data () {
        // 这里存放数据
        return {
            type: [{ label: '全部', val: -1 }, { label: '男歌手', val: 1 }, { label: '女歌手', val: 2 }, { label: '乐队', val: 3 }],
            area: [{ label: '全部', val: -1 }, { label: '华语', val: 7 }, { label: '欧美', val: 96 }, { label: '日本', val: 8 }, { label: '韩国', val: 16 }, { label: '其他', val: 0 }],
            initial: [{ label: '热门', val: -1 }, { label: '#', val: 0 }],
            typeIndex: 0,
            areaIndex: 0,
            initialIndex: 0,
            params: {
                area: '',
                type: '',
                initial: '',
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
        this.params.area = this.area[this.areaIndex].val
        this.params.type = this.type[this.typeIndex].val
        this.params.initial = this.initial[this.initialIndex].val
        this.renderInitial()
    },
    // 方法集合
    methods: {
        renderInitial () {
            const alphabet = []
            for (let i = 0; i < 26; i++) {
                alphabet.push({
                    label: String.fromCharCode(65 + i),
                    val: String.fromCharCode(97 + i)
                })
            }
            this.initial = [this.initial[0], ...alphabet, this.initial[1]]
        },
        selectType (type, index) {
            this[type + 'Index'] = index
            this.list = []
            this.params.offset = 0
            this.params[type] = this[type][index].val
        },
        async getArtist (params) {
            const { data: res } = await this.$http.artistList(params)

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.list = this.params.offset !== 0 ? [...this.list, ...res.artists] : res.artists
            this.isLoadMv = !res.more
            this.isLoading = res.more
        },
        loadMore () {
            this.isLoadMv = true
            this.params.offset = this.list.length
        }
    },
    watch: {
        params: {
            handler (params) {
                this.getArtist(params)
            },
            deep: true // 深度监听
        }
    }
}
</script>
<style scoped lang="less">
.filter {
    padding: 40px 0 20px;
}
.filter-item {
    font-size: 0;
    padding-bottom: 20px;

    span {
        display: inline-block;
        padding: 0 12px;
        font-size: 14px;
        line-height: 30px;
        margin-right: 6px;
        vertical-align: top;
        cursor: pointer;
        border-radius: 3px;

        &.active {
            color: #fff;
            background: #ff641e;
        }
    }
}

.list-container {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 40px;

    .item {
        width: 120px;
        margin: 0 40px 40px;

        .el-image {
            transition: all .4s linear;
        }

        &:hover {
            .el-image {
                transform: rotateY(180deg);
            }
        }
    }

    .faceImg {
        width: 120px;
        height: 120px;
        border-radius: 100%;
        overflow: hidden;
    }

    .info {
        text-align: center;

        .name {
            line-height: 28px;
            font-size: 14px;
        }

        .albumSize {
            color: #999;
        }
    }
}

</style>
