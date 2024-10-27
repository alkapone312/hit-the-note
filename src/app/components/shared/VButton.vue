<template>
    <button @click="buttonClick">
        <slot></slot>
    </button>
</template>

<script lang="ts" setup>
    import Sounds from '@App/Sounds';

    const emit = defineEmits(['click']);
    
    function buttonClick() {
        Sounds.play('button_click');
        emit('click')
    }
</script>

<style scoped>
button {
    font-size: 3rem;
    background-color: rgb(255, 216, 100);
    padding: 15px;
    border: 5px solid white;
    border-radius: 25px;
    outline: 5px solid rgb(255, 216, 100);
}

button:hover {
    transform: scale(0.95);
    cursor: pointer;
}
</style>