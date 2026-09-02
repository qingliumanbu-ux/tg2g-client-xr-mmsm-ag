<!--
 * 功能描述：鱼雷罐铁水成分查询
 * 界面代码：MMSM11AS2N
 * 创建人：李晓明
 * 创建时间：2024年3月8日16点38分
 * 修改人：
 * 修改时间：
-->
<template>
  <div style="height: 100%">
    <!-- 界面按钮事件 -->
    <xr-ef-form :f2-do="F2_DO" @ready="efFormReady">
    <er-layout
        v-if="initializeFlag===1"
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"
      ></er-layout>
      <div id="lineChart" style="width: 100%; height: 100%">
        <!-- 线性图 -->
        <div id="myChart" style="width: 90%; height: 90%"></div>
      </div>
    </xr-ef-form>
  </div>
</template>

<!-- 脚本引用 -->
<script lang="ts" src="./MMSM11QS2N.ts"></script>

<!-- 样式表引用 -->
<style lang="scss" scoped>
@import "./MMSM11QS2N.scss";
</style>
