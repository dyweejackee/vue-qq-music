<template>
  <div class="Playbar">
  	<div class="playInfobox" @click="pageShow" @touchmove="touchmove">
			<div class="slide-block playInfo" v-show="!currentPlay">
				<div class="info-block init-block">
					<div class="initTitle">
						DW音乐 - FROM DINGWEI
					</div>
				</div>
			</div>
	  	<swiper :options="swiperOption" ref="myswiper" v-show="currentPlay">
	  		<!-- eslint-disable-next-line -->
	  		<swiper-slide class="class1" :class="{'swiper-no-swiping':noswiper}" v-for="item,ind in datalength" :key="ind">
	  			<slideBlock ref="slider" @getPosition="getPosition" :dataSend="ind"></slideBlock>
	  		</swiper-slide>
	  	</swiper>
			<div class="cover"></div>
  	</div>
		<div class="operation">
			<div class="playBtn">
				<mu-circular-progress class="circle" mode="determinate" :size="50" :strokeWidth="3" :value="percent" v-show="circleShow"/>
				<mu-icon class="playicon" :value="playIcon" color="#ddd" :size="40" @click="playControl"/>
			</div>
			<div class="playList">
				<mu-icon class="playicon" value="queue_music" color="#ddd" :size="40" @click="openListSheet"/>
			</div>
		</div>
	  <mu-bottom-sheet class="bottomlist" :open="listSheet" @close="closeListSheet">
	    <mu-list>
	      <mu-list-item>
					<playlistTopbar @closeSheet="closeListSheet"></playlistTopbar>
	      </mu-list-item>
	      <mu-list-item>
	      	<playlistContent @contentCLose="closeListSheet"></playlistContent>
	      </mu-list-item>
	      <mu-list-item style="text-align: center;" @click="closeListSheet">关闭</mu-list-item>
	    </mu-list>
	  </mu-bottom-sheet>
	  <playPage
	  	ref="playPage"
	  	v-show="playPageShow"
	  	@pageShow="pageShow"
	  	:avatarTar="avatarTar"
	  	@changeProgress="changeProgress"
	  	@openListSheet="openListSheet"
	  ></playPage>
		<audio ref="player"
			@timeupdate="updataTime"
			@ended="playEnd"
			@error="playEnd"
		></audio>
		<div class="initpos" ref="initpos"></div>
  </div>
</template>

