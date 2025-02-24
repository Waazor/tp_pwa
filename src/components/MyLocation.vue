<template>
  <div>
    <div ref="mapContainer" class="map-container"></div>
    <p v-if="error">{{ error }}</p>
    <p v-if="loading">Loading...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'MyLocation',
  setup() {
    const mapContainer = ref<HTMLElement | null>(null);
    const map = ref<L.Map | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const initializeMap = (lat: number, lng: number) => {
      if (!mapContainer.value) {
        error.value = 'Map container not found';
        return;
      }

      map.value = L.map(mapContainer.value).setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map.value as L.Map);

      L.marker([lat, lng])
        .addTo(map.value as L.Map)
        .bindPopup('You are here!')
        .openPopup();
    };

    onMounted(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            initializeMap(latitude, longitude);
            loading.value = false;
          },
          (err) => {
            error.value = `Error getting location: ${err.message}`;
            loading.value = false;
          }
        );
      } else {
        error.value = 'Geolocation is not supported by this browser.';
        loading.value = false;
      }
    });

    return { mapContainer, loading, error };
  },
});
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
}
</style>
