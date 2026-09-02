<template>
  <div style="height: 100%">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      :f6-do="F6_DO"
      :f6-pre-do="F6_PRE_DO"
      :f6-cancel="F6_CANCEL">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="layout_group_filter"></er-layout>
      <v-splitter style="height: 100%"
        class="default-theme">
        <v-splitter-pane size="60">
          <v-splitter horizontal
            style="height: 100%"
            class="default-theme">
            <v-splitter-pane size="40">
              <xr-ef-panel title="炉次信息"
                padding="0px"
                style="height: 100%">
                <template #customButtonSlot> </template>
                <template #contentSlot>
                  <er-grid v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="grid_view_1"
                    :toolbar-style="'both'"
                    @erGridReady="erGrid1Ready"
                    @focus-changed="gridView1FocusChanged"
                    @row-double-clicked="GridView1DoubleClick">
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>

            <v-splitter-pane size="40">
              <xr-ef-panel title="加料信息"
                padding="0px"
                style="height: 100%">
                <template #customButtonSlot> </template>
                <template #contentSlot>
                  <er-grid v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :toolbar-style="'both'"
                    :config-id="grid_view_2"
                    @erGridReady="erGrid2Ready">
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
          </v-splitter>
        </v-splitter-pane>

        <v-splitter-pane size="20">
          <xr-ef-panel title="成分信息"
            padding="0 0 0 0"
            style="height: 100%">
            <template #customButtonSlot> </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-style="'both'"
                :config-id="grid_view_3"
                @erGridReady="erGrid3Ready">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
      <xr-ef-dialog v-model:visible="dialogVisible"
        :title="dialogFormName"
        height="80%"
        width="80%"
        @click-close-icon="closeXrEfDialog"
        :default-footer="false">
        <MMSMKRPOP :openInDialog="true"
          :dialogFormName="dialogFormName"
          :parentInfo="parentInfo"
          @getChildInfo="getChildInfo"></MMSMKRPOP>
      </xr-ef-dialog>
    </xr-ef-form>
    <!-- xr-ef-dialog组件 -->
  </div>
</template>

<script lang="ts" src="./MMSMKRS2N.ts"></script>

<style lang="scss" scoped>
@import './MMSMKRS2N.scss';
</style>
