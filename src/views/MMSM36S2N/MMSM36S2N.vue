<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"></er-layout>
      <xr-ef-panel title="标题"
        padding="5px">
        <template #customButtonSlot>

        </template>
        <template #contentSlot>
          <a-tabs v-model:activeKey="tabActiveKey"
            type="card"
            >
            <a-tab-pane key="tab1"
              tab="材料信息">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :page-options="{ pagination: 'server', pageSize: 100 }"
                :config-id="'GridView1'"
                @erGridReady="erGrid1Ready">
              </er-grid>
            </a-tab-pane>
            <a-tab-pane key="tab2"
              tab="实绩信息">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :page-options="{ pagination: 'server', pageSize: 100 }"
                :config-id="'GridView2'"
                @erGridReady="erGrid2Ready">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
    <xr-ef-dialog ref="xrEfDialogRef"
      title="详细信息"
      height="80%"
      width="80%"
      @click-close-icon="xrEfDialogClose"
      v-model:visible="dialogVisible">
      <MMSM36POP :openInDialog="true"
        :dialogFormName="dialogFormName"
        :parentInfo="parentInfo"
        @getChildInfo="getChildInfo"></MMSM36POP>
    </xr-ef-dialog>
  </div>
</template>

<script lang="ts"
  src="./MMSM36S2N.ts">
</script>

<style lang="scss" scoped>
@import './MMSM36S2N.scss';
</style>
