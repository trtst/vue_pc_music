<template>
    <div class='addList'>
        <!-- TODO 新建歌单功能未实现 -->
        <h4 class="addListNew" @click="addListNew"><i title="新建歌单" class="iconfont icon-add-new"></i>点击新建歌单</h4>
        <div class="list-mian">
            <div class="list-item" v-for="item in list" :key="item.id" @click="addPlayList(item)">
                <el-image :src="item.coverImgUrl" class="cover-img">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
                <div class="list-name">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'addList',
    components: {},
    props: ['tracks'],
    data () {
        // 这里存放数据
        return {
            list: [],
            limit: 30,
            offset: 0
        }
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters(['userInfo'])
    },
    mounted () {
        this.getUserPlayList()
    },
    // 方法集合
    methods: {
        async getUserPlayList () {
            const { data: res } = await this.$http.playlistUser({ uid: this.userInfo.userId, limit: this.limit, offset: this.offset })

            if (res.code !== 200) {
                return this.$msg.error('数据请求失败')
            }
            this.list = res.playlist.filter(item => {
                return !item.subscribed
            })
        },
        async addPlayList (item) {
            const { data: res } = await this.$http.addPlayList({ op: 'add', pid: item.id, tracks: this.tracks })

            this.$emit('closeAddListPop')
            if (res.body.code !== 200) {
                return this.$msg.error(res.body.message)
            }
            this.$msg.success('收藏成功')
        },
        addListNew () {
            this.$emit('closeAddListPop', true)
        }
    }
}
</script>
<style scoped lang="less">
.addList {
    // position: fixed;
    // width: 300px;
    // background: #FFF;
    // border: 1px solid #EBEEF5;
    // padding: 12px;
    // color: #606266;
    // text-align: justify;
    // font-size: 14px;
    // box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    // word-break: break-all;
}
.addListNew {
    border-radius: 4px;
    line-height: 40px;
    background: #f2f2f2;
    cursor: pointer;

    .icon-add-new {
        padding: 0 20px 0 10px;
    }
}
.list-item {
    display: flex;
    padding: 10px 0;
    line-height: 40px;
    font-size: 0;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;

    .cover-img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        vertical-align: top;
    }

    .list-name {
        flex: 1;
        width: 250px;
        padding-left: 10px;
        line-height: 40px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
    }

    &:last-child {
        border: none;
    }
}
</style>
