<template>
  <div class="city-container">
    <head-top :head-title="cityname" go-back="true">
      <router-link to="/home" slot="changeCity" class="change-city">切换城市</router-link>
    </head-top>
    <form class="city-form" @submit.prevent>
      <div>
        <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city-input input-style" required v-model="inputValue">
      </div>
      <div>
        <input type="submit" name="submit" class="city-submit input-style" @click="postpois" value="提交">
      </div>
    </form>
    <header v-if="historytitle" class="pois-search-history">搜索历史</header>
    <ul class="getpois-ul">
      <li v-for="(item, index) in placelist" @click="nextpage(index, item.geohash)" :key="index">
        <h4 class="pois-name ellipsis">{{item.name}}</h4>
        <p class="pois-address ellipsis">{{item.address}}</p>
      </li>
    </ul>
    <div class="search-none-place" v-if="placeNone">很抱歉！无搜索结果</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head.vue';
  import {currentcity, searchplace} from 'service/getData';
  import {getStore, setStore} from 'tool/mUtils';
  export default {
    data() {
      return {
        inputValue: '', // 搜索地址
        cityid: '', // 当前城市id
        cityname: '', // 当前城市名字
        placelist: [], // 搜索城市列表
        placeHistory: [], // 历史搜索记录
        historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
        placeNone: false // 搜索无结果，显示提示信息
      };
    },
    mounted() {
      this.cityid = this.$route.params.cityid;
      // 获取当前城市名字
      currentcity(this.cityid).then(res => {
        this.cityname = res.name;
      });
      // 获取搜索历史记录
      if (getStore('placeHistory')) {
        this.placelist = JSON.parse(getStore('placeHistory'));
      }
    },
    methods: {
      // 发送搜索信息inputValue
      postpois() {
        // 输入值不为空时才发送信息
        if (this.inputValue) {
          searchplace(this.cityid, this.inputValue).then(res => {
            this.historytitle = false;
            this.placelist = res;
            if (res.length) {
              this.placeNone = false;
            } else {
              this.placeNone = true;
            }
          });
        }
      },
      /**
       * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
       * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
       */
      nextpage(index, geohash) {
        let history = getStore('placeHistory');
        let choosePlace = this.placelist[index];
        if (history) {
          let checkrepeat = false;
          this.placeHistory = JSON.parse(history);
          this.placeHistory.forEach(item => {
            if (item.geohash === geohash) {
              checkrepeat = true;
            }
          });
          if (!checkrepeat) {
            this.placeHistory.push(choosePlace);
          }
        } else {
          this.placeHistory.push(choosePlace);
        }
        setStore('placeHistory', this.placeHistory);
        this.$router.push({path: '/msite', query: {geohash}});
      }
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
  .city-container
    padding-top: 2.35rem;
  .change-city
    font-size: 0.4rem;
    color: #fff;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.4rem;
  .city-form
    background-color: #fff;
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-top: 0.4rem;
    div
      width: 90%;
      margin: 0 auto;
      text-align: center;
      .input-style
        width: 100%;
        height: 1.4rem;
        border-radius: 0.1rem;
        margin-bottom: 0.4rem;
      .city-input
        font-size: 0.65rem;
        color: #333;
        border: 1px solid $bc;
        padding: 0 0.3rem;
      .city-submit
        font-size: 0.65rem;
        color: #fff;
        background-color: $blue;
  .pois-search-history
    border-top: 1px solid $bc;
    border-bottom: 1px solid $bc;
    padding-left: 0.5rem;
    font-size: 0.475rem;
    line-height: 0.8rem;
    font-family: "Microsoft YaHei";
  .getpois-ul
    background-color: #fff;
    border-top: 1px solid $bc;
    li
      margin: 0 auto;
      padding-top: 0.65rem;
      border-bottom: 1px solid $bc;
      .pois-name
        margin: 0 auto 0.35rem;
        width: 90%;
        font-size: 0.65rem;
        color: #333;
      .pois-address
        width: 90%;
        margin: 0 auto 0.55rem;
        font-size: 0.45rem;
        color: #999;
  .search-none-place
    margin: 0 auto;
    font-size: 0.65rem;
    line-height: 1.75rem;
    font-family: "Microsoft YaHei";
    color: #333;
    background-color: #fff;
    text-indent: 0.5rem;
</style>
