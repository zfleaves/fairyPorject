// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import Auth from 'util/auth'

import Mock from '@/mock.js' //也可以不写index.js
import axios from 'axios'; //引入axios,发送Ajax请求用的。
// 如果process.env.Mock == true执行startMock()
if (process.env.MOCK) {
	Mock.startMock();
}



import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'styles/index.scss'
import '@/promission' //这里进行路由后台获取的模拟
import '../static/icon/iconfont.css'
import filters from './filters'

const Base64 = require('js-base64').Base64;
Vue.prototype.Base64 = Base64;

Object.keys(filters).forEach(k => {
  Vue.filter(k, filters[k]);
})

import store from 'store'
import Loading from 'components/loading'
import ElNumber from 'components/elNumber'
import tooltips from 'components/tooltips'

Vue.prototype.getLoading = function (text) {
  return Vue.prototype.$loading({
    lock: true,
    text: text,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
}

Vue.use(ElementUI);
Vue.use(Loading);
Vue.use(ElNumber);
Vue.use(tooltips);

// 禁止快速点击
Vue.directive('fastClick', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        let disabledTime = setTimeout(() => {
          el.disabled = false;
          clearTimeout(disabledTime);
        }, binding.value || 300)
      }
    })
  }
})
Vue.directive('has', {
  bind: function (el, binding) {
    let currentPage = store.state.tagNav.currentPage;
    let isBtn = judgeBtn(binding.value, currentPage);
    // console.log(Auth.hasLoginSimulatedToken());
    if (Auth.hasLoginSimulatedToken()) {
      if (binding.value.indexOf('update') >= 0) {
        el.disabled = false;
        el.classList.remove("is-disabled");
      } else {
        if (!isBtn) {
          // el.remove();
          el.style.display = 'none';
        }
      }
    } else {
      if (!isBtn) {
        // el.remove();
        el.style.display = 'none';
      }
    }
  }
});

function judgeBtn(strBtn, currentPage) {
  let obj;
  let getRouter = Auth.getObjArr('router');//拿到路由
  // console.log(Auth.hasLoginSimulatedToken());
  for (let i in getRouter) {
    let item = getRouter[i];
    if (item.children && item.children.length) {
      let index = item.children.findIndex(v => v.name === currentPage.name);
      if (index >= 0) {
        obj = item.children[index].children;
      }

    }
  }
  if (!obj) return;
  // if (Auth.hasLoginSimulatedToken) {
  //   if (strBtn.indexOf('update') >= 0) {
  //     return true
  //   }
  // }
  if (obj.some(v => v.path === strBtn)) {
    return true;
  } else {
    return false;
  }

}

//自定义拖动
Vue.directive('drag', function (el, binding) {
  // instance.isShowImageDialog = true;
  let oDiv = el;   //当前元素
  oDiv.onmousedown = function (e) {
    if (e.button === 2) return;

    e.preventDefault();

    let bw = document.body.clientWidth;
    let bh = document.body.clientHeight;
    //鼠标按下，计算当前元素距离可视区的距离
    let disX = e.clientX - oDiv.offsetLeft;
    let disY = e.clientY - oDiv.offsetTop;

    document.onmousemove = function (e) {
      //通过事件委托，计算移动的距离
      let l = 0, t = 0;

      // 拖动边界
      if (e.clientX >= bw) {
        l = bw - disX;
      } else if (e.clientX <= 0) {
        {
          l = 0 - disX;
        }
      } else {
        l = e.clientX - disX;
      }
      if (e.clientY >= bh) {
        t = bh - disY;
      } else if (e.clientY <= 0) {
        t = 0 - disY;
      }
      else {
        t = e.clientY - disY;
      }

      //移动当前元素
      oDiv.style.left = l + 'px';
      oDiv.style.top = t + 'px';
      //将此时的位置传出去
      binding.value({x: e.pageX, y: e.pageY})
    };
    // 事件移除
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
});

Vue.config.productionTip = false;
import variable from './variable/variable'
import Tooltips from "./components/tooltips";

Vue.prototype.variable = variable;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
