<script setup lang="ts">
import { reactive } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';

import { useErdStore } from './libs/state';
import DbChart from './DbChart.vue';
import convertor, { parseDBMLToJSON } from './libs/convertor';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@/assets/css/simple-line-icons.css';

import './libs/css/styles.css';
import './libs/ace-config';

const erdStore = useErdStore();
const state = reactive({
    flowFlag: Date.now(),
    nodes: [] as any,
    edges: [] as any,
    dbmlContent: '' + erdStore.dbmlRaw
});

const saveDbml = () => {
    try {
        parseDBMLToJSON.parse(state.dbmlContent);
    } catch (e) {
        alert('Error in DBML. Not saved.');
        throw e;
    }
    erdStore.saveDbmlRaw(state.dbmlContent)
    initFlowData();
};

const createVueFlowData = (dbmlRaw: String) => {
    try {
        return parseDBMLToJSON.parse(dbmlRaw);
    } catch (e) {
        console.error('Can`t parse dbml', e);
    }
};

const initFlowData = () => {
    const db = createVueFlowData(erdStore.dbmlRaw);
    const { nodes, edges } = convertor.convertDbmlStructToVueFlowObj(db);
    state.nodes = nodes;
    state.edges = edges;
    erdStore.applyExtraData(nodes, edges);
    state.flowFlag = Date.now();
};
initFlowData();
</script>

<template>
    <div class="middle">
        <div class="aside-panel comp-layer f-col">
            <VAceEditor
                class="dbml-editor"
                v-model:value="state.dbmlContent"
                lang="sql"
                theme="monokai"
                :options="{
                    useWorker: false,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true
                }"
            />
            <div class="panel-btns">
                <button @click="saveDbml" class="primary">Save</button>
                <button @click="saveDbml" class="secondary">Load</button>
            </div>
        </div>
        <div class="content comp-layer f-col">
            <div id="erd-container">
                <DbChart :key="state.flowFlag" :initialNodes="state.nodes" :initialEdges="state.edges" />
            </div>
        </div>
    </div>
</template>

<style>
.aside-panel {
    overflow-y: auto;
}
.aside-panel .widget {
    border-bottom: 1px solid #eee;
    padding: 4px;
}
.aside-panel .widget .w-title {
    cursor: pointer;
    padding: 8px;
    margin: 0;
    font-size: 14px;
}

.panel-btns {
    display: flex;
    flex-direction: row;
    padding: 5px;
    gap: 5px;
    width: 100%;
    background-color: #202020;
}

.dbml-editor,
.yaml-editor {
    width: 100%;
    height: 100%;
}
#erd-container {
    flex-grow: 1;
}
</style>
