<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"></er-layout>
      <xr-ef-panel title="详细信息"
        padding="5px">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :toolbar-options="gridToolbar"
            @erGridReady="erGrid1Ready"
            :toolbar-style="'both'"
            :config-id="'GridView'">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM3AS2N.ts">
</script>

<style lang="scss" scoped>
@import './MMSM3AS2N.scss';
</style>
