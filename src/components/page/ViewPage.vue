<script setup lang="ts">
import { reactive, provide } from 'vue';
import DBML from '@/components/DBML/Index.vue';
import convertor, { parseDBMLToJSON } from '@/components/DBML/dbml-convertor';
import yaml from 'js-yaml';
import { useErdStore } from '@/libs/store/ERD';
import { VAceEditor } from 'vue3-ace-editor';
VAceEditor.name = 'AceEditor';
import '@/libs/ace/ace-config.js';

const erdStore = useErdStore();
const state = reactive({
    flowFlag: Date.now(),
    nodes: [] as any,
    edges: [] as any,
    dbmlContent: '' + erdStore.dbmlRaw,
    yamlContent: `nodes:
    public.countries:
        data:
            headerColor: red
            tags: [sd]
            fields:
                code:
                    tags: [pk]`
});

const saveDbml = () => {
    try {
        erdStore.extraData = yaml.load(state.yamlContent, {
            onWarning: console.warn,
            json: true
        });
    } catch (e) {
        alert('Custom settings yaml was not applied. Error in yaml');
        throw e;
    }
    try {
        parseDBMLToJSON.parse(state.dbmlContent);
    } catch (e) {
        alert('Error in DBML. Not saved.');
        throw e;
    }
    erdStore.dbmlRaw = state.dbmlContent;
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
    erdStore.initTags(nodes);
    state.flowFlag = Date.now();
};
initFlowData();
provide('state', state);
</script>

<template>
    <div class="middle" :class="{ 'edit-mode': erdStore.settings.editMode }">
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
                <button @click="saveDbml" variant="primary">Save</button>
                <button @click="saveDbml" variant="secondary">Load</button>
            </div>
        </div>
        <div class="content comp-layer f-col">
            <div id="erd-container">
                <DBML :key="state.flowFlag" :initialNodes="state.nodes" :initialEdges="state.edges" />
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
    background-color: #fff;
}

.dbml-editor,
.yaml-editor {
    width: 100%;
    height: 500px;
    max-height: 80%;
}
</style>
