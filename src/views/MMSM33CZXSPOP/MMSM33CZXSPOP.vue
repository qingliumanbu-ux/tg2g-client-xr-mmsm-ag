<template>
  <div style="height: 100%">
    <xr-ef-form :f2-do="F2_DO"
      @ready="efFormReady"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"
        :allow-collapse="true"
        @loaded="layout1Loaded"></er-layout>
    </xr-ef-form>
  </div>
</template>

  <script lang="ts" src="./MMSM33CZXSPOP.ts"></script>

  <style lang="scss" scoped>
@import './MMSM33CZXSPOP.scss';
</style>
