<template>
    <div class="header">
        <div class="logo">
			<img src="../../../static/img/logo.png" alt="" style="height: 50px;margin: 10px 10px 0 10px">
			<span class="title">和彩宝后台管理系统</span>
		</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                    {{username}}
                    <span style="margin-left: 10px">版本号:2.0.0</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
/*
   *
   * <p>
   * ┽
   * ┽                            _ooOoo_
   * ┽                           o8888888o
   * ┽                           88" . "88
   * ┽                           (| -_- |)
   * ┽                           O\  =  /O
   * ┽                        ____/`---'\____
   * ┽                      .'  \\|     |//  `.
   * ┽                     /  \\|||  :  |||//  \
   * ┽                    /  _||||| -:- |||||-  \
   * ┽                    |   | \\\  -  /// |   |
   * ┽                    | \_|  ''\---/''  |   |
   * ┽                    \  .-\__  `-`  ___/-. /
   * ┽                  ___`. .'  /--.--\  `. . __
   * ┽               ."" '<  `.___\_<|>_/___.'  >'"".
   * ┽              | | :  `- \`.;`\ _ /`;.`/ - ` : | |
   * ┽              \  \ `-.   \_ __\ /__ _/   .-` /  /
   * ┽         ======`-.____`-.___\_____/___.-`____.-'======
   * ┽                            `=---='
   * ┽         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   * ┽                      佛祖保佑       永无BUG
   * ┽
   * ┽
   * ┽
   *
   */
    export default {
        data() {
            return {
                name: 'linxin'
            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username');
                    this.$router.push('/login');
                }
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:400px;
        height: 70px;
        text-align: center;
    }
    .header .title{
        display: inline-block;
        vertical-align: top;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
