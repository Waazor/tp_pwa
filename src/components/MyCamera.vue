<template>
  <div>
    <video ref="video" class="mirrored" autoplay></video>
    <button @click="takePhotoAndNotify">Take Photo</button>
    <img :src="photo" v-if="photo" alt="fr"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const photo = ref<string | null>(null);
    const video = ref<HTMLVideoElement | null>(null);

    const takePhotoAndNotify = () => {
      const canvas = document.createElement('canvas');
      if (video.value) {
        canvas.width = video.value.videoWidth;
        canvas.height = video.value.videoHeight;
        canvas.getContext('2d')?.drawImage(video.value, 0, 0);
        photo.value = canvas.toDataURL('image/png');
        showNotification('Photo taken!');
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

    return { photo, video, takePhotoAndNotify };
  },
  mounted() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (this.video) {
          this.video.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  },
});
</script>

<style scoped>
.mirrored {
  transform: scaleX(-1);
}
</style>
