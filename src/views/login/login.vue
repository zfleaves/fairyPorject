<template>
    <div class="login">
        <el-carousel  :interval="3000" arrow="always" trigger="click">
            <el-carousel-item v-for="(item,index) in bannerImg" :key="index">
                 <img v-bind:src="item.backgroundUrl">
                
            </el-carousel-item>
        </el-carousel>

        <div class="header">
            <div class="logo">
                <img src="" alt="">
            </div>
            <ul class="topUL">
                <li>中建君联首页</li>
                <li>中建君联微博</li>
                <li>关注公众号</li>
                <li>在线选购</li>
            </ul>
        </div>
        <LoginForm></LoginForm>
    </div>
</template>

<script>
import LoginForm from './component/loginForm'
export default {
    name:'login',
    components:{
        LoginForm
    },
    data(){
        return{
            bannerImg: [
                {
                    backgroundUrl: 'https://static.junnysoft.cn/loginbanner001.jpg',
                    topTitle: "工程物资云平台",
                    bottomTitle: '引领物资管理新模式'
                },
                {
                    backgroundUrl: 'https://static.junnysoft.cn/loginbanner002.jpg',
                    topTitle: "专 注 于 心",
                    bottomTitle: '专 业 于 行'
                },
                {backgroundUrl: 'https://static.junnysoft.cn/loginbanner003.jpg', topTitle: "工作高效协同", bottomTitle: '管理有效轻松'},
                {
                    backgroundUrl: 'https://static.junnysoft.cn/loginbanner004.jpg',
                    topTitle: "助力企业数字化管理",
                    bottomTitle: '打造行业互联网应用'
                }
            ]
        }
    },
    created(){
       
    },
    methods:{
        
    }
}
</script>
<style lang="scss" scoped>
    .login{
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        position: relative;
        color: #fff;
        .header{
            height: 60px;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding-right: 5%;
            border-bottom: 0.5px #ccc solid;
            z-index: 9999;
            .logo{

            }
            .topUL{
                float: right;
                li{
                    margin-left: 30px;
                    display: inline-block;
                    color: #fff;
                }
            }
        }
        .bannerImg{
            img{
                display: inline-block;
                width: 100%;
                height: 100%;
            }
        }
        .bannerBtn{
            position: absolute;
            left: 50%;
            bottom: 20px;
            transform: translateX(-50%);
            li{
                display: inline-block;
                width: 20px;
                height: 5px;
                border-radius: 5px;
                background: white;
                margin-right: 30px;
            }
        }
    }
</style>


