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
        },
        {
          path: '/service', // 服务中心
          component: service
        }]
    },
    // 修改密码页
    {
      path: '/forget',
      component: forget
    }
  ]
}];
