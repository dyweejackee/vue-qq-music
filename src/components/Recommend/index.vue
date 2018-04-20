<template>
	<div class="Recommend">
		<div class="copyRight">
			- 本项目由@dyweejackee提供 - <br>
			- https://github.com/dyweejackee -
		</div>
		<div class="roll" ref="rollWrapper">
			<div class="rollContent">
				<swiper :options="swiperOption" ref="swiperWrapper">
					<!-- eslint-disable-next-line -->
					<swiperSlide v-for="item,ind in rollList" :key="ind">
						<img class="itemImg" v-lazy="item.pic" @click="jumpto(item)">
					</swiperSlide>
				</swiper>
			</div>
			<div class="pagination">
				<!-- eslint-disable-next-line -->
				<div class="dot" :class="{'curr':ind === currInd}" v-for="item,ind in rollList" :key="ind"></div>
			</div>
		</div>
		<div class="recommend-wrapper" ref="rootWrapper">
			<div>
				<div class="content">
					<div class="content-wrapper">
						<div class="btns">
							<Buttons class="btnsCom" ref="btnsWrapper"></Buttons>
						</div>
						<div class="content-detail">
							<div class="hotdiss" v-if="hotdissList.length > 0">
								<div class="title">
									<div class="text">
										热门歌单
									</div>
									<div class="icon-cheveron-right"></div>
								</div>
								<div class="hotdiss-content">
									<!-- eslint-disable-next-line -->
									<div class="hotdiss-item" v-for="item,ind in operedHotdiss" :key="ind" v-if="item">
										<div class="cover">
											<img v-lazy="item.imgurl">
											<div class="pack">
												<span class="mini-icon icon-play2"></span>
											</div>
										</div>
										<div class="name">
											{{item.dissname}}
										</div>
									</div>
								</div>
								<div class="changeGroup" @click="getHotdiss">
									<div class="icon-ccw"></div>
									<div class="text">换一批</div>
								</div>
							</div>
							<div class="shoubomv" v-if="operedmvList.length > 0">
								<div class="title">
									<div class="text">
										MV首播
									</div>
									<div class="icon-cheveron-right"></div>
								</div>
								<div class="shoubomv-content">
									<!-- eslint-disable-next-line -->
									<div class="shoubomv-item" v-for="item,ind in operedmvList" :key="ind" v-if="item">
										<div class="cover">
											<img v-lazy="item.picurl">
											<div class="pack">
												<span class="mini-icon icon-music-notes"></span>
												<span class="num">{{item.listennum | numOper}}</span>
											</div>
										</div>
										<div class="name">
											<span class="name">{{item.mvtitle}}</span>
											<span class="name singer">{{item.singer_name}}</span>
										</div>
									</div>
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
	import BScroll from 'better-scroll'
	import { swiper,swiperSlide } from 'vue-awesome-swiper'
	import Buttons from './Buttons'

	import { ErrorImg } from 'common/script/mixin'
	import { types } from '../../config/type'

	const ERR_OK = 0

	export default {
		mixins: [ErrorImg],
		data() {
			return {
				// swiper配置
				swiper: null,
				swiperOption: {
					autoplay: 3000,
					autoplayDisableOnInteraction: false,
  				touchRatio: 0.2,
  				updateOnImagesReady: true
					// loop: true,
					// loopedSlides: 10
				},
				// 项目配置
				rollList: [],
				currInd: 0,
				hotdissList: [],
				operedHotdiss: [],
				mvList: [],
				randomNum: -1
			}
		},
		created() {
			this.$nextTick(() => {
				this._initScroll()
			})
			this._initData()
			this._initSwiper()
		},
		components: {
			swiper,
			swiperSlide,
			Buttons
		},
		filters: {
			numOper(v) {
				if(v >= 10000) {
					return parseInt(v * 10 / 10000) / 10 + '万'
				}
				return v
			}
		},
		computed: {
			operedmvList() {
				let arr = []
				let len = this.mvList.length >= 6? 6: this.mvList.length
				for(let i = 0; i < len; i++) {
					arr.push(this.mvList[i])
				}
				return arr
			}
		},
		watch: {

		},
		methods: {
			getHotdiss() {
				let arr = []
				let len = this.hotdissList.length >= 9? 9: this.hotdissList.length
				let len2 = len
				let re = []
				for(let i = 0; i < len2; i++) {
					let ran = Math.floor(Math.random() * this.hotdissList.length)
					let find = re.findIndex(v => {
						return v === ran
					})
					if(find >= 0) {
						len2++
						continue
					}
					re.push(ran)
					if(arr.length === len) {
						break
					}
					arr.push(this.hotdissList[ran])
				}
				this.operedHotdiss = arr
			},
			_initSwiper() {
				this.$nextTick(() => {
					if(!this.swiper) {
						this.swiper = this.$refs.swiperWrapper.swiper
						// this.swiper.slideTo(1)
						this.swiper.on('onTransitionEnd', (swiper) => {
							this.currInd = swiper.realIndex
						})
					}
				})
			},
			_initScroll() {
				this.scroll = new BScroll(this.$refs.rootWrapper,{
					probeType: 3,
					click: true
				})
				let h = this.$refs.rollWrapper.clientHeight
				this.scroll.on('scroll',pos => {
					let p = -pos.y
					if(p <= h) {
						let per = p / h
						this.$refs.rollWrapper.children[0].style.opacity = 1 -per
						this.$refs.rollWrapper.style.background = `rgba(0,0,0,${per * 5})`
					}
					if(pos.y >= 0) {
						this.$refs.rollWrapper.style.transform = `translateY(${pos.y}px)`
						this.$refs.btnsWrapper.$el.style.transform = 'translate3d(0,-5px,0)'
						this.$refs.btnsWrapper.$el.style.boxShadow = '0 0 7px #dcdcdc'
					} else {
						this.$refs.rollWrapper.style.transform = 'translateY(0)'
						let l = parseInt(-pos.y)
						if(l > 5) {
							l = 5
							this.$refs.btnsWrapper.$el.style.transform = 'translate3d(0,0,0)'
							this.$refs.btnsWrapper.$el.style.boxShadow = 'none'
							return 
						}
						this.$refs.btnsWrapper.$el.style.transform = `translate3d(0,${l - 5}px,0)`
						this.$refs.btnsWrapper.$el.style.boxShadow = '0 0 7px #dcdcdc'
					}
				})
			},
			_initData() {
				this.$store.dispatch('getRecommend').then(res => {
					let resObj = res.body
					if(resObj.code === ERR_OK) {
						this.rollList = resObj.data.focus
						this.hotdissList = resObj.data.hotdiss.list
						this.getHotdiss()
						this.mvList = resObj.data.shoubomv.all
					}
				}).catch(err => {
					console.log(err)
				})
			},
			jumpto(item) {
				switch(item.type) {
					case types.ALBUM:
						this.$router.push({
							name: 'album',
							params: {
								id: item.id
							}
						})
						break
					case types.JUMPURL:
						this.$store.state.AssetsService.pageShowControl = !this.$store.state.AssetsService.pageShowControl
						this.$router.push({
							name: 'page',
							params: {
								url: item.jumpurl
							}
						})
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin toflex {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	@mixin posSize($right,$size) {
		.cover {
			position: relative;
			width: 100%;
			img {
				width: 100%;
			}
			.pack {
				position: absolute;
				top: 0;
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,.2);
				.mini-icon,.num {
					position: absolute;
					bottom: 7px;
					color: rgba(255,255,255,.7);
				}
				.mini-icon {
					@if($right >= 0) {
						right: 0;
					} @else {
						left: -$right;
					}
					font-size: $size;
				}
				.num {
					left: -$right + 20px;
					font-size: 12px;
				}
			}
		}
	}

	.Recommend {
		position: relative;
		// width: 100vw;
		height: 73vh;
		padding-top: 22vh;
		overflow: hidden;
		.copyRight {
			position: absolute;
			top: 0;
			width: 100%;
			z-index: -2;
			padding: 10px;
			text-align: center;
			line-height: 20px;
			font-size: 13px;
			color: #DFDFDF;
		}
		.roll {
			width: 100%;
			height: 22vh;
			position: absolute;
			top: 0;
			background: #fff;
			overflow: hidden;
			.rollContent {
				width: 100%;
				height: 22vh;
				.itemImg {
					width: 100%;
				}
			}
			.pagination {
				position: absolute;
				bottom: 5%;
				left: 50%;
				margin-left: -15vw;
				width: 30vw;
				z-index: 10;
				display: flex;
				justify-content: space-between;
				.dot {
					width: 7px;
					height: 7px;
					border-radius: 50%;
					background: rgba(255,255,255,.5);
					&.curr {
						background: rgba(255,255,255,.9);
					}
				}
			}
		}
		.recommend-wrapper {
			position: relative;
			z-index: 10;
			width: 100%;
			height: 100%;
			.content {
				background: #fff;
				// border: 1px solid red;
				.content-wrapper {
					width: 100%;
					.btns {
						.btnsCom {
							box-shadow: 0 0 10px #ddd;
							transform: translate3d(0,-5px,0);
						}
					}
					.content-detail {
						// border: 1px solid red;
						padding: 10px 0;
						.hotdiss,.shoubomv {
							.title {
								position: relative;
								line-height: 7vh;
								text-align: center;
								font-size: 16px;
								.icon-cheveron-right {
									position: absolute;
									right: 2vw;
									top: 50%;
									margin-top: -8px;
									color: #939394;
								}
							}
							.hotdiss-content {
								// border: 1px solid blue;
								@include toflex;
								.hotdiss-item {
									width: 32vw;
									@include posSize(7px,20px);
									.name {
										padding: 3px;
										font-size: 12px;
										line-height: 18px;
										color: #686868;
									}
								}
							}
							.changeGroup {
								margin: 10px auto;
								display: flex;
								justify-content: center;
								width: 30%;
								border: 1px solid #DFDFDF;
								padding: 5px 20px;
								color: #979798;
								.text {
									flex: 1;
									text-align: center;
									font-size: 13px;
									line-height: 16px;
								}
							}
							.shoubomv-content {
								@include toflex;
								.shoubomv-item {
									width: 49vw;
									@include posSize(-7px,12px);
									.name {
										display: flex;
										flex-direction: column;
										justify-content: center;
										padding: 3px;
										font-size: 12px;
										line-height: 16px;
										color: #686868;
										&.singer {
											color: #979798;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>
