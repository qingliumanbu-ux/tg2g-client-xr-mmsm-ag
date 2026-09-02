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
  name: 'MMSM11TS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    erGrid,
    erLayout,
    ErPopFree,
    ErPopQuery
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: string;
    let PROGRAM_NAME: string;
    const initializeService = '';

    // 变量定义
    formName = 'MMSM11S2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let v_factory_div = ''; //厂别
    let service_f2: any;
    let i_service_f2: any;
    let i_service_f3: any;
    let i_service_f4: any;
    let i_service_f5: any;
    let i_service_f6: any;
    let i_service_f7: any;
    let i_formlayout: any;
    let cs_OkClick = '';
    let i_proc_div = '';
    let i_pop_flag;
    let i_windowsNumber: any;
    let i_tableName: any;
    let i_datatSet: any;
    let i_layoutGroupFilter: any;
    let i_gridView: any;
    let i_layout_Dialog: any;
    let gridView1: any;
    let gridView2: any;
    let gridView3: any;

    let popFreeEdit: ER.PopFreeHelper;
    const listTb: Ref<any[]> = ref([]);
    const listGridView: Ref<any[]> = ref([]);
    const gridToolbar: Ref<any[]> = ref([]);

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      if (efFormInfo.value.formParams?.factory_div) v_factory_div = efFormInfo.value.formParams['factory_div'];
      console.log('efFormInfo', formName);
      if (efFormInfo.value.formParams?.PROGRAM_NAME) {
        PROGRAM_NAME = efFormInfo.value.formParams['PROGRAM_NAME'];
      }
      initializePage();
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      //获取模板画面关键码

      //获取子画面英文名
      //i_form_ename = EFFormInfo.getFormParams().formName;
      console.log('v_factory_div', v_factory_div);
      console.log('formName', formName);
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        //erFormHelper.setGridServerPagingQuery('gridView_m', queryMain);
        InitialToolbar();

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          QueryPara();
          //queryMain();
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
      /*  gridToolbar.value = erFormHelper.getGridToolbar([
        { name: 'excel', visible: true },
        { name: 'addrow', visible: false },
        { name: 'copyrow', visible: false },
        { name: 'delete', visible: false },
        { name: 'save', visible: false },
        { name: 'cancel', visible: false }
      ]); */
    };

    onMounted(() => {
      //initializePage();
    });

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
      /* const dt = new EI.EiBlock();
      dt.addColumns(
        'PROGRAM_NAME'
      );
      inInfo.addBlock(dt);*/

      const outInfo = await erFormHelper.callService('mmsmpara_inq', inInfo, false, true, true);
      console.log('QueryPara', inInfo);
      for (let i = 0; i < outInfo.getBlock(0).data.length; i++) {
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f2') {
          i_service_f2 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f3') {
          i_service_f3 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f4') {
          i_service_f4 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f5') {
          i_service_f5 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f6') {
          i_service_f6 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'service_f7') {
          i_service_f7 = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'formlayout') {
          i_formlayout = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'pop_flag') {
          i_pop_flag = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'windows') {
          i_windowsNumber = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (i_windowsNumber === '') {
          i_windowsNumber = formName.substring(0, 6);
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'able_name') {
          i_tableName = outInfo.getBlock(0).data[i]['PARA'];
          if (i_tableName != '') {
            listTb.value = i_tableName.split(',');
          }
          console.log('22222', listTb.value);
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'data_set') {
          i_datatSet = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (i_datatSet === '') {
          i_datatSet = 'DataSet_' + formName.substring(0, 6);
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'layout_group_filter') {
          i_layoutGroupFilter = outInfo.getBlock(0).data[i]['PARA'];
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'grid_view') {
          i_gridView = outInfo.getBlock(0).data[i]['PARA'];
          if (i_tableName != '') {
            listGridView.value = i_gridView.split(',');
          }
        }
        if (outInfo.getBlock(0).data[i]['PARA_NAME'] === 'layout_dialog') {
          i_layout_Dialog = outInfo.getBlock(0).data[i]['PARA'];
        }
      }
    };
    //页面数据加载查询
    const queryMain = async () => {
      // options.success({ data: undefined, total: undefined });
      const inInfo = new EI.EIInfo();
      const filter_condition = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {
        FACTORY_DIV: v_factory_div,
        FLAG: '1'
      });
      //将查询条件放进inInfo
      inInfo.addBlock(filter_condition);
      //const eiBlock_page = new EI.EiBlock();
      // eiBlock_page.pushData({ RecordFrom: options.data.skip, PageSize: options.data.pageSize });
      //追加分页表到inInfo
      // inInfo.addBlock(eiBlock_page, 'PageInfo');

      console.log('111111', inInfo);
      const outInfo = await erFormHelper.callService(i_service_f2, inInfo, false, true, true);
      //erFormHelper.mergeDataToLayoutOrGrid(outInfo,true,'gridView_m');

      if (outInfo.sys.status >= 0) {
        const resultData = outInfo.getBlock(0).data; //后台返回的当页的数据TOTALRECORDCOUNT
        const reusltTotal = outInfo.blocks['PageInfo'].data[0]['TOTALRECORDCOUNT']; //后台返回数据总条数
        console.log('条数', outInfo.blocks['PageInfo']);

        //固定写法[ison的键必须是data和total]
        const result = { data: resultData, total: reusltTotal };
        //options.success(result);
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageInfo('未查询到材料信息');
        }
      }
    };

    //自定义模板参数
    const popFreeEdit_pars = async (windowsNumber: string, Click_name: string) => {
      if (i_windowsNumber === 'MMSM12') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM12_LAYOUT_DIALOG');
      }
      if (i_windowsNumber === 'MMSM13') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM13_LAYOUT_DIALOG');
      }
      if (i_windowsNumber === 'MMSM14') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM14_LAYOUT_DIALOG');
      }
      if (i_windowsNumber === 'MMSM11') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM11_LAYOUT_DIALOG');
      }
      //新增
      if (Click_name === 'F3') {
        // popFreeEdit.AllowEidt = true;
      }
      console.log('12344567');
    };

    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      if (cs_OkClick === 'F3') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div
          }),
          'PARA'
        );
        outInfo = await erFormHelper.callService(i_service_f3, inInfo, false, true, true);
      }
      if (cs_OkClick === 'F4') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div
          }),
          'PARA'
        );
        outInfo = await erFormHelper.callService(i_service_f4, inInfo, false, true);
      }
      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功');
      }
      queryMain();
      //erFormHelper.getGridServerPageData('gridView_m');
    };

    //焦点行数据查询
    const gridView_mFocusChanged = async (e: any) => {
      if (e) {
        if (e.rowChanged && e.data) {
          const inInfo = new EI.EIInfo();
          inInfo.addBlock(
            erFormHelper.convertModelAsBlock(e.data, {
              IRON_NO: e.data.get('IRON_NO'),
              TPC_YL_NO: e.data.get('TPC_YL_NO'),
              FLAG: '2'
            })
          );
          console.log('tiecihao', e.data.get('IRON_NO'));
          console.log('TPC_YL_NO', e.data.get('TPC_YL_NO'));
          console.log('焦点行', inInfo);
          //根据焦点行IRON_NO查询鱼雷罐铁水成分
          const outInfo = await erFormHelper.callService('mmsm11_inq', inInfo, false, true);
          if (outInfo.sys.status < 0) {
            return false;
          }
          console.log('数据输出', outInfo);
          erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'layoutControlGroup_cf');
          //根据焦点行IRON_NO查询倒罐铁包铁水
          const outInfo1 = await erFormHelper.callService('mmsm11_tpd_wt_inq', inInfo, false, true);
          if (outInfo1.sys.status < 0) {
            return false;
          }
          erFormHelper.mergeDataToLayoutOrGrid(outInfo1, true, 'layoutControlGroup_dg');
        }
      }
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

    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('layoutControlGroup_dg');
      erFormHelper.setGridEditable('layoutControlGroup_dg', false);
      erFormHelper.setGridToolbarVisible('layoutControlGroup_dg', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid('layoutControlGroup_cf');
      erFormHelper.setGridEditable('layoutControlGroup_cf', false);
      erFormHelper.setGridToolbarVisible('layoutControlGroup_cf', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    //F2按钮查询
    const F2_DO = async (e: any) => {
      queryMain();
      //erFormHelper.getGridServerPageData('gridView_m');
    };

    //F3按钮新增
    const F3_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      cs_OkClick = 'F3';
      i_proc_div = 'I';
      popFreeEdit_pars(i_windowsNumber, cs_OkClick);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    //修改
    const F4_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridDataCount('gridView_m') === 0) {
        erFormHelper.messageWarning('请选择一条信息再修改');
        return false;
      }
      //加载弹窗配置
      cs_OkClick = 'F4';
      i_proc_div = 'U';
      popFreeEdit_pars(i_windowsNumber, cs_OkClick);
      console.log('1111111', toRaw(erFormHelper.getGridCurrentRow('gridView_m')));
      popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('gridView_m'));
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    //删除
    const F5_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridDataCount('gridView_m') === 0) {
        erFormHelper.messageWarning('请选择一条信息再删除');
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除， 是否继续？');
      if (!mes_res) {
        return false;
      }
      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock('gridView_m', {
          PROC_DIV: 'D',
          FACTORY_DIV: v_factory_div
        }),
        'PARA'
      );
      console.log(inInfo);
      const outInfo = await erFormHelper.callService(i_service_f5, inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        queryMain();
        //erFormHelper.getGridServerPageData('gridView_m');
      }
    };
    //F9按钮：返回确认
    const F9_DO = async (e: any) => {
      const v_count = erFormHelper.getGridSelectRows('gridView_m').length;
      console.log('焦点行数据条数', v_count);
      if (v_count === 0 || v_count > 1) {
        erFormHelper.messageWarning('请选择一条信息再操作');
        return false;
      }
      popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM11', 'LayoutPop_F9');
      popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('gridView_m'));
      //自定义
      const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
        console.log(9999);
        if (e.dataModel?.get('IRON_REMAIN_WT') <= 0) {
          erFormHelper.messageWarning('鱼雷罐剩余铁水量不能为0');
          return false;
        }
        if (e.dataModel?.get('RETURN_FLAG').trim() === '') {
          erFormHelper.messageWarning('返回标记不能为空');
          return false;
        }
        console.log('123', e.dataModel?.get('AFFIRM_RETURN_TIME'));

        if (e.dataModel?.get('AFFIRM_RETURN_TIME') === null) {
          erFormHelper.messageWarning('实物确认返回时间不能为空');
          return false;
        }
        console.log('hahahha');
        const inInfo = new EI.EIInfo();
        inInfo.addBlock(erFormHelper.convertModelAsBlock(e.dataModel));
        const outInfo = await erFormHelper.callService('mmsm11_dk_snd', inInfo, false, true);
        if (outInfo.sys.status >= 0) {
          erFormHelper.messageSuccess('操作成功');
          queryMain();
          //erFormHelper.getGridServerPageData('gridView_m');
        }
      };
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    return {
      erGrid3Ready,
      erGrid2Ready,
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F9_DO,
      gridView_mFocusChanged,
      gridToolbar
    };
  }
});
