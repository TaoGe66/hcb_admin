import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            redirect: '/gameList',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/gameList',
                    component: resolve => require(['../components/page/gameList.vue'], resolve)
                },
                {
                    path: '/punishment',
                    component: resolve => require(['../components/page/punishment.vue'], resolve)
                },
                {
                    path: '/thisLottery',
                    component: resolve => require(['../components/page/thisLottery.vue'], resolve)
                },
                {
                    path: '/stock',
                    component: resolve => require(['../components/page/stock.vue'], resolve)
                },
                {
                    path: '/merchantOrders',
                    component: resolve => require(['../components/page/merchantOrders.vue'], resolve)
                },
                {
                    path: '/userOrder',
                    component: resolve => require(['../components/page/userOrder.vue'], resolve)
                },
                {
                    path: '/mall',
                    component: resolve => require(['../components/page/mall.vue'], resolve)
                },
                {
                    path: '/mallAdd',
                    component: resolve => require(['../components/page/mall/add.vue'], resolve)
                },
                {
                    path: '/mallOrder',
                    component: resolve => require(['../components/page/mall/mallOrder.vue'], resolve)
                },
                {
                    path: '/mallShip',
                    component: resolve => require(['../components/page/mall/ship.vue'], resolve)
                },
                {
                    path: '/mallEdit:_id',
                    component: resolve => require(['../components/page/mall/edit.vue'], resolve)
                },
                {
                    path: '/gameProblem:type',
                    component: resolve => require(['../components/page/gameProblem.vue'], resolve)
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
