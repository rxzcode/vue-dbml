import { defineStore } from 'pinia';
import { Edge, Node, GraphNode, GraphEdge } from '@vue-flow/core/dist/types';
import { mergeWith } from 'lodash-es';
import { exporter } from '@dbml/core';
import { Sql2Sqlite } from './convertor';
import dbml from './example.dbml?raw';
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

const DBML_STORAGE_KEY = 'erd-dbml-raw';
export const useErdStore = defineStore('ERD', {
    state: (): ErdState => ({
        dbmlRaw: localStorage.getItem(DBML_STORAGE_KEY) || dbml,
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
        DbmlSql(): string {
            const mysql = exporter.export(this.dbmlRaw, 'mysql');
            return mysql;
        },
        DbmlSqlite(): string {
            const mysql = exporter.export(this.dbmlRaw, 'mysql');
            return Sql2Sqlite(mysql);
        }
    },
    actions: {
        saveDbmlRaw(newDbmlRaw: string): void {
            this.dbmlRaw = newDbmlRaw;
            localStorage.setItem(DBML_STORAGE_KEY, newDbmlRaw);
        },
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
