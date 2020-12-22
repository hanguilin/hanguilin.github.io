(function ($) {
  "use strict";

  var fn = {
    showMenu: function () {
      $(".menu").fadeIn(300);
      $("body").addClass("lock-screen");
      fn.hideFab();
    },
    hideMenu: function () {
      $(".menu").fadeOut(300);
      $("body").removeClass("lock-screen");
    },
    activeFab: function () {
      $(".fab-up").addClass("fab-up-active");
      $(".fab-plus").addClass("fab-plus-active");
      $(".fab-daovoice").addClass("fab-daovoice-active");
      $(".fab-tencent-chao").addClass("fab-tencent-chao-active");
    },
    freezeFab: function () {
      $(".fab-up").removeClass("fab-up-active");
      $(".fab-plus").removeClass("fab-plus-active");
      $(".fab-daovoice").removeClass("fab-daovoice-active");
      $(".fab-tencent-chao").removeClass("fab-tencent-chao-active");
    },
    showFab: function () {
      $(".fab").removeClass("fab-hide").addClass("fab-show");
    },
    hideFab: function () {
      $(".fab").addClass("fab-hide").removeClass("fab-show");
    },
    scroolFab: function () {
      var height = $(window).height();
      var scrollTop = $(window).scrollTop();
      if (scrollTop > height) {
        fn.showFab();
      } else {
        fn.freezeFab();
        fn.hideFab();
      }
    },
    scroolToTop: function () {
      $('body,html').animate({
        scrollTop: '0px'
      }, 800);
    },
    navbar: {
      mobile: function () {
        $(".han-navbar").addClass("out");
        $(window).on("scroll", ZHAOO.utils.throttle(function () {
          var before = $(this).scrollTop();
          $(window).on("scroll", function () {
            var after = $(this).scrollTop();
            if (before > after && after > 300) {
              $(".han-navbar").removeClass("out");
            } else if (before < after || after < 300) {
              $(".han-navbar").addClass("out");
            }
            before = after;
          })
        }, 500));
      },
      desktop: function () {
        function center() {
          if ($(window).scrollTop() > 60) {
            $(".han-navbar .center").addClass("in");
          } else {
            $(".han-navbar .center").removeClass("in");
          }
        }
        center();
        $(window).on("scroll", ZHAOO.utils.throttle(function () {
          center();
          var before = $(this).scrollTop();
          $(window).on("scroll", function () {
            var after = $(this).scrollTop();
            if (before > after) {
              $(".han-navbar").removeClass("out");
            } else if (before < after) {
              $(".han-navbar").addClass("out");
            }
            before = after;
          })
        }, 500));
      },
    },
    motto: function (elem) {
      if (CONFIG.preview.motto.jinrishici) {
        jinrishici && jinrishici.load(function (result) {
          var data = result.data;
          if (!data || !data.content) {
            return;
          }
          $('#' + elem).text(data.content);
        });
      } else if (CONFIG.preview.motto.api) {
        $.get(CONFIG.preview.motto.api, function (data) {
          data && $('#' + elem).text(data);
        });
      } else {
        var boxObj = document.getElementById(elem);
        if (boxObj) {
          new Typed(boxObj, {
            // 注意：输出的可以是标签，将标签当节点运行。比如下面的h2
            strings: [CONFIG.preview.motto.default],
            typeSpeed: 100, // 速度
            startDelay: 500,
            cursorChar: "_"
          });
        }
      }

    },
    background: function () {
      if (CONFIG.preview.background.api) {
        $(".preview-image").css("background-image", "url(" + CONFIG.preview.background.api + ")");
      }
    }
  }

  var color_mode = {
    $rootElement: $("html"),
    lightColorToggle: "#light-color-toggle",
    darkColorToggle: "#dark-color-toggle",
    toggleElement: '.color-toggle',
    $highlightElement: $('[name=highlight-style]'),
    modeStorageKey: 'color-mode',
    mediaQueryStorageKey: 'color-mode-media-query',
    htmlAttribute: 'color-mode',
    toggleAttribute: 'color-toggle',

    getMediaQuery: function () {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    getModeStorage: function () {
      return localStorage.getItem(color_mode.modeStorageKey);
    },

    setModeStorage: function (mode) {
      localStorage.setItem(color_mode.modeStorageKey, mode);
    },

    getMediaQueryStorage: function () {
      return localStorage.getItem(color_mode.mediaQueryStorageKey);
    },

    setMediaQueryStorage: function (mode) {
      localStorage.setItem(color_mode.mediaQueryStorageKey, mode);
    },

    setColorMode: function (mode) {
      color_mode.$rootElement.attr(color_mode.htmlAttribute, mode)
      color_mode.setModeStorage(mode);
    },

    setIcon: function (mode) {
      if (!$(color_mode.toggleElement)) return;
      var addIconName = mode === 'light' ? 'iconmoono' : 'iconsuno';
      var removeIconName = mode === 'light' ? 'iconsuno' : 'iconmoono';
      $(color_mode.toggleElement).removeClass(removeIconName)
      $(color_mode.toggleElement).addClass(addIconName)
      $(color_mode.toggleElement).attr(color_mode.toggleAttribute, mode);
    },

    setHighlightStyle: function (mode) {
      for (var i = 0; i < color_mode.$highlightElement.length; i++) {
        var $item = color_mode.$highlightElement.eq(i)
        $item.attr('disabled', !($item.attr('mode') === mode));
      }
    },

    loadColorMode: function (mode) {
      var mode = mode || color_mode.getModeStorage() || color_mode.getMediaQuery();
      if (color_mode.getMediaQuery() === color_mode.getMediaQueryStorage()) {
        mode = color_mode.getModeStorage();
      } else {
        mode = color_mode.getMediaQuery();
        color_mode.setMediaQueryStorage(mode);
      }

      action.previewChange(mode)
      color_mode.setColorMode(mode);
      color_mode.setIcon(mode);
      color_mode.setHighlightStyle(mode);
    },

    switchColorMode: function () {
      $(".color-toggle").click(function () {
        danmu.closeDanmu()
        color_mode.modeBindFun($(this))
        danmu.startDanmuIfOpen()
      })
    },
    modeBindFun: function (e) {
      color_mode.clearMotto()
      var mode = e.attr(color_mode.toggleAttribute) === 'light' ? 'dark' : 'light';
      action.previewChange(mode)
      color_mode.setColorMode(mode);
      color_mode.setIcon(mode);
      color_mode.setHighlightStyle(mode);
    },
    clearMotto() {
      $(".preview-motto").empty()
      $(".typed-cursor").remove()
    }
  }

  var danmu = {
    initDanmu: function () {
      if (CONFIG.leancloud.enable && CONFIG.leancloud.bulletChatEnable) {
        var current = localStorage.getItem('color-mode') || 'light'
        var active = localStorage.getItem(`danmu_${current}_active`)
        var $preview = $(`#${current}-preview`)
        var $danmuToggle = $preview.find('.danmu-toggle')
        $danmuToggle.removeClass('icondanmu')
        $danmuToggle.removeClass('icondanmu-close')
        $danmuToggle.addClass('icondanmu' + (active === 'true' ? '-close' : ''))
        if (active === 'true') {
          var $elem = $(`#${current}-bulletchat-screen`)
          getBulletChatList($elem);
        }
      }
    },
    toggleDanmu: function () {
      $('.danmu-toggle').click(function () {
        var theme = localStorage.getItem('color-mode') || 'light'
        var $bulletchatScreen = $(`#${theme}-bulletchat-screen`)
        if ($bulletchatScreen.hasClass('hide')) {
          $bulletchatScreen.removeClass('hide')
          localStorage.setItem(`danmu_${theme}_active`, 'true')
          // 图标切换
          $(this).removeClass('icondanmu')
          $(this).addClass('icondanmu-close')
          getBulletChatList($bulletchatScreen)
        } else {
          $bulletchatScreen.addClass('hide')
          // 图标切换
          $(this).addClass('icondanmu')
          $(this).removeClass('icondanmu-close')
          localStorage.setItem(`danmu_${theme}_active`, 'false')
        }
      })
    },
    // 切换之前的操作
    closeDanmu: function ($color_toggle) {
      var theme = localStorage.getItem('color-mode') || 'light'
      var $bulletchatScreen = $(`#${theme}-bulletchat-screen`)
      if ($bulletchatScreen.hasClass('hide')) {
        localStorage.setItem(`danmu_${theme}_active`, 'false')
      } else {
        $bulletchatScreen.addClass('hide')
        localStorage.setItem(`danmu_${theme}_active`, 'true')
      }
    },
    // 切换之后的操作
    startDanmuIfOpen: function () {
      var toggleTo = localStorage.getItem('color-mode') || 'light'
      var isActive = localStorage.getItem(`danmu_${toggleTo}_active`)
      var $preview = $(`#${toggleTo}-preview`)
      var $danmuToggle = $preview.find('.danmu-toggle')
      $danmuToggle.removeClass('icondanmu')
      $danmuToggle.removeClass('icondanmu-close')
      $danmuToggle.addClass('icondanmu' + (isActive === 'true' ? '-close' : ''))
      var $bulletchatScreen = $(`#${toggleTo}-bulletchat-screen`)
      if (isActive === 'true') {
        getBulletChatList($bulletchatScreen)
      }
    }
  }

  var action = {
    showConsoleInfo: function () {
      console.log("%c Github %c", "background:#333333; color:#ffffff", "", "https://github.com/hanguilin");
      console.log("%c CSDN %c", "background:#333333; color:#ffffff", "", "https://blog.csdn.net/qq_37171817");
      console.log("%c 博客园 %c", "background:#333333; color:#ffffff", "", "https://www.cnblogs.com/yl-space/");
      console.log("%c 掘金 %c", "background:#333333; color:#ffffff", "", "https://juejin.im/user/5d3e80235188253c143b92d4/posts");
      console.log("%c 简书 %c", "background:#333333; color:#ffffff", "", "https://www.jianshu.com/u/58b4076f1f1a");
    },
    focusSearch: function () {
      setTimeout(function () {
        $('.preview-search').focus()
      }, 0)
    },
    listenSearch: function () {
      $('.preview-search').keypress(function (even) {
        if (even.which == 13) {
          ZHAOO.zui.notification({ title: '功能开发中', content: '搜索功能暂未开放，敬请期待' })
        }
      });
    },
    smoothScroll: function () {
      // a[href *=#], area[href *=#]
      $(".smooth-scroll, .toc-link").click(function () {
        if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
          var $target = $(decodeURIComponent(this.hash));
          $target = $target.length && $target || $("[name=" + this.hash.slice(1) + "]");
          if ($target.length) {
            var targetOffset = $target.offset().top;
            $("html,body").animate({
              scrollTop: targetOffset
            }, 500);
            location.hash = this.hash;
            return false;
          }
        }
      });
    },
    loading: function () {
      $(".loading").delay(500).fadeOut(300);
      $("body").removeClass("lock-screen");
    },
    fab: function () {
      $(".fab-plus").on("click", function () {
        if ($(this).hasClass("fab-plus-active")) {
          fn.freezeFab();
        } else {
          fn.activeFab();
        }
      });
      $(".fab-daovoice").on("click", function () {
        daovoice('openMessages');
      });
      $(".fab-up, .fab-daovoice, fab-tencent-chao").on("click", function () {
        fn.freezeFab();
      });
      if (CONFIG.fab.always_show) {
        fn.showFab();
      } else {
        $(window).scroll(fn.scroolFab);
      }
    },
    menu: function () {
      $(".menu-close").on("click", function () {
        fn.hideMenu();
        $(".han-navbar").removeClass("out");
      });
      $(".menu-wrap").on("click", function () {
        fn.hideMenu();
        $(".han-navbar").removeClass("out");
      })
    },
    scroolToTop: function () {
      $(".fab-up").on("click", function () {
        fn.scroolToTop();
      })
    },
    fancybox: function () {
      $(".fancybox").fancybox();
      $(".article .content img").each(function () {
        var e = document.createElement("a");
        $(e).attr("data-fancybox", "images");
        $(e).attr("href", $(this).attr("src"));
        $(this).wrap(e);
      });
    },
    pjax: function () {
      $(function () {
        $(document).pjax("a:not(.menu *)", '#main', {
          fragment: '#main',
          timeout: 6000
        });
      });
      $(document).on('pjax:complete', function () {
        CONFIG.fancybox && action.fancybox();
      });
    },
    donate: function () {
      $(".donate .icon").on("mouseover", function () {
        $("#qrcode-donate").show();
      });
      $(".donate .icon").children("a").on("mouseover", function () {
        $("#qrcode-donate img").attr('src', eval('CONFIG.donate.' + $(this).attr('id')))
      });
      $(".donate .icon").on("mouseout", function () {
        $("#qrcode-donate").hide();
      });
    },
    lazyload: function () {
      $("img.lazyload").lazyload({
        effect: "fadeIn",
        threshold: 200,
      });
    },
    fixLazyloadFancybox: function () {
      $(document).find('.article img[data-original]').each(function () {
        $(this).parent().attr("href", $(this).attr("data-original"));
      });
    },
    carrier: function () {
      $(".j-carrier-btn").on("click", ZHAOO.utils.throttle(function () {
        $(".j-carrier-data").select();
        document.execCommand("Copy");
        ZHAOO.zui.message({ text: '已复制到剪切板', type: 'success' });
      }, 1000));
    },
    navbar: function () {
      $(window).resize(ZHAOO.utils.throttle(function () {
        ZHAOO.utils.isDesktop() && fn.navbar.desktop();
        (ZHAOO.utils.isMobile() && !CONFIG.isHome) && fn.navbar.mobile();
      }, 1000)).resize();
      $(".j-navbar-menu").on("click", function () {
        fn.showMenu();
        $(".han-navbar").addClass("out");
        $(".qrcode").fadeOut(300);
      });
      $(".j-navbar-qrcode").on("click", function () {
        var $qrcode_navbar = $(this).parents('.left').siblings('.qrcode-navbar')
        if ($qrcode_navbar.is(":hidden")) {
          $qrcode_navbar.fadeIn(300);
        } else {
          $qrcode_navbar.fadeOut(300);
        }
      });
    },
    qrcode: function () {
      if (CONFIG.qrcode.type === 'url') {
        $(".qrcode-navbar").qrcode({
          text: window.location.href,
          width: 150,
          height: 150
        });
      } else if (CONFIG.qrcode.type === 'image') {
        $(".qrcode-navbar").append('<img src="' + CONFIG.qrcode.image + '" alt="qrcode" />');
      }
    },
    toc: function () {
      var current = [];
      var titleList = new Map();
      $("article .content h1,h2,h3,h4,h5,h6").each(function () {
        var title = $(this).attr("id");
        var height = $(this).offset().top;
        titleList.set(height, title);
      });
      $(window).on("scroll", f);
      function f() {
        var height = $(this).scrollTop() || $(window).scrollTop();
        for (var item of titleList) {
          if (item[0] >= height) {
            current = item;
            break;
          }
        }
        $(".toc-link").removeClass("active");
        $(".toc-link[href='#" + encodeURI(current[1]) + "']").addClass("active");
      };
      f();
    },
    scrollbar: function () {
      var totalH = $(document).height();
      var clientH = $(window).height();
      $(window).on("scroll", f);
      function f() {
        var validH = totalH - clientH;
        var scrollH = $(document).scrollTop();
        var height = scrollH / validH * 100;
        $(".j-scrollbar-current").css("height", height + '%');
      }
      f();
      $(".j-scrollbar").mousedown(function (e) {
        var scrollH = e.offsetY * totalH / 100;
        $("html,body").animate({ scrollTop: scrollH }, 300);
        $(document).mousemove(function (e) {
          var scrollH = (1 - ((clientH - e.clientY) / clientH)) * totalH;
          $("html,body").scrollTop(scrollH);
          $("html,body").css({ "user-select": "none", "cursor": "move" });
        });
        $(document).mouseup(function () {
          $(document).off('mousemove');
          $("html,body").css({ "user-select": "auto", "cursor": "default" });
        });
      });
    },
    notification: function () {
      if (!CONFIG.notification.list) return;
      var page_white_list = CONFIG.notification.page_white_list && JSON.parse(CONFIG.notification.page_white_list);
      var page_black_list = CONFIG.notification.page_black_list && JSON.parse(CONFIG.notification.page_black_list);
      var path = window.location.pathname;
      if ((page_white_list && page_white_list.indexOf(path) < 0) || (page_black_list && page_black_list.indexOf(path) >= 0)) return;
      var delay = CONFIG.notification.delay;
      var list = JSON.parse(CONFIG.notification.list);
      var playList = list.filter(function (item) {
        return item.enable && ZHAOO.utils.isDuringDate(item.startTime, item.endTime) && item;
      });
      playList.forEach(function (item) {
        ZHAOO.zui.notification({ title: item.title, content: item.content, delay: delay });
      });
    },
    initLightPreview: function () {
      $("#dark-preview").css('display', 'none')
      $("#light-preview").css('display', 'block')

      fn.background();
      fn.motto('light-motto');
    },
    initDarkPreview: function () {
      $("#light-preview").css('display', 'none')
      $("#dark-preview").css('display', 'block')

      var iframeUrlArr = []
      for (var i = 1; i <= 12; i++) {
        iframeUrlArr.push(`/html/a${i}.html`)
      }
      var index = localStorage.getItem('frame_index') || 0
      if (index >= iframeUrlArr.length) {
        index = 0
      } else {
        index++
      }
      $("#dark-preview-frame").attr('src', iframeUrlArr[index])
      localStorage.setItem('frame_index', index)
      fn.motto('dark-motto');
    },
    previewChange: function (mode) {
      switch (mode) {
        case 'light':
          action.initLightPreview()
          break
        case 'dark':
          action.initDarkPreview()
          break
        default:
          action.initLightPreview()
      }
    },
    hintSequence: function () {

      if (!check.isPreview()) {
        return
      }

      // 当前用户是否被引导过
      var beGuide = localStorage.getItem('be-guide')
      if (beGuide === 'true') {
        return
      }

      // 获取当前主题
      var mode = localStorage.getItem('color-mode') || 'light'

      // 引导步骤
      var enjoyhint_script_steps = []
      // 引导元素数组
      var guideElemArr = []

      var j_navbar_qrcode_elem = `#${mode}-j-navbar-qrcode`
      var color_toggle_elem = `#${mode}-color-toggle`
      var danmu_toggle_elem = `#${mode}-danmu-toggle`
      var j_navbar_menu_elem = `#${mode}-j-navbar-menu`
      var scroll_elem = `#${mode}-iconMouse`

      var enjoyhint_instance = new EnjoyHint({
        onEnd: function () {
          // 步骤结束时触发界面下滑
          $(scroll_elem).trigger('click')
        }
      });

      // 将所有引导元素装入数组
      guideElemArr.push(j_navbar_qrcode_elem, color_toggle_elem, danmu_toggle_elem, j_navbar_menu_elem, scroll_elem)
      guideElemArr.forEach(e => {
        // 被引导元素点击时，关闭新手引导
        $(e).click(function () {
          action.removeSequence()
        })
      })

      var j_navbar_qrcode_step = {}
      var j_navbar_qrcode = `next ${j_navbar_qrcode_elem}`
      j_navbar_qrcode_step[j_navbar_qrcode] = '欢迎来到我博客，这里是我的交友方式~'
      j_navbar_qrcode_step['skipButton'] = { className: "mySkip", text: "狠心跳过" }
      j_navbar_qrcode_step['nextButton'] = { className: "myNext", text: "好的~" }
      enjoyhint_script_steps.push(j_navbar_qrcode_step)

      var color_toggle_step = {}
      var color_toggle = `next ${color_toggle_elem}`
      color_toggle_step[color_toggle] = '这里可以切换主题~'
      color_toggle_step['skipButton'] = { className: "mySkip", text: "狠心跳过" }
      color_toggle_step['nextButton'] = { className: "myNext", text: "好的~" }
      enjoyhint_script_steps.push(color_toggle_step)


      var danmu_toggle_step = {}
      var danmu_toggle = `next ${danmu_toggle_elem}`
      danmu_toggle_step[danmu_toggle] = '这里可以切换显示弹幕~'
      danmu_toggle_step['skipButton'] = { className: "mySkip", text: "狠心跳过" }
      danmu_toggle_step['nextButton'] = { className: "myNext", text: "好的~" }
      enjoyhint_script_steps.push(danmu_toggle_step)


      var j_navbar_menu_step = {}
      var j_navbar_menu = `next ${j_navbar_menu_elem}`
      j_navbar_menu_step[j_navbar_menu] = '这里是主菜单~'
      j_navbar_menu_step['skipButton'] = { className: "mySkip", text: "狠心跳过" }
      j_navbar_menu_step['nextButton'] = { className: "myNext", text: "好的~" }
      enjoyhint_script_steps.push(j_navbar_menu_step)


      var scroll_step = {}
      var scroll = `next ${scroll_elem}`
      scroll_step[scroll] = '下滑开始你的旅行吧~'
      scroll_step['shape'] = 'circle'
      scroll_step['radius'] = 70
      scroll_step['showSkip'] = false
      scroll_step['nextButton'] = { className: `${mode}-scrollMouse`, text: "comeon!" }
      enjoyhint_script_steps.push(scroll_step)

      enjoyhint_instance.set(enjoyhint_script_steps);
      enjoyhint_instance.run();
      localStorage.setItem('be-guide', 'true')
    },
    removeSequence: function () {
      if ($('.enjoyhint').is(':visible')) {
        $('.enjoyhint').remove()
        $('body').css('overflow', 'auto')
      }
    }
  }

  var check = {
    isPreview: function () {
      // 获取当前主题
      var mode = localStorage.getItem('color-mode') || 'light'
      var $preview = $(`#${mode}-preview`)
      // 判断页面是否首页
      if ($preview.is(':visible')) {
        var previewToTop = $(`#${mode}-preview`).offset().top - $(window).scrollTop()
        // 判断预览页位于顶部
        if (previewToTop == 0) {
          return true
        }
      }
      return false
    }
  }

  $(function () {
    action.showConsoleInfo();
    action.smoothScroll();
    action.loading();
    action.fab();
    action.navbar();
    action.menu();
    action.scroolToTop();
    action.focusSearch();
    action.listenSearch();

    danmu.initDanmu();
    danmu.toggleDanmu();

    color_mode.loadColorMode();
    color_mode.switchColorMode();

    // 置于switchColorMode方法之后
    action.hintSequence();

    CONFIG.fancybox && action.fancybox();
    CONFIG.pjax && action.pjax();
    CONFIG.lazyload.enable && action.lazyload();
    CONFIG.donate.enable && action.donate();
    (CONFIG.lazyload && CONFIG.fancybox) && action.fixLazyloadFancybox();
    CONFIG.carrier.enable && action.carrier();
    CONFIG.qrcode.enable && action.qrcode();
    CONFIG.toc.enable && action.toc();
    CONFIG.scrollbar.model === 'simple' && action.scrollbar();
    CONFIG.notification.enable && action.notification();
  });

})(jQuery);
