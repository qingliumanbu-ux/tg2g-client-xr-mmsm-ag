<template>
  <div style="height: 100%;">
    <xr-ef-form :f2-do="F2_DO"
      @ready="efFormReady">
      <er-layout v-if="initializeFlag === 1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"></er-layout>
      <a-tabs v-model:activeKey="tabActiveKey"
        type="card"
        @change="handleTabChange"
        style="height: 100%;">
        <!--  <ul>
          <li :id="'tab1'"
            :name="'tab1'"
            class="k-state-active"></li>
          <li :id="'tab2'"
            :name="'tab2'">RH</li>
          <li :id="'tab3'"
            :name="'tab3'">LF</li>
          <li :id="'tab4'"
            :name="'tab4'">连铸</li>
        </ul> -->
        <a-tab-pane key="tab1"
          tab="电炉">
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView1'"
            :toolbar-style="'both'"
            @erGridReady="erGrid1Ready">
          </er-grid>
        </a-tab-pane>>
        <a-tab-pane key="tab2"
          tab="RH">
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView2'"
            :toolbar-style="'both'"
            @erGridReady="erGrid2Ready">
          </er-grid>
        </a-tab-pane>>
        <a-tab-pane key="tab3"
          tab="LF">
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView3'"
            :toolbar-style="'both'"
            @erGridReady="erGrid3Ready">
          </er-grid>
        </a-tab-pane>>
        <a-tab-pane key="tab4"
          tab="连铸">
          <er-grid v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'GridView4'"
            :toolbar-style="'both'"
            @erGridReady="erGrid4Ready">
          </er-grid>
        </a-tab-pane>>
      </a-tabs>
    </xr-ef-form>
  </div>
</template>

<script lang="ts"

  src="./MMSMSJZHS2N.ts">
</script>

<style lang="scss">
@import './MMSMSJZHS2N.scss';
</style>
