<template>
  <div style="height: 100%">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="layout_group_filter"></er-layout>
      <xr-ef-panel title="炉次信息"
        style="display: flex; flex-direction: column"
        padding="5px">
        <template #customButtonSlot> </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :toolbar-style="'both'"
            :config-id="grid_view_1"
            @focus-changed="GridView1FocusChanged">
          </er-grid>
        </template>
      </xr-ef-panel>
      <xr-ef-panel title="明细信息"
        style="display: flex; flex-direction: column"
        padding="5px"
        v-if="isChildShow">
        <template #customButtonSlot> </template>
        <template #contentSlot>
          <a-tabs v-model:activeKey="tabActiveKey"
            type="card"
            @change="handleTabChange"
            style="height: 100%;">
            <!-- <ul>
              <li class="k-state-active"
                v-show="isOneShow"
                id="li1_id">
                <span class="k-loading k-complete"></span>
                <span unselectable="on"
                  class="k-link1">{{ oneTabName }}</span>
              </li>
              <li v-show="isTwoShow"
                id="li2_id">
                <span class="k-loading k-complete"></span>
                <span unselectable="on"
                  class="k-link2">{{ twoTabName }}</span>
              </li>
              <li v-show="isThreeShow"
                id="li3_id">
                <span class="k-loading k-complete"></span>
                <span unselectable="on"
                  class="k-link3">{{ threeTabName }}</span>
              </li>
              <li v-show="isFourShow"
                id="li4_id">
                <span class="k-loading k-complete"></span>
                <span unselectable="on"
                  class="k-link4">{{ fourTabName }}</span>
              </li>
            </ul> -->
            <a-tab-pane key="tab1"
              :tab="oneTabName"
              v-if="isOneShow">
              <er-grid v-if="initializeFlag === 1 && isOneShow"
                :er-form-helper-prop="erFormHelper"
                :config-id="grid_view_2"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'">
              </er-grid>
            </a-tab-pane>>
            <a-tab-pane key="tab2"
              :tab="twoTabName"
              v-if="isTwoShow">
              <er-grid v-if="initializeFlag === 1 && isTwoShow"
                :er-form-helper-prop="erFormHelper"
                :config-id="grid_view_3"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'">
              </er-grid>
            </a-tab-pane>
            <a-tab-pane key="tab3"
              :tab="threeTabName"
              v-if="isThreeShow">
              <er-grid v-if="initializeFlag === 1 && isThreeShow"
                :er-form-helper-prop="erFormHelper"
                :config-id="grid_view_4"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'">
              </er-grid>
            </a-tab-pane>
            <a-tab-pane key="tab4"
              :tab="fourTabName"
              v-if="isFourShow">
              <er-grid v-if="initializeFlag === 1 && isFourShow"
                :er-form-helper-prop="erFormHelper"
                :config-id="grid_view_5"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSMSJDCS2N.ts"></script>

<style lang="scss" scoped>
@import './MMSMSJDCS2N.scss';
</style>
