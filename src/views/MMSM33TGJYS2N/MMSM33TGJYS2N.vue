<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
    >
      <er-layout
        v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"
      ></er-layout>
      <xr-ef-panel
        title="详细信息"
        padding="5px"
      >
        <template #customButtonSlot></template>
        <template #contentSlot>
          <a-tabs v-model:activeKey="tabActiveKey"
            type="card"
            @change="handleTabChange">
            <a-tab-pane key="tab1"
              tab="铸坯信息">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :config-id="'GridView1'"
                @erGridReady="erGrid1Ready">
              </er-grid>
            </a-tab-pane>
            <a-tab-pane key="tab2"
              tab="碳钢检验">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :config-id="'GridView2'"
                @erGridReady="erGrid2Ready">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
    <xr-ef-dialog
      v-model:visible="dialogVisible"
      :title="dialogFormName"
      height="80%"
      width="80%"
      @click-close-icon="closeXrEfDialog"
      :default-footer="false"
    >
      <MMSM33TGJYPOP
        v-if="initializeFlag === 1 && dialogVisible"
        :openInDialog="true"
        :dialogFormName="dialogFormName"
        :parentInfo="parentInfo"
        @getChildInfo="getChildInfo"
      ></MMSM33TGJYPOP> 
    </xr-ef-dialog>
  </div>
</template>

<script lang="ts" src="./MMSM33TGJYS2N.ts"></script>

<style lang="scss" scoped>
@import "./MMSM33TGJYS2N.scss";
</style>
