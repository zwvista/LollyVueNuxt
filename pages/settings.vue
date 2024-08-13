<template>
  <div class="h-100 d-flex align-items-center justify-content-center">
    <b-container class="w-50" v-if="settingsService.selectedLang">
      <b-form-group class="mb-2" label="Language:" label-for="lang" label-cols="4" content-cols="8">
        <b-form-select id="lang" :model-value="settingsService.selectedLang" @update:model-value="onLangChange($event)"
          :options="settingsService.languages" value-field="" text-field="NAME" />
      </b-form-group>
      <b-form-group class="mb-2" label="Voice:" label-for="voice" label-cols="4" content-cols="8">
        <b-form-select id="voice" :model-value="settingsService.selectedVoice" @update:model-value="onVoiceChange($event)"
          :options="settingsService.voices" value-field="" text-field="VOICENAME" />
      </b-form-group>
      <b-form-group class="mb-2" label="Dictionary(Reference):" label-for="dictReference" label-cols="4" content-cols="8">
        <b-form-select id="dictReference" :model-value="settingsService.selectedDictReference" @update:model-value="onDictReferenceChange($event)"
          :options="settingsService.dictsReference" value-field="" text-field="NAME" />
      </b-form-group>
      <b-form-group class="mb-2" label="Dictionary(Note):" label-for="dictNote" label-cols="4" content-cols="8">
        <b-form-select id="dictNote" :model-value="settingsService.selectedDictNote" @update:model-value="onDictNoteChange($event)"
          :options="settingsService.dictsNote" value-field="" text-field="NAME" />
      </b-form-group>
      <b-form-group class="mb-2" label="Dictionary(Translation):" label-for="dictTranslation" label-cols="4" content-cols="8">
        <b-form-select id="dictTranslation" :model-value="settingsService.selectedDictTranslation" @update:model-value="onDictTranslationChange($event)"
          :options="settingsService.dictsTranslation" value-field="" text-field="NAME" />
      </b-form-group>
      <b-form-group class="mb-2" label="Textbook:" label-for="textbook" label-cols="4" content-cols="8">
        <b-form-select id="textbook" :model-value="settingsService.selectedTextbook" @update:model-value="onTextbookChange($event)"
          :options="settingsService.textbooks" value-field="" text-field="NAME" />
      </b-form-group>
      <b-form-group class="mb-2" label="Unit:" label-cols="4" content-cols="8">
        <b-input-group>
          <b-form-select id="unitFrom" :model-value="settingsService.USUNITFROM" @update:model-value="onUnitFromChange($event)"
            :options="settingsService.units" text-field="label" />
          <b-form-select id="partFrom" :disabled="toTypeIsUnit" :model-value="settingsService.USPARTFROM" @update:model-value="onPartFromChange($event)"
            :options="settingsService.parts" text-field="label" />
        </b-input-group>
      </b-form-group>
      <b-row class="mb-2">
        <b-col cols="4">
          <b-form-select id="toType" :model-value="settingsService.toType" @update:model-value="onToTypeChange($event)"
             :options="settingsService.toTypes" text-field="label" />
        </b-col>
        <b-col cols="8">
          <b-input-group>
            <b-form-select id="unitTo" :disabled="!toTypeIsTo" :model-value="settingsService.USUNITTO" @update:model-value="onUnitToChange($event)"
              :options="settingsService.units" text-field="label" />
            <b-form-select id="partTo" :disabled="!toTypeIsTo" :model-value="settingsService.USPARTTO" @update:model-value="onPartToChange($event)"
              :options="settingsService.parts" text-field="label" />
          </b-input-group>
        </b-col>
      </b-row>
      <b-form-group class="mb-2" label-cols="4" content-cols="8">
        <b-button-group>
          <button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="previousUnitPart()">Previous</button>
          <button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="nextUnitPart()">Next</button>
        </b-button-group>
      </b-form-group>
    </b-container>
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
