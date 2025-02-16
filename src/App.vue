<script setup lang="ts"></script>

<template>
    <header class="comp-layer">
        <span class="logo">DBML</span>
        <router-link :to="{ name: 'view-page' }">View</router-link>
    </header>
    <router-view></router-view>
</template>
