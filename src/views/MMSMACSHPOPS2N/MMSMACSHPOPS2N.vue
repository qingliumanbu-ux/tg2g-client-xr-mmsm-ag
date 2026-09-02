<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady">
      <!--    <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'layoutControlGroup1'"
        style="overflow: auto;"
        @valueChanged="layout_valueChanged1"></er-layout> -->
      <xr-ef-panel title="收货确认录入区"
        padding="5px">
        <template #customButtonSlot>
        </template>
        <template #contentSlot>
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'gridView1'"
            @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSMACSHPOPS2N.ts">
</script>

<style lang="scss" scoped>
@import './MMSMACSHPOPS2N.scss';
</style>
