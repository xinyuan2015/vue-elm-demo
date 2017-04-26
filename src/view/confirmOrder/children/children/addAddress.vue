<template>
  <div class="add-address-page">
    <head-top head-title="添加地址" go-back="true"></head-top>
    <section class="page-text-container">
      <section class="section-list">
        <span class="section-left">联系人</span>
        <section class="section-right">
          <input type="text" name="name" placeholder="你的名字" v-model="name" class="input-style">
          <div class="choose-sex">
            <span class="choose-option">
                <svg class="address-empty-right" @click="chooseSex(1)" :class="{'choosed': sex == 1}">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                </svg>
                <span>先生</span>
            </span>
            <span class="choose-option">
              <svg class="address-empty-right" @click="chooseSex(2)" :class="{'choosed': sex == 2}">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>女士</span>
            </span>
          </div>
        </section>
      </section>
      <section class="section-list">
        <span class="section-left">联系电话</span>
        <section class="section-right">
          <div class="phone-add">
            <input type="text" name="phone" placeholder="你的手机号" v-model="phone" class="input-style">
            <img src="../../../../assets/images/add_phone.png" height="20" width="20" @click="phone_bk = true">
          </div>
          <input v-if="phone_bk" type="text" name="anntherPhoneNumber" placeholder="备选电话" v-model="anntherPhoneNumber" class="input-style phone-bk">
        </section>
      </section>
      <section class="section-list">
        <span class="section-left">送餐地址</span>
        <section class="section-right">
          <router-link to="/confirmOrder/chooseAddress/addAddress/searchAddress" tag="div" class="choose-address">{{searchAddress? searchAddress.name : '小区/写字楼/学校等'}}</router-link>
          <input type="text" name="address_detail" placeholder="详细地址（如门牌号等）" v-model="address_detail" class="input-style">
        </section>
      </section>
      <section class="section-list">
        <span class="section-left">标签</span>
        <section class="section-right">
          <input type="text" name="tag" placeholder="无/家/学校/公司" v-model="tag" class="input-style">
        </section>
      </section>
    </section>
    <div class="determine" @click="addAddress">确定</div>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import alertTip from 'components/common/alertTip';
  import {mapState, mapMutations} from 'vuex';
  import {postAddAddress} from 'service/getData';

  export default {
    data() {
      return {
        name: null, // 姓名
        sex: 1, // 性别
        phone: null, // 电话
        address_detail: null, // 详细地址
        tag: '', // 备注
        tag_type: 1, // 备注类型
        phone_bk: false, // 是否选择备注电话
        anntherPhoneNumber: '', // 备注电话
        showAlert: false, // 弹出框
        alertText: null, // 弹出框信息
        poi_type: 0 // 地址类型
      };
    },
    computed: {
      ...mapState([
        'searchAddress', 'geohash', 'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'CONFIRM_ADDRESS'
      ]),
      // 选择性别
      chooseSex(sex) {
        this.sex = sex;
      },
      // 保存地址信息
      async addAddress() {
        if (!(this.userInfo && this.userInfo.user_id)) {
          this.showAlert = true;
          this.alertText = '请登录';
        } else if (!this.name) {
          this.showAlert = true;
          this.alertText = '请输入姓名';
        } else if (!this.phone) {
          this.showAlert = true;
          this.alertText = '请输入电话号码';
        } else if (!this.searchAddress) {
          this.showAlert = true;
          this.alertText = '请选择地址';
        } else if (!this.address_detail) {
          this.showAlert = true;
          this.alertText = '请输入详细地址';
        }
        if (this.tag === '家') {
          this.tag_type = 2;
        } else if (this.tag === '学校') {
          this.tag_type = 3;
        } else if (this.tag === '公司') {
          this.tag_type = 4;
        }
        let res = await postAddAddress(this.userInfo.user_id, this.searchAddress.name, this.address_detail, this.geohash, this.name, this.phone, this.anntherPhoneNumber, 0, this.sex, this.tag, this.tag_type);
        // 保存成功返沪上一页，否则弹出提示框
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
        } else {
          this.CONFIRM_ADDRESS(1);
          this.$router.go(-1);
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
  @import "../../../../assets/stylus/mixin.styl";

  .add-address-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 1.95rem;
    p, span, input
      font-family: Helvetica Neue,Tahoma,Arial;
    .page-text-container
      background-color: #fff;
      padding: 0 .7rem;
    .section-list
      display: flex;
      border-bottom: 0.025rem solid #f5f5f5;
      .section-left
        font-size: 0.7rem;
        color: #333;
        flex: 2;
        line-height: 2.5rem;
      .section-right
        flex: 5;
        .input-style
          width: 100%;
          height: 2.5rem;
          font-size: 0.7rem;
          color: #999;
        .phone-bk
          border-top: 0.025rem solid #f5f5f5;
        .phone-add
          display: flex;
          justify-content: space-between;
          align-items: center;
        .choose-sex
          display: flex;
          line-height: 2.5rem;
          border-top: 0.025rem solid #f5f5f5;
          .choose-option
            font-size: 0.7rem;
            color: #333;
            display: flex;
            align-items: center;
            margin-right: .8rem;
            svg
              margin-right: .3rem;
              width: 0.8rem;
              height: 0.8rem;
              fill: #ccc;
            .choosed
              fill: #4cd964;
        .choose-address
          font-size: 0.7rem;
          color: #999;
          line-height: 2.5rem;
          border-bottom: 0.025rem solid #f5f5f5;
    .determine
      background-color: #4cd964;
      font-size: 0.7rem;
      color: #fff;
      text-align: center;
      margin: 0 .7rem;
      line-height: 1.8rem;
      border-radius: 0.2rem;
      margin-top: .6rem;
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
