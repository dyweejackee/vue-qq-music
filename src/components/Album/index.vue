<template>
	<div class="album">
		<div class="nav">
			<span class="icon-cheveron-left" @click="$router.go(-1)"></span>
			<span class="icon-navigation-more">
			</span>
			<div class="title">
				{{title}}
			</div>
		</div>
		<div class="scrollWrapper">
			<div>
				<div class="top">
					<div v-if="albumData">
						<div class="cover">
							<img v-lazy="imgurl">
							<div class="cover-face"></div>
						</div>
						<div class="top-up">
							<div class="img">
								<img v-lazy="imgurl">
							</div>
							<div class="info">
								<div class="name">
									{{albumData.name}}
								</div>
								<div class="singer">
									{{albumData.singername}}
								</div>
								<div class="intr">
									<span class="text">简介: {{albumData.desc}}</span>
								</div>
								<span class="icon-cheveron-right"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="content">
					<MyNav :text="text" :navData="mynavData"></MyNav>
					<div class="list" v-if="albumData" ref="scrollWrapper">
						<div>
							<!-- eslint-disable-next-line -->
							<div class="list-item" v-for="item,ind in albumData.list" :key="ind" @click="toplay(albumData.list,ind)">
								<div class="item-index">
									{{ind + 1}}
								</div>
								<div class="item" :class="{'curr': item.songmid === (currentPlay?currentPlay.mid:-1)}">
									<div class="song">
										{{item.songname}}
									</div>
									<div class="singer">
										{{albumData.singername}}
									</div>
								</div>
								<div class="more" @click.stop="">
									<span class="icon-navigation-more"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { imgUrl } from 'common/script/imgFactory'
	import MyNav from 'components/MyNav'
	import BScroll from 'better-scroll'
	import { mapState } from 'vuex'

	const ERR_OK = 0

	export default {
		data() {
			return {
				text: '多选',
				title: '专辑',
				albumData: null
			}
		},
		components: {
			MyNav
		},
		created() {
			this.$store.dispatch('getAlbum',this.albumId).then(res => {
				let resObj = res.body
				if(resObj.code === ERR_OK) {
					this.albumData = resObj.data
				}
			}).catch(err => {
				console.log(err)
			})
		},
		watch: {
			albumData() {
				this.$nextTick(() => {
					this._initScroll()
				})
			}
		},
		computed: {
			...mapState({
				currentPlay: state => state.PlayService.currentPlay
			}),
			albumId() {
				return this.$route.params.id
			},
			imgurl() {
				return imgUrl(this.albumId)
			},
			mynavData() {
				if(this.albumData) {
		    	let sendData = {
		    		name: 'album',
		    		data: {
			    		list: this.albumData.list,
			    		ind: 0,
			    		singer: this.albumData.singername
		    		}
		    	}
		    	return sendData
				}
				return {}
			}
		},
		methods: {
			_initScroll() {
				this.scroll = new BScroll(this.$refs.scrollWrapper,{
					click: true
				})
			},
			toplay(list,ind) {
	    	let sendData = {
	    		list,
	    		ind,
	    		singer: this.albumData.singername
	    	}
				this.$store.commit('albumAdd',sendData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/style/utils/utils';

	.album {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 9vh;
		background: #fff;
		z-index: 100;
		.nav {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 15;
			width: 100%;
			height: 8vh;
			padding: 0 15px 0 20px;
			color: #fff;
			.title {
				width: 100%;
				height: 8vh;
				line-height: 8vh;
				text-align: center;
			}
			.icon-cheveron-left {
				line-height: 8vh;
				float: left;
			}
			.icon-navigation-more {
				line-height: 8vh;
				float: right;
			}
		}
		.scrollWrapper {
			width: 100%;
			height: 91vh;
		}
		.top {
			position: relative;
			background: #ddd;
			width: 100%;
			height: 35vh;
			padding-top: 10vh;
			overflow: hidden;
			.cover {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				filter: blur(30px);
				img {
					width: 100%;
				}
				.cover-face {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0,0,0,.2);
				}
			}
			.top-up {
				position: relative;
				z-index: 10;
				width: 100%;
				height: 20vh;
				padding: 0 20px;
				font-size: 0;
				display: flex;
				color: rgba(255,255,255,.9);
				.img {
					width: 20vh;
					height: 20vh;
					overflow: hidden;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.info {
					position: relative;
					flex: 1;
					// border: 1px solid red;
					height: 20vh;
					font-size: 12px;
					padding: 12px 0 12px 10px;
					div {
						margin-bottom: 8px;
					}
					.name {
						font-size: 15px;
					}
					.intr {
						position: absolute;
						bottom: 5px;
						@include textEllipsis;
						width: 90%;
						.text {
							width: 80%;
						}
					}
					.icon-cheveron-right {
						position: absolute;
						right: 0;
						bottom: 12px;
					}
				}
			}
		}
		.content {
			height: 57vh;
			background: #fff;
			.list {
				height: 49vh;
				overflow: hidden;
				.list-item {
					display: flex;
					width: 100%;
					height: 8vh;
					.item-index,.more {
						width: 8vh;
						height: 8vh;
						line-height: 8vh;
						text-align: center;
						font-size: 14px;
					}
					.more {
						border-bottom: 1px solid #DEDEDE;
					}
					.item {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						line-height: 16px;
						@include textEllipsis;
						border-bottom: 1px solid #DEDEDE;
						&.curr {
							color: #6CD1A4;
						}
						.song {
							font-size: 14px;
						}
						.singer {
							font-size: 12px;
							color: #BDBDBD;
						}
					}
				}
			}
		}
	}
</style>
