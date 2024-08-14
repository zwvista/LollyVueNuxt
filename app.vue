<template>
  <v-app>
    <v-app-bar
        color="primary"
        :order="clipped ? 0 : 1"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn :icon="rail ? 'fa-chevron-right' : 'fa-chevron-left'" @click.stop="rail = !rail"></v-btn>
      <v-btn :icon="clipped ? 'fa-circle-chevron-left' : 'fa-circle-chevron-down'" @click.stop="clipped = !clipped"></v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
        persistent
        :rail="rail"
        v-model="drawer"
    >
      <v-list density="compact">
        <v-list-item
            :value="item"
            v-for="(item, i) in items"
            :key="i"
            :to="{path: item.path}"
        >
          <template #prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  const clipped = ref(true);
  const drawer = ref(true);
  const items = ref([
    {
      icon: 'fa-bus',
      title: 'Words in Unit',
      path: '/words-unit',
    },
    {
      icon: 'fa-train',
      title: 'Phrases in Unit',
      path: '/phrases-unit',
    },
    {
      icon: 'fa-car',
      title: 'Words in Textbook',
      path: '/words-textbook',
    },
    {
      icon: 'fa-taxi',
      title: 'Phrases in Textbook',
      path: '/phrases-textbook',
    },
    {
      icon: 'fa-plane',
      title: 'Words in Language',
      path: '/words-lang',
    },
    {
      icon: 'fa-rocket',
      title: 'Phrases in Language',
      path: '/phrases-lang',
    },
    {
      icon: 'fa-motorcycle',
      title: 'Patterns in Language',
      path: '/patterns',
    },
    {
      icon: 'fa-cog',
      title: 'Settings',
      path: '/settings',
    },
  ]);
  const rail = ref(false);
  const title = ref('Lolly Vue Nuxt');
</script>
