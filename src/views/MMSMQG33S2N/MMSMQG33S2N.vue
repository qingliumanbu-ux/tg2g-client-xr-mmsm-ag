<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      :f5-pre-do="F5_PRE_DO"
      :f5-cancel="F5_CANCEL"
      :f6-do="F6_DO"
      :f7-do="F7_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <v-splitter horizontal
        style="height: 100%"
        class="default-theme">
        <v-splitter-pane size="40">
          <xr-ef-panel title="炉次信息"
            padding="5px"
            style="height:100%;">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :config-id="'GridView1'"
                :toolbar-style="'both'"
                @erGridReady="erGrid1Ready"
                @focus-changed="GridView1FocusChanged">
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="60">
          <xr-ef-panel title="铸坯信息"
            padding="5px"
            style="height:100%;">
            <template #customButtonSlot>
            </template>
            <template #contentSlot>
              <a-tabs v-model:activeKey="tabActiveKey"
                type="card"
                @change="handleTabChange">
                <a-tab-pane key="tab1"
                  tab="计划信息">
                  <er-grid v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'GridView2'"
                    @erGridReady="erGrid2Ready">
                  </er-grid>
                </a-tab-pane>
                <a-tab-pane key="tab2"
                  tab="实绩信息">
                  <er-grid v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'GridView3'"
                    @erGridReady="erGrid3Ready">
                  </er-grid>
                </a-tab-pane>
              </a-tabs>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSMQG33S2N.ts">
</script>

<style lang="scss" scoped>
@import './MMSMQG33S2N.scss';
</style>
