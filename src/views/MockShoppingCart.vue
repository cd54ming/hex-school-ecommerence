<template>
  <v-container fluid :style="vuetifyVariables">
    <v-row>
      <v-col cols="5">
        <validation-observer ref="form" v-slot="{ handleSubmit }">
          <v-card class="mb-5">
            <v-card-title>個人資料</v-card-title>
            <v-card-text>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col cols="12" class="py-0">
                      <validation-provider
                        name="E-mail"
                        mode="lazy"
                        rules="required|email"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          dense
                          outlined
                          v-model="customerInfo.email"
                          :disabled="creatingOrder"
                          :label="$t('email')"
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="py-0">
                      <v-text-field-with-validation
                        v-model="customerInfo.tel"
                        :disabled="creatingOrder"
                        rules="required|numeric|min:10|max:13"
                        label="手機號碼"
                        dense
                        outlined
                      >
                      </v-text-field-with-validation>
                    </v-col>
                    <v-col cols="6" class="py-0">
                      <v-text-field-with-validation
                        v-model="customerFirstName"
                        :disabled="creatingOrder"
                        rules="required"
                        label="姓"
                        dense
                        outlined
                      >
                      </v-text-field-with-validation>
                    </v-col>
                    <v-col cols="6" class="py-0">
                      <v-text-field-with-validation
                        v-model="customerLastName"
                        :disabled="creatingOrder"
                        rules="required"
                        label="名"
                        dense
                        outlined
                      >
                      </v-text-field-with-validation>
                    </v-col>
                    <v-col cols="12" class="py-0">
                      <v-text-field-with-validation
                        v-model="customerInfo.address"
                        :disabled="creatingOrder"
                        rules="required"
                        label="寄送地址"
                        dense
                        outlined
                      >
                      </v-text-field-with-validation>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>
          <v-card class="mb-5">
            <v-card-title>付款方式</v-card-title>
            <v-card-text>
              <v-form>
                <v-container class="py-0">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card
                        outlined
                        @click="selectPaymentMethod('cash')"
                        :class="{ 'primary-border': paymentMethod === 'cash' }"
                      >
                        <v-card-text>
                          <v-row no-gutters justify="center" class="my-2 flex-nowrap">
                            <v-col cols="auto">
                              <v-img
                                width="30"
                                class="mx-1"
                                src="../assets/images/cash.svg"
                              ></v-img>
                            </v-col>
                          </v-row>
                          <p class="ma-0 text-center">貨到戶款</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card
                        outlined
                        @click="selectPaymentMethod('creditCard')"
                        :class="{ 'primary-border': paymentMethod === 'creditCard' }"
                      >
                        <v-card-text>
                          <v-row no-gutters justify="center" class="my-2 flex-nowrap">
                            <v-col cols="auto">
                              <v-img
                                width="30"
                                class="mx-1"
                                src="../assets/images/credit-card1.svg"
                              ></v-img>
                            </v-col>
                            <v-col cols="auto">
                              <v-img
                                width="30"
                                class="mx-1"
                                src="../assets/images/credit-card2.svg"
                              ></v-img>
                            </v-col>
                            <v-col cols="auto">
                              <v-img
                                width="30"
                                class="mx-1"
                                src="../assets/images/credit-card3.svg"
                              ></v-img>
                            </v-col>
                          </v-row>
                          <p class="ma-0 text-center">信用卡</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <div class="mb-6">
                    <div v-if="paymentMethod === 'cash'">
                      <p>貨到付款</p>
                      <p>當司機抵達時請直接付款給司機</p>
                    </div>
                    <v-row v-else-if="paymentMethod === 'creditCard'">
                      <v-col class="py-0">
                        <p>信用卡</p>
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-text-field-with-validation
                          :disabled="creatingOrder"
                          rules="required"
                          label="持卡人姓名"
                          dense
                          outlined
                        >
                        </v-text-field-with-validation>
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-text-field-with-validation
                          :disabled="creatingOrder"
                          rules="required|numeric|min:16|max:19"
                          label="信用卡號碼"
                          dense
                          outlined
                        >
                        </v-text-field-with-validation>
                      </v-col>
                      <v-col cols="6" class="py-0">
                        <v-text-field-with-validation
                          :disabled="creatingOrder"
                          rules="required|MM/DD"
                          label="到期日"
                          dense
                          outlined
                        >
                        </v-text-field-with-validation>
                      </v-col>
                      <v-col cols="6" class="py-0">
                        <v-text-field-with-validation
                          :disabled="creatingOrder"
                          rules="required|digits:3"
                          label="CVC"
                          dense
                          outlined
                        >
                        </v-text-field-with-validation>
                      </v-col>
                    </v-row>
                  </div>
                  <p
                    class="font-weight-medium cursor-pointer d-inline-block mb-0"
                    :class="{ 'primary--text': !messageOfappliedCouponSuccessful }"
                    @click="openApplyCouponDialog"
                  >
                    您有優惠券嗎？
                  </p>
                  <span class="d-block" :class="{ 'primary--text': messageOfAppliedCoupon }">
                    {{ messageOfappliedCouponSuccessful }}
                  </span>
                </v-container>
              </v-form>
            </v-card-text>
          </v-card>

          <v-btn
            large
            color="primary"
            width="100%"
            @click="handleSubmit(createOrder)"
            :disabled="creatingOrder || productAmount <= 0"
            :loading="creatingOrder"
            >完成並付款</v-btn
          >
        </validation-observer>
      </v-col>

      <!-- <v-alert dense type="success">
        付款完成！
      </v-alert> -->

      <v-col cols="7">
        <v-card>
          <v-data-table
            :headers="headers"
            :loading="cartLoading"
            :items="shoppingCartProducts"
            hide-default-footer
            :items-per-page="productAmount"
          >
            <template v-slot:item.qty="{ item: order }">
              <span class="text-end d-block">{{ order.qty }}</span>
            </template>

            <template v-slot:item.product.price="{ item: order }">
              <span class="text-end d-block">
                {{ $n(order.product.price, 'currency') }}
              </span>
            </template>

            <template v-slot:item.total="{ item: order }">
              <span class="text-end d-block">
                {{ $n(order.total, 'currency') }}
              </span>
            </template>

            <template v-slot:item.actions="{ item: order }">
              <v-icon color="error" @click.stop="openDeleteDialog(order)">
                mdi-trash-can-outline
              </v-icon>
            </template>

            <template v-slot:footer>
              <v-divider></v-divider>
              <v-container>
                <v-row>
                  <v-col class="pa-4 text-right">
                    <p class="mb-0">
                      <span class="d-inline-block" style="width: 60px;">小計:</span>
                      <span class="d-inline-block text-right" style="min-width: 80px;">
                        {{ $n(totalPrice, 'currency') }}
                      </span>
                    </p>
                    <p class="mb-0" v-if="finalPrice !== totalPrice">
                      <span class="d-inline-block" style="width: 60px;">折扣:</span>
                      <span class="d-inline-block text-right" style="min-width: 80px;">
                        {{ $n(finalPrice - totalPrice, 'currency') }}
                      </span>
                    </p>
                    <p class="mb-0" v-if="finalPrice !== totalPrice">
                      <span class="d-inline-block" style="width: 60px;">總計:</span>
                      <span class="d-inline-block text-right" style="min-width: 80px;">
                        {{ $n(Math.floor(finalPrice), 'currency') }}
                      </span>
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- 套用優惠券 Dialog -->
    <v-dialog v-model="isApplyCouponDialogOpen" width="300" :persistent="applyingCoupon">
      <v-card>
        <validation-observer ref="couponCodeForm" v-slot="{ handleSubmit }">
          <v-toolbar dense flat color="primary" dark>
            <v-card-title>輸入優惠券</v-card-title>
            <v-spacer></v-spacer>
            <v-icon @click="closeApplyCouponDialog" :disabled="applyingCoupon">mdi-close</v-icon>
          </v-toolbar>
          <v-card-text class="pt-6 pb-0">
            <validation-provider vid="couponCode" name="couponCode" v-slot="{ errors }">
              <v-text-field
                v-model="couponCode"
                dense
                outlined
                label="優惠券代碼"
                :error-messages="errors"
                :disabled="creatingOrder"
              >
              </v-text-field>
            </validation-provider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined @click="closeApplyCouponDialog" :disabled="applyingCoupon">取消</v-btn>
            <v-btn
              depressed
              color="primary"
              :disabled="creatingOrder || applyingCoupon || productAmount <= 0 || !couponCode"
              :loading="applyingCoupon"
              @click="handleSubmit(applyCoupon)"
              >提交</v-btn
            >
          </v-card-actions>
        </validation-observer>
      </v-card>
    </v-dialog>

    <!-- 刪除購物車商品 Dialog -->
    <v-dialog v-model="isDeleteOrderDialogOpen" width="280" :persistent="deletingShoppingCartItem">
      <v-card>
        <v-toolbar dense flat color="error" dark>
          <v-spacer></v-spacer>
          <v-icon @click="closeDeleteDialog" :disabled="deletingShoppingCartItem">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="py-6">
          <span class="subtitle-1">
            確定要刪除品項
            <span class="error--text">{{ focusedOrder.product.title }}</span>
            嗎?
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="closeDeleteDialog" :disabled="deletingShoppingCartItem">否</v-btn>
          <v-btn
            depressed
            color="error"
            @click="deleteShoppingCartItem"
            :disabled="deletingShoppingCartItem"
            :loading="deletingShoppingCartItem"
            >是</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style>
