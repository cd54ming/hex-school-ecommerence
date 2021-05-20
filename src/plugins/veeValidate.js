import Vue from 'vue';
// eslint-disable-next-line object-curly-newline
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import vTextFieldWithValidation from '@/components/input/VTextFieldWithValidation.vue';
// eslint-disable-next-line
import {
  required,
  numeric,
  email,
  min,
  max,
  digits,
  integer,
  min_value as minValue,
  max_value as maxValue,
} from 'vee-validate/dist/rules';
import moment from 'moment';
// import i18n from '@/i18n';
import zhTW from 'vee-validate/dist/locale/zh_TW.json';
import en from 'vee-validate/dist/locale/en.json';

localize({
  'zh-TW': zhTW,
  'en-US': en,
});

function RegisterComponent() {
  Vue.component('validation-provider', ValidationProvider);
  Vue.component('validation-observer', ValidationObserver);
  Vue.component('v-text-field-with-validation', vTextFieldWithValidation);
}

// TODO
function extendRules() {
  extend('required', required);
  extend('numeric', numeric);
  extend('integer', integer);
  extend('email', email);
  extend('min', min);
  extend('max', max);
  extend('min_value', minValue);
  extend('max_value', maxValue);
  extend('digits', digits);
  extend('MM/DD', {
    validate(value) {
      return {
        valid: moment(value, 'MM/DD', true).isValid(),
      };
    },
    message: (field) => `${field} 格式為 MM/DD`,
    computesRequired: true,
  });
  // customize vee-validate error message
  // message: (_, values) => i18n.t('product-name', values)
}

function setDefaultLoale() {
  localize(process.env.VUE_APP_DEFAULT_LOCALE || 'en-US');
}

function setup() {
  RegisterComponent();
  extendRules();
  setDefaultLoale();
}

export { setup, localize };

export default {
  setup,
  localize,
};
