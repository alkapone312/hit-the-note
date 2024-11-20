<template>
    <div class="custom-select">
      <div class="select-container">
        <select :id="computedId" v-model="selectedOption" @change="emitSelection">
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import { EnumerateValuesType } from './FormTypes';
  
  const {modelValue} = defineProps<{
    options: EnumerateValuesType;
    modelValue: string | number;
  }>();
  
  const emit = defineEmits(['update:modelValue']);
  
  const computedId = `custom-select-${Math.random().toString(36).substr(2, 9)}`;
  
  const selectedOption = ref(modelValue);
  
  const emitSelection = () => {
    emit('update:modelValue', selectedOption.value);
  };
  </script>
  
  <style scoped>
  .custom-select {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  label {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .select-container {
    position: relative;
  }
  
  select {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: rgb(255, 216, 100);
    cursor: pointer;
    font-size: 2rem;
    border-radius: 20px;
    border: 5px solid white;
    outline: 5px solid rgb(255, 216, 100);
  }
  </style>
  