<template>
  <div class="detail-page">
    <head-top :head-title="question.title" go-back="true"></head-top>
    <section id="scroll-section" class="scroll-container">
      <section v-html="markdownText" class="markdown"></section>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState} from 'vuex';
  import showdown from 'showdown';
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {};
    },
    mounted() {
      this.$nextTick(() => {
        this.scroll = new BScroll('#scroll-section', {
          deceleration: 0.001,
          bounce: true,
          swipeTime: 1800,
          click: true
        });
      });
    },
    computed: {
      ...mapState([
        'question'
      ]),
      markdownText: function () {
        let converter = new showdown.Converter();
        return converter.makeHtml(this.question.detail);
      }
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/mixin.styl";

  .detail-page
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 202;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .scroll-container
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding-top: 1.95rem;
      overflow-y: auto;
    .markdown
      font-size: 0.65rem;
      padding: 0 0.7rem;
      color: #666;
      padding-bottom: 2rem;
</style>
