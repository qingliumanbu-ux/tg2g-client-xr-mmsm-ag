<template>
  <div style="height:100%;">
    <xr-ef-form :f2-do="F2_DO"
      :f6-do="F6_DO"
      :f7-do="F7_DO"
      :f9-do="F9_DO"
      :f9-pre-do="F9_PRE_DO"
      :f9-cancel="F9_CANCEL"
      @ready="efFormReady">
      <div style="display: flex;">
        <div style="display: flex; flex-direction: column; width: 85%;">
          <er-layout v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'layoutControlGroup1'"></er-layout>
        </div>
        <div style="display: flex; flex-direction: column; width: 15%;">
          <er-layout class="fenqieLayout"
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'layoutControlGroup2'"></er-layout>
        </div>
      </div>
      <xr-ef-panel title="详细信息"
        padding="5px">
        <template #customButtonSlot>
        </template>
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
              tab="分段实绩">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :config-id="'GridView2'"
                @erGridReady="erGrid2Ready">
              </er-grid>
            </a-tab-pane>
            <a-tab-pane key="tab3"
              tab="改切实绩">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :config-id="'GridView3'"
                @erGridReady="erGrid3Ready">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
    <xr-ef-dialog ref="xrEfDialogRef"
      :title="dialogFormName"
      height="80%"
      width="95%"
      @click-close-icon="xrEfDialogClose"
      v-model:visible="dialogVisible">
      <MMSM35POP :openInDialog="true"
        :dialogFormName="dialogFormName"
        :parentInfo="parentInfo"
        @getChildInfo="getChildInfo"></MMSM35POP>
    </xr-ef-dialog>
  </div>
</template>

<script lang="ts"
  src="./MMSM35S2N.ts">
</script>

<style lang="scss" scoped>
// @import url('./MMSM35V.scss');
.fenqieLayout {
  padding: 0;
  height: 100%;
  :deep(.efpanel-root) {
    height: 100% !important;
  }
}
</style>
