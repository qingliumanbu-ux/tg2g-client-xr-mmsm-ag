<template>
  <div style="height: 100%;">
    <xr-ef-form @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <xr-ef-panel title="标题"
        padding="5px">
        <template #customButtonSlot>
        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView1'"
            :toolbar-style="'both'"
            @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>
      <!--   <kendo-treeview style="height: 100%;"
            :data-source="treeData"
            @select="onSelect"
            @expand="onExpand"
            ref="treeViewRef" /> -->
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSMSJCSS2N.ts">
</script>

<style lang="scss"
  scoped>
@import './MMSMSJCSS2N.scss';
</style>
