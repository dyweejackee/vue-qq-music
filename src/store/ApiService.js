import Vue from 'vue'
import API from '../config/api.js'
// import axios from 'axios'
// import qs from 'qs'

// axios
// function apiFactory(api) {
// 	return (key = null) => {
// 		let sendData = {
// 			url: '/api' + api.url,
// 			methods: 'POST',
// 			data: api.params(key)
// 		}
// 		console.log(sendData)
// 		return Vue.prototype.$axios(sendData)
// 	}
// }

function apiFactory(api) {
	return (key = null) => Vue.http.jsonp(api.url,{
		params: api.params(key),
		jsonp: api.jsonp
	})
}

export default {
	actions: {
		getHotKey() {
			return apiFactory(API.hotkey)()
		},
		getSearch(context,key) {
			return apiFactory(API.search)(key)
		},
		getRecommend() {
			return apiFactory(API.first_page_data)()
		},
		getAlbum(context,id) {
			return apiFactory(API.album)(id)
		}
	}
}
