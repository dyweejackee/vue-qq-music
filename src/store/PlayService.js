const _ = require('lodash')
const REPEAT = 0 // 顺序播放
const REPEAT_ONE = 1 // 单曲循环
const SHUFFLE = 2 // 随机

export default {
	state: {
		playing: false,
		currentPlay: null,
		currentTime: 0,
		titleTime: 0,
		duration: 0,
		percent: 0,
		playQueue: [],
		// swiper初始列表
		operedQueue: [],
		// 切歌时间timeGap不能上下曲操作
		timeGap: false,
		// 点击上下曲，同步swiper
		clickNextPrev: false,
		loopMode: REPEAT,
		modeID: -1
	},
	getters: {
		currentInd(state) {
			return state.playQueue.findIndex(v => {
				return _.isEqual(v,state.currentPlay)
			})
		},
		operedInd(state) {
			return state.operedQueue.findIndex(v => {
				return _.isEqual(v,state.currentPlay)
			})
		},
		loopModeIndex(state) {
		}
	},
	mutations: {
		// 专辑页插入列表
		albumAdd(state,obj) {
    	let arr = []
    	obj.list.forEach((val) => {
    		let song = {
	    		name: val.songname,
	    		mid: val.songmid,
	    		singer: obj.singer,
	    		albummid: val.albummid
	    	}
	    	song.url = `https://dl.stream.qqmusic.qq.com/C100${song.mid}.m4a?fromtag=46`
	    	song.img = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`
	    	arr.push(song)
    	})
    	// 数组合并去重
    	let opered = _.unionWith(arr, state.playQueue, _.isEqual)
			state.playQueue = opered
			state.currentPlay = state.playQueue[obj.ind]
		},
		// 插入播放列表
		songTo(state,obj) {
    	let arr = []
    	obj.list.forEach((val) => {
    		let song = {
	    		name: val.name,
	    		mid: val.mid,
	    		singer: val.singer,
	    		albummid: val.albummid
	    	}
	    	song.url = `https://dl.stream.qqmusic.qq.com/C100${song.mid}.m4a?fromtag=46`
	    	song.img = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`
	    	arr.push(song)
    	})
    	// 数组合并去重
    	let opered = _.unionWith(arr, state.playQueue, _.isEqual)
			state.playQueue = opered
			state.currentPlay = state.playQueue[obj.ind]
		},
		deleteSong(state,obj) {
			state.playQueue.splice(obj.ind,1)
			let Cmid = state.currentPlay.mid
			if(state.playQueue.length === 0) {
				state.currentPlay = null
				return
			}
			if(obj.mid === Cmid && state.playQueue.length > 0) {
				state.currentPlay = state.playQueue[obj.ind] || state.playQueue[0]
			}
		}
	},
	actions: {
		// 歌曲面板操作上/下首歌，val: 1表下一首，0表上一首
		toNextPrev(context,val) {
			context.dispatch('_getRandom')
			let modeID = context.state.modeID
			let curr = context.state
			let currInd = curr.playQueue.findIndex(v => {
				return _.isEqual(v,curr.currentPlay)
			})
			let sign = val || -1
			let tar = val? 0: curr.playQueue.length - 1
			if(currInd >= 0) {
				curr.currentPlay = null
				curr.currentPlay = curr.playQueue[currInd + (sign * modeID)] || curr.playQueue[tar]
			}
			curr.clickNextPrev = !curr.clickNextPrev
		},
		// 针对swiper的切歌事件
		playAtIndex(context,ind) {
			let curr = context.state
			if(typeof ind !== 'number') {
				let i = ind.ind
				if(i >= curr.playQueue.length) return
				curr.currentPlay = curr.playQueue[i]
				curr.clickNextPrev = !curr.clickNextPrev
				return
			}
			if(ind >= curr.operedQueue.length) return
			curr.currentPlay = curr.operedQueue[ind]
		},
		// 对于随机播放更新random值
		_getRandom(context) {
			let ctt = context.state
			switch(ctt.loopMode) {
				case REPEAT:
					ctt.modeID = 1
					break
				case REPEAT_ONE:
					ctt.modeID = 0
					break
				case SHUFFLE:
					let ind = parseInt(Math.random() * (ctt.playQueue.length - 1)) + 1
					ctt.modeID = ind
					break
			}
		},
		addToList(context,song) {
			let queue = context.state.playQueue
			let currInd = queue.findIndex(v => {
				return _.isEqual(v,song)
			})
			if(currInd >= 0) {
				context.state.playQueue.splice(currInd,1)
				context.state.playQueue.push(song)
				return
			}
			let arr = []
			arr.push(song)
			context.state.playQueue = _.unionWith(queue,arr, _.isEqual)
			if(context.state.playQueue.length === 1) {
				context.state.currentPlay = context.state.playQueue[0]
			}
		},
		addPlayNext(context,song) {
			let queue = context.state.playQueue
			let currInd = queue.findIndex(v => {
				return _.isEqual(v,song)
			})
			if(currInd === 0) return
			if(currInd > 0) {
				context.state.playQueue.splice(currInd,1)
			}
			if(context.state.playQueue.length === 0) {
				context.state.playQueue.push(song)
				context.state.currentPlay = context.state.playQueue[0]
				return
			}
			context.state.playQueue.splice(1,0,song)
		}
	}
}
