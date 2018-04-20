<template>
	<div class="loc">
		<div class="locNav">
			<span class="history" :class="{'curr':current}">最近播放</span>
			<b></b>
			<span class="save">收藏歌单</span>
		</div>
		<div class="content">
			<history></history>
		</div>
	</div>
</template>

<script>
	import history from './history'

	export default {
		data() {
			return {
				current: true
			}
		},
		components: {
			history
		}
	}
</script>

<style lang="scss" scoped>
	.loc {
		// border: 1px solid red;
		// width: 100vw;
		height: 73vh;
		overflow: hidden;
		.locNav {
			line-height: 30px;
			font-size: 0;
			text-align: center;
			color: #7D7D7D;
			height: 6vh;
			span {
				font-size: 14px;
				&.curr {
					color: #000;
				}
			}
			b {
				margin: 0 20px;
				font-size: 15px;
				border-left: 1px solid #7D7D7D;
			}
		}
	}
</style>
