<template>
  <div class="h-100 d-flex align-items-center justify-content-center">
    <v-container class="w-50" v-if="settingsService.selectedLang">
      <v-row>
        <v-col cols="4">
          <label for="lang">Language:</label>
        </v-col>
        <v-col cols="8">
          <v-select id="lang" :model-value="settingsService.selectedLang" @update:model-value="onLangChange($event)"
                    :items="settingsService.languages" :return-object="true" item-title="NAME" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
          <label for="voice">Voice:</label>
        </v-col>
        <v-col cols="8">
          <v-select id="voice" :model-value="settingsService.selectedVoice" @update:model-value="onVoiceChange($event)"
                    :items="settingsService.voices" :return-object="true" item-title="VOICENAME" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
          <label for="dictReference">Dictionary(Reference):</label>
        </v-col>
        <v-col cols="8">
          <v-select id="dictReference" :model-value="settingsService.selectedDictReference" @update:model-value="onDictReferenceChange($event)"
                    :items="settingsService.dictsReference" :return-object="true" item-title="NAME" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
          <label for="dictNote">Dictionary(Note):</label>
        </v-col>
        <v-col cols="8">
          <v-select id="dictNote" :model-value="settingsService.selectedDictNote" @update:model-value="onDictNoteChange($event)"
                    :items="settingsService.dictsNote" :return-object="true" item-title="NAME" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
          <label for="dictTranslation">Dictionary(Translation):</label>
        </v-col>
        <v-col cols="8">
          <v-select id="dictTranslation" :model-value="settingsService.selectedDictTranslation" @update:model-value="onDictTranslationChange($event)"
                    :items="settingsService.dictsTranslation" :return-object="true" item-title="NAME" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
          <label for="textbook">Textbook:</label>
        </v-col>
        <v-col cols="8">
          <v-select id="textbook" :model-value="settingsService.selectedTextbook" @update:model-value="onTextbookChange($event)"
                    :items="settingsService.textbooks" :return-object="true" item-title="NAME" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
          <label>Unit:</label>
        </v-col>
        <v-col cols="4">
          <v-select id="unitFrom" :model-value="settingsService.USUNITFROM" @update:model-value="onUnitFromChange($event)"
                    :items="settingsService.units" item-title="label" />
        </v-col>
        <v-col cols="4">
          <v-select id="partFrom" :disabled="toTypeIsUnit" :model-value="settingsService.USPARTFROM" @update:model-value="onPartFromChange($event)"
                    :items="settingsService.parts" item-title="label" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
          <v-select id="toType" :model-value="settingsService.toType" @update:model-value="onToTypeChange($event)"
                    :items="settingsService.toTypes" item-title="label" />
        </v-col>
        <v-col cols="4">
          <v-select id="unitTo" :disabled="!toTypeIsTo" :model-value="settingsService.USUNITTO" @update:model-value="onUnitToChange($event)"
                    :items="settingsService.units" item-title="label" />
        </v-col>
        <v-col cols="4">
          <v-select id="partTo" :disabled="!toTypeIsTo" :model-value="settingsService.USPARTTO" @update:model-value="onPartToChange($event)"
                    :items="settingsService.parts" item-title="label" />
        </v-col>
      </v-row>
      <v-row class="mt-n10">
        <v-col cols="4">
        </v-col>
        <v-col>
          <v-btn class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="previousUnitPart()">Previous</v-btn>
          <v-btn class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="nextUnitPart()">Next</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MLanguage } from '@/models/misc/language';
  import { MDictionary } from '@/models/misc/dictionary';
  import { MTextbook } from '@/models/misc/textbook';
  import { MVoice } from '@/models/misc/voice';
  import { container } from 'tsyringe';
  import { computed, ref } from "vue";

  const settingsService = ref(container.resolve(SettingsService));

  const toTypeIsUnit = computed(() => settingsService.value.toType === 0);
  const toTypeIsPart = computed(() => settingsService.value.toType === 1);
  const toTypeIsTo = computed(() => settingsService.value.toType === 2);

  (async () => {
    await settingsService.value.getData();
  })();

  const onLangChange = async (value: MLanguage) => {
    settingsService.value.selectedLang = value;
    await settingsService.value.updateLang();
  };

  const onVoiceChange = async (value: MVoice) => {
    settingsService.value.selectedVoice = value;
    await settingsService.value.updateVoice();
  };

  const onDictReferenceChange = async (value: MDictionary) => {
    settingsService.value.selectedDictReference = value;
    await settingsService.value.updateDictReference();
  };

  const onDictNoteChange = async (value: MDictionary) => {
    settingsService.value.selectedDictNote = value;
    await settingsService.value.updateDictNote();
  };

  const onDictTranslationChange = async (value: MDictionary) => {
    settingsService.value.selectedDictTranslation = value;
    await settingsService.value.updateDictTranslation();
  };

  const onTextbookChange = async (value: MTextbook) => {
    settingsService.value.selectedTextbook = value;
    await settingsService.value.updateTextbook();
  };

  const onUnitFromChange = async (value: number) => {
    await settingsService.value.updateUnitFrom(value);
  };

  const onPartFromChange = async (value: number) => {
    await settingsService.value.updatePartFrom(value);
  };

  const onToTypeChange = async (value: number) => {
    await settingsService.value.updateToType(value);
  };

  const previousUnitPart = async () => {
    await settingsService.value.previousUnitPart();
  };

  const nextUnitPart = async () => {
    await settingsService.value.nextUnitPart();
  };

  const onUnitToChange = async (value: number) => {
    await settingsService.value.updateUnitTo(value);
  };

  const onPartToChange = async (value: number) => {
    await settingsService.value.updateUnitTo(value);
  };
</script>

<style>
</style>
