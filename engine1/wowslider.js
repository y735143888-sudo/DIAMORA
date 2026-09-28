(function(window,document){
  'use strict';
  function WowSlider(container, options){
    this.el=container; this.options=options||{};
    this.slides=[].slice.call(container.querySelectorAll('.ws_images li'));
    this.bullets=[].slice.call(container.querySelectorAll('.ws_bullets a'));
    this.index=0; this.timer=null; this.delay=this.options.delay||5000; this.paused=false;
    this.init();
  }
  WowSlider.prototype.init=function(){
    var self=this;
    if(!this.slides.length)return;
    this.slides.forEach(function(slide,i){slide.classList.toggle('ws_current',i===0);});
    this.bullets.forEach(function(b,i){b.classList.toggle('ws_sel',i===0);b.addEventListener('click',function(e){e.preventDefault();self.go(i);});});
    var prev=this.el.querySelector('.ws_prev'),next=this.el.querySelector('.ws_next');
    if(prev)prev.addEventListener('click',function(){self.go(self.index-1);self.restart();});
    if(next)next.addEventListener('click',function(){self.go(self.index+1);self.restart();});
    this.el.addEventListener('mouseenter',function(){self.pause();});
    this.el.addEventListener('mouseleave',function(){self.resume();});
    this.start();
  };
  WowSlider.prototype.go=function(n){
    var count=this.slides.length;if(!count)return;
    this.index=(n%count+count)%count;
    this.slides.forEach(function(slide,i){slide.classList.toggle('ws_current',i===this.index);},this);
    this.bullets.forEach(function(b,i){b.classList.toggle('ws_sel',i===this.index);},this);
  };
  WowSlider.prototype.start=function(){var self=this;clearInterval(this.timer);this.timer=setInterval(function(){if(!self.paused)self.go(self.index+1);},this.delay);};
  WowSlider.prototype.pause=function(){this.paused=true;};
  WowSlider.prototype.resume=function(){this.paused=false;};
  WowSlider.prototype.restart=function(){this.start();};
  window.WowSlider=WowSlider;
})(window,document);
