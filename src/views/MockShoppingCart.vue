<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card width="600">
          <v-data-table
            :headers="headers"
            :loading="cartLoading"
            :items="productsList"
            hide-default-footer
            :items-per-page="totalProduct"
          >
            <template v-slot:item.qty="{ item: productsList }">
              <span class="text-end d-block">{{ productsList.qty }}</span>
            </template>

            <template v-slot:item.product.price="{ item: productsList }">
              <span class="text-end d-block">
                {{ $n(productsList.product.price, 'currency') }}
              </span>
            </template>

            <template v-slot:item.total="{ item: productsList }">
              <span class="text-end d-block">
                {{ $n(productsList.total, 'currency') }}
              </span>
            </template>

            <template v-slot:item.actions>
              <span class="text-end d-block">
                {{ $n(productsList.total, 'currency') }}
              </span>
            </template>

            <template v-slot:item.actions="{ item: product }">
              <v-icon color="error" @click="openDeleteOrderDialog(product.id)">
                mdi-trash-can-outline
              </v-icon>
            </template>

            <template v-slot:footer>
              <v-divider></v-divider>
              <v-container>
                <v-row>
                  <v-col class="pa-4 text-right">
                    <p class="mb-0">
                      總計:
                      <span class="ml-4">{{ $n(totalPrice, 'currency') }}</span>
                    </p>
                    <p class="mb-0">
                      折扣價:
                      <span class="ml-4">{{ $n(finalPrice, 'currency') }}</span>
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      cartLoading: false,
    };
  },
  computed: {
    headers() {
      return [
        { text: '品名', value: 'product.title', width: 60 },
        { text: '數量', value: 'qty', width: 30 },
        { text: '單價', value: 'product.price', width: 30 },
        { text: '小計', value: 'total', width: 30 },
        { text: '', value: 'actions', width: 20, align: 'center' },
      ];
    },
    totalProduct() {
      return this.$store.state.cart.carts?.length || 0;
    },
    productsList() {
      return this.$store.state.cart.carts;
    },
    totalPrice() {
      return this.$store.state.cart.total || 0;
    },
    finalPrice() {
      return this.$store.state.cart.final_total || 0;
    },
  },
  methods: {
    openDeleteOrderDialog() {
      this.isDeleteOrderDialogOpen = true;
    },
    async getCart() {
      this.cartLoading = true;
      await this.$store.dispatch('getCart');
      this.cartLoading = false;
    },
  },
  async created() {
    await this.getCart();
  },
};
</script>
