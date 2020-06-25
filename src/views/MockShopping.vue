<template>
  <v-container
    fluid
    id="products-waterfall"
    class="overflow-y-auto"
    style="height: calc(100vh - 56px);"
  >
    <v-row v-if="productsFirstLoading" justify="center" align="center" style="height: 100%;">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
    <v-row justify="center" v-scroll:#products-waterfall="onScroll">
      <v-col cols="auto" v-for="(product, index) in products" :key="index">
        <v-card
          width="280"
          outlined
          @click="openProductDialog(product.id)"
          :disabled="loadingProduct === product.id || !product.is_enabled"
          style="opacity: 1;"
        >
          <v-overlay
            v-if="!product.is_enabled"
            absolute
            color="white"
            style="opacity: 1; pointer-events: none;"
          >
            <v-chip small color="grey">已售罄</v-chip>
          </v-overlay>
          <v-overlay v-if="loadingProduct === product.id" absolute color="grey lighten-2">
            <v-progress-circular indeterminate color="grey lighten-1"></v-progress-circular>
          </v-overlay>
          <v-img
            height="180"
            cover
            :src="
              product.imageUrl ? product.imageUrl : require('@/assets/images/placeholder-image.png')
            "
          >
          </v-img>
          <v-divider></v-divider>
          <v-card-title>
            <span class="subtitle-1"> {{ product.title }} </span>
            <v-chip label x-small class="ml-auto pa-2">{{ product.category }}</v-chip>
          </v-card-title>
          <v-card-subtitle class="text-truncate">{{ product.description }}</v-card-subtitle>
          <v-card-text>
            <v-row class="ma-0" align="center">
              <del class="subtitle-1"> {{ $n(product.origin_price, 'currency') }} </del>
              <span class="ml-auto title black--text">
                {{ $n(product.price, 'currency') }}
              </span>
            </v-row>
          </v-card-text>
          <!-- <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn color="primary" outlined small>查看更多</v-btn>
            <v-btn color="primary" depressed small class="ml-auto">加到購物車</v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="productsLoading" justify="center" align="center">
      <v-progress-circular indeterminate color="primary" class="my-3"></v-progress-circular>
    </v-row>

    <!-- product dialog -->
    <v-dialog v-model="isProductDialogOpen" width="500" :persistent="addingToCart">
      <v-card>
        <v-toolbar flat dense>
          <v-card-title>{{ product.title }}</v-card-title>
          <v-spacer></v-spacer>
          <v-icon @click="closeProductDialog" :disabled="addingToCart">mdi-close</v-icon>
        </v-toolbar>
        <v-divider></v-divider>
        <v-img
          class="mb-5"
          contain
          :src="
            product.imageUrl ? product.imageUrl : require('@/assets/images/placeholder-image.png')
          "
        ></v-img>
        <v-card-subtitle>
          {{ product.description }}
        </v-card-subtitle>
        <v-card-text>
          <p>
            {{ product.content }}
          </p>
          <v-row class="ma-0" align="center">
            <del class="subtitle-1"> {{ $n(product.origin_price, 'currency') }} </del>
            <span class="ml-auto title black--text">
              {{ $n(product.price, 'currency') }}
            </span>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="px-6">
          <v-col cols="auto">
            <v-row align="center">
              <v-btn
                fab
                depressed
                small
                @click="quantityOfOrder -= 1"
                :disabled="quantityOfOrder === 1 || addingToCart"
              >
                <v-icon small>mdi-minus</v-icon>
              </v-btn>
              <v-menu offset-y :disabled="addingToCart">
                <template v-slot:activator="{ on }">
                  <v-btn text v-on="on" class="ma-1" min-width="52">
                    {{ quantityOfOrder }}
                  </v-btn>
                </template>
                <v-card height="200">
                  <v-list>
                    <v-list-item
                      v-for="number in 99"
                      :key="number"
                      @click="quantityOfOrder = number || addingToCart"
                    >
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
              <v-btn
                fab
                depressed
                small
                @click="quantityOfOrder += 1"
                :disabled="quantityOfOrder === 99 || addingToCart"
              >
                <v-icon small>mdi-plus</v-icon>
              </v-btn>
            </v-row>
          </v-col>
          <v-col class="ml-4">
            <v-row>
              <v-btn
                depressed
                large
                width="100%"
                @click="addToCart(product.id, quantityOfOrder)"
                :loading="addingToCart"
                :disabled="addingToCart"
              >
                <span> 新增 {{ quantityOfOrder }} 件商品至購物車 </span>
                <v-spacer></v-spacer>
                <span>{{ $n(quantityOfOrder * product.price, 'currency') }}</span>
              </v-btn>
            </v-row>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      productsLoadedCount: 0,
      products: [],
      productLoading: false,
      loadingProduct: '',
      productsFirstLoading: true,
      productsLoading: false,
      isProductDialogOpen: false,
      addingToCart: false,
      quantityOfOrder: 1,
    };
  },
  watch: {
    async page() {
      await this.getProducts();
    },
  },
  async created() {
    await this.getProducts(this.productsLoadedCount + 1);
    this.productsLoadedCount += 1;
    this.productsFirstLoading = false;
  },
  methods: {
    async openProductDialog(productId) {
      await this.getProduct(productId);
      this.quantityOfOrder = 1;
      this.isProductDialogOpen = true;
    },
    closeProductDialog() {
      this.isProductDialogOpen = false;
    },
    async onScroll(e) {
      if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight) {
        try {
          await this.getProducts(this.productsLoadedCount + 1);
          this.productsLoadedCount += 1;
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    async getProduct(productId) {
      this.loadingProduct = productId;
      await this.$store.dispatch('getProductById', productId);
      this.loadingProduct = '';
    },
    async getProducts(page) {
      if (page > this.totalPage) throw new Error('page exceed.');
      if (this.productsLoading) throw new Error('another process is in progress.');
      this.productsLoading = true;
      await this.$store.dispatch('getProductsForSaleByPage', page);
      this.products = this.products.concat(this.$store.state.productsForSaleByPage);
      this.productsLoading = false;
    },
    async addToCart(productId, quantity) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const products = { product_id: productId, qty: quantity };

      this.addingToCart = true;
      await this.$store.dispatch('addProductsToCart', products);
      this.addingToCart = false;
      this.closeProductDialog();
    },
  },
  computed: {
    totalPage() {
      return this.$store.state.productsForSalePagination.total_pages;
    },
    product() {
      return this.$store.state.product;
    },
  },
};
</script>
