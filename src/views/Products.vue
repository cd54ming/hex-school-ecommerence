<template>
  <v-container fluid>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="productsAll"
        :items-per-page="10"
        :loading="getProductsLoading"
        :page.sync="page"
        @page-count="pageCount = $event"
        hide-default-footer
        item-key="id"
        style="width: 100%;"
      >
        <template v-slot:top>
          <v-container>
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <v-btn color="primary" depressed @click="openProductDialog(true)">{{
                  $t('create-new-product')
                }}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <template v-slot:item.origin_price="{ item: product }">
          <span class="text-end d-block" v-if="product.origin_price">
            {{ $n(product.origin_price, 'currency') }}
          </span>
        </template>

        <template v-slot:item.price="{ item: product }">
          <span class="text-end d-block" v-if="product.price">
            {{ $n(product.price, 'currency') }}
          </span>
        </template>

        <template v-slot:item.imageUrl="{ item: product }">
          <v-container class="py-2">
            <v-row align="center" justify="center">
              <v-img
                :src="product.imageUrl"
                :alt="product.title"
                max-height="50"
                max-width="50"
              ></v-img>
            </v-row>
          </v-container>
          <!-- <v-avatar size="42" v-if="product.imageUrl" tile>
            <img :src="product.imageUrl" :alt="product.title" />
          </v-avatar> -->
        </template>

        <template v-slot:item.actions="{ item: product }">
          <v-icon class="mr-2" @click="openProductDialog(false, product)">
            mdi-pencil
          </v-icon>
          <v-icon @click="openDeleteProductDialog(product)">
            mdi-delete
          </v-icon>
        </template>

        <template v-slot:item.is_enabled="{ item: product }">
          <v-row justify="center">
            <v-switch
              :input-value="product.is_enabled"
              :false-value="0"
              :true-value="1"
              @change="switchAvaliable(product, $event)"
              :loading="switchAvaliableLoading[product.id]"
              :disabled="switchAvaliableLoading[product.id]"
            ></v-switch>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-container>
            <v-row justify="center">
              <v-col>
                <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-data-table>
    </v-row>

    <v-dialog v-model="deleteProductDialog" width="300" :persistent="deleteProductLoading">
      <v-card :loading="deleteProductLoading">
        <template v-slot:progress>
          <v-progress-linear
            :active="true"
            :indeterminate="true"
            absolute
            color="error darken-1"
          ></v-progress-linear>
        </template>
        <v-toolbar flat dense dark color="error">
          <v-toolbar-title>刪除商品</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDeleteProductDialog" :disabled="deleteProductLoading">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-6">
          <p class="body-1">
            你確定要刪除商品
            <span class="error--text font-weight-bold"> {{ productWillbeDeleted.title }}</span>
            嗎?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="closeDeleteProductDialog" :disabled="deleteProductLoading"
            >取消</v-btn
          >
          <v-btn
            depressed
            color="error"
            @click="deleteProduct"
            :disabled="deleteProductLoading"
            :loading="deleteProductLoading"
            >刪除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="productDialog"
      max-width="450"
      min-width="350"
      :persistent="submitDataLoading || uploadImageLoading"
    >
      <v-card :loading="submitDataLoading">
        <v-toolbar flat dense dark color="primary">
          <v-toolbar-title>{{
            (() => (isNewProduct ? '新增商品' : '修改商品資訊'))()
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="closeProductDialog"
            :disabled="submitDataLoading || uploadImageLoading"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <form>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="product.title"
                    label="商品名稱"
                    dense
                    required
                    :disabled="submitDataLoading"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="product.category"
                    label="商品分類"
                    dense
                    required
                    :disabled="submitDataLoading"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="product.unit"
                    label="單位"
                    dense
                    required
                    :disabled="submitDataLoading"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="product.origin_price"
                    label="原價"
                    dense
                    required
                    :disabled="submitDataLoading"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="product.price"
                    label="售價"
                    dense
                    required
                    :disabled="submitDataLoading"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="uploadedImage"
                    :loading="uploadImageLoading"
                    :disabled="uploadImageLoading"
                    accept="image/png, image/jpeg, image/bmp"
                    color="primary"
                    label="圖片"
                    prepend-icon=""
                    dense
                    @change="uploadImage"
                  >
                    <template v-slot:selection="{ text }">
                      <v-chip color="primary" dark label small> {{ text }}</v-chip>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col cols="12" v-if="isNewProduct && uploadedImage">
                  <v-img :src="uploadedImageUrl"> </v-img>
                </v-col>
                <v-col cols="12" v-else-if="!isNewProduct && product.imageUrl">
                  <v-img :src="uploadedImageUrl || product.imageUrl">
                    <!-- <v-row> -->
                    <v-avatar
                      size="20"
                      class="float-right ma-1 grey lighten-1"
                      style="opacity: 0.75;"
                    >
                      <v-icon
                        @click="clearProductImage"
                        color="white"
                        small
                        :disabled="submitDataLoading"
                        >mdi-close</v-icon
                      >
                    </v-avatar>
                  </v-img>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    dense
                    v-model="product.description"
                    rows="4"
                    label="商品描述"
                    :disabled="submitDataLoading"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    dense
                    v-model="product.content"
                    rows="4"
                    label="說明內容"
                    :disabled="submitDataLoading"
                  ></v-textarea>
                </v-col>
                <v-col cols="auto">
                  <v-switch
                    dense
                    v-model="product.is_enabled"
                    :false-value="0"
                    :true-value="1"
                    label="是否啟用"
                    :disabled="submitDataLoading"
                  >
                  </v-switch>
                </v-col>
              </v-row>
            </v-container>
          </form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="secondary"
            :disabled="submitDataLoading || uploadImageLoading"
            @click="closeProductDialog"
            >取消</v-btn
          >
          <v-btn
            depressed
            color="primary"
            :disabled="submitDataLoading || uploadImageLoading"
            :loading="submitDataLoading"
            @click="submitData"
            >{{ (() => (isNewProduct ? '新增' : '修改'))() }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  data() {
    return {
      validateTest: 0,
      getProductsLoading: false,
      submitDataLoading: false,
      deleteProductLoading: false,
      switchAvaliableLoading: {},
      deleteProductDialog: false,
      uploadedImage: '',
      uploadImageLoading: false,
      productDialog: false,
      isNewProduct: false,
      productWillbeDeleted: {},
      page: 1,
      pageCount: 0,
      product: {
        image: '',
        imageUrl: '',
      },
    };
  },

  async created() {
    this.productInitialize();
    await this.getProducts();
  },

  computed: {
    headers() {
      return [
        { text: this.$t('category'), value: 'category', width: 60 },
        { text: this.$t('product-title'), value: 'title', width: 90 },
        { text: this.$t('original-price'), value: 'origin_price', width: 30 },
        { text: this.$t('price'), value: 'price', width: 30 },
        { text: this.$t('unit'), value: 'unit', width: 30 },
        {
          text: this.$t('image'),
          value: 'imageUrl',
          width: 60,
          align: 'center',
        },
        {
          text: this.$t('avaliable'),
          value: 'is_enabled',
          width: 60,
          align: 'center',
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
    uploadedImageUrl() {
      return this.$store.state.uploadedImageUrl;
    },
    productsAll() {
      const { productsAll } = this.$store.state;
      return Object.values(productsAll).map((product) => ({ ...product }));
    },
    // ...mapState({
    //   uploadedImageUrl: 'uploadedImageUrl',
    //   productsAll(state: any) {
    //     return Object.values(state.productsAll).map((product) => ({ ...product }));
    //   },
    // }),
  },

  methods: {
    clearProductImage() {
      this.uploadedImage = '';
      this.product.image = '';
      this.product.imageUrl = '';
    },
    async uploadImage() {
      if (this.uploadedImage) {
        const formData = new FormData();
        formData.append('file-to-upload', this.uploadedImage);
        this.uploadImageLoading = true;
        await this.$store.dispatch('uploadImage', formData);
        this.uploadImageLoading = false;
        this.product.image = this.uploadedImage.name;
        this.product.imageUrl = this.uploadedImageUrl;
      } else {
        this.product.image = '';
        this.product.imageUrl = '';
        this.$store.commit('uploadedImageUrl', '');
      }
    },
    async switchAvaliable({ id: productId }, isAvaliable: number) {
      const originalProduct = this.productsAll.find((product) => productId === product.id);
      // eslint-disable-next-line @typescript-eslint/camelcase
      originalProduct.is_enabled = isAvaliable;
      this.$set(this.switchAvaliableLoading, productId, true);
      await this.$store.dispatch('updateProduct', {
        productId,
        apiParams: { data: originalProduct },
      });
      this.$set(this.switchAvaliableLoading, productId, false);
    },
    async deleteProduct() {
      this.deleteProductLoading = true;
      try {
        await this.$store.dispatch('deleteProduct', this.productWillbeDeleted.id);
      } catch (error) {
        console.log(error);
      }
      this.deleteProductLoading = false;
      this.closeDeleteProductDialog();
      setTimeout(() => {
        this.productWillbeDeleted = {};
      }, 300);
      await this.getProducts();
    },
    async getProducts() {
      this.getProductsLoading = true;
      await this.$store.dispatch('getProducts');
      console.log(this.productsAll);
      this.getProductsLoading = false;
    },
    async submitData() {
      this.submitDataLoading = true;
      if (this.isNewProduct) {
        await this.$store.dispatch('addProduct', { data: this.product });
      } else {
        await this.$store.dispatch('updateProduct', {
          productId: this.product.id,
          apiParams: { data: this.product },
        });
      }
      this.submitDataLoading = false;
      this.closeProductDialog();
      await this.getProducts();
    },
    productInitialize() {
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.product = { is_enabled: 1 };
    },
    openDeleteProductDialog(product: object) {
      this.deleteProductDialog = true;
      this.productWillbeDeleted = product;
    },
    closeDeleteProductDialog() {
      this.deleteProductDialog = false;
    },
    openProductDialog(isNew: boolean, product: object) {
      this.isNewProduct = isNew;
      if (isNew) {
        this.productInitialize();
      } else {
        this.product = { ...product };
      }
      this.uploadedImage = '';
      this.productDialog = true;
    },
    closeProductDialog() {
      this.productDialog = false;
    },
  },
});
</script>
