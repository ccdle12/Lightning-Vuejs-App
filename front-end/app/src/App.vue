<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
     <router-view></router-view>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Checkout from './components/Checkout.vue'

export default {
  name: 'app',
  components: {
    Home,
    Checkout
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
