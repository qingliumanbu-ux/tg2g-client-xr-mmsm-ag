/*
 * @Description:
 * @Author: Edward
 * @Date: 2022-06-02 17:21:37
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 15:13:06
 */
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  computed,
  nextTick,
  toRaw,
  Ref,
} from "vue";
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { useRoute, useRouter } from "vue-router";
import { Console } from "console";
import ErPopFree from 'ERX/ErPopFree'
import ErPopQuery from 'ERX/ErPopQuery'
export default defineComponent({
  name: 'PSSM11KVS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const erFormHelper: ER.FormHelper = new ER.FormHelper()
    let selectedDataItems: any[] = [];
    const $router = useRouter();
    const initializeService = '';
    const mainGridData = ref<any>([]);
    const subGridData = ref<any>([]);
    let gridView1!: any;
    let gridView2!: any;
    let cs_torpedo_number1: any;
    let cs_torpedo_number2: any;
    let cs_torpedo_number3: any;
    let cs_torpedo_number4: any;
    const flag1 = ref('0');
    const flag2 = ref('0');
    const flag3 = ref('0');
    const flag4 = ref('0');
    let selectedMainGridRow: any = []; //焦点行数据
    let initializeFlag = ref(false);
    // 画面相关数据初始化定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    // const efFormIsReady = ref(false);
    let formPartition: string;
    let formName = 'MMSM11K';
    let PROGRAM_NAME: string;
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('gridView1');
      erFormHelper.setGridEditable(gridView1, false); // 设置grid不可编辑

    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('gridView2');
      erFormHelper.setGridEditable(gridView2, false); // 设置grid不可编辑

    };

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      console.log(e);
      initializePage();
    };
    // 画面相关数据初始化
    const popFreeAdd = new ER.PopFreeHelper(
      efFormInfo.value.formPartition,
      "MMSM11K_PZ",
      "LayoutGroupFilter",
      ""
    );
    const popFreeUpd = new ER.PopFreeHelper(
      efFormInfo.value.formPartition,
      "MMSM11K_UPD",
      "LayoutGroupFilter",
      ""
    );
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        formName,
        '',
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = true;
        nextTick(() => {
          Querydata_pz();
        });
        // 回调函数获取控件信息及设置定义事件等操作
      } else {
        erFormHelper.messageError(
          'ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!'
        );
      }
    };




    onMounted(() => { });

    const f2_DO = async (e: any) => {
      //grid清空
      erFormHelper.clearLayoutOrGridData('gridView1', 'gridView2');

      const eiInfo = new EI.EIInfo();
      const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'Table0');
      eiBlock.pushData(
        { AY_TYPE: '1' }
        , true
      )
      //主表查询
      erFormHelper.callService('mmsm11k_inq', eiInfo, true, true).then((res) => {
        mainGridData.value = res.getBlock('Table0').data;
        console.log('lxx1', mainGridData.value);
        nextTick(() => {
          erFormHelper.mergeDataToGrid(mainGridData.value, gridView1);
        });
      });
      const eiInfo1 = new EI.EIInfo();
      const eiBlock1 = eiInfo1.addBlock(new EI.EiBlock());
      eiBlock1.pushData(
        { AY_TYPE: '2' }
        , true
      )
      erFormHelper.callService('mmsm11k_inq', eiInfo1, true, true).then((res) => {
        console.log(res);
        subGridData.value = res.getBlock('Table0').data;
        console.log('lxx2', subGridData.value);
        nextTick(() => {
          erFormHelper.mergeDataToGrid(subGridData.value, gridView2);
        });
      });
    };

    // gridView1行点击事件

    const Querydata_pz = async () => {
      const eiInfo1 = new EI.EIInfo();
      erFormHelper.callService('mmsm11k_inq2', eiInfo1, true, true).then((res) => {
        console.log(res);
        subGridData.value = res.getBlock('Table0').data;
        nextTick(() => {
          erFormHelper.mergeDataToLayoutOrGrid(subGridData.value, true, 'LayoutGroupFilter');
        });
      });
    }
    // // gridView2行点击事件
    // const gridView2Click = async (e: XrErGridEventArgs) => {
    //   if (e && e.data) {
    //     console.log("G");
    //     selectedMainGridRow = e.data.toJSON();
    //     listQuery2(selectedMainGridRow);
    //   }
    // };




    //模拟处理号查询


    // 信号发送
    const F3_DO = async (e: any) => {
      //--------------------------------------------------------
      //先定义 eiInfo，依次获取Block
      if (!erFormHelper.checkRequiredInput("LayoutGroupFilterA")) {
        return false;
      }
      const eiInfo = new EI.EIInfo();
      eiInfo.addBlock(erFormHelper.getGridAllRowsAsBlock('gridView1'), 'Table0');
      eiInfo.addBlock(erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilterA'), 'Table1');
      console.log('lxx111', eiInfo);
      const outInfo = await erFormHelper.callService(
        "mmsm11k_pro",
        eiInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("计算:" + outInfo.sys.msg);
      } else {
        // 赋值计算结果
        if (outInfo.getBlock(0).data.length > 0) {
          nextTick(() => {
            console.log('111', outInfo.getBlock(0).data)
            erFormHelper.mergeDataToLayoutOrGrid(outInfo.getBlock(0).data, true, 'LayoutGroupFilter1');
            cs_torpedo_number1 = outInfo.getBlock(0).data[0]["TORPEDO_NUMBER1"]
            cs_torpedo_number2 = outInfo.getBlock(0).data[0]["TORPEDO_NUMBER2"]


            gridView1.gridOptions.getRowStyle = (params: any) => {
              if (params.data.TORPEDO_NUMBER === cs_torpedo_number1) {
                if (outInfo.getBlock(0).data[0]["FLAG1"] === "1") {
                  return {
                    fontweight: 'bold',
                    background: 'blue'
                  }
                }
                if (outInfo.getBlock(0).data[0]["FLAG1"] === "2") {
                  return {
                    fontweight: 'bold',
                    background: 'red'
                  }
                }
              }
              if (params.data.TORPEDO_NUMBER === cs_torpedo_number2) {
                if (outInfo.getBlock(0).data[0]["FLAG2"] === "1") {
                  return {
                    fontweight: 'bold',
                    background: 'blue'
                  }
                }
                if (outInfo.getBlock(0).data[0]["FLAG2"] === "2") {
                  return {
                    fontweight: 'bold',
                    background: 'red'
                  }
                }
              }
            }
          });
        }
      }
    };

    //信号回退
    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView1).length === 0 && erFormHelper.getGridCheckedRows(gridView2).length === 0) {
        erFormHelper.messageWarning("请在左右选择其中的一条信息进行操作");
        return;
      }
      if (erFormHelper.getGridCheckedRows(gridView1).length >= 1 && erFormHelper.getGridCheckedRows(gridView2).length >= 1) {
        erFormHelper.messageWarning("请在左右选择其中的一条信息进行操作");
        return;
      }
      let eiBlock = new EI.EiBlock();
      if (erFormHelper.getGridCheckedRows(gridView1).length === 1) {
        eiBlock = erFormHelper.getGridCurrentRowAsBlock("gridView1");;
      }
      if (erFormHelper.getGridCheckedRows(gridView2).length === 1) {
        eiBlock = erFormHelper.getGridCurrentRowAsBlock("gridView2");
      }
      popFreeUpd.ReceiveData({
        TORPEDO_NUMBER: eiBlock.data[0]["TORPEDO_NUMBER"],
        TICODE: eiBlock.data[0]["TICODE"],
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeUpd, async (e: any) => {
        //console.log('dfujgvfh444', eiBlock);
        if (popFreeUpd.getEvent("ok")) {
          const eiInfo = new EI.EIInfo();
          eiInfo.addBlock(
            erFormHelper.convertModelAsBlock(popFreeUpd.DataModel),
            "Table1"
          );
          //控制台日志
          await erFormHelper
            .callService("mmsm11k_upd", eiInfo, true, false)
            .then((res) => {
              console.log("调用结果", res);
              if (res.status >= 0) {
                erFormHelper.messageSuccess("修改成功!!");
                nextTick(() => {
                  //window.location.reload();
                  f2_DO(e);
                });
              } else {
                erFormHelper.messageError("修改失败!!，失败原因:" + res.sys.msg);
              }
            });
        }
      });

    };

    const F5_DO = async (e: any) => {
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      popFreeAdd.ReceiveData({
        MODE_NO1: eiBlock.data[0]["MODE_NO1"],
        STOCK_WT1: eiBlock.data[0]["STOCK_WT1"],
        HEAT_WT_MAX1: eiBlock.data[0]["HEAT_WT_MAX1"],
        HEAT_WT_MIN1: eiBlock.data[0]["HEAT_WT_MIN1"],
        VALUE_SI1: eiBlock.data[0]["VALUE_SI1"],
        SAP_ERP_S1025_1_H1: eiBlock.data[0]["SAP_ERP_S1025_1_H1"],
        SAP_ERP_S1025_1_L1: eiBlock.data[0]["SAP_ERP_S1025_1_L1"],
        MODE_NO: eiBlock.data[0]["MODE_NO"],
        STOCK_WT: eiBlock.data[0]["STOCK_WT"],
        HEAT_WT_MAX: eiBlock.data[0]["HEAT_WT_MAX"],
        HEAT_WT_MIN: eiBlock.data[0]["HEAT_WT_MIN"],
        VALUE_SI: eiBlock.data[0]["VALUE_SI"],
        SAP_ERP_S1025_1_H: eiBlock.data[0]["SAP_ERP_S1025_1_H"],
        SAP_ERP_S1025_1_L: eiBlock.data[0]["SAP_ERP_S1025_1_L"],
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeAdd, async (e: any) => {
        //console.log('dfujgvfh444', eiBlock);
        if (popFreeAdd.getEvent("ok")) {
          const eiInfo = new EI.EIInfo();
          eiInfo.addBlock(
            erFormHelper.convertModelAsBlock(popFreeAdd.DataModel),
            "Table1"
          );
          //控制台日志
          await erFormHelper
            .callService("mmsm11j_upd", eiInfo, true, false)
            .then((res) => {
              console.log("调用结果", res);
              if (res.status >= 0) {
                erFormHelper.messageSuccess("修改成功!!");
                nextTick(() => {
                  //window.location.reload();
                  Querydata_pz();
                });
              } else {
                erFormHelper.messageError("修改失败!!，失败原因:" + res.sys.msg);
              }
            });
        }
      });
    };
    const F6_DO = async (e: any) => {
      if (!erFormHelper.checkRequiredInput("LayoutGroupFilterA")) {
        return false;
      }
      //--------------------------------------------------------
      //先定义 eiInfo，依次获取Block
      const eiInfo = new EI.EIInfo();
      eiInfo.addBlock(erFormHelper.getGridAllRowsAsBlock('gridView2'), 'Table0');
      eiInfo.addBlock(erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilterA'), 'Table1');
      console.log('lxx111', eiInfo);
      const outInfo = await erFormHelper.callService(
        "mmsm11k_pro",
        eiInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("计算:" + outInfo.sys.msg);
      } else {
        // 赋值计算结果
        if (outInfo.getBlock(0).data.length > 0) {
          nextTick(() => {
            console.log('111', outInfo.getBlock(0).data)
            erFormHelper.mergeDataToLayoutOrGrid(outInfo.getBlock(0).data, true, 'LayoutGroupFilter1');
            cs_torpedo_number1 = outInfo.getBlock(0).data[0]["TORPEDO_NUMBER1"]
            cs_torpedo_number2 = outInfo.getBlock(0).data[0]["TORPEDO_NUMBER2"]


            gridView2.gridOptions.getRowStyle = (params: any) => {
              if (params.data.TORPEDO_NUMBER === cs_torpedo_number1) {
                if (outInfo.getBlock(0).data[0]["FLAG1"] === "1") {
                  return {
                    fontweight: 'bold',
                    background: 'blue'
                  }
                }
                if (outInfo.getBlock(0).data[0]["FLAG1"] === "2") {
                  return {
                    fontweight: 'bold',
                    background: 'red'
                  }
                }
              }
              if (params.data.TORPEDO_NUMBER === cs_torpedo_number2) {
                if (outInfo.getBlock(0).data[0]["FLAG2"] === "1") {
                  return {
                    fontweight: 'bold',
                    background: 'blue'
                  }
                }
                if (outInfo.getBlock(0).data[0]["FLAG2"] === "2") {
                  return {
                    fontweight: 'bold',
                    background: 'red'
                  }
                }
              }
            }
          });
        }
      }
    };
    // 铸片展示
    const linkTo = () => {
      // let skiparam: any = [];
      // // 选择材料号
      // skiparam = selectedMainGridRow;
      // if (skiparam.length === 0) {
      //   // 如果选择材料号为空，传入第一行数据
      //   skiparam = mainGridData.value[0];
      // }
      // console.log('传入参数', skiparam);
      // // 画面跳转
      // $router.push({ query: skiparam, path: 'QXSMWD03' });
    };


    return {
      erFormHelper,
      initializeFlag,
      gridView1,
      gridView2,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      f2_DO,
      F3_DO,
      F4_DO, F5_DO,F6_DO
    };
  }
});
