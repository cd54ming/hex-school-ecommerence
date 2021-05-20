import axios from 'axios';

function setup() {
  axios.defaults.baseURL = process.env.VUE_APP_BASE_API_PATH;
  axios.defaults.withCredentials = true;

  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
  if (token) {
    axios.defaults.headers.common.Authorization = `${token}`;
  }
}

export { setup };
export default { setup };
