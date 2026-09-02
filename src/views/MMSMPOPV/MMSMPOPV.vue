<!--
 * @Description:
 * @Author: Edward
 * @Date: 2022-04-28 11:04:08
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 14:43:52
-->
<template>
  <div style="height: 100%">
    <xr-ef-form :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady">
      <!-- <v-splitter
        horizontal
        style="height: 100%"
        class="default-theme"
      > -->
      <div style="display: flex; flex-direction: column; height: 100%;overflow: auto;">
        <!-- <v-splitter-pane
          size="40"
          style="overflow: auto"
        > -->
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'layoutControlGroup1'"
          :allow-collapse="true"
          @loaded="layout1Loaded"></er-layout>
        <!-- </v-splitter-pane> -->
        <!-- <v-splitter-pane
          size="60"
          style="overflow: auto"
        > -->
        <er-layout v-if="initializeFlag === 1 && isLayout2Show"
          :er-form-helper-prop="erFormHelper"
          :config-id="'layoutControlGroup2'"
          :allow-collapse="true"
          @loaded="layout2Loaded"></er-layout>
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'layoutControlGroup4'"
          :allow-collapse="true"
          @loaded="layout4Loaded"></er-layout>
        <!-- </v-splitter-pane> -->
        <!--   <xr-ef-panel v-if="isGridViewCfShow"
            :title="gridView_cf_caption"
            padding="5px"
            :open-header-show="false"
            style="flex: null; height: 300px;">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <xr-er-grid v-if="initializeFlag === 1 && isGridViewCfShow"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView_cf'"
                :toolbar-style="'both'"
                :toolbar-options="gridToolbar1">
              </xr-er-grid>
            </template>
          </xr-ef-panel> -->
      </div>
      <!--  <div style="display: flex; flex-direction: column;">
          <xr-ef-panel v-if="isGridViewAuxiShow"
            title="投料信息"
            padding="5px"
            style="flex: 2">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <xr-er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView_auxi'"
                :toolbar-style="'both'"
                :toolbar-options="gridToolbar2"
                @toolbarClick="toolbarClick($event, 'gridView_auxi')">
              </xr-er-grid>
            </template>
          </xr-ef-panel>
          <xr-ef-panel title="其他信息"
            padding="5px"
            style="flex: 3">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <kendo-tabstrip style="height: 100%;">
                <ul>
                  <li class="k-state-active">测温信息</li>
                </ul>
                <div>
                  <xr-er-grid v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'gridView_temp'"
                    :toolbar-style="'both'"
                    :toolbar-options="gridToolbar2"
                    @toolbarClick="toolbarClick($event, 'gridView_temp')">
                  </xr-er-grid>
                </div>
              </kendo-tabstrip>
            </template>
          </xr-ef-panel>
        </div> -->
      <!-- </v-splitter> -->
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSMPOPV.ts"></script>

<style lang="scss" scoped>
@import './MMSMPOPV.scss';
</style>
