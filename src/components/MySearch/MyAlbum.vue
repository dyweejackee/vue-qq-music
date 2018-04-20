<template>
  <div class="mymv">
		<div class="detail" v-if="searchRes">
			<div class="detail-list">
				<div class="album-block" v-if="searchRes.album">
					<!-- eslint-disable-next-line -->
					<div class="album" v-for="item,i in searchRes.album.itemlist" :key="i">
						<div class="avatar">
							<img :src="item.pic" :onerror="errorimg">
						</div>
						<div class="info">
							<p>{{item.name}}</p>
							<p>{{item.singer}}</p>
						</div>
						<span class="icon-cheveron-right"></span>
					</div>
				</div>
			</div>
		</div>
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
  			test: 'here'
  		}
  	},
  	computed: {
  		
  	},
  	methods: {
  	}
  }
</script>

<style lang="scss" scoped>
	@import '../../common/style/utils/utils';

	.detail {
		padding: 5px 15px;
		.detail-list {
			@include infoSegment;
			.album {
				padding-top: 5px;
				position: relative;
				border-bottom: 1px solid #ddd;
				.avatar {
					display: inline-block;
					margin-right: 10px;
					width: 5em;
					height: 5em;
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
</style>
