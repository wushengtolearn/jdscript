/*
京东神仙书院
活动时间:2021-1-20至2021-2-5
增加自动积分兑换京豆(条件默认为：至少700积分，1.4倍率)
暂不加入品牌会员，需要自行填写坐标，用于做逛身边好店任务
环境变量：JD_IMMORTAL_LATLON(经纬度)
示例：JD_IMMORTAL_LATLON={"lat":33.1, "lng":118.1}
boxjs IMMORT
活动入口：京东APP我的-神仙书院
地址：https://h5.m.jd.com//babelDiy//Zeus//4XjemYYyPScjmGyjej78M6nsjZvj//index.html?babelChannel=ttt9
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京东神仙书院
20 8 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_immortal.js, tag=京东神仙书院, img-url=https://raw.githubusercontent.com/Orz-3/task/master/jd.png, enabled=true

================Loon==============
[Script]
cron "20 8 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_immortal.js, tag=京东神仙书院

===============Surge=================
京东神仙书院 = type=cron,cronexp="20 8 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_immortal.js

============小火箭=========
京东神仙书院 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_immortal.js, cronexpr="20 8 * * *", timeout=3600, enable=true
 
const $ = new Env('京东神仙书院');
}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdNian() {
  try {
    $.risk = false
    await getHomeData()
    if ($.risk) return
    await getTaskList($.cor)
    await $.wait(2000)
    await helpFriends()
    await $.wait(2000)
    await getHomeData(true)
    await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}

function showMsg() {
  return new Promise(resolve => {
    message += `本次运行获得${$.earn}金币，当前${$.coin}金币`
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`);
    }
    resolve()
  })
}

async function helpFriends() {
  for (let code of $.newShareCodes) {
    if (!code) continue
    await doTask(code)
    await $.wait(2000)
  }
}

function doTask(itemToken) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('mcxhd_brandcity_doTask', {itemToken: itemToken}, 'mcxhd_brandcity_doTask'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['retCode'] === "200") {
            if (data.result.score)
              console.log(`任务完成成功，获得${data.result.score}金币`)
            else if (data.result.taskToken)
              console.log(`任务请求成功，等待${$.duration}秒`)
            else {
              console.log(`任务请求结果未知`)
            }
          } else {
            console.log(data.retMessage)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function doTask2(taskToken) {
  let body = {
    "dataSource": "newshortAward",
    "method": "getTaskAward",
    "reqParams": `{\"taskToken\":\"${taskToken}\"}`
  }
  return new Promise(resolve => {
    $.post(taskPostUrl2("qryViewkitCallbackResult", body,), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.code === "0") {
              console.log(data.toast.subTitle)
            } else {
              console.log(`任务完成失败，错误信息：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
          data = JSON.parse(data);
          if (data && data['retCode'] === "200") {
            const {userRemainScore, exchageRate} = data.result
            console.log(`当前用户兑换比率${exchageRate}`)
            if (exchageRate === 1.4 && userRemainScore >= scoreToBeans) {
              console.log(`已达到最大比率，去兑换`)
              await exchange()
            }
          } else {
            $.risk = true
            console.log(`账号被风控，无法参与活动`)
            message += `账号被风控，无法参与活动\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}

function exchange() {
  return new Promise((resolve) => {
    $.post(taskPostUrl('mcxhd_brandcity_exchange'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data['retCode'] === "200") {
            const {consumedUserScore, receivedJbeanNum} = data.result
            console.log(`兑换成功，消耗${consumedUserScore}积分，获得${receivedJbeanNum}京豆`)
          } else {
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({
      url: `http://jd.turinglabs.net/api/v2/jd/immortal/read/${randomCount}/`,
      'timeout': 10000
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
()
  })
}

// 自动获取经纬度
function getLatLng() {
  return new Promise(resolve => {
    try {
      console.log('开始自动获取经纬度 lat lng ……');
      $.get({
        url: 'https://jingweidu.bmcx.com/web_system/bmcx_com_www/system/file/jingweidu/api/?v=20031911',
        headers: {
          "referer": "https://jingweidu.bmcx.com/",
          'Content-Type': 'text/html; charset=utf-8',
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"
        }
      }, async (err, resp, data) => {
        const res = data.match(/qq\.maps\.LatLng\(([\d\.]+), ([\d\.]+)\)/);
        let lat = res[1];
        let lng = res[2];
        if (lat > 0 && lng > 0) {
          resolve({
            'lng': lng,
            'lat': lat
          });
          return;
        }
        console.log('自动获取经纬度 lat lng 失败，返回经纬度结果错误');
        resolve({});
      });
    } catch (e) {
      console.log('自动获取经纬度 lat lng 失败，触发异常');
      resolve({});
    }
  });
}

function taskPostUrl(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  body = {...body, "token": 'jd17919499fb7031e5'}
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&appid=publicUseApi`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
    }
  }
}

function taskPostUrl2(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            $.nickName = data['base'].nickname;
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
// prettier-ignore
*/
