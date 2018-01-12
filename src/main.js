import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI);

//add by tao66 时间过滤器 2017/12/21
Vue.filter('formDate',function (time) {
    // console.log(time)
    var d = new Date(time);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
    var hour = d.getHours();
    var minutes = d.getMinutes()<10 ? '0' + d.getMinutes() : '' + d.getMinutes();
    var seconds = d.getSeconds();
    // console.log(d)
    return year+ '-' + month + '-' + day + ' ' + hour + ':' + minutes
});

//add by tao66 地区过滤器 2017/12/21
Vue.filter('newRegion',function (value) {
    if(value&&value.length>=2){
        var firstIndex = value.indexOf(" ");
        var newStr = value.substring(0,firstIndex);
        return newStr;
    }
    return value;
});

//add by tao66 空格过滤器 2017/12/21
Vue.filter('Space',function (value) {
    if(!value == ''){
        var result = value.replace(/\s|\xA0/g,"");
        return result;
    }
    return value;
});

axios.defaults.baseURL = _config.server;
// axios.defaults.baseURL = 'http://192.168.1.127:3000';
Vue.prototype.$http = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
