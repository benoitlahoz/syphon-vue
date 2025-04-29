import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    alias: ['/index.html'],
    component: () => import('../views/MainView.vue'),
  },
  {
    path: '/syphon-server/:id',
    component: () => import('../views/SyphonView.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
