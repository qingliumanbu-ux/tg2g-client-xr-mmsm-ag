<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO">
      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter style="height: 100%" class="default-theme" :horizontal="true">
        <v-splitter-pane size="50%">
          <xr-ef-panel title="基本信息" padding="0px" style="height: 100%">
            <template #customButtonSlot></template>
            <template #contentSlot>
              <div style="height: 100%" class="xr-er-grid-1">
                <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView1'"
                  @erGridReady="erGrid1Ready" @focus-changed="GridView1FocusChanged" :toolbar-style="'both'">
                </er-grid>
              </div>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="50%">
          <xr-ef-panel title="详细信息" padding="0px" style="height: 100%;">
            <template #customButtonSlot></template>
            <template #contentSlot>
              <v-splitter class="default-theme" style="height: 100%;">
                <v-splitter-pane size="70%">
                  <a-tabs v-model:activeKey="tab1ActiveKey" style="height: 100%;" type="card">
                    <a-tab-pane key="tab1" tab="主信息" style="overflow: auto;">
                      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupMatNo'" :auto-bind="true" :show-group-border="false"></er-layout>
                    </a-tab-pane>
                    <a-tab-pane key="tab2" tab="合同计划信息" style="overflow: auto;">
                      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupPlanNo'" :auto-bind="true" :show-group-border="false"></er-layout>
                    </a-tab-pane>
                    <a-tab-pane key="tab3" tab="质量信息" style="overflow: auto;">
                      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupQualityNo'" :auto-bind="true" :show-group-border="false"></er-layout>
                    </a-tab-pane>
                    <a-tab-pane key="tab4" tab="库位信息" style="overflow: auto;">
                      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupWarehouseNo'" :auto-bind="true" :show-group-border="false"></er-layout>
                    </a-tab-pane>
                    <a-tab-pane key="tab5" tab="化学成分" style="overflow: auto;">
                      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupChemicalNo'" :auto-bind="true" :show-group-border="false"></er-layout>
                    </a-tab-pane>
                    <a-tab-pane key="tab6" tab="其他信息" style="overflow: auto;">
                      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupOtherNo'" :auto-bind="true" :show-group-border="false"></er-layout>
                    </a-tab-pane>
                    <a-tab-pane key="tab7" tab="事件信息" style="overflow: auto;">
                      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
                        :config-id="'LayoutGroupEventNo'" :auto-bind="true" :show-group-border="false"></er-layout>
                    </a-tab-pane>
                  </a-tabs>
                </v-splitter-pane>
                <v-splitter-pane size="30%">
                  <xr-ef-panel title="标题" padding="0px" style="height: 100%">
                    <template #customButtonSlot></template>
                    <template #contentSlot>
                      <er-grid v-if="initializeFlag === 1" style="height: 100%" :er-form-helper-prop="erFormHelper"
                        :config-id="'gridView3'" @erGridReady="erGrid3Ready">
                      </er-grid>
                    </template>
                  </xr-ef-panel>
                </v-splitter-pane>
              </v-splitter>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSM96S2N.ts">
</script>

<style lang="scss">
@import './MMSM96S2N.scss';
</style>
