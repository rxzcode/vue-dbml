<script setup lang="ts">
import { useErdStore } from '@/coms/DBML/libs/state';
const store = useErdStore();

const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadDbml = () => {
    const content = store.dbmlRaw;
    const filename = `dbml-${new Date().toISOString().split('T')[0]}.sql`;
    downloadFile(filename, content);
}
const downloadSql = () => {
    const content = store.DbmlSql;
    const filename = `sql-${new Date().toISOString().split('T')[0]}.sql`;
    downloadFile(filename, content);
}

const downloadSqlite = () => {
    const content = store.DbmlSqlite;
    const filename = `sqlite-${new Date().toISOString().split('T')[0]}.sql`;
    downloadFile(filename, content);
}
</script>

<template>
    <header class="comp-layer">
        <span class="logo">DBML</span>
        <div class="menu" @click="downloadDbml">Dbml<i class="icon-arrow-down-circle"></i></div>
        <div class="menu" @click="downloadSqlite">Sqlite<i class="icon-arrow-down-circle"></i></div>
        <div class="menu" @click="downloadSql">Sql<i class="icon-arrow-down-circle"></i></div>
        <!-- <router-link :to="{ name: 'view-page' }">View</router-link> -->
    </header>
    <router-view></router-view>
</template>
