<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Simulación de datos - en la práctica vendría de GET /credentials/{id}
const credential = ref({
  id: route.params.id,
  serviceName: "Netflix",
  accountUsername: "usuario@ejemplo.com",
  password: "••••••••",
  url: "https://netflix.com",
  updatedAt: "2026-02-23T10:00:00",
});

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const editCredential = () => {
  router.push(`/credentials/${credential.value.id}/edit`);
};

const deleteCredential = () => {
  if (confirm("¿Estás seguro de que deseas eliminar esta credencial?")) {
    // DELETE /credentials/{id}
    router.push("/dashboard");
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="detail-container">
    <button @click="goBack" class="btn-back">← Volver</button>

    <div class="credential-card">
      <h2>{{ credential.serviceName }}</h2>

      <div class="detail-group">
        <label>Usuario/Email:</label>
        <p>{{ credential.accountUsername }}</p>
      </div>

      <div class="detail-group">
        <label>Contraseña:</label>
        <div class="password-container">
          <p>{{ showPassword ? credential.password : "••••••••" }}</p>
          <button @click="togglePassword" class="btn-toggle">
            {{ showPassword ? "Ocultar" : "Mostrar" }}
          </button>
        </div>
      </div>

      <div class="detail-group" v-if="credential.url">
        <label>URL:</label>
        <a :href="credential.url" target="_blank">{{ credential.url }}</a>
      </div>

      <div class="detail-group">
        <label>Última actualización:</label>
        <p>{{ new Date(credential.updatedAt).toLocaleDateString() }}</p>
      </div>

      <div class="button-group">
        <button @click="editCredential" class="btn-primary">Editar</button>
        <button @click="deleteCredential" class="btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.btn-back {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
}

.btn-back:hover {
  text-decoration: underline;
}

.credential-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.credential-card h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 1rem;
}

.detail-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 0.5rem;
}

p {
  margin: 0;
  color: #333;
  word-break: break-all;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.password-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-toggle:hover {
  background-color: #5a6268;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-danger {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
