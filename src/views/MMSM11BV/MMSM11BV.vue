<!--
 * @Description: 铁水领料实绩查询
 * @Author: Simon Li
 * @Date: 2023-12-26 11:23:08
 * @LastEditors: Simon Li
 * @LastEditTime: 2023-12-26 11:23:08
-->
<template>
  <div style="height: 100%">
      <xr-ef-form @ready="efFormReady"
          :f2-do="F2_DO">
          <er-layout v-if="initializeFlag === 1"
              :er-form-helper-prop="erFormHelper"
              :config-id="'query1'">
          </er-layout>
          <div style="flex: 1; padding: 0 5px 0 5px">
              <v-splitter style="height: 100%"
                  class="default-theme"
                  :horizontal="true">
                  <v-splitter-pane>
                      <xr-ef-panel title="铁水领料实绩"
                          padding="5px" style="height: 100%;">
                          <template #contentSlot>
                          <er-grid v-if="initializeFlag === 1"
                              :er-form-helper-prop="erFormHelper"
                              :config-id="'gridView1'">
                          </er-grid>
                          </template>
                      </xr-ef-panel>
                  </v-splitter-pane>
              </v-splitter>
          </div>
      </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./MMSM11BV.ts">
</script>