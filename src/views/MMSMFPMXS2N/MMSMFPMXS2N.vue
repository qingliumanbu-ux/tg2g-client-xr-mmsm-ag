<template>
    <div style="height: 100%;">
      <xr-ef-form @ready="efFormReady"
        :f2-do="F2_DO"
        :f3-do="F3_DO"
        :f4-do="F4_DO"
        :f5-do="F5_DO"
        :f6-do="F6_DO"
        :f7-do="F7_DO"
        :f8-do="F8_DO"
        :f9-do="F9_DO">
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"
          
          ></er-layout>
        <xr-ef-panel title="数据区"
          padding="5px">
          <template #customButtonSlot>
          </template>
          <template #contentSlot>
            <a-tabs v-model:activeKey="tabActiveKey"
              type="card"
              @change="handleTabChange">
              <a-tab-pane key="tab3"
                tab="铸坯信息">
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView3'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid3Ready">
                </er-grid>
              </a-tab-pane>
              <a-tab-pane key="tab4"
                tab="碳钢改切">
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView4'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid1Ready">
                </er-grid>
              </a-tab-pane>
              <a-tab-pane key="tab5"
                tab="不锈钢改切">
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView5'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid1Ready">
                </er-grid>
              </a-tab-pane>
              <a-tab-pane key="tab1"
                tab="碳钢废品明细">
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView1'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid1Ready">
                </er-grid>
              </a-tab-pane>
              <a-tab-pane key="tab2"
                tab="不锈钢废品明细">
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView2'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid2Ready">
                </er-grid>
              </a-tab-pane>
              <a-tab-pane key="tab6"
                tab="利用增值品">
                <er-grid v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView6'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid1Ready">
                </er-grid>
              </a-tab-pane>
            </a-tabs>
          </template>
        </xr-ef-panel>
      </xr-ef-form>
    </div>
  </template>
  <script lang="ts" src="./MMSMFPMXS2N.ts">
  </script>
  