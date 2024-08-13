<template>
  <v-dialog v-model="showDialog" max-width="750px">
    <v-card class="p-2">
      <v-text-field label="ID" type="text" v-model="item.ID" disabled />
      <v-select label="UNIT" :items="settingsService.units" item-title="label" v-model="item.UNIT" />
      <v-select label="PART" :items="settingsService.parts" item-title="label" v-model="item.PART" />
      <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM" />
      <v-text-field label="WORD" type="text" v-model="item.WORD" />
      <v-text-field label="NOTE" type="text" v-model="item.NOTE" />
      <v-text-field label="FAMIID" type="text" v-model="item.FAMIID" disabled />
      <v-text-field label="ACCURACY" type="text" v-model="item.ACCURACY" disabled />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="elevated" color="info" @click="showDialog=false">Cancel</v-btn>
        <v-btn variant="elevated" color="info" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MUnitWord } from "@/models/wpp/unit-word";

  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = wordsUnitService.value.unitWords.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MUnitWord : wordsUnitService.value.newUnitWord());

  const save = async () => {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    await (item.value.ID ? wordsUnitService.value.update(item.value) : wordsUnitService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
