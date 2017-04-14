<template>
  <div class="search-top">
    <head-top head-title="搜索" goBack="true"></head-top>
    <form class="search-form">
      <input type="search" name="search" placeholder="请输入商家或美食名称" class="search-input" v-model="searchValue" @input="checkInput">
      <input type="submit" name="submit" class="search-submit" @click.prevent="searchTarget('')">
    </form>
    <section v-if="restaurantList.length">
      <h4 class="title-restaurant">商家</h4>
      <ul class="list-container">
        <router-link :to="{path:'/shop', query:{id:item.id}}" tag="li" v-for="item in restaurantList" :key="item.id" class="list-li">
          <section class="item-left">
            <img :src="imgBaseUrl + item.image_path" class="restaurant-img">
          </section>
          <section class="item-right">
            <div class="item-right-text">
              <p>
                <span>{{item.name}}</span>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="14" class="pay-icon">
                  <polygon points="0,14 4,0 24,0 20,14" style="fill:none;stroke:#FF6000;stroke-width:1" />
                  <line x1="1.5" y1="12" x2="20" y2="12" style="stroke:#FF6000;stroke-width:1.5"/>
                  <text x="3.5" y="9" style="fill:#FF6000;font-size:9;font-weight:bold;">支付</text>
                </svg>
              </p>
              <p>月售 {{item.month_sales}} 单</p>
              <p>{{item.delivery_fee}} 元起送 / 距离{{item.distance}}</p>
            </div>
            <ul class="item-right-detail">
              <li v-for="activities in item.restaurant_activity" :key="activities.id">
                <span :style="{backgroundColor: '#' + activities.icon_color}" class="activities-icon">{{activities.icon_name}}</span>
                <span>{{activities.name}}</span>
                <span class="only-phone">(手机客户端专享)</span>
              </li>
            </ul>
          </section>
        </router-link>
      </ul>
    </section>
    <section class="search-history" v-if="searchHistory.length && showHistory">
      <h4 class="title-restaurant">搜索历史</h4>
      <ul>
        <li v-for="(item, index) in searchHistory" :key="index" class="history-list">
          <span class="history-text ellipsis" @click="searchTarget(item)">{{item}}</span>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="delete-icon" @click="deleteHistory(index)">
            <line x1="8" y1="8" x2="18" y2="18" style="stroke:#999;stroke-width:3" />
            <line x1="18" y1="8" x2="8" y2="18" style="stroke:#999;stroke-width:3" />
          </svg>
        </li>
      </ul>
      <footer class="clear-history" @click="clearAllHistory">清空搜索历史</footer>
    </section>
    <div class="search-none" v-if="emptyResult">很抱歉！无搜索结果</div>
    <foot-guide></foot-guide>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import footGuide from 'components/footer/footGuide';
  import {searchRestaurant} from 'service/getData';
  import {imgBaseUrl} from 'config/env';
  import {getStore, setStore} from 'tool/mUtils';

  export default {
    data() {
      return {
        geohash: '', // msite页面传递过来的地址信息
        searchValue: '', // 搜索内容
        restaurantList: [], // 搜索返回的结果
        imgBaseUrl, // 图片域名地址
        searchHistory: [], // 搜索历史记录
        showHistory: true, // 是否显示历史记录，只有在返回搜索结果后隐藏
        emptyResult: false // 搜索结果为空时显示
      };
    },
    mounted() {
      this.geohash = this.$route.params.geohash;
      // 获取搜索历史记录
      if (getStore('searchHistory')) {
        this.searchHistory = JSON.parse(getStore('searchHistory'));
      }
    },
    methods: {
      // 点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
      async searchTarget(historyValue) {
        if (historyValue) {
          this.searchValue = historyValue;
        } else if (!this.searchValue) {
          return;
        }
        // 隐藏历史纪录
        this.showHistory = false;
        // 获取搜索结果
        this.restaurantList = await searchRestaurant(this.geohash, this.searchValue);
        this.emptyResult = !this.restaurantList.length;
        /**
         * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
         * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
         */
        let history = getStore('searchHistory');
        if (history) {
          let checkrepeat = false;
          this.searchHistory = JSON.parse(history);
          this.searchHistory.forEach(item => {
            if (item === this.searchValue) {
              checkrepeat = true;
            }
          });
          if (!checkrepeat) {
            this.searchHistory.push(this.searchValue);
          }
        } else {
          this.searchHistory.push(this.searchValue);
        }
        setStore('searchHistory', this.searchHistory);
      },
      // 搜索结束后，删除搜索内容直接到为空时清空搜索结果，并显示历史记录
      checkInput() {
        if (this.searchValue === '') {
          this.showHistory = true; // 显示历史记录
          this.restaurantList = []; // 清空搜索结果
          this.emptyResult = false; // 隐藏搜索结果为空提示
        }
      },
      // 点击删除按钮，删除当前历史记录
      deleteHistory(index) {
        this.searchHistory.splice(index, 1);
        setStore('searchHistory', this.searchHistory);
      },
      // 清除所有历史记录
      clearAllHistory() {
        this.searchHistory = [];
        setStore('searchHistory', this.searchHistory);
      }
    },
    components: {
      headTop,
      footGuide
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .search-top
    padding-top: 2.1rem;
    .search-form
      background-color: #fff;
      padding: 0.5rem;
      display: flex;
      input
        height: 1.5rem;
      .search-input
        flex: 4;
        border: 0.025rem solid $bc;
        font-size: 0.65rem;
        color: #333;
        border-radius: 0.125rem;
        background-color: #f2f2f2;
        font-weight: bold;
        padding: 0 0.25rem;
      .search-submit
        flex: 1;
        border: 0.025rem solid $blue;
        margin-left: .2rem;
        font-size: 0.65rem;
        color: #fff;
        border-radius: 0.125rem;
        background-color: $blue;
        font-weight: bold;
        padding: 0 0.25rem;
    .title-restaurant
      font-size: 0.6rem;
      line-height: 2rem;
      text-indent: 0.5rem;
      font-weight: bold;
      color: #666;
    .list-container
      background-color: #fff;
    .list-li
      display: flex;
      justify-content: center;
      padding: 0.5rem;
      border-bottom: 0.025rem solid $bc;
      .item-left
        margin-right: 0.25rem;
        .restaurant-img
          width: 1.7rem;
          height: 1.7rem;
      .item-right
        font-size: 0.55rem;
        flex: 1;
        .item-right-text
          padding-bottom: 0.25rem;
          border-bottom: 0.025rem solid $bc;
          p
            line-height: .9rem;
          .pay-icon
            margin-bottom: -0.08rem;
        .item-right-detail
          margin-top: 0.25rem;
          li
            font-size: 0;
            span
              font-size: .5rem;
              vertical-align: middle;
              display: inline-block;
              margin-bottom: 0.2rem;
            .activities-icon
              font-size: 0.5rem;
              color: #fff;
              font-weight: bold;
              padding: .04rem;
              border-radius: 0.15rem;
              margin-right: 0.125rem;
            .only-phone
              color: #FF6000;
    .search-history
      .history-list
        background-color: #fff;
        border-bottom: 0.025rem solid $bc;
        font-size: 0.7rem;
        line-height: 2rem;
        font-family: "Microsoft YaHei";
        padding: 0 0.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .history-text
          font-size: 0.7rem;
          line-height: 2rem;
          font-family: "Microsoft YaHei";
          display: inline-block;
          width: 80%;
        .delete-icon
          width: 1rem;
          height: 1rem;
      .clear-history
        background-color: #fff;
        color: $blue;
        font-size: 0.7rem;
        line-height: 2rem;
        font-family: "Microsoft YaHei";
        font-weight: bold;
        text-align: center;
    .search_none
      margin: 0 auto;
      font-size: 0.65rem;
      line-height: 1.75rem;
      font-family: "Microsoft YaHei";
      color: #333;
      background-color: #fff;
      text-align: center;
      margin-top: 0.125rem;
</style>
