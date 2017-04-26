<template>
  <div class="remark-page">
    <section v-if="!showLoading">
      <head-top head-title="订单备注" go-back="true"></head-top>
      <section class="quick-remark" v-if="remarkList.remarks.length">
        <header class="header-style">快速备注</header>
        <ul class="remark-arr-list-ul">
          <li class="remark-arr-list-li" v-for="(item, index) in remarkList.remarks" :key="index">
            <span
              :class="{'first': remarkIndex==0, 'last': remarkIndex==item.length-1, 'choosed':remarkText[index]&&(remarkText[index][0] == remarkIndex)}"
              class="remark-item-li" v-for="(remarkItem, remarkIndex) in item" :key="remarkIndex"
              @click="chooseRemark(index, remarkIndex, remarkItem)">{{remarkItem}}</span>
          </li>
        </ul>
      </section>
      <section class="input-remark quick-remark">
        <header class="header-style">其他备注</header>
        <textarea class="input-text" v-model="inputText" placeholder="请输入备注内容（可不填）"></textarea>
      </section>
      <div class="determine" @click="confirmRemark">确定</div>
    </section>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import loading from 'components/common/loading';
  import {getRemark} from 'service/getData';
  import {mapMutations} from 'vuex';

  export default {
    data() {
      return {
        id: null,
        sig: null,
        remarkList: null,
        showLoading: true,
        remarkText: {},
        inputText: null
      };
    },
    mounted() {
      this.initData();
    },
    created() {
      this.id = this.$route.query.id;
      this.sig = this.$route.query.sig;
    },
    components: {
      headTop,
      loading
    },
    methods: {
      ...mapMutations([
        'CONFIRM_REMARK'
      ]),
      // 初始化信息
      async initData() {
        this.remarkList = await getRemark(this.id, this.sig);
        this.showLoading = false;
      },
      // 选择备注
      chooseRemark(index, remarkIndex, text) {
        this.remarkText[index] = [remarkIndex, text];
        this.remarkText = Object.assign({}, this.remarkText);
      },
      // 确认选择
      confirmRemark() {
        this.CONFIRM_REMARK({remarkText: this.remarkText, inputText: this.inputText});
        this.$router.go(-1);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/mixin.styl";

  .remark-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .header-style
      font-size: 0.65rem;
      color: #333;
      line-height: 2rem;
    .quick-remark
      background-color: #fff;
      margin-top: .4rem;
      padding: 0 .6rem 1rem;
      ul
        display: flex;
        flex-wrap: wrap;
        li
          margin-right: .6rem;
          margin-bottom: .6rem;
          span
            font-size: 0.6rem;
            color: #333;
            padding: .3rem .6rem;
            border: 0.025rem solid #3190e8;
            border-left: 0;
          .first
            border-left: 0.025rem solid #3190e8;
            border-top-left-radius: .2rem;
            border-bottom-left-radius: .2rem;
          .last
            border-top-right-radius: .2rem;
            border-bottom-right-radius: .2rem;
          .choosed
            color: #fff;
            background-color: #3190e8;
    .input-remark
      background-color: #fff;
      .input-text
        width: 100%;
        background-color: #f9f9f9;
        border: 0.025rem solid #eee;
        resize: none;
        min-height: 4.5rem;
        border-radius: .2rem;
        font-size: 0.6rem;
        color: #666;
        padding: .5rem;
    .determine
      background-color: #4cd964;
      font-size: 0.7rem;
      color: #fff;
      text-align: center;
      margin: 0 .7rem;
      line-height: 1.8rem;
      border-radius: 0.2rem;
</style>
