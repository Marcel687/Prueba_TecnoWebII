<template>
  <nav class="navbar">
    <div class="logo">
      <h1>Mini Vault</h1>
    </div>
    <div class="nav-links">
      <router-link to="/dashboard">Mis Credenciales</router-link>
      <button @click="handleLogout" class="logout-btn">Cerrar Sesión</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // Aquí iría la lógica para limpiar el token
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}
.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>