import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import OrderList from './views/order/OrderList.vue'

import CustomerList from './views/customer/CustomerList.vue'
import Users from './views/user/Users.vue'
import echarts from './views/charts/echarts.vue'

let routes = [{
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/register',
        component: Register,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '订单信息',
        iconCls: 'el-icon-message', //图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/orderList', component: OrderList, name: '订单列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户信息',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/customerList', component: CustomerList, name: '客户列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户信息',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/users', component: Users, name: '用户列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '图表',
        iconCls: 'fa fa-bar-chart',
        leaf: true, //只有一个节点
        hidden: true,
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;