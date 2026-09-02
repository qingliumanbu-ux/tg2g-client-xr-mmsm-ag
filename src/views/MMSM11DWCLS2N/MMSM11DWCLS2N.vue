<template>
  <div style="height: 100%">
    <!-- 界面按钮事件 -->
    <xr-ef-form :f2-do="F2_DO" @ready="efFormReady">
      <div style="height: 45%; width: 100%">
        <div
          class="card-header"
          style="background: #dbefff !important; padding: 5px; border: 1px solid"
        >
          <div class="header-title" style="color: rgb(47, 128, 237); margin-left: 5px">
            此处输入的电文为高炉出铁信息！！！！！
          </div>
        </div>
        <input style="width: 100%; height: 80%" type="string" v-model="B02101" />
        <div style="height: 2%; width: 100%"></div>
        <div
          style="
            border-top: 1px solid rgb(230, 234, 245);
            border-bottom: 1px solid rgb(11 69 163);
            border-right: 1px solid rgb(11 69 163);
            border-left: 1px solid rgb(230, 234, 245);
            overflow: hidden;
            text-align: center;
            background: #dbefff !important;
            height: 20%;
            width: 10%;
          "
          @click="butClick"
        >
          <div style="height: 40%; width: 100%"></div>
          高炉来铁信息模拟接收
        </div>
      </div>
      <div style="height: 10%; width: 100%"></div>
      <div style="height: 40%; width: 100%">
        <div
          class="card-header"
          style="background: #dbefff !important; padding: 5px; border: 1px solid"
        >
          <div class="header-title" style="color: rgb(47, 128, 237); margin-left: 5px">
            此处输入的电文为铁水分配信息！！！！！
          </div>
        </div>
        <input style="width: 100%; height: 80%" type="string" v-model="B02102" />
        <div style="height: 2%; width: 100%"></div>
        <div
          style="
            border-top: 1px solid rgb(230, 234, 245);
            border-bottom: 1px solid rgb(11 69 163);
            border-right: 1px solid rgb(11 69 163);
            border-left: 1px solid rgb(230, 234, 245);
            overflow: hidden;
            text-align: center;
            background: #dbefff !important;
            height: 20%;
            width: 10%;
          "
          @click="butClick1"
        >
          <div style="height: 40%; width: 100%"></div>
         铁水分配信息模拟接收
        </div>
      </div>
    </xr-ef-form>
  </div>
</template>

<!-- 脚本引用 -->
<script lang="ts" src="./MMSM11DWCLS2N.ts"></script>

<!-- 样式表引用 -->
<style lang="scss" scoped>
@import "./MMSM11DWCLS2N.scss";
</style>
