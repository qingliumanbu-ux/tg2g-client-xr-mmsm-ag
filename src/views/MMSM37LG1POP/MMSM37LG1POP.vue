<template>
    <div style="height: 100%;">
      <xr-ef-form :f2-do="F2_DO"
        :in-dialog-form-name="openInDialog ? dialogFormName : null"
        @closeDialog="closeEfDialog"
        @ready="efFormReady">
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'layoutControlGroup1'"
          @valueChanged="layout_valueChanged1"
          style="overflow: auto;"></er-layout>
      </xr-ef-form>
    </div>
  </template>
  
  <script lang="ts"
    src="./MMSM37LG1POP.ts">
  </script>
  
  <style lang="scss" scoped>
  @import './MMSM37LG1POP.scss';
  </style>
  