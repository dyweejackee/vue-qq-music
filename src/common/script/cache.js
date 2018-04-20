import storage from 'good-storage'
import _ from 'lodash'

const SEARCH_KEY = 	'__search__'
const SEARCH_MAXLEN = 6

const PLAY_KEY = '__play__'
const PLAY_MAXLEN = 20

function checkStorage(arr,val,max) {
	if(!val) return
	let index = arr.findIndex(v => {
		if(typeof v === 'object') {
			return _.isEqual(v,val)
		}
		return v === val
	})
	if(index < 0) {
		if(arr.length >= max) {
			arr.splice(max - 1)
		}
	} else {
		arr.splice(index, 1)
	}
	arr.unshift(val)
}

function checkPlayHistory(arr,val,max) {
	if(!val) return
	let index = arr.findIndex(v => {
		if(typeof v === 'object') {
			return _.isEqual(v,val)
		}
		return v === val
	})
	if(index < 0) {
		if(arr.length >= max) {
			arr.pop()
		}
		arr.unshift(val)
	}
}

export function saveSearchHistory(val) {
	let locSearch = storage.get(SEARCH_KEY,[])
	checkStorage(locSearch,val,SEARCH_MAXLEN)
	if(locSearch.length === 0) {
		return []
	}
	storage.set(SEARCH_KEY,locSearch)
	return locSearch
}

export function clearSearchHistory() {
	console.log('xxx')
	storage.remove(SEARCH_KEY)
}

export function removeSearchHistory(val) {
	let locSearch = storage.get(SEARCH_KEY,[])
	let index = locSearch.findIndex(v => {
		return v === val
	})
	if(index >= 0) {
		locSearch.splice(index,1)
		if(locSearch.length === 0) {
			storage.remove(SEARCH_KEY)
			return []
		}
		storage.set(SEARCH_KEY,locSearch)
		return locSearch
	}
}

export function savePlayHistory(val) {
	let locPlay = storage.get(PLAY_KEY,[])
	checkPlayHistory(locPlay,val,PLAY_MAXLEN)
	if(locPlay.length === 0) {
		return []
	}
	storage.set(PLAY_KEY,locPlay)
	return locPlay
}
