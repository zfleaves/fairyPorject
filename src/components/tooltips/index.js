import TooltipsComponent from './tooltips'

const Tooltips = {
  install: function (Vue) {
    Vue.component('tooltips', TooltipsComponent)
  }  //'Loading'这就是后面可以使用的组件的名字，install是默认的一个方法
};

export default Tooltips;
