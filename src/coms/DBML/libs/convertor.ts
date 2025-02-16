import { Edge, Node } from '@vue-flow/core/dist/types';
import Table from '@dbml/core/types/model_structure/table';
import Ref from '@dbml/core/types/model_structure/ref';
import Endpoint from '@dbml/core/types/model_structure/endpoint';
import { RawDatabase } from '@dbml/core/types/model_structure/database';
export { default as parseDBMLToJSON } from '@dbml/core/lib/parse/dbmlParser';
class ConvertorToVueFlow {
    private convertTable(dbmlTable: Table): Node {
        const fields = Object.fromEntries(
            dbmlTable.fields.map((dbmlField) => {
                const field = { ...dbmlField, tags: [] } as any;
                field.note = dbmlField.note ? dbmlField.note : '';
                delete field.token;
                return [field.name, field];
            })
        );

        return {
            id: this.getFullTableName((dbmlTable as any).schemaName, dbmlTable.name),
            label: dbmlTable.name,
            type: 'table',
            position: { x: 0, y: 0 },
            draggable: true,
            expandParent: true,
            connectable: true,
            data: {
                tags: [],
                fields: fields,
                note: dbmlTable.note || ''
            }
        };
    }

    private getFullTableName(schema: string, name: string): string {
        schema = schema || 'public';
        return schema + '.' + name;
    }

    public convertDbmlStructToVueFlow(db: RawDatabase): [Node[], Edge[]] {
        this.replaceTableNameFromAlias(db);
        const nodes = [];
        const edges = [];
        for (const table of db.tables) {
            nodes.push(this.convertTable(table));
        }
        for (let i = 0; i < db.refs.length; i++) {
            edges.push(this.convertRefs(db.refs[i], i));
        }
        return [nodes, edges];
    }

    public convertDbmlStructToVueFlowObj(db: RawDatabase): { nodes: Node[]; edges: Edge[] } {
        this.replaceTableNameFromAlias(db);
        const nodes = [];
        const edges = [];
        for (const table of db.tables) {
            nodes.push(this.convertTable(table));
        }
        for (let i = 0; i < db.refs.length; i++) {
            edges.push(this.convertRefs(db.refs[i], i));
        }
        return { nodes, edges };
    }

    private convertRefs(ref: Ref, index: number): Edge {
        const [e0, e1] = ref.endpoints;
        return {
            id: `ref-${index}`,
            source: this.getFullTableName(e0.schemaName, e0.tableName),
            sourceHandle: e0.fieldNames[0],
            target: this.getFullTableName(e1.schemaName, e1.tableName),
            targetHandle: e1.fieldNames[0],
            label: `${e0.tableName}.${e0.fieldNames[0]} [${e0.relation}] :: ${e1.tableName}.${e1.fieldNames[0]} [${e1.relation}]`,
            data: {
                sourceRelation: e0.relation,
                targetRelation: e1.relation
            }
        };
    }

    private replaceTableNameFromAlias(db: RawDatabase): void {
        db.refs.map((ref) => {
            ref.endpoints.map((endpoint: Endpoint) => {
                const name = endpoint.tableName;
                const alias = (db as any).aliases.find((item: any) => item.kind === 'table' && item.name === name);
                if (alias) {
                    endpoint.tableName = alias.value.tableName;
                }
            });
        });
    }
}

export default new ConvertorToVueFlow();
export { ConvertorToVueFlow };

export function Sql2Sqlite(mysqlSchema: string): string {
    let sqliteSchema = mysqlSchema;
    // Replace MySQL-specific data types with SQLite-compatible types
    sqliteSchema = sqliteSchema.replace(/`?varchar\(\d+\)`?/gi, 'TEXT');
    sqliteSchema = sqliteSchema.replace(/`?int\(\d+\)`?/gi, 'INTEGER');
    sqliteSchema = sqliteSchema.replace(/`?integer`?/gi, 'INTEGER');
    sqliteSchema = sqliteSchema.replace(/`?text`?/gi, 'TEXT');
    sqliteSchema = sqliteSchema.replace(/`?timestamp`?/gi, 'TIMESTAMP');
    // Remove MySQL-specific comments (e.g., COMMENT '...')
    sqliteSchema = sqliteSchema.replace(/COMMENT\s*'[^']*'/gi, '');
    // Remove MySQL-specific column options (e.g., AUTO_INCREMENT, UNSIGNED)
    sqliteSchema = sqliteSchema.replace(/AUTO_INCREMENT|UNSIGNED/gi, '');
    // Replace MySQL-specific PRIMARY KEY syntax
    sqliteSchema = sqliteSchema.replace(/`?PRIMARY KEY`?\s*\(([^)]+)\)/gi, 'PRIMARY KEY ($1)');
    // Move FOREIGN KEY definitions into CREATE TABLE statements
    const foreignKeys: Record<string, string[]> = {};
    sqliteSchema = sqliteSchema.replace(
        /ALTER TABLE `?([\w_]+)`? ADD FOREIGN KEY \(([^)]+)\) REFERENCES `?([\w_]+)`? \(([^)]+)\);/gi,
        (_, table, columns, referencedTable, referencedColumns) => {
            if (!foreignKeys[table]) {
                foreignKeys[table] = [];
            }
            foreignKeys[table].push(`FOREIGN KEY (${columns}) REFERENCES ${referencedTable} (${referencedColumns})`);
            return '';
        }
    );
    // Insert foreign keys into their respective tables
    sqliteSchema = sqliteSchema.replace(/CREATE TABLE `?([\w_]+)`? \(([^)]+)\)/gi, (_, table, columns) => {
        const fkDefs = foreignKeys[table] ? `, ${foreignKeys[table].join(', ')}` : '';
        return `CREATE TABLE ${table} (${columns}${fkDefs})`;
    });
    // Remove any trailing commas from column definitions
    sqliteSchema = sqliteSchema.replace(/,\s*\)/g, ')');
    // Normalize table creation syntax
    sqliteSchema = sqliteSchema.replace(/`/g, '');
    return sqliteSchema;
}
