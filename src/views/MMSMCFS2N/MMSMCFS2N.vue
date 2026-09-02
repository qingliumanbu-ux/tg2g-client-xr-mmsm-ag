<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
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
            style="height: 100%"
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
          <div style="display: flex; height: 25%">
            <xr-ef-panel
              title="预熔炼号重复数据区"
              padding="5px"
            >
              <template #customButtonSlot> </template>
              <template #contentSlot>
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
            <xr-ef-panel
              title="跳号数据区"
              padding="5px"
            >
              <template #customButtonSlot> </template>
              <template #contentSlot>
                <er-grid
                  v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView6'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid6Ready"
                >
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>
          <div style="display: flex; flex-direction: column; height: 25%">
            <xr-ef-panel
              title="工艺路线"
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
                  @focus-changed="gridView3FocusChanged"
                  @erGridReady="erGrid3Ready"
                >
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>

          <div style="display: flex; flex-direction: column; height: 25%">
            <xr-ef-panel
              title="消耗详细信息"
              padding="5px"
            >
              <template #customButtonSlot> </template>
              <template #contentSlot>
                <!-- :toolbar-options="gridToolbar1" -->
                <er-grid
                  v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView4'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid4Ready"
                >
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>
          <div style="display: flex; flex-direction: column; height: 25%">
            <xr-ef-panel
              title="消耗汇总"
              padding="5px"
            >
              <template #customButtonSlot> </template>
              <template #contentSlot>
                <!-- :toolbar-options="gridToolbar1" -->
                <er-grid
                  v-if="initializeFlag === 1"
                  :er-form-helper-prop="erFormHelper"
                  :config-id="'GridView5'"
                  :toolbar-style="'both'"
                  @erGridReady="erGrid5Ready"
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

<script lang="ts" src="./MMSMCFS2N.ts"></script>
