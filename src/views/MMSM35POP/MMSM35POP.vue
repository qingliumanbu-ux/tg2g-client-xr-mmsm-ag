<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO" :in-dialog-form-name="openInDialog ? dialogFormName : null" @closeDialog="closeEfDialog"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'layoutControlGroup1'"
        style="overflow: auto;" @valueChanged="layout_valueChanged1"></er-layout>
      <er-layout v-if="initializeFlag === 1 && isLayout2Visib" :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup2'" @valueChanged="layout_valueChanged"></er-layout>
      <xr-ef-panel title="分切实绩录入区" padding="5px" v-if="isGridVisib">
        <template #customButtonSlot>
        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1 && isGridVisib" :er-form-helper-prop="erFormHelper"
            :config-id="'gridView1'" @erGridReady="erGrid1Ready" @cell-value-changed="cellValueChanged">
          </er-grid>
        </template>
      </xr-ef-panel>
      <er-layout v-if="initializeFlag === 1 && isGridVisib" :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup2'" @valueChanged="layout_valueChanged"></er-layout>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSM35POP.ts">
</script>

<style lang="scss" scoped>
@import './MMSM35POP.scss';
</style>
