<template>
  <v-container fluid>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="orders"
        :items-per-page="10"
        hide-default-footer
        item-key="id"
        style="width: 100%;"
        :loading="ordersLoading"
        @click:row="openOrderDialog"
      >
        <template v-slot:item.create_at="{ item: order }">
          <span>{{ $moment(order.create_at).format('LL') }}</span>
        </template>

        <template v-slot:item.is_paid="{ item: order }">
          <span>{{ order.is_paid ? '是' : '否' }}</span>
        </template>

        <template v-slot:item.paid_date="{ item: order }">
          <span>{{ $moment(order.paid_date).format('LL') }}</span>
        </template>

        <template v-slot:item.total="{ item: order }">
          <span class="text-right d-block">
            {{ order.total ? $n(order.total, 'currency') : '$0' }}
          </span>
        </template>

        <template v-slot:item.user="{ item: order }">
          <span class="text-right d-block">
            {{ 'user' in order && 'name' in order.user ? order.user.name : '' }}
          </span>
        </template>

        <template v-slot:footer>
          <v-container>
            <v-row justify="center">
              <v-col>
                <v-pagination v-model="page" :total-visible="7" :length="totalPage"></v-pagination>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-data-table>
    </v-row>

    <v-dialog v-model="isOrderDialogOpen" width="300">
      <v-card>
        {{ focusedOrder.is_paid }}
        <ul>
          <li v-for="(product, index) in focusedOrder.products" :key="index">
            {{ product.product.title }}
          </li>
        </ul>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    ordersLoading: false,
    page: 1,
    isOrderDialogOpen: false,
    focusedOrder: {},
  }),
  async created() {
    await this.getOrders();
  },
  watch: {
    page() {
      this.getOrders();
    },
  },

  computed: {
    headers() {
      return [
        { text: '建立日期', value: 'create_at', width: 60 },
        { text: '是否已付款', value: 'is_paid', width: 60 },
        { text: '付款日期', value: 'paid_date', width: 60 },
        { text: '總金額', value: 'total', width: 60 },
        { text: '客戶姓名', value: 'user', width: 60 },
      ];
    },
    orders() {
      return this.$store.state.orders;
    },
    totalPage() {
      return this.$store.state.ordersPagination.total_pages;
    },
  },
  methods: {
    async getOrders() {
      this.ordersLoading = true;
      await this.$store.dispatch('getOrders', this.page);
      this.ordersLoading = false;
    },
    openOrderDialog(order) {
      this.focusedOrder = order;
      this.isOrderDialogOpen = true;
    },
  },
};
</script>
