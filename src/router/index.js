import Vue from 'vue'
import Router from 'vue-router'
import Main from'./../components/Main.vue'
import Detail from './../components/Detail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/Detail/:id/:bookname/:name/:bookid',
      name: 'Detail',
      component: Detail
    },
  ]
})
