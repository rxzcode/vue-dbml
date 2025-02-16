<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { GraphNode } from '@vue-flow/core';
import { useErdStore } from '@/libs/store/ERD';

const store = useErdStore();
defineProps<{
    table: GraphNode;
}>();
</script>

<template>
    <div class="db-table">
        <div :style="{ background: table.data.headerColor }" class="title">
            {{ table.label || table.id }}
        </div>
        <template v-for="field in table.data.fields" :key="field.name">
            <div v-if="!field.hidden" class="field nodrag">
                <Handle type="source" :position="Position.Left" :connectable="store.settings.editMode" :id="field.name" />
                <div class="name">{{ field.name }}</div>
                <div class="type">
                    {{ field?.type?.type_name }}
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
:root {
    --vf-handle: #ccc;
}

.vue-flow__handle {
    opacity: 0;
    width: 10px;
    height: 10px;
    border: 4px solid #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.selected > .db-table {
    outline: 1px solid #839fd2;
}

.db-table {
    color: #6f6f6f;
    min-width: 160px;
    background: #fcfcfc;
    font-size: 12px;
    border: 1px solid #fff;
    border-radius: 2px;
}
.db-table .title {
    padding: 4px 8px;
    font-size: 14px;
    background: #316896;
    color: #f3f3f3;
    font-weight: bold;
    cursor: move;
    border-radius: 3px 3px 0 0;
}
.db-table:hover .title {
    color: #fff;
}
.db-table .field {
    margin: 0;
    padding: 4px 8px;
    position: relative;
    background: #f2f2f2;
    border-top: 1px solid #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.db-table .field .type {
    color: #ccc;
    font-size: 10px;
    padding: 0 0 0 8px;
    margin-left: auto;
}
.db-table .field:hover {
    color: #555;
    background: #d8e7f3;
}

.edit-mode .field:hover .vue-flow__handle {
    opacity: 1;
}
</style>
