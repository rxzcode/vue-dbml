import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

const pinia = createPinia();
import App from './App.vue';

const router = createRouter({
    history: createWebHistory(),
    strict: true,
    routes: [
        {
            name: 'view-page',
            path: '/',
            component: () => import('@/coms/pages/ViewPage.vue')
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
