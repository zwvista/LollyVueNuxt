<template>
  <div>
    <v-toolbar>
      <v-text-field label="New Word" type="text" v-model="newWord" @keyup.enter="onEnterNewWord"></v-text-field>
      <v-tooltip text="Speak" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="fa-volume-up" color="info" @click="settingsService.speak(newWord)" v-show="settingsService.selectedVoice"></v-btn>
        </template>
      </v-tooltip>
      <v-select :items="settingsService.wordFilterTypes" item-title="label" v-model="filterType" @update:modelValue="onRefresh"></v-select>
      <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
<!--      <router-link to="/words-unit-detail/0">-->
        <v-btn variant="elevated" prepend-icon="fa-plus" color="info">Add</v-btn>
<!--      </router-link>-->
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
      <v-btn variant="elevated" v-show="settingsService.selectedDictNote" color="warning">Retrieve All Notes</v-btn>
      <v-btn variant="elevated" v-show="settingsService.selectedDictNote" color="warning">Retrieve Notes If Empty</v-btn>
<!--      <router-link to="/words-dict/unit/0">-->
        <v-btn variant="elevated" prepend-icon="fa-book" color="info">Dictionary</v-btn>
<!--      </router-link>-->
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="wordsUnitService.unitWords"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template v-slot:item.DD="{ item }">
        <v-btn v-show="settingsService.isSingleUnitPart && !filter" style="cursor: move" icon="fa-bars" class="sortHandle"></v-btn>
      </template>
      <template v-slot:item.ACTIONS="{ item, index }">
        <v-tooltip text="Delete" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-trash" color="error" @click="deleteWord(item)"></v-btn>
          </template>
        </v-tooltip>
<!--        <router-link :to="{ name: 'words-unit-detail', params: { id: item.ID }}">-->
          <v-tooltip text="Edit" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="fa-edit" color="info"></v-btn>
            </template>
          </v-tooltip>
<!--        </router-link>-->
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
<!--        <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: index }}">-->
          <v-tooltip text="Dictionary" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="fa-book" color="info"></v-btn>
            </template>
          </v-tooltip>
<!--        </router-link>-->
        <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(index)">Retrieve Note</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">

  import { container } from 'tsyringe';

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const headers = ref([
    { title: '', sortable: false, key: 'DD' },
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'UNIT', sortable: false, key: 'UNITSTR' },
    { title: 'PART', sortable: false, key: 'PARTSTR' },
    { title: 'SEQNUM', sortable: false, key: 'SEQNUM' },
    { title: 'WORDID', sortable: false, key: 'WORDID' },
    { title: 'WORD', sortable: false, key: 'WORD' },
    { title: 'NOTE', sortable: false, key: 'NOTE' },
    { title: 'ACCURACY', sortable: false, key: 'ACCURACY' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const newWord = ref('');
  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(async _ => {
      await onRefresh();
    });
  })();

  const expandRow = ref(null);

  onMounted(() => {
    // /* eslint-disable no-new */
    // new Sortable(
    //   ($refs.sortableTable as any).$el.getElementsByTagName('tbody')[0],
    //   {
    //     draggable: '.sortableRow',
    //     handle: '.sortHandle',
    //     onStart: dragStart,
    //     onEnd: dragReorder,
    //   },
    // );
  });

  function dragStart({item}: any) {
    const nextSib = item.nextSibling;
    if (nextSib &&
      nextSib.classList.contains('datatable__expand-row')) {
      expandRow.value = nextSib;
    } else {
      expandRow.value = null;
    }
  }

  function dragReorder({item, oldIndex, newIndex}: any) {
    console.log('reorder', item, oldIndex, newIndex);
    const nextSib = item.nextSibling;
    if (nextSib &&
      nextSib.classList.contains('datatable__expand-row') &&
      nextSib !== expandRow) {
      item.parentNode.insertBefore(item, nextSib.nextSibling);
    }
    const movedItem = wordsUnitService.value.unitWords.splice(oldIndex, 1)[0];
    wordsUnitService.value.unitWords.splice(newIndex, 0, movedItem);
    wordsUnitService.value.reindex(index => {});
  }

  async function onEnterNewWord() {
    if (!newWord.value) return;
    const o = wordsUnitService.value.newUnitWord();
    o.WORD = settingsService.value.autoCorrectInput(newWord.value);
    newWord.value = '';
    const id = await wordsUnitService.value.create(o);
    o.ID = id as number;
    wordsUnitService.value.unitWords.push(o);
  }

  async function onRefresh() {
    await wordsUnitService.value.getDataInTextbook(filter.value, filterType.value);
  }

  async function deleteWord(item: MUnitWord) {
    await wordsUnitService.value.delete(item);
  }

  async function getNote(index: number) {
    console.log(index);
    await wordsUnitService.value.getNote(index);
  }

  function googleWord(word: string) {
    googleString(word);
  }

  function getNotes(ifEmpty: boolean) {
    wordsUnitService.value.getNotes(ifEmpty, () => {}, () => {});
  }
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
