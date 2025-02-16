import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';
import '@/libs/ace/ace-config.js';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@/assets/css/simple-line-icons.css';
import '@/assets/css/styles.css';

const pinia = createPinia();
import App from './App.vue';

const router = createRouter({
    history: createWebHashHistory(),
    strict: true,
    routes: [
        {
            name: 'view-page',
            path: '/view/',
            component: () => import('@/coms/page/ViewPage.vue')
        },
        {
            name: 'otherwise',
            path: '/(.*)?',
            redirect: { name: 'view-page' }
        },
        {
            name: 'otherwise',
            path: '/',
            redirect: { name: 'view-page' }
        }
    ]
});
createApp(App).use(pinia).use(router).mount('#app');
