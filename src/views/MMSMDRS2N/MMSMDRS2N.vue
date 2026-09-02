<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      :f5-pre-do="F5_PRE_DO"
      :f5-cancel="F5_CANCEL"
    >
      <er-layout
        v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"
      ></er-layout>
      <xr-ef-panel
        title="导入数据"
        padding="5px"
      >
        <template #customButtonSlot> </template>
        <template #contentSlot>
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView1'"
            :toolbar-style="'both'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>
<script lang="ts" src="./MMSMDRS2N.ts"></script>
