import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick, Ref } from 'vue';
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
import { PopQueryReturnInfo, PopFreeReturnInfo } from 'ERX/er-type';
import { CellValueChangedEvent, Logger } from '@ag-grid-community/core';
import { log } from 'console';
import MMSMACSHPOPS2N from '../MMSMACSHPOPS2N/MMSMACSHPOPS2N.vue';
import xrEfDialog from 'EFX/xrEfDialog';

export default defineComponent({
    name: 'MMSMACSHS2N',
    components: {
    xrEfDialog,
    MMSMACSHPOPS2N,
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    ErPopFree,
    ErPopQuery
  },
    setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    let i_form_ename = ''; // 低代码配置画面布局名
    let formPartition: string;
    let formName: '';
    let PROGRAM_NAME: string;
    const initializeService = '';

    // 变量定义
    const initializeFlag = ref(0);
    //let popFreeEdit: ER.PopQueryHelper;
    let gridView1: any;
    const grid_view_1 = ref('GridView1');
    let gridView2: any;
    const grid_view_2 = ref('GridView2');
    let gridView3: any;
    const grid_view_3 = ref('GridView3');
    const gridToolbar: Ref <any[]> = ref([]);
    let cs_OkClick = '';
    const i_service_f4 = 'mmsmacshf4_pro';
    let gridApi: any;
    let timeId: any;
    const dialogFormName = ref(''); // 弹出画面的画面名
    const parentInfo = ref({});

    //let popFreeEdit: ER.PopQueryHelper;

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
            //popFreeEdit = new ER.PopQueryHelper(formPartition, 'MMSMACSHPOPS2N', initializeService);
            initializePage();
        };
    const dialogVisible = ref<boolean>(false);

    const erFormHelper: ER.FormHelper = new ER.FormHelper();

    // 画面相关数据初始化
    const initializePage = async() => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, i_form_ename, initializeService);
            if (initialResult.flag >= 0) {
                // 画面工具类初始化成功后将画面渲染条件设置为1
                initializeFlag.value = 1;
                InitialToolbar();

                // 回调函数获取控件信息及设置定义事件等操作
                nextTick(() => {
                    // 获取画面上的主要控件信息
                    //设置grid不可编辑
                    erFormHelper.setGridEditable('GridView1', false);
                    erFormHelper.setGridEditable('GridView2', false);
                    setStartTimer();
                });
            } else {
                erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
            }
    };

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {
            /* gridToolbar.value = erFormHelper.getGridToolbar([
              { name: 'excel', visible: true },
              {
                name: 'addrow',
                visible: false
              },
              { name: 'copyrow', visible: false },
              { name: 'delete', visible: false }
              // { name: 'save', visible: false },
              // { name: 'cancel', visible: false }
            ]); */
        };

    const setToolbarVisible = (configId: string, visible: boolean) => {
            erFormHelper.setGridToolbarVisible(configId, {
                addrow: visible,
                copyrow: visible,
                delete: visible
            });
        };

    //修改时事件回调的函数
    const cellValueChangedHandler = (e: CellValueChangedEvent) => {
            gridApi.removeEventListener('cellValueChanged', cellValueChangedHandler);
            //e.node.setDataValue('', '');
            // e.oldValue为旧值
            // e.newValue为新值
            // e.colDef.field为当前点击单元格的列名
            // e.rowIndex为当前点击单元格的行号
            // e.type为当前点击的类型
            //const toolbarPanel = gridApi.value.getStatusPanel('');
            if (e.colDef.field == 'RECV_MAT_TIME') {
        //F3收货时修改收货时刻
        const selectNode = gridApi.getSelectedNodes();
                console.log('4356', selectNode, e, e.data, e.colDef.field);
                selectNode.forEach((row: any) => {
                    console.log('123r254', row.data, row.setDataValue('RECV_MAT_TIME', e.newValue));
                });
      }

            //F6余材原因录入 批量录入
            if (e.colDef.field == 'REMAINDER_REASON') {
        const selectNode = gridApi.getSelectedNodes();
                console.log('4356', selectNode, e, e.data, e.colDef.field);
                selectNode.forEach((row: any) => {
                    console.log('123r254', row.data, row.setDataValue('REMAINDER_REASON', e.newValue));
                });
      }

            if (e.colDef.field == 'GRINDING_FLAG') {
        const selectNode = gridApi.getSelectedNodes();
                console.log('4356', selectNode, e, e.data, e.colDef.field);
                selectNode.forEach((row: any) => {
                    console.log('123r254', row.data, row.setDataValue('GRINDING_FLAG', e.newValue));
                });
      }

            if (e.colDef.field == 'GRIND_REASON') {
        const selectNode = gridApi.getSelectedNodes();
                console.log('4356', selectNode, e, e.data, e.colDef.field);
                selectNode.forEach((row: any) => {
                    console.log('123r254', row.data, row.setDataValue('GRIND_REASON', e.newValue));
                });
      }

            //存在修改钢种，修改钢种时，牌号和SLAB_NO和喷印号都变
            //修改钢种只在盘库画面
            /* if (e.colDef.field == 'ST_NO') {
              const selectNode = gridApi.getSelectedNodes();
              console.log('4356', selectNode, e, e.data, e.colDef.field);

              selectNode.forEach((row: any) => {
                console.log('123r254', row.data, row.setDataValue('ST_NO', e.newValue));
                console.log(
                  'BBBB',
                  row.data,
                  row.setDataValue(
                    'PRINT_NO',
                    row.data.PRINT_NO.substring(0, 8) + e.newValue + row.data.PRINT_NO.substring(14)
                  )
                );
                console.log(
                  'cccc',
                  row.data,
                  row.setDataValue(
                    'SLAB_NO',
                    row.data.PRINT_NO.substring(0, 8) + e.newValue + row.data.PRINT_NO.substring(14)
                  )
                );
              });
            } */

            gridApi.addEventListener('cellValueChanged', cellValueChangedHandler);
        };

    //grid实例
    const erGrid1Ready = (e: any) => {
            gridApi = e.api;
            gridApi.addEventListener('cellValueChanged', cellValueChangedHandler);

            gridView1 = erFormHelper.getGrid(grid_view_1.value);
            gridView1.gridOptions.getRowStyle = (params: any) => {
                /* if (
                    (params.data.MEND_FLAG.toString().trim() != '' || params.data.MEND_FLAG.toString().trim() != '0') &&
                    params.data.MEND_BEFORE_WEIGHT != 0 &&
                    params.data.PRODUTE_CAL_WT != 0 &&
                    (params.data.PRODUTE_CAL_WT - params.data.MEND_BEFORE_WEIGHT > 0.5 ||
                      params.data.MEND_BEFORE_WEIGHT - params.data.PRODUTE_CAL_WT > 0.5)
                  ) {
                    return {
                      fontweight: 'blod',
                      background: '#A9F5A9'
                    };
                  } else if (
                    (params.data.PRODUTE_CAL_WT - params.data.MAT_ACT_WT > 0.5 ||
                      params.data.MAT_ACT_WT - params.data.PRODUTE_CAL_WT > 0.5) &&
                    params.data.MAT_ACT_WT != 0 &&
                    params.data.PRODUTE_CAL_WT != 0
                  ) {
                    //重量不在范围的为绿色
                    return {
                      fontweight: 'blod',
                      background: '#A9F5A9'
                    };
                  } */

                if ((params.data.PRODUTE_CAL_WT - params.data.MAT_ACT_WT > 0.5 ||
                    params.data.MAT_ACT_WT - params.data.PRODUTE_CAL_WT > 0.5) &&
                    params.data.MAT_ACT_WT != 0 &&
                    params.data.PRODUTE_CAL_WT != 0) {
                    //封锁状态颜色为绿色
                    return {
                        fontweight: 'blod',
                        background: '#A9F5A9'
                    };
                }
                if (params.data.HOLD_FLAG.toString().trim() != '0') {
                    //封锁状态颜色为红色
                    return {
                        fontweight: 'blod',
                        background: '#DF3A01'
                    };
                }

                //调拨走的  紫色
                if (params.data.C_STATESIGN.toString().trim() == '1') {
                    return {
                        fontweight: 'blod',
                        background: '#ECCEF5'
                    };
                }
                if (params.data.MEND_FLAG.toString().trim() != '0' && params.data.MEND_FLAG.toString().trim() != '') {
                    /*  //判废  综合判定代码为4  显示红色
                  if (params.data.COMPLEX_DECIDE_CODE.toString().trim() == '4') {
                    return {
                      fontweight: 'blod',
                      background: '#F78084'
                    };
                  } */
                    //修磨的为橘红色
                    return {
                        fontweight: 'blod',
                        background: '#FE9A2E'
                    };
                }
                /*  if (params.data.ORDER_NO.toString().trim() === '') {
                  //余材状态颜色为黄色
                  return {
                    fontweight: 'blod',
                    background: 'yellow'
                  };
                } */

                if (params.data.RCV_MAT_FLAG.toString().trim() === 'N') {
                    //未收货颜色为黄色
                    return {
                        fontweight: 'blod',
                        background: 'yellow'
                    };
                }
                if (params.data.RCV_MAT_FLAG.toString().trim() === 'S') {
                    //收货后状态颜色为蓝色
                    return {
                        fontweight: 'blod',
                        background: '#7FBFF5'
                    };
                }
            };
            erFormHelper.setGridEditable(grid_view_1.value, false);
            erFormHelper.setGridToolbarVisible(grid_view_1.value, {
                addrow: false,
                copyrow: false,
                excel: true
            });
        };

    const erGrid2Ready = () => {
            gridView2 = erFormHelper.getGrid(grid_view_2.value);
            gridView2.gridOptions.getRowStyle = (params: any) => {
                /*  if (params.data.RCV_MAT_FLAG.toString().trim() === '1') {
                  return {
                    fontweight: 'bold',
                    background: 'orange'
                  };
                } */
            };
            erFormHelper.setGridEditable(grid_view_2.value, false);
            erFormHelper.setGridToolbarVisible(grid_view_2.value, {
                addrow: false,
                copyrow: false,
                excel: true
            });
        };

    const erGrid3Ready = () => {
            gridView3 = erFormHelper.getGrid(grid_view_3.value);

            gridView3.gridOptions.getRowStyle = (params: any) => {
                /*  if (params.data.RCV_MAT_FLAG.toString().trim() === '1') {
                  return {
                    fontweight: 'bold',
                    background: 'orange'
                  };
                } */
            };
            erFormHelper.setGridEditable(grid_view_3.value, false);
            erFormHelper.setGridToolbarVisible(grid_view_3.value, {
                addrow: false,
                copyrow: false,
                excel: true
            });
        };

    //设置定时器
    const setStartTimer = () => {
            console.log('定时器触发');
            timeId = setInterval(queryMainGridZDSX, 60000);
            //clearInterval(timeId);
            //erFormHelper.setControlValueEx('layoutControlGroup1', outInfo.getBlock(0).data[0]);
        };

    //自动刷新查询
    const queryMainGridZDSX = async() => {
            console.log('查询进来了1111');
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
                // FACTORY_DIV: pagePara.factory_div,
                FACTORY_DIV: ' ',
                TABLE_TYPE: 'TMMSM01'
            });
            eiInfo.addBlock(queryConditionEiBlock);
            //当开关标记为0 则关掉定时器 并直接返回
            if (queryConditionEiBlock.data[0]['PEOPLE_DIV'] == '0') {
                clearInterval(timeId);
                return;
      }
      const outInfo = await erFormHelper.callService('mmsmacshf2_inq', eiInfo, true, false, true);
            // 判断调后台是否失败
            if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
            } else {
                erFormHelper.mergeDataToGrid(outInfo, 'GridView1', true);
                queryZDSHGL();
            }
        };

    const layoutValueChanged = async(e: any) => {
            if (e.itemCode === 'PEOPLE_DIV') {
                console.log('事件进来了', erFormHelper.getControlValue('layoutControlGroup1', 'PEOPLE_DIV'));
                if (erFormHelper.getControlValue('layoutControlGroup1', 'PEOPLE_DIV')) {
                    setStartTimer();
                } else {
                    clearInterval(timeId);
                    console.log('事件进来了', erFormHelper.getControlValue('layoutControlGroup1', 'PEOPLE_DIV'));
                }
                /*  if (!erFormHelper.getControlValue('layoutControlGroup1', 'PEOPLE_DIV')) {
                  clearInterval(timeId);
                } */
            }
        };

    // 查询主表炉次信息
    const queryMainGrid = async() => {
            console.log('查询进来了');
      const eiInfo = new EI.EIInfo();
      // const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
      //   // FACTORY_DIV: pagePara.factory_div,
      //   FACTORY_DIV: ' ',
      //   MAN_PROC_DIV: 'Y', // Y 是人工查询  N 是自动查询
      //   TABLE_TYPE: 'TMMSM01'
      // });
      // eiInfo.addBlock(queryConditionEiBlock);
      // console.log('new_matno', queryConditionEiBlock.data[0].MAT_NO);

      const queryConditionEiBlock: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1');
            //多条查询
            if (queryConditionEiBlock.data[0].MAT_NO) {
        const new_matno = (queryConditionEiBlock.data[0].MAT_NO as string).split('\n').join("','");
queryConditionEiBlock.data[0].MAT_NO = new_matno;
      } else {
    queryConditionEiBlock.addColumn('MAT_NO');
}
console.log('new_matno', queryConditionEiBlock.data[0].MAT_NO);
queryConditionEiBlock.addColumn('FACTORY_DIV', ' ');
queryConditionEiBlock.addColumn('MAN_PROC_DIV', 'Y'); // Y 是人工查询  N 是自动查询
queryConditionEiBlock.addColumn('TABLE_TYPE', 'TMMSM01');
eiInfo.addBlock(queryConditionEiBlock);
console.log('eiInfo', eiInfo);

if (queryConditionEiBlock.data[0]['PEOPLE_DIV'] == '0') {
    clearInterval(timeId);
      }
      const outInfo = await erFormHelper.callService('mmsmacshf2_inq', eiInfo, true, false, true);
// 判断调后台是否失败
if (outInfo.sys.status < 0) {
    erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
} else {
    erFormHelper.mergeDataToGrid(outInfo, 'GridView1', true);
    queryZDSHGL();
      }
    };

    const queryZDSHGL = async() => {
      const eiInfo = new EI.EIInfo();
      const outInfo = await erFormHelper.callService('mmsmacshf2_inq1', eiInfo, true, false, true);
    // 判断调后台是否失败
    if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
    } else {
        console.log('123', outInfo);

        erFormHelper.mergeDataToGrid(outInfo, 'GridView2', true);
    }
    };

    // 查询收货履历信息
    const queryAClvli = async(currentRowInfo: any) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock2 = eiInfo.addBlock(new EI.EiBlock());
    eiBlock2.pushData({ ...currentRowInfo }, true);
    console.log('eiInfo', eiInfo);

      const outInfo = await erFormHelper.callService('mmsmacshf2_inq2', eiInfo, true, false, true);
    // 判断调后台是否失败
    if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
    } else {
        console.log('shouhuo111');
        console.log('shouhuooutInfo', outInfo);
        erFormHelper.mergeDataToGrid(outInfo, 'GridView3', true);
    }
    };

    const GridView1FocusChanged = (e: any) => {
    console.log('e.dataModel11111', e.rowIndex);
      const mainGridCurrentRow = erFormHelper.getGridCurrentRow('GridView1', true);
    console.log('bbb', mainGridCurrentRow);
    if (mainGridCurrentRow) {
        queryAClvli(mainGridCurrentRow);
    }
    /* if (e.field == 'RCV_MAT_FLAG') {
      console.log('e.field', e.data[0]['RCV_MAT_FLAG']);
    } */
    //erFormHelper.unCheckAllGridRow('GridView1');
};

    const GridView1dblclick = (e: any) => {
    gridView1 = erFormHelper.getGridCurrentRow(grid_view_1.value);
    erFormHelper.checkGridRow('GridView1', gridView1);
};
    const GridView2dblclick = (e: any) => {
    gridView2 = erFormHelper.getGridCurrentRow(grid_view_2.value);
    erFormHelper.checkGridRow('GridView2', gridView2);
};
    const GridView3dblclick = (e: any) => {
    gridView3 = erFormHelper.getGridCurrentRow(grid_view_3.value);
    erFormHelper.checkGridRow('GridView3', gridView3);
};

