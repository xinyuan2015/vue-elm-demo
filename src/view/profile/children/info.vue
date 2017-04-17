<template>
  <div class="rating-page">
    <head-top head-title="账户信息" go-back="true"></head-top>
    <section class="profile-info">
      <section class="headportrait">
        <input type="file" class="profileinfopanel-upload" @change="uploadAvatar">
        <h2>头像</h2>
        <div class="headportrait-div">
          <img :src="imgPath" class="headportrait-div-top" v-if="avatar">
          <span class="headportrait-div-top" v-else>
            <svg>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
            </svg>
          </span>
          <span class="headportrait-div-bottom">
            <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </div>
      </section>
      <router-link to="/profile/setusername" class="info-router">
        <section class="headportrait headportraitwo">
          <h2>用户名</h2>
          <div class="headportrait-div">
            <p>{{username}}</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <router-link to="/profile/info/address" class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <h2>收货地址</h2>
          <div class="headportrait-div">
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <section class="bind-phone">
        账号绑定
      </section>
      <section class="info-router" @click="changePhone">
        <section class="headportrait headportraitwo headportraithree">
          <h2>
            <img src="../../../assets/images/bindphone.png"style="display:inline-block;margin-right:.4rem;" alt="phone" >
            手机
          </h2>
          <div class="headportrait-div">
            <p>{{infotel}}</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </section>
      <section class="bind-phone">
        安全设置
      </section>
      <router-link to="/forget" class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <h2>登陆密码</h2>
          <div class="headportrait-div">
            <p>修改</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <section class="exitlogin" @click="exitlogin">退出登录</section>
    </section>

    <section class="coverpart" v-if="show">
      <section class="cover-background"></section>
      <section class="cover-content" :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
        <div class="sa-icon">
          <span class="sa-body"></span>
          <span class="sa-dot"></span>
        </div>
        <h2>是否退出登录</h2>
        <div class="sa-botton">
          <button class="waiting" @click="waitingThing">再等等</button>
          <div style="display:inline-block;">
            <button class="quitlogin"  @click="outLogin">退出登录</button>
          </div>
        </div>
      </section>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations, mapState} from 'vuex';
  import headTop from 'components/header/head';
  import alertTip from 'components/common/alertTip';
  import {getImgPath} from 'components/common/mixin';

  export default {
    data() {
      return {
        username: '', //  用户名
        resetname: '',  //  重置用户名
        infotel: '',  //  用户手机
        avatar: '', //  用户头像
        show: false,  //  显示提示框
        isEnter: true,  //  是否登陆
        isLeave: false, //  是否退出
        showAlert: false,
        alertText: null
      };
    },
    mixins: [getImgPath],
    beforeDestory() {
      clearTimeout(this.timer);
    },
    computed: {
      ...mapState([
        'userInfo',
        'imgPath'
      ])
    },
    methods: {
      ...mapMutations([
        'OUT_LOGIN',
        'SAVE_AVANDER'
      ]),
      exitlogin() {
        this.show = true;
        this.isEnter = true;
        this.isLeave = false;
      },
      waitingThing() {
        // 取消推出
        clearTimeout(this.timer);
        this.isEnter = false;
        this.isleave = true;
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.show = false;
        }, 200);
      },
      // 退出登录
      outLogin() {
        this.OUT_LOGIN();
        this.waitingThing();
        this.$router.go(-1);
      },
      changePhone() {
        this.showAlert = true;
        this.alertText = '请在手机APP中设置';
      },
      async uploadAvatar() {
        // 上传头像
        if (this.userInfo) {
          let input = document.querySelector('.profileinfopanel-upload');
          let data = new FormData();
          data.append('file', input.files[0]);
          try {
            let response = await fetch('/eus/v1/users/' + this.userInfo.user_id + '/avatar', {
              method: 'POST',
              credentials: 'include',
              body: data
            });
            let res = await response.json();
            this.SAVE_AVANDER(this.getImgPath(res));
          } catch (error) {
            this.showAlert = true;
            this.alertText = '上传失败';
            throw new Error(error);
          }
        }
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.username = value.username;
          this.infotel = value.mobile;
          this.avatar = value.avatar;
        }
      }
    },
    components: {
      headTop,
      alertTip
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/mixin.styl";
  .rating-page
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f2f2f2;
    z-index: 202;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .profile-info
      width: 100%;
      height: 3.1rem;
      .headportrait
        margin-top: 0.4rem;
        padding: 0.5rem 0.4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #ddd;
        background: #fff;
        .profileinfopanel-upload
          width: 100%;
          height: 3.1rem;
          display: block;
          position: absolute;
          opacity: 0;
          top: 2.35rem;
          left: 0;
        h2
          font-size: 0.6rem;
          color: #333;
          font-weight:500;
          display:flex;
          align-items:center;
        .headportrait-div
          span
            display:inline-block;
            svg
              width: 100%;
              height: 100%;
          .headportrait-div-top
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            vertical-align: middle;
          .headportrait-div-bottom
            width: 0.66667rem;
            height: 1.4rem;
            position: relative;
            top: 0.44rem;
      .headportraitwo
        margin-top: 0;
        padding: 0.3rem 0.4rem;
        .headportrait-div
          display: flex;
          justify-content: left;
          p
            text-align: left;
            line-height: 1.39rem;
            font-size: 0.7rem;
            color: #999;
            margin-right: 0.2rem;
            font-weight: 100;
            font-family:Arial;
          .headportrait-div-bottom
            top: 0;
      .headportraithree
        border-bottom: 1px solid #ddd;
      .bind-phone
        padding: 0.4rem 0.4rem;
        font-size: 0.5rem;
        color: #666;
      .exitlogin
        width: 96%;
        margin: 1.3rem auto 0;
        line-height: 1.5rem;
        border-radius: 5px;
        text-align: center;
        background: #d8584a;
        font-size: 0.6rem;
        color: #fff;
      .exitlogin:active
        opacity: 0.8;
        background: #c1c1c1;
    .info-router
      display: block;
    .coverpart
      width: 100%;
      height: 100%;
      position:absolute;
      top:0;
      right:0;
      .cover-background
        width: 100%;
        height: 100%;
        position:absolute;
        top:0;
        right:0;
        background: #000;
        z-index: 100;
        opacity: 0.2;
      .cover-content
        width: 94%;
        background:$fc;
        padding:17px;
        position:absolute;
        top:20%;
        left:3%;
        z-index:1000;
        border-radius: 5px;
        .sa-icon
          width: 90px;
          height: 90px;
          border: 4px solid #f8bb86;
          border-radius: 50%;
          margin: 20px auto;
          position: relative;
          .sa-body
            width: 5px;
            height: 47px;
            border-radius: 2px;
            background: #f8bb86;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 10px;
          .sa-dot
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #f8bb86;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 10px;
        h2
          width: 100%;
          text-align: center;
          font-size: 30px;
          color: #575757;
          font-weight: 500;
          margin: 25px 0;
        .sa-botton
          width: 100%;
          text-align: center;
          button
            display: inline-block;
            padding: 0.4rem 1rem;
            border-radius: 5px;
            font-size: 0.6rem;
            color: $fc;
            letter-spacing: 1px;
            margin-top: 26px;
          .waiting
            background: #c1c1c1;
            margin-right: 0.4rem;
          .quitlogin
            background: rgb(221, 107, 85);
    @-webkit-keyframes bounceIn {
      from, 20%, 40%, 60%, 80%, 100% {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      }

      0% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
      }

      20% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1);
        transform: scale3d(1.1, 1.1, 1.1);
      }

      40% {
        -webkit-transform: scale3d(.9, .9, .9);
        transform: scale3d(.9, .9, .9);
      }

      60% {
        opacity: 1;
        -webkit-transform: scale3d(1.03, 1.03, 1.03);
        transform: scale3d(1.03, 1.03, 1.03);
      }

      80% {
        -webkit-transform: scale3d(.97, .97, .97);
        transform: scale3d(.97, .97, .97);
      }

      100% {
        opacity: 1;
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
      }
    }

    @keyframes bounceIn {
      from, 20%, 40%, 60%, 80%, 100% {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      }

      0% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
      }

      20% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1);
        transform: scale3d(1.1, 1.1, 1.1);
      }

      40% {
        -webkit-transform: scale3d(.9, .9, .9);
        transform: scale3d(.9, .9, .9);
      }

      60% {
        opacity: 1;
        -webkit-transform: scale3d(1.03, 1.03, 1.03);
        transform: scale3d(1.03, 1.03, 1.03);
      }

      80% {
        -webkit-transform: scale3d(.97, .97, .97);
        transform: scale3d(.97, .97, .97);
      }

      100% {
        opacity: 1;
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
      }
    }
    @-webkit-keyframes zoomOut {
      from {
        opacity: 1;
      }

      50% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
      }

      100% {
        opacity: 0;
      }
    }

    @keyframes zoomOut {
      from {
        opacity: 1;
      }

      50% {
        opacity: 0;
        -webkit-transform: scale3d(.3, .3, .3);
        transform: scale3d(.3, .3, .3);
      }

      100% {
        opacity: 0;
      }
    }
    .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
    }
  body .coverpart .cover-animate{
    transition:all 1s;
    animation:bounceIn .6s;
  }
  body .coverpart .cover-animate-leave{
    animation:zoomOut .4s;
  }
</style>
