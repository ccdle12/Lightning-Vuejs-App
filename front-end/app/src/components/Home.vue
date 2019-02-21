<template>

  <div>
    <!-- <button v&#45;on:click="checkoutPage"> Checkout </button> -->
  <b-container class="bv-example-row">
    <b-row>
      <b-col>
        <img v-on:click="checkoutPage" src=https://i.imgur.com/OC1iqqT.jpg/>
        <button v-on:click="checkoutPage"> Checkout </button>
      </b-col>
      <b-col>2 of 3</b-col>
      <b-col>3 of 3</b-col>
    </b-row>
  </b-container>
  </div>
  

</template>

<script>
import navigationService from './NavigationService'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  data: function() {
    return {
      title: 'Somerco Beer Shop',
    }
  },

  computed: {
  },

  watch: {
  }, 

  methods: {
    checkoutPage: function() {
      let searchRequest = { type: 'checkout' }
      navigationService.navigate(this.$router, searchRequest)
    },
  },
} // export default

</script>