onMounted(() => { });

    const F2_DO = async(e: any) => {
    queryMainGrid();
};

    //自动收货开关管理
    const F3_DO = async(e: any) => {
    /*  if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
      erFormHelper.messageWarning('请先选择一条数据进行操作！');
      return false;
    } else {
      // 删除提示
      const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
      if (confirm) {
        const eiInfo = new EI.EIInfo();
        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView1', {});
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsmacshf6_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
          erFormHelper.messageSuccess('处理成功');
          queryMainGrid();
        }
      }
    } */

    erFormHelper.stopGridEditing('GridView2', async() => {
        if (erFormHelper.getGridCheckedRows('GridView2').length === 0) {
            erFormHelper.messageWarning('请先选择一条数据进行操作！');
            return false;
        } else {
          // 删除提示
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView2', {});
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
            console.log('checkedRowEiBlock', checkedRowEiBlock);
          const outInfo = await erFormHelper.callService('mmsmacshf3_pro', eiInfo, true, false, true);
            if (outInfo.sys.status < 0) {
                erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
            } else {
                erFormHelper.messageSuccess('处理成功');
                erFormHelper.setGridEditable(grid_view_2.value, false);
                queryMainGrid();
                setStartTimer();
            }
        }
    });
};

    const F3_PRE_DO = async(e: any) => {
    //queryMainGrid();
    erFormHelper.setGridEditable(grid_view_2.value, true);
    clearInterval(timeId);
};
    const F3_CANCEL = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_2.value, false);
    queryMainGrid();
    setStartTimer();
};

    //自定义模板参数
    /* const popFreeEdit_pars = async () => {
     let popFreeEdit = new ER.PopQueryHelper(formPartition, 'MMSMACSHPOPS2N', 'MMSMACSH_GridView');
    }; */
    //弹出界面OK按钮点击事件
    const popFreeEditOkClick = async(e: PopFreeReturnInfo) => {
      let i_service: any;
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();

    if (cs_OkClick === 'F4') {
        i_service = i_service_f4;
      }
      const mainGridCheckedRow = erFormHelper.getGridCheckedRowsAsBlock('GridView1');
    inInfo.addBlock(mainGridCheckedRow);
    inInfo.addBlock(erFormHelper.convertModelAsBlock(e.dataModel), 'PARA');

    outInfo = await erFormHelper.callService(i_service, inInfo, false, false, true);

    if (outInfo.sys.status < 0) {
        erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        return false;
    } else {
        // 隐藏工具栏按钮
        setToolbarVisible('GridView1', false);
        //设置grid不可编辑
        erFormHelper.setGridEditable(grid_view_1.value, false);
        erFormHelper.setGridColumnEditable(
            grid_view_1.value,
            true,
            'REMAINDER_REASON',
            'GRINDING_FLAG',
            'GRIND_REASON'
            );
        queryMainGrid();
        setStartTimer();
    }
    // queryMainGrid();
};

    //收货确认
    const F4_DO = async(e: any) => {
    if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        //queryMainGrid();
        return false;
    }
    erFormHelper.stopGridEditing('GridView1', async() => {
        const mainGridCheckedRow = erFormHelper.getGridCheckedRowsAsBlock('GridView1');
        //获取选中行信息
        //const mainGridCheckedRow = erFormHelper.getGridCheckedRows('GridView1', true);
        console.log('mainGridCheckedRow', mainGridCheckedRow, mainGridCheckedRow.data.length);
        let dateTime = new Date(); //获取当前时间
        //popFreeEdit_pars();
        for (let i = 0; i < mainGridCheckedRow.data.length; i++) {
        if (mainGridCheckedRow.data[i]['RCV_MAT_FLAG'] == 'W' || mainGridCheckedRow.data[i]['RCV_MAT_FLAG'] == 'S') {
            erFormHelper.messageWarning('选中记录已收货，不允许进行收货操作！');
            return;
        }

        //给没有收货时间的赋当前时刻
        /*   if (mainGridCheckedRow.data[i]['RECV_MAT_TIME']?.toString().trim() == '') {
          mainGridCheckedRow.data[i]['RECV_MAT_TIME'] = dateTime;
        } */
        /* console.log('dateTime', dateTime); */

        if (mainGridCheckedRow.data[i]['RECEIVE_WEIGHT'] == 0) {
            mainGridCheckedRow.data[i]['RECEIVE_WEIGHT'] = mainGridCheckedRow.data[i]['MAT_WT'];
        }

        //当虚拟板坯不存在时  弹窗成品标记默认为空
        if (mainGridCheckedRow.data[i]['LSLAB_NO'] == '') {
            mainGridCheckedRow.data[i]['PRODUCT_FLAG'] = ' ';
        }

        /* if (mainGridCheckedRow.data[i]['PRODUCT_FLAG'] == '') {
          erFormHelper.messageWarning('选中记录余材未选择成品还是在制品，请重新确认！');
          return;
        } */
    }
    console.log('for循环结束');

    openADDialog(mainGridCheckedRow);

        /*  cs_OkClick = 'F4';
        //popFreeEdit_pars();

        popFreeEdit.setEvent('open', () => {
          setTimeout(() => {
            popFreeEdit.ErFormHelper.importRowsToGrid('gridView1', erFormHelper.getGridCheckedRows('GridView1'));
          }, 500);
        });
        popFreeEdit.CloseDialogWhenOkClick;
        //popFreeEdit.DefaultValues = erFormHelper.getGridCheckedRows('GridView1');
        ER.PopUtils.showErPopQuery(ErPopQuery, popFreeEdit, (e: PopQueryReturnInfo) => {
          if (e.dialogResult === 'ok') {
            console.log('111111111111111', e, e.checkedItemArray);
            console.log('111111111111111', e, popFreeEdit.CloseDialogWhenOkClick);
            // 获取当前行的数据--->用于单选
            //  const checkData = e.checkedItem
            // 获取勾选行数据 ---> 用于多选
            //  const checkDataArr = e.checkItemArray
            // 根据业务需求，编写自己的代码逻辑。
          }
        }); */

        /*  const eiInfo = new EI.EIInfo();
        eiInfo.addBlock(mainGridCheckedRow);

        const outInfo = await erFormHelper.callService(i_service_f4, eiInfo, true, false, true); */
        /* if (outInfo.sys.status < 0) {
          erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
          return false;
        } else {
          // 隐藏工具栏按钮
          setToolbarVisible('GridView1', false);
          //设置grid不可编辑
          erFormHelper.setGridEditable(grid_view_1.value, false);
          erFormHelper.setGridColumnEditable(
            grid_view_1.value,
            true,
            'REMAINDER_REASON',
            'GRINDING_FLAG',
            'GRIND_REASON'
          );
          queryMainGrid();
          setStartTimer();
        } */
      });
    };

    const F4_PRE_DO = async(e: any) => {
      /* selectNode.forEach((row: any) => {
        console.log('123r254', row.data, row.setDataValue('RECV_MAT_TIME', e.newValue));
      }); */
      const gridData = erFormHelper.getGridSelectRows(grid_view_1.value);
    console.log('gridData', gridData);

    //queryMainGrid();
    erFormHelper.setGridEditable(grid_view_1.value, true);
    erFormHelper.setGridColumnEditable(grid_view_1.value, false, 'REMAINDER_REASON', 'GRINDING_FLAG', 'GRIND_REASON');
    erFormHelper.checkGridRow('GridView1', gridData, true);
    clearInterval(timeId);
      /* for (let F4_PRE_I = 0; F4_PRE_I < gridData.length; F4_PRE_I++) {
        const currentRow = gridData[F4_PRE_I]; // 新增行在最后一行
        erFormHelper.checkGridRow('GridView1', currentRow);
      } */
      // const currentRow = gridData[0];
      // const currentRowNode = e.api.getRowNode(currentRow.uid);

      //setToolbarVisible('GridView1', true);
    };
    const F4_CANCEL = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_1.value, false);
    erFormHelper.setGridColumnEditable(grid_view_1.value, true, 'REMAINDER_REASON', 'GRINDING_FLAG', 'GRIND_REASON');
    //setToolbarVisible('GridView1', false);
    queryMainGrid();
    setStartTimer();
};

    //收货取消
    const F5_DO = async(e: any) => {
    if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
    } else {
        // 删除提示
        const confirm = await erFormHelper.messageConfirm('是否将选择的信息进行相关操作？');
        if (confirm) {
          const eiInfo = new EI.EIInfo();
          const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView1', {});
          const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
          for (let i = 0; i < checkedRowEiBlock.data.length; i++) {
                //余材原因录入必须收货后
                if (checkedRowEiBlock.data[i]['RCV_MAT_FLAG'] != 'S') {
                    erFormHelper.messageWarning('选中记录当前状态不是收货完成S状态，不能进行收货撤销！');
                    return;
                }
          }
          const outInfo = await erFormHelper.callService('mmsmacshf5_pro', eiInfo, true, false, true);
            if (outInfo.sys.status < 0) {
                erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
            } else {
                erFormHelper.messageSuccess('处理成功');
                erFormHelper.setGridEditable(grid_view_1.value, false);
                queryMainGrid();
                setStartTimer();
            }
        }
      }
};

    const F5_PRE_DO = async(e: any) => { };
    const F5_CANCEL = async(e: any) => { };

    //发送板坯数据
    const F6_DO = async(e: any) => {
    if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
    } else {
        // 删除提示
        const eiInfo = new EI.EIInfo();
        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView1', {});
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        console.log('F6_DOcheckedRowEiBlock', checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsmacshf6_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
            erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
            erFormHelper.messageSuccess('处理成功');
            erFormHelper.setGridColumnEditable(
                grid_view_1.value,
                true,
                'RECV_MAT_TIME',
                'MAT_THICK',
                'MAT_WIDTH',
                'MAT_LEN',
                'RECEIVE_WEIGHT',
                'PRODUCT_FLAG'
                );
            erFormHelper.setGridEditable(grid_view_1.value, false);
            queryMainGrid();
            setStartTimer();
        }
      }
};
    const F6_PRE_DO = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_1.value, true);
    erFormHelper.setGridColumnEditable(
        grid_view_1.value,
        false,
        'RECV_MAT_TIME',
        'MAT_THICK',
        'MAT_WIDTH',
        'MAT_LEN',
        'RECEIVE_WEIGHT',
        'PRODUCT_FLAG'
        );
    erFormHelper.setGridColumnEditable(grid_view_1.value, true, 'REMAINDER_REASON');
    clearInterval(timeId);
};
    const F6_CANCEL = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_1.value, false);
    erFormHelper.setGridColumnEditable(
        grid_view_1.value,
        true,
        'RECV_MAT_TIME',
        'MAT_THICK',
        'MAT_WIDTH',
        'MAT_LEN',
        'RECEIVE_WEIGHT',
        'PRODUCT_FLAG'
        );
    //setToolbarVisible('GridView1', false);
    queryMainGrid();
    setStartTimer();
};

    //发送板坯数据
    const F7_DO = async(e: any) => {
    if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
    } else {
        // 删除提示
        const eiInfo = new EI.EIInfo();
        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView1', {});
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        console.log('F7_DOcheckedRowEiBlock', checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsmacshf7_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
            erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
            erFormHelper.messageSuccess('处理成功');
            erFormHelper.setGridColumnEditable(
                grid_view_1.value,
                true,
                'RECV_MAT_TIME',
                'MAT_THICK',
                'MAT_WIDTH',
                'MAT_LEN',
                'RECEIVE_WEIGHT',
                'PRODUCT_FLAG',
                'REMAINDER_REASON'
                );
            erFormHelper.setGridEditable(grid_view_1.value, false);
            queryMainGrid();
            setStartTimer();
        }
      }
};
    const F7_PRE_DO = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_1.value, true);
    erFormHelper.setGridColumnEditable(
        grid_view_1.value,
        false,
        'RECV_MAT_TIME',
        'MAT_THICK',
        'MAT_WIDTH',
        'MAT_LEN',
        'RECEIVE_WEIGHT',
        'PRODUCT_FLAG',
        'REMAINDER_REASON'
        );
    erFormHelper.setGridColumnEditable(grid_view_1.value, true, 'GRINDING_FLAG', 'GRIND_REASON');
    clearInterval(timeId);
};
    const F7_CANCEL = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_1.value, false);
    erFormHelper.setGridColumnEditable(
        grid_view_1.value,
        true,
        'RECV_MAT_TIME',
        'MAT_THICK',
        'MAT_WIDTH',
        'MAT_LEN',
        'RECEIVE_WEIGHT',
        'PRODUCT_FLAG',
        'REMAINDER_REASON'
        );
    //setToolbarVisible('GridView1', false);
    queryMainGrid();
    setStartTimer();
};

    //后备修改收货标记
    const F8_DO = async(e: any) => {
    if (erFormHelper.getGridCheckedRows('GridView1').length === 0) {
        erFormHelper.messageWarning('请先选择一条数据进行操作！');
        return false;
    } else {
        const eiInfo = new EI.EIInfo();
        const checkedRowEiBlock = erFormHelper.getGridCheckedRowsAsBlock('GridView1', {});
        const eiBlock = eiInfo.addBlock(checkedRowEiBlock);
        console.log('F7_DOcheckedRowEiBlock', checkedRowEiBlock);
        const outInfo = await erFormHelper.callService('mmsmacshf8_pro', eiInfo, true, false, true);
        if (outInfo.sys.status < 0) {
            erFormHelper.messageError('处理失败:' + outInfo.sys.msg);
        } else {
            erFormHelper.messageSuccess('处理成功');
            erFormHelper.setGridColumnEditable(
                grid_view_1.value,
                true,
                'RECV_MAT_TIME',
                'MAT_THICK',
                'MAT_WIDTH',
                'MAT_LEN',
                'RECEIVE_WEIGHT',
                'PRODUCT_FLAG',
                'REMAINDER_REASON',
                'GRIND_REASON',
                'RCV_MAT_FLAG'
                );
            erFormHelper.setGridEditable(grid_view_1.value, false);
            queryMainGrid();
            setStartTimer();
        }
      }
};
    const F8_PRE_DO = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_1.value, true);
    erFormHelper.setGridColumnEditable(
        grid_view_1.value,
        false,
        'RECV_MAT_TIME',
        'MAT_THICK',
        'MAT_WIDTH',
        'MAT_LEN',
        'RECEIVE_WEIGHT',
        'PRODUCT_FLAG',
        'REMAINDER_REASON',
        'GRIND_REASON',
        'RCV_MAT_FLAG'
        );
    erFormHelper.setGridColumnEditable(grid_view_1.value, true, 'RCV_MAT_FLAG');
    clearInterval(timeId);
};
    const F8_CANCEL = async(e: any) => {
    erFormHelper.setGridEditable(grid_view_1.value, false);
    erFormHelper.setGridColumnEditable(
        grid_view_1.value,
        true,
        'RECV_MAT_TIME',
        'MAT_THICK',
        'MAT_WIDTH',
        'MAT_LEN',
        'RECEIVE_WEIGHT',
        'PRODUCT_FLAG',
        'REMAINDER_REASON',
        'GRIND_REASON',
        'RCV_MAT_FLAG'
        );
    //setToolbarVisible('GridView1', false);
    queryMainGrid();
    setStartTimer();
};

    // 打开分切弹出画面
    /*     const openADDialog = (currentRow: any) => {
      dialogFormName.value = 'MMSMACSHPOPS2N'; // 读配置表获取画面名
      parentInfo.value = currentRow;
      openXrEfDialog();
    };
 */
    const openADDialog = (currentRow: any) => {
      const data = {
        mainData: currentRow
    };
    dialogFormName.value = 'MMSMACSHPOPS2N'; // 读配置表获取画面名
    parentInfo.value = data;
    openXrEfDialog();
    };
    // 弹框ref
    const xrEfDialogRef = ref<any>(null);
