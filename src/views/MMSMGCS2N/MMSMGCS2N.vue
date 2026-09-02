<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f5-do="F5_DO"
      :f7-do="F7_DO"
      :f8-do="F8_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="倒罐数据区"
        padding="5px">
        <template #customButtonSlot>
        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView_m'"
            @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSMGCS2N.ts">
</script>

<style lang="scss">
//@import './MMSM12V.scss';
</style>
