<template>
  <div style="height: 100%;">
  <xr-ef-form @ready="efFormReady"
    :f2-do="F2_DO">
    <er-layout v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="'layoutControlGroup1'"></er-layout>
    <xr-ef-panel title="铁水信息"
      padding="5px">
      <template #customButtonSlot>

      </template>
      <template #contentSlot>
        <er-grid v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'GridView1'"
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
  src="./MMSM12DCS2N.ts">
</script>

<style lang="scss"
  scoped>
@import './MMSM12DCS2N.scss';
</style>
