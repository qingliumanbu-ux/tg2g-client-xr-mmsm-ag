<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
    >
      <er-layout
        v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"
      ></er-layout>
      <xr-ef-panel
        title="修磨停机记录"
        padding="5px"
      >
        <template #customButtonSlot></template>
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
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSMWXMJYJLS2N.ts"></script>

<style lang="scss" scoped>
@import "./MMSMWXMJYJLS2N.scss";
</style>
