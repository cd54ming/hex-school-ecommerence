<template>
  <v-container fluid>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="coupons"
        :items-per-page="10"
        hide-default-footer
        item-key="id"
        style="width: 100%;"
        :loading="couponsLoading"
      >
        <template v-slot:top>
          <v-container>
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <v-btn color="primary" depressed @click="openCouponDialog(true)">
                  新增優惠券
                  <!-- {{ $t('') }} -->
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <template v-slot:item.due_date="{ item: coupon }">
          <span> {{ $moment(coupon.due_date).format('LL') }}</span>
        </template>

        <template v-slot:item.is_enabled="{ item: coupon }">
          <v-row justify="center">
            <v-switch
              :input-value="coupon.is_enabled"
              :false-value="0"
              :true-value="1"
              @change="switchCouponAvaliable(coupon, $event)"
              :loading="editingCouponAvaliable[coupon.id]"
              :disabled="editingCouponAvaliable[coupon.id]"
            ></v-switch>
          </v-row>
        </template>

        <template v-slot:item.percent="{ item: coupon }">
          <span class="d-block text-right">{{ `${coupon.percent}%` }}</span>
        </template>

        <template v-slot:item.actions="{ item: coupon }">
          <v-icon class="mr-2" @click="openCouponDialog(false, coupon)">
            mdi-pencil
          </v-icon>
          <v-icon @click="openDeleteCouponDialog(coupon)">
            mdi-delete
          </v-icon>
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

    <!-- 新增 or 修改優惠券視窗 -->
    <v-dialog v-model="isCouponDialogOpen" max-width="320" :persistent="addingOrUpdatingCoupon">
      <v-card>
        <validation-observer ref="form" v-slot="{ handleSubmit }">
          <v-toolbar flat dense dark color="primary">
            <v-toolbar-title v-text="(isNewCoupon? '新增優惠券': '修改優惠券')"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeCouponDialog" :disabled="addingOrUpdatingCoupon">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12" class="py-0">
                    <v-text-field-with-validation
                      v-model="focusedCoupon.title"
                      label="名稱"
                      dense
                      outlined
                      rules="required"
                      :disabled="addingOrUpdatingCoupon"
                    >
                    </v-text-field-with-validation>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-menu
                      v-model="isDatePickerOpen"
                      :close-on-content-click="false"
                      nudge-top="-40px"
                      nudge-left="8px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field-with-validation
                          v-model="couponExpiredDate"
                          label="到期日"
                          rules="required"
                          dense
                          outlined
                          v-on="on"
                          readonly
                          :disabled="addingOrUpdatingCoupon"
                        >
                        </v-text-field-with-validation>
                      </template>
                      <v-date-picker
                        color="primary"
                        scrollable
                        v-model="couponExpiredDate"
                        no-title
                        @input="setCouponExpiredDate"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-text-field-with-validation
                      v-model.number="focusedCoupon.percent"
                      label="折扣%數"
                      dense
                      outlined
                      rules="required|integer|min_value:1|max_value:99"
                      suffix="%"
                      :disabled="addingOrUpdatingCoupon"
                    ></v-text-field-with-validation>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-text-field-with-validation
                      v-model="focusedCoupon.code"
                      label="折扣碼"
                      rules="required"
                      dense
                      outlined
                      :disabled="addingOrUpdatingCoupon"
                    >
                    </v-text-field-with-validation>
                  </v-col>
                  <v-col cols="auto" class="py-0">
                    <v-switch
                      v-model="focusedCoupon.is_enabled"
                      class="ma-0"
                      :false-value="0"
                      :true-value="1"
                      :label="$t('avaliable')"
                      :disabled="addingOrUpdatingCoupon"
                    >
                    </v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="secondary"
              :disabled="addingOrUpdatingCoupon"
              @click="closeCouponDialog"
              >{{ $t('cancel') }}</v-btn
            >
            <v-btn
              depressed
              color="primary"
              v-text="(isNewCoupon ? $t('add') : $t('update'))"
              @click="handleSubmit(addOrUpdateCoupon)"
              :disabled="addingOrUpdatingCoupon"
              :loading="addingOrUpdatingCoupon"
            ></v-btn>
          </v-card-actions>
        </validation-observer>
      </v-card>
    </v-dialog>

    <!-- 刪除優惠券視窗 -->
    <v-dialog v-model="isDeleteCouponDialogOpen" width="280" :persistent="deletingCoupon">
      <v-card>
        <v-toolbar dense flat color="error" dark>
          <v-spacer></v-spacer>
          <v-icon @click="closeDeleteCouponDialog" :disabled="deletingCoupon">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="py-6">
          <span class="subtitle-1">
            確定要刪除優惠券
            <span class="error--text">{{ focusedCoupon.title }}</span>
            嗎?
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="closeDeleteCouponDialog" :disabled="deletingCoupon">否</v-btn>
          <v-btn
            depressed
            color="error"
            @click="deleteCoupon"
            :disabled="deletingCoupon"
            :loading="deletingCoupon"
            >是</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      localCoupons: [],
      addingOrUpdatingCoupon: false,
      focusedCoupon: {},
      couponExpiredDate: '',
      isDatePickerOpen: false,
      isNewCoupon: false,
      couponsLoading: false,
      isCouponDialogOpen: false,
      isDeleteCouponDialogOpen: false,
      deletingCoupon: false,
      editingCouponAvaliable: {},
      page: 1,
    };
  },
  async created() {
    await this.getCoupons();
  },
  watch: {
    page() {
      this.getCoupons();
    },
  },
  methods: {
    setCouponExpiredDate(date) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.focusedCoupon.due_date = +this.$moment(date, 'YYYY-MM-DD').format('x');
      this.couponExpiredDate = date;
      this.isDatePickerOpen = false;
    },
    async switchCouponAvaliable({ id: couponId }, isAvaliable) {
      const editedCoupon = this.coupons.find((coupon) => couponId === coupon.id);

      // eslint-disable-next-line @typescript-eslint/camelcase
      editedCoupon.is_enabled = isAvaliable;
      this.$set(this.editingCouponAvaliable, couponId, true);
      await this.$store.dispatch('updateCoupon', editedCoupon);
      this.$set(this.editingCouponAvaliable, couponId, false);
    },
    async getCoupons() {
      this.couponsLoading = true;
      await this.$store.dispatch('getCoupons', this.page);
      this.couponsLoading = false;
    },
    async addOrUpdateCoupon() {
      const apiAction = this.isNewCoupon ? 'addCoupon' : 'updateCoupon';

      this.addingOrUpdatingCoupon = true;
      await this.$store.dispatch(apiAction, this.focusedCoupon);
      this.addingOrUpdatingCoupon = false;
      this.closeCouponDialog();
      await this.getCoupons();
    },
    async deleteCoupon() {
      const couponId = this.focusedCoupon.id;

      this.deletingCoupon = true;
      await this.$store.dispatch('deleteCoupon', couponId);
      this.deletingCoupon = false;
      this.closeDeleteCouponDialog();
      await this.getCoupons();
    },
    openCouponDialog(isNewCoupon, coupon) {
      this.isNewCoupon = isNewCoupon;
      if (isNewCoupon) {
        const defaultExpiredDate = this.$moment().add(1, 'month').format('YYYY-MM-DD');
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.focusedCoupon = { is_enabled: 1, due_date: defaultExpiredDate };
        this.couponExpiredDate = defaultExpiredDate;
      } else {
        this.focusedCoupon = JSON.parse(JSON.stringify(coupon));
        this.couponExpiredDate = this.$moment(coupon.due_date).format('YYYY-MM-DD');
      }
      this.isCouponDialogOpen = true;
    },
    closeCouponDialog() {
      this.$refs.form.reset();
      this.isCouponDialogOpen = false;
    },
    openDeleteCouponDialog(coupon) {
      this.focusedCoupon = coupon;
      this.isDeleteCouponDialogOpen = true;
    },
    closeDeleteCouponDialog() {
      this.isDeleteCouponDialogOpen = false;
    },
  },
  computed: {
    locale() {
      return this.$locale;
    },
    coupons() {
      return this.$store.state.coupons;
    },
    totalPage() {
      return this.$store.state.couponsPagination.total_pages;
    },
    headers() {
      return [
        { text: '優惠券名稱', value: 'title', width: 60 },
        { text: '折價%數', value: 'percent', width: 60 },
        { text: '到期日', value: 'due_date', width: 60 },
        {
          text: '是否啟用',
          value: 'is_enabled',
          align: 'center',
          width: 60,
        },
        {
          text: this.$t('edit'),
          value: 'actions',
          width: 60,
          divider: true,
          sortable: false,
          align: 'center',
        },
      ];
    },
  },
};
</script>
