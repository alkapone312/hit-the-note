<template>
    <label class="checkbox-container" @click="playSound">
        <input :id="'a' + uid" class="checkbox" type="checkbox" style="display: none;" v-model="checked" />
        <label :for="'a' + uid" class="checkbox-label">
            <span class="checkbox-button" :class="{ checked: checked }"></span>
            <slot></slot>
        </label>
    </label>
</template>

<script lang="ts" setup>
import Sounds from '@App/Sounds';
import { getCurrentInstance } from 'vue';

const { uid } = getCurrentInstance()!; 
const checked = defineModel();

function playSound() {
    Sounds.play('click')
}
</script>

<style scoped>
.checkbox-container {
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.8rem;
    cursor: pointer;
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
