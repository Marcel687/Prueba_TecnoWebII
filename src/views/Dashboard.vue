<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// Simulación de datos que vendrían de GET /credentials
const credentials = ref([
  { id: 1, serviceName: 'Netflix', accountUsername: 'arturo@ejemplo.com', url: 'https://netflix.com', updatedAt: '2026-02-23T10:00:00' },
  { id: 2, serviceName: 'Spotify', accountUsername: 'arturo_music', url: '', updatedAt: '2026-02-20T15:30:00' }
])

// Lógica para buscar por nombre de servicio
const filteredCredentials = computed(() => {
  if (!searchQuery.value) return credentials.value
  return credentials.value.filter(c => 
    c.serviceName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Navegación de acciones
const goToCreate = () => router.push('/credentials/new')
const viewDetail = (id) => router.push(`/credentials/${id}`)
const editCredential = (id) => router.push(`/credentials/${id}/edit`)

const deleteCredential = (id) => {
  if(confirm('¿Estás seguro de eliminar esta credencial?')) {
    // Aquí iría la llamada DELETE /credentials/{id}
    credentials.value = credentials.value.filter(c => c.id !== id)
  }
}
</script>
<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h2>Mis Credenciales</h2>
      <button @click="goToCreate" class="btn-primary">+ Nueva Credencial</button>
    </header>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Buscar por nombre de servicio..."
      />
    </div>

    <table class="credentials-table">
      <thead>
        <tr>
          <th>Servicio</th>
          <th>Usuario/Email</th>
          <th>URL</th>
          <th>Última Actualización</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredCredentials.length === 0">
          <td colspan="5">No se encontraron credenciales.</td>
        </tr>
        <tr v-for="cred in filteredCredentials" :key="cred.id">
          <td>{{ cred.serviceName }}</td>
          <td>{{ cred.accountUsername }}</td>
          <td>
            <a v-if="cred.url" :href="cred.url" target="_blank">Enlace</a>
            <span v-else>-</span>
          </td>
          <td>{{ formatDate(cred.updatedAt) }}</td>
          <td class="actions">
            <button @click="viewDetail(cred.id)">Ver detalle</button>
            <button @click="editCredential(cred.id)">Editar</button>
            <button @click="deleteCredential(cred.id)" class="btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dashboard { padding: 2rem; }
.dashboard-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
.search-bar { margin-bottom: 1rem; }
.search-bar input { width: 100%; padding: 0.5rem; }
.credentials-table { width: 100%; border-collapse: collapse; }
.credentials-table th, .credentials-table td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
.actions button { margin-right: 0.5rem; }
.btn-danger { color: red; }
</style>