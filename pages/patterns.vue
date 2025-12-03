<template>
  <div>
    <v-toolbar>
      <v-select :items="settingsService.patternFilterTypes" item-title="label" v-model="patternsService.filterType" @update:modelValue="onRefresh" />
      <v-text-field label="Filter" type="text" v-model="patternsService.filter" @keyup.enter="onRefresh" />
      <v-btn variant="elevated" prepend-icon="fa-plus" color="info" @click.stop="showDetailDialog(0)">Add</v-btn>
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
    </v-toolbar>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="patternsService.rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
           />
        </v-col>
        <v-pagination
          v-model="patternsService.page"
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
        <v-tooltip text="Edit" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-edit" color="info" @click.stop="showDetailDialog(item.ID)"></v-btn>
          </template>
        </v-tooltip>
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
            v-model="patternsService.rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
           />
        </v-col>
        <v-pagination
          v-model="patternsService.page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <PatternsDetail v-if="showDetail" v-model="showDetail" :id="detailId"></PatternsDetail>
  </div>
</template>

<script setup lang="ts">
  const appService = ref(container.resolve(AppService));
  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const headers = ref([
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'PATTERN', sortable: false, key: 'PATTERN' },
    { title: 'TAGS', sortable: false, key: 'TAGS' },
    { title: 'TITLE', sortable: false, key: 'TITLE' },
    { title: 'URL', sortable: false, key: 'URL' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const pageCount = ref(1);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await patternsService.value.getData();
    pageCount.value = (patternsService.value.patternCount + patternsService.value.rows - 1) / patternsService.value.rows >> 0;
  };

  (async () => {
    await appService.value.getData();
    patternsService.value.rows = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const rowsChange = async (rows: number) => {
    patternsService.value.page = 1;
    await onRefresh();
  };

  const deletePattern = async (id: number) => {
    await patternsService.value.delete(id);
  };

  const googlePattern = (pattern: string) => {
    googleString(pattern);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