<script>
	import Vue from 'vue'
	import { swiper,swiperSlide } from 'vue-awesome-swiper'
	import { mapState,mapGetters } from 'vuex'

	import slideBlock from './slideBlock'
	import playlistTopbar from './playlistTopbar'
	import playlistContent from './playlistContent'
	import playPage from './playPage'

  export default {
  	data() {
  		return {
  			// museui配置
  			listSheet: false,
  			// swiper配置
  			swiper: null,
  			swiperOption: {
  				observer: true,
  				touchRatio: 0.1,
  				loop: true,
  				speed: 500
  			},
  			slideIndex: 0,
  			noswiper: false,
  			// 项目配置
  			hasList: true,
  			statePlay: true,
  			playPageShow: false,
  			avatarTar: {},
  			playUrl: '',
  			timeout: null,
  			timeout2: null,
  			datalength: 5
  		}
  	},
  	components: {
  		swiper,
  		swiperSlide,
  		slideBlock,
  		playlistTopbar,
  		playlistContent,
  		playPage
  	},
  	computed: {
  		circleShow() {
  			return this.percent > 0
  		},
  		playState() {
  			return this.statePlay? 'pause': 'continue'
  		},
  		playIcon() {
  			return this.playing? 'pause': 'play_arrow'
  		},
			...mapState({
  			themeChange: state => state.AssetsService.themeChange,
				currentPlay: state => state.PlayService.currentPlay,
				playing: state => state.PlayService.playing,
				percent: state => state.PlayService.percent,
				currentInd: state => state.PlayService.currentInd,
				playQueue: state => state.PlayService.playQueue,
				timeGap: state => state.PlayService.timeGap,
				operedQueue: state => state.PlayService.operedQueue,
				clickNextPrev: state => state.PlayService.clickNextPrev
			}),
			...mapGetters([
				'currentInd','operedInd'
			])
  	},
  	watch: {
  		themeChange() {
  			this._changeTheme()
  		},
			currentPlay(val) {
				clearTimeout(this.timeout)
				clearTimeout(this.timeout2)
				// 为了修正由于设置切歌间隔同时修改playing值造成的报错
				this.timeout = setTimeout(() => {
					this.$store.state.PlayService.playing = false
					this.$refs.player.currentTime = 0
				},100)
				if(val) {
					// 获取swiper实例
					this.$nextTick(() => {
						if(!this.swiper) {
							this.swiper = this.$refs.myswiper? this.$refs.myswiper.swiper: null
						}
					})
					this._changeTheme()
					this.$store.state.PlayService.timeGap = true
					// 设置切歌间隔时间为0.5s
					this.timeout2 = setTimeout(() => {
						this.playUrl = val.url
						this.$refs.player.src = this.playUrl
						this.$store.state.PlayService.playing = true
						this.$store.state.PlayService.timeGap = false
					},500)
				} else {
					let color = '#ddd'
					this._toDisable(color)
					this.playUrl = ''
				}
			},
			playing(val) {
				if(val) {
					this.$refs.player.play()
				} else {
					this.$refs.player.pause()
				}
			},
			clickNextPrev(val) {
				if(this.swiper) {
					// this.swiper.slideTo(this.operedInd + 1)
					this.swiper.slideNext()
				}
			},
	  	// 给swiper配置
			swiper(val) {
				if(val) {
					val.on('onSetTransition',() => {
						val.disableTouchControl()
						if(this.slideIndex !== val.realIndex) {
							this.$store.dispatch('playAtIndex',val.realIndex)
							this.slideIndex = val.realIndex
						}
					})
					val.on('onTransitionEnd',() => {
						val.enableTouchControl()
						// 针对swiper，loop模式下，先后复制元素会造成动画不连贯
						if(val.activeIndex === this.datalength + 1) {
							val.activeIndex = 1
						}
						if(val.activeIndex === 0) {
							val.activeIndex = this.datalength
						}
					})
				}
			},
			// 监视播放列表顺序
			playQueue(v) {
				this._initSwiperList()
				this.$nextTick(() => {
					this.datalength = v.length
					if(v.length <= 1) {
						this.noswiper = true
					} else {
						this.noswiper = false
					}
				})
			}
  	},
  	created() {
  		this.$nextTick(() => {
  			this._changeTheme()
  		})
  	},
	  methods: {
	  	_initSwiperList() {
  			let arr = []
  			this.playQueue.forEach((v) => {
  				arr.push(v)
  			})
  			// 数组处理两次，让最终列表匹配swiper顺序
  			let arr1 = arr.splice(this.currentInd)
  			let arr2 = arr
  			let operArr = arr1.concat(arr2)

  			let arrR = operArr.splice(-this.slideIndex)
  			let arrL = operArr

  			let dataArr = arrR.concat(arrL)
  			this.$store.state.PlayService.operedQueue = dataArr
	  	},
	  	touchmove() {
	  		if(!this.currentPlay) return
  			if(this.swiper.animating || this.timeGap) {
  				this.swiper.params.allowSwipeToNext = false
  				this.swiper.disableTouchControl()
  				return
  			}
  			this.swiper.enableTouchControl()
  			this.swiper.params.allowSwipeToNext = true
	  	},
	  	// 工具函数 - 循环
	  	_loopNext(num,len) {
	  		if(num > len - 1) {
	  			return num - len
	  		}
	  		if(num < 0) {
	  			return num + len
	  		}
	  		return num
	  	},
	  	// museui配置
	    closeListSheet () {
	    	let _this = this
	      this.listSheet = false
	      setTimeout(() => {
	      	_this.$emit('playBarTog')
	      },300)
	    },
	    openListSheet () {
	  		if(!this.currentPlay) {
	  			return
	  		}
	      this.$emit('playBarTog')
	      setTimeout(() => {
	      	this.listSheet = true
	      },300)
	    },
	    // 项目配置
	    _toDisable(color) {
  			let arr = document.getElementsByClassName('playicon')
  			for(let i = 0; i < arr.length; i++) {
  				arr[i].style.color = color
  			}
	    },
	  	_changeTheme() {
	  		this.$nextTick(() => {
	  			if(!this.currentPlay) {
	  				return
	  			}
	  			let tar = document.getElementsByClassName('mu-appbar')[0]
	  			let color = window.getComputedStyle(tar).backgroundColor
	  			this.$store.state.AssetsService.themeColor = color
	  			this._toDisable(color)
	  		})
	  	},
	  	playControl() {
	  		if(!this.currentPlay) {
	  			return
	  		}
	  		this.statePlay = !this.statePlay
	  		this.$store.state.PlayService.playing = !this.playing
	  	},
	  	pageShow() {
	  		if(!this.currentPlay) {
	  			return
	  		}
	  		this.$refs.slider[this.slideIndex].pageout()
	  		this.$refs.playPage.logoToggle()
	  		// 处理关闭playPage的logo动画
	  		if(!this.$refs.playPage.logoShow) {
	  			setTimeout(() => {
	  				this.playPageShow = !this.playPageShow
	  			},300)
	  			return
	  		}
	  		this.playPageShow = !this.playPageShow
	  	},
	  	getPosition(tar) {
	  		Vue.set(this.avatarTar,'el',this.$refs.initpos)
	  	},
	  	updataTime(e) {
	  		let currtime = e.target.currentTime
	  		let duration = e.target.duration
	  		let per = parseInt(currtime / duration * 100)
	  		this.$store.state.PlayService.percent = per
	  		this.$store.state.PlayService.currentTime = currtime
	  		this.$store.state.PlayService.duration = duration
	  	},
	  	changeProgress(val) {
	  		this.$store.state.PlayService.playing = true
	  		this.$refs.player.currentTime = val
	  	},
	  	playEnd() {
	  		this.$store.dispatch('toNextPrev',1)
	  	}
	  }
  }
