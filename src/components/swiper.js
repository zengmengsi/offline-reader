/**
 * Created by zeng on 2017/7/27.
 */
var JSwiper = function (selector,options) {
  this.el= typeof selector == 'string'?document.querySelector(selector):selector;
  this.wrapper = this.el.children[0];
  this.index = 0;
  this.count = options.len||this.wrapper.querySelectorAll('.swiper-slide').length;
  this.roadway = this.el.offsetWidth;
  this.afterSlide = options.afterSlide;
  this.bindEvent();
};

JSwiper.prototype = {
  bindEvent:function () {
    var index = this.index;
    var count = this.count;
//              console.log(count,'count')
    var el = this.el;
    var wrapper = this.el.children[0];
    var roadway =this.roadway;
    var startx,movex,spanx,endx=0;

    el.addEventListener('touchstart',function (e) {
      spanx = 0;
      wrapper.classList.remove('tst');
      endx=-index*this.roadway;
      startx = e.touches[0].pageX;
    }.bind(this));
    el.addEventListener('touchmove',function (e) {
      movex = e.touches[0].pageX;

      spanx =movex-startx;

      if(index==0 || index == count-1) return;

      wrapper.style.transform = 'translate3d('+ (endx + spanx)+'px,0,0)'

    });
    el.addEventListener('touchend',function () {
      wrapper.classList.add('tst');

      if(Math.abs(spanx)>roadway/3){

        if(spanx>0){
          //去往上一帧
          console.log('去往上一帧')
//                    window.screenTop=0;
          index--;
          if(index<=0) index=0
        }
        if(spanx<0){
          //去下一帧
          console.log('去往下一帧')
//                    window.screenTop=0;
          index++;
          if(index>=count-1) index=count-1
        }
      }
      this.index = index;
      this.moveTo(index);
    }.bind(this))
  },
  moveTo:function (index) {
    if(index===undefined){return}
    this.wrapper.style.transform='translate3d('+(-index*this.roadway)+'px,0,0)'
    this.afterSlide(index);
  }
};

export default JSwiper;
