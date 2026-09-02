<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO" :f3-do="F3_DO" :f4-do="F4_DO" :f5-do="F5_DO" :f6-do="F6_DO" :f7-do="F7_DO" :f8-do="F8_DO"
      :f9-do="F9_DO" :f10-do="F10_DO" :f11-do="F11_DO" :f12-do="F12_DO" @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter horizontal style="height: 100%" class="default-theme">
        <v-splitter-pane size="60">
          <xr-ef-panel title="材料信息(重量偏差-绿色  封锁-红色  修磨-橘红色  在途-紫色  未收货-黄色  收货-蓝色  未出库-浅蓝色)" style="height: 100%">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'GridView1'"
                @focus-changed="GridView1FocusChanged" :toolbar-style="'both'" @erGridReady="erGrid1Ready">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="40">
          <a-tabs v-model:activeKey="tab1ActiveKey" type="card" @change="handleTabChange">
            <a-tab-pane key="tab1" tab="主信息" style="overflow: auto;" :forceRender="true">
              <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroup1'"
                :show-group-border="false"></er-layout>
            </a-tab-pane>
            <a-tab-pane key="tab2" tab="合同计划信息" style="overflow: auto;" :forceRender="true">
              <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroup2'"
                :show-group-border="false"></er-layout>
            </a-tab-pane>
            <a-tab-pane key="tab3" tab="质量信息" style="overflow: auto;" :forceRender="true">
              <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroup3'"
                :show-group-border="false"></er-layout>
            </a-tab-pane>
            <a-tab-pane key="tab4" tab="库位信息" style="overflow: auto;" :forceRender="true">
              <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroup4'"
                :show-group-border="false"></er-layout>
            </a-tab-pane>
            <a-tab-pane key="tab5" tab="化学成分" style="overflow: auto;" :forceRender="true">
              <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroup5'"
                :show-group-border="false"></er-layout>
            </a-tab-pane>
            <a-tab-pane key="tab6" tab="其他信息" style="overflow: auto;" :forceRender="true">
              <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroup6'"
                :show-group-border="false"></er-layout>
            </a-tab-pane>
          </a-tabs>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSM01A1S2N.ts">
</script>

<style lang="scss">
@import './MMSM01A1S2N.scss';
</style>
