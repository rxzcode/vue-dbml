<script>
export default {
    inheritAttrs: false
};
</script>

<script setup>
import { computed } from 'vue';
import { getSmoothStepPath, BaseEdge } from '@vue-flow/core';
import { useErdStore } from '@/libs/store/ERD';

const store = useErdStore();
let props = defineProps({
    id: {
        type: String,
        required: true
    },
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
    },
    sourcePosition: {
        type: String,
        required: true
    },
    targetPosition: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: false
    },
    style: {
        type: Object,
        required: false
    },
    offset: {
        type: Number,
        required: false
    }
});

const socketW = 10;
let state = computed(() => {
    let edge = store.edges.find((e) => e.id === props.id);

    const sourceIsLeft = props.sourceX > props.targetX;
    const sourceXCompensation = sourceIsLeft ? -edge.sourceNode.dimensions.width / 2 : edge.sourceNode.dimensions.width / 2 + socketW;
    const targetXCompensation = sourceIsLeft ? edge.targetNode.dimensions.width / 2 + socketW : -edge.targetNode.dimensions.width / 2;

    const path = getSmoothStepPath({
        ...props,
        offset: 4,
        sourcePosition: sourceIsLeft ? 'left' : 'right',
        targetPosition: sourceIsLeft ? 'right' : 'left',
        sourceX: props.sourceX + sourceXCompensation,
        targetX: props.targetX + targetXCompensation
    });

    return {
        path,
        sourceXCompensation,
        targetXCompensation,
        sourceIsLeft,
        sourceRelation: edge.data.sourceRelation,
        targetRelation: edge.data.targetRelation
    };
});

// to right-bottom
// (q s,0,s,s)  (l x y)  (q 0,s,s,s)
// beizer - (m 0 0 c 100 0 100 20 200 20)
// x, y, x2, y2 (m x y c avg(x,x2) 0 avg(x,x2) y2 x2 y2))
</script>
<template>
    <text font-size="14px" fill="#ccc" :x="sourceX + state.sourceXCompensation + (state.sourceIsLeft ? -6 : 0)" :y="sourceY - 6"
        >{{ state.sourceRelation }}
    </text>
    <text font-size="14px" fill="#ccc" :x="targetX + state.targetXCompensation + (state.sourceIsLeft ? 0 : -6)" :y="targetY - 6"
        >{{ state.targetRelation }}
    </text>
    <BaseEdge :id="id" :style="style" :path="state.path[0]" />
</template>
