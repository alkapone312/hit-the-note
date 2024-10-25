<template>
    <label class="checkbox-container">
        <input :id="'a' + uid" class="checkbox" type="checkbox" style="display: none;" v-model="checked" @change="checkboxClick" />
        <label :for="'a' + uid" class="checkbox-label">
            <span class="checkbox-button" :class="{ checked: checked }"></span>
            <slot></slot>
        </label>
    </label>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue';

const { uid } = getCurrentInstance()!; 
const emit = defineEmits(['change']);
const checked = ref(false);

function checkboxClick() {
    emit('change', checked.value);
}
</script>

<style scoped>
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.8rem
}

.checkbox-button {
    padding: 15px;
    background-color: lightgray;
    border: 5px solid white;
    border-radius: 25px;
    outline: 5px solid rgb(255, 216, 100);
    display: inline-block;
    margin-left: 10px;
    transition: transform 0.2s, background-color 0.2s;
}

/* Change background color when checked */
.checkbox-button.checked {
    background-color: rgb(255, 216, 100);
}

/* Optional: Make it slightly darker when hovered */
.checkbox-button:hover {
    transform: scale(0.95);
    cursor: pointer;
}
</style>
