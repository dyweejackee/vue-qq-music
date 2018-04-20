VueJs音乐播放器
=======

技术栈
-------
Vue2<br>
Vuex<br>
vue-router<br>
vue-resource<br>
vue-lazyload<br>
vue-awesome-swiper<br>
better-scroll<br>
good-storage<br>
lodash<br>
muse-ui<br>
sass(scss)<br>
es6<br>

Build Setup
=======
### 下载或克隆下来，然后安装依赖<br>
npm install<br>
### 开发预览<br>
npm run dev<br>
### 打包发布,生成的文件在dist文件夹中<br>
npm run build<br>
 
功能实现
=======
### 点击&滑动实现：播放、暂停、上一曲、下一曲、拖动播放进度<br>
2 播放列表、添加到播放列表、做为下一首播放<br>
3 播放、查询历史记录时间先后本地存储<br>
4 搜索功能、热门搜索、历史搜索<br>
5 点击轮播页面跳转<br>
6 切换播放模式<br>
7 播放列表更新，首页提示<br>
 
项目总结
=======
1.还有收藏功能、排行榜页面、歌手页面、歌词功能还未完成<br>
2.museui在样式方面做的还是有所欠缺，有些欠缺的地方只能靠逻辑代码完成<br>
3.swiper新版本有些功能还存些许问题，此项目用的2.6.7版本<br>
4.项目中迷你播放器左右滑动，写的功能逻辑还需改善，目前当歌曲添加过多时，会有卡顿感，是由于逻辑中通过遍历加入了太多swiper滑块，这块功能在后面的版本将会重写<br>
5.后面版本将改用velocity或者create-keyframe-animation重写动画部份<br>
 
项目预览
-------
![图片加载失败](https://github.com/dyweejackee/vue-qq-music/raw/master/Screenshots/face.png)

![图片加载失败](https://github.com/dyweejackee/vue-qq-music/raw/master/Screenshots/GIF.gif)

![图片加载失败](https://github.com/dyweejackee/vue-qq-music/raw/master/Screenshots/GIF2.gif)

![图片加载失败](https://github.com/dyweejackee/vue-qq-music/raw/master/Screenshots/GIF3.gif)

![图片加载失败](https://github.com/dyweejackee/vue-qq-music/raw/master/Screenshots/GIF4.gif)

![图片加载失败](https://github.com/dyweejackee/vue-qq-music/raw/master/Screenshots/GIF5.gif)
