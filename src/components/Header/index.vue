<template>
  <div class="Header">
    <div class="header-wrapper" ref="headerWrapper">
      <div class="nav" ref="headerNav">
        <!-- 左右按键 -->
        <mu-appbar class="leftBtn">
          <mu-icon-button icon="menu" slot="left" @click="toggle(true)">
            <mu-badge :content="tips" class="demo-icon-badge" circle secondary v-if="tips">
              <mu-icon value="menu"/>
            </mu-badge>
          </mu-icon-button>
          <mu-icon-menu slot="right" icon="add" :value="theme">
            <mu-menu-item title="扫一扫" value="light" />
            <mu-menu-item title="识歌" value="carbon" />
          </mu-icon-menu>
        </mu-appbar>
        <!-- 按钮导航 -->
        <mu-paper class="navTabs">
          <mu-bottom-nav :value="bottomNav" shift @change="handleChange">
            <mu-bottom-nav-item value="music" title="音乐馆" icon="music_note"/>
            <mu-bottom-nav-item value="loc" title="本地" icon="account_box"/>
          </mu-bottom-nav>
        </mu-paper>
        <!-- 左弹出页 -->
        <mu-drawer class="leftMenu" :open="open" :docked="docked" @close="toggle()">
          <mu-list class="theme-list">
            <mu-list-item title="选择主题"/>
            <mu-divider shallowInset/>
            <mu-list-item>
              <mu-radio label="LIGHT" name="group" nativeValue="light" v-model="theme" class="demo-radio"/>
            </mu-list-item>
            <mu-list-item>
              <mu-radio label="CARBON" name="group" nativeValue="carbon" v-model="theme" class="demo-radio"/>
            </mu-list-item>
            <mu-list-item>
              <mu-radio label="TEAL" name="group" nativeValue="teal" v-model="theme" class="demo-radio"/>
            </mu-list-item>
            <mu-list-item>
              <mu-radio label="DARK" name="group" nativeValue="dark" v-model="theme" class="demo-radio"/>
            </mu-list-item>
          </mu-list>
          <mu-list class="theme-list" v-if="tips">
            <mu-divider shallowInset/>
            <mu-list-item @click="checkMsg">
              <mu-menu>
                <mu-menu-item title="播放列表已更新">
                  <mu-badge :content="tips" slot="after" circle color="#FF4081"/>
                </mu-menu-item>
              </mu-menu>
            </mu-list-item>
          </mu-list>
        </mu-drawer>
      </div>
      <div class="search-wrapper">
        <MySearch @searching="searching" @outSearching="outSearching"></MySearch>
      </div>
    </div>
    <div class="left-menu">
    	
    </div>
  </div>
</template>

<script>
  /* eslint-disable-next-line */
  import light from '!raw-loader!muse-ui/dist/theme-default.css'
  /* eslint-disable-next-line */
  import carbon from '!raw-loader!muse-ui/dist/theme-carbon.css'
  /* eslint-disable-next-line */
  import teal from '!raw-loader!muse-ui/dist/theme-teal.css'
  /* eslint-disable-next-line */
  import dark from '!raw-loader!muse-ui/dist/theme-dark.css'

  import MySearch from 'components/MySearch'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        // museui组件配置
        title: 'eg',
        theme: 'light',
        themes: {
          light,
          carbon,
          teal,
          dark
        },
        tips: 0,
        bottomNav: 'music',
        bottomNavColor: 'music',
        open: false,
        docked: true,
        // header组件配置
        navShow: true,
        searchPageOut: false,
        switching: false
      }
    },
    computed: {
      ...mapState({
        playQueue: state => state.PlayService.playQueue
      })
    },
    watch: {
      playQueue() {
        this.tips = '' + ++this.tips
      },
      theme(val) {
        this.changeTheme(val)
      },
      searchPageOut(val) {
        let navHeight = this.$refs.headerNav.clientHeight
        let headerWrapper = this.$refs.headerWrapper
        if(val) {
          headerWrapper.style.transform = `translateY(${-navHeight}px)`
          this.$refs.headerNav.style.opacity = 0
        } else {
          headerWrapper.style.transform = ``
          this.$refs.headerNav.style.opacity = 1
        }
      }
    },
    methods: {
      // museui配置
      changeTheme(theme) {
        this.theme = theme
        const styleEl = this.getThemeStyle()
        styleEl.innerHTML = this.themes[theme] || ''
        this.$store.state.AssetsService.themeChange = !this.$store.state.AssetsService.themeChange
      },
      // museui配置
      getThemeStyle() {
        const themeId = 'muse-theme'
        let styleEl = document.getElementById(themeId)
        if (styleEl) return styleEl
        styleEl = document.createElement('style')
        styleEl.id = themeId
        document.body.appendChild(styleEl)
        return styleEl
      },
      handleChange (val) {
        this.bottomNav = val
        this.$emit('slideTo',val)
      },
      toggle (flag) {
        if(this.switching) return
        this.open = !this.open
        this.docked = !flag
      },
      checkMsg() {
        this.tips = 0
      },
      searching() {
        this.searchPageOut = true
        this.switching = true
      },
      outSearching() {
        this.searchPageOut = false
        setTimeout(() => {
          this.switching = false
        },500)
      },
      changeNav(v) {
        this.bottomNav = v? 'loc': 'music'
      }
    },
    components: {
      MySearch
    }
  }
</script>

<style lang="scss" scoped>
  .Header {
    .header-wrapper {
      transition: all .5s;
      // .out-enter-active,.out-leave-active {
      //   transition: all .5s;
      // }
      // .out-enter,.out-leave-to {
      //   opacity: 0;
      //   transform: translateY(-40px)
      // }
      .nav {
        position: relative;
        transition: all .5s;
        .navTabs {
          position: absolute;
          top: -1px;
          left: 20%;
          width: 60%;
          box-shadow: none;
        }
      }
      .search-wrapper {
        padding-top: 5px;
      }
    }
  }
</style>
