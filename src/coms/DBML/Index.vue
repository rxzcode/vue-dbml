<script setup lang="ts">
import dagre from 'dagre';
import { VueFlow, useVueFlow, ConnectionMode } from '@vue-flow/core';
import { ControlButton, Controls } from '@vue-flow/controls';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';
import { useErdStore } from '@/libs/store/ERD';

import DbTable from './DbTable.vue';
import DbGroup from './DbGroup.vue';
import CustomEdge from './CustomEdge.vue';
import CustomConnectionLine from './CustomConnectionLine.vue';

import '@vue-flow/controls/dist/style.css';

const props = defineProps({
    initialNodes: {
        type: Array,
        required: true
    },
    initialEdges: {
        type: Array,
        required: true
    }
});

const store = useErdStore();

// https://vueflow.dev/guide/vue-flow/config.html#global-edge-options
// https://reactflow.dev/docs/api/react-flow-props/
let { edges, nodes, fitView, onNodesInitialized, panOnDrag, panOnScroll, panOnScrollSpeed } = useVueFlow({
    onlyRenderVisibleElements: false, // in the DOM only what is visible on the screen
    disableKeyboardA11y: false,
    zoomOnScroll: false,
    connectionMode: ConnectionMode.Loose, // can be connected to each other and source/target <-> source/target without type checking
    autoConnect: true, // default handler for connecting 2 points
    defaultEdgeOptions: {
        type: 'custom_edge_1',
        updatable: true,
        animated: false,
        selectable: true
    },
    edgeUpdaterRadius: 10,
    connectOnClick: false, // creates an edge by successively clicking on 2 Handle points between them
    panOnScroll: store.settings.vueFlow.panOnScroll,
    fitViewOnInit: true,
    maxZoom: 2,
    minZoom: 0.1,
    panOnDrag: store.settings.vueFlow.panOnDrag, // Is it possible to drag the canvas by clicking (clamping) and moving the mouse
    panOnScrollSpeed: store.settings.vueFlow.panOnScrollSpeed, // 1.0 canvas scroll speed
    elevateEdgesOnSelect: false, // raises z-index edge connections to active
    elementsSelectable: true,
    snapGrid: [50, 50],
    snapToGrid: false, // drag in steps
    noDragClassName: 'nodrag',
    nodesDraggable: false,
    nodes: props.initialNodes,
    edges: props.initialEdges
} as any);

const autoLayout = () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR' });
    g.setDefaultEdgeLabel(() => ({}));
    nodes.value.forEach((node) => g.setNode(node.id, { width: 200, height: 200 }));
    edges.value.forEach((edge) => g.setEdge(edge.source, edge.target));
    dagre.layout(g);
    nodes.value = nodes.value.map((node) => {
        const gNode = g.node(node.id);
        return { ...node, position: { x: gNode.x, y: gNode.y } };
    });
    fitView();
};

store.$patch({
    // @ts-ignore
    tables: nodes,
    edges: edges,
    settings: {
        vueFlow: {
            panOnDrag,
            panOnScroll,
            panOnScrollSpeed
        }
    }
});

const fullscreen = function () {
    if (!document.fullscreenElement) {
        document.querySelector('#erd-container')?.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

onNodesInitialized(() => {
    autoLayout();
});
</script>

<template>
    <div class="control-panel">
        <div @click="autoLayout" class="control-btn">Auto Layout</div>
    </div>
    <VueFlow class="erd" :nodes="nodes" :edges="edges">
        <Controls :position="'bottom-left' as any" v-slot:top >
            <ControlButton @click="fullscreen">
                <i class="icon-size-fullscreen" />
            </ControlButton>
        </Controls>

        <Background :variant="'lines' as any" pattern-color="'rgb(79 137 224 / 0.2)'" :gap="40" :size="0.5" />
        <MiniMap nodeColor="#17d8b8" nodeStrokeColor="#333" :pannable="true" :zoomable="true" />

        <template #node-group="node">
            <DbGroup :group="node" />
        </template>

        <template #node-table="node">
            <DbTable :table="node as any" />
        </template>

        <template #connection-line="connectionLineProps">
            <CustomConnectionLine v-bind="connectionLineProps" />
        </template>
        <template #edge-custom_edge_1="props">
            <CustomEdge v-bind="props" />
        </template>
    </VueFlow>
</template>

<style>
.control-panel {
    position: absolute;
    z-index: 1;
    padding: 10px;
    left: 10px;
    top: 10px;
    border-radius: 8px;
}

.control-btn {
    cursor: pointer;
    padding: 5px 10px;
    background-color: #fff;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.erd {
    min-height: 94vh;
    border: 1px solid #eee;
    border-radius: 4px;
    background: #fff;
}

.vue-flow__edge-path {
    stroke: #7cadd5;
}

.vue-flow__controls {
    opacity: 0.5;
}

.vue-flow__edge-textwrapper {
    opacity: 0.3;
}

.isScrollPane .vue-flow__nodes,
.isScrollPane .db-table {
    pointer-events: none !important;
}
</style>
