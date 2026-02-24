import { createRouter, createWebHistory } from "vue-router";

// Importación de las vistas
import UserLogin from "../views/UserLogin.vue";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: UserLogin,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true }, // Marca la ruta como protegida
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardián de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  // Simulamos la verificación de un token en localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere auth y no hay token, lo mandamos al login
    next("/login");
  } else if (to.name === "login" && isAuthenticated) {
    // Si ya está logueado y quiere ir al login, lo mandamos al dashboard
    next("/dashboard");
  } else {
    // En cualquier otro caso, permite la navegación
    next();
  }
});

export default router;
