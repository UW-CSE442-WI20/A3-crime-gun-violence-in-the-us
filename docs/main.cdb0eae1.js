parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"FVPG":[function(require,module,exports) {
!function(e){skel.breakpoints({xlarge:"(max-width: 1680px)",large:"(max-width: 1280px)",medium:"(max-width: 980px)",small:"(max-width: 736px)",xsmall:"(max-width: 480px)"}),e(function(){var a=e(window),i=e("body");i.addClass("is-loading"),a.on("load",function(){window.setTimeout(function(){i.removeClass("is-loading")},100)}),e("form").placeholder(),skel.on("+medium -medium",function(){e.prioritize(".important\\28 medium\\29",skel.breakpoint("medium").active)}),e('<a href="#navPanel" class="navPanelToggle"></a>').appendTo(i),e('<div id="navPanel">'+e("#nav").html()+'<a href="#navPanel" class="close"></a></div>').appendTo(i).panel({delay:500,hideOnClick:!0,hideOnSwipe:!0,resetScroll:!0,resetForms:!0,side:"right"}),"wp"==skel.vars.os&&skel.vars.osVersion<10&&e("#navPanel").css("transition","none")})}(jQuery);
},{}]},{},["FVPG"], null)
//# sourceMappingURL=/main.cdb0eae1.js.map