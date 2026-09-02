/*
 * @Description:
 * @Author: Edward
 * @Date: 2022-06-02 17:21:37
 * @LastEditors: zhangTing
 * @LastEditTime: 2023-07-19 15:13:06
 */
import { defineComponent, onMounted, ref, reactive, computed, nextTick, toRaw, Ref } from 'vue';
import { EI, EIManager } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';

import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MMSM11AV',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid
  },
  setup() {
    const dropdownlistValue = ref('0');
    const dataSourceArray = [
      { text: '在线数据', value: '0' },
      { text: '历史数据', value: '1' }
    ];

    let selectedDataItems: any[] = [];

    // 画面相关数据初始化定义
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeService = '';
    const mainGridData = ref<any>([]);
    const subGridData = ref<any>([]);
    let gridView1!: any;
    const initializeFlag = ref(false);
    let selectedMainGridRow: any = []; //焦点行数据
    // 画面相关数据初始化定义
    const efFormInfo = ref<{ [key: string]: any }>({});
    // const efFormIsReady = ref(false);
    let formPartition: string;
    let formName = 'TMMSM11';
    let PROGRAM_NAME: string;
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('gridView_tmmsm11');
      erFormHelper.setGridEditable(gridView1, false); // 设置grid不可编辑
    };

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      Initialize();
    };
    const editable = ref(false);
    const hiddenButton: Ref<any[]> = ref(['F5']);
    // 自定义工具栏按钮功能

    // 主表保存
    const saveMainGridData = async () => {
      if (erFormHelper.hasDataChange('gridView_tmmsm11')) {
        const eiinfo = new EI.EIInfo();
        const created = erFormHelper.getGridRowsAsBlock(gridView1, 'add');
        eiinfo.addBlock(created, 'ADD');

        const updated = erFormHelper.getGridRowsAsBlock(gridView1, 'modify');
        eiinfo.addBlock(updated, 'UPD');

        const deleted = erFormHelper.getGridRowsAsBlock(gridView1, 'delete');
        eiinfo.addBlock(deleted, 'DEL');

        const para = erFormHelper.getAllControlValueAsEiBlock('tmmsm11LayoutFilter');
        eiinfo.addBlock(para, 'PARA');
        erFormHelper.callService('pssmd1_save', eiinfo, true, true).then((res) => {
          subGridData.value = res.getBlock('Table0').data;
        });
      }
    };
    // 画面相关数据初始化
    const Initialize = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', '');

      if (initialResult.flag > 0) {
        initializeFlag.value = true;
        // 初始化工具栏
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };
    onMounted(() => {
      Initialize();
    });
    // 下拉切换触发
    const onChange = (e: any) => {
      dropdownlistValue.value = e.sender._cascadedValue;
      if (e.sender._cascadedValue === '1') {
        hiddenButton.value = ['F3', 'F4'];
      } else {
        hiddenButton.value = ['F5'];
      }
      getData();
    };

    //查询
    const getData = async () => {
      //压条件
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('tmmsm11LayoutFilter');
      eiInfo.addBlock(eiBlock, 'Table0');

      await erFormHelper.callService('mmsm11_inq', eiInfo, true, false).then((res) => {
        const mainData = res.blocks['Table0'].data;
        nextTick(() => {
          erFormHelper.mergeDataToGrid(mainData, gridView1);
        });
      });
    };

    // 查询
    const f2Do = () => {
      getData();
    };

    // 维护
    const f3PreDo = (e: any) => {
      editable.value = true;
      erFormHelper.setGridToolbarVisible('gridView_tmmsm11', {
        addrow: true,
        copyrow: true,
        delete: true
      });

      erFormHelper.setGridEditable('gridView_tmmsm11', true);
    };
    // 维护确认
    const f3Do = async (e: any) => {
      erFormHelper.setGridToolbarVisible('gridView_tmmsm11', {
        addrow: false,
        copyrow: false,
        delete: false
      });
      return await saveMainGridData()
        .then((res: any) => {
          getData();
          editable.value = false;
          erFormHelper.setGridEditable('gridView_tmmsm11', false);
        })
        .catch((error) => {
          erFormHelper.messageError(error);
          return false;
        });
    };

    // 维护取消
    const f3Cancel = async () => {
      editable.value = false;
      erFormHelper.setGridToolbarVisible('gridView_tmmsm11', {
        addrow: false,
        copyrow: false,
        delete: false
      });
      erFormHelper.setGridEditable('gridView_tmmsm11', false);
    };

    // 审核前判断
    const f4PreDo = (e: any) => {
      selectedDataItems = [];
      const selectedRows = erFormHelper.getGridSelectRows(gridView1);
      selectedRows.forEach((tr: any) => {
        const json = tr.toJSON();
        selectedDataItems.push(json);
      });
      if (selectedDataItems.length === 0) {
        erFormHelper.messageWarning('请选择一条数据进行审核');
        return false;
      }
    };

    // 确认审核
    const f4Do = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = EI.EiBlock.build('Table0', selectedDataItems);
      eiInfo.addBlock(eiBlock);
      erFormHelper.callService('qxsmbt0a_aud', eiInfo, true, true).then((res) => {
        const platonicResData = res.blocks['Table0'].data;
        nextTick(() => {
          erFormHelper.mergeDataToGrid(platonicResData, gridView1);
        });
        getData();
      });
    };

    // 取消审核
    const f4Cancel = () => {};

    // 恢复前判断
    const f5PreDo = (e: any) => {
      selectedDataItems = [];
      const selectedRows = erFormHelper.getGridSelectRows(gridView1);
      selectedRows.forEach((tr: any) => {
        const json = tr.toJSON();
        selectedDataItems.push(json);
      });
      if (selectedDataItems.length === 0) {
        erFormHelper.messageWarning('请选择一条数据进行审核');
        return false;
      }
    };
    // 确认恢复
    const f5Do = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = EI.EiBlock.build('Table0', selectedDataItems);
      eiInfo.addBlock(eiBlock);
      erFormHelper.callService('qxsmbt0a_res', eiInfo, true, true).then((res) => {
        const platonicResData = res.blocks['Table0'].data;
        nextTick(() => {
          erFormHelper.mergeDataToGrid(platonicResData, gridView1);
        });
        getData();
      });
    };
    // 取消恢复
    const f5Cancel = () => {};
    return {
      erFormHelper,
      initializeFlag,
      editable,
      hiddenButton,
      dropdownlistValue,
      dataSourceArray,
      Initialize,
      f2Do,
      f3Do,
      f3PreDo,
      f3Cancel,
      f4Do,
      f4PreDo,
      f4Cancel,
      f5Do,
      f5PreDo,
      f5Cancel,
      getData,
      onChange,
      gridView1,
      efFormReady,
      erGrid1Ready
    };
  }
});
