<template>
	<div class="history">
		<MyNav :navData="mynavData"></MyNav>
		<div class="list" ref="listWrapper">
			<div>
				<!-- eslint-disable-next-line -->
				<div class="item-block" v-for="item,ind in historyList" :key="ind" @click="toplay(historyList,ind)">
					<p class="name" :class="{'currPlay': ind === selected}">{{item.name}}</p>
					<p class="info" :class="{'currPlay': ind === selected}">{{item.singer}}</p>
					<span class="icon-navigation-more"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import { savePlayHistory } from 'common/script/cache'
	import _ from 'lodash'
	import BScroll from 'better-scroll'
	import MyNav from 'components/MyNav'

	export default {
		data() {
			return {
				historyList: [],
				selected: -1
			}
		},
		components: {
			MyNav
		},
		created() {
			this.$nextTick(() => {
				this._initHistory()
				this._initScroll()
			})
		},
		computed: {
			...mapState({
				currentPlay: state => state.PlayService.currentPlay
			}),
			mynavData() {
				if(this.historyList.length > 0) {
		    	let sendData = {
		    		name: 'history',
		    		data: {
			    		list: this.historyList,
			    		ind: 0
		    		}
		    	}
		    	return sendData
				}
				return {}
			}
		},
		watch: {
			currentPlay(val) {
				if(val) {
					this._initHistory(val)
				}
			}
		},
		methods: {
			_initScroll() {
				this.scroll = new BScroll(this.$refs.listWrapper,{
					click: true,
					bounceTime: 300
				})
			},
			_initHistory(val) {
				this.selected = -1
				this.historyList = savePlayHistory(val)
				let ind = this.historyList.findIndex(v => {
					return _.isEqual(v,this.currentPlay)
				})
				if(ind >= 0) {
					this.selected = ind
				}
			},
			toplay(list,ind) {  	
	    	let sendData = {
	    		list,
	    		ind
	    	}
				this.$store.commit('songTo',sendData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.history {
		// border: 1px solid blue;
		height: 67vh;
		.control-nav {
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
		.list {
			width: 100%;
			height: 60vh;
			padding: 0 10px;
			overflow: hidden;
			.item-block {
				position: relative;
				width: 100%;
				font-size: 14px;
				line-height: 20px;
				padding: 10px 5px;
				border-bottom: 1px solid #DFDFDF;
				p {
					width: 70%;
					color: #222;
					&.currPlay {
						color: #50C892;
					}
				}
				.info {
					font-size: 12px;
					color: #7D7D7D;
				}
				.icon-navigation-more {
					position: absolute;
					right: 0;
					top: 50%;
					margin-top: -7px;
				}
			}
		}
	}
</style>
