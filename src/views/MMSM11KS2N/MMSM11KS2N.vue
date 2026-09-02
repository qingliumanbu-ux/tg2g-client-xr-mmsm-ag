<template>
  <div style="height: 100%">
    <xr-ef-form @ready="efFormReady" :f2-do="f2_DO" :f3-do="F3_DO" :f4-do="F4_DO" :f5-do="F5_DO" :f6-do="F6_DO">
      <er-layout style="height: 20%;"
      v-if="initializeFlag"
      :er-form-helper-prop="erFormHelper"
      :auto-bind="true"
      :config-id="'LayoutGroupFilter'"
    ></er-layout>
      <v-splitter style="height: 100%" class="default-theme">
        <v-splitter-pane size="50">
          <xr-ef-panel title="1#，3#铁水信息" style="height: 100%" padding="5px">
              <template #customButtonSlot> </template>
              <template #contentSlot>
                <er-grid
                  v-if="initializeFlag"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'gridView1'"
                  @erGridReady="erGrid1Ready"
                >
                </er-grid>
              </template>
            </xr-ef-panel>
        </v-splitter-pane>
        <v-splitter-pane size="50">
          <xr-ef-panel title="2#，4#铁水信息" style="height: 100%" padding="5px">
            <template #customButtonSlot> </template>
            <template #contentSlot>
              <er-grid
                 v-if="initializeFlag"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView2'"
                @erGridReady="erGrid2Ready"
              >
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>
      </v-splitter>
      <er-layout 
      v-if="initializeFlag"
      :er-form-helper-prop="erFormHelper"
      :config-id="'LayoutGroupFilterA'"
    ></er-layout>
      <er-layout 
        v-if="initializeFlag"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter1'"
         :auto-bind="true"
      ></er-layout>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"
  src="./MMSM11KS2N.ts">
</script>

<style lang="scss">
  @import './MMSM11KS2N.scss';
</style>
