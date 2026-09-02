<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady"
      :f2-do="F2_DO">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="数据区"
        padding="5px">
        <template #customButtonSlot>
        </template>
        <template #contentSlot>
          <a-tabs v-model:activeKey="tabActiveKey"
            type="card"
            @change="handleTabChange">
            <a-tab-pane key="tab1"
              tab="数据信息">
              <er-grid v-if="initializeFlag === 1"
                
                :er-form-helper-prop="erFormHelper"
                :config-id="gridView_tab1"
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
<script lang="ts" src="./MMSMCPBBS2N.ts">
</script>
