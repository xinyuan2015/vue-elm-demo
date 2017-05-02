import App from '../App';

const home = r => require.ensure([], () => r(require('../view/home/home')), 'home');

const city = r => require.ensure([], () => r(require('../view/city/city')), 'home');
const msite = r => require.ensure([], () => r(require('../view/msite/msite')), 'msite');

const search = r => require.ensure([], () => r(require('../view/search/search')), 'search');

const login = r => require.ensure([], () => r(require('../view/login/login')), 'login');
const forget = r => require.ensure([], () => r(require('../view/forget/forget')), 'forget');

const profile = r => require.ensure([], () => r(require('../view/profile/profile')), 'profile');
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
const food = r => require.ensure([], () => r(require('../view/food/food')), 'food');

const confirmOrder = r => require.ensure([], () => r(require('../view/confirmOrder/confirmOrder')), 'confirmOrder');
const remark = r => require.ensure([], () => r(require('../view/confirmOrder/children/remark')), 'remark');
const payment = r => require.ensure([], () => r(require('../view/confirmOrder/children/payment')), 'payment');
const userValidation = r => require.ensure([], () => r(require('../view/confirmOrder/children/userValidation')), 'userValidation');
const invoice = r => require.ensure([], () => r(require('../view/confirmOrder/children/invoice')), 'invoice');
const chooseAddress = r => require.ensure([], () => r(require('../view/confirmOrder/children/chooseAddress')), 'chooseAddress');
const addAddress = r => require.ensure([], () => r(require('../view/confirmOrder/children/children/addAddress')), 'addAddress');
const searchAddress = r => require.ensure([], () => r(require('../view/confirmOrder/children/children/children/searchAddress')), 'searchAddress');

const order = r => require.ensure([], () => r(require('../view/order/order')), 'order');
const orderDetail = r => require.ensure([], () => r(require('../view/order/children/orderDetail')), 'orderDetail');

const balance = r => require.ensure([], () => r(require('../view/balance/balance')), 'balance');
const balanceDetail = r => require.ensure([], () => r(require('../view/balance/children/detail')), 'balanceDetail');

const points = r => require.ensure([], () => r(require('../view/points/points')), 'points');
const pointsDetail = r => require.ensure([], () => r(require('../view/points/children/detail')), 'pointsDetail');

const find = r => require.ensure([], () => r(require('../view/find/find')), 'find');
const download = r => require.ensure([], () => r(require('../view/download/download')), 'download');

const benefit = r => require.ensure([], () => r(require('../view/benefit/benefit')), 'benefit');
const coupon = r => require.ensure([], () => r(require('../view/benefit/children/coupon')), 'coupon');
const hbDescription = r => require.ensure([], () => r(require('../view/benefit/children/hbDescription')), 'hbDescription');
const hbHistory = r => require.ensure([], () => r(require('../view/benefit/children/hbHistory')), 'hbHistory');
const exchange = r => require.ensure([], () => r(require('../view/benefit/children/exchange')), 'exchange');
const commend = r => require.ensure([], () => r(require('../view/benefit/children/commend')), 'commend');

const vipcard = r => require.ensure([], () => r(require('../view/vipcard/vipcard')), 'vipcard');
const invoiceRecord = r => require.ensure([], () => r(require('../view/vipcard/children/invoiceRecord')), 'invoiceRecord');
const useCart = r => require.ensure([], () => r(require('../view/vipcard/children/useCart')), 'useCart');
const vipDescription = r => require.ensure([], () => r(require('../view/vipcard/children/vipDescription')), 'vipDescription');

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
    // 修改密码页
    {
      path: '/forget',
      component: forget
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
    // 服务中心
    {
      path: '/service',
      component: service,
      children: [{
        path: 'questionDetail',
        component: questionDetail
      }]
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
    // 特色商铺列表页
    {
      path: '/food',
      component: food
    },
    // 确认订单页
    {
      path: '/confirmOrder',
      component: confirmOrder,
      children: [{
        path: 'remark', // 订单备注
        component: remark
      }, {
        path: 'invoice', // 发票抬头
        component: invoice
      }, {
        path: 'payment', // 付款页面
        component: payment
      }, {
        path: 'userValidation', // 用户验证
        component: userValidation
      }, {
        path: 'chooseAddress', // 选择地址
        component: chooseAddress,
        children: [{
          path: 'addAddress', // 添加地址
          component: addAddress,
          children: [{
            path: 'searchAddress', // 搜索地址
            component: searchAddress
          }]
        }]
      }]
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
    // 余额
    {
      path: 'balance',
      component: balance,
      children: [{
        path: 'detail', // 余额说明
        component: balanceDetail
      }]
    },
    // 我的积分页
    {
      path: 'points',
      component: points,
      children: [{
        path: 'detail', // 积分说明
        component: pointsDetail
      }]
    },
    // 发现页
    {
      path: '/find',
      component: find
    },
    // 下载页
    {
      path: '/download',
      component: download
    },
    // 我的优惠页
    {
      path: 'benefit',
      component: benefit,
      children: [{
          path: 'coupon',
          component: coupon
        }, {
          path: 'hbDescription',
          component: hbDescription
        }, {
          path: 'hbHistory',
          component: hbHistory
        }, {
          path: 'exchange',
          component: exchange
        }, {
          path: 'commend',
          component: commend
      }]
    },
    // vip卡页
    {
      path: '/vipcard',
      component: vipcard,
      children: [{
        path: 'invoiceRecord', // 开发票
        component: invoiceRecord
      }, {
        path: 'useCart', // 购买会员卡
        component: useCart
      }, {
        path: 'vipDescription', // 会员说明
        component: vipDescription
      }]
    }
  ]
}];
