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

    const takePhotoAndNotify = () => {
      const canvas = document.createElement('canvas');
      if (video.value) {
        canvas.width = video.value.videoWidth;
        canvas.height = video.value.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video.value, 0, 0);
          photo.value = canvas.toDataURL('image/png');
          showNotification('Photo taken!');
          vibratePhone();
        }
      }
    };

    const patterns = [
      2000, // Vibration unique de 2 secondes
      [2000, 1000, 2000, 1000, 2000, 1000, 2000], // Vibration répétée
      [400, 200, 400, 200, 400, 200, 800, 200, 800, 200, 400, 200, 400, 200, 200, 200], // "Twinkle, Twinkle, Little Star"
      [150, 50, 150, 50, 300, 100, 150, 50, 150, 50, 300, 100, 150, 50, 150, 50], // "Super Mario Bros"
      [300, 200, 300, 200, 300, 400, 300, 200, 300, 200, 300, 400, 300, 200, 600, 200] // "Jingle Bells"
    ];

    const vibratePhone = (patternIndex: number) => {
      if ("vibrate" in navigator) {
        console.log("Vibration support detected!");
        navigator.vibrate(patterns[patternIndex]);
      } else {
        console.warn("Vibration API not supported on this device.");
      }
    };


    const showNotification = (message: string) => {
      console.log("Checking notification permission:", Notification.permission);
      if (Notification.permission === 'granted') {
        new Notification(message);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          console.log("Notification permission result:", permission);
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
