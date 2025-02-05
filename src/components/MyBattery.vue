<template>
  <div>
    <p>Battery Level: {{ batteryLevel }}%</p>
    <p>Charging Status: {{ chargingStatus }}</p>
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
    const chargingStatus = ref('Unknown');

    const checkBatteryLevel = async () => {
      if (navigator.getBattery) {
        try {
          const battery = await navigator.getBattery();

          updateBatteryStatus(battery);

          battery.addEventListener('levelchange', () => {
            updateBatteryStatus(battery);
          });

          battery.addEventListener('chargingchange', () => {
            updateBatteryStatus(battery);
          });
        } catch (error) {
          console.error('Error accessing battery status:', error);
        }
      } else {
        alert('Battery API not supported');
      }
    };

    const updateBatteryStatus = (battery: BatteryManager) => {
      batteryLevel.value = Math.round(battery.level * 100);
      chargingStatus.value = battery.charging ? 'Charging' : 'Not Charging';
    };

    onMounted(() => {
      checkBatteryLevel();
    });

    return {
      batteryLevel,
      chargingStatus,
    };
  },
});
</script>

<style scoped>
p {
  font-size: 16px;
  font-weight: bold;
}
</style>
