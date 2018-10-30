<template>
  <v-btn flat
    v-if="total_in_coupons && total_in_coupons > 0">
    <div>Coupon Wallet: {{ total_in_coupons }}$</div>
  </v-btn>
</template>

<script>
import { WALLET_TOTAL_QUERY } from '@/graphql'

export default {
  name: 'CouponWallet',
  mounted() {
    this.updateWalletValue()
  },
  methods: {
    async updateWalletValue() {
      let query_response = await this.$apollo.query({
        query: WALLET_TOTAL_QUERY
      })
      this.total_in_coupons = query_response.data.wallet_total.value;
    }
  },
  data () {
    return {
      total_in_coupons: null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
