import Vue from 'vue'
import Router from 'vue-router'

import Album from 'components/Album'
import NewPage from 'components/NewPage'

Vue.use(Router)

let routes = [{
	path: '/album/:id',
	name: 'album',
	component: Album
}, {
	path: '/page/:url',
	name: 'page',
	component: NewPage
}]

export default new Router({
  routes
})
