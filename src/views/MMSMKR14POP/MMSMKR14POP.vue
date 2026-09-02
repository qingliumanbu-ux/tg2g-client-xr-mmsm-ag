<template>
  <div style="height: 100%">
    <xr-ef-form @ready="efFormReady"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog">
      <div style="display: flex; flex-direction: column; height: 100%;overflow: auto;">
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :allow-collapse="true"
          :config-id="'layoutControlGroup1'"
          @loaded="layout1Loaded"></er-layout>
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :allow-collapse="true"
          :config-id="'layoutControlGroup2'"
          @loaded="layout2Loaded"></er-layout>
      </div>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSMKR14POP.ts"></script>

<style lang="scss" scoped>
@import './MMSMKR14POP.scss';
</style>
