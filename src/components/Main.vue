<template>
  <div>
    <mt-tab-container v-model="active">
      <mt-tab-container-item id="tab-container1">
        <div class="tianjia" @click="showAll" v-show="!myfav"><i class="iconfont icon-add" slot="icon"></i>
          <div>添加图书</div>
        </div>
        <div class="bitem" v-for="item in myfav">
          <router-link
            :to="{ name: 'Detail', params: { id: item.id,bookname: item.bookname,name:item.name,bookid:item.bookid}}">
            <div class="issue" :bookid="item.bookid" :issuename="item.name" :bookname="item.bookname" :id="item.id">
              <img class="issue" v-bind:src="'http://qnbook.propa.cn/Book/'+item.bookid+'/'+item.id+'/cover.jpg'">
              <div class="title"><p class="title">{{item.bookname}}</p>
              </div>
              <div class="title"><p class="title">{{item.name}}</p>
              </div>
            </div>
          </router-link>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab-container2">
        <div class="searchdiv">
          <input class="s-input" placeholder="   请输入" type="search">
          <div class="s-icon"><i class="iconfont icon-icon"></i></div>
        </div>
        <div v-infinite-scroll="getAllbook" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
             class="infheight">
          <div class="bitem" v-for="item in issueData">
            <router-link
              :to="{ name: 'Detail', params: { id: item.id,bookname: item.bookname,name:item.name,bookid:item.bookid}}">
              <div class="issue" :bookid="item.bookid" :issuename="item.name" :bookname="item.bookname" :id="item.id">
                <img class="issue" v-bind:src="prefix+'/'+item.bookid+'/'+item.id+'/cover.jpg'">
                <div class="title"><p class="title">{{item.bookname}}</p>
                </div>
                <div class="title"><p class="title">{{item.name}}</p>
                </div>
              </div>
            </router-link>
          </div>
          <!--<p v-show="loading" class="page-infinite-loading">-->
            <!--<mt-spinner type="fading-circle"></mt-spinner>-->
            <!--加载中...-->
          <!--</p>-->
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <mt-tabbar v-model="active" fixed>
      <mt-tab-item id="tab-container1">
        <i class="iconfont icon-faxian" slot="icon"></i>
        书架
      </mt-tab-item>
      <mt-tab-item id="tab-container2">
        <i class="iconfont icon-comiisfaxian-copy" slot="icon"></i>
        发现
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  import Vue from 'vue'
  import instance from './common.js'
  import {swreg} from './common.js'
  import { InfiniteScroll } from 'mint-ui';
  Vue.use(InfiniteScroll);
//  Vue.component(InfiniteScroll.name, InfiniteScroll);
  export default{
    name: 'Main',
    data(){
      return {
        active: 'tab-container1',
        issueData: [],
        prefix: '',
        myfav: [],
        loading: true,
        limit: 12,
        offset: 0,
        curPage: 0
      }
    },
    created(){
      this.getAllbook();
      this.myfav = JSON.parse(localStorage.getItem('fav'));
      if (!this.myfav) {
        this.active = 'tab-container2';
      }
//      document.addEventListener('serviceWorker.preloading.asset', () => {
//        console.log('asset loaded!');
//      });
    },
    methods: {
      getAllbook: function () {
        var _this = this;
//        this.loading = true;
        this.curPage++;
        instance({
          method: 'post',
          url: 'book/getIssue',
          data: {
            limit: this.limit,
            offset: this.limit * (this.curPage - 1)
          }
        }).then(function (res) {
          if (res.data.result.length <= 0) {
            _this.loading = true;// 若数据已全部获取完毕
            return
          }
          _this.issueData = _this.issueData.concat(res.data.result);
          _this.prefix = res.data.prefix;
//          _this.loading = false;

        })
      },
      getMyfav: function () {
      },
      showAll: function () {
        this.active = 'tab-container2';
      },
      loadMore() {
        this.loading = true;
        setTimeout(() => {
          this.getAllbook();
          this.loading = false;
        }, 5000);
      }
    },
//    components:{
//      'vue-offline-preloader':VueOfflinePreloader
//    }

  }
</script>

<style>
  .bitem a {
    text-decoration: none;
    color: #777;
    font-size: 14px;
  }

  div.issue {
    width: 28%;
    float: left;
    margin: 4% 0 3% 4.3%;
    overflow: hidden;
    display: table-cell;
  }

  img.issue {
    width: 96%;
    box-shadow: 2px 2px 4px #bbb;
  }

  div.title {
    width: 100%;
    height: 18px;
    float: left;
    overflow: hidden;
    font-size: 14px;
  }

  p.title {
    line-height: 18px;
    font-size: 14px;
    color: #888;
    text-align: left;
    width: 100%;
    margin: 0;
  }

  .mint-tab-container {
    margin-bottom: 50px;
  }

  .tianjia {
    text-align: center;
    margin-top: 30%;
    color: #999999;
  }

  .tianjia i {
    font-size: 50px;
  }

  .tianjia div {
    margin-top: 30px;
  }

  .searchdiv {
    margin: .5rem;
    background-color: rgba(33, 156, 3, 0.6);
    padding: .5rem;
    border-radius: 3px;
  }

  .s-input {
    height: 1.5rem;
    border-radius: 2px;
    border: 0;
    width: 90%;
    /*padding-left: .5rem;*/
  }

  .s-icon {
    color: #ffffff;
    font-size: 18px;
    width: 10%;
    text-align: center;
    float: right;
  }

  .infheight {
    height: calc(100vh - 3.5rem - 48px);
    margin-top: -1px;
    overflow: scroll;
  }
</style>
