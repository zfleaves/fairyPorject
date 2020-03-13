<template>
  <div class="loginForm">
    <div class="loginCon" v-show="!showModal">
      <h2 class="loginTitle">欢迎登录物资云平台</h2>
      <p><a :class="!change?'active':''" @click="PasswordLogon">密码登录</a><a :class="change?'active':''"
                                                                           @click="MessageLogon">短信登录</a></p>
      <el-form v-show="passOrMsg" status-icon ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item prop="name" :error="ruleFormPhoneMsg2">
          <el-input clearable placeholder="手机号" v-model="ruleForm.name">
            <img slot="prefix" src="static/images/phone.png" alt="">
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input clearable type="password"  placeholder="密码"
                    @keyup.enter.native="submitForm('ruleForm')"
                    v-model="ruleForm.pass" autocomplete="off">
            <img slot="prefix" src="static/images/pass.png" alt="">
          </el-input>
        </el-form-item>
        <el-form-item v-if="loginTimes ===2" prop="imgCode" :error="errorMsg">
          <el-col :span="13">
            <el-input clearable type="password" placeholder="验证码"
                      v-model="ruleForm.imgCode" autocomplete="off">
              <img slot="prefix" src="static/images/pass.png" alt="">
            </el-input>
          </el-col>
          <el-col :span="9" :offset="2">
            <img @click="_getImgCode" :src="imgCode" alt="">
          </el-col>
        </el-form-item>
        <el-form-item v-if="loginTimes ===4" prop="passCode" :error="ruleFormPassCodeMsg2">
          <el-col :span="13">
            <el-input clearable placeholder="短信验证码"
                      v-model="ruleForm.passCode" autocomplete="off">
              <img slot="prefix" src="static/images/pass.png" alt="">
            </el-input>
          </el-col>
          <el-col :span="9" :offset="2">
            <el-button v-if="getCodeShow2" type="primary"
                       @click="getPassCode2">获取验证码</el-button>
            <el-button v-else type="info">{{countdown2}}秒</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isDisable" :disabled="isDisable" type="primary"
                     @click="submitForm('ruleForm')">登录
          </el-button>
        </el-form-item>
      </el-form>
      <el-form v-show="!passOrMsg" status-icon ref="ruleForm2" :model="ruleForm2" :rules="rules2">
        <el-form-item prop="phoneNum" :error="ruleFormPhoneMsg">
          <el-input clearable placeholder="手机号" v-model="ruleForm2.phoneNum">
            <img slot="prefix" src="static/images/phone.png" alt="">
          </el-input>
        </el-form-item>
        <el-form-item prop="pass2">
          <el-col :span="15">
            <el-input clearable type="password" placeholder="短信验证码"
                      @keyup.enter.native="submitForm2('ruleForm2')"
                      :error="ruleFormPassCodeMsg"
                      v-model="ruleForm2.pass2" autocomplete="off">
              <img slot="prefix" src="static/images/pass.png" alt="">
            </el-input>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-button v-if="getCodeShow" type="primary" @click="getCode">获取验证码</el-button>
            <el-button v-else type="info">{{countdown}}秒</el-button>
          </el-col>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm2('ruleForm2')">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-button type="primary">登录</el-button> -->
      <h4><a href="javaScript:;">立即注册</a><a href="javaScript:;" @click="forgetPassword">忘记密码</a></h4>
    </div>
    <el-button :plain="successfulLogin">成功</el-button>

    <div class="modalForgetPassword" v-show="showModal">
      <h1>通过短信验证码找回<i class="el-icon-close" @click="hideModal"></i></h1>
      <el-steps :space="200" :active="1" finish-status="success">
        <el-step title="验证手机号"></el-step>
        <el-step title="设置密码"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div class="from3">
        <el-form status-icon ref="ruleForm3" :model="ruleForm3" :rules="rules3">
          <el-form-item label="手机号" label-width="100px" prop="phoneNum3">
            <el-input placeholder="用户名或电话号码" v-model="ruleForm3.phoneNum3">
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" label-width="100px" prop="pass3">
            <el-col :span="15">
              <el-input clearable type="password" placeholder="短信验证码"
                        @keyup.enter.native="submitForm3('ruleForm3')"
                        v-model="ruleForm3.pass3" autocomplete="off">

              </el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-button v-if="getCodeShow3" type="primary" @click="getCode3">获取验证码</el-button>
              <el-button v-else type="info">{{countdown3}}秒</el-button>
            </el-col>

          </el-form-item>
          <el-form-item>
            <el-col :span="15">
              <el-button type="primary" @click="submitForm3('ruleForm3')">登录</el-button>
            </el-col>

          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      :visible.sync="loginFirstShow"
      title="请设置密码"
      center
      :close-on-press-escape="false"
      :close-on-click-modal="false" top="35vh" width="30%">
      <setPassWord :userInfo="userInfo">
      </setPassWord>
    </el-dialog>

  </div>
