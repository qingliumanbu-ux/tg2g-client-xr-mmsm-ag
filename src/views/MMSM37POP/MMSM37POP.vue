<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      :f3-do="F3_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"
        @valueChanged="layout_valueChanged1"
        @click="query_zx"
        style="overflow: auto;"></er-layout>
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup3'"
        @valueChanged="layout_valueChanged3"
        style="overflow: auto;"></er-layout>

      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="`${lay}`"       
        @click="insert_zx"
        @valueChanged="layout_valueChanged6"
        style="overflow: auto;">
      </er-layout>

      <er-layout v-if="initializeFlag === 2"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup5'"
        @valueChanged="layout_valueChanged5"
        @click="query_edit_xc"
        style="overflow: auto;"></er-layout>

    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM37POP.ts">
</script>

<style lang="scss" scoped>
@import './MMSM37POP.scss';
</style>
