<template>
  <div id="app">
    <transition name="moveout">
      <router-view></router-view>
    </transition>
    <Header @slideTo="slideTo" ref="header"></Header>
    <div class="pages">
      <swiper :options="swiperOption" ref="swiper">
        <swiperSlide>
          <Recommend></Recommend>
        </swiperSlide>
        <swiperSlide>
          <Loc></Loc>
        </swiperSlide>
      </swiper>
    </div>
    <Playbar @playBarTog="playBarTog" class="playbar" :class="{'tobottom':!playShow}"></Playbar>
  </div>
</template>

<script>
  import { swiper,swiperSlide } from 'vue-awesome-swiper'
  import Header from 'components/Header'
  import Playbar from 'components/Playbar'
  import Recommend from 'components/Recommend'
  import Loc from 'components/Loc'

  export default {
    data() {
      return {
        // swiper配置
        swiperOption: {

        },
        // 项目配置
        playShow: true
      }
    },
    created() {
      this.$nextTick(() => {
        if(this.swiper) {
          this.swiper.on('onTransitionEnd',v => {
            this.$refs.header.changeNav(v.activeIndex)
          })
        }
      })
    },
    components: {
      swiper,
      swiperSlide,
      Header,
      Playbar,
      Recommend,
      Loc
    },
    computed: {
      swiper() {
        return this.$refs.swiper.swiper
      }
    },
    methods: {
      playBarTog() {
        this.playShow = !this.playShow
      },
      slideTo(v) {
        let ind = v === 'music'? 0: 1
        this.swiper.slideTo(ind)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #app {
    .moveout-enter-active,.moveout-leave-active {
      transition: all .3s;
    }
    .moveout-enter,.moveout-leave-to {
      transform: translate3d(100vw,0,0);
    }
    .playbar {
      transition: all .3s;
      &.tobottom {
        transform: translateY(9vh);
        opacity: 0;
      }
    }
    .pages {
      position: fixed;
      top: 18vh;
      width: 100vw;
      height: 73vh;
      z-index: -1;
      overflow: hidden;
    }
  }
</style>
