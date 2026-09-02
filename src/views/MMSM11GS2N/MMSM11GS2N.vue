<!--
 * 功能描述：跟踪条目维护
 * 界面代码：MMSM11GS2N
 * 创建人：李晓明
 * 创建时间：2024年3月18日10点35分
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
                    @ready="efFormReady">

            <!-- 查询区 -->
            <er-layout v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'query1'"></er-layout>

            <!-- 数据展示区 -->
            <xr-ef-panel title="条目信息" padding="5px">
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
  src="./MMSM11GS2N.ts">
</script>

<!-- 样式表引用 -->
<style lang="scss" scoped>
@import './MMSM11GS2N.scss';
</style>