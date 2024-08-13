<template>
  <v-dialog v-model="showDialog" max-width="750px">
    <v-card class="p-2">
      <v-text-field label="ID" type="text" v-model="item.ID" disabled />
      <v-select label="UNIT" :items="settingsService.units" item-title="label" v-model="item.UNIT" />
      <v-select label="PART" :items="settingsService.parts" item-title="label" v-model="item.PART" />
      <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM" />
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
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';

  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = phrasesUnitService.value.unitPhrases.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MUnitPhrase : phrasesUnitService.value.newUnitPhrase());

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await (item.value.ID ? phrasesUnitService.value.update(item.value) : await phrasesUnitService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
