/*
 * @Description:
 * @Author: Edward
 * @Date: 2022-06-02 17:21:37
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 15:13:06
 */
import { defineComponent, ref, reactive, computed, nextTick, toRaw, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { useRoute, useRouter } from 'vue-router';
import { Console } from 'console';

export default defineComponent({
  name: '',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree
  },
  setup: () => {
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    let selectedDataItems: any[] = [];
    const $router = useRouter();
    // 画面相关数据初始化定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    // const efFormIsReady = ref(false);
    let formPartition: string;
    let formName = 'MMSM11MAIN';
    let PROGRAM_NAME: string;
    let initializeFlag = ref(false);
    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      console.log('111');
      initializePage();
    };
    // 变量定义

    let gridView1!: any;
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('MMSM11ListGridview');
      erFormHelper.setGridEditable(gridView1, false); // 设置grid不可编辑
    };
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', '');
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = true;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    // 自定义工具栏按钮功能

    const queryMainGrid = async () => {
      if (!erFormHelper.checkRequiredInput('MMSM11LayoutFilter')) {
        return false;
      }
      //清空grid数据
      erFormHelper.clearGridData('MMSM11ListGridview');
      const inInfo = new EI.EIInfo();
      //获取查询条件dt
      const Query = erFormHelper.getAllControlValueAsEiBlock('MMSM11LayoutFilter');

      inInfo.addBlock(Query);
      //let ss = inInfo.blocks.Table1.data[0].START_TIME;
      //let ss = inInfo.blocks.Table1;
      let ss = inInfo.getBlock(0).data[0]['START_TIME'];
      console.log(ss);
      const outInfo = await erFormHelper.callService('mmsm11cv_inq', inInfo, false, true);
      console.log(outInfo.getBlock(0).data.length);
      if (outInfo.sys.status >= 0) {
        // 根据返回数据加载页面显示数据//需要和si配置的数据集的表一致
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), gridView1);
        erFormHelper.setGridEditable('MMSM11ListGridview', false);
      } else {
        erFormHelper.messageError(outInfo.sys.msg);
      }
    };

    const SaveMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      erFormHelper.getGridChangedRowsAsEiInfo(gridView1, eiInfo, 'MMSM11CV');

      if (
        !eiInfo.contains('MMSM11CV_DELETE') &&
        !eiInfo.contains('MMSM11CV_MODIFY') &&
        !eiInfo.contains('MMSM11CV_ADD')
      ) {
        erFormHelper.messageInfo('没有变更记录需要保存');
        return false;
      }

      const outInfo = await erFormHelper.callService('mmsm11cv_iud', eiInfo, false, false, true);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageSuccess('保存成功:' + outInfo.sys.msg);
        queryMainGrid();
      }
    };

    const getgridcelldata = async () => {
      // const currdata = erFormHelper.getGridCurrentRow('MMSM11ListGridview');
      const currdata = erFormHelper.getGridRows('MMSM11ListGridview', 'current');
      if (currdata.length > 0) erFormHelper.messageInfo(currdata[0]['TICODE'] + 'fuc');
      // const CURBLOCK = erFormHelper.getGridCurrentRowAsBlock(gridView1);
      // if (CURBLOCK.data.length > 0) {
      //   null;
      // }
      // erFormHelper.addRowToGrid('MMSM11ListGridview', true, true, true);
    };

    const setinidata = async () => {
      const alldata = erFormHelper.getGridAllRows(gridView1);
      // erFormHelper.messageInfo(alldata.length.toString());
      // erFormHelper.setGridIndicator(gridView1, { TIDCODE: "23423423", TICODE: "234234" });

      if (alldata.length > 0) {
        const currentRow = alldata[alldata.length - 1];
        currentRow.set('FACTORY_DIV', '6240');
        currentRow.set('TIDCODE', '000#99#00');

        // currentRow.setGridColumnEditable(false);
      }

      // erFormHelper.setGridIndicator(gridView1, { TICODE: "6120202310070007",'TAPNO':'5*789'});
      erFormHelper.setGridIndicator('MMSM11ListGridview', { TICODE: '6120202310070005', TAPNO: '1' });

      // let currdata = erFormHelper.getGridCurrentRow('MMSM11ListGridview');
      // if (currdata != null)
      //   erFormHelper.messageInfo(currdata["TICODE"]);
    };
    const F2_DO = async (e: any) => {
      queryMainGrid();
    };

    const F4_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows(gridView1).length === 0) {
        erFormHelper.messageWarning('请选择要发送电文的记录！');
      } else {
        // 发送电文提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock(gridView1, {
            DEAL_FLAG: '3'
          });
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
          const outInfo = await erFormHelper.callService('mmsm11cv_snd', eiInfo, false, false, true);
          if (outInfo.sys.status < 0) {
            erFormHelper.messageError('发送失败:' + outInfo.sys.msg);
          } else {
            erFormHelper.messageSuccess('发送成功');
            erFormHelper.setGridEditable('MMSM11ListGridview', false);
            queryMainGrid();
          }
        }
      }
    };
    const F4_PRE_DO = async (e: any) => {
      // getgridcelldata();
    };
    const F4_CANCEL = async (e: any) => {
      erFormHelper.unCheckAllGridRow(gridView1);
    };
    const F3_DO = async (e: any) => {
      SaveMainGrid();
      erFormHelper.setGridToolbarVisible('MMSM11ListGridview', {
        addrow: false,
        copyrow: false,
        delete: false
      });
      erFormHelper.setGridEditable('MMSM11ListGridview', false);
    };
    const F3_PRE_DO = async (e: any) => {
      //  setinidata();
      // getgridcelldata();
      erFormHelper.setGridToolbarVisible('MMSM11ListGridview', {
        addrow: true,
        copyrow: true,
        delete: true
      });
      erFormHelper.setGridEditable('MMSM11ListGridview', true);
    };
    const F3_CANCEL = async (e: any) => {
      // gridView1.cancelChanges();
      erFormHelper.unCheckAllGridRow(gridView1);
      erFormHelper.setGridToolbarVisible('MMSM11ListGridview', {
        addrow: false,
        copyrow: false,
        delete: false
      });
      erFormHelper.setGridEditable('MMSM11ListGridview', false);
    };

    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL,
      gridView1,
      erGrid1Ready,
      efFormReady,
      SaveMainGrid
      //  setinidata,
      // getgridcelldata
    };
  }
});