</template>
<script>
  import {
    getLogin, getVerificationCode, getImgCode, getVerifyLogin,
    getSmsLogin, getIsLogin, getMessageLogin2, loginFirst
  } from 'api/login/login'
  import Auth from 'util/auth'
  import setPassWord from './setPassWord'

  export default {
    name: 'loginForm',
    components: {setPassWord},
    inject:['reload'],
    data() {
      return {
        loginFirstShow: false,
        userInfo: {},
        passOrMsg: true,
        getCodeShow: true,//是否显示验证码
        getCodeShow2: true,//是否显示验证码
        getCodeShow3: true,
        countdown: 60,
        countdown3: 60,
        countdown2: 60,
        isDisable: false,
        change: false,
        successfulLogin: false,
        showModal: false,//忘记密码弹窗
        imgCode: '',
        loginTimes: 0,
        ruleFormPassCodeMsg: '',
        ruleFormPassCodeMsg2: '',
        errorMsg: '',
        smsToken: '',
        smsToken2: '',
        ruleForm: {
          name: '',
          pass: '',
          imgCode: '',
          passCode: ''
        },
        ruleFormPhoneMsg: '',
        ruleFormPhoneMsg2: '',
        ruleForm2: {
          phoneNum: '',
          pass2: ''
        },
        ruleForm3: {
          phoneNum3: '',
          pass3: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {pattern: /^[1][3,5,6,7,8,9][0-9]{9}$/, message: '请输入合法手机号码', trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          imgCode: [
            {required: true, message: '请输图形验证码', trigger: 'blur'}
          ],
          passCode: [
            {required: true, message: '请输短信验证码', trigger: 'blur'}
          ]
        },
        rules2: {
          phoneNum: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
          ],
          pass2: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ]

        },
        rules3: {
          phoneNum3: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
          ]

        },
        verifyToken: ''
      }
    },
    created() {
      //   this._getImgCode();
      let name = Auth.hasLoginPhone() || ''
      if (name) {
        this.ruleForm.name = name;
        this.ruleForm2.phoneNum = name;
        this.isLogin(name); //判断连续点击登录的次数
      }

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isDisable = true;
            if (this.loginTimes < 2) {
              this.passLogin()
            } else if (this.loginTimes === 2) {
              this.VerifLogin()
            } else {
              this.messageLogin()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //密码登录
      passLogin() {
        this.errorMsg = '';
        let data = {
          loginName: this.ruleForm.name,
          password: this.ruleForm.pass,
        }
        getLogin(data).then(res => {
          this.isDisable = false;
          if (res.status === 1) {
            this.errorMsg = res.errorMessage;
            this.judgeLoginTime(res.results.code);
          } else {
            this.setLoginStatus(res.results)
          }
        })
      },


      VerifLogin() {//图形密码登录
        this.errorMsg = '';
        let data = {
          loginName: this.ruleForm.name,
          password: this.ruleForm.pass,
          verifyCode: this.ruleForm.imgCode,
          verifyToken: this.verifyToken
        }
        getVerifyLogin(data).then(res => {
          this.isDisable = false;
          if (res.status === 1) {
            this.errorMsg = res.errorMessage;
            this.judgeLoginTime(res.results.code);
          } else {
            this.setLoginStatus(res.results)
          }
        })
      },
      messageLogin() { //短信密码登录
        this.errorMsg = '';
        let data = {
          loginName: this.ruleForm.name,
          password: this.ruleForm.pass,
          smsCode: this.ruleForm.passCode,
          smsToken: this.smsToken2
        }
        getSmsLogin(data).then(res => {
          this.isDisable = false;
          if (res.status === 1) {
            this.errorMsg = res.errorMessage;
            this.judgeLoginTime(res.results.code);
          } else {
            this.setLoginStatus(res.results)
          }
        })
      },
      setLoginStatus(res) {
        Auth.setLoginPhone(this.ruleForm.name)
        Auth.setUserInfo(res)
        Auth.setToken(res.token)
        this.variable.setAccess_tokenToken(JSON.parse(JSON.stringify(res.token)));
        let params = this.$route.params;
        Auth.setLoginSimulatedToken(params.token);
        // console.log(this.client);
        this.$router.push('/home');
        this.reload();
        this.$message({
          message: '登录成功',
          type: 'success'
        })
       
      },
      judgeLoginTime(code) {
        if (code === 20001015) {
          this.loginTimes = 2;
          this._getImgCode();
        }
        if (code === 20001016) {
          this.loginTimes = 4;
        }
      },
      submitForm2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              loginName: this.ruleForm2.phoneNum,
              smsCode: this.ruleForm2.pass2,
              smsToken: this.smsToken
            }
            getMessageLogin2(data).then(res => {
              if (res.status === 1) {
                this.ruleFormPassCodeMsg = res.errorMessage;
              } else {
                loginFirst(this.ruleForm2.phoneNum).then(ret => {
                  if (ret.results === 0) {
                    this.userInfo = res.results;
                    this.loginFirstShow = true;
                  } else {
                    this.setLoginStatus(res);
                  }
                })

              }
            })
          } else {
            console.log('error submit2222!!');
            return false;
          }
        });
      },
      submitForm3(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit3333!');
          } else {
            console.log('error submit333333333!!');
            return false;
          }
        });
      },
      isLogin(name) {
        // this.ruleForm.name
        getIsLogin(name).then(res => {
          if (res.status === 1) {
            this.judgeLoginTime(res.results.code)
          }
        })
      },
      //短信登录
      MessageLogon() {
        this.passOrMsg = false;
        this.change = true;
      },
      //密码登录
      PasswordLogon() {
        this.passOrMsg = true;
        this.change = false;
      },
      //获取验证码
      getCode() {
        this.ruleFormPassCodeMsg = '';
        this.ruleFormPhoneMsg = '';
        // this.setTime2();
        let reg = /^[1][3,5,6,7,8,9][0-9]{9}$/;
        if (!reg.test(this.ruleForm2.phoneNum)) {
          this.ruleFormPhoneMsg = '请输入正确的手机号码';
          return
        }
        getVerificationCode(this.ruleForm2.phoneNum).then(res => {
          if (res.status === 0) {
            this.setTime();
            this.smsToken = res.results.smsToken;
          } else {
            this.ruleFormPassCodeMsg = res.errorMessage;
          }
          // this.setTime()
        })
      },
      setTime() {
        this.getCodeShow = false; // 显示读秒
        this.countdown = 60;//60秒过后button上的文字初始化,计时器初始化;
        let authTime = setInterval(() => {  // 箭头函数 不转换this 指向的
          this.countdown--;
          if (this.countdown <= 0) {
            this.getCodeShow = true;  // 关闭读秒 显示点击获取验证码
            clearInterval(authTime)  //清除定时器
          }
        }, 1000)
      },
      getPassCode2() {
        this.ruleFormPassCodeMsg2 = '';
        this.ruleFormPhoneMsg2 = '';
        // this.setTime2();
        let reg = /^[1][3,5,6,7,8,9][0-9]{9}$/;
        if (!reg.test(this.ruleForm.name)) {
          this.ruleFormPhoneMsg2 = '请输入正确的手机号码';
          return
        }
        getVerificationCode(this.ruleForm.name).then(res => {
          if (res.status === 0) {
            this.setTime2();
            this.smsToken2 = res.results.smsToken;
          } else {
            this.ruleFormPassCodeMsg2 = res.errorMessage;
          }

        })
      },
      setTime2() {
        this.getCodeShow2 = false; // 显示读秒
        this.countdown2 = 60;//60秒过后button上的文字初始化,计时器初始化;
        let authTime = setInterval(() => {  // 箭头函数 不转换this 指向的
          // console.log(this.countdown2);
          this.countdown2--;
          if (this.countdown2 <= 0) {
            this.getCodeShow2 = true;  // 关闭读秒 显示点击获取验证码
            clearInterval(authTime)  //清除定时器
          }
        }, 1000)
      },
      getCode3() {
        let data = {
          loginName: this.ruleForm3.phoneNum3
        }
      },
      //忘记密码弹框
      forgetPassword() {
        this.showModal = true;
      },
      //关闭弹窗
      hideModal() {
        this.showModal = false;
      },
      //获取图形验证码
      _getImgCode() {
        getImgCode().then(res => {
          this.verifyToken = res.results.verifyToken;
          this.imgCode = 'data:image/jpg;base64,' + res.results.images;
        })
      }
    },

  }
