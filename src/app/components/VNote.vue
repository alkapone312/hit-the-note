<template>
    <div 
        :style="{ 
          top: top + 'px', 
          left: left + 'px', 
          width: width + 'px' 
        }" 
        class="note"
        >
        {{ note.getName() }}
    </div>
</template>

<script setup lang="ts">
import Note from '@/note/Note';
import { defineProps } from 'vue';

defineProps<{
    width: number,
    top: number,
    left: number,
    note: Note
}>()
</script>

<style scoped>
.note {
  position: absolute;
  background-color: lightblue;
  padding: 5px;
  border-radius: 5px;
  transform: translateY(-50%);
}
</style>