<template>
  <div>
    <video ref="video" class="mirrored" autoplay></video>
    <button @click="takePhotoAndNotify">Take Photo</button>
    <img :src="photo" v-if="photo" alt="Photo"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const photo = ref<string | null>(null);
    const video = ref<HTMLVideoElement | null>(null);

    // 📳 Fonction de vibration simple
    const vibratePhone = () => {
      if (navigator.vibrate) {
        navigator.vibrate(200); // Vibration courte de 200ms
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
          vibratePhone();
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

    return { photo, video, takePhotoAndNotify };
  },
});
</script>

<style scoped>
.mirrored {
  transform: scaleX(-1);
}
</style>