</script>

<style lang="scss" scoped>
	@mixin sizeFull {
		width: 100%;
		height: 100%;
	}
	@mixin textEllipsis {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	@mixin vCenter($size) {
		position: absolute;
		top: 50%;
		margin-top: -$size;
	}

	.Playbar {
		position: fixed;
		display: flex;
		bottom: 0;
		width: 100%;
		height: 9vh;
		background: #fff;
		z-index: 200;
		.playInfobox {
			position: relative;
			flex: 65;
			height: 100%;
			overflow: hidden;
			.playInfo {
				position: relative;
				height: 9vh;
				overflow: hidden;
				background: #fff;
				.info-block {
					position: relative;
					@include sizeFull;
					padding: 0 15px;
					.initTitle {
						font-size: 14px;
						line-height: 9vh;
						color: #8A8A8A;
					}
				}
			}
			.cover {
				position: absolute;
				top: 0;
				left: 0;
				@include sizeFull;
				overflow: hidden;
				z-index: 100;
				pointer-events: none;
				box-shadow: 0 0 25px 10px #fff inset;
			}
		}
		.operation {
			position: relative;
			flex: 35;
			.playicon {
				@include vCenter(20px);
				left: 50%;
				margin-left: -20px;
			}
			.playBtn {
				@include vCenter(25px);
				left: 15px;
				width: 50px;
				height: 50px;
				.circle {
					transform: rotate(-90deg);
				}
			}
			.playList {
				@include vCenter(25px);
				right: 15px;
				width: 50px;
				height: 50px;
			}
		}
		.initpos {
			// @include vCenter(50px);
			position: absolute;
			top: 50%;
			left: 2.3vh;
			margin-top: -25px;
			width: 50px;
			height: 50px;
		}
	}
</style>
