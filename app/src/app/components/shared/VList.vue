<template>
  <div class="form-list-container">
    <div class="form-list">
      <div v-for="item in results" class="form-item">
        <div class="form-item-name">{{ item.name }}</div>
        <VButton class="form-item-remove" @click="removeItem(item)"><VClose/></VButton>
      </div>
    </div>
    <div class="form-list-add">
      <VSelect :options="options" v-model="selectedValue"></VSelect><VButton @click="addItem(selectedValue)"><VAdd/></VButton>
    </div>
  </div>
</template>

<script setup lang="ts">
    import VSelect from './VSelect.vue';
    import VButton from './VButton.vue';
    import VClose from '../icons/VClose.vue';
    import VAdd from '../icons/VAdd.vue';
    import { EnumerateValuesType } from './FormTypes';
    import { ref, defineProps, defineEmits } from 'vue'

    const emit = defineEmits(['change'])
    const { options, default: def} = defineProps<{
        options: EnumerateValuesType,
        default: (string | number)[]
    }>()

    const selectedValue = ref(options[0].value)
    let results = ref(def.map(mapValueToOption).filter(item => !!item))

    function removeItem(value): void {
      results.value = results.value.filter((item) => item !== value);
      emit('change', results.value.map(i => i.value))
    }

    function addItem(value): void {
      const buff = mapValueToOption(value)
      if(buff != undefined) {
        results.value.push(buff);
        emit('change', results.value.map(i => i.value))
      }
    }

    function mapValueToOption(value) {
      const option = options.find(option => option.value === value);
      return {...option}
    }
</script>

<style scoped>

.form-list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  background-color: rgb(255, 216, 100);
  border-radius: 20px;
  padding: 20px;
  border: 5px solid white;
  outline: 5px solid rgb(255, 216, 100);
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 2rem;
}

.form-item-name {
  max-width: 75%;
  overflow: hidden;
}

.form-item-remove {
  width: 50px;
  height: 50px;
}

.form-list-add {
  display: flex;
  gap: 20px;
}
</style>