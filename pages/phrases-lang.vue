<template>
  <div>
    <v-toolbar>
      <v-select :items="settingsService.phraseFilterTypes" item-title="label" v-model="phrasesLangService.filterType" @update:modelValue="onRefresh" />
      <v-text-field label="Filter" type="text" v-model="phrasesLangService.filter" @keyup.enter="onRefresh" />
      <v-btn variant="elevated" prepend-icon="fa-plus" color="info" @click.stop="showDetailDialog(0)">Add</v-btn>
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
    </v-toolbar>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="phrasesLangService.rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
           />
        </v-col>
        <v-pagination
          v-model="phrasesLangService.page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="phrasesLangService.langPhrases"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      item-key="ID"
    >
      <template v-slot:item.ACTIONS="{ item, index }">
        <v-tooltip text="Delete" location="top">
          <template v-slot:activator="{ props }">
           <v-btn v-bind="props" icon="fa-trash" color="error" @click="deletePhrase(item)"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Edit" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-edit" color="info" @click.stop="showDetailDialog(item.ID)"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Speak" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-volume-up" color="info" @click="settingsService.speak(item.PHRASE)" v-show="settingsService.selectedVoice"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Copy" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-copy" color="info" v-clipboard:copy="item.PHRASE"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Google Phrase" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-brands fa-google" color="info" @click="googlePhrase(item.PHRASE)"></v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="phrasesLangService.rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
           />
        </v-col>
        <v-pagination
          v-model="phrasesLangService.page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <PhrasesLangDetail v-if="showDetail" v-model="showDetail" :id="detailId"></PhrasesLangDetail>
  </div>
</template>

<script setup lang="ts">
  const appService = ref(container.resolve(AppService));
  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const headers = ref([
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'PHRASE', sortable: false, key: 'PHRASE' },
    { title: 'TRANSLATION', sortable: false, key: 'TRANSLATION' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const pageCount = ref(1);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await phrasesLangService.value.getData();
    pageCount.value = (phrasesLangService.value.langPhraseCount + phrasesLangService.value.rows - 1) / phrasesLangService.value.rows >> 0;
  };

  (async () => {
    await appService.value.getData();
    await onRefresh();
  })();

  const rowsChange = async (rows: number) => {
    phrasesLangService.value.page = 1;
    await onRefresh();
  };

  const deletePhrase = async (item: MLangPhrase) => {
    await phrasesLangService.value.delete(item);
  };

  const googlePhrase = (phrase: string) => {
    googleString(phrase);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
