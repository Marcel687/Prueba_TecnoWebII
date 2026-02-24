import { createRouter, createWebHistory } from 'vue-router'

// Importación de las vistas
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CredentialFormView from '../views/CredentialFormView.vue'
import CredentialDetailView from '../views/CredentialDetailView.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView 
  },
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true } // Marca la ruta como protegida
  },
  { 
    path: '/credentials/new', 
    name: 'create-credential', 
    component: CredentialFormView,
    meta: { requiresAuth: true }
  },
  { 
    // Usamos un parámetro dinámico :id para saber qué credencial ver
    path: '/credentials/:id', 
    name: 'credential-detail', 
    component: CredentialDetailView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/credentials/:id/edit', 
    name: 'edit-credential', 
    component: CredentialFormView, // Reutilizamos el formulario para editar
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardián de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  // Simulamos la verificación de un token en localStorage
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere auth y no hay token, lo mandamos al login
    next('/login')
  } else if (to.name === 'login' && isAuthenticated) {
    // Si ya está logueado y quiere ir al login, lo mandamos al dashboard
    next('/dashboard')
  } else {
    // En cualquier otro caso, permite la navegación
    next()
  }
})

export default router