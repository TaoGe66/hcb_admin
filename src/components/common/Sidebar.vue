<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
            <!--<template>
                <el-menu-item index="">
                    <a href="https://www.baidu.com">
                        <i class="el-icon-menu"></i>百度
                    </a>
                </el-menu-item>
            </template>-->
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: '1',
                        title: 'Room game',
                        subs: [
                            {
                                index: 'gameList',
                                title: 'game列表'
                            },
                            {
                                index: 'punishment',
                                title: '惩罚目录'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '即开彩',
                        subs: [
                            {
                                index: 'thisLottery',
                                title: '彩种管理',
                            },
                            {
                                index: 'stock',
                                title: '商家库存'
                            },
                            {
                                index: 'merchantOrders',
                                title: '商家订单'
                            },
                            {
                                index: 'userOrder',
                                title: '用户订单'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '3',
                        title: '和彩商城',
                        subs: [
                            {
                                index: 'mall',
                                title: '商品管理',
                            },
                            {
                                index: 'mallOrder',
                                title: '订单管理'
                            },
                        ]
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
