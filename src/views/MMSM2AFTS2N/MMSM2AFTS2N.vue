<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"></er-layout>
      <v-splitter horizontal
        style="height: 100%"
        class="default-theme">
        <v-splitter-pane size="84">
          <div style="display: flex; flex-direction: column;height: 100%">
            <xr-ef-panel title="标题"
              padding="5px">
              <template #customButtonSlot>

              </template>
              <template #contentSlot>
                <a-tabs v-model:activeKey="tab1ActiveKey"
                  type="card"
                  @change="handleTabChange">
                  <a-tab-pane key="tab_1"
                    tab="铸坯信息">
                    <div style="height: 100%">
                      <er-grid v-if="initializeFlag === 1"
                        :er-form-helper-prop="erFormHelper"
                        :config-id="'GridView1'"
                        :toolbar-options="gridToolbar"
                        :toolbar-style="'both'"
                        @erGridReady="erGrid1Ready"
                        @focus-changed="GridView1FocusChanged"
                        @double-click="GridView1DoubleClick">
                      </er-grid>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="tab_2"
                    tab="履历信息">
                    <div style="height: 100%">
                      <er-grid v-if="initializeFlag === 1"
                        :er-form-helper-prop="erFormHelper"
                        :config-id="'GridView2'"
                        @erGridReady="erGrid2Ready"
                        :toolbar-options="gridToolbar"
                        :toolbar-style="'both'">
                      </er-grid>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </template>
            </xr-ef-panel>
          </div>
        </v-splitter-pane>
        <v-splitter-pane>
          <div style="display: flex; flex-direction: column;">
            <er-layout v-if="initializeFlag === 1"
              :er-form-helper-prop="erFormHelper"
              :config-id="'layoutControlGroup2'"></er-layout>
          </div>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM2AFTS2N.ts">
</script>

<style lang="scss"
  scoped>
@import './MMSM2AFTS2N.scss';
</style>
