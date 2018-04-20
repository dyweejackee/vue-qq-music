<template>
	<div class="newpage">
		<div class="icon-cheveron-left" @click="$router.go(-1)"></div>
		<iframe :src="$route.params.url" class="iframeBox"></iframe>
	</div>
</template>

<script>
	
</script>

<style lang="scss" scoped>
	.newpage {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		z-index: 100;
		.icon-cheveron-left {
			position: absolute;
			top: 10px;
			left: 10px;
			background: rgba(0,0,0,.3);
			padding: 10px;
			color: #fff;
		}
		.iframeBox {
			border: 1px solid red;
			width: 100%;
			height: 100%;
		}
	}
</style>
