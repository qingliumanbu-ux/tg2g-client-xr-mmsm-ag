import { defineComponent, onMounted, ref, reactive, computed, nextTick, toRaw, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import xrEfSearchBox from 'EFX/xrEfSearchBox';
import xrEfDialog from 'EFX/xrEfDialog';
import EFUtility from 'EFX/EFUtility';
import eBFR from 'EFX/eBFR';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import { useRoute } from 'vue-router';
import ErPopFree from 'ERX/ErPopFree';
import ErPopQuery from 'ERX/ErPopQuery';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';

export default defineComponent({
  name: 'MMSMGCS2N',
  components: { xrEfForm, xrEfPanel, xrEfSearchBox, xrEfDialog, erGrid, erLayout, ErPopFree, ErPopQuery },
  setup: () => {
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    const initializeService = '';
    // 获取画面的分区信息及设置画面初始化service

    // 变量定义
    formName = 'MMSM12S2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);

    let i_service_f2: any;
    let i_service_f3: any;
    let i_service_f5: any;
    let i_service_f7: any;
    let i_service_f8: any;
    let i_formlayout: any;
    let i_pop_flag: any;
    let i_factory_div: any;
    let i_handle_div: any;
    let sql_mat_kind: any;
    let cs_OkClick = '';
    let i_proc_div = '';
    let gridView1: any;
    let popFreeEdit: ER.PopFreeHelper;
    const formlayout: Ref<any[]> = ref([]);

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名

      console.log('efFormInfo', formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };
    // 画面相关数据初始化
    const initializePage = async () => {
      //获取子画面英文名

      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          QueryPara();
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };
    //通过炼钢配置表，进行模板画面参数查询
    const QueryPara = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock = inInfo.addBlock(new EI.EiBlock());
      eiBlock.pushData(
        {
          PROGRAM_NAME: formName
          // PROGRAM_NAME: programName
        },
        true
      );
      const outInfo = await erFormHelper.callService('mmsmpara_inq', inInfo, false, true, true);
      for (let i = 0; i < outInfo.getBlock(0).data.length; i++) {
        //获取设置F2服务名
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f2') {
          i_service_f2 = outInfo.getBlock(0).data[i]['PARA'];
        }
        //获取设置F3服务名
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f3') {
          i_service_f3 = outInfo.getBlock(0).data[i]['PARA'];
        }
        //获取设置F5服务名
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f5') {
          i_service_f5 = outInfo.getBlock(0).data[i]['PARA'];
        }
        //获取设置F7服务名
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f7') {
          i_service_f7 = outInfo.getBlock(0).data[i]['PARA'];
        }
        //获取设置F8服务名
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f8') {
          i_service_f8 = outInfo.getBlock(0).data[i]['PARA'];
        }
        //获取弹窗标志
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'pop_flag') {
          i_pop_flag = outInfo.getBlock(0).data[i]['PARA'];
        }
        //获取设置厂别信息
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'factory_div') {
          i_factory_div = outInfo.getBlock(0).data[i]['PARA'];
        }
      }
    };
    onMounted(() => {
      initializePage();
    });

    //页面数据加载查询
    const queryMain = async () => {
      const inInfo = new EI.EIInfo();
      const filter_condition = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {
        FACTORY_DIV: i_factory_div,
        POUR_FLAG: 'N'
      });
      inInfo.addBlock(filter_condition);
      const eiBlock_page = new EI.EiBlock();
      eiBlock_page.pushData({
        RecordFrom: 0,
        PageSize: 500
      });
      inInfo.addBlock(eiBlock_page, 'PageInfo');
      const outInfo = await erFormHelper.callService(i_service_f2, inInfo, false, true, true);
      erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'gridView_m');
    };

    //自定义模板参数
    const popFreeEdit_pars = async (Click_name: string) => {
      popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM12_LAYOUT_DIALOG');
      if (cs_OkClick === 'F3') {
        //popFreeEdit.AllowEidt = true;
      }
      if (cs_OkClick === 'F3') {
        popFreeEdit.FormHelper.setControlReadOnly('MMSM12_LAYOUT_DIALOG', true, 'TPD_NO', 'IRON_LADLE_NO');
      }
      if (cs_OkClick === 'F7') {
        popFreeEdit.FormHelper.setControlReadOnly('MMSM12_LAYOUT_DIALOG', true);
      }
    };
    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      let i_service: any;
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

      if (cs_OkClick === 'F3') {
        i_service = i_service_f3;
      } else if (cs_OkClick === 'F7') {
        i_service = i_service_f7;
      }

      inInfo.addBlock(
        erFormHelper.convertModelAsBlock(e.dataModel, {
          PROC_DIV: i_proc_div,
          FACTORY_DIV: i_factory_div
        }),
        'PARA'
      );
      outInfo = await erFormHelper.callService(i_service, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      queryMain();
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('gridView_m');
      erFormHelper.setGridEditable('gridView_m', false);
      erFormHelper.setGridToolbarVisible('gridView_m', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const F2_DO = async (e: any) => {
      queryMain();
    };

    //新增
    const F3_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (i_pop_flag === 'Y') {
        cs_OkClick = 'F3';
        i_proc_div = 'I';
        popFreeEdit_pars(cs_OkClick);
        ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      }
    };

    const F5_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridDataCount('gridView_m') === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
        return false;
      }

      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock('gridView_m', {
          PROC_DIV: 'D',
          FACTORY_DIV: i_factory_div
        }),
        'PARA'
      );

      if (inInfo.getBlock('PARA').data[0]['POUR_FLAG'] == 'Y') {
        erFormHelper.messageWarning('选中记录铁水罐已倒完确认，不允许删除操作！');
        return;
      }

      const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除， 是否继续？');
      if (!mes_res) {
        return false;
      }

      const outInfo = await erFormHelper.callService(i_service_f5, inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }

      queryMain();
    };

    //再倒
    const F7_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows('gridView_m').length === 0) {
        erFormHelper.messageWarning('请选择一条信息进行操作！');
        return;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_m', true)[0];

      if (mainGridCheckedRow['POUR_FLAG'] == 'Y') {
        erFormHelper.messageWarning('选中记录铁水罐已倒完确认，不允许再倒操作！');
        return;
      }

      if (i_pop_flag === 'Y') {
        cs_OkClick = 'F7';
        i_proc_div = 'ZD';
        popFreeEdit_pars(cs_OkClick);
        let flag1 = mainGridCheckedRow['POUR_FLAG1'] == 'Y' ? true : false;
        let flag2 = mainGridCheckedRow['POUR_FLAG2'] == 'Y' ? true : false;
        let flag3 = mainGridCheckedRow['POUR_FLAG3'] == 'Y' ? true : false;
        let flag4 = mainGridCheckedRow['POUR_FLAG4'] == 'Y' ? true : false;
        popFreeEdit.ReceiveData(mainGridCheckedRow, {
          TPD_NO: true,
          IRON_LADLE_NO: true,
          PROD_SHIFT_NO: true,
          PROD_SHIFT_GROUP: true,
          START_TIME: true,
          IRON_NO1: flag1,
          TPC_YL_NO1: flag1,
          MOLTIRON_WT1: flag1,
          IRON_NO2: flag2,
          TPC_YL_NO2: flag2,
          MOLTIRON_WT2: flag2,
          IRON_NO3: flag3,
          TPC_YL_NO3: flag3,
          MOLTIRON_WT3: flag3,
          IRON_NO4: flag4,
          TPC_YL_NO4: flag4,
          MOLTIRON_WT4: flag4
        });
        ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      }
    };

    //倒完确认
    const F8_DO = async (e: any) => {
      if (erFormHelper.getGridCheckedRows('gridView_m').length === 0) {
        erFormHelper.messageWarning('请选择一条信息进行操作！');
        return;
      }

      const inInfo = new EI.EIInfo();

      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock('gridView_m', {
          PROC_DIV: 'DWQR',
          FACTORY_DIV: i_factory_div
        }),
        'PARA'
      );

      if (inInfo.getBlock('PARA').data[0]['POUR_FLAG'] == 'Y') {
        erFormHelper.messageWarning('选中记录铁水罐已倒完确认，不允许倒完确认操作！');
        return;
      }

      const outInfo = await erFormHelper.callService(i_service_f8, inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }
      queryMain();
    };

    return {
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F5_DO,
      F7_DO,
      F8_DO
    };
  }
});
