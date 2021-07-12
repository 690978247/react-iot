// 深拷贝
export function deepClone(target) {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值    
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
}

//获取当前时间
export function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hours = date.getHours();
  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours <= 9) {
    hours = "0" + hours
  }
  if (minutes <= 9) {
    minutes = "0" + minutes
  }
  if (seconds <= 9) {
    seconds = "0" + seconds
  }


  var currentdate = year + seperator1 + month + seperator1 + strDate + " " + hours + ":" + minutes + ":" + seconds;
  return currentdate;
}

export function stringToArray(arr) {
  return arr && arr.length > 0 ? arr.split(',') : null
}

export function setCookie (key, value, day) {
  let expires = day * 86400 * 1000  // 时间转化成 ms
  let date = new Date( + new Date() + expires) // 当前时间加上要存储的时间
  document.cookie = `${key}=${value};expires=${date.toUTCString()}`
}

export function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)===0) return c.substring(name.length,c.length);
  }
  return "";
}

//下载文件
export function downFile(res, fileName) {
  const blob = new Blob( [res], {type: "application/x-xls;charset=utf-8"} )
  // 兼容不同浏览器的URL对象
  const url = window.URL || window.webkitURL || window.moxURL
  // 创建下载链接
  const downloadHref = url.createObjectURL(blob)
  // 创建a标签并为其添加属性
  let downloadLink = document.createElement("a")
  downloadLink.href = downloadHref
  downloadLink.download = fileName
  // 触发点击事件执行下载
  downloadLink.click()
  window.URL.revokeObjectURL(url);
}

/**
 * 判断是否为有效编辑
 * gist: 依据
 * key：判断对象的key
 * dataIndex: 判断字段
 * val: 判断的字段值
 * return bool
 */
export function isEffectiveEditor(gist, key, dataIndex, val) {
  // if (gist.length === 0) {
  //   return false
  // }
 
  // return gist.some(item => {
  //   if (item.key === key) {
  //     return item[dataIndex] === val
  //   }
  //   return false
  // })
}
/**
 * 判断数组中对应的对象跟被判断的对象是否一致
 * @param gist 依据（数组）
 * @param newObj 判断对象
 */
export function isFit(gist, newObj) {
  for (let i = 0; i < gist.length;i++){
    if (gist[i].key === newObj.key) {
      for (let key in gist[i]) {
        if (newObj[key] !== gist[i][key]) {
          return false
        }
      }
      return true
    }
  }
}

/**
 * 判断值是否唯一
 * @param {*} dataArr : 依据
 * @param {*} id ：跳过当前项
 * @param {*} key ：判断的key
 * @param {*} val ：判断的字段值
 * true: 唯一 
 */
export function isRepeat(dataArr, id, key, val) {
  if (dataArr.length > 0) {
    dataArr.some(item => item.id !== id && item[key] === val)
  }
}

export function hasKey(dataList, key, val) {
  dataList.some()
}

/**
 * 数组中取出指定key的对象
 * @param {*} dataList 
 * @param {*} key 
 * @param {*} val 
 */
export function callObj(dataList, key, val) {
  let i = dataList.filter(item => item[key] + "" === val)
  return i[0]
}


//防抖
export function debounce(fn, wait, immediate = false){
  let timer, startTimeStamp = 0;
  let context, args;
  console.log(context, args)

  console.log("-----")
 
  let run = (timerInterval) => {
    timer = setTimeout(() => {
      let now = (new Date()).getTime();
      let interval = now - startTimeStamp
      if (interval < timerInterval) {
        startTimeStamp = now;
        run(wait - interval);
      } else {
        if (!immediate) {
          console.log("执行函数")
          fn();
        }
        console.log("清除定时器")
        clearTimeout(timer);
        timer = null;
      }
			
    }, timerInterval);
  }
 
  return function () {
    context = this;
    args = arguments;
    let now = (new Date()).getTime();
    startTimeStamp = now;
 
    if (!timer) {
      if (immediate) {
        fn();
      }
      run(wait);
    }
  }
}

export function throttle(func, delay) {
  var prev = Date.now();
  console.log("上一次时间：",prev)
  return (()=>{
    var context = this;
    var args = arguments;
    var now = Date.now();
    console.log("时间差：",now - prev)
    if (now - prev >= delay) {
      console.log("执行函数")
      func.apply(context, args);
      prev = Date.now();
    }            
  })()
}

export function converTime (str, index, char){
   const strAry = str.split('');
   strAry[index] = char;
   return strAry.join('');
   }