<template>
    <el-form
        :model="loginPass"
        :rules="rules"
        status-icon
        ref="loginPass">
        <el-form-item label="登录密码：" prop="newPass" label-width="100px">
        <el-input type="password" v-model="loginPass.newPass" max="18"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass" label-width="100px" :error="loginPass.errorMsg">
        <el-input type="password" v-model="loginPass.checkPass" max="18"></el-input>
        </el-form-item>
        <div style="text-align: center;width:100%;height:40px;">
            <el-button type="primary" @click.native.prevent="submitLoginPass('loginPass')" :loading="logining">登录
            </el-button>    
        </div>
    </el-form>
</template>

<script>
    import {setPassWord} from 'api/login/login'
    import Auth from  'util/auth'

    export default {
       props:{
           dialogFormPass:{
               type:Boolean,
               default:false
           },
           userInfo:{
               type:Object,
               default:()=>{

               }
           }
       },
       data(){
           var validatePass = (rule,value,callback) =>{
               if(value === ''){
                   callback(new Error('请再次输入密码'));
               }else if(value !== this.loginPass.newPass){
                    callback(new Error('两次密码输入不一致'));
               }else{
                   callback();
               }
           }
           return {
               loginPass:{
                newPass:'',
                checkPass:'',
                errorMsg:''
               },
               logining:false,
               rules:{
                   newPass:[
                       {required:true,message:'请输入密码',trigger: 'blur'},
                       {min:6,max:16,message:'密码长度为6~16为字符',trigger: 'blur'}
                   ],
                   checkPass:[
                       {required:true,message:'请再次输入密码',trigger: 'blur'},
                       {required:validatePass,trigger: 'blur'},
                   ]
               }
           }
       },
       methods:{
        submitLoginPass(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const data = {
                        "loginName":this.userInfo.userCode,
                        "password": this.loginPass.newPass
                    }
                    seetPassWord(data).then(res=>{
                        this.loading = false;
                        if( res.status === 1){
                            this.loginPass.errorMsg = res.errorMsg;
                        }else {
                            Auth.setLoginPhone(this.loginPass.newPass)
                            Auth.setUserInfo(this.userInfo)
                            Auth.setToken(this.userInfo.token)
                            this.$router.push('/home');
                            this.$message({
                                message:'登录成功',
                                type:'success'
                            })
                        }
                    })
                } else {
                    console.log('error submit333333333!!');
                    return false;
                }
            });
        }
       }
    }
</script>
