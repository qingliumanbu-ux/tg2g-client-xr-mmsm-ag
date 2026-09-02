<!--
 * 功能描述：鱼雷罐重量履历查询
 * 界面代码：MMSM11FS2N
 * 创建人：李晓明
 * 创建时间：2024年3月4日16点29分
 * 修改人：
 * 修改时间：
-->
<template>
    <div style="height: 100%;">
        <!-- 界面按钮事件 -->
        <xr-ef-form :f2-do="F2_DO" @ready="efFormReady">

            <!-- 查询区 -->
            <er-layout v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :config-id="'query1'"></er-layout>

            <!-- 数据展示区 -->
            <xr-ef-panel title="重量履历" padding="5px">
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
  src="./MMSM11FS2N.ts">
</script>

<!-- 样式表引用 -->
<style lang="scss" scoped>
@import './MMSM11FS2N.scss';
</style>