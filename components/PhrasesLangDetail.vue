<template>
  <v-dialog v-model="showDialog" max-width="750px">
    <v-card class="p-2">
      <v-text-field label="ID" type="text" v-model="item.ID" disabled />
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
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MLangPhrase } from '@/models/wpp/lang-phrase';

  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = phrasesLangService.value.langPhrases.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MLangPhrase : phrasesLangService.value.newLangPhrase());

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await (item.value.ID ? phrasesLangService.value.update(item.value) : phrasesLangService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
