<script setup>
import { resolve } from 'core-js/fn/promise';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
    errorMessage.value = ''

    if(!email.value || !password.value){
        errorMessage.value = 'Ambos campos son obligatorios'
        return
    }
    if(!email.value.includes('@')){
        errorMessage.value = 'Por favor, ingresa un email valido'
        return
    }

    isLoading.value = true

    try{
        await new Promise(resolve => setTimeout(resolve, 1000))
    }catch(error){
        errorMessage.value = 'Credenciales invalidas o error de conexion'
    }finally{
        isLoading.value = false
    }
}
</script>
<template>
    <div class="login-container">
        <h2>Iniciar Sesion</h2>
        <form @submit.prevent="login" class="login-form">
            <div class="form-group">
                <label for="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    placeholder="correo@ejemplo.com"
                />
            </div>

            <div class="form-group">
                <label for="password">Contraseña:</label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="password" 
                />
            </div>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Cargando...' : 'Entrar'}}
            </button>
        </form>
    </div>

</template>

<style>
    .error{color: red; font-size: 0.9rem;}
    .login-container{max-width: 400px; margin: 2rem auto;}
    .form-group{margin-bottom: 1rem; display: flex; flex-direction: column;}
</style>