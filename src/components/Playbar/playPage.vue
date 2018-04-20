<template>
	<div class="playPage" v-if="currentPlay">
		<div class="bg" ref="bg">
			<img :src="currentPlay.img">
			<div class="cover"></div>
		</div>
		<div class="topInfo">
			<transition name="down">
				<div class="wrapper" v-show="logoShow">
					<div class="icon">
						<mu-icon value="keyboard_arrow_down" :size="25" @click="closePage"></mu-icon>
					</div>
					<div class="text">{{currentPlay.name}}</div>
					<div class="singer">
						-&nbsp;
						<span>{{currentPlay.singer}}</span>
						&nbsp;-
					</div>
				</div>
			</transition>
		</div>
		<div class="content">
			<div class="target" ref="target"></div>
			<transition name="moveout"
				@before-enter="beforeEnter"
				@enter="enter"
				@leave="leave"
			>
				<div class="avatar" v-show="logoShow" ref="avatarWrapper">
					<img :src="currentPlay.img" :onerror="errorimg" class="play" :class="stateClass"/>
				</div>
			</transition>
		</div>
		<transition name="up">
			<div class="footControl" v-show="logoShow">
				<div class="progress">
					<div class="currentTime">{{timenow}}</div>
					<div class="progress-line" @touchend="slideChange">
						<mu-slider ref="muslider" :value="percent" class="demo-slider" @change="changeValue"/>
					</div>
					<div class="titleTime">{{timetitle}}</div>
				</div>
				<div class="control">
					<div class="chooseMode" @click="selectMode">
						<mu-icon value="repeat" color="#A0A0A0" v-if="loopMode === 0"></mu-icon>
						<mu-icon value="repeat_one" color="#A0A0A0" v-else-if="loopMode === 1"></mu-icon>
						<mu-icon value="shuffle" color="#A0A0A0" v-else></mu-icon>
					</div>
					<div class="three-btn">
						<div class="skipPrevious" @click="toNextPrev(0)">
							<mu-icon value="skip_previous" class="theme" :size="50" v-show="true"></mu-icon>
						</div>
						<div class="play">
							<mu-icon :value="playicon" class="theme" :size="70" v-show="true" @click="controlPlay"></mu-icon>
						</div>
						<div class="skipNext" @click="toNextPrev(1)">
							<mu-icon value="skip_next" class="theme" :size="50" v-show="true"></mu-icon>
						</div>
					</div>
					<div class="playlist" @click="openListSheet">
						<mu-icon value="more_vert" color="#A0A0A0"></mu-icon>
					</div>
				</div>
				<transition name="tips">
					<div class="topTips" v-show="tipsShow" ref="toptips">
						<div class="block">
							<div class="icon">
								<span class="icon-checkmark-outline"></span>
							</div>
							<div class="text">
								已切换到{{tipsText}}模式
							</div>
						</div>
					</div>
				</transition>
			</div>
		</transition>
		<div class="cover"></div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { ErrorImg } from 'common/script/mixin'

	export default {
		mixins: [ ErrorImg ],
		props: {
			avatarTar: {
				type: Object,
				default() {
					return {
						el: 'yy'
					}
				}
			}
		},
		data() {
			return {
				initX: 0,
				initY: 0,
				logoShow: false,
				initposition: null,
				logoShow1: false,
				newValue: -1,
				tipsShow: false
			}
		},
		created() {
			this._changeTheme(this.themeColor)
		},
		watch: {
			themeColor(val) {
				this._changeTheme(val)
			},
			avatarTar() {

			}
		},
		computed: {
			...mapState({
				themeColor: state => state.AssetsService.themeColor,
				currentPlay: state => state.PlayService.currentPlay,
				playing: state => state.PlayService.playing,
				percent: state => state.PlayService.percent,
				currentTime: state => state.PlayService.currentTime,
				duration: state => state.PlayService.duration,
				timeGap: state => state.PlayService.timeGap,
				loopMode: state => state.PlayService.loopMode
			}),
			playicon() {
				return this.playing? 'pause': 'play_arrow'
			},
			stateClass() {
				return this.playing? 'continue': 'pause'
			},
			timenow() {
				return this._timeType(this.currentTime)
			},
			timetitle() {
				return this._timeType(this.duration)
			},
			tipsText() {
				switch(this.loopMode) {
					case 0:
						return '顺序播放'
					case 1:
						return '单曲循环'
					case 2:
						return '随机播放'
				}
			}
		},
		methods: {
			_timeType(t) {
				if(!t) {
					return '00:00'
				}
				let time = t
				let sec = parseInt(time % 60)
				let min = parseInt(time / 60)
				return ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2)
			},
			_changeTheme(val) {
				this.$nextTick(() => {
					let arr = document.getElementsByClassName('theme')
					for(let i = 0; i < arr.length; i++) {
						arr[i].style.color = val
					}
					let toptips = document.getElementsByClassName('topTips')[0]
					if(toptips) {
						toptips.style.backgroundColor = val
					}
				})
			},
			logoToggle() {
				this.logoShow = !this.logoShow
			},
			_trans(tar1,tar2) {
		  	let rect = tar2.getBoundingClientRect()
		  	let x = rect.left - this.initX
		  	let y = this.initY - (window.innerHeight - rect.bottom)
		  	let w = window.getComputedStyle(tar2).width
		  	let h = window.getComputedStyle(tar2).height
		  	tar1.style.width = w
		  	tar1.style.height = h
		  	tar1.style.transform = `translate3d(${x}px,${y}px,0)`
			},
			beforeEnter() {
				if(this.avatarTar.el) {
					this.initposition = this.avatarTar.el
			  	let rect = this.avatarTar.el.getBoundingClientRect()
			  	let x = rect.left
			  	let y = window.innerHeight - rect.bottom
			  	this.$refs.avatarWrapper.style.left = x + 'px'
			  	this.$refs.avatarWrapper.style.bottom = y + 'px'
			  	this.initX = x
			  	this.initY = y
				}
			},
			enter() {
				this._trans(this.$refs.avatarWrapper,this.$refs.target)
				this.$refs.target.style.opacity = 1
				this.$refs.bg.style.opacity = 1
			},
			leave() {
				this._trans(this.$refs.avatarWrapper,this.initposition)
				this.$refs.target.style.opacity = 0 
				this.$refs.bg.style.opacity = 0
			},
			closePage() {
				this.$emit('pageShow')
			},
			controlPlay() {
				this.$store.state.PlayService.playing = !this.$store.state.PlayService.playing
			},
			selectMode() {
				if(this.timeGap) return
				this.$store.state.PlayService.loopMode++
				if(this.loopMode > 2) {
					this.$store.state.PlayService.loopMode = 0
				}
				this.tipsShow = true
				clearTimeout(this.tipsTimer)
				let _this = this
				this.tipsTimer = setTimeout(() => {
					_this.tipsShow = false
				},2000)
			},
			changeValue(val) {
				this.newValue = val
			},
			slideChange() {
				if(this.newValue < 0) return
				let val = this.newValue
				let time = this.$store.state.PlayService.duration * val /100
				this.$emit('changeProgress',time)
				this.newValue = -1
			},
			toNextPrev(val) {
				// this.$emit('stopTimeout')
				if(this.timeGap) return
				this.$store.dispatch('toNextPrev',val)
			},
			openListSheet() {
				// this.$emit('openListSheet')
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/style/utils/utils';
	
	@keyframes rotate {
		0% {
			transform: rotate(0)
		}
		100% {
			transform: rotate(360deg)
		}
	}

	.playPage {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 100;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			transition: all .5s;
			overflow: hidden;
			background: #000;
			img {
				@include sizeFull;
				filter: blur(20px);
			}
			.cover {
				position: absolute;
				@include sizeFull;
				background: rgba(0,0,0,.4);
				z-index: 1;
			}
		}
		.topInfo {
			position: relative;
			z-index: 20;
			height: 12vh;
			padding-top: 2vh;
			.wrapper {
				position: relative;
				color: #fff;
				text-align: center;
				height: 10vh;
				&.down-enter-active,&.down-leave-active {
					transition: all .5s cubic-bezier(.62,.8,.95,1.29);
					transform: translate3d(0, 0, 0);
				}
				&.down-enter,&.down-leave-to {
					transform: translate3d(0, -12vh, 0);
					opacity: 0;
				}
				.icon {
					position: absolute;
					top: .5em;
					left: .7em;
				}
				.text {
					margin: 0 auto;
					@include textEllipsis;
					width: 70%;
					height: 6vh;
					line-height: 6vh;
					font-size: 18px;
				}
				.singer {
					font-size: 14px;
					line-height: 4vh;
					color: rgba(255,255,255,.5);
					span {
						color: #fff;
					}
				}
			}
		}
		.content {
			position: relative;
			width: 100%;
			height: 58vh;
			.target {
				position: absolute;
				left: 50%;
				top: 50%;
				margin: -8em 0 0 -8em;
				width: 16em;
				height: 16em;
				border-radius: 50%;
				transition: all .2s;
				box-shadow: 0 0 20px 3px rgba(0,0,0,.75);
				background: rgba(0,0,0,.4)
			}
			.moveout-enter-active,.moveout-leave-active {
				transition: all .3s cubic-bezier(.62,.8,.95,1.29);
			}
			.moveout-enter,.moveout-leave-to {
				transform: translate3d(0,0,0);
			}
			.avatar {
				position: fixed;
				width: 3.4em;
				height: 3.4em;
				border-radius: 50%;
				overflow: hidden;
				z-index: 10;
				img {
					@include sizeFull;
					&.play {
						animation: rotate 15s linear infinite
					}
					&.pause {
						animation-play-state: paused
					}
					&.continue {
						animation-play-state: running
					}
				}
			}
		}
		.footControl {
			position: relative;
			z-index: 20;
			height: 30vh;
			padding: 0 15px;
			&.up-enter-active,&.up-leave-active {
				transition: all .3s cubic-bezier(.62,.8,.95,1.29);
				transform: translate3d(0, 0, 0);
			}
			&.up-enter,&.up-leave-to {
				transform: translate3d(0, 22vh, 0);
				opacity: 0;
			}
			.progress {
				display: flex;
				height: 8vh;
				.currentTime,.titleTime {
					flex: 1;
					font-size: 13px;
					line-height: 24px;
					color: #BCBCBC;
				}
				.progress-line {
					flex: 10;
					padding: 0 10px;
				}
			}
			.control {
				display: flex;
				height: 22vh;
				text-align: center;
				div {
					line-height: 22vh;
					text-shadow: 0 0 10px rgba(0,0,0,.9);
				}
				.chooseMode,.playlist {
					flex: 1;
				}
				.three-btn {
					display: flex;
					flex: 6;
					div {
						flex: 1;
						padding-top: .6em;
					}
				}
			}
			.topTips {
				position: fixed;
				top: 0;
				left: 0;
				z-index: 1;
				width: 100vw;
				height: 6vh;
				color: #fff;
				box-shadow: 0 0 10px #000;
				opacity: .9;
				&.tips-enter-active,&.tips-leave-active {
					transition: all .3s;
				}
				&.tips-enter,&.tips-leave-to {
					opacity: 0;
					transform: translate3d(0,-6vh,0);
				}
				.block {
					margin: 0 7vw;
					width: 60%;
					height: 100%;
					.icon,.text {
						display: inline-block;
						line-height: 6vh;
						font-size: 14px;
						vertical-align: top;
					}
					.icon {
						margin-right: 3px;
						.icon-checkmark-outline {
							font-size: 20px;
							line-height: 6vh;
						}
					}

				}
			}
		}
		.cover {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 9vh;
			background: #fff;
			z-index: -1;
		}
	}
</style>
