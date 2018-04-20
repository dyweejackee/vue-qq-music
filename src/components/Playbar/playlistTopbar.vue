<template>
	<div class="playlistTopbar">
		<div class="playWays" v-if="loopMode === 0" @click="changeMode">
			<div class="icon">
				<mu-icon value="repeat"></mu-icon>
			</div>
			<div class="explain">
				顺序播放 ({{playQueue.length}}首)
			</div>
		</div>
		<div class="playWays" v-else-if="loopMode === 1" @click="changeMode">
			<div class="icon">
				<mu-icon value="repeat_one"></mu-icon>
			</div>
			<div class="explain">
				单曲循环
			</div>
		</div>
		<div class="playWays" v-else @click="changeMode">
			<div class="icon">
				<mu-icon value="shuffle"></mu-icon>
			</div>
			<div class="explain">
				随机播放({{playQueue.length}}首)
			</div>
		</div>
		<div class="clear" @click="opendialog">
			<span class="icon-trash"></span>
		</div>
	  <mu-dialog :open="dialogShow">
	  	{{dialogMsg}}
	    <mu-flat-button slot="actions" @click="closedialog" primary label="取消"/>
	    <mu-flat-button slot="actions" primary label="确定" @click="clearList"/>
	  </mu-dialog>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		props: {
			test: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
  			dialogMsg: '清空当前播放队列？',
  			dialogShow: false
			}
		},
		created() {
			this._changeTheme(this.themeColor)
		},
		watch: {
			themeColor(val) {
				this._changeTheme(val)
			}
		},
		computed: {
			...mapState({
				themeColor: state => state.AssetsService.themeColor,
				playQueue: state => state.PlayService.playQueue,
				loopMode: state => state.PlayService.loopMode
			})
		},
		methods: {
			_changeTheme(val) {
				this.$nextTick(() => {
					document.getElementsByClassName('playWays')[0].style.color = val
					document.getElementsByClassName('icon-trash')[0].style.color = val
				})
			},
			changeMode() {
				this.$store.state.PlayService.loopMode++
				if(this.loopMode > 2) {
					this.$store.state.PlayService.loopMode = 0
				}
			},
  		opendialog() {
  			this.dialogShow = true
  		},
  		closedialog() {
  			this.dialogShow = false
  		},
  		clearList() {
  			this.closedialog()
  			this.$store.state.PlayService.playQueue = []
  			this.$store.state.PlayService.currentPlay = null
  			this.$emit('closeSheet')
  		}
		}
	}
</script>

<style lang="scss">
	.playlistTopbar {
		padding: 0 10px;
		&:after {
			content: '';
			display: block;
			clear: both;
		}
		.playWays {
			float: left;
			.icon,.explain {
				display: inline-block;
				vertical-align: top;
			}
			.explain {
				margin-top: 4px;
				font-size: 14px;
			}
		}
		.clear {
			float: right;
			padding-top: 2px;
		}
	}
</style>
