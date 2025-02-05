<template>
  <div class="phone-call">
    <input v-model="phoneNumber" type="tel" placeholder="Entrez un numéro" />
    <button @click="makeCall">Appeler</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const phoneNumber = ref('');

const makeCall = () => {
  const sanitizedNumber = phoneNumber.value.replace(/\D/g, ''); // Nettoie le numéro
  if (sanitizedNumber) {
    window.location.href = `tel:${sanitizedNumber}`;
  } else {
    alert('Veuillez entrer un numéro valide');
  }
};
</script>

<style scoped>
.phone-call {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 200px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  background-color: #007bff;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
