<template>
  <div>
    <v-toolbar>
      <v-select :items="settingsService.patternFilterTypes" item-title="label" v-model="filterType" @update:modelValue="onRefresh"></v-select>
      <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
<!--      <router-link to="/patterns-detail/0">-->
        <v-btn variant="elevated" prepend-icon="fa-plus" color="info">Add</v-btn>
<!--      </router-link>-->
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
    </v-toolbar>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="patternsService.patterns"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      item-key="ID"
    >
      <template v-slot:item.ACTIONS="{ item, index }">
        <v-tooltip text="Delete" location="top">
          <template v-slot:activator="{ props }">
           <v-btn v-bind="props" icon="fa-trash" color="error" @click="deletePattern(item.ID)"></v-btn>
          </template>
        </v-tooltip>
<!--        <router-link :to="{ name: 'patterns-detail', params: { id: item.ID }}">-->
          <v-tooltip text="Edit" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="fa-edit" color="info"></v-btn>
            </template>
          </v-tooltip>
<!--        </router-link>-->
        <v-tooltip text="Speak" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-volume-up" color="info" @click="settingsService.speak(item.PATTERN)" v-show="settingsService.selectedVoice"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Copy" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-copy" color="info" v-clipboard:copy="item.PATTERN"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Google Pattern" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-brands fa-google" color="info" @click="googlePattern(item.PATTERN)"></v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { container } from 'tsyringe';

  const appService = ref(container.resolve(AppService));
  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));

  const headers = ref([
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'PATTERN', sortable: false, key: 'PATTERN' },
    { title: 'NOTE', sortable: false, key: 'NOTE' },
    { title: 'TAGS', sortable: false, key: 'TAGS' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const page = ref(1);
  const pageCount = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(async _ => {
      rows.value = settingsService.value.USROWSPERPAGE;
      await onRefresh();
    });
  })();

  async function rowsChange(rows: number) {
    page.value = 1;
    await onRefresh();
  }

  async function onRefresh() {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await patternsService.value.getData(page.value, rows.value, filter.value, filterType.value);
    pageCount.value = (patternsService.value.patternCount + rows.value - 1) / rows.value >> 0;
  }

  function deletePattern(id: number) {
    patternsService.value.delete(id);
  }

  function googlePattern(pattern: string) {
    googleString(pattern);
  }
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
