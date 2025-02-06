<template>
  <div>
    <video ref="video" class="mirrored" autoplay></video>
    <button @click="takePhotoAndNotify">📸 Prendre une photo</button>
    <img :src="photo" v-if="photo" alt="Photo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const photo = ref<string | null>(null);
    const video = ref<HTMLVideoElement | null>(null);

    const takePhotoAndNotify = () => {
      const canvas = document.createElement('canvas');
      if (video.value) {
        canvas.width = video.value.videoWidth;
        canvas.height = video.value.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video.value, 0, 0);
          photo.value = canvas.toDataURL('image/png');
          showNotification('📸 Photo capturée !');
          vibratePhone();
        }
      }
    };

    const vibratePhone = () => {
      if ('vibrate' in navigator) {
        console.log("📳 Vibration déclenchée...");
        navigator.vibrate([200]);
      }
    };

    const showNotification = (message: string) => {
      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(message);
          }
        });
      }
    };

    onMounted(() => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (video.value) {
            video.value.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('❌ Erreur lors de l’accès à la caméra :', error);
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
