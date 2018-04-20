<template>
	<div class="buttons themeBtn">
		<div class="singBtn btn-item">
			<span class="icon">
				<mu-icon value="person" :size="25"></mu-icon>
			</span>
			<span class="text">歌手</span>
		</div>
		<div class="rankBtn btn-item">
			<span class="icon">
				<mu-icon value="equalizer" :size="25"></mu-icon>
			</span>
			<span class="text">排行</span>
		</div>
		<div class="classBtn btn-item">
			<span class="icon">
				<mu-icon value="widgets" :size="25"></mu-icon>
			</span>
			<span class="text">分类</span>
		</div>
		<div class="mvBtn btn-item">
			<span class="icon">
				<mu-icon value="slideshow" :size="25"></mu-icon>
			</span>
			<span class="text">MV</span>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		data() {
			return {

			}
		},
		created() {
			this._changeTheme(this.themeColor)
		},
		computed: {
			...mapState({
				themeChange: state => state.AssetsService.themeChange
			})
		},
		watch: {
			themeChange(val) {
				this._changeTheme(val)
			}
		},
		methods: {
			_changeTheme(val) {
				this.$nextTick(() => {
					let tar = document.getElementsByClassName('mu-appbar')[0]
	  			let color = window.getComputedStyle(tar).backgroundColor
					let theme = document.getElementsByClassName('themeBtn')[0]
					theme.style.color = color
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.buttons {
		margin: 0 auto;
		width: 92vw;
		height: 10vh;
		display: flex;
		overflow: hidden;
		background: #fff;
		.btn-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			.text {
				font-size: 12px;
			}
		}
	}
</style>
