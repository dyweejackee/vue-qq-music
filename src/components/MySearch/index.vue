<template>
  <div class="Search" ref="search">
  	<div class="search-wrapper" ref="searchWrapper">
	  	<div class="icon" v-if="iconShow">
	  		<mu-icon class="iconFont" value="search" color="#6E6E6E"/>
	  	</div>
	  	<div class="icon" v-else @click="subSearch">
	  		<span class="icon-done"></span>
	  	</div>
	  	<div class="search-box">
	  		<mu-text-field :hintText="placeholder" v-model="labelText" fullWidth @focus="searchFocus"/>
	  	</div>
	  	<mu-flat-button v-show="!iconShow" label="取消" class="flat-button" labelClass="btnText" @click="cancel"/>
  	</div>
		<div class="search-result" v-show="!iconShow" ref="searchResult">
			<div class="initContent" v-show="!searchDone">
				<div class="hotSearch">
					<div class="title">热闹搜索</div>
					<div class="search-list">
						<!-- eslint-disable-next-line -->
						<div class="search-item" v-for="item,ind in hotkeyList" :key="ind" @click="hotkeyinput(item.k)">{{item.k}}</div>
					</div>
				</div>
				<div class="searchHistory" v-show="historyList.length>0">
					<div class="title">
						<span class="text">搜索历史</span>
						<span class="clear" @click="openDialog">清除历史</span>
					</div>
					<div class="history-list">
						<!-- eslint-disable-next-line -->
						<div class="history-item" v-for="item,ind in historyList" :key="ind">
							<span class="text" @click="hotkeyinput(item)">{{item}}</span>
							<span class="icon-close2" @click="removeHistory(item)"></span>
						</div>
					</div>
				  <mu-dialog :open="dialog">
				  	{{dialogText}}
				    <mu-flat-button slot="actions" @click="closeDialog" primary label="取消"/>
				    <mu-flat-button slot="actions" primary @click="clearHistory" label="确定"/>
				  </mu-dialog>
				</div>
			</div>
			<div class="searchResult" v-show="searchDone">
				<div class="loading" v-show="loading">
  				<mu-circular-progress :size="60" :strokeWidth="5"/>
				</div>
				<div class="content">
					<div class="content-nav">
					  <mu-tabs :value="activeTab" @change="handleTabChange">
					    <mu-tab value="tab1" title="单曲"/>
					    <mu-tab value="tab2" title="MV"/>
					    <mu-tab value="tab3" title="专辑"/>
					  </mu-tabs>
					</div>
					<swiper :options="swiperOption" ref="myswiper" class="swiper">
						<swiper-slide>
							<MySong :searchRes="searchRes"></MySong>
						</swiper-slide>
						<swiper-slide>
							<MyMv :searchRes="searchRes"></MyMv>
						</swiper-slide>
						<swiper-slide>
							<MyAlbum :searchRes="searchRes"></MyAlbum>
						</swiper-slide>
					</swiper>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
	import * as historyAPI from 'common/script/cache'
	import { swiper,swiperSlide } from 'vue-awesome-swiper'
	import MySong from './MySong'
	import MyMv from './MyMv'
	import MyAlbum from './MyAlbum'

	const ERR_OK = 0

  export default {
  	data() {
  		return {
  			// museui加载样式的配置
  			value: 0,
  			activeTab: 'tab1',
  			// swiper配置
  			swiperOption: {
  				observer: true,
  				lazyLoading: true
  			},
  			// 项目配置
  			labelText: '',
  			placeholder: '搜索音乐、MV、歌单、用户',
  			iconShow: true,
  			testlist: ['中百','在','未亡人','工枯要夺在'],
  			historyList: [],
  			hotkeyList: [],
  			dialog: false,
  			dialogText: '是否清空所有搜索历史',
  			searchDone: false,
  			loading: false,
  			searchRes: null
  		}
  	},
  	components: {
  		swiper,
  		swiperSlide,
  		MySong,
  		MyMv,
  		MyAlbum
  	},
  	created() {
  		this.$nextTick(() => {
  			this._defineTop()
  		})
  		this._getHotKey()
  		this.$nextTick(() => {
  			this._initSwiper()
  		})
  	},
  	computed: {
  		// swiper实例
  		swiper() {
  			return this.$refs.myswiper.swiper
  		},
  		searchKey() {
  			let str = this.labelText + ''
  			return str.trim()
  		},
  		slideIndex() {
  			return this.activeTab.slice(-1) - 1
  		}
  	},
  	watch: {
  		iconShow(val) {
  			if(val) {
	  			this.$emit('outSearching')
	  			this.$refs.search.style.height = ''
	  			this.$refs.searchWrapper.style.marginRight = ''
  			} else {
	  			this.$emit('searching')
	  			this.$refs.search.style.height = '91vh'
	  			this.$refs.searchWrapper.style.marginRight = '0'
	  			this.historyList = historyAPI.saveSearchHistory(this.searchKey)
  			}
  		},
  		slideIndex(val) {
  			this.swiper.slideTo(val)
  		}
  	},
  	methods: {
  		// swiper配置事件
  		_initSwiper() {
  			let _this = this
  			let currSwiper = this.swiper
				currSwiper.on('onSlideChangeEnd',() => {
					_this.activeTab = 'tab' + (currSwiper.activeIndex + 1)
				})
  		},
  		// museui事件
	    handleTabChange (val) {
	      this.activeTab = val
	    },
  		// 项目事件
  		_getHotKey() {
  			let _this = this
  			this.$store.dispatch('getHotKey').then(res => {
  				let resObj = res.body
  				if(resObj.code === ERR_OK) {
  					_this.hotkeyList = resObj.data.hotkey.splice(0,8)
  				}
  			}).catch(err => {
  				console.log(err)
  			})
  		},
  		_defineTop() {
	  		let h = this.$refs.searchWrapper.clientHeight
	  		this.$refs.searchResult.style.top = 2 * h + 'px'
  		},
  		searchFocus() {
  			this.iconShow = false
  		},
  		cancel() {
  			this.iconShow = true
  			this.labelText = ''
  			this.searchDone = false
  			this.value = 'tab1'
  			this.searchRes = null
  		},
  		subSearch() {
	  		this.historyList = historyAPI.saveSearchHistory(this.searchKey)
	  		this.searchDone = true
	  		this.loading = true
	  		if(!this.searchKey) return
	  		this.$store.dispatch('getSearch',this.searchKey).then(res => {
	  			let resObj = res.body
	  			if(resObj.code === ERR_OK) {
	  				this.searchRes = resObj.data
	  			}
	  			this.loading = false
	  		}).catch(err => {
	  			console.log('err',err)
	  		})
  		},
  		openDialog() {
  			this.dialog = true
  		},
  		closeDialog() {
  			this.dialog = false
  		},
  		clearHistory() {
  			historyAPI.clearSearchHistory()
  			this.closeDialog()
  			this.historyList = []
  		},
  		removeHistory(val) {
  			this.historyList = historyAPI.removeSearchHistory(val)
  		},
  		hotkeyinput(val) {
  			this.labelText = val
  			this.subSearch()
  		}
  	}
  }
