<!--
 * 功能描述：铁水分配信息管理
 * 界面代码：MMSM11S2N
 * 创建人：李晓明
 * 创建时间：2024年2月19日10点42分
 * 修改人：
 * 修改时间：
-->
<template>
    <div style="height: 100%;">
        <!-- 界面按钮事件 -->
        <xr-ef-form :f2-do="F2_DO"
                    :f3-do="F3_DO"
                    :f4-do="F4_DO"
                    :f5-do="F5_DO"
                    :f6-do="F6_DO"
                    :f7-do="F7_DO"
                    :f8-do="F8_DO"
                    :f9-do="F9_DO"
                    @ready="efFormReady">

            <!-- 查询区 -->
            <er-layout v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'query1'"></er-layout>

            <!-- 数据展示区 -->
            <xr-ef-panel title="分配信息" padding="5px">
                <template #customButtonSlot>
                </template>
                <template #contentSlot>
                    <er-grid v-if="initializeFlag === 1"
                        :er-form-helper-prop="erFormHelper"
                        :config-id="'gridView1'">
                    </er-grid>
                </template>
            </xr-ef-panel>
        </xr-ef-form>
    </div>
</template>

<!-- 脚本引用 -->
<script lang="ts"
  src="./MMSM11S2N.ts">
</script>

<!-- 样式表引用 -->
<style lang="scss" scoped>
@import './MMSM11S2N.scss';
</style>