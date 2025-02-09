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

    const takePhotoAndNotify = async () => {
      const canvas = document.createElement('canvas');
      if (video.value) {
        canvas.width = video.value.videoWidth;
        canvas.height = video.value.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video.value, 0, 0);
          photo.value = canvas.toDataURL('image/png');
          vibratePhone();
          await showNotification('Photo prise avec succès !');
        }
      }
    };

    const vibratePhone = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
    };

    const showNotification = async (message: string) => {
      if (!('serviceWorker' in navigator)) return;

      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.showNotification(message, {
          body: 'Votre photo a été prise avec succès !',
          icon: '/icon.png',
        });
      }

      // Gérer la vibration séparément
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    };


    const requestNotificationPermission = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    onMounted(() => {
      requestNotificationPermission();

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

    return { photo, video, takePhotoAndNotify };
  },
});
</script>

<style scoped>
.mirrored {
  transform: scaleX(-1);
}
</style>
