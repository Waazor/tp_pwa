<template>
  <div class="battery-container">
    <h2>État de la Batterie</h2>

    <div class="battery-info">
      <div class="battery-bar">
        <div class="battery-level" :style="{ width: batteryLevel + '%' }"></div>
      </div>
      <p class="battery-percentage">{{ batteryLevel }}%</p>
    </div>

    <p class="charging-status" :class="{ charging: isCharging, notCharging: !isCharging }">
      <span v-if="isCharging">⚡</span>
      {{ chargingStatus }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }

  interface BatteryManager {
    level: number;
    charging: boolean;
    addEventListener: (type: string, listener: () => void) => void;
  }
}

export default defineComponent({
  name: 'BatteryStatus',
  setup() {
    const batteryLevel = ref(0);
    const chargingStatus = ref('Chargement inconnu');
    const isCharging = ref(false);

    const checkBatteryLevel = async () => {
      if (navigator.getBattery) {
        try {
          const battery = await navigator.getBattery();
          updateBatteryStatus(battery);

          battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
          battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
        } catch (error) {
          console.error('Erreur d’accès au statut de la batterie:', error);
        }
      } else {
        alert('Battery API non supportée par votre navigateur.');
      }
    };

    const updateBatteryStatus = (battery: BatteryManager) => {
      batteryLevel.value = Math.round(battery.level * 100);
      isCharging.value = battery.charging;
      chargingStatus.value = battery.charging ? 'En charge' : 'Débranchée';
    };

    onMounted(() => {
      checkBatteryLevel();
    });

    return {
      batteryLevel,
      chargingStatus,
      isCharging
    };
  }
});
</script>

<style scoped>
.battery-container {
  text-align: center;
  padding: 20px;
  background: #1e1e1e;
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  margin: auto;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
}

.battery-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.battery-bar {
  width: 100%;
  height: 20px;
  background: #333;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #555;
  position: relative;
}

.battery-level {
  height: 100%;
  background: #42b883;
  transition: width 0.5s ease-in-out;
}

.battery-percentage {
  font-size: 1.2em;
  font-weight: bold;
}

.charging-status {
  margin-top: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.charging {
  color: #42b883;
}

.notCharging {
  color: #ff4d4d;
}

/* Responsive */
@media (max-width: 480px) {
  .battery-container {
    max-width: 90%;
    padding: 15px;
  }

  h2 {
    font-size: 1.3em;
  }

  .battery-bar {
    height: 15px;
  }

  .battery-percentage {
    font-size: 1em;
  }

  .charging-status {
    font-size: 1em;
  }
}
</style>
