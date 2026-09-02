<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="f2Do"
      :f3-do="f3Do"
      :f3-pre-do="f3PreDo"
      :f3-cancel="f3Cancel"
      :f4-do="f4Do"
      :f4-pre-do="f4PreDo"
      :f4-cancel="f4Cancel"
      :f5-do="f5Do"
      :f5-pre-do="f5PreDo"
      :f5-cancel="f5Cancel"
    >
      <er-layout
        v-if="initializeFlag"
        :er-form-helper-prop="erFormHelper"
        :config-id="'tmmsm11LayoutFilter'"
      ></er-layout>
      <xr-ef-panel title="查询结果" style="height: 100%" padding="5px">
        <template #customButtonSlot> </template>
        <template #contentSlot>
          <er-grid
            v-if="initializeFlag"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView_tmmsm11'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSM11AV.ts"></script>

<style lang="scss">
@import "./MMSM11AV.scss";
</style>
