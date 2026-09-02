<template>
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO">

      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"></er-layout>
      <xr-ef-panel title="板坯修正系数信息"
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

      <!-- xr-ef-dialog组件 -->
      <xr-ef-dialog v-model:visible="dialogVisible"
        :title="dialogFormName"
        height="80%"
        width="80%"
        @click-close-icon="xrEfDialogClose"
        :default-footer="false">
        <MMSM33CZXSPOP :openInDialog="true"
          :dialogFormName="dialogFormName"
          :parentInfo="parentInfo"
          @getChildInfo="getChildInfo"></MMSM33CZXSPOP>
      </xr-ef-dialog>
    </xr-ef-form>
  </template>
  
  <script lang="ts"
    src="./MMSM33CZXS.ts">
  </script>
  
  <style lang="scss"
    scoped>
  @import './MMSM33CZXS.scss';
  </style>
  