<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL"
      :f4-do="F4_DO"
      :f4-pre-do="F4_PRE_DO"
      :f4-cancel="F4_CANCEL"
      :f5-do="F5_DO"
      :f5-pre-do="F5_PRE_DO"
      :f5-cancel="F5_CANCEL"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"
        :show-group-border="false"></er-layout>
      <xr-ef-panel id="mainGridView"
        title="详细信息"
        padding="5px">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView_m'"
            :toolbar-options="gridToolbar"
            :toolbar-style="'both'"
            @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>
<script lang="ts"
  src="./MMSMWTS2N.ts">
</script>

<style lang="scss">
@import './MMSMWTS2N.scss';
</style>
