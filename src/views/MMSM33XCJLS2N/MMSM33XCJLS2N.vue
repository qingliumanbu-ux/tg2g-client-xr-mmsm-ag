<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL"
      :f4-do="F4_DO"
      :f4-pre-do="F4_PRE_DO"
      :f4-cancel="F4_CANCEL"
      :f5-do="F5_DO"
      :f5-pre-do="F5_PRE_DO"
      :f5-cancel="F5_CANCEL">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter :vertical="true"
        style="height: 100%"
        class="default-theme">
        <v-splitter-pane size="80">
          <xr-ef-panel title="校秤记录"
            style="height: 100%">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView_main'"
                :toolbar-style="'both'"
                @erGridReady="erGrid1Ready"
                @dblclick="GridView1dblclick">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="20">
          <xr-ef-panel title="砝码重量"
            style="height: 100%">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :config-id="'GridView_fama'"
                :toolbar-style="'both'"
                @erGridReady="erGrid2Ready"
                @dblclick="GridView2dblclick">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSM33XCJLS2N.ts">
</script>
