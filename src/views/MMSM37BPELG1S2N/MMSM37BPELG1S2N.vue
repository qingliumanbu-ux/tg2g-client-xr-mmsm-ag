<template>
  <div style="height: 100%;">
    <xr-ef-form 
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      :f6-do="F6_DO"
      :f7-do="F7_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="详情信息"
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
                :page-options="{ pagination: 'server', pageSize: 100 }"
                @erGridReady="erGrid1Ready"
                :config-id="'GridView1'">
              </er-grid>
            </a-tab-pane>>
            <a-tab-pane key="tab2"
              tab="修磨实绩">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :page-options="{ pagination: 'server', pageSize: 100 }"
                @erGridReady="erGrid2Ready"
                :config-id="'GridView2'">
              </er-grid>
            </a-tab-pane>
            <a-tab-pane key="tab3"
              tab="修磨电子记录">
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :toolbar-options="gridToolbar"
                :toolbar-style="'both'"
                :page-options="{ pagination: 'server', pageSize: 100 }"
                @erGridReady="erGrid3Ready"
                :config-id="'GridView3'">
              </er-grid>
            </a-tab-pane>
          </a-tabs>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
    <!-- xr-ef-dialog组件 -->
    <xr-ef-dialog ref="xrEfDialogRef"
      title="详细信息"
      height="80%"
      width="80%"
      @click-close-icon="xrEfDialogClose"
      v-model:visible="dialogVisible">
      <MMSM37LG1POP :openInDialog="true"
        :dialogFormName="dialogFormName"
        :parentInfo="parentInfo"
        @getChildInfo="getChildInfo">
      </MMSM37LG1POP>
    </xr-ef-dialog>
  </div>
</template>

<script lang="ts"
  src="./MMSM37BPELG1S2N.ts">
</script>

<style lang="scss" scoped>
@import './MMSM37BPELG1S2N.scss';
</style>
