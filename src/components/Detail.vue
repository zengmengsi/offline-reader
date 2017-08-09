<template>
  <div>
    <div class="swiper-container swiper1">
      <div class="swiper-wrapper tst" v-on:click="showHidden">
        <div class="swiper-slide" v-for="it in pagelist" v-html="it.page" v-show="!!it.page"></div>
      </div>
    </div>
    <div :class="(footShow)?'de-footer foots':'de-footer footh'">
      <div @click='$router.back(-1)'><i class="iconfont icon-fanhuiqua"></i></div>
      <div @click="showContents"><i class="iconfont icon-mulu"></i></div>
      <div @click="fovBook"><i :class="isfav?'iconfont icon-shoucang21 fav-sel':'iconfont icon-shoucang1'"></i></div>
      <div @click="buildepub"><i class="iconfont icon-xiazai"></i></div>
      <div class="progress">{{curPage}}/{{pagelist.length}}</div>
    </div>
    <div class="de-style" v-show="styleShow">
        <div class="line"><div class="style-na">背景色</div><div class="style-va"><span @click="setStyle('color','red')">红</span><span>换</span><span>空</span></div></div>
      <div class="line"><div class="style-na">字体大小</div><div class="style-va"><span @click="setStyle('font','18px')">大</span><span @click="setStyle('font','16px')">中</span><span @click="setStyle('font','12px')">小</span></div></div>
      <div class="line"><div class="style-na">行字距</div><div class="style-va"><span @click="setStyle('line','1.8')">窄</span><span>适中</span><span>宽</span></div></div>
    </div>
    <div class="mulu" v-show="muluShow">
      <div class="muluheader"><i class="iconfont icon-fanhuiqua" @click="showContents"></i><span @click="showContents"> 取消</span>
      </div>
      <template v-for="(it,index) in mululist">
        <div class="column" v-show="(!it.issame)"><p>
          {{it.columns}}</p></div>
        <div class="d-title" @click="goPage(it.startpage)"><span class="tit">{{it.title}}</span><span class="num">{{it.startpage}}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import instance from './common.js'
  import JSwiper from './swiper.js'
  import $ from 'jquery'
  import EpubBuilder from './epubbuilder/EpubBuilder.js'
  import { Toast } from 'mint-ui';
  export default{
    data(){
      return {
        pagelist: [],
        footShow:false,
        styleShow:false,
        curPage: 1,
        temp:'',
        mululist: [{"id": "1798", "columns": "奔跑", "title": "我们为什么奔跑", "startpage": 11, "pageid": "6667"}],
        muluShow: false,
        isfav: false,
        epubdata: {
          ISBN: "isbn",
          author: "zuozhe",
          contentArray: [],
          contributor: "conterbu",
          date: "7-29",
          description: "miaoshu",
          fileName: "filename",
          language: "yuyan",
          publisher: "publisher",
          title: "timu",
          tocArray: []
        },
        lastClickTime:0,
        clickTimer:''
      }
    },
    created(){
      this.getContents();
      this.pageInit();
    },
    mounted(){
    },
    name: 'Detail',
    methods: {
      setStyle:function(name,val){
          switch (name){
            case 'color':document.querySelector('.swiper-slide').parentNode.style.background=val;break;
            case 'font':document.querySelector('.swiper-slide').parentNode.style.fontSize=val;break;
            case 'line':document.querySelector('.swiper-slide').parentNode.style.lineHeight=val;break;
            default:break;
          }
      },
        showHidden(){
            let nowTime=new Date().getTime();
            if(nowTime-this.lastClickTime<400){
                this.lastClickTime=0;
                this.clickTimer&&clearTimeout(this.clickTimer)
              this.styleShow=!this.styleShow;this.footShow=false;

            }else{
                this.lastClickTime=nowTime;
                this.clickTimer=setTimeout(()=>{
                  this.footShow=!this.footShow;this.styleShow=false;
                },400)
            }
        },
      pageInit: function () {
        if (!!localStorage.getItem('fav') && localStorage.getItem('fav').indexOf(this.$route.params.bookname) > -1) {
          //是否收藏
          this.isfav = true;
        }
      },
      swiper: function () {
        var _this = this;
        var j = new JSwiper('.swiper1', {
          afterSlide: function (index) {
            _this.curPage = index + 1;
            if ((index + 2) < _this.pagelist.length && !_this.pagelist[index + 2].page) {
              _this.getPageById(_this.pagelist[index + 2].id, index + 2);
            }
          },
        })
        return j;
      },
      getContents: function () {
        //issue/getContents/?issueid=248
        var _this = this;
        //获取目录
        instance.get('book/getContents', {
          params: {
            issueid: this.$route.params.id
          }
        }).then(function (res) {
          res.data.sort(_this.getSortFun('asc', 'startpage'))
          res.data[0].issame=false;
          for(var i=1;i<res.data.length;i++){
            res.data[i].issame=(res.data[i].columns==res.data[i-1].columns)?true:false;
          }
          _this.mululist = res.data;
          console.log(_this.mululist)

        })
        //获取文章列表
        instance.get('book/getPageList', {
          params: {
            i: this.$route.params.id
          }
        }).then(function (res) {
          res.data.sort(_this.getSortFun('asc', 'sequence'))
          _this.pagelist = res.data;
        }).then(function () {
          _this.getPageById(_this.pagelist[0].id, 0)
          _this.getPageById(_this.pagelist[1].id, 1)
          _this.swiper();
        })
      },
      getPageById: function (id, index) {
        var _this = this;
        instance.get('issue/getOnePage', {
          params: {
            pageid: id
          }
        }).then(function (res) {
          res.data=res.data.replace(/assets.propa.cn\/assetsSP/g,"qnbook.propa.cn\/Book")
          _this.$set(_this.pagelist[index], 'page', res.data)
        })
      },
      showContents: function () {
        this.muluShow = !this.muluShow;
      },
      fovBook: function () {
        if (this.isfav) {
          return;
        }
        let it = {};
        it.id = this.$route.params.id;
        it.bookid = this.$route.params.bookid;
        it.bookname = this.$route.params.bookname;
        it.name = this.$route.params.name;
        let fav = [];
        if (localStorage.getItem('fav')) {
          fav = JSON.parse(localStorage.getItem('fav'))
          fav.push(it);
        } else {
          fav.push(it);
        }
        localStorage.setItem('fav', JSON.stringify(fav))
        this.isfav = !this.isfav;
        Toast('收藏成功！');
      },
      getSortFun: function (ord, sortBy) {
        let ordA = (ord == 'asc') ? '>' : '<';
        let sortF = new Function('a', 'b', 'return a.' + sortBy + ordA + 'b.' + sortBy + '?1:-1');
        return sortF;
      },
      goPage: function (indx) {
        this.showContents();
        console.log(indx, 'indx')
        console.log(this.pagelist)
        if ((indx - 2) >= 0 && !this.pagelist[indx - 2].page) {
          this.getPageById(this.pagelist[indx - 2].id, indx - 2);
        }
        console.log((indx) < this.pagelist.length ,!this.pagelist[indx + 1].page)
        if ((indx) < this.pagelist.length && !this.pagelist[indx + 1].page) {
          this.getPageById(this.pagelist[indx + 2].id, indx + 2);
        }
        this.swiper().moveTo(indx - 1);
      },
      buildepub: function () {
        var _this = this;
          Promise.all(this.pagelist.map(function (item,index) {
            if (item.page === undefined) {
              _this.getPageforEpub(item.id).then(function (data) {
                item.page=data
              })
            }
            return item
          })).then(function (ls) {
            _this.pagelist=ls;
            for(let i=0;i<ls.length;i++){
              _this.epubdata.contentArray.push(ls[i].page)
            }
            _this.epubdata.fileName=_this.$route.params.bookname;
            var epub = new EpubBuilder();
            epub.exportToEpub(_this.epubdata)
          }).catch(function (e) {
            console.log(e);
          })

//        var Q=new Promise(function () {
//          for (let i = 0; i < this.pagelist.length; i++) {
//            _this.epubdata.tocArray.push(_this.pagelist[i].id);
//            if (_this.pagelist[i].page !== undefined) {
//              _this.epubdata.contentArray.push(_this.pagelist[i].page);
//            } else {
//              _this.getPageforEpub(_this.pagelist[i].id).then(function (data) {
//                _this.epubdata.contentArray.push(data);
//              })
////            _this.getPageforEpub(_this.pagelist[i].id)
//            }
//          }
//        })
//        this.epubdata.fileName=this.$route.params.bookname;
//        Q.all(this.epubdata).then(function (a) {
//            var epub = new EpubBuilder();
//            epub.exportToEpub(this.epubdata)
//        }
//        )
      },
      getPageforEpub: function (pageid) {
        return new Promise(function (resolve,reject) {
//          var _this = this;
          instance.get('issue/getOnePage', {
            params: {
              pageid: pageid
            }
          }).then(function (res) {
            resolve(res.data)
          })
        })

//          var p =Promise();
//        var _this = this;
//        instance.get('issue/getOnePage', {
//          params: {
//            pageid: pageid
//          }
//        }).then(function (res) {
//          _this.epubdata.contentArray.push(res.data);
//        })
      }
    }
  }
