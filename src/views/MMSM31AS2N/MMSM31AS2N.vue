<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="实绩信息"
        padding="5px">
        <template #customButtonSlot>
        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :toolbar-style="'both'"
            @erGridReady="erGrid1Ready"
            :config-id="'GridView1'">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM31AS2N.ts">
</script>

<style lang="scss">
</style>
