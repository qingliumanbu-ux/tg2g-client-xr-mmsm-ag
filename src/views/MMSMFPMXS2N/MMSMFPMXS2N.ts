import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager, buildEIInfo } from 'EIX/ei';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import xrEfDialog from 'EFX/xrEfDialog';
import ErPopFree from 'ERX/ErPopFree';
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';
import { Console, log } from 'console';

export default defineComponent({
  name: 'MMSMFPMXS2N',
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog,
    ErPopFree
  },

  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    let i_form_ename = ''; // 低代码配置画面布局名
    let grid_main!: any;
    const gridView_tab1 = ref('GridView1');
    const gridView_tab2 = ref('GridView2');
    const gridView_tab3 = ref('GridView3');
    const gridView_tab4 = ref('GridView4');
    const gridView_tab5 = ref('GridView5');
    const gridView_tab6 = ref('GridView6');
    let LayoutGroupFilter = 'LayoutGroupFilter';

    const initializeService = '';
    const tabActiveKey = ref('tab3');
    let i_proc_div = '';
    let i_c_div = '';
    let cs_OkClick = '';
    let popFreeEdit: ER.PopFreeHelper;
    let grid_tab = '';

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
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
    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 变量定义
    const initializeFlag = ref(0);
    let dt_key = new EI.EiBlock();
    const i_service_f1 = 'mmsmfpmx_inq2';    //查找铸坯信息vmmsm01
    const i_service_f2 = 'mmsmfpmx_inq';    //查找废品信息TMMSMFP
    const i_service_f3 = 'mmsmfpmx_pro';
    const i_service_f4 = 'mmsmfpmx_pro';
    const i_service_f5 = 'mmsmfpmx_pro';
    const i_service_f6 = 'mmsmfpmx_pro';
    const i_service_f7 = 'mmsmfpmx_pro';
    const i_service_f8 = 'mmsmfply_pro';    //利用增值品新增\修改\删除
    const i_service_f9 = 'mmsmfpmx_inq1';   //查找先后浇
    const i_service_f10 = 'mmsmfpmx_inq3';    //改切碳钢查询
    const i_service_f11 = 'mmsmfpmx_inq4';    //改切不锈钢查询
    const i_service_f12 = 'mmsmfply_inq';   //利用增值品查询

    const i_factory_div = 'LG1';

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {});
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {});
    //grid实例
    const erGrid1Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_tab1.value);
      erFormHelper.setGridEditable(gridView_tab1.value, false);
      erFormHelper.setGridToolbarVisible(gridView_tab1.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid2Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_tab2.value);
      erFormHelper.setGridEditable(gridView_tab2.value, false);
      erFormHelper.setGridToolbarVisible(gridView_tab2.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid3Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_tab3.value);
      erFormHelper.setGridEditable(gridView_tab3.value, false);
      erFormHelper.setGridToolbarVisible(gridView_tab3.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid4Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_tab4.value);
      erFormHelper.setGridEditable(gridView_tab4.value, false);
      erFormHelper.setGridToolbarVisible(gridView_tab4.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };
    const erGrid5Ready = () => {
      grid_main = erFormHelper.getGrid(gridView_tab5.value);
      erFormHelper.setGridEditable(gridView_tab5.value, false);
      erFormHelper.setGridToolbarVisible(gridView_tab5.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    const handleTabChange = (activeKey: string) => {
      if (activeKey === 'tab1') {
        query_main();
      } else if (activeKey === 'tab2') {
        //getSubGridProd();
        query();
      } else if (activeKey === 'tab3') {
        //getSubGridProd();
        //query_zp();
      } else if (activeKey === 'tab4') {
        query_gq1();
      } else if (activeKey === 'tab5') {
        query_gq2();
      } else if (activeKey === 'tab6') {
        query_ly();
      }
    };

    //自定义模板参数
    const popFreeEdit_pars = async (Click_name: string) => {
      if (cs_OkClick === 'F3') {
        //popFreeEdit.AllowEidt = true;
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSMFPMX_LAYOUT_DIALOG1');
      }
      if (cs_OkClick === 'F4') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSMFPMX_LAYOUT_DIALOG2');
      }
      if (cs_OkClick === 'F5') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSMFPMX_LAYOUT_DIALOG3');
      }
      if (cs_OkClick === 'F6') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSMFPMX_LAYOUT_DIALOG4');
      }
      if (cs_OkClick === 'F8') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSMFPMX_LAYOUT_DIALOG5');
      }
      if (cs_OkClick === 'F9') {
        popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSMFPMX_LAYOUT_DIALOG6');
      }
    };

    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      console.log('111');
      let i_service: any;
      const inInfo = new EI.EIInfo();
      console.log('inInfoqqq', inInfo);
      let outInfo: EI.EIInfo = new EI.EIInfo();

      if (cs_OkClick === 'F3') {
        i_service = i_service_f3;
      } else if (cs_OkClick === 'F4') {
        i_service = i_service_f4;
      } else if (cs_OkClick === 'F5') {
        i_service = i_service_f5;
      } else if (cs_OkClick === 'F6') {
        i_service = i_service_f6;
      } else if (cs_OkClick === 'F8') {
        i_service = i_service_f8;
      } else if (cs_OkClick === 'F9') {
        i_service = i_service_f8;
      }

      inInfo.addBlock(
        erFormHelper.convertModelAsBlock(e.dataModel, {
          FACTORY_DIV: i_factory_div,
          PROC_DIV: i_proc_div,
          C_DIV: i_c_div
        }),
        'PARA'
      );
      console.log('inInfoqwe', inInfo);

      outInfo = await erFormHelper.callService(i_service, inInfo, false, true, true);

      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功！');
      }

      query_main();
      query();
      query_ly();
    };

    const F2_DO = async () => {
      query_zp();
      query_main();
      query();
      query_gq1();
      query_gq2();
      query_ly();
    };

    const query_zp = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      console.log('eiBlock', eiBlock);
      const app_code = eiBlock.data[0]['APP_CODE'];
      console.log('app_code', app_code);
      
      eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService(i_service_f1, eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab3.value);
      }
    };


    const query_main = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('C_DIV', '0'); //传碳锈区分
      eiInfo.addBlock(eiBlock, '');
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService(i_service_f2, eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab1.value);
      }
    };

    const query = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiBlock.addColumn('C_DIV', '1'); //传碳锈区分
      eiInfo.addBlock(eiBlock, '');
      console.log('eiInfo', eiInfo);

      const outInfo = await erFormHelper.callService(i_service_f2, eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab2.value);
      }
    };

    const query_gq1 = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      //eiBlock.addColumn('C_DIV', '0'); //传碳锈区分
      eiInfo.addBlock(eiBlock, '');
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService(i_service_f10, eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab4.value);
      }
    };

    const query_gq2 = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      //eiBlock.addColumn('C_DIV', '1'); //传碳锈区分
      eiInfo.addBlock(eiBlock, '');
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService(i_service_f11, eiInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab5.value);
      }
    };
    const query_ly = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiInfo.addBlock(eiBlock, '');
      console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService(i_service_f12, eiInfo);
      console.log('outInfo', outInfo);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      } else {
        erFormHelper.mergeDataToGrid(outInfo, gridView_tab6.value);
      }
    };

    //F3点击事件：新增
    const F3_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
      eiInfo.addBlock(eiBlock, '');
      console.log('eiInfo', eiInfo);
      const FORE_BACK = eiInfo.getBlock(0).data[0]['FORE_BACK'] ;
      console.log('FORE_BACK', FORE_BACK);


      if (erFormHelper.getGridCheckedRows('GridView3').length === 0) {
        erFormHelper.messageWarning('请选择一条需要新增的铸坯记录！');
        return;
      }
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView3', true)[0];
      const ST_NO = mainGridCheckedRow['ST_NO'];
      console.log('ST_NO',ST_NO.substring(0,1));
      const COMPLEX_DECIDE_CODE = mainGridCheckedRow['COMPLEX_DECIDE_CODE'];
      console.log('COMPLEX_DECIDE_CODE',COMPLEX_DECIDE_CODE);

      if (ST_NO.substring(0,1) === '1') {
        erFormHelper.messageWarning('请选择碳钢坯！');
        return;
      }

      //先浇FORE_BACK标志为1，后浇FORE_BACK标志为0
      if (FORE_BACK == 1) {
        mainGridCheckedRow['MATERIAL_DESC_FORE'] = mainGridCheckedRow['SG_GRADE_1'];
        mainGridCheckedRow['HEAT_NO2'] = mainGridCheckedRow['BATCH'];
        //mainGridCheckedRow['PROD_TIME'] = mainGridCheckedRow['SLAB_CUT_TIME'];
        if(COMPLEX_DECIDE_CODE === '9'){
          mainGridCheckedRow['APP_CODE'] = '02';
          mainGridCheckedRow['MAT_LEN_2'] = mainGridCheckedRow['MAT_ACT_LEN'];
          const density = 7.85;
          mainGridCheckedRow['CUT_SCRAP_WT'] = parseFloat(
                            (
                              (mainGridCheckedRow['MAT_ACT_LEN']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_WIDTH']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_THICK']/ 1000) *
                              density
                            ).toFixed(3)
                                        );
        }else{
          mainGridCheckedRow['APP_CODE'] = '01';
        }
        
        //后浇HEAT_NO1,后浇钢种MATERIAL_DESC_BACK
        //先浇带出后浇
        const eiInfo1 = new EI.EIInfo();
        const eiBlock1 = erFormHelper.getGridSelectRowsAsBlock('GridView3');
        eiBlock1.addColumn('FORE_BACK', '1');
        eiInfo1.addBlock(eiBlock1, '');
        console.log('eiInfo1', eiInfo1);
        const outInfo = await erFormHelper.callService(i_service_f9, eiInfo1);//标志为1，找后浇
        console.log('outInfo111', outInfo);
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageWarning('无后浇次');
        }else{
          //MATERIAL_DESC_BACK
          mainGridCheckedRow['HEAT_NO1'] = outInfo.getBlock(0).data[0]['BATCH'];
          mainGridCheckedRow['MATERIAL_DESC_BACK'] = outInfo.getBlock(0).data[0]['SG_GRADE_1']

          
          console.log('mainGridCheckedRow',mainGridCheckedRow);
    
          cs_OkClick = 'F3';
          i_proc_div = 'I';
          i_c_div = '0';
          console.log('i_proc_div', i_proc_div);
    
          popFreeEdit_pars(cs_OkClick);
          popFreeEdit.ReceiveData(mainGridCheckedRow, {
            //BATCH: true
            //HEAT_NO: true,
            //PRINT_NO: true
        })

        //碳钢自动计算切废重量
        popFreeEdit.setEvent('itemValueChanged', (e: any) => {

          //除四种原因外，其他原因不带出后浇，且默认无系统
          if (e.itemCode === 'CUT_SCRAP_REASON') {
            const cut_scrap_reason = popFreeEdit.getValue(e.itemCode);
            console.log('cut_scrap_reason', cut_scrap_reason);
            // if(cut_scrap_reason !== '07' && cut_scrap_reason !== '08' && cut_scrap_reason !== '09' && cut_scrap_reason !== '10'){
            //   const heat_no1 =  '';
            //   const meterial_desc_back =  '';
              //const app_code =  '01';
              // popFreeEdit.setValue({ HEAT_NO1: heat_no1 });
              // popFreeEdit.setValue({ MATERIAL_DESC_BACK: meterial_desc_back });
              //popFreeEdit.setValue({ APP_CODE: app_code });
            //}
          }
          //先浇长度变化计算切废长度
          console.log('先浇长度变化');
          if (e.itemCode === 'MAT_LEN_2') {
            const mat_len_2 = popFreeEdit.getValue(e.itemCode);
            popFreeEdit.setValue({ MAT_LEN_2: mat_len_2 });
            console.log('mat_len_2', mat_len_2);
                const density = 7.85;
                console.log('density',density)
                const cutscorp_wt = parseFloat(
                                  (
                                    (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                  ).toFixed(3)
                                );
                popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                console.log('cutscorp_wt',cutscorp_wt);
          }
          //后浇长度变化计算切废长度
          // console.log('后浇长度变化');
          // if (e.itemCode === 'MAT_LEN_1') {
          //   const mat_len_1 = popFreeEdit.getValue(e.itemCode);
          //   popFreeEdit.setValue({ MAT_LEN_1: mat_len_1 });
          //   console.log('mat_len_1', mat_len_1);
          //       const density = 7.85;
          //       console.log('density',density)
          //       const cutscorp_wt = parseFloat(
          //                         (
          //                           (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
          //                           (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
          //                           (popFreeEdit.getValue(e.itemCode) / 1000) *
          //                           density
          //                         ).toFixed(3)
          //                       );
          //       popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
          //       console.log('cutscorp_wt',cutscorp_wt);
          // }
        });
        ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }
      }else{
        mainGridCheckedRow['MATERIAL_DESC_BACK'] = mainGridCheckedRow['SG_GRADE_1'];
        mainGridCheckedRow['HEAT_NO1'] = mainGridCheckedRow['BATCH'];
        //mainGridCheckedRow['PROD_TIME'] = mainGridCheckedRow['SLAB_CUT_TIME'];
        if(COMPLEX_DECIDE_CODE === '9'){
          mainGridCheckedRow['APP_CODE'] = '02';
          mainGridCheckedRow['MAT_LEN_1'] = mainGridCheckedRow['MAT_ACT_LEN'];
          const density = 7.85;
          mainGridCheckedRow['CUT_SCRAP_WT'] = parseFloat(
                            (
                              (mainGridCheckedRow['MAT_ACT_LEN']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_WIDTH']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_THICK']/ 1000) *
                              density
                            ).toFixed(3)
                                        );
        }else{
          mainGridCheckedRow['APP_CODE'] = '01';
        }
        //后浇带出先浇
        const eiInfo1 = new EI.EIInfo();
        const eiBlock1 = erFormHelper.getGridSelectRowsAsBlock('GridView3');
        eiBlock1.addColumn('FORE_BACK', '0');
        eiInfo1.addBlock(eiBlock1, '');
        console.log('eiInfo1', eiInfo1);
        const outInfo = await erFormHelper.callService(i_service_f9, eiInfo1);//标志为0，按照同炉号找同流的上一块板坯
        console.log('outInfo', outInfo);
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageWarning('无前浇次');
        }else{
        mainGridCheckedRow['HEAT_NO2'] = outInfo.getBlock(0).data[0]['BATCH'];
        mainGridCheckedRow['MATERIAL_DESC_FORE'] = outInfo.getBlock(0).data[0]['SG_GRADE_1']


        console.log('mainGridCheckedRow',mainGridCheckedRow);
  
        cs_OkClick = 'F3';
        i_proc_div = 'I';
        i_c_div = '0';
        console.log('i_proc_div', i_proc_div);
  
        popFreeEdit_pars(cs_OkClick);
        popFreeEdit.ReceiveData(mainGridCheckedRow, {
          //BATCH: true
          //HEAT_NO: true,
          //PRINT_NO: true
        })

        //碳钢自动计算切废重量
        popFreeEdit.setEvent('itemValueChanged', (e: any) => {
          //除四种原因外，其他原因不带出先浇，且默认无系统
          if (e.itemCode === 'CUT_SCRAP_REASON') {
            const cut_scrap_reason = popFreeEdit.getValue(e.itemCode);
            //popFreeEdit.setValue({ CUT_SCRAP_REASON: cut_scrap_reason });
            console.log('cut_scrap_reason', cut_scrap_reason);
            if(cut_scrap_reason !== '07' && cut_scrap_reason !== '08' && cut_scrap_reason !== '09' && cut_scrap_reason !== '10'){
              const heat_no2 =  '';
              const meterial_desc_fore =  '';
              const app_code = '01';
              popFreeEdit.setValue({ HEAT_NO2: heat_no2 });
              popFreeEdit.setValue({ MATERIAL_DESC_FORE: meterial_desc_fore });
              popFreeEdit.setValue({ APP_CODE: app_code });
            }
          }
          if(popFreeEdit.getValue('HEAT_NO2') > '0'){
            //先浇长度变化计算切废长度
            // console.log('先浇长度变化');
            // if (e.itemCode === 'MAT_LEN_2') {
            //   const mat_len_2 = popFreeEdit.getValue(e.itemCode);
            //   popFreeEdit.setValue({ MAT_LEN_2: mat_len_2 });
            //   console.log('mat_len_2', mat_len_2);
            //       const density = 7.85;
            //       console.log('density',density)
            //       const cutscorp_wt = parseFloat(
            //                         (
            //                           (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
            //                           (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
            //                           (popFreeEdit.getValue(e.itemCode) / 1000) *
            //                           density
            //                         ).toFixed(3)
            //                       );
            //       popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
            //       console.log('cutscorp_wt',cutscorp_wt);
            // }
          };
          
          
          //后浇长度变化计算切废长度
          console.log('后浇长度变化');
          if (e.itemCode === 'MAT_LEN_1') {
            const mat_len_1 = popFreeEdit.getValue(e.itemCode);
            popFreeEdit.setValue({ MAT_LEN_1: mat_len_1 });
            console.log('mat_len_1', mat_len_1);
                const density = 7.85;
                console.log('density',density)
                const cutscorp_wt = parseFloat(
                                  (
                                    (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                  ).toFixed(3)
                                );
                popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                console.log('cutscorp_wt',cutscorp_wt);
          }
        });
          ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
        }
        }
      };

    //F4点击事件：新增
    const F4_DO = async (e: any) => {
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView3', true)[0];
      const ST_NO = mainGridCheckedRow['ST_NO'];

      if (ST_NO.substring(0,1) === '2') {
        erFormHelper.messageWarning('请选择不锈钢坯！');
        return;
      }

      //不锈钢区分铬镍
          if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
            const grade_id = '镍钢';
            mainGridCheckedRow['GRADE_ID'] = grade_id;
            console.log('grade_id',grade_id);
          }else if(ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M'){
            const grade_id = '铬钢';
            mainGridCheckedRow['GRADE_ID'] = grade_id;
            console.log('grade_id',grade_id);
          }
      //mainGridCheckedRow['']
      mainGridCheckedRow['MATERIAL_DESC'] = mainGridCheckedRow['SG_GRADE_1'];
      //mainGridCheckedRow['PROD_TIME'] = mainGridCheckedRow['SLAB_CUT_TIME'];
      mainGridCheckedRow['MAT_LEN'] = mainGridCheckedRow['CUT_SCRAP_LEN'];
      const COMPLEX_DECIDE_CODE = mainGridCheckedRow['COMPLEX_DECIDE_CODE'];
      console.log('COMPLEX_DECIDE_CODE',COMPLEX_DECIDE_CODE);
      if(COMPLEX_DECIDE_CODE === '9'){
        mainGridCheckedRow['APP_CODE'] = '02';
        mainGridCheckedRow['MAT_LEN'] = mainGridCheckedRow['MAT_ACT_LEN'];
        if (ST_NO.substring(0,3) === '1A6' || ST_NO.substring(0,3)==='1A9') {
          const density = 7.95;
          console.log('density',density);
          mainGridCheckedRow['CUT_SCRAP_WT'] = parseFloat(
                            (
                              (mainGridCheckedRow['MAT_ACT_LEN']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_WIDTH']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_THICK']/ 1000) *
                              density
                            ).toFixed(3)
                                        );
        }else if (ST_NO.substring(0,2) === '1D' ) {
          const density = 7.8;
          console.log('density',density);
          console.log('111',mainGridCheckedRow['MAT_ACT_LEN']);
          console.log('222',mainGridCheckedRow['MAT_ACT_WIDTH']);
          console.log('333',mainGridCheckedRow['MAT_ACT_THICK']);


          mainGridCheckedRow['CUT_SCRAP_WT'] = parseFloat(
                            (
                              (mainGridCheckedRow['MAT_ACT_LEN']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_WIDTH']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_THICK']/ 1000) *
                              density
                            ).toFixed(3)
                                        );
        }else if (ST_NO.substring(0,1) === '1' ) {
          const density = 7.9;
          console.log('density',density);
          console.log('111',mainGridCheckedRow['MAT_ACT_LEN']);
          console.log('222',mainGridCheckedRow['MAT_ACT_WIDTH']);
          console.log('333',mainGridCheckedRow['MAT_ACT_THICK']);                    
          mainGridCheckedRow['CUT_SCRAP_WT'] = parseFloat(
                            (
                              (mainGridCheckedRow['MAT_ACT_LEN']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_WIDTH']/ 1000) *
                              (mainGridCheckedRow['MAT_ACT_THICK']/ 1000) *
                              density
                            ).toFixed(3)
                                        );
        }
      }else{
        mainGridCheckedRow['APP_CODE'] = '01';
      }
      
      console.log('mainGridCheckedRow',mainGridCheckedRow);
      cs_OkClick = 'F4';
      i_proc_div = 'I';
      i_c_div = '1';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
        HEAT_NO: true,
        PRINT_NO: true
      })

      //不锈钢自动计算切废重量
      popFreeEdit.setEvent('itemValueChanged', (e: any) => {
        if (e.itemCode === 'MAT_LEN') {
          const mat_len = popFreeEdit.getValue(e.itemCode);
          popFreeEdit.setValue({ MAT_LEN: mat_len });
          console.log('mat_len', mat_len);
          if (ST_NO.substring(0,3) === '1A6' || ST_NO.substring(0,3)==='1A9') {
              console.log('ST_NO',ST_NO.substring(0,3));
              const density = 7.95;
              console.log('density',density);
              const cutscorp_wt = parseFloat(
                                (
                                  (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                  (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);

          }else if (ST_NO.substring(0,2) === '1D' ) {
              console.log('ST_NO',ST_NO.substring(0,2));
              const density = 7.8;
              console.log('density',density)
              const cutscorp_wt = parseFloat(
                                (
                                  (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                  (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);
          }else if (ST_NO.substring(0,1) === '1' ) {
              console.log('ST_NO',ST_NO.substring(0,1));
              const density = 7.9;
              console.log('density',density)
              const cutscorp_wt = parseFloat(
                                (
                                  (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                  (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);
          }
        }
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    //F5点击事件：修改
    const F5_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请选择一条需要修改的碳钢废品明细记录！');
        return;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true)[0];
      cs_OkClick = 'F5';
      i_proc_div = 'U';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
        MAT_NO: true,
        PRINT_NO: true
      });
      //碳钢自动计算切废重量
      popFreeEdit.setEvent('itemValueChanged', (e: any) => {
        //先浇长度变化计算切废长度
        console.log('先浇长度变化');
        if (e.itemCode === 'MAT_LEN_2') {
          const mat_len_2 = popFreeEdit.getValue(e.itemCode);
          popFreeEdit.setValue({ MAT_LEN_2: mat_len_2 });
          console.log('mat_len_2', mat_len_2);
              const density = 7.85;
              console.log('density',density)
              const cutscorp_wt = parseFloat(
                                (
                                  (mainGridCheckedRow['MAT_ACT_WIDTH'] / 1000) *
                                  (mainGridCheckedRow['MAT_ACT_THICK'] / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);
        }
        
        //后浇长度变化计算切废长度
        console.log('后浇长度变化');
        if (e.itemCode === 'MAT_LEN_1') {
          const mat_len_1 = popFreeEdit.getValue(e.itemCode);
          popFreeEdit.setValue({ MAT_LEN_1: mat_len_1 });
          console.log('mat_len_1', mat_len_1);
              const density = 7.85;
              console.log('density',density)
              const cutscorp_wt = parseFloat(
                                (
                                  (mainGridCheckedRow['MAT_ACT_WIDTH'] / 1000) *
                                  (mainGridCheckedRow['MAT_ACT_THICK'] / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);
        }
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    const F6_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView2').length === 0) {
        erFormHelper.messageWarning('请选择一条需要修改的不锈钢废品明细记录！');
        return;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView2', true)[0];
      const ST_NO = mainGridCheckedRow['ST_NO'];
      cs_OkClick = 'F6';
      i_proc_div = 'U';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
        MAT_NO: true,
        PRINT_NO: true
      });
       //不锈钢自动计算切废重量
      popFreeEdit.setEvent('itemValueChanged', (e: any) => {
        if (e.itemCode === 'MAT_LEN') {
          const mat_len = popFreeEdit.getValue(e.itemCode);
          popFreeEdit.setValue({ MAT_LEN: mat_len });
          console.log('mat_len', mat_len);
          if (ST_NO.substring(0,3) === '1A6' || ST_NO.substring(0,3)==='1A9') {
              console.log('ST_NO',ST_NO.substring(0,3));
              const density = 7.95;
              console.log('density',density);
              const cutscorp_wt = parseFloat(
                                (
                                  (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                  (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);

          }else if (ST_NO.substring(0,2) === '1D' ) {
              console.log('ST_NO',ST_NO.substring(0,2));
              const density = 7.8;
              console.log('density',density)
              const cutscorp_wt = parseFloat(
                                (
                                  (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                  (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);
          }else if (ST_NO.substring(0,1) === '1' ) {
              console.log('ST_NO',ST_NO.substring(0,1));
              const density = 7.9;
              console.log('density',density)
              const cutscorp_wt = parseFloat(
                                (
                                  (popFreeEdit.getValue('MAT_ACT_WIDTH') / 1000) *
                                  (popFreeEdit.getValue('MAT_ACT_THICK') / 1000) *
                                  (popFreeEdit.getValue(e.itemCode) / 1000) *
                                  density
                                ).toFixed(3)
                              );
              popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
              console.log('cutscorp_wt',cutscorp_wt);
          }
        }
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    const F7_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (
        erFormHelper.getGridCheckedRows('GridView1').length === 0 &&
        erFormHelper.getGridCheckedRows('GridView2').length === 0 &&
        erFormHelper.getGridCheckedRows('GridView6').length === 0
      ) {
        erFormHelper.messageWarning('请选择一条需要删除的记录！');
        return;
      }

      if (erFormHelper.getGridCheckedRows('GridView1').length !== 0) {
        inInfo.addBlock(
          erFormHelper.getGridSelectRowsAsBlock('GridView1', {
            PROC_DIV: 'D',
            FACTORY_DIV: i_factory_div
          }),
          'PARA'
        );
        console.log('1',);

      }

      if (erFormHelper.getGridCheckedRows('GridView2').length !== 0) {
        inInfo.addBlock(
          erFormHelper.getGridSelectRowsAsBlock('GridView2', {
            PROC_DIV: 'D',
            FACTORY_DIV: i_factory_div
          }),
          'PARA'
        );
        console.log('2',);

      }

      if (erFormHelper.getGridCheckedRows('GridView6').length !== 0) {
        inInfo.addBlock(
          erFormHelper.getGridSelectRowsAsBlock('GridView6', {
            PROC_DIV: 'D',
            FACTORY_DIV: i_factory_div
          }),
          'PARA'
        );
        console.log('3',);

      }

      const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除, 是否继续？');
      if (!mes_res) {
        return false;
      }

      if (erFormHelper.getGridCheckedRows('GridView1').length !== 0) {
        const outInfo = await erFormHelper.callService(i_service_f7, inInfo, false, true);
        if (outInfo.sys.status >= 0) {
          erFormHelper.messageSuccess('操作成功！');
        }
      }

      if (erFormHelper.getGridCheckedRows('GridView2').length !== 0) {
        const outInfo = await erFormHelper.callService(i_service_f7, inInfo, false, true);
        if (outInfo.sys.status >= 0) {
          erFormHelper.messageSuccess('操作成功！');
        }
      }

      if (erFormHelper.getGridCheckedRows('GridView6').length !== 0) {
        const outInfo = await erFormHelper.callService(i_service_f8, inInfo, false, true);
        if (outInfo.sys.status >= 0) {
          erFormHelper.messageSuccess('操作成功！');
        }
      }

      query_main();
      query();
      query_ly();
    };

    //F8点击事件：新增利用增值品
    const F8_DO = async (e: any) => {
      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView3', true)[0];
      console.log('mainGridCheckedRow',mainGridCheckedRow);
      cs_OkClick = 'F8';
      i_proc_div = 'I';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
      })
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    //F9点击事件：增值品修改
    const F9_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows('GridView6').length === 0) {
        erFormHelper.messageWarning('请选择一条需要修改的利用增值品明细记录！');
        return;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView6', true)[0];
      cs_OkClick = 'F9';
      i_proc_div = 'U';
      popFreeEdit_pars(cs_OkClick);
      popFreeEdit.ReceiveData(mainGridCheckedRow, {
      });
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      LayoutGroupFilter,
      gridView_tab1,
      gridView_tab2,
      F2_DO,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      handleTabChange,
      tabActiveKey,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F7_DO,
      F8_DO,
      F9_DO
    };
  }
});
