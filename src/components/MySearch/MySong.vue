<template>
  <div class="mysong">
		<div class="detail" v-if="searchRes">
			<div class="tips" v-show="searchRes.song">最佳匹配</div>
			<div class="detail-list">
				<div class="singer-block" v-if="searchRes.singer">
					<!-- eslint-disable-next-line -->
					<div class="singer" v-for="item,i in searchRes.singer.itemlist" :key="i">
						<div class="avatar">
							<img v-lazy="item.pic">
						</div>
						<div class="info">
							<p>歌手：{{item.singer}}</p>
							<p>{{item.name}}</p>
						</div>
						<span class="icon-cheveron-right"></span>
					</div>
				</div>
				<div class="song-block" v-if="searchRes.song">
					<!-- eslint-disable-next-line -->
					<div class="songlist info borderBottom" v-for="song,ind in searchRes.song.itemlist" :key="ind" @click="toplay(searchRes.song.itemlist,ind)">
						<p>{{song.name}}</p>
						<p>{{song.singer}} - {{song.name}}</p>
						<span class="icon-navigation-more" @click.stop="openBottomSheet(song)"></span>
					</div>
				</div>
			</div>
		</div>
	  <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet" v-if="current">
	    <mu-list @itemClick="closeBottomSheet">
	      <mu-sub-header>
	      	<p class="sheettop">{{current.name}} - {{current.singer}}</p>
	      </mu-sub-header>
	      <mu-list-item title="添加到播放列表" @click="addSong"/>
	      <mu-list-item title="下一首播放" @click="playNext"/>
	      <mu-list-item title="关闭"/>
	    </mu-list>
	  </mu-bottom-sheet>
  </div>
</template>

<script>
	import { ErrorImg } from 'common/script/mixin'

  export default {
  	mixins: [ErrorImg],
  	props: {
  		searchRes: {
  			type: Object,
  			default() {
  				return {}
  			}
  		}
  	},
  	data() {
  		return {
				bottomSheet: false,
				current: null
  		}
  	},
  	computed: {
  		
  	},
  	methods: {
  		// museui配置
	    closeBottomSheet () {
	      this.bottomSheet = false
	    },
	    openBottomSheet (val) {
	      this.bottomSheet = true
	      this.current = val
	    },
	    // 项目配置
	    _pack(tar) {
    		let song = {
	    		name: tar.name,
	    		mid: tar.mid,
	    		singer: tar.singer,
	    		albummid: tar.albummid
	    	}
	    	song.url = `https://dl.stream.qqmusic.qq.com/C100${song.mid}.m4a?fromtag=46`
	    	song.img = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`
	    	return song
	    },
	    toplay(list,ind) {   	
	    	let sendData = {
	    		list,
	    		ind
	    	}
	    	this.$store.commit('songTo',sendData)
	    },
	    addSong() {
	    	let song = this._pack(this.current)
	    	this.$store.dispatch('addToList',song)
	    },
	    playNext() {
	    	let song = this._pack(this.current)
	    	this.$store.dispatch('addPlayNext',song)
	    }
  	}
  }
</script>

<style lang="scss" scoped>
	@import '../../common/style/utils/utils';

	.detail {
		padding: 5px 15px;
		.tips {
			margin-bottom: 10px;
			font-size: 13px;
			color: #9D9D9D;
		}
		.detail-list {
			@include infoSegment;
			.singer {
				position: relative;
				.avatar {
					display: inline-block;
					margin-right: 10px;
					width: 5em;
					height: 5em;
					border-radius: 50%;
					overflow: hidden;
					img {
						width: 100%;
						height: 100%;
					}
				}
				.icon-cheveron-right {
					@include rightWard;
				}
			}
		}
	}
	.sheettop {
		width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
