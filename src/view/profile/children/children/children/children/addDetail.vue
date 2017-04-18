<template>
  <div class="rating-page">
    <head-top head-title="搜索地址" go-back="true"></head-top>
    <section>
      <div class="add-detail">
        <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="inputAddress" @input="inputThing">
        <button @click="inputThing">确认</button>
      </div>
      <div class="warnpart">为了满足商家的送餐要求，建议您从列表中选择地址</div>
      <div class="point" v-show="warning">
        <p>找不到地址？</p>
        <p>请尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号）可稍后输入哦。</p>
      </div>
    </section>
    <section class="poisearch-container" v-show="addressList">
      <ul>
        <li v-for="(item, index) in addressList" @click="listClick(index)">
          <p>{{item.name}}</p>
          <p>{{item.address}}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {getImgPath} from 'components/common/mixin';
  import {getSearchAddress} from 'service/getData';
  import {mapMutations, mapState} from 'vuex';

  export default {
    data() {
      return {
        warning: true,
        inputAddress: '',
        addressList: []
      };
    },
    mixins: [getImgPath],
    created() {
      this.inputAddress = this.addAddress ? this.addAddress : this.inputAddress;
    },
    mounted() {
      getSearchAddress(this.inputAddress).then(res => {
        this.addressList = res;
        this.warning = true;
        if (this.addressList.length > 0) {
          this.warning = false;
          if (this.inputAddress === '') {
            this.addressList = [];
            this.warning = true;
          }
        }
      });
    },
    computed: {
      ...mapState([
        'addAddress'
      ])
    },
    methods: {
      ...mapMutations([
        'SAVE_ADDDETAIL'
      ]),
      // 搜索地址
      inputThing() {
        getSearchAddress(this.inputAddress).then(res => {
          this.addressList = res;
          this.warning = true;
          if (this.addressList.length > 0) {
            this.warning = false;
            if (this.inputAddress === '') {
              this.addressList = [];
              this.warning = true;
            }
          }
        });
      },
      // 选择地址
      listClick(index) {
        this.SAVE_ADDDETAIL(this.addressList[index].name);
        this.$router.go(-1);
      }
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../../../../assets/stylus/mixin.styl";

  .rating-page
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f2f2f2;
    z-index: 205;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .add-detail
      display: flex;
      justify-content: space-between;
      background: #fff;
      padding: 0.5rem;
      input
        display: block;
        width: 11.8rem;
        padding: 0.4rem;
        background: #f2f2f2;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 0.6rem;
      button
        display: block;
        width: 3rem;
        background: #3199e8;
        font-size: 0.7rem;
        color: #fff;
        border-radius: 5px;
    .warnpart
      background: #fff6e4;
      font-size: 0.62rem;
      color: #ff883f;
      text-align: center;
      padding: 0.2rem 0;
    .point
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      p
        width: 100%;
        text-align: center;
        font-size: 0.7rem;
        color: #969696;
        margin-bottom: 0.4rem;
    .poisearch-container
      background: #f2f2f2;
      li
        border-bottom: 1px solid #ccc;
        padding: 0.4rem;
        p
          font-size: 0.65rem;
          color: #969696;
        p:first-child
          margin-bottom: 0.2rem;
      li:last-child
        border: 0;
</style>