</script>
<style lang="scss" scoped>
  .loginForm {
    .loginCon {
      position: absolute;
      width: 350px;
      background: rgba(78, 166, 214, 0.6);
      top: 35%;
      right: 10%;
      padding: 20px 40px;
      z-index: 100;
      .loginTitle {
        padding: 10px 0;
        color: white;
        font-size: 22px;
        text-align: center;
        font-weight: 200;
      }
      p {
        margin-top: 10px;
        margin-bottom: 20px;
        a {
          width: 50%;
          display: inline-block;
          text-align: center;
          line-height: 20px;
          cursor: pointer;
          &:nth-child(1) {
            border-right: 1px #eee solid;
          }
          &.active {
            color: #333;
          }

        }
      }
      button {
        width: 100%;
        height: 40px;
        border-radius: 5px;
      }
      h4 {
        margin-top: 10px;
        font-size: 14px;
        a {
          &:nth-child(1) {
            float: left;
            color: #333;
          }
          &:nth-child(2) {
            float: right;
            color: #333;
          }
        }
      }
    }
    .modalForgetPassword {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 45%;
      height: 500px;
      background: #fff;
      z-index: 999;
      h1 {
        color: #333;
        font-weight: 400;
        font-size: 26px;
        text-align: center;
        line-height: 80px;
        i {
          position: absolute;
          right: 10px;
          top: 19px;
          color: #ccc;
        }
      }
      .el-steps {
        padding: 5% 0 0 25%;
      }
      .from3 {
        padding: 50px 200px;
        .el-form {
          .el-form-item__content {
            padding: 0 0 0 100px;
          }
        }

      }

    }
  }

</style>


