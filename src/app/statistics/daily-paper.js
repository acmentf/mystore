import PageComponent from '../../component/statistics/dailyPaper.vue'
import vueTap from 'v-tap';

Vue.use(vueTap);

new Vue(PageComponent).$mount('#app')

GLOBAL_SHOOT.update()