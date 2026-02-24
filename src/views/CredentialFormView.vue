<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const isEditing = ref(!!route.params.id);

const form = ref({
  serviceName: "",
  accountUsername: "",
  password: "",
  url: "",
});

const submit = async () => {
  if (
    !form.value.serviceName ||
    !form.value.accountUsername ||
    !form.value.password
  ) {
    alert("Por favor completa los campos obligatorios");
    return;
  }

  try {
    if (isEditing.value) {
      // PUT /credentials/{id}
      console.log("Editando credencial:", form.value);
    } else {
      // POST /credentials
      console.log("Creando nueva credencial:", form.value);
    }
    router.push("/dashboard");
  } catch (error) {
    alert("Error al guardar la credencial");
  }
};

const cancel = () => router.back();
</script>

<template>
  <div class="form-container">
    <h2>{{ isEditing ? "Editar" : "Nueva" }} Credencial</h2>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label for="serviceName">Nombre del Servicio:</label>
        <input
          type="text"
          id="serviceName"
          v-model="form.serviceName"
          placeholder="Netflix, Gmail, etc."
          required
        />
      </div>

      <div class="form-group">
        <label for="accountUsername">Usuario/Email:</label>
        <input
          type="text"
          id="accountUsername"
          v-model="form.accountUsername"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>

      <div class="form-group">
        <label for="url">URL (opcional):</label>
        <input
          type="url"
          id="url"
          v-model="form.url"
          placeholder="https://ejemplo.com"
        />
      </div>

      <div class="button-group">
        <button type="submit" class="btn-primary">
          {{ isEditing ? "Actualizar" : "Crear" }}
        </button>
        <button type="button" @click="cancel" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
