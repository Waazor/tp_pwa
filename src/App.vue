<template>
  <div class="header">
    <h1>PWA de Vi</h1>
    <img src="./assets/insta.png" alt="Photo de Victor" class="profile-image" />
  </div>

  <h1>Choisissez une fonctionnalité :</h1>

  <div class="button-container">
    <button v-for="key in Object.keys(components)" :key="key" @click="activeComponent = key as keyof typeof components">
      {{ key }}
    </button>
  </div>

  <!-- Affichage dynamique du composant sélectionné -->
  <component :is="activeComponent ? components[activeComponent] : null" />

  <link rel="manifest" href="/manifest.json">
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MyLocation from './components/MyLocation.vue';
import MyCamera from './components/MyCamera.vue';
import MyBattery from "./components/MyBattery.vue";
import PhoneCall from "./components/PhoneCall.vue";

// Liste des composants disponibles
const components = {
  MyLocation,
  MyCamera,
  MyBattery,
  PhoneCall
};

// État pour suivre le composant actif
const activeComponent = ref<keyof typeof components | null>(null);
</script>

<style scoped>
/* En-tête */
.header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 2em;
  color: #f9f9f9;
  margin-bottom: 10px;
}


.profile-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #42b883;
}

/* Boutons */
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px 15px;
  font-size: 1em;
  border: none;
  background-color: #42b883;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: #2c9c72;
}
</style>
