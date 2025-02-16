import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    strict: true,
    routes: [
        {
            name: 'view-page',
            path: '/view/',
            component: () => import('../components/page/ViewPage.vue')
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

export default router;
