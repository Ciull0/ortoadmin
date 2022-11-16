import Vue from 'vue';
import VueRouter from 'vue-router'

import NotesEdit from '../components/notes/NotesEdit.vue'
import NotesList from '../components/notes/NotesList.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

Vue.use(VueRouter);



const routes = [
    {
        name: 'notes',
        path: '/',
        components: {
          default: NotesEdit,
          left: NotesList
        },
        params:{
          title:'Notes'
        },
        label: 'Notes',
        closable: false,
        menu:true
      },
    {
      name: 'login',
      path: '/login',
      component: Login,
      params:{
      }
    },
    {
      name: 'register',
      path: '/register',
      component: Register,
      params:{
      }
    },
    
  ];
  
  
  const router = new VueRouter({
    routes // short for `routes: routes`
  })
  
  router.beforeEach(async (to, from,next) => {
    if (localStorage.getItem('userToken')==null && to.name !== 'login' && to.name !== 'register') next({ name: 'login' })
    else next()
  })

  export default router;