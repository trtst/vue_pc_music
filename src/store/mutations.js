import * as types from './mutation-types'

const mutations = {
    setLogin (state, val = false) {
        state.isLogin = val
    },
    setUserInfo (state, val = null) {
        state.userInfo = val
    },
    setLoginDialog (state, val = null) {
        state.loginDialogVisible = val
    },
    [types.SET_PLAYSTATUS] (state, val = false) {
        state.isPlayed = val
    },
    [types.SET_PLAYLIST] (state, val = null) {
        state.playList = val
        window.localStorage.setItem('playList', JSON.stringify(val))
    },
    [types.SET_PLAYINDEX] (state, val = 0) {
        state.playIndex = val
        window.localStorage.setItem('playIndex', val)
    },
    setPlayListTips (state, val = null) {
        state.playListTips = val
    }
}
export default mutations
