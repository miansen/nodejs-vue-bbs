import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/client/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/add_invitation',
    name: 'AddInvitation',
    component: () => import('@/pages/client/views/AddInvitation.vue')
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/pages/client/views/Mine.vue')
  },
  {
    path: '/invitation_detail',
    name: 'InvitationDetail',
    component: () => import('@/pages/client/views/InvitationDetail.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/pages/admin/views/Users.vue')
  },
  {
    path: '/invitations',
    name: 'Invitations',
    component: () => import('@/pages/admin/views/Invitations.vue')
  },
  {
    path: '/tabs',
    name: 'tabs',
    component: () => import('@/pages/admin/views/Tabs.vue')
  },
  {
    path: '/xxjj',
    name: 'xxjj',
    component: () => import('@/pages/admin/views/Xxjj.vue')
  }
]

const router = new VueRouter({
  routes
})

const auth = () => {
  const user = JSON.parse(window.sessionStorage.getItem('user') || null)
  return !!user
}

const whiteList = ['/register', '/login']

router.beforeEach((to, from, next) => {
  if (whiteList.includes(to.path)) {
    next()
  } else {
    if (auth()) {
      next()
    } else {
      next({ name: 'Login' })
    }
  }
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

export default router
