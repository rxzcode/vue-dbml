export {};

declare module 'vue' {
    export interface GlobalComponents {
        RouterLink: typeof import('vue-router')['RouterLink'];
        RouterView: typeof import('vue-router')['RouterView'];
        ViewPage: typeof import('./src/components/page/ViewPage.vue')['default'];
    }
}
