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
    name: 'MMSM39S2N',
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
    const gridView_tab2 = ref('gridView_m');
    let LayoutGroupFilter = 'LayoutGroupFilter';

    const initializeService = '';
    const tabActiveKey = ref('tab1');
    let i_proc_div = '';
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
    const i_service_f2 = 'mmsm39_inq';
    const i_service_f3 = 'mmsm39f3_pro';
    const i_service_f4 = 'mmsm39f3_pro';
    const i_service_f5 = 'mmsm39f3_pro';
    const i_factory_div = 'S2N';

    // 画面相关数据初始化
    const initializePage = async() => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
            if (initialResult.flag >= 0) {
                // 画面工具类初始化成功后将画面渲染条件设置为1
                initializeFlag.value = 1;

                // 回调函数获取控件信息及设置定义事件等操作
                nextTick(() => { });
            } else {
                erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
            }
    };

        onMounted(() => { });
    //grid实例
    const erGrid1Ready = () => {
            grid_main = erFormHelper.getGrid(gridView_tab1.value);
            erFormHelper.setGridToolbarVisible(gridView_tab1.value, {
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
            }
        };

    //自定义模板参数
    const popFreeEdit_pars = async(Click_name: string) => {
            // popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM39_LAYOUT_DIALOG');
            if (cs_OkClick === 'F3') {
                //popFreeEdit.AllowEidt = true;
                popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM39_LAYOUT_DIALOG1');
            }
            if (cs_OkClick === 'F4') {
                popFreeEdit = new ER.PopFreeHelper(formPartition, 'MMSM_DIALOG', 'MMSM39_LAYOUT_DIALOG2');
            }
        };

    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async(e: PopFreeReturnInfo) => {
            console.log('111');
      let i_service: any;
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

            if (cs_OkClick === 'F3') {
                i_service = i_service_f3;
            } else if (cs_OkClick === 'F4') {
                i_service = i_service_f4;
            }

            inInfo.addBlock(
                erFormHelper.convertModelAsBlock(e.dataModel, {
                    FACTORY_DIV: i_factory_div,
                    PRO_DIV: i_proc_div
                }),
                'PARA'
                );

            if (inInfo.getBlock('PARA').data[0]['MAT_NO'] == '') {
                erFormHelper.messageWarning('材料号不能为空!');
                return;
      }
      const mainGridCheckedRow = erFormHelper.getGridCurrentRow('GridView1');
            inInfo.addBlock(mainGridCheckedRow, 'TMMSM01');

            // inInfo.addBlock(
            //   erFormHelper.convertModelAsBlock(e.dataModel, {

            // CUT_BEFORE_LEN: e.dataModel.MAT_ACT_LEN,
            //   }),
            //   'CUT_BEFORE'
            // );

            console.log('inInfo', inInfo);

            if ((popFreeEdit.getValue('CUT_BEFORE_WT') - popFreeEdit.getValue('CUT_AFTER_WT')) < 0) {
                erFormHelper.messageWarning('切后重量超过切前重量，请重新修改切后长度！');
            } else {
                outInfo = await erFormHelper.callService(i_service, inInfo, false, true, true);
                if (outInfo?.sys.status >= 0) {
                    erFormHelper.messageSuccess('操作成功！');
                }
            }


            query();
        };

    //layout值发生改变事件

    const F2_DO = async() => {
            query_main();
            query();
        };

    const query_main = async() => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
            eiBlock.addColumn('GRID_TAB', 'TMMSM01'); //传表名
            eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService(i_service_f2, eiInfo);

            if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
                return;
            } else {
                erFormHelper.mergeDataToGrid(outInfo, gridView_tab1.value);
            }
    };

    const query = async() => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(LayoutGroupFilter);
            eiBlock.addColumn('GRID_TAB', 'TMMSM39'); //传表名
            eiInfo.addBlock(eiBlock, '');
      const outInfo = await erFormHelper.callService(i_service_f2, eiInfo);

            if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
                return;
            } else {
                erFormHelper.mergeDataToGrid(outInfo, gridView_tab2.value);
            }
    };

    //F3点击事件：新增
    const F3_DO = async(e: any) => {
      const inInfo = new EI.EIInfo();
            if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
                erFormHelper.messageWarning('请选择一条需要新增的铸坯记录！');
                return;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true)[0];
      const ST_NO = mainGridCheckedRow['ST_NO'];
            if (mainGridCheckedRow.RCV_MAT_FLAG.trim() !== 'S') {
                erFormHelper.messageWarning('未收货成功，不能进行该操作!');
            } else {
                //获取系统当前时间
                mainGridCheckedRow['RECUT_DATE'] = new Date();
                console.log('RECUT_DATE', mainGridCheckedRow['RECUT_DATE']);
                mainGridCheckedRow['CUT_BEFORE_LEN'] = mainGridCheckedRow['MAT_ACT_LEN'];
                mainGridCheckedRow['CUT_AFTER_LEN'] = mainGridCheckedRow['MAT_ACT_LEN'];
                mainGridCheckedRow['CUT_BEFORE_WIDTH'] = mainGridCheckedRow['MAT_ACT_WIDTH'];
                mainGridCheckedRow['CUT_AFTER_WIDTH'] = mainGridCheckedRow['MAT_ACT_WIDTH'];
                mainGridCheckedRow['CUT_BEFORE_WT'] = mainGridCheckedRow['MAT_ACT_WT'];
                mainGridCheckedRow['CUT_BEFORE_THICK'] = mainGridCheckedRow['MAT_ACT_THICK'];
                mainGridCheckedRow['CUT_AFTER_THICK'] = mainGridCheckedRow['MAT_ACT_THICK'];
                //起始切后重量根据长宽高密度计算
                //mainGridCheckedRow['CUT_AFTER_WT'] = mainGridCheckedRow['MAT_ACT_WT'];
                if (ST_NO.substring(0, 3) === '1A6' || ST_NO.substring(0, 3) === '1A9') {
                    console.log('ST_NO', ST_NO.substring(0, 3));
          const density = 7.95;
                    console.log('density', density);
                    mainGridCheckedRow['CUT_AFTER_WT'] = parseFloat(
                        (
                            (mainGridCheckedRow['CUT_AFTER_LEN'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_WIDTH'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_THICK'] / 1000) *
                            density
                            ).toFixed(3)
                        );
                    console.log('CUT_AFTER_WT', mainGridCheckedRow['CUT_AFTER_WT']);

                } else if (ST_NO.substring(0, 2) === '1D') {
                    console.log('ST_NO', ST_NO.substring(0, 2));
          const density = 7.8;
                    console.log('density', density)
          mainGridCheckedRow['CUT_AFTER_WT'] = parseFloat(
                        (
                            (mainGridCheckedRow['CUT_AFTER_LEN'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_WIDTH'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_THICK'] / 1000) *
                            density
                            ).toFixed(3)
                        );
                    console.log('CUT_AFTER_WT', mainGridCheckedRow['CUT_AFTER_WT']);

                } else if (ST_NO.substring(0, 1) === '1') {
                    console.log('ST_NO', ST_NO.substring(0, 1));
          const density = 7.9;
                    console.log('density', density)
          mainGridCheckedRow['CUT_AFTER_WT'] = parseFloat(
                        (
                            (mainGridCheckedRow['CUT_AFTER_LEN'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_WIDTH'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_THICK'] / 1000) *
                            density
                            ).toFixed(3)
                        );
                    console.log('CUT_AFTER_WT', mainGridCheckedRow['CUT_AFTER_WT']);

                } else if (ST_NO.substring(0, 1) === '2') {
                    console.log('ST_NO', ST_NO.substring(0, 1));
          const density = 7.85;
                    console.log('density', density)
          mainGridCheckedRow['CUT_AFTER_WT'] = parseFloat(
                        (
                            (mainGridCheckedRow['CUT_AFTER_LEN'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_WIDTH'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_THICK'] / 1000) *
                            density
                            ).toFixed(3)
                        );
                    console.log('CUT_AFTER_WT', mainGridCheckedRow['CUT_AFTER_WT']);
                } else if (ST_NO.substring(0, 1) === '3') {
                    console.log('ST_NO', ST_NO.substring(0, 1));
          const density = 7.85;
                    console.log('density', density)
          mainGridCheckedRow['CUT_AFTER_WT'] = parseFloat(
                        (
                            (mainGridCheckedRow['CUT_AFTER_LEN'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_WIDTH'] / 1000) *
                            (mainGridCheckedRow['CUT_AFTER_THICK'] / 1000) *
                            density
                            ).toFixed(3)
                        );
                    console.log('CUT_AFTER_WT', mainGridCheckedRow['CUT_AFTER_WT']);
                }
                //切废重量保留3位小数
                mainGridCheckedRow['CUT_SCRAP_WT'] = parseFloat((mainGridCheckedRow['CUT_BEFORE_WT'] - mainGridCheckedRow['CUT_AFTER_WT']).toFixed(3))
        //popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
        console.log('CUT_SCRAP_WT', mainGridCheckedRow['CUT_SCRAP_WT']);
                // if(cutscorp_wt < 0){
                //   erFormHelper.messageWarning('切后重量超过切前重量，请重新修改切后长度！');
                // }

                //mainGridCheckedRow['PROD_SHIFT_GROUP'] = ;
                console.log('mainGridCheckedRow', mainGridCheckedRow);


                cs_OkClick = 'F3';
                i_proc_div = 'I';
                popFreeEdit_pars(cs_OkClick);
                popFreeEdit.ReceiveData(mainGridCheckedRow, {
                    MAT_NO: true,
                    PRINT_NO: true
                })
        popFreeEdit.setEvent('itemValueChanged', (e: any) => {
                    //长度变化计算切废长度
                    if (e.itemCode === 'CUT_AFTER_LEN') {
            const cutscorp_len = popFreeEdit.getValue('CUT_BEFORE_LEN') - popFreeEdit.getValue(e.itemCode);
                        popFreeEdit.setValue({ CUT_SCRAP_LEN: cutscorp_len });
                        console.log('cutscorp_len', cutscorp_len);

                        //根据修改后的切后长度计算切后重量
                        if (ST_NO.substring(0, 3) === '1A6' || ST_NO.substring(0, 3) === '1A9') {
                            console.log('ST_NO', ST_NO.substring(0, 3));
              const density = 7.95;
                            console.log('density', density);
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                            // const wt_mat2 = 
                            //   (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
                            //   (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
                            //   (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
                            // erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_2', wt_mat2);
                            // console.log('wt_mat2',wt_mat2);

                        } else if (ST_NO.substring(0, 2) === '1D') {
                            console.log('ST_NO', ST_NO.substring(0, 2));
              const density = 7.8;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);

                        } else if (ST_NO.substring(0, 1) === '1') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.9;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);

                        } else if (ST_NO.substring(0, 1) === '2') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.85;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                        } else if (ST_NO.substring(0, 1) === '3') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.85;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
            }
            //切废重量保留3位小数
            const cutscorp_wt = parseFloat((popFreeEdit.getValue('CUT_BEFORE_WT') - popFreeEdit.getValue('CUT_AFTER_WT')).toFixed(3))
            popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                        console.log('cutscorp_wt', cutscorp_wt);
            // if(cutscorp_wt < 0){
            //   erFormHelper.messageWarning('切后重量超过切前重量，请重新修改切后长度！');
            // }
          }

                    //宽度变化计算切后重量
                    if (e.itemCode === 'CUT_AFTER_WIDTH') {
            const cutscorp_width = popFreeEdit.getValue('CUT_BEFORE_WIDTH') - popFreeEdit.getValue(e.itemCode);
                        popFreeEdit.setValue({ CUT_SCRAP_WIDTH: cutscorp_width });
                        console.log('cutscorp_width', cutscorp_width);

                        //根据修改后的切后长度计算切后重量
                        if (ST_NO.substring(0, 3) === '1A6' || ST_NO.substring(0, 3) === '1A9') {
                            console.log('ST_NO', ST_NO.substring(0, 3));
              const density = 7.95;
                            console.log('density', density);
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                        } else if (ST_NO.substring(0, 2) === '1D') {
                            console.log('ST_NO', ST_NO.substring(0, 2));
              const density = 7.8;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                        } else if (ST_NO.substring(0, 1) === '1') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.9;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);

                        } else if (ST_NO.substring(0, 1) === '2') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.85;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                        } else if (ST_NO.substring(0, 1) === '3') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.85;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_THICK') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
            }
            //切废重量保留3位小数
            const cutscorp_wt = parseFloat((popFreeEdit.getValue('CUT_BEFORE_WT') - popFreeEdit.getValue('CUT_AFTER_WT')).toFixed(3));
                        popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                        console.log('cutscorp_wt', cutscorp_wt);

                        //切废宽度
                        if (e.itemCode === 'CUT_AFTER_WIDTH') {
              const cutscorp_width = popFreeEdit.getValue('CUT_BEFORE_WIDTH') - popFreeEdit.getValue(e.itemCode);
                            popFreeEdit.setValue({ CUT_SCRAP_WIDTH: cutscorp_width });
                            console.log('cutscorp_width', cutscorp_width);
            }
                        //切废重量
                        if (e.itemCode === 'CUT_AFTER_WT') {
              const cutscorp_wt = popFreeEdit.getValue('CUT_BEFORE_WT') - popFreeEdit.getValue(e.itemCode);
                            popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                            console.log('cutscorp_wt', cutscorp_wt);
            }
          }

                    //厚度变化计算切后重量
                    if (e.itemCode === 'CUT_AFTER_THICK') {
            const cutscorp_thick = popFreeEdit.getValue('CUT_BEFORE_THICK') - popFreeEdit.getValue(e.itemCode);
                        popFreeEdit.setValue({ CUT_SCRAP_THICK: cutscorp_thick });
                        console.log('cutscorp_thick', cutscorp_thick);

                        //根据修改后的切后长度计算切后重量
                        if (ST_NO.substring(0, 3) === '1A6' || ST_NO.substring(0, 3) === '1A9') {
                            console.log('ST_NO', ST_NO.substring(0, 3));
              const density = 7.95;
                            console.log('density', density);
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                        } else if (ST_NO.substring(0, 2) === '1D') {
                            console.log('ST_NO', ST_NO.substring(0, 2));
              const density = 7.8;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);

                        } else if (ST_NO.substring(0, 1) === '1') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.9;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                        } else if (ST_NO.substring(0, 1) === '2') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.85;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            // const cut_after_wt = ((popFreeEdit.getValue('CUT_AFTER_WIDTH')/1000) *
                            // (popFreeEdit.getValue('CUT_AFTER_THICK')/1000) *
                            // (popFreeEdit.getValue(e.itemCode)/1000) * density).toString().slice(0,5);
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
                        } else if (ST_NO.substring(0, 1) === '3') {
                            console.log('ST_NO', ST_NO.substring(0, 1));
              const density = 7.85;
                            console.log('density', density)
              const cut_after_wt = parseFloat(
                                (
                                    (popFreeEdit.getValue('CUT_AFTER_WIDTH') / 1000) *
                                    (popFreeEdit.getValue('CUT_AFTER_LEN') / 1000) *
                                    (popFreeEdit.getValue(e.itemCode) / 1000) *
                                    density
                                    ).toFixed(3)
                                );
                            popFreeEdit.setValue({ CUT_AFTER_WT: cut_after_wt });
                            console.log('cut_after_wt', cut_after_wt);
            }
            //切废重量保留3位小数
            const cutscorp_wt = parseFloat((popFreeEdit.getValue('CUT_BEFORE_WT') - popFreeEdit.getValue('CUT_AFTER_WT')).toFixed(3));
                        popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                        console.log('cutscorp_wt', cutscorp_wt);

                        //切废宽度
                        if (e.itemCode === 'CUT_AFTER_WIDTH') {
              const cutscorp_width = popFreeEdit.getValue('CUT_BEFORE_WIDTH') - popFreeEdit.getValue(e.itemCode);
                            popFreeEdit.setValue({ CUT_SCRAP_WIDTH: cutscorp_width });
                            console.log('cutscorp_width', cutscorp_width);
            }
                        //切废重量
                        if (e.itemCode === 'CUT_AFTER_WT') {
              const cutscorp_wt = popFreeEdit.getValue('CUT_BEFORE_WT') - popFreeEdit.getValue(e.itemCode);
                            popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                            console.log('cutscorp_wt', cutscorp_wt);
            }
          }

                    //切废重量根据切后重量变化
                    if (e.itemCode === 'CUT_AFTER_WT') {
            const cutscorp_wt = parseFloat((popFreeEdit.getValue('CUT_BEFORE_WT') - popFreeEdit.getValue(e.itemCode)).toFixed(3));
                        popFreeEdit.setValue({ CUT_SCRAP_WT: cutscorp_wt });
                        console.log('cutscorp_wt', cutscorp_wt);
          }
                });
                ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
            };
    };

    //F4点击事件：修改
    const F4_DO = async(e: any) => {
      const inInfo = new EI.EIInfo();
            if (erFormHelper.getGridCheckedRows('gridView_m').length === 0) {
                erFormHelper.messageWarning('请选择一条需要修改的改切记录！');
                return;
      }

      //获取选中行信息
      const mainGridCheckedRow = erFormHelper.getGridCheckedRows('gridView_m', true)[0];
            cs_OkClick = 'F4';
            i_proc_div = 'U';
            popFreeEdit_pars(cs_OkClick);
            popFreeEdit.ReceiveData(mainGridCheckedRow, {
                MAT_NO: true,
                PRINT_NO: true
            });
            ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    //F5点击事件：删除
    const F5_DO = async(e: any) => {
      const inInfo = new EI.EIInfo();
            if (erFormHelper.getGridCheckedRows('gridView_m').length === 0) {
                erFormHelper.messageWarning('请选择一条需要删除的记录！');
                return;
            }

            inInfo.addBlock(
                erFormHelper.getGridSelectRowsAsBlock('gridView_m', {
                    PRO_DIV: 'D',
                    FACTORY_DIV: i_factory_div
                }),
                'PARA'
                );

      const mes_res = await erFormHelper.messageConfirm('选中的记录将被永久删除, 是否继续？');
            if (!mes_res) {
                return false;
      }

      const outInfo = await erFormHelper.callService(i_service_f5, inInfo, false, true);
            if (outInfo.sys.status >= 0) {
                erFormHelper.messageSuccess('操作成功！');
            }
            query();
    };

     //F5点击事件：确认记录
    const F6_DO = async(e: any) => {
      const inInfo = new EI.EIInfo();
            if (erFormHelper.getGridCheckedRows('gridView_m').length !== 1) {
                erFormHelper.messageWarning('请选择一条需要确认的记录！');
                return;
            }



            inInfo.addBlock(
                erFormHelper.getGridSelectRowsAsBlock('gridView_m', {
                    PRO_DIV: 'C',
                    FACTORY_DIV: i_factory_div
                }),
                'PARA'
                );

      const mes_res = await erFormHelper.messageConfirm('是否按选中的记录上传实绩？');
            if (!mes_res) {
                return false;
      }

      const outInfo = await erFormHelper.callService('mmsm39f6_pro', inInfo, false, true);
            if (outInfo.sys.status >= 0) {
                erFormHelper.messageSuccess('操作成功！');
            }
            query();
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
      handleTabChange,
      tabActiveKey,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO
    };
  }
});
