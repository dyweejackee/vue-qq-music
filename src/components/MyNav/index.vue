<template>
	<div class="mynav">
		<div class="playall" @click="playall">
			<span class="icon-play2"></span>
			<span class="text">
				全部播放
			</span>
		</div>
		<div class="manage">
			<span class="icon-list"></span>
			<span class="text">
				{{text}}
			</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: '管理'
			},
			navData: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		methods: {
			playall() {
				if(this.navData.name === 'album') {
					this.$store.commit('albumAdd',this.navData.data)
				} else {
					this.$store.commit('songTo',this.navData.data)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mynav {
		width: 100%;
		height: 7vh;
		border-bottom: 1px solid #DFDFDF;
		padding: 0 30px;
		.playall,.manage {
			line-height: 7vh;
			vertical-align: top;
			font-size: 14px;
			.icon-play2,.icon-list {
				margin-right: 5px;
				color: #50C892;
			}
			&.playall {
				float: left;
			}
			&.manage {
				float: right;
			}
		}
	}
</style>
