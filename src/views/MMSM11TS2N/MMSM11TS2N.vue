<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      :f9-do="F9_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter :horizontal="true"
        style="height: 100%"
        class="default-theme">
        <v-splitter-pane size="40">
          <xr-ef-panel title="实绩信息"
            style="height: 100%"
            height="7777"
            padding="5px">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView_m'"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                @focus-changed="gridView_mFocusChanged"
                @erGridReady="erGrid1Ready">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="30">
          <xr-ef-panel title="倒罐铁包铁水"
            padding="5px"
            style="height: 100%">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-style="'both'"
                :config-id="'layoutControlGroup_dg'"
                @erGridReady="erGrid2Ready">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="30">
          <xr-ef-panel title="鱼雷罐铁水成分"
            padding="5px"
            style="height: 100%">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-style="'both'"
                :config-id="'layoutControlGroup_cf'"
                @erGridReady="erGrid3Ready">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM11TS2N.ts">
</script>

<style lang="scss">
//@import './MMSM11.scss';
</style>
