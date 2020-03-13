import store from '../store'

function add0(m) {
  return m < 10 ? '0' + m : m
}

export function formatTime(shijiaochuo) {
  let time = new Date(shijiaochuo);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

export function formatYear(shijiaochuo) {
  let time = new Date(shijiaochuo);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d);
}

export function toQfw(n) {
  if (n == 0) {
    return '0.00';
  }
  if (!n) {
    return n;
  }
  if (typeof(n) === 'string') {
    return n;
  }
  n = n.toFixed(2);
  let str_n = n.toString();

  let num, num1;
  if (str_n.indexOf('.') >= 0) {
    num = str_n.split('.')[0];
    num1 = str_n.split('.')[1];
  } else {
    num = str_n;
    num1 = '00';
  }
  let result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3)
  }

  if (num) {
    return num + result + '.' + num1
  }
  return 0

}


export function format() {
  let time = new Date();
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  let week = time.getDay();
  let weekArr = ['日', '一', '二', '三', '四', '五', '六']
  return y + '年' + add0(m) + '月' + add0(d) + '日' + '   星期' + weekArr[week];
}

export function setTime1() {
  let time = new Date();
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();

  return y + '-' + add0(m) + '-' + add0(d);
}

export function formDay() {
//shijianchuo是整数，否则要parseInt转换
  let time = new Date();
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();

  let myddy = time.getDay();//获取存储当前日期
  let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  // return  add0(h) + ':' + add0(mm);
  return y + '年' + m + '月' + d + '日' + "\xa0\xa0\xa0\xa0\xa0\xa0" + weekday[myddy];
}

export function formTime() {
//shijianchuo是整数，否则要parseInt转换
  let time = new Date();
  let h = time.getHours();
  if (h > 6 && h < 9) {
    return '早上好'
  }
  if (h >= 9 && h < 12) {
    return '上午好'
  }
  if (h >= 12 && h < 14) {
    return '中午好'
  }
  if (h >= 14 && h < 18) {
    return '下午好'
  }
  if (h >= 18 && h < 24) {
    return '晚上好'
  }
  if (h > 0 && h < 6) {
    return '亲，该休息了哦'
  }
}

// 清空数据仓库
export function resetStoreState() {
  store.commit('tagNav/resetTagNavState');
  store.commit('menubar/resetMenubarState')
}
