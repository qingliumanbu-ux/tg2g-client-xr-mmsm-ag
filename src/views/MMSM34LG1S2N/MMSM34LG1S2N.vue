<template>
  <div style="height: 100%;">
    <xr-ef-form 
      :f2-do="F2_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="修磨计划详细信息"
        padding="5px">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <a-tabs type="card">
            <a-tab-pane key="tab1"
              tab="修磨计划">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                @erGridReady="erGrid1Ready"
                :config-id="'GridView1'">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM34LG1S2N.ts">
</script>

<style lang="scss" scoped>
@import './MMSM34LG1S2N.scss';
</style>