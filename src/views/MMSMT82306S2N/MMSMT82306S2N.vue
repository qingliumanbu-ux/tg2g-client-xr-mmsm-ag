<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
    >
      <er-layout
        v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"
      ></er-layout>
      <!-- 左右结构 -->
      <v-splitter
        style="height: 100%"
        class="default-theme"
      >
        <v-splitter-pane>
          <xr-ef-panel
            title="数据区"
            padding="5px"
            style="height: 100%; weight: 30%"
          >
            <template #customButtonSlot> </template>
            <template #contentSlot>
              <er-grid
                v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :config-id="'GridView1'"
                :toolbar-style="'both'"
                @focus-changed="gridView1FocusChanged"
                @erGridReady="erGrid1Ready"
              >
              </er-grid>
            </template>
          </xr-ef-panel>
        </v-splitter-pane>

        <v-splitter-pane>
          <div style="display: flex; flex-direction: column; height: 50%">
            <xr-ef-panel
              title="二钢投料数据"
              padding="5px"
            >
              <template #customButtonSlot> </template>
              <template #contentSlot>
                <!-- :toolbar-options="gridToolbar1" -->
                <er-grid
                  v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView2'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid2Ready"
                >
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>

          <div style="display: flex; flex-direction: column; height: 50%">
            <xr-ef-panel
              title="智慧质量历史数据"
              padding="5px"
            >
              <template #customButtonSlot> </template>
              <template #contentSlot>
                <!-- :toolbar-options="gridToolbar1" -->
                <er-grid
                  v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView3'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid3Ready"
                >
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSMT82306S2N.ts"></script>
