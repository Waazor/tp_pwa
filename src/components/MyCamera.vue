<template>
  <div class="container">
    <video ref="video" class="mirrored" autoplay></video>

    <button @click="takePhoto" class="capture-btn">📸 Prendre une photo</button>

    <div v-if="photo" class="photo-container">
      <img :src="photo" alt="Photo capturée" class="photo" />
      <button @click="deletePhoto" class="delete-btn">🗑 Supprimer</button>
    </div>

    <div ref="flashOverlay" class="flash-overlay"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';

export default defineComponent({
  setup() {
    const photo = ref<string | null>(null);
    const video = ref<HTMLVideoElement | null>(null);
    const flashOverlay = ref<HTMLDivElement | null>(null);

    const takePhoto = async () => {
      if (!video.value) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.value.videoWidth;
      canvas.height = video.value.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video.value, 0, 0);
        photo.value = canvas.toDataURL('image/png');

        localStorage.setItem('capturedPhoto', photo.value);

        triggerFlash();
        vibratePhone();
        setTimeout(showNotification, 300);
      }
    };

    const deletePhoto = () => {
      photo.value = null;
      localStorage.removeItem('capturedPhoto');
    };

    const vibratePhone = () => {
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    };

    const triggerFlash = async () => {
      if (flashOverlay.value) {
        flashOverlay.value.classList.add('active');
        await nextTick();
        setTimeout(() => {
          if (flashOverlay.value) {
            flashOverlay.value.classList.remove('active');
          }
        }, 200);
      }
    };

    const showNotification = () => {
      if (!("Notification" in window)) {
        console.warn("Les notifications ne sont pas supportées par ce navigateur.");
        return;
      }

      if (Notification.permission === "granted") {
        new Notification("📷 Photo capturée !", {
          body: "Votre photo a été enregistrée avec succès.",
          icon: photo.value || undefined,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("📷 Photo capturée !", {
              body: "Votre photo a été enregistrée avec succès.",
              icon: photo.value || undefined,
            });
          }
        });
      }
    };

    onMounted(() => {
      const savedPhoto = localStorage.getItem('capturedPhoto');
      if (savedPhoto) {
        photo.value = savedPhoto;
      }

      navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            if (video.value) {
              video.value.srcObject = stream;
            }
          })
          .catch((error) => {
            console.error('Erreur d’accès à la caméra:', error);
            alert("Impossible d'accéder à la caméra.");
          });
    });

    return { photo, video, takePhoto, deletePhoto, flashOverlay };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #1e1e1e;
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 350px;
  margin: auto;
}

video {
  width: 100%;
  border-radius: 8px;
  border: 2px solid #42b883;
}

.mirrored {
  transform: scaleX(-1);
}

.capture-btn {
  background: #42b883;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.capture-btn:hover {
  background: #36a372;
}

.photo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;
}

.delete-btn:hover {
  background: #cc0000;
}

.flash-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.flash-overlay.active {
  opacity: 1;
}
</style>
