<template>
  <div>
    <v-toolbar>
      <v-text-field label="New Word" type="text" v-model="wordsUnitService.newWord" @keyup.enter="onEnterNewWord" />
      <v-tooltip text="Speak" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="fa-volume-up" color="info" @click="settingsService.speak(wordsUnitService.newWord)" v-show="settingsService.selectedVoice"></v-btn>
        </template>
      </v-tooltip>
      <v-select :items="settingsService.wordFilterTypes" item-title="label" v-model="wordsUnitService.filterType" @update:modelValue="onRefresh" />
      <v-text-field label="Filter" type="text" v-model="wordsUnitService.filter" @keyup.enter="onRefresh" />
      <v-btn variant="elevated" prepend-icon="fa-plus" color="info" @click.stop="showDetailDialog(0)">Add</v-btn>
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
      <v-checkbox label="If Empty" v-model="wordsUnitService.ifEmpty"></v-checkbox>
      <v-btn variant="elevated" v-show="settingsService.selectedDictNote" color="warning" @click="getNotes()">Get Notes</v-btn>
      <v-btn variant="elevated" v-show="settingsService.selectedDictNote" color="warning" @click="clearNotes()">Clear Notes</v-btn>
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
        <v-btn v-show="settingsService.isSingleUnitPart && !wordsUnitService.filter" style="cursor: move" icon="fa-bars" class="sortHandle"></v-btn>
      </template>
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
<!--        <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: index }}">-->
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
    <WordsUnitDetail v-if="showDetail" v-model="showDetail" :id="detailId"></WordsUnitDetail>
  </div>
</template>

<script setup lang="ts">
  // import Sortable from 'sortablejs';

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

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

  const onRefresh = async () => {
    await wordsUnitService.value.getDataInTextbook();
  };

  (async () => {
    await appService.value.getData();
    await onRefresh();
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

  const dragStart = ({item}: any) => {
    const nextSib = item.nextSibling;
    if (nextSib &&
      nextSib.classList.contains('datatable__expand-row')) {
      expandRow.value = nextSib;
    } else {
      expandRow.value = null;
    }
  };

  const dragReorder = ({item, oldIndex, newIndex}: any) => {
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
  };

  const onEnterNewWord = async () => {
    await wordsUnitService.value.createWithNewWord();
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

  const getNotes = () => {
    wordsUnitService.value.getNotes(ifEmpty, () => {}, () => {});
  };

  const clearNotes = () => {
    wordsUnitService.value.clearNotes(ifEmpty, () => {}, () => {});
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
