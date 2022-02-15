<template>
    <div class='banner'>
        <div class="w1200">
            <swiper class="banner_wrap" :options="swiperOption" v-if="bannerInit" ref="mySwiper">
                <swiper-slide v-for="item of banners" :key="item.imageUrl">
                    <el-image :src="item.imageUrl" :alt="item.typeTitle" class="banner_img" @click="pathHandler(item)">
                        <div slot="placeholder" class="image-slot">
                            <i class="iconfont icon-placeholder"></i>
                        </div>
                    </el-image>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
export default {
    components: {
        Swiper,
        SwiperSlide
    },
    data () {
        // 这里存放数据
        return {
            banners: [],
            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 30,
                slidesPerGroup: 3,
                loop: true,
                loopFillGroupWithBlank: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                }
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {
        bannerInit () {
            return this.banners.length
        },
        swiper () {
            return this.$refs.mySwiper.$swiper
        }
    },
    created () {
        this.getBanner()
    },
    // 方法集合
    methods: {
        async getBanner () {
            try {
                const { data: res } = await this.$http.getBanner()

                if (res.code !== 200) {
                    return this.$msg.error('数据请求失败')
                }

                this.banners = res.banners
            } catch (error) {
                console.log(error)
            }
        },
        pathHandler (params) {
            switch (params.targetType) {
                case 1: // 单曲
                    this.$router.push({ path: '/song', query: { id: params.targetId } })
                    break
                case 10: // 专辑
                    this.$router.push({ path: '/album', query: { id: params.targetId } })
                    break
                case 1000: // 歌单
                    this.$router.push({ path: '/playlist', query: { id: params.targetId } })
                    break
                case 1004: // MV
                    this.$router.push({ path: '/mv', query: { id: params.targetId } })
                    break
                case 3000: // 外链
                    window.open(params.url, '_blank')
                    break
            }
        }
    }
}
</script>
<style scoped lang="less">
.banner {
    height: 220px;
}
.banner_wrap {
    position: relative;
    padding: 40px 0;
    font-size: 0;

    .banner_img {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .swiper-slide, .el-image {
        height: 140px;
    }
}
</style>
