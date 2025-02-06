<template>
  <div>
    <video ref="video" class="mirrored" autoplay></video>
    <button @click="takePhotoAndNotify">Take Photo</button>
    <img :src="photo" v-if="photo" alt="Photo"/>

    <h3>Vibration Patterns</h3>
    <button @click="vibratePhone(0)">Vibration simple</button>
    <button @click="vibratePhone(1)">Vibration répétée</button>
    <button @click="vibratePhone(2)">Twinkle Twinkle</button>
    <button @click="vibratePhone(3)">Super Mario</button>
    <button @click="vibratePhone(4)">Jingle Bells</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const photo = ref<string | null>(null);
    const video = ref<HTMLVideoElement | null>(null);

    // 🎵 Patterns de vibration
    const patterns = [
      2000, // Vibration unique de 2 secondes
      [2000, 1000, 2000, 1000, 2000, 1000, 2000], // Vibration répétée
      [400, 200, 400, 200, 400, 200, 800, 200, 800, 200, 400, 200, 400, 200, 200, 200], // "Twinkle, Twinkle, Little Star"
      [150, 50, 150, 50, 300, 100, 150, 50, 150, 50, 300, 100, 150, 50, 150, 50], // "Super Mario Bros"
      [300, 200, 300, 200, 300, 400, 300, 200, 300, 200, 300, 400, 300, 200, 600, 200] // "Jingle Bells"
    ];

    // 📳 Fonction de vibration
    const vibratePhone = (patternIndex: number = 0) => {
      if (!navigator.vibrate) {
        console.warn("Vibration API non supportée.");
        return;
      }
      if (patternIndex >= 0 && patternIndex < patterns.length) {
        navigator.vibrate(patterns[patternIndex]);
      } else {
        console.warn("Index de vibration invalide:", patternIndex);
      }
    };

    // 📸 Prendre une photo et envoyer une notification
    const takePhotoAndNotify = () => {
      const canvas = document.createElement('canvas');
      if (video.value) {
        canvas.width = video.value.videoWidth;
        canvas.height = video.value.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video.value, 0, 0);
          photo.value = canvas.toDataURL('image/png');

          // ✅ Notification et vibration après la photo
          showNotification('📷 Photo prise avec succès !');
          vibratePhone(0); // Vibration simple
        }
      }
    };

    // 🔔 Gestion des notifications
    const showNotification = (message: string) => {
      if (!("Notification" in window)) {
        console.warn("Les notifications ne sont pas supportées sur ce navigateur.");
        return;
      }

      if (Notification.permission === "granted") {
        new Notification(message);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(message);
          } else {
            console.warn("Permission de notification refusée.");
          }
        });
      }
    };

    // 🎥 Activer la caméra au montage
    onMounted(() => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (video.value) {
            video.value.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Erreur d’accès à la caméra:', error);
        });
    });

    return { photo, video, takePhotoAndNotify, vibratePhone };
  },
});
</script>

<style scoped>
.mirrored {
  transform: scaleX(-1);
}
</style>
