<template>
    <div style="height: 100%;">
      <xr-ef-form @ready="efFormReady"
        :f2-do="F2_DO">
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"
          
          ></er-layout>
        <xr-ef-panel title="详细信息(喷印号为空时为黄色，重复为橙色，与板坯号不一致时为蓝色)"
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
  <script lang="ts" src="./MMSMYSPHS2N.ts">
  </script>
  