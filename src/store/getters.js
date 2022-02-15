export default {
    isLogin (state) {
        return state.isLogin || JSON.parse(window.sessionStorage.getItem('isLogin'))
    },
    userInfo (state) {
        return state.userInfo || JSON.parse(window.sessionStorage.getItem('userInfo'))
    },
    loginDialogVisible (state) {
        return state.loginDialogVisible
    },
    playList (state) {
        return state.playList.length ? state.playList : JSON.parse(window.localStorage.getItem('playList')) || []
    },
    playIndex (state) {
        return state.playIndex || JSON.parse(window.localStorage.getItem('playIndex')) || '0'
    },
    curSongInfo (state) {
        return state.playList[state.playIndex]
    },
    isPlayed (state) {
        return state.isPlayed
    },
    playListTips (state) {
        return state.playListTips
    }
}
