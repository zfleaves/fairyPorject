import router from 'router'
import Router from 'vue-router'
import store from 'store'
import {Message} from 'element-ui'
import {getMenusList, checkToken} from 'api/login/login'
import whiteList from 'router/whitelist'
import NProgress from "nprogress";
import Auth from 'util/auth'
import {constantRouterMap} from './router/index'

console.log(router);

// let lyout = () => import('views/lyout/index');
const _import = require('router/_import_' + process.env.NODE_ENV);//获取组件的方法
import Layout from 'views/lyout/index' //Layout 是架构组件，不在后台返回，在文件里单独引入

let getRouter;
const error = [{
  path: '*',
  name: 'Error404',
  component: () => import('views/error/404'),
}];

router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start();
  if (Auth.hasToken()) {
    if (to.path === '/login') {
      next({path: '/home', replace: true})
    } else if (to.path.indexOf('/error') >= 0) {
      next()
    } else {
      if (!getRouter) {  //不加这个判断，路由会陷入死循环
        if (!Auth.getObjArr('router')) {//如果动态路由不存在
          checkToken(Auth.hasToken()).then(res => {
            if (res.results === 0) {
              getMenusList().then(res => {//获取菜单列表
                let menus = res.results && res.results.length ? res.results : [];
                getRouter = setRouter(menus); //对得到的路由数组进行 设置需要的路由结构
                console.log(getRouter);
                Auth.saveObjArr(getRouter); //存储路由到localStorage
                routerGo(to, next);
              })
            } else {
              Auth.reLogin();
              next({path: '/login', replace: true})
            }
          })
        } else {
          checkToken(Auth.hasToken()).then(res => {
            if (res.results === 0) {
              getRouter = Auth.getObjArr('router'); //存储路由到localStorage
              routerGo(to, next);
            } else {
              Auth.reLogin();
              next({path: '/login', replace: true})
            }
          })
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.name) >= 0) {
      getRouter = null;
      next()
    } else {
      getRouter = null;
      next({path: '/login', replace: true});
    }
  }
})

router.afterEach(() => {
  NProgress.done()
});

//设置需要的路由显示方式
export function setRouter(arr) {
  for (let i in arr) {
    let item = arr[i];
    // item.name = item.path;
    item.icon = item.path;
    item.path = '';
    item.component = 'Layout';
    item.meta = {
      title: item.resName, name: item.resName
    }
    if (item.children && item.children.length) {
      for (let j in item.children) {
        let child = item.children[j];
        child.name = child.path;
        child.component = child.resUrl;
        child.meta = {
          title: child.resName, name: child.resName, isCached: child.cached
        }
      }
    }
  }
  return arr;
}

export function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter); //过滤路由
  let newRouter = getRouter.concat(error);

  // router.addRoutes(newRouter); //动态添加路由
  router.$addRoutes(newRouter); //动态添加路由

  next({...to, replace: true})
}

// export function filterAsyncRouter(arr) {
//   for (let i in arr) {
//     let item = arr[i];
//     if (item.children && item.children.length) {
//       for (let j in item.children) {
//         let child = item.children[j];
//         child.component = _import(child.component);
//       }
//     }
//   }
//   return arr;
// }

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象

  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {//Layout组件特殊处理
        route.component = Layout
      } else {
        // const activeComponent =
        // console.log(`views/${route.component}`);
        route.component = _import(route.component);
        // route.component = resolve=>(require([`views/${route.component}`],resolve));
      }
    }
    if (route.children && route.children.length) {

      route.children = filterAsyncRouter(route.children)
    }
    return true
  });

  // accessedRouters.push(error);

  return accessedRouters
}

router.$addRoutes = (params) => {
  router.matcher = new Router({ // 重置路由规则
    routes: constantRouterMap
  }).matcher;
  router.addRoutes(params) // 添加路由
}