</script>

<style>
  .de-style{
    width: 100%;
    height: 9rem;
    background-color: #ffffff;
    position: fixed;
    overflow: hidden;
    color: #888888;
    border-top: 1px solid #eeeeee;
    bottom: 0px;
    left: 0;
  }
  .de-footer {
    width: 100%;
    /*height: 43px;*/
    background-color: #ffffff;
    position: fixed;
    overflow: hidden;
    color: #888888;
    border-top: 1px solid #eeeeee;
    bottom: 0px;
    left: 0;
    padding-left: 10px;
  }

  .de-footer div {
    float: left;
    width: 38px;
    height: 100%;
    line-height: 43px;
    font-weight: lighter;
    text-align: center;
  }

  .de-footer .iconfont {
    font-size: 22px;
    font-weight: lighter;
  }

  .wid100 {
    width: 100%;
  }

  .mulu {
    background-color: white;
    width: 100%;
    position: absolute;
    backface-visibility: hidden;
    z-index: 70000;
    min-height: 100%;
    top: 0;
  }

  .mulu div {
    width: 100%;
    height: 46px;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
  }

  .muluheader {
    background-color: #52575c;
    color: #ffffff;
    font-size: 18px;
    line-height: 45px;
  }

  .muluheader .iconfont {
    margin-left: 20px;
    margin-right: 20px;
    font-size: 18px;
  }

  .column p {
    font-size: 18px;
    color: #fa8f1d;
    margin: auto 8px;
    line-height: 45px;
    overflow: hidden;
  }

  .d-title .tit {
    color: #777777;
    font-size: 16px;
    float: left;
    width: 84%;
    height: 100%;
    padding-left: 16px;
    box-sizing: border-box;
  }

  .d-title span {
    display: inline-block;
    height: 100%;
    line-height: 45px;
    overflow: hidden;
  }

  .d-title .num {
    color: #84d463;
    float: left;
    width: 16%;
    font-size: 18px;
    text-align: center;
  }

  .fav-sel {
    color: #84d463;
  }

  .swiper-container {
    width: 100%;
    overflow: hidden;
  }

  .swiper-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    flex-shrink: 0;
    width: 100%;
    height: calc(100vh);
    /*height: calc(100vh - 48px);*/
    overflow-y: auto;
  }

  .tst {
    transition: transform 0.3s ease-in-out;
  }

  /*.page {*/
    /*!*background-color: white;*!*/
    /*width: 100%;*/
    /*!*height: 100%;*!*/
    /*!*!*float: left;*!*!*/
    /*border: 0;*/
    /*!*overflow: hidden;*!*/
    /*!*position: relative;*!*/
    /*!*top:0*!*/
  /*}*/

  .ele {
    width: 100%;
    float: left;
  }

  .ele p {
    padding: 0 14px 0 14px;
    /*font-size: 18px;*/
    text-align: justify;
    line-height: 28px;
  }

  img {
    width: 100%;
    max-width: 100%;
    display: block;
  }

  /*图片出血样式*/
  img.propaEditor_img {
    width: calc(100% + 16px) !important;
    max-width: calc(100% + 16px) !important;
    margin-left: -8px;
    margin-right: -8px;
  }

  /*数据库中最外层DIV样式*/
  .page_content {
    height: 100%;
  }

  .propaEditor p {
    font-size: 16px;
    text-align: justify;
    line-height: 28px;
  }

  /*************
   */
  div.progress {
    height: 100%;
    position: relative;
    margin: 0 15px 0 5px;
    display: block;
    text-align: center;
    line-height: 43px;
    font-size: 14px;
    float: right;
  }


  @keyframes slideInUp {
    from{height: 0;bottom: -43px}
    to{height: 43px;bottom: 0px}
  }
  @keyframes slideInDown {
    from{height: 43px;bottom: 0px;}
    to{height: 0px;bottom: -43px}
  }
  .foots{
    animation: slideInUp 0.5s;
    visibility: visible;
  }
  .footh{
    animation: slideInDown 0.5s;
    visibility: hidden;
  }
  .de-style .line{
    height: 3rem;
    line-height: 3rem;
    width: 100%;
    text-align: center;
  }
  .style-na{
    width: 30%;
    float: left;
    font-size: 14px;
    color: #000;
  }
  .style-va{
    width: 70%;
    float: right;
  }
  .style-va span{
    display: inline-block;
    width: 33.33%;
  }
</style>
