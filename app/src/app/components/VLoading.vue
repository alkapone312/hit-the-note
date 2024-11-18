<template>
    <div class="loading-background"></div>
    <div class="loading"><span class="rotating">♪</span></div>
</template>

<script setup lang="ts">
</script>

<style>
.loading-background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
}

.loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    padding: 10px;
    background-color: #899cf4;
    border-radius: 20px;
    border: 5px solid rgb(255, 216, 100);
    width: 120px;
    height: 120px;
    justify-content: center;
    align-items: center;
    z-index: 4;
    font-size: 6rem;
}

.rotating {
    animation: rotate 2s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