</script>

<style lang="scss">
	.Search {
		overflow: hidden;
		.search-wrapper {
			position: relative;
			display: flex;
			margin: 0 20px;
			.icon {
				flex: 1;
				.iconFont {
					height: 100%;
					padding-top: 10px;
				}
			}
			.search-box {
				flex: 10;
				margin-left: 10px;
			}
			.flat-button {
				flex: 2;
				margin-top: .3em;
				color: #6E6E6E;
			}
			.icon-done {
				position: absolute;
				left: 0;
				top: 25%;
				font-size: 15px;
				color: #6E6E6E;
			}
		}
		.search-result {
			position: absolute;
			bottom: 0;
			width: 100%;
			background: #fff;
			color: #525252;
			.initContent {
				padding: 5%;
				.title {
					margin-bottom: 10px;
					font-size: 13px;
					color: #838384;
				}
				.hotSearch {
					margin-bottom: 15px;
					.search-list {
						display: flex;
						flex-wrap: wrap;
						.search-item {
							margin: 0 10px 10px 0;
							font-size: 15px;
							padding: 5px 15px;
							border: 1px solid #E5E5E5;
							border-radius: 20px;
						}
					}
				}
				.searchHistory {
					.title {
						.clear {
							float: right;
						}
					}
					.history-list {
						.history-item {
							margin: 15px 0;
							font-size: 15px;
							padding: 0 7px;
							&:after {
								content:'';
								display: block;
								clear: both;
							}
							.icon-close2 {
								float: right;
								margin-top: 4px;
								color: #A3A3A3;
							}
						}
					}
				}
			}
			.searchResult {
				position: relative;
				height: 100%;
				.loading {
					position: absolute;
					width: 100%;
					padding-top: 35vh;
					text-align: center;
					height: 100%;
					z-index: 100;
				}
				.content {
					height: 100%;
					.swiper {
						height: 76.5vh;
					}
				}
			}
		}
	}
</style>
