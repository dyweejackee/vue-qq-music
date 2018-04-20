export default {
	hotkey: {
		url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
		params: () => {
    		return {
                g_tk: 5381,
                loginUin: 0,
                hostUin: 0,
                format: 'jsonp',
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 1,
                platform: 'yqq',
                needNewCode: 0
              }
		},
        jsonp: 'jsonpCallback'
	},
    search: {
        url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
        params: (key) => {
          return {
            is_xml: 0,
            format: 'jsonp',
            key: key,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0
          }
        },
        jsonp: 'jsonpCallback'
    },
    searchSong: {
        url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        params: (key) => {
          return {
            g_tk: 5381,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            format: 'jsonp',
            w: key,
            p: 1,
            catZhida: 1,
            n: 10,
            zhidaqu: 1,
            platform: 'h5',
            needNewCode: 1,
            t: 0,
            flag: 1,
            ie: 'utf-8',
            sem: 1,
            aggr: 0,
            uid: 0,
            remoteplace: 'txt.mqq.all'
          }
        },
        jsonp: 'jsonpCallback'
    },
    first_page_data: {
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg',
        params() {
          return {
            format: 'jsonp',
            tpl: 'v12',
            page: 'other',
            rnd: 0,
            g_tk: new Date().getTime(),
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf8',
            outCharset: 'GB2312',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0
          }
        },
        jsonp: 'jsonpCallback'
    },
    getRec: {
        url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
        params() {
          return {
            format: 'jsonp',
            tpl: 'v12',
            page: 'other',
            rnd: 0,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'h5',
            uin: 0,
            needNewCode: 1
          }
        },
        jsonp: 'jsonpCallback'
    },
    album: {
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
        params: (id) => {
          return {
            albummid: id,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'jsonp',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0
          }
        },
        jsonp: 'jsonpCallback'
    }
}
