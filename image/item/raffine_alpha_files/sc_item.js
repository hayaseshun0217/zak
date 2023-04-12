(function(_W, _D, _L, _N) {
    //try {
    if (typeof s == 'undefined') {
        return;
    }
    var SC = {};
    var mainRequestChk = false;
    var subRequestChk = false;
    // set Add event definition
    SC.addEvent = function(e, t, n) {
        if (e.addEventListener) {
            e.addEventListener(t, n, false);
        } else {
            e.attachEvent("on" + t, n);
        }
    };
    SC.removeEvent = function(e, t, n) {
        if (e.removeEventListener) {
            e.removeEventListener(t, n, false);
        } else {
            e.detachEvent("on" + t, n);
        }
    };
    SC.layoutInfo = function() {
        layout = _D.getElementsByName('viewport').length ? 'SP' : 'PC';
        return layout;
    };
    //Get Device Information
    SC.getDeviceClass = function() {
        var _DC;
        switch (s_getUaInfomation()) {
            case "PC":
                _DC = "PC";
                break;
            case "iPhone":
            case "Android Mobile":
            case "BlackBerry":
            case "Windows Phone":
                _DC = "SP";
                break;
            case "iPad":
            case "Android Tablet":
                _DC = "TB";
                break;
            case "GAME":
                _DC = "GM";
                break;
            case "Feature phone":
                _DC = "FP";
                break;
            case "Others":
            default:
                _DC = "OT";
                break;
        }
        return _DC;
    };
    SC.setDeviceClass = function(_sName) {
        return _sName + "[" + SC.getDeviceClass() + "]";
    };
    // document.getElemenyById val
    var partsEl = function(e) {
        var t = _D.getElementById(e);
        return t;
    };
    SC.reqProp18 = function() {
        try {
            if (mainRequestChk === true) {
                s.prop18 = "";
                if (rnkPartsAjax !== "") {
                    s.linkTrackVars = 'prop18';
                    s.prop18 = s.prop9 + rnkPartsAjax;
                    s.tl(this, 'o', 'Shop:Item');
                    subRequestChk = true;
                }
            }
        } catch (e) {
            return;
        }
    };
    SC.setParameter = function() {
        try {
            //Write Your Code - Start
            if (_L.pathname.split("/")[1] == "rakuten24-kobo") {
                var _body = _D.getElementsByTagName("head")[0];
                var scJS = function() {
                    var _ele = _D.createElement("script");
                    _ele.src = "//kobo.rakuten.co.jp/static/js/s_kbo_code.js";
                    _body.appendChild(_ele);
                };
                setTimeout(scJS, 600);
            }
            //get item_id, set product view custom event
            var _items, _pageType;
            _items = _D.getElementById('ratShopItem');
            _pageType = _D.getElementById('ratPageType');
            if (_pageType && _pageType.value === "shop_item") {
                _W.s.events = _W.s.apl(_W.s.events, "event18");
                if (_items && _items.value) {
                    _W.s.eVar29 = _items.value;
                }
            }
            mainRequestChk = true;
            //Write Your Code - End
        } catch (e) {
            s.prop73 = "-50";
        }
    };

    SC.reqSiteCatalyst = function() {
        SC.setParameter();
        if (_W != parent) {
            return;
        }
        if (!("performance" in _W)) {
            s.t();
            return "-11";
        }
        var e;
        try {
            e = _W.performance.navigation.type;
        } catch (t) {
            e = "-10";
        }
        if (e != 1) {
            s.t();
        }
        return 1;
    };
    SC.addEvent(_W, "load", SC.reqSiteCatalyst);
    //SC.addEvent ( _W,"load", SC.reqProp18);
    //
    var getLayoutInfo = function() {
        return _D.getElementsByName("viewport").length ? "SP" : "PC";
    };
    var getNormalize = function(str) {
        return str.replace(/[\#\.]+/g, "/").replace(/[^0-9A-Za-z\/\-]+/g, "").substring(0, 10);
    };

    SC.tryjQuery = function() {
        if (typeof jQuery == "undefined") {
            return;
        } else {
            $ = jQuery;
            SC.bindAjaxFunction = function() {
                try {
                    var ajaxbkm = $('.addbkm').length;
                    var ajaxshopbkm = $('.addShopBkm').length;
                    if (ajaxbkm !== 0) {
                        $(".addbkm").trackingSelectorId();
                    } else {
                        $(".bkm").trackingSelectorId();
                    }
                    if (ajaxshopbkm !== 0) {
                        $(".addShopBkm").trackingSelectorId();
                    } else {
                        $(".shopBkm").trackingSelectorId();
                    }
                } catch (e) {
                    return -1;
                }
            };

            $.fn.trackingSelectorId = function(option) {
                try {
                    var domain = _L.hostname.replace(".rakuten.co.jp", "");
                    var layout;
                    if (typeof sc_layout != "undefined") {
                        layout = sc_layout;
                    }
                    if (!layout) {
                        layout = getLayoutInfo();
                    }
                    var page = "/" + _L.pathname.split("/")[1];
                    var className = this.className;
                    if (!className) {
                        className = "top";
                    }
                    var cnt = 0;
                    var opt;
                    if (option == 1 || option == '1') {
                        opt = function(tag) {
                            var _t = $(tag).attr("id");
                            if (!_t) {
                                return "null";
                            }
                            return getNormalize(_t);
                        };
                    } else if (typeof option == "string") {
                        opt = function() {
                            return getNormalize(option);
                        };
                    } else {
                        opt = function() {
                            return ++cnt;
                        };
                    }
                    $(this).each(function() {
                        var temp = opt(this);
                        $(this).click(function() {
                            var className = this.className;
                            var bmkInfo = domain + "_" + layout + "_" + page + "_" + className + "_" + temp;
                            var s = s_gi(s_account);
                            s.linkTrackVars = "events,prop10";
                            s.linkTrackEvents = "event35";
                            s.prop10 = bmkInfo;
                            s.events = "event35";
                            s.tl(this, 'o', "bookmark");
                        });
                    });
                } catch (e) {
                    return -1;
                }
            };
            if (document.readyState === "complete") {
                SC.bindAjaxFunction();
            } else {
                SC.addEvent(_W, "load", SC.bindAjaxFunction);

            }
        }
    };

    var $;
    if (typeof jQuery == 'undefined') {
        SC.addEvent(_W, "load", SC.tryjQuery);
    } else {
        $ = jQuery;
        SC.tryjQuery();

    }
    SC.addJavaScript = function() {
        //Write Your Code - Start
        var ele1Parent, ele2Parent, ele1, ele2, ele3, ele4, customClick1, customClick2, customClick3, customClick4;
        //SP - "big" & "small" button clicks
        if (_D.getElementsByClassName) {
            ele1Parent = _D.getElementsByClassName('itemDetailTxtChangeL');
            if (ele1Parent.length) {
                ele1 = ele1Parent[0].getElementsByTagName("A")[0];
                if (ele1) {
                    ele1.style.cursor = 'pointer';
                    customClick1 = function() {
                        if (ele1Parent[0].className.indexOf('onBtn') > -1) {
                            return;
                        }
                        _W.SC.sendSTL({
                            'prop14': _W.s.pageName + ':text_big'
                        });
                        SC.removeEvent(ele1, 'click', customClick1);
                    };
                    SC.addEvent(ele1, 'click', customClick1);
                }
            }

            ele2Parent = _D.getElementsByClassName('itemDetailTxtChangeS');
            if (ele2Parent.length) {
                ele2 = ele2Parent[0].getElementsByTagName("A")[0];
                if (ele2) {
                    ele2.style.cursor = 'pointer';
                    customClick2 = function() {
                        if (ele2Parent[0].className.indexOf('onBtn') > -1) {
                            return;
                        }
                        _W.SC.sendSTL({
                            'prop14': _W.s.pageName + ':text_small'
                        });
                        SC.removeEvent(ele2, 'click', customClick2);
                    };
                    SC.addEvent(ele2, 'click', customClick2);
                }
            }
        }
        var _eventToListen = (SC.layoutInfo() === 'PC') ? 'click' : 'touchend';
        //SP - "scroll to top" button
        ele3 = _D.getElementById('scrollToTop');
        if (ele3) {
            ele3.style.cursor = 'pointer';
            customClick3 = function() {
                _W.SC.sendSTL({
                    'prop14': _W.s.pageName + ':toTopButton'
                });
                SC.removeEvent(ele3, _eventToListen, customClick3);
            };
            SC.addEvent(ele3, _eventToListen, customClick3);
        }
        //SP - "to cart" button
        ele4 = _D.getElementById('scrollUp');
        if (ele4) {
            ele4.style.cursor = 'pointer';
            customClick4 = function() {
                var data = (_eventToListen === 'click')? {'prop14': _W.s.prop9 + '_on'} : {'prop14': _W.s.pageName + '_toCartButtton'};
                _W.SC.sendSTL(data);
                SC.removeEvent(ele4, _eventToListen, customClick4);
            };
            SC.addEvent(ele4, _eventToListen, customClick4);
        }
    };

    var rnkPartsAjax = ""; // added 0203
    _W.scAjaxRequestc18 = function(c18) {
        try {

            if (c18) {
                rnkParts = "_1";
            } else {
                rnkParts = "_0";
            }
            rnkPartsAjax = rnkParts;
            if (mainRequestChk === true && subRequestChk === false) {
                //var s=s_gi(s_account);
                s.linkTrackVars = 'prop18';
                s.prop18 = s.prop9 + rnkPartsAjax;
                s.tl(this, 'o', 'Shop:Item');
            }
        } catch (e) {
            return;
        }
    };

    //item plugin for event test
    _W.SC = {};
    _W.SC.sendSTL = function(o, pev2, linktype) {
        try {
            var eVarRgx = /eVar[3][0-9]/g,
                propRgx = /prop[1][0-9]/g,
                s = s_gi(s_account),
                parameter;
            s.linkTrackVars = 'None';
            s.trackExternalLinks = false;
            var overrideGVS = s.getVisitStart;
            //override v51 logic to avoid error when scid contains we_
            s.getVisitStart = function() {
                return false;
            };
            for (parameter in o) {
                if (o.hasOwnProperty(parameter)) {
                    if (parameter.search(eVarRgx) > -1 || parameter.search(propRgx) > -1) {
                        if (s.linkTrackVars === 'None') {
                            s.linkTrackVars = parameter;
                        } else {
                            s.linkTrackVars += ',' + parameter;
                        }
                        s[parameter] = o[parameter];
                    }
                }
            }
            pev2 = pev2 || 'IchibaTop_CustomSTL';
            linktype = linktype || 'o';
            s.tl(this, linktype, pev2);
            s.linkTrackVars = 'None';
            s.getVisitStart = overrideGVS;
        } catch (e) {
            return;
        }
    };
    //setTimeout( _W.scAjaxRequestc18(), 3000)

    _W.scAjaxRequest = function(v26, c9, c10, c36) {
        var s = s_gi(s_account);
        s.linkTrackVars = 'eVar26,prop9,prop10,prop36';
        s.eVar26 = v26;
        s.prop9 = c9;
        s.prop10 = c10;
        s.prop36 = c36;

        s.tl(this, 'o', 'Shop:Item');
    };
    //} catch (e) {
    //    return;
    //}
    SC.addEvent(_W, 'load', SC.addJavaScript);
}(window, document, location, navigator));
//Template Ver0.991 beta Designed by SeiichiTakeda. -->
