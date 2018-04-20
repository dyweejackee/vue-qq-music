<template>
  <div class="mymv">
		<div class="detail" v-if="searchRes">
			<div class="detail-list">
				<div class="song-block" v-if="searchRes.mv">
					<!-- eslint-disable-next-line -->
					<div class="songlist info borderBottom" v-for="mv,ind in searchRes.mv.itemlist" :key="ind">
						<p>{{mv.name}}</p>
						<p>{{mv.singer}} - {{mv.name}}</p>
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
		}
	}
</style>
