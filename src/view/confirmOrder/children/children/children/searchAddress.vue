<template>
  <div class="search-address-page">
    <section>
      <head-top head-title="搜索" go-back="true"></head-top>
      <form class="search-form">
        <input type="search" name="search" placeholder="请输入小区/写字楼/学校等" v-model="searchValue">
        <button @click.prevent="searchPlace()">搜索</button>
      </form>
      <ul class="address-list" v-if="searchData">
        <li v-for="(item, index) in searchData" :key="index" @click="choooedAddress(item)">
          <h4>{{item.name}}</h4>
          <p>{{item.address}}</p>
        </li>
      </ul>
      <div v-else class="empty-tips">
        <p>找不到地址？</p>
        <p>尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号等）可稍后输入哦</p>
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {searchNearby} from 'service/getData';
  import {mapMutations} from 'vuex';

  export default {
    data() {
      return {
        searchValue: null, // 输入的搜索内容
        searchData: null // 搜索的结果
      };
    },
    methods: {
      ...mapMutations([
        'CHOOSE_SEARCH_ADDRESS'
      ]),
      // 搜索
      async searchPlace() {
        if (this.searchValue) {
          this.searchData = await searchNearby(this.searchValue);
        }
      },
      // 选择搜素结果
      choooedAddress(item) {
        this.CHOOSE_SEARCH_ADDRESS(item);
        this.$router.go(-1);
      }
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../../../assets/stylus/mixin.styl";

  .search-address-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 204;
    overflow-y: auto;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .search-form
      display: flex;
      padding: .7rem;
      input
        font-size: 0.65rem;
        color: #999;
        flex: 4;
        background-color: #f1f1f1;
        margin-right: .6rem;
        height: 1.5rem;
        border-radius: 0.15rem;
        padding: 0 .4rem;
      button
        flex: 1;
        font-size: 0.65rem;
        color: #fff;
        background-color: $blue;
        border-radius: 0.15rem;
    .address-list
      padding: .7rem;
      li
        padding: .7rem 0;
        border-bottom: 0.025rem solid #f5f5f5;
        line-height: 1rem;
        h4
          font-size: 0.75rem;
          color: #555;
        p
          font-size: 0.65rem;
          color: #999;
    .empty-tips
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      p
        font-size: 0.5rem;
        color: #aaa;
        line-height: .7rem;
        text-align: center;
</style>
