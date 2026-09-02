<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO" :f3-do="F3_DO" :f4-do="F4_DO" :f5-do="F5_DO" :f6-do="F6_DO"
    :f6-pre-do="F6_PRE_DO" :f6-cancel="F6_CANCEL" :f7-do="F7_DO" :f7-pre-do="F7_PRE_DO" :f7-cancel="F7_CANCEL">
    <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'LayoutGroupFilter'"
      :show-query-button="true" @query-click="LayoutGroupFilterQueryClick">
      <!-- :show-form-toolbar="true" -->
    </er-layout>
    <xr-ef-panel title="交料信息" padding="5px" style="height: 100%;">
      <template #customButtonSlot>

      </template>
      <template #contentSlot>

        <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'GridView1'"
          :toolbar-style="'both'" @erGridReady="erGrid1Ready">
        </er-grid>
      </template>
    </xr-ef-panel>
  </xr-ef-form>
</template>

<script lang="ts"
  src="./MMSM67S2N.ts">
</script>
