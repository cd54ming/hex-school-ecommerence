<template>
  <v-container fluid>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="$store.state.productsByPage"
        :items-per-page="10"
        :loading="getProductsLoading"
        :page.sync="page"
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
          <span class="text-right d-block" v-if="product.origin_price">
            {{ $n(product.origin_price, 'currency') }}
          </span>
        </template>

        <template v-slot:item.price="{ item: product }">
          <span class="text-right d-block" v-if="product.price">
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
              @change="switchProductAvaliable(product, $event)"
              :loading="switchAvaliableLoading[product.id]"
              :disabled="switchAvaliableLoading[product.id]"
            ></v-switch>
          </v-row>
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

    <!-- 新增商品 Dialog -->
    <v-dialog
      v-model="productDialog"
      max-width="450"
      :persistent="submitDataLoading || uploadImageLoading"
    >
      <v-card :loading="submitDataLoading">
        <validation-observer ref="form" v-slot="{ handleSubmit }">
          <v-toolbar flat dense dark color="primary">
            <v-toolbar-title
              v-text="(isNewProduct? $t('add-new-product'): $t('edit-product-info'))"
            ></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              ref="closeProductDialogIcon"
              icon
              @click="closeProductDialog"
              @keyup.enter="closeProductDialog"
              :disabled="submitDataLoading || uploadImageLoading"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <form>
              <v-container>
                <v-row>
                  <v-col cols="12" class="py-0">
                    <v-text-field-with-validation
                      rules="required"
                      v-model="product.title"
                      :label="$t('product-name')"
                      dense
                      outlined
                      :disabled="submitDataLoading"
                    ></v-text-field-with-validation>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field-with-validation
                      rules="required"
                      v-model="product.category"
                      :label="$t('product-category')"
                      dense
                      outlined
                      :disabled="submitDataLoading"
                    ></v-text-field-with-validation>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field-with-validation
                      rules="required"
                      v-model="product.unit"
                      :label="$t('product-unit')"
                      dense
                      outlined
                      :disabled="submitDataLoading"
                    ></v-text-field-with-validation>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field-with-validation
                      rules="required|numeric"
                      v-model="product.origin_price"
                      :label="$t('product-origin-price')"
                      dense
                      outlined
                      :disabled="submitDataLoading"
                    ></v-text-field-with-validation>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field-with-validation
                      rules="required|numeric"
                      v-model="product.price"
                      :label="$t('product-price')"
                      dense
                      outlined
                      :disabled="submitDataLoading"
                    ></v-text-field-with-validation>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <validation-provider>
                      <v-file-input
                        v-model="uploadedImage"
                        :loading="uploadImageLoading"
                        :disabled="uploadImageLoading"
                        accept="image/png, image/jpeg, image/bmp"
                        color="primary"
                        :label="$t('image')"
                        prepend-icon=""
                        dense
                        outlined
                        @change="uploadImage"
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip color="primary" dark label small> {{ text }}</v-chip>
                        </template>
                      </v-file-input>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" class="py-0 mb-8" v-if="isNewProduct && uploadedImage">
                    <v-img :src="uploadedImageUrl"> </v-img>
                  </v-col>
                  <v-col cols="12" class="py-0 mb-8" v-else-if="!isNewProduct && product.imageUrl">
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
                  <v-col cols="12" class="py-0">
                    <validation-provider>
                      <v-textarea
                        dense
                        outlined
                        v-model="product.description"
                        rows="4"
                        :label="$t('product-description')"
                        :disabled="submitDataLoading"
                      ></v-textarea>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <validation-provider>
                      <v-textarea
                        dense
                        outlined
                        v-model="product.content"
                        rows="4"
                        :label="$t('product-content')"
                        :disabled="submitDataLoading"
                      ></v-textarea>
                    </validation-provider>
                  </v-col>
                  <v-col cols="auto" class="py-0">
                    <validation-provider>
                      <v-switch
                        v-model="product.is_enabled"
                        class="ma-0"
                        :false-value="0"
                        :true-value="1"
                        :label="$t('avaliable')"
                        :disabled="submitDataLoading"
                      >
                      </v-switch>
                    </validation-provider>
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
              >{{ $t('cancel') }}</v-btn
            >
            <v-btn
              depressed
              color="primary"
              :disabled="submitDataLoading || uploadImageLoading"
              :loading="submitDataLoading"
              @click="handleSubmit(submitData)"
              v-text="(isNewProduct ? $t('add') : $t('update'))"
            ></v-btn>
          </v-card-actions>
        </validation-observer>
      </v-card>
    </v-dialog>

    <!-- 刪除商品 Dialog -->
    <v-dialog v-model="isDeleteProductDialogOpen" width="280" :persistent="deletingProduct">
      <v-card>
        <v-toolbar dense flat color="error" dark>
          <v-spacer></v-spacer>
          <v-icon @click="closeDeleteProductDialog" :disabled="deletingProduct">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="py-6">
          <span class="subtitle-1">
            確定要刪除商品
            <span class="error--text">{{ productWillbeDeleted.title }}</span>
            嗎?
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="closeDeleteProductDialog" :disabled="deletingProduct">否</v-btn>
          <v-btn
            depressed
            color="error"
            @click="deleteProduct"
            :disabled="deletingProduct"
            :loading="deletingProduct"
            >是</v-btn
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
      options: {},
      getProductsLoading: false,
      submitDataLoading: false,
      deletingProduct: false,
      switchAvaliableLoading: {},
      isDeleteProductDialogOpen: false,
      uploadedImage: undefined,
      uploadImageLoading: false,
      productDialog: false,
      isNewProduct: false,
      productWillbeDeleted: {},
      product: {},
      page: 1,
    };
  },

  watch: {
    page() {
      this.getProducts();
    },
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
    products() {
      return this.$store.state.productsByPage;
    },
    totalPage() {
      return this.$store.state.productsPagination.total_pages;
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
      this.uploadedImage = undefined;
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
    async switchProductAvaliable({ id: productId }, isAvaliable: number) {
      const editedProduct = this.products.find((product) => productId === product.id);
      // eslint-disable-next-line @typescript-eslint/camelcase
      editedProduct.is_enabled = isAvaliable;
      this.$set(this.switchAvaliableLoading, productId, true);
      await this.$store.dispatch('updateProduct', editedProduct);
      this.$set(this.switchAvaliableLoading, productId, false);
    },
    async deleteProduct() {
      this.deletingProduct = true;
      await this.$store.dispatch('deleteProduct', this.productWillbeDeleted.id);
      this.deletingProduct = false;
      this.closeDeleteProductDialog();
      await this.getProducts();
    },
    async getProducts() {
      this.getProductsLoading = true;
      await this.$store.dispatch('getProductsByPage', this.page);
      this.getProductsLoading = false;
    },
    async submitData() {
      this.submitDataLoading = true;
      if (this.isNewProduct) {
        await this.$store.dispatch('addProduct', this.product);
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
      this.productWillbeDeleted = product;
      this.isDeleteProductDialogOpen = true;
    },
    closeDeleteProductDialog() {
      this.isDeleteProductDialogOpen = false;
    },
    async openProductDialog(isNew: boolean, product: object) {
      this.isNewProduct = isNew;
      if (isNew) {
        this.productInitialize();
      } else {
        this.product = { ...product };
      }
      this.uploadedImage = undefined;
      this.productDialog = true;
      this.$nextTick(() => {
        this.$refs.form.reset();
        console.log(document.activeElement);
        // console.log(this.$refs.closeProductDialogIcon);
        // this.$refs.closeProductDialogIcon.focus();
      });
    },
    closeProductDialog() {
      this.productDialog = false;
    },
  },
});
</script>
