<template>
  <header id="head-top">
    <slot name="logo"></slot>
    <slot name="search"></slot>
    <section class="head-goback" v-if="goBack" @click="$router.go(-1)">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
      </svg>
    </section>
    <router-link :to="userInfo?'/profile':'/login'" v-if="signinUp" class="head-login">
      <svg class="user-avatar" v-if="userInfo">
        <use xmls:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
      </svg>
      <span class="login-span" v-else>登陆 | 注册</span>
    </router-link>
    <section class="title-head ellipsis" v-if="headTitle">
      <span class="title-text">{{headTitle}}</span>
    </section>
    <slot name="edit"></slot>
    <slot name="msiteTitle"></slot>
    <slot name="changeCity"></slot>
    <slot name="changeLogin"></slot>
  </header>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapActions} from 'vuex';
  export default {
    props: [
      'signinUp',
      'headTitle',
      'goBack'
    ],
    data() {
      return {};
    },
    mounted() {
      this.getUserInfo();
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      ...mapActions([
        'getUserInfo'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
  #head-top
    background-color: $blue;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 1.95rem;
    .head-goback
      width: 0.6rem;
      height: 0.8rem;
      left: 0.4rem;
      line-height: 2.2rem;
      margin-left: 0.4rem;
    .head-login
      position: absolute;
      top: 50%;
      right: 0.55rem;
      transform: translateY(-50%);
      font-size: 0.65rem;
      color: #fff;
      .login-span
        color: #fff;
        text-align: center;
      .user-avatar
        width: 0.8rem;
        height: 0.8rem;
        fill: #fff;
    .title-head
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50%;
      color: #fff;
      text-align: center;
      .title-text
        font-size: 0.8rem;
        color: #fff;
        text-align: center;
        font-weight: bold;
</style>
