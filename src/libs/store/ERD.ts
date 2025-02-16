import { defineStore } from 'pinia';
import { Edge, Node, GraphNode, GraphEdge } from '@vue-flow/core/dist/types';
import { mergeWith } from 'lodash-es';
import dbml from '@/assets/example.dbml?raw';

interface ErdState {
    tables: GraphNode[];
    edges: GraphEdge[];
    dbmlRaw: string;
    extraData: any;
    settings: {
        editMode: boolean;
        vueFlow: {
            panOnDrag: boolean;
            panOnScroll: boolean;
            panOnScrollSpeed: number;
        };
    };
}

export const useErdStore = defineStore('ERD', {
    state: (): ErdState => ({
        dbmlRaw: dbml,
        extraData: {
            nodes: {},
            edges: {}
        },
        tables: [],
        edges: [],
        settings: {
            editMode: false,
            vueFlow: {
                panOnDrag: false,
                panOnScroll: true,
                panOnScrollSpeed: 1.2
            }
        }
    }),
    getters: {
    },
    actions: {
        applyExtraData(nodes: Node[], edges: Edge[]): void {
            nodes.forEach((node: Node) => {
                mergeWith(node, this.extraData.nodes?.[node.id], (destValue, sourceValue, key: String, dest, source, stack: Number) => {
                    if (Array.isArray(destValue) && Array.isArray(sourceValue)) {
                        return destValue.concat(sourceValue);
                    }
                });
            });
        }
    }
});
