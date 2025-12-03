<template>
  <div>
    <v-toolbar>
      <v-select :items="settingsService.wordFilterTypes" item-title="label" v-model="wordsUnitService.filterType" @update:modelValue="onRefresh" />
      <v-text-field label="Filter" type="text" v-model="wordsUnitService.filter" @keyup.enter="onRefresh" />
      <v-select :items="settingsService.textbookFilters" item-title="label" v-model="wordsUnitService.textbookFilter" @update:modelValue="onRefresh" />
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info">Refresh</v-btn>
<!--      <router-link to="/words-dict/textbook/0">-->
        <v-btn variant="elevated" prepend-icon="fa-book" color="info" @click="onRefresh()">Dictionary</v-btn>
<!--      </router-link>-->
    </v-toolbar>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="wordsUnitService.rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
           />
        </v-col>
        <v-pagination
          v-model="wordsUnitService.page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="wordsUnitService.textbookWords"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      item-key="ID"
    >
      <template v-slot:item.ACTIONS="{ item, index }">
        <v-tooltip text="Delete" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-trash" color="error" @click="deleteWord(item)"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Edit" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-edit" color="info" @click.stop="showDetailDialog(item.ID)"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Speak" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-volume-up" color="info" @click="settingsService.speak(item.WORD)" v-show="settingsService.selectedVoice"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Copy" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-copy" color="info" v-clipboard:copy="item.WORD"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Google Word" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-brands fa-google" color="info" @click="googleWord(item.WORD)"></v-btn>
          </template>
        </v-tooltip>
<!--        <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: index }}">-->
          <v-tooltip text="Dictionary" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="fa-book" color="info"></v-btn>
            </template>
          </v-tooltip>
<!--        </router-link>-->
        <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(item)">Get Note</v-btn>
        <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="clearNote(item)">Clear Note</v-btn>
      </template>
    </v-data-table>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="wordsUnitService.rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
           />
        </v-col>
        <v-pagination
          v-model="wordsUnitService.page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <WordsTextbookDetail v-if="showDetail" v-model="showDetail" :id="detailId"></WordsTextbookDetail>
  </div>
</template>

<script setup lang="ts">
  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const headers = ref([
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'TEXTBOOKNAME', sortable: false, key: 'TEXTBOOKNAME' },
    { title: 'UNIT', sortable: false, key: 'UNITSTR' },
    { title: 'PART', sortable: false, key: 'PARTSTR' },
    { title: 'SEQNUM', sortable: false, key: 'SEQNUM' },
    { title: 'WORDID', sortable: false, key: 'WORDID' },
    { title: 'WORD', sortable: false, key: 'WORD' },
    { title: 'NOTE', sortable: false, key: 'NOTE' },
    { title: 'ACCURACY', sortable: false, key: 'ACCURACY' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const pageCount = ref(1);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsUnitService.value.getDataInLang();
    pageCount.value = (wordsUnitService.value.textbookWordCount + wordsUnitService.value.rows - 1) / wordsUnitService.value.rows >> 0;
  };

  (async () => {
    await appService.value.getData();
    wordsUnitService.value.rows = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const rowsChange = async (rows: number) => {
    wordsUnitService.value.page = 1;
    await onRefresh();
  };

  const deleteWord = async (item: MUnitWord) => {
    await wordsUnitService.value.delete(item);
  };

  const getNote = async (item: MUnitWord) => {
    await wordsUnitService.value.getNote(item);
  };

  const clearNote = async (item: MUnitWord) => {
    await wordsUnitService.value.clearNote(item);
  };

  const googleWord = (word: string) => {
    googleString(word);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