console.log('1');

    // 打开弹框事件
    const openXrEfDialog = () => {
    dialogVisible.value = true; //弹窗设置为显示
    console.log('222222222');

    /*  nextTick(() => {
      xrEfDialogRef.value.open();
    }); */
};
    // 关闭弹框监听
    const xrEfDialogClose = () => {
    dialogVisible.value = false;
    console.log('11111');
    setToolbarVisible('GridView1', false);
    //设置grid不可编辑
    erFormHelper.setGridEditable(grid_view_1.value, false);
    erFormHelper.setGridColumnEditable(grid_view_1.value, true, 'REMAINDER_REASON', 'GRINDING_FLAG', 'GRIND_REASON');
    queryMainGrid();
    setStartTimer();
};
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
    if (info.close) {
        dialogVisible.value = false; // 关闭弹框
        xrEfDialogClose();
    }

    console.log('22222');
    /*   if (info.close) {
      xrEfDialogRef.value.close(); // 关闭弹框
    } */
};

    return {
      erGrid2Ready,
      erGrid3Ready,
      GridView3dblclick,
      GridView2dblclick,
      GridView1dblclick,
      erFormHelper,
      initializeFlag,
      gridToolbar,
      efFormReady,
      erGrid1Ready,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL,
      F5_DO,
      F5_PRE_DO,
      F5_CANCEL,
      GridView1FocusChanged,
      F6_DO,
      F6_PRE_DO,
      F6_CANCEL,
      F7_DO,
      F7_PRE_DO,
      F7_CANCEL,
      F8_DO,
      F8_PRE_DO,
      F8_CANCEL,
      layoutValueChanged,
      dialogFormName,
      parentInfo,
      getChildInfo,
      dialogVisible,
      xrEfDialogClose,
      xrEfDialogRef
    };
  }
});
