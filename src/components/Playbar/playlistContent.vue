<template>
	<div class="playlistContent">
		<!-- eslint-disable-next-line -->
		<div class="list-item" v-for="item,i in playQueue" :key="i" @click="selectPlay(i)">
			<div class="info" :class="{'curr':i === currentInd}">
				<span class="song">{{item.name}}</span>
				<span class="singer">- {{item.singer}}</span>
			</div>
			<div class="delete" @click.stop="deleteSong(i,item.mid)">
				<span class="icon-close2"></span>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState,mapGetters } from 'vuex'

	export default {
		data() {
			return {
			}
		},
		computed: {
			...mapState({
				playQueue: state => state.PlayService.playQueue
			}),
			...mapGetters([
				'currentInd'
			])
		},
		watch: {
			playQueue(v) {
				if(v.length === 0) {
					this.$emit('contentCLose')
				}
			}
		},
		methods: {
			deleteSong(ind,mid) {
				let sendData = {
					ind,
					mid
				}
				this.$store.commit('deleteSong',sendData)
			},
			selectPlay(i) {
				let obj = {
					name: 'listPlay',
					ind: i
				}
				this.$store.dispatch('playAtIndex',obj)
			}
		}
	}
</script>

<style lang="scss">
	.playlistContent {
		max-height: 50vh;
		overflow: auto;
		.list-item {
			margin-bottom: 10px;
			padding: 15px 0;
			border-bottom: 1px solid #ddd;
			&:after {
				content: '';
				display: block;
				clear: both;
			}
			.info {
				float: left;
				.song {
					font-size: 16px;
				}
				.singer {
					font-size: 13px;
					color: #868686;
				}
				&.curr {
					.song,.singer {
						color: #44C589;
					}
				}
			}
			.delete {
				float: right;
			}
		}
	}
</style>
