
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/I18N.vue') },
      { path: '/upload-image', component: () => import('src/pages/UploadImage.vue') },
      { path: '/upload-music', component: () => import('src/pages/UploadMusic.vue') },
      { path: '/emoji', component: () => import('src/pages/EmojiButton.vue') },
      { path: '/i18n', component: () => import('src/pages/I18N.vue') },
      { path: '/videochat', component: () => import('src/pages/VideoChat.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
