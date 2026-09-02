<template>
  <div style="height: 100%">
    <xr-ef-form @ready="efFormReady"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog">
      <div style="display: flex; flex-direction: column; height: 100%">
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :allow-collapse="true"
          :config-id="'layoutControlGroup1'"
          @loaded="layout1Loaded"></er-layout>
        <er-layout v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :allow-collapse="true"
          :config-id="'layoutControlGroup2'"
          @loaded="layout2Loaded"></er-layout>
      </div>
      <!--  <div style="display: flex; flex-direction: column;">
          <xr-ef-panel title="其他信息"
            padding="5px">
            <template #customButtonSlot>

            </template>
            <template #contentSlot>
              <kendo-tabstrip style="height: 100%;">
                <ul>
                  <li class="k-state-active">加料信息</li>
                  <li>成分信息</li>
                </ul>
                <div>
                  <xr-er-grid v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'gridView_auxi'"
                    :toolbar-style="'both'"
                    :toolbar-options="gridToolbar1"
                    @toolbarClick="toolbarClick($event, 'gridView_auxi')">
                  </xr-er-grid>
                </div>
                <div>
                  <xr-er-grid v-if="initializeFlag === 1"
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'gridView_cf'"
                    :toolbar-style="'both'"
                    :toolbar-options="gridToolbar1"
                    @toolbarClick="toolbarClick($event, 'gridView_cf')">
                  </xr-er-grid>
                </div>
              </kendo-tabstrip>
            </template>
          </xr-ef-panel>
        </div> -->
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSMKRPOP.ts"></script>

<style lang="scss" scoped>
@import './MMSMKRPOP.scss';
</style>
