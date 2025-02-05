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

    // Demande la permission pour les notifications au montage du composant
    onMounted(() => {
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          console.log("Notification permission:", permission);
        });
      }

      // Accès à la caméra
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (video.value) {
            video.value.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    });

    const takePhotoAndNotify = () => {
      const canvas = document.createElement('canvas');
      if (video.value) {
        canvas.width = video.value.videoWidth;
        canvas.height = video.value.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video.value, 0, 0);
          photo.value = canvas.toDataURL('image/png');
          showNotification('Photo prise avec succès ! 📸');
          vibratePhone();
        }
      }
    };

    const vibratePhone = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]); // Vibration avec un pattern
      } else {
        console.warn('Vibration non supportée sur cet appareil.');
      }
    };

    const showNotification = (message: string) => {
      if (!('Notification' in window)) {
        console.warn('Notifications non supportées par ce navigateur.');
        return;
      }

      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(message);
          } else {
            console.warn('Permission de notification refusée.');
          }
        });
      }
    };

    return { photo, video, takePhotoAndNotify };
  },
});
</script>

<style scoped>
.mirrored {
  transform: scaleX(-1);
}
</style>
