<template>
    <div class="custom-select">
      <label v-if="label" :for="computedId">{{ label }}</label>
      <div class="select-container">
        <select :id="computedId" v-model="selectedOption" @change="emitSelection">
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  
  // Props for the component
  const {modelValue} = defineProps<{
    label?: string; // Label for the select field (optional)
    options: { value: string | number; label: string }[]; // Options for the select field
    modelValue: string | number; // Selected value passed from parent
  }>();
  
  // Emits the updated value
  const emit = defineEmits(['update:modelValue']);
  
  // Unique ID generation
  const computedId = `custom-select-${Math.random().toString(36).substr(2, 9)}`;
  
  // Reactive state for the selected option
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
  