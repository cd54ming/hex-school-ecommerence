import axios from 'axios';

function setup() {
  axios.defaults.baseURL = process.env.VUE_APP_BASE_API_PATH;
  axios.defaults.withCredentials = true;
}

export { setup };
export default { setup };
