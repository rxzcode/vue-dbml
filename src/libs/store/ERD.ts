import { defineStore } from 'pinia';
import { Edge, Node, GraphNode, GraphEdge } from '@vue-flow/core/dist/types';
import { mergeWith } from 'lodash-es';
import dbml from '@/example.dbml?raw';

class Tag {
    readonly id: string;
    label?: string;
    isFilterSelected: boolean = false;
    constructor(id: string) {
        this.id = id.toString();
    }
}

interface ErdState {
    tables: GraphNode[];
    edges: GraphEdge[];
    singleModeTable: GraphNode | null;
    _activeTableInfo: GraphNode | null;
    dbmlRaw: string;
    extraData: any;
    tags: Record<string, Tag>;
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
        singleModeTable: null,
        _activeTableInfo: null,
        tags: { ro: new Tag('ro') } as Record<string, Tag>,
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
        isFilterSelectedTags(): Record<string, Tag> {
            const result: Record<string, Tag> = {};
            for (const tag of Object.values(this.tags) as Tag[]) {
                if (tag.isFilterSelected) {
                    result[tag.id] = tag;
                }
            }
            return result;
        },
        tablesByTags(state) {
            if (Object.keys(this.isFilterSelectedTags).length === 0) {
                return state.tables;
            }
            return state.tables.filter((table) => {
                const isSelectedTag = table.data.tags.find((t: any) => this.tags[t].isFilterSelected);
                if (isSelectedTag) {
                    return true;
                }
                for (const field of Object.values(table.data.fields || {}) as any) {
                    if (field.tags.find((t: any) => this.tags[t].isFilterSelected)) {
                        return true;
                    }
                }
                return false;
            });
        },
        visibleTables: (state) => state.tables.filter((t) => !t.hidden),
        activeTableInfo: (state): GraphNode | null => {
            return state._activeTableInfo || state.tables[0] || null;
        }
    },
    actions: {
        initTags(nodes: Node[]): void {
            nodes.forEach((table: Node) => {
                table.data.tags.forEach((tag: any) => {
                    this.tags[tag] = new Tag(tag);
                });
                for (const field of Object.values(table.data.fields) as any) {
                    field.tags.forEach((tag: any) => {
                        this.tags[tag] = new Tag(tag);
                    });
                }
            });
        },
        applyExtraData(nodes: Node[], edges: Edge[]): void {
            nodes.forEach((node: Node) => {
                mergeWith(node, this.extraData.nodes?.[node.id], (destValue, sourceValue, key: String, dest, source, stack: Number) => {
                    if (Array.isArray(destValue) && Array.isArray(sourceValue)) {
                        return destValue.concat(sourceValue);
                    }
                });
            });
        },
        actionModeSingleTable(table: GraphNode): void {
            this.singleModeTable = this.singleModeTable?.id === table.id ? null : table;
            const hideAll = this.singleModeTable !== null;
            this.$patch((state) => {
                let size = state.tables.length;
                let tables = state.tables;
                while (size--) {
                    tables[size].hidden = hideAll;
                }
                table.hidden = false;
                table.data.hide = false;
            });
            if (this.singleModeTable) {
                this.edges.forEach((edge: GraphEdge) => {
                    if (edge.sourceNode.id === table.id || edge.targetNode.id === table.id) {
                        edge.sourceNode.hidden = false;
                        edge.targetNode.hidden = false;
                    }
                });
            }
        }
    }
});
