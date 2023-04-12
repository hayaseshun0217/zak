var RAL = RAL || {};
RAL.callQueue = RAL.callQueue || [];

(function () {

  var $ = (typeof jQuery === 'function') ? jQuery : undefined;
  var itemPattern = /^.*_item$/;
  var categoryPattern = /^Category_(?:top|set|page)$/;
  
  function trim(str) {
    return (str && str.replace(/^\s+|\s+$/g, ''));
  }
  function getIntValue(str) {
    var val = window.parseInt(str, 10);
    return (isNaN(val) ? undefined : val);
  }
  function getFloatValue(str) {
    var val = window.parseFloat(str);
    return (isNaN(val) ? undefined : val);
  }
  function getParam(id, convert) {
    var input = document.getElementById(id);
    var param = (input && input.value && trim(input.value));
    if (param && convert) {
      param = convert(param);
    }
    return param;
  }
  function getArray(id, convert) {
    var input = document.getElementById(id);
    var str = (input && input.value && trim(input.value));
    var elts = [];
    if (str) {
      elts = str.split(',');
      for (var i = 0; i < elts.length; ++i) {
        elts[i] = trim(elts[i]);
        if (convert) {
          elts[i] = convert(elts[i]);
        }
      }
    }
    return elts;
  }

  var scriptEl = document.createElement('script');
  scriptEl.type = 'text/javascript';
  scriptEl.async = 'async';
  scriptEl.defer = 'defer';
  scriptEl.src = '//a.ichiba.jp.rakuten-static.com/com/rat/js/ral-1.0.18.js?v=20150602';
  var targetEl = document.getElementsByTagName('script')[0];
  targetEl.parentNode.insertBefore(scriptEl, targetEl);

  var accountId = getParam('ratAccountId', getIntValue) || 1;
  var serviceId = getParam('ratServiceId', getIntValue) || 2;
  var pageType = getParam('ratPageType');
  var pageName = getParam('ratPageName');
  var shopItemIds = getArray('ratShopItem');
  var prices = getArray('ratPrice', getFloatValue);
  var itemGenres = getArray('ratIGenre');
  var itemTest = getParam('ratItemTest');
  var storyABTest = getParam('ratStoryItemTest');
  var storyATerm = getParam('ratStoryATerm');
  var storyABTerm = getParam('ratStoryABTerm');
  // TEMPORARY
  if (!storyABTest) {
    var mlist = '/tsukiji-chokusoubin/kihachi/chashoan/silverpot/gourmet-honpo/genkibuta/vanilla/mensaikobo/kikyoya/okawari88/isekanbutsu/gensouen/casa-kakiya/favorite-one/raziiel/luzllena/cabifashion/4cups/night1/girl-k/soulberry/auc-ecoloco/reca/auc-ruirue/mobacaba/selection/i-office1/bunbunbee/tees-factory/kojima-ya/silver-bullet/e-zakkamania/outletshoes/angfa/dhcshop/';
    var match = document.location.href.match(/item\.rakuten\.co\.jp(\/[^\/]+\/)/);
    if (match && mlist.indexOf(match[1]) != -1) {
      storyABTest = storyABTest || 'A';
      storyATerm = storyATerm || '';
      storyABTerm = storyABTerm || '2000-01-01_2099-12-31';
    }
  }
  // END: TEMPORARY
  var pageLayout = getParam('ratPageLayout');
  var scrollSetting = {'PC':300, 'SP':100};

  function setBaseParams() {
    RAL.callQueue.push(['setAccountId', accountId]);
    RAL.callQueue.push(['setServiceId', serviceId]);
    RAL.callQueue.push(['setPageType', pageType]);
    RAL.callQueue.push(['setParameters', {'pgl': pageLayout}]);
    if (itemTest) {
      RAL.callQueue.push(['setCustomParameters', {'abtest': itemTest}]);
    }
  }
  
  setBaseParams();
  RAL.callQueue.push(['setPageName', pageName]);
  RAL.callQueue.push(['setParameters', {
    'itemid': shopItemIds,
    'price' : prices,
    'igenre' : itemGenres
  }]);
  
  if (itemPattern.test(pageName)) {
    var shopUrl = getParam('ratShopUrl');
    var ranCode = getParam('ratRanCode');
    var itemTags = getArray('ratITag');
    var iPoint = getArray('ratIPoint', getIntValue);
    var iRevNum = getArray('ratIRevNum', getIntValue);
    var soldOut = getArray('ratSoldOut', getIntValue);
    var iStockNum = getArray('ratStockNum');

    // Extract shop url and item url
    var urlMatch = document.location.href.match(/item\.rakuten\.co\.jp\/([^\/]+)\/([^\/?#]+)(?:[\/?#]|$)/);
    shopUrl = urlMatch ? urlMatch[1] : shopUrl;
    var itemUrl = urlMatch ? urlMatch[2] : '';
    
    RAL.callQueue.push(['setParameters', {
      'shopurl' : shopUrl,
      'itemurl' : itemUrl,
      'rancode' : ranCode
    }]);
    if (itemTags && itemTags.length > 0) {
      RAL.callQueue.push(['setParameters', {'itag': itemTags}]);
    }
    
    if ($) {
      RAL.callQueue.push(['setCustomParameters', {
        'docheight': $(document).height() ,
        'winheight': $(window).height()
      }]);
  
      var cartArea = $('[data-ratunit="cart"]');
      if (cartArea.size() == 0) {
        cartArea = $('#rakutenLimitedId_cart'); // PC normal item
      }
      if (cartArea.size() == 0) {
        cartArea = $('div.cartDiv'); // SP normal item
      }
      if (cartArea.size() == 0) {
        cartArea = $('table[id^="normal_basket_"]'); // PC multi item
      }
      
      if (cartArea.size() > 0) {
        var offsetList = [];
        cartArea.each(function() {
          offsetList.push($(this).offset().top);
        });
        RAL.callQueue.push(['setCustomParameters', {'cartoffset': offsetList }]);
      }
      
      var imgCount = $('a.rakutenLimitedId_ImageMain1-3, li.smtBannerItem240').length;
      if (imgCount) {
        RAL.callQueue.push(['setCustomParameters', {'nimg':imgCount}]);
      }
      
      if (itemTest) {
        // For buttons ab test check
        var $aroundCart = $('#rakutenLimitedId_aroundCart');
        var $reviewLinks = $aroundCart.find('td.review > a');
        var $seeReviewBtn = $aroundCart.find('button.seeReview');
        var $rCartBtn = $aroundCart.find('input.rCartBtn');
        var $rPamphBtn = $aroundCart.find('button.rPamphBtn');
        if (!$rPamphBtn.length) {
          $rPamphBtn = $aroundCart.find('input.rPamphBtn');
        }
        var $rAskBtn = $aroundCart.find('button.rAskBtn');
        if (!$rAskBtn.length) {
          $rAskBtn = $aroundCart.find('input.rAskBtn');
        }
        
        var hasSeeReview = ($reviewLinks.length == 2 || $seeReviewBtn.length) ? 1 : 0;
        var hasCartBtn = $rCartBtn.length;
        var hasPamphBtn = $rPamphBtn.length;
        var hasAskBtn = $rAskBtn.length;
        
        var isCartMod = (hasCartBtn && $rCartBtn.css('background-image') != 'none') ? 1 : 0;
        var isPamphMod = (hasPamphBtn && $rPamphBtn.css('background-image') != 'none') ? 1 : 0;
        var isAskMod = (hasAskBtn && $rAskBtn.css('background-image') != 'none') ? 1 : 0;
  
        RAL.callQueue.push(['setCustomParameters', {
          'btnpattern': 'item_' + hasSeeReview + hasPamphBtn + hasAskBtn,
          'custpattern': 'item_cust_' + isCartMod + isPamphMod + isAskMod
        }]);
      }
    }
    RAL.callQueue.push(['setCustomParameters', {
      'ipoint': iPoint,
      'irevnum': iRevNum
    }]);
    if (soldOut) {
      RAL.callQueue.push(['setCustomParameters', {'soldout': soldOut}]);
    }
    if (iStockNum) {
      RAL.callQueue.push(['setCustomParameters', {'istocknum': iStockNum}]);
    }
    
    if (storyABTest) {
      RAL.callQueue.push(['setCustomParameters', {
        'storyab' : storyABTest,
        'aterm' : storyATerm,
        'abterm' : storyABTerm
      }]);
    }
    
    // JSON polyfill
    var JSON = window.JSON;
    if (!JSON) {
      JSON = {};
      (function(){function m(a){return 10>a?"0"+a:a}function r(a){s.lastIndex=0;return s.test(a)?'"'+a.replace(s,function(a){var c=u[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function p(a,k){var c,d,h,q,g=e,f,b=k[a];b&&"object"===typeof b&&"function"===typeof b.toJSON&&(b=b.toJSON(a));"function"===typeof l&&(b=l.call(k,a,b));switch(typeof b){case "string":return r(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null";
      e+=n;f=[];if("[object Array]"===Object.prototype.toString.apply(b)){q=b.length;for(c=0;c<q;c+=1)f[c]=p(c,b)||"null";h=0===f.length?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(l&&"object"===typeof l)for(q=l.length,c=0;c<q;c+=1)d=l[c],"string"===typeof d&&(h=p(d,b))&&f.push(r(d)+(e?": ":":")+h);else for(d in b)Object.hasOwnProperty.call(b,d)&&(h=p(d,b))&&f.push(r(d)+(e?": ":":")+h);h=0===f.length?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+"}";e=g;return h}}
      "function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+m(this.getUTCMonth()+1)+"-"+m(this.getUTCDate())+"T"+m(this.getUTCHours())+":"+m(this.getUTCMinutes())+":"+m(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var t=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,s=
      /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,u={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},l;"function"!==typeof JSON.stringify&&(JSON.stringify=function(a,k,c){var d;n=e="";if("number"===typeof c)for(d=0;d<c;d+=1)n+=" ";else"string"===typeof c&&(n=c);if((l=k)&&"function"!==typeof k&&("object"!==typeof k||"number"!==typeof k.length))throw Error("JSON.stringify");return p("",{"":a})});
      "function"!==typeof JSON.parse&&(JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&"object"===typeof b)for(g in b)Object.hasOwnProperty.call(b,g)&&(f=c(b,g),void 0!==f?b[g]=f:delete b[g]);return e.call(a,d,b)}var d;a=String(a);t.lastIndex=0;t.test(a)&&(a=a.replace(t,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
      "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),"function"===typeof e?c({"":d},""):d;throw new SyntaxError("JSON.parse");})})();
    }
    // Beacon
    var beacon = {
        'acc': accountId,
        'aid': serviceId + 10000,
        'bid': new Date().getTime().toString() + Math.floor(0x100000000*Math.random()).toString(16),
        'pgt': pageType,
        'pgn': pageName,
        'itemid': shopItemIds,
        'price': prices,
        'igenre': itemGenres,
        'shopurl': shopUrl,
        'itemurl': itemUrl,
        'soldout': soldOut
    };
    if (pageLayout) { beacon.pgl = pageLayout; }
    if (soldOut) { beacon.soldout = soldOut; }
    if (itemTest) { beacon.abtest = itemTest; }
    if (storyABTest) {
      beacon.storyab = storyABTest;
      beacon.aterm = storyATerm;
      beacon.abterm = storyABTerm;
    }
    if (document.location.href) { beacon.url = document.location.href.substr(0, 500); }
    if (document.referrer) { beacon.ref = document.referrer.substr(0, 500); }
    var beaconSrc = '//rat.rakuten.co.jp/?cpkg_none=' + encodeURIComponent(JSON.stringify(beacon));
    if (beaconSrc.length < 2048) {
      document.write('<img src="'+beaconSrc+'" style="display:none;">');
    }
  } else if (categoryPattern.test(pageName)) {
    
    var sGenre = getParam('ratSGenre');
    RAL.callQueue.push(['setParameters', {
      'sgenre' : sGenre
    }]);
  }

  RAL.callQueue.push(['setEvent', 'pv']);

  if ($ && itemPattern.test(pageName)) {
    $(function() {
      /*
      jQuery.appear
      http://code.google.com/p/jquery-appear/
      Copyright (c) 2009 Michael Hixson
      Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
     */
     (function(a){a.fn.appear=function(e,b){var d=a.extend({data:void 0,one:!0,ratio:0},b);return this.each(function(){var c=a(this);c.appeared=!1;if(e){var g=a(window),f=function(){if(c.is(":visible")){var a=g.scrollLeft(),e=g.scrollTop(),b=c.offset(),f=b.left,b=b.top,h=!isNaN(d.ratio)&&0<d.ratio&&1>=d.ratio?d.ratio:0,h=h?h*c.height():0;b+c.height()-h>=e&&b+h<=e+g.height()&&f+c.width()>=a&&f<=a+g.width()?c.appeared||c.trigger("appear",d.data):c.appeared=!1}else c.appeared=!1},b=function(){c.appeared=
     !0;if(d.one){g.unbind("scroll",f);var b=a.inArray(f,a.fn.appear.checks);0<=b&&a.fn.appear.checks.splice(b,1)}e.apply(this,arguments)};if(d.one)c.one("appear",d.data,b);else c.bind("appear",d.data,b);g.scroll(f);a.fn.appear.checks.push(f);f()}else c.trigger("appear",d.data)})};a.extend(a.fn.appear,{checks:[],timeout:null,checkAll:function(){var e=a.fn.appear.checks.length;if(0<e)for(;e--;)a.fn.appear.checks[e]()},run:function(){a.fn.appear.timeout&&clearTimeout(a.fn.appear.timeout);a.fn.appear.timeout=
     setTimeout(a.fn.appear.checkAll,20)}});a.each("append prepend after before attr removeAttr addClass removeClass toggleClass remove css show hide".split(" "),function(e,b){var d=a.fn[b];d&&(a.fn[b]=function(){var b=d.apply(this,arguments);a.fn.appear.run();return b})})})(jQuery);
      
      if (typeof $.fn.appear === 'function') {
        $('div.rItemStoryContents, #rakutenLimitedId_cart').appear(function () {
          var $this = $(this);
          setBaseParams();
          RAL.callQueue.push(['appendParameters',  {'compid' : $this.attr('id'), 'comptop' : $this.offset().top }]);
          RAL.callQueue.push(['setEvent', 'scroll']);
        });
        
        $('p.itemBuyCartBtn > input.normalCartText').appear(function () {
          var $this = $(this);
          setBaseParams();
          RAL.callQueue.push(['appendParameters',  {'compid' : $this.attr('className'), 'comptop' : $this.offset().top }]);
          RAL.callQueue.push(['setEvent', 'scroll']);
        });
        
        $('#shopRevenueRecommendSection').appear(function () {
          var $this = $(this);
          setBaseParams();
          RAL.callQueue.push(['appendParameters',  {'compid' : $this.attr('id'), 'comptop' : $this.offset().top }]);
          RAL.callQueue.push(['setEvent', 'scroll']);
        }, {ratio:1});
      }
      
      var $win = $(window), $doc = $(document);
      var firstScrollThreshold = 100;
      $win.bind('scroll.ral_first', function () {
        if ($doc.scrollTop() >= firstScrollThreshold) {
          setBaseParams();
          RAL.callQueue.push(['setParameters',  {'issc' : 1}]);
          RAL.callQueue.push(['setEvent', 'scroll']);
          $win.unbind('scroll.ral_first');
        }
      });
      
      $win.bind('scroll.ral_bottom', function () {
        var doch = $doc.height();
        var winh = $win.height();
        if ($doc.scrollTop() + winh >= doch) {
          setBaseParams();
          RAL.callQueue.push(['setCustomParameters',  {
            'bottom' : 1,
            'scpos' : $doc.scrollTop(),
            'winheight' : winh,
            'docheight' : doch
          }]);
          RAL.callQueue.push(['setEvent', 'scroll']);
          $win.unbind('scroll.ral_bottom');
        }
      });
      
      var now = new Date();
      var today = now.getFullYear() + '-' + 
                  ('0' + now.getMonth()).slice(-2) + '-' +
                  ('0' + now.getDate()).slice(-2);
      var termExp = /^(\d\d\d\d-\d\d-\d\d)_(\d\d\d\d-\d\d-\d\d)$/
      var ATermEnd = termExp.test(storyATerm) ? termExp.exec(storyATerm)[2] : '';
      var ABTermEnd = termExp.test(storyABTerm) ? termExp.exec(storyABTerm)[2] : '';
      var isTermActive = today < ATermEnd || today < ABTermEnd;
      
      var trackScroll = storyABTest && isTermActive;
      if (trackScroll) {
        var scrollIncrement = scrollSetting[pageLayout] ? scrollSetting[pageLayout] : 300;
        var scrollThreshold = scrollIncrement;
        $win.bind('scroll.ral_step', function () {
          var doch = $doc.height();
          var winh = $win.height();
          
          if ($doc.scrollTop() >= scrollThreshold) {
            // Current step = highest step lower than the current position
            scrollThreshold = Math.floor($doc.scrollTop()/scrollIncrement) * scrollIncrement;
            setBaseParams();
            RAL.callQueue.push(['setCustomParameters',  {
              'scpos' : scrollThreshold,
              'winheight' : winh,
              'docheight' : doch,
              'storyab' : storyABTest
            }]);
            if (urlMatch) {
              RAL.callQueue.push(['setParameters', {'shopurl': urlMatch[1]}]);
              RAL.callQueue.push(['setParameters', {'itemurl': urlMatch[2]}]);
            }
            RAL.callQueue.push(['setEvent', 'scroll']);
            scrollThreshold += scrollIncrement;
            if (scrollThreshold + winh > doch) {
              $win.unbind('scroll.ral_step');
            }
          }
        });
      }
      
      // Scroll to cart button (Desktop)
      $('#rakutenLimitedId_cartParts').bind('click', function () {
        setBaseParams();
        RAL.callQueue.push(['setParameters', {'itemid': shopItemIds}]);
        RAL.callQueue.push(['setCustomParameters',  {'target' : 'rakutenLimitedId_cartParts'}]);
        RAL.callQueue.push(['setEvent', 'click']);
      });

      // Scroll to cart button (Smart phone)
      $('#smt_rakutenLimitedId_cartParts').bind('touchstart', function () {
        setBaseParams();
        RAL.callQueue.push(['setParameters', {'itemid': shopItemIds}]);
        RAL.callQueue.push(['setCustomParameters',  {'target' : 'smt_rakutenLimitedId_cartParts'}]);
        RAL.callQueue.push(['setEvent', 'click']);
      });
      
      // Bookmark (desktop)
      $('#serviceTableSml').delegate('a.addBkm, a.addShopBkm', 'click', function () {
        setBaseParams();
        RAL.callQueue.push(['setParameters', {'itemid': shopItemIds}]);
        RAL.callQueue.push(['setCustomParameters',  {'target' : $(this).attr('className')}]);
        RAL.callQueue.push(['setEvent', 'click']);
      });

      // Bookmark (SP)
      $('li.itemBuyFavBtn > a').bind('touchstart', function () {
        setBaseParams();
        RAL.callQueue.push(['setParameters', {'itemid': shopItemIds}]);
        RAL.callQueue.push(['setCustomParameters',  {'target' : 'itemBuyFavBtn'}]);
        RAL.callQueue.push(['setEvent', 'click']);
      });
    });
  }
})();
