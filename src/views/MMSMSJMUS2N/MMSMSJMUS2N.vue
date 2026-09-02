<!--
 * @Description:
 * @Author: Edward
 * @Date: 2022-04-28 11:04:08
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 14:43:52
-->
<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      :f6-do="F6_DO"
      :f6-pre-do="F6_PRE_DO"
      :f6-cancel="F6_CANCEL"
      :f7-do="F7_DO"
      :f7-pre-do="F7_PRE_DO"
      :f7-cancel="F7_CANCEL"
      :f8-do="F8_DO"
      :f8-pre-do="F8_PRE_DO"
      :f8-cancel="F8_CANCEL"
      :f12-do="F12_DO"
    >
      <er-layout
        v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="layout_group_filter"
      ></er-layout>
      <v-splitter
        :vertical="true"
        style="height: 100%"
        class="default-theme"
      >
        <v-splitter-pane size="60">
          <v-splitter
            horizontal
            style="height: 100%"
            class="default-theme"
          >
            <v-splitter-pane size="40">
              <xr-ef-panel
                title="炉次信息"
                padding="5px"
                style="height: 100%"
              >
                <template #contentSlot>
                  <er-grid
                    v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'GridView1'"
                    :toolbar-style="'both'"
                    :toolbar-options="gridToolbar"
                    @focus-changed="gridView1FocusChanged"
                    @row-double-clicked="GridView1DoubleClick"
                    @erGridReady="erGrid1Ready"
                  >
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
            <v-splitter-pane size="60">
              <!--   <xr-ef-panel title=""
                padding="0px"
                style="height: 100%"> -->
              <!--  <template #customButtonSlot> </template> -->
              <!--  <template #contentSlot> -->
              <a-tabs
                v-model:activeKey="tab1ActiveKey"
                type="card"
                v-if="!isJialiaoTabShow"
                @change="handleTabChange"
                style="height: 100%"
              >
                <a-tab-pane
                  key="tab1"
                  tab="测温信息"
                >
                  <er-grid
                    v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="grid_view_3"
                    :toolbar-options="gridToolbar"
                    :toolbar-style="'both'"
                    @erGridReady="erGrid3Ready"
                  >
                  </er-grid>
                </a-tab-pane>
              </a-tabs>
              <a-tabs
                v-model:activeKey="tab2ActiveKey"
                type="card"
                v-else
                @change="handleTabChange"
              >
                <a-tab-pane
                  key="tab1"
                  v-if="isJialiaoTabShow"
                  tab="加料信息"
                >
                  <er-grid
                    v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="grid_view_2"
                    :toolbar-options="gridToolbar"
                    :toolbar-style="'both'"
                    @erGridReady="erGrid2Ready"
                    :options="{
                      groupDisplayType: 'groupRows',
                      showRowNo: false,
                    }"
                  >
                  </er-grid>
                </a-tab-pane>
                <a-tab-pane
                  key="
                    tab2"
                  tab="测温信息"
                >
                  <er-grid
                    v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="grid_view_3"
                    :toolbar-options="gridToolbar"
                    :toolbar-style="'both'"
                    @erGridReady="erGrid3Ready"
                  >
                  </er-grid
                ></a-tab-pane>
                <a-tab-pane
                  key="tab3"
                  :tab="thirdTabName"
                  v-if="isThirdTabShow"
                >
                  <er-grid
                    v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="grid_view_4"
                    :toolbar-options="gridToolbar"
                    @erGridReady="erGrid4Ready"
                    :toolbar-style="'both'"
                    :options="{ showRowNo: false }"
                  >
                  </er-grid>
                </a-tab-pane>
              </a-tabs>
              <!--  </template> -->
              <!--  </xr-ef-panel> -->
            </v-splitter-pane>
          </v-splitter>
        </v-splitter-pane>
        <v-splitter-pane size="40">
          <xr-ef-panel
            title="成分信息"
            style="height: 100%"
            padding="0 0 0 0"
          >
            <template #contentSlot>
              <er-grid
                v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :config-id="grid_view_5"
                @erGridReady="erGrid5Ready"
                :options="{ groupDisplayType: 'groupRows', showRowNo: false }"
              >
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
    <!-- xr-ef-dialog组件 -->
    <xr-ef-dialog
      v-model:visible="dialogVisible"
      :title="dialogFormName"
      height="80%"
      width="80%"
      @click-close-icon="xrEfDialogClose"
      :default-footer="false"
    >
      <MMSMPOPV
        :openInDialog="true"
        :dialogFormName="dialogFormName"
        :parentInfo="parentInfo"
        @getChildInfo="getChildInfo"
      ></MMSMPOPV>
    </xr-ef-dialog>
  </div>
</template>

<script lang="ts" src="./MMSMSJMUS2N.ts"></script>

<style lang="scss" scoped>
@import "./MMSMSJMUS2N.scss";
</style>
