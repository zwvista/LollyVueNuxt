<template>
  <div>
    <v-toolbar>
      <v-select :items="settingsService.phraseFilterTypes" item-title="label" v-model="filterType" @update:modelValue="onRefresh" />
      <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
      <v-btn variant="elevated" prepend-icon="fa-plus" color="info" @click.stop="showDetailDialog(0)">Add</v-btn>
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="phrasesUnitService.unitPhrases"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template v-slot:item.DD="{ item }">
        <v-btn v-show="settingsService.isSingleUnitPart && !filter" style="cursor: move" icon class="sortHandle"><v-icon>fa-bars</v-icon></v-btn>
      </template>
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
          <span>Speak</span>
        </v-tooltip>
        <v-tooltip text="Copy" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-copy" color="info" v-clipboard:copy="item.PHRASE"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Delete" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-brands fa-google" color="info" @click="googlePhrase(item.PHRASE)"></v-btn>
          </template>
          <span>Google Phrase</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <PhrasesUnitDetail v-if="showDetail" v-model="showDetail" :id="detailId"></PhrasesUnitDetail>
  </div>
</template>

<script setup lang="ts">

  // import Sortable from 'sortablejs';
  import { container } from 'tsyringe';

  const appService = ref(container.resolve(AppService));
  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const headers = ref([
    { title: '', sortable: false, key: 'DD' },
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'UNIT', sortable: false, key: 'UNITSTR' },
    { title: 'PART', sortable: false, key: 'PARTSTR' },
    { title: 'SEQNUM', sortable: false, key: 'SEQNUM' },
    { title: 'PHRASEID', sortable: false, key: 'PHRASEID' },
    { title: 'PHRASE', sortable: false, key: 'PHRASE' },
    { title: 'TRANSLATION', sortable: false, key: 'TRANSLATION' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const filter = ref('');
  const filterType = ref(0);

  const onRefresh = async () => {
    await phrasesUnitService.value.getDataInTextbook(filter.value, filterType.value);
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
    const movedItem = phrasesUnitService.value.unitPhrases.splice(oldIndex, 1)[0];
    phrasesUnitService.value.unitPhrases.splice(newIndex, 0, movedItem);
    phrasesUnitService.value.reindex(index => {});
  };

  const deletePhrase = async (item: MUnitPhrase) => {
    await phrasesUnitService.value.delete(item);
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
