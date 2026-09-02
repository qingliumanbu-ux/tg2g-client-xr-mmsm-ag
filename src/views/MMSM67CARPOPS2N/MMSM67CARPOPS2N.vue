<template>
  <xr-ef-form
    :f3-do="F3_DO"
    :f2-do="F2_DO" 
    :in-dialog-form-name="openInDialog ? dialogFormName : null"
    @initialized="efFormInitialized"
    @closeDialog="closeEfDialog"
    
    @ready="efFormReady"
  >
    <er-layout
      v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="'layoutControlGroup'"
    ></er-layout>
    <xr-ef-panel title="配车信息" >
      <!-- padding="6px" -->
       <template #customButtonSlot> </template>
      <template #contentSlot>
        <er-grid
          v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'GridView1'"
          :toolbar-options="gridToolbar"
          :toolbar-style="'both'"
          @erGridReady="erGrid2Ready"
        >
        </er-grid>
      </template>
    </xr-ef-panel>
  </xr-ef-form>
</template>

<script lang="ts" src="./MMSM67CARPOPS2N.ts"></script>

<style lang="scss" scoped>
@import "./MMSM67CARPOPS2N.scss";
</style>
