<template>
  <div class="container">
    <header class="header">
      <h1>PWA de Victor</h1>
      <img src="./assets/insta.png" alt="Photo de Victor" class="profile-image" />
    </header>

    <h2>Choisissez une fonctionnalité :</h2>

    <div class="button-container">
      <button v-for="key in Object.keys(components)"
              :key="key"
              @click="activeComponent = key as keyof typeof components"
              :class="{ active: activeComponent === key }">
        {{ key }}
      </button>
    </div>

    <div class="component-wrapper">
      <component :is="activeComponent ? components[activeComponent] : null" />
    </div>

    <link rel="manifest" href="/manifest.json">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MyLocation from './components/MyLocation.vue';
import MyCamera from './components/MyCamera.vue';
import MyBattery from "./components/MyBattery.vue";
import PhoneCall from "./components/PhoneCall.vue";
import MyChat from "./components/MyChat.vue";

const components = {
  MyLocation,
  MyCamera,
  MyBattery,
  PhoneCall,
  MyChat
};

const activeComponent = ref<keyof typeof components | null>(null);
</script>

<style scoped>

.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #1e1e1e;
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}


.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.profile-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #42b883;
  transition: transform 0.3s ease-in-out;
}

.profile-image:hover {
  transform: scale(1.1);
}


h1 {
  font-size: 2em;
  margin-bottom: 5px;
}

h2 {
  font-size: 1.5em;
  font-weight: 300;
  margin-bottom: 15px;
}


.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 12px 18px;
  font-size: 1em;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  min-width: 120px;
}

button:hover {
  background: #2c9c72;
  transform: scale(1.05);
}

button.active {
  background: #ffcc00;
  color: #333;
}

.component-wrapper {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #42b883;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 480px) {
  .container {
    max-width: 90%;
    padding: 15px;
  }

  h1 {
    font-size: 1.8em;
  }

  h2 {
    font-size: 1.2em;
  }

  button {
    font-size: 0.9em;
    padding: 10px 15px;
    min-width: 100px;
  }

  .profile-image {
    width: 100px;
    height: 100px;
  }
}
</style>
