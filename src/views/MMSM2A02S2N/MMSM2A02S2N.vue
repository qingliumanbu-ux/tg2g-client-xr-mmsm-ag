<template>
  <xr-ef-form @ready="efFormReady"
    :f2-do="F2_DO"
    :f3-do="F3_DO"
    :f3-pre-do="F3_PRE_DO"
    :f3-cancel="F3_CANCEL"
    :f4-do="F4_DO"
    :f4-pre-do="F4_PRE_DO"
    :f4-cancel="F4_CANCEL"
    :f5-do="F5_DO"
    :f5-pre-do="F5_PRE_DO"
    :f5-cancel="F5_CANCEL">
    <er-layout v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="'layoutControlGroup1'"></er-layout>
    <xr-ef-panel title="加料实绩信息"
      padding="5px">
      <template #customButtonSlot>

      </template>
      <template #contentSlot>
        <er-grid v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'GridView1'"
          @erGridReady="erGrid1Ready"
          :toolbar-options="gridToolbar"
          :toolbar-style="'both'">
        </er-grid>
      </template>
    </xr-ef-panel>
  </xr-ef-form>
</template>

<script lang="ts"
  src="./MMSM2A02S2N.ts">
</script>

<style lang="scss"
  scoped>
@import './MMSM2A02S2N.scss';
</style>
