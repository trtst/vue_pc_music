<template>
    <div class='login'>
        <el-dialog :visible.sync="loginDialogVisible" width="20%" :before-close="handleClose" class="login-dialog">
            <div class="login-wrapper">
                <img src="../../assets/logo.jpg" alt="" class="login-logo">
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
                    <el-form-item prop="phone">
                        <el-input v-model="loginForm.phone" placeholder="请输入网易云帐号登录">
                            <i slot="prefix" class="iconfont icon-phone"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd">
                        <el-input v-model="loginForm.pwd" placeholder="请输入密码" show-password>
                            <i slot="prefix" class="iconfont icon-pwd"></i>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">登录</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    components: {},
    data () {
        // 这里存放数据
        return {
            loginForm: {
                phone: '',
                pwd: ''
            },
            loginFormRules: {
                phone: [{ required: true, message: '请输入网易帐号', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入网易密码', trigger: 'blur' }]
            }
        }
    },
    // 监听属性 类似于data概念
    computed: {
        ...mapGetters(['loginDialogVisible'])
    },
    // 方法集合
    methods: {
        ...mapMutations(['setLogin', 'setUserInfo', 'setLoginDialog']),
        handleClose () {
            this.setLoginDialog(false)
        },
        submitForm () {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (valid) {
                    const { data: res } = await this.$http.login(this.loginForm)

                    if (res.code !== 200) {
                        this.$msg.error(res.msg)
                    } else {
                        this.getUserInfo(res.profile.userId)
                        window.sessionStorage.setItem('token', res.token)
                        window.sessionStorage.setItem('cookie', res.cookie)
                        window.sessionStorage.setItem('isLogin', true)
                        this.setLoginDialog(false)
                    }
                }
            })
        },
        async getUserInfo (uid) {
            const { data: res } = await this.$http.getUserInfo({ uid: uid })

            if (res.code !== 200) {
                this.$msg.error(res.msg)
            } else {
                window.sessionStorage.setItem('userInfo', JSON.stringify(res.profile))
                this.setLogin(true)
                this.setUserInfo(res.profile)
            }
        }
    }
}
</script>
<style scoped lang="less">
.login-logo {
    margin-bottom: 50px;
}
.login-dialog {

    /deep/.el-dialog__body {
        padding: 30px 20px 0;
    }

    .dialog-footer {
        position: relative;
        z-index: 2;
        display: block;
        width: 100%;
        margin-bottom: 100px;

        .el-button {
            width: 100%;
        }
    }

    /deep/.el-dialog__footer {
        position: relative;

        &:after {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            content: "";
            width: 100%;
            height: 100%;
            opacity: .3;
            background: url(../../assets/login_bg2.jpg) center bottom no-repeat;
            background-size: contain;
        }
    }
}

</style>
