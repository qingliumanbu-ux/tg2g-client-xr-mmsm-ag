<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO"  :f3-do="F3_DO" :f4-do="F4_DO" :f5-do="F5_DO" :f6-do="F6_DO">
    <er-layout
      v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="`${layout}`"
    ></er-layout>
    <v-splitter horizontal style="height: 100%" class="default-theme">
      <v-splitter-pane size="50">
        <xr-ef-panel
          title="申请信息"
          padding="5px"
          style="height: 100%;"
        >
          <template #customButtonSlot> </template>
          <template #contentSlot>
            <er-grid
              v-if="initializeFlag === 1"
              :er-form-helper-prop="erFormHelper"
              :config-id="`${gridview}`"
              :toolbar-style="'both'"
              @focus-changed="GridView1FocusChanged"
            >
            </er-grid>
          </template>
        </xr-ef-panel>
      </v-splitter-pane>
      <v-splitter-pane size="50">
        <xr-ef-panel
          title="装车信息"
          padding="5px"
          style="height: 100%"
        >
          <template #customButtonSlot> </template>
          <template #contentSlot>
            <er-grid
              v-if="initializeFlag === 1"
              :er-form-helper-prop="erFormHelper"
              :config-id="`${gridview1}`"
              :toolbar-style="'both'"
            >
            </er-grid>
          </template>
        </xr-ef-panel>
      </v-splitter-pane>
    </v-splitter>
  </xr-ef-form>
  <xr-ef-dialog
      v-model:visible="dialogVisible"
      :title="dialogFormNametile"
      height="75%"
      width="80%"
      @click-close-icon="xrEfDialogClose"
      :default-footer="false"
    >
      <MMSM67CARPOPS2N
        :openInDialog="true"
        :dialogFormName="dialogFormName"
        :parentInfo="parentInfo"
        @getChildInfo="getChildInfo"
      ></MMSM67CARPOPS2N>
    </xr-ef-dialog>
</template>

<script lang="ts" src="./MMSM67CARS2N.ts"></script>

<style lang="scss">
@import "./MMSM67CARS2N.scss";
</style>
