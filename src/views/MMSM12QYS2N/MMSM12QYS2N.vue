<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL"
      :f7-do="F7_DO"
      :f7-pre-do="F7_PRE_DO"
      :f7-cancel="F7_CANCEL"
      :f8-do="F8_DO"
      :f8-pre-do="F8_PRE_DO"
      :f8-cancel="F8_CANCEL">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"></er-layout>
      <v-splitter style="height: 100%"
        class="default-theme">
        <v-splitter-pane>
          <div style="display: flex; flex-direction: column;height: 100%">
            <xr-ef-panel title="铁水信息"
              padding="5px">
              <template #customButtonSlot>
              </template>
              <template #contentSlot>
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView1'"
                  :toolbar-options="gridToolbar"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid1Ready">
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>
        </v-splitter-pane>
        <v-splitter-pane>
          <div style="display: flex; flex-direction: column;height: 100%">
            <xr-ef-panel title="成分信息"
              padding="0 0 0 0">
              <template #customButtonSlot>
              </template>
              <template #contentSlot>
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :toolbar-options="gridToolbar"
                  :toolbar-style="'both'"
                  :config-id="'GridView2'"
                  :grid-options="{showRowNo: 'false'}"
                  @erGridReady="erGrid2Ready">
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM12QYS2N.ts">
</script>

<style lang="scss"
  scoped>
@import './MMSM12QYS2N.scss';
</style>
