<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL"
      :f4-do="F4_DO"
      :f4-pre-do="F4_PRE_DO"
      :f4-cancel="F4_CANCEL"
    >
      <er-layout
        v-if="initializeFlag"
        :er-form-helper-prop="erFormHelper"
        :config-id="'MMSM11LayoutFilter'"
      ></er-layout>
      <xr-ef-panel title="查询结果" style="height: 100%" padding="5px">
        <template #customButtonSlot> </template>
        <template #contentSlot>
          <er-grid
            v-if="initializeFlag"
            :er-form-helper-prop="erFormHelper"
            :config-id="'MMSM11ListGridview'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSM11CV.ts"></script>
