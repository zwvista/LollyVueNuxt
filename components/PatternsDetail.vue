<template>
  <v-dialog v-model="showDialog" max-width="750px">
    <v-card class="p-2">
      <v-text-field label="ID" type="text" v-model="item.ID" disabled />
      <v-text-field label="PATTERN" type="text" v-model="item.PATTERN" />
      <v-text-field label="TAGS" type="text" v-model="item.TAGS" />
      <v-text-field label="TITLE" type="text" v-model="item.TITLE" />
      <v-text-field label="URL" type="text" v-model="item.URL" />
      <v-card-actions>
        <v-spacer />
        <v-btn variant="elevated" color="info" @click="showDialog=false">Cancel</v-btn>
        <v-btn variant="elevated" color="info" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { PatternsService } from '@/shared/view-models/wpp/patterns.service';
  import { defineModel, defineProps, ref } from "vue";
  import { MPattern } from '@/shared/models/wpp/pattern';

  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = patternsService.value.patterns.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MPattern : patternsService.value.newPattern());

  const save = async () => {
    item.value.PATTERN = settingsService.value.autoCorrectInput(item.value.PATTERN);
    await (item.value.ID ? patternsService.value.update(item.value) : patternsService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
