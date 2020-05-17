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
                <v-btn color="primary" depressed @click="openProductDialog(true)">新增商品</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <template v-slot:item.origin_price="{ item: product }">
          <span class="text-end d-block">{{ product.origin_price }}</span>
        </template>

        <template v-slot:item.price="{ item: product }">
          <span class="text-end d-block">{{ product.price }}</span>
        </template>

        <template v-slot:item.imageUrl="{ item: product }">
          <v-avatar size="42" v-if="product.imageUrl">
            <img :src="product.imageUrl" :alt="product.title" />
          </v-avatar>
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
              @change="switchAvalible(product, $event)"
              :loading="switchAvalibleLoading[product.id]"
              :disabled="switchAvalibleLoading[product.id]"
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
      :persistent="submitDataLoading"
    >
      <v-card :loading="submitDataLoading">
        <v-toolbar flat dense dark color="primary">
          <v-toolbar-title>{{
            (() => (isNewProduct ? '新增商品' : '修改商品資訊'))()
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeProductDialog" :disabled="submitDataLoading">
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
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="product.category"
                    label="商品分類"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="product.unit" label="單位" dense required></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="product.origin_price"
                    label="原價"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="product.price" label="售價" dense required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="product.image"
                    color="primary"
                    label="圖片"
                    prepend-icon=""
                    :show-size="1000"
                    dense
                  >
                    <template v-slot:selection="{ text }">
                      <v-chip color="primary" dark label small> {{ text }}</v-chip>
                    </template>
                  </v-file-input>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    dense
                    v-model="product.description"
                    rows="4"
                    label="商品描述"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    dense
                    v-model="product.content"
                    rows="4"
                    label="說明內容"
                  ></v-textarea>
                </v-col>
                <v-col cols="auto">
                  <v-switch
                    dense
                    v-model="product.is_enabled"
                    :false-value="0"
                    :true-value="1"
                    label="是否啟用"
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
            :disabled="submitDataLoading"
            @click="closeProductDialog"
            >取消</v-btn
          >
          <v-btn
            depressed
            color="primary"
            :disabled="submitDataLoading"
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
      getProductsLoading: false,
      submitDataLoading: false,
      deleteProductLoading: false,
      switchAvalibleLoading: {},
      deleteProductDialog: false,
      productDialog: false,
      isNewProduct: false,
      productWillbeDeleted: {},
      page: 1,
      pageCount: 0,
      product: {},
    };
  },

  async created() {
    this.headers = [
      { text: '分類', value: 'category', width: 60 },
      { text: '商品名稱', value: 'title', width: 90 },
      { text: '原價', value: 'origin_price', width: 60 },
      { text: '售價', value: 'price', width: 30 },
      { text: '單位', value: 'unit', width: 30 },
      { text: '圖片', value: 'imageUrl', width: 60 },
      {
        text: '是否啟用',
        value: 'is_enabled',
        width: 60,
        align: 'center',
      },
      {
        text: '編輯',
        value: 'actions',
        width: 60,
        divider: true,
        sortable: false,
        align: 'center',
      },
    ];
    this.productInitialize();
    await this.getProducts();
  },

  computed: {
    ...mapState({
      productsAll: (state) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        Object.values(state.productsAll).map((product) => ({
          ...product,
          // eslint-disable-next-line @typescript-eslint/camelcase
        })),
    }),
  },

  methods: {
    async switchAvalible({ id: productId }, isAvalible: number) {
      const originalProduct = this.productsAll.find((product) => productId === product.id);
      // eslint-disable-next-line @typescript-eslint/camelcase
      originalProduct.is_enabled = isAvalible;
      this.$set(this.switchAvalibleLoading, productId, true);
      await this.$store.dispatch('updateProduct', {
        productId,
        apiParams: { data: originalProduct },
      });
      this.$set(this.switchAvalibleLoading, productId, false);
    },
    async deleteProduct() {
      this.deleteProductLoading = true;
      await this.$store.dispatch('deleteProduct', this.productWillbeDeleted.id);
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
      this.productDialog = true;
    },
    closeProductDialog() {
      this.productDialog = false;
    },
  },
});
</script>
