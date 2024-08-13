<template>
  <v-dialog v-model="showDialog" max-width="750px">
    <v-card class="p-2">
      <v-text-field label="ID" type="text" v-model="item.ID" disabled />
      <v-text-field label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disabled />
      <v-select label="UNIT" :items="settingsService.units" item-title="label" v-model="item.UNIT" />
      <v-select label="PART" :items="settingsService.parts" item-title="label" v-model="item.PART" />
      <v-text-field label="PHRASEID" type="text" v-model="item.PHRASEID" disabled />
      <v-text-field label="PHRASE" type="text" v-model="item.PHRASE" />
      <v-text-field label="TRANSLATION" type="text" v-model="item.TRANSLATION" />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="elevated" color="info" @click="showDialog=false">Cancel</v-btn>
        <v-btn variant="elevated" color="info" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";

  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const item = ref(Object.create(phrasesUnitService.value.textbookPhrases.find(value => value.ID === id)!) as MUnitPhrase);

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await phrasesUnitService.value.update(item.value);
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
