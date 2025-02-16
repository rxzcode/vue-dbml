<template>
    <div class="db-group">
        {{ group.label }}
    </div>
</template>

<script setup>
defineProps({
    group: {
        type: Object,
        required: true
    }
});
</script>

<style>
vue-flow__node {
    cursor: default;
}

.vue-flow__node-group {
    display: flex;
}

.db-group {
    text-align: center;
    color: #ccc;
    background: rgba(98, 255, 66, 0.1);
    flex-grow: 1;
}
</style>
