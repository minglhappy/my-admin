<script setup lang="ts">
import { DEFAULT_PRIMARY } from '@/config';
</script>

<template>
  <div class="home-container">
    <SvgIcon name="home" :size="60" :color="DEFAULT_PRIMARY" />
    <h1>欢迎使用 MyAdmin</h1>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100%;
}
</style>
