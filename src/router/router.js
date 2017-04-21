import App from '../App';

const home = r => require.ensure([], () => r(require('../view/home/home')), 'home');
const city = r => require.ensure([], () => r(require('../view/city/city')), 'home');
const msite = r => require.ensure([], () => r(require('../view/msite/msite')), 'msite');
const search = r => require.ensure([], () => r(require('../view/search/search')), 'search');
const login = r => require.ensure([], () => r(require('../view/login/login')), 'login');
const profile = r => require.ensure([], () => r(require('../view/profile/profile')), 'profile');
const forget = r => require.ensure([], () => r(require('../view/forget/forget')), 'forget');
const info = r => require.ensure([], () => r(require('../view/profile/children/info')), 'info');
const setusername = r => require.ensure([], () => r(require('../view/profile/children/setusername')), 'setusername');
const add = r => require.ensure([], () => r(require('../view/profile/children/children/children/add')), 'add');
const address = r => require.ensure([], () => r(require('../view/profile/children/children/address')), 'address');
const addDetail = r => require.ensure([], () => r(require('../view/profile/children/children/children/children/addDetail')), 'addDetail');
const service = r => require.ensure([], () => r(require('../view/service/service')), 'service');
const questionDetail = r => require.ensure([], () => r(require('../view/service/children/questionDetail')), 'questionDetail');
const shop = r => require.ensure([], () => r(require('../view/shop/shop')), 'shop');
const shopDetail = r => require.ensure([], () => r(require('../view/shop/children/shopDetail')), 'shopDetail');
const foodDetail = r => require.ensure([], () => r(require('../view/shop/children/foodDetail')), 'foodDetail');
const shopSafe = r => require.ensure([], () => r(require('../view/shop/children/children/shopSafe')), 'shopSafe');
const order = r => require.ensure([], () => r(require('../view/order/order')), 'order');
const orderDetail = r => require.ensure([], () => r(require('../view/order/children/orderDetail')), 'orderDetail');

export default [{
  path: '/',
  component: App, // 顶层路由，对应index.html
  children: [ // 二级路由。对应App.vue
    // 地址为空时跳转home页面
    {
      path: '',
      redirect: '/home'
    },
    // 首页城市列表页
    {
      path: '/home',
      component: home
    },
    // 当前选择城市页
    {
      path: '/city/:cityid',
      component: city
    },
    // 所有商铺列表
    {
      path: '/msite',
      component: msite
    },
    // 搜索页
    {
      path: '/search/:geohash',
      component: search
    },
    // 商铺详情页
    {
      path: '/shop',
      component: shop,
      children: [
        {
          path: 'foodDetail', // 食品详情页
          component: foodDetail
        },
        {
          path: 'shopDetail', // 商铺详情页
          component: shopDetail,
          children: [
            {
              path: 'shopSafe', // 商铺安全认证页
              component: shopSafe
            }
          ]
        }
      ]
    },
    // 登陆注册页
    {
      path: '/login',
      component: login
    },
    // 个人信息页
    {
      path: '/profile',
      component: profile,
      children: [{
          path: 'info',
          component: info,
          children: [{
            path: 'address',
            component: address,
            children: [{
              path: 'add',
              component: add, // 编辑地址
              children: [{
                path: 'addDetail',
                component: addDetail
              }]
            }]
          }]
        },
        {
          path: 'setusername',
          component: setusername
        }]
    },
    // 修改密码页
    {
      path: '/forget',
      component: forget
    },
    // 订单列表页
    {
      path: '/order',
      component: order,
      children: [{
        path: 'orderDetail',
        component: orderDetail
      }]
    },
    // 服务中心
    {
      path: '/service',
      component: service,
      children: [{
        path: 'questionDetail',
        component: questionDetail
      }]
    }
  ]
}];