.primary-border {
  border-color: var(--primary-color) !important;
}
</style>

<script>
export default {
  data() {
    return {
      focusedOrder: {
        product: {},
      },
      paymentMethod: 'creditCard',
      cartLoading: false,
      isDeleteOrderDialogOpen: false,
      isApplyCouponDialogOpen: false,
      deletingShoppingCartItem: false,
      messageOfappliedCouponSuccessful: '',
      applyingCoupon: false,
      creatingOrder: false,
      couponCode: '',
      customerFirstName: '',
      customerLastName: '',
      customerInfo: {},
    };
  },
  computed: {
    vuetifyVariables() {
      return {
        '--primary-color': this.$vuetify.theme.themes.light.primary,
      };
    },
    headers() {
      return [
        { text: '品名', value: 'product.title', width: 60 },
        { text: '數量', value: 'qty', width: 30 },
        { text: '單價', value: 'product.price', width: 30 },
        { text: '小計', value: 'total', width: 30 },
        {
          text: '',
          value: 'actions',
          width: 20,
          align: 'center',
        },
      ];
    },
    productAmount() {
      return this.$store.state.cart.carts?.length || 0;
    },
    appliedCoupon() {
      return this.$store.state.cart.carts?.[0].coupon;
    },
    shoppingCartProducts() {
      return this.$store.state.cart.carts;
    },
    totalPrice() {
      return this.$store.state.cart.total || 0;
    },
    finalPrice() {
      return this.$store.state.cart.final_total || 0;
    },
    messageOfAppliedCoupon() {
      return this.$store.state.messageOfAppliedCoupon;
    },
    isAppliedCouponSuccessful() {
      return this.$store.state.isAppliedCouponSuccessful;
    },
  },
  methods: {
    async applyCoupon() {
      this.applyingCoupon = true;
      await this.$store.dispatch('applyCoupon', this.couponCode);
      this.applyingCoupon = false;
      console.log(this.isAppliedCouponSuccessful);
      if (!this.isAppliedCouponSuccessful) {
        this.$refs.couponCodeForm.setErrors({
          couponCode: this.messageOfAppliedCoupon,
        });
      } else {
        this.messageOfappliedCouponSuccessful = this.messageOfAppliedCoupon;
        await this.getCart();
        this.closeApplyCouponDialog();
      }
    },
    openApplyCouponDialog() {
      this.couponCode = '';
      this.isApplyCouponDialogOpen = true;
    },
    closeApplyCouponDialog() {
      this.isApplyCouponDialogOpen = false;
    },
    selectPaymentMethod(paymentMethod) {
      this.paymentMethod = paymentMethod;
    },
    async resetUI() {
      await this.getCart();
      this.customerInfo = {};
      this.customerFirstName = '';
      this.customerLastName = '';
      this.couponCode = '';
      this.paymentMethod = '';
      this.$refs.form.reset();
    },
    async createOrder() {
      const customerInfo = {
        user: {
          name: `${this.customerFirstName} ${this.customerLastName}`,
          ...this.customerInfo,
        },
      };

      try {
        this.creatingOrder = true;
        await this.$store.dispatch('createOrder', customerInfo);
        await this.resetUI();
      } catch (error) {
        console.log('付款失敗, Error: ', error);
      } finally {
        this.creatingOrder = false;
      }
    },
    openDeleteDialog(order) {
      this.focusedOrder = order;
      this.isDeleteOrderDialogOpen = true;
    },
    closeDeleteDialog() {
      this.isDeleteOrderDialogOpen = false;
    },
    async deleteShoppingCartItem() {
      this.deletingShoppingCartItem = true;
      await this.$store.dispatch('deleteShoppingCartItem', this.focusedOrder.id);
      this.deletingShoppingCartItem = false;
      this.closeDeleteDialog();
      this.getCart();
    },
    async getCart() {
      this.cartLoading = true;
      await this.$store.dispatch('getCart');
      this.cartLoading = false;
    },
  },
  async created() {
    await this.getCart();
    console.log(this.$store.state.cart);
  },
};
</script>
