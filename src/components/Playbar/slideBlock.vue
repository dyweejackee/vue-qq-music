<template>
	<div class="slide-block playInfo" ref="test">
<!-- 		<div class="info-block init-block" v-if="!haslist">
			<div class="initTitle">
				DW音乐 - FROM DINGWEI
			</div>
		</div> -->
		<div class="info-block" v-if="dataMsg">
			<div class="avatar" ref="avatarWrapper">
				<img v-lazy="dataMsg.img" :class="[{'play':isPlay},playState]">
			</div>
			<div class="info">
				<div class="textbox">
					<!-- {{currentPlay.name}} -->
					<p class="title" ref="songname">{{dataMsg.name}}</p>
					<p class="text">左右横滑可切换上下首</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { ErrorImg } from 'common/script/mixin'
	import { mapState,mapGetters } from 'vuex'

	export default {
  	mixins: [ErrorImg],
  	props: {
  		dataSend: {
  			type: Number
  		}
  	},
		data() {
			return {
  			// 项目配置
  			isPlay: true,
  			interval: null,
  			timeout: null,
  			haslist: false,
  			dataMsg: null
			}
		},
		created() {
			// this.isPlay = true
			if(this.operedQueue) {
				this.dataMsg = this.operedQueue[this.dataSend]
			}
		},
		watch: {
			operedQueue() {
				if(this.operedQueue) {
					this.dataMsg = this.operedQueue[this.dataSend]
				}
			},
			// 处理滑动切歌
			dataSend(v) {
				if(this.operedQueue) {
					this.dataMsg = this.playQueue[v]
				}
			},
			// 处理歌名太长
			currentPlay(val) {
				this.haslist = Boolean(this.currentPlay)
				clearInterval(this.interval)
				clearTimeout(this.timeout)
				this.$nextTick(() => {
					let songname = this.$refs.songname
					if(!songname) return
					let textbox = songname.parentElement
					songname.style.transition = ''
					songname.style.transform = ''
					let w1 = parseFloat(window.getComputedStyle(songname).width)
					let w2 = parseFloat(window.getComputedStyle(textbox).width)
					let _this = this
					if(w1 > w2) {
						songname.style.transition = 'all 5s linear'
						_this.timeout = setTimeout(() => {
							songname.style.transform = `translate3d(-${w1 - w2}px,0,0)`
							_this.timeout = setTimeout(() => {
								songname.style.transform = ''
								_this.nameTooLong(w1,w2,songname)
							},5000)
						},2000)
					} 
				})
			},
			operedInd() {
				// 切歌将动画复原
				this.isPlay = false
				setTimeout(() => {
					this.isPlay = true
				},50)
			}
		},
		computed: {
			...mapState({
				currentPlay: state => state.PlayService.currentPlay,
				playing: state => state.PlayService.playing,
				percent: state => state.PlayService.percent,
				operedQueue: state => state.PlayService.operedQueue
			}),
			...mapGetters([
				'operedInd'
			]),
			playState() {
				if(this.dataSend === this.operedInd && this.playing) {
					return 'continue'
				}
				return 'pause'
			}
		},
		methods: {
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
			pageout() {
				this.$emit('getPosition',this.$refs.avatarWrapper)
			},
			nameTooLong(w1,w2,songname) {
				let _this = this
				this.interval = setInterval(() => {
					songname.style.transform = `translate3d(-${w1 - w2}px,0,0)`
					_this.timeout = setTimeout(() => {
						songname.style.transform = ''
					},5000)
				},12000)
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
			.avatar {
				@include vCenter(1.7em);
				width: 3.4em;
				height: 3.4em;
				border-radius: 50%;
				overflow: hidden;
				img {
					@include sizeFull;
					border-radius: 50%;
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
			.info {
				position: relative;
				margin-left: 3.7em;
				height: 100%;
				width: 75%;
				.textbox {
					@include vCenter(20px);
					height: 40px;
					width: 100%;
					overflow: hidden;
					.title {
						display: inline-block;
						box-sizing: border-box;
						white-space: nowrap;
						font-size: 16px;
						line-height: 20px;
					}
					.text {
						@include textEllipsis;
						font-size: 13px;
						line-height: 20px;
						color: #40C487;
					}
				}
			}
		}
	}
</style>
