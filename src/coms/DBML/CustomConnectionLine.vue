<script lang="ts" setup>
import { onUpdated } from 'vue';

let { sourceX, sourceY, targetX, targetY } = defineProps({
    sourceX: {
        type: Number,
        required: true
    },
    sourceY: {
        type: Number,
        required: true
    },
    targetX: {
        type: Number,
        required: true
    },
    targetY: {
        type: Number,
        required: true
    }
});

onUpdated(() => {
    console.log(`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`);
});
</script>

<template>
    <g>
        <path
            class="vue-flow__connection"
            fill="none"
            stroke="#6F3381"
            :stroke-width="2.5"
            :d="`M${sourceX},${sourceY} h 40 C ${sourceX + 40} ${targetY} ${sourceX + 40} ${targetY} ${targetX},${targetY}`"
        />
        <circle :cx="targetX" :cy="targetY" fill="#fff" :r="4" stroke="#6F3381" :stroke-width="1.5" />
    </g>
</template>
