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
  const sanitizedNumber = phoneNumber.value.replace(/\D/g, '');
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
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 300px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
  outline: none;
}

button {
  width: 100%;
  background-color: #007bff;
  color: white;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .phone-call {
    width: 90%;
    padding: 15px;
  }

  input, button {
    font-size: 14px;
    padding: 8px;
  }
}

</style>
