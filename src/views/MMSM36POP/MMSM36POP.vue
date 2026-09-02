<template>
  <div style="height: 100%;">
    <xr-ef-form 
      :f2-do="F2_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"></er-layout>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM36POP.ts">
</script>

<style lang="scss" scoped>
@import './MMSM36POP.scss';
</style>
