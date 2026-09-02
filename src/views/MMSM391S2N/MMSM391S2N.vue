<template>
    <div style="height: 100%;">
      <xr-ef-form @ready="efFormReady"
        :f2-do="F2_DO"
        :f3-do="F3_DO"
        :f4-do="F4_DO">
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"
          
          ></er-layout>
        <xr-ef-panel title="数据区"
          padding="5px">
          <template #customButtonSlot>
          </template>
          <template #contentSlot>
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView1'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid1Ready">
                </er-grid>
          </template>
        </xr-ef-panel>
      </xr-ef-form>
    </div>
  </template>
  <script lang="ts" src="./MMSM391S2N.ts">
  </script>
  