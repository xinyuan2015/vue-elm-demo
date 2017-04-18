<template>
  <div class="loading-container">
    <div class="load-img" :style="{backgroundPositionY: -(positionY%7)*2.5 + 'rem'}"></div>
    <svg class="load-ellipse" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <ellipse cx="26" cy="10" rx="26" ry="10" style="fill:#ddd;stroke:none;"></ellipse>
    </svg>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        positionY: 0,
        timer: null
      };
    },
    mounted() {
      this.timer = setInterval(() => {
        this.positionY++;
      }, 600);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
  @keyframes load {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-50px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @keyframes ellipse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.3);
    }
    100% {
      transform: scale(1);
    }
  }

  .loading-container
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2.5rem;
    height: 2.5rem;
  .load-img
    width: 100%;
    height: 100%;
    background: url(../../assets/images/icon_loading.png) no-repeat 0 0;
    background-size: 2.5rem auto;
    transform: translateY(0px);
    animation: load .6s infinite ease-in-out;
    position: relative;
    z-index: 11;
  .load-ellipse
    position: absolute;
    width: 2.4rem;
    height: 2rem;
    top: 2.2rem;
    left: 0.11rem;
    z-index: 10;
    animation: ellipse .6s infinite ease-in-out;
</style>
