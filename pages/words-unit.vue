<template>
  <div>
    <v-toolbar>
      <div class="xs-6 md-2">
        <v-text-field label="New Word" type="text" v-model="newWord" @keyup.enter="onEnterNewWord"></v-text-field>
      </div>
      <v-tooltip top v-show="settingsService.selectedVoice">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon="fa-volume-up" color="info" @click="settingsService.speak(newWord)"></v-btn>
        </template>
        <span>Speak</span>
      </v-tooltip>
      <div class="xs-6 md-2">
        <v-select :items="settingsService.wordFilterTypes" item-text="label" item-value="value" v-model="filterType" @change="onRefresh"></v-select>
      </div>
      <div class="xs-6 md-2">
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
      </div>
      <router-link to="/words-unit-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <v-btn v-show="settingsService.selectedDictNote" color="warning">Retrieve All Notes</v-btn>
      <v-btn v-show="settingsService.selectedDictNote" color="warning">Retrieve Notes If Empty</v-btn>
      <router-link to="/words-dict/unit/0">
        <v-btn color="info"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
      </router-link>
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
      <template v-slot:body="{items}">
        <tbody>
        <tr class="sortableRow" v-for="(item, index) in items" :key="item.ID" :style="item.colorStyle">
          <td class="px-1" style="width: 0.1%">
            <v-btn v-show="settingsService.isSingleUnitPart && !filter" style="cursor: move" icon="fa-bars" class="sortHandle"></v-btn>
          </td>
          <td>{{ item.ID }}</td>
          <td>{{ item.UNITSTR }}</td>
          <td>{{ item.PARTSTR }}</td>
          <td>{{ item.SEQNUM }}</td>
          <td>{{ item.WORDID }}</td>
          <td>{{ item.WORD }}</td>
          <td>{{ item.NOTE }}</td>
          <td>{{ item.ACCURACY }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon="fa-trash" color="error" @click="deleteWord(item)"></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-unit-detail', params: { id: item.ID }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon="fa-edit" color="info"></v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top v-show="settingsService.selectedVoice">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon="fa-volume-up" color="info" @click="settingsService.speak(item.WORD)"></v-btn>
              </template>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon="fa-copy" color="info" v-clipboard:copy="item.WORD"></v-btn>
                </template>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon="fa-google" color="info" @click="googleWord(item.WORD)"></v-btn>
              </template>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: index }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon="fa-book" color="info"></v-btn>
                </template>
                <span>Dictionary</span>
              </v-tooltip>
            </router-link>
            <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(index)">Retrieve Note</v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">

  import "reflect-metadata";
  // import { WordsUnitService } from '~/view-models/wpp/words-unit.service';
  // import Sortable from 'sortablejs';
  // import { SettingsService } from '~/view-models/misc/settings.service';
  // import { googleString } from '~/common/common';
  // import { MUnitWord } from '~/models/wpp/unit-word';
  // import { AppService } from '~/view-models/misc/app.service';
  import { container } from 'tsyringe';

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const headers = ref([
    { sortable: false },
    { text: 'ID', sortable: false, value: 'ID' },
    { text: 'UNIT', sortable: false, value: 'UNIT' },
    { text: 'PART', sortable: false, value: 'PART' },
    { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
    { text: 'WORDID', sortable: false, value: 'WORDID' },
    { text: 'WORD', sortable: false, value: 'WORD' },
    { text: 'NOTE', sortable: false, value: 'NOTE' },
    { text: 'ACCURACY', sortable: false, value: 'ACCURACY' },
    { text: 'ACTIONS', sortable: false },
  ]);
  const newWord = ref('');
  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      onRefresh();
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
