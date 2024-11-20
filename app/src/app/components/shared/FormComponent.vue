<template>
    <div class="form-component" v-for="setting in settings">
        <label>{{ setting.name }}</label>
        <VSelect
            v-if="setting.type === 'select'"
            :options="setting.values"
            :model-value="setting.default"
            @update:model-value="(v) => settingUpdated(setting.label, v)"
        />
        <VList
            v-if="setting.type === 'list'"
            :options="setting.values"
            :default="setting.default"
            @change="(v) => settingUpdated(setting.label, v)"
        />
        <VInput
            v-if="setting.type === 'number'"
            type="number"
            :value="setting.default"
            :min="(setting.range ?? [])[0]"
            :max="(setting.range ?? [])[1]"
            :step="setting.step"
        />
    </div>
</template>

<script setup lang="ts">
    import VSelect from './VSelect.vue';
    import VList from './VList.vue';
    import {defineProps} from 'vue'
    import { SettingsArray } from './FormTypes';
    import VInput from './VInput.vue';

    const emit = defineEmits(['change'])

    const {settings} = defineProps<{
        settings:  SettingsArray
    }>()

    const resultForm = {};

    settings.forEach((setting) => {
        resultForm[setting.label] = setting.default
    })

    function settingUpdated(label, value) {
        resultForm[label] = value; 
        emit('change', resultForm);
    }
</script>

<style>
    .form-component {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>