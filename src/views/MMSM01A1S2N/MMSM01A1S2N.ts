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
import EFCallForm from 'EFX/EFCallForm';
import { Console, log } from 'console';

export default defineComponent({
  name: 'MMSM01A1S2N',
  components: { xrEfForm, xrEfPanel, xrEfSearchBox, xrEfDialog, erGrid, erLayout, ErPopFree, ErPopQuery, EFCallForm },
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
    formName = 'MMSM01A1S2N';
    const erFormHelper: ER.FormHelper = new ER.FormHelper() as any;
    const initializeFlag = ref(0);
    const editable = ref(false);
    let gridView1: any;
    let v_factory_div: any;
    let cs_OkClick = '';
    const i_proc_div = '';
    let i_windowsNumber: any;
    let popFreeEdit: ER.PopFreeHelper;
    const cs_dialog = 'MMSM01A2S2N';
    const gridView = 'GridView_MAT';
    let tab1ActiveKey = ref('tab1');

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
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        //设置在gridview1中进行分页查询
        /*  const layout_chaxun = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
        const eiInfo = new EI.EIInfo();
        eiInfo.addBlock(layout_chaxun); */
        //erFormHelper.setGridServerPagingQuery('GridView1', eiInfo, grid1pagingQuery, true);
        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          //gridView1 = erFormHelper.getKendoGrid('GridView1');
          //erFormHelper.setGridEditable('GridView1', false);
        });
      } else {
        erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
      }
    };

    onMounted(() => {
      //initializePage();
    });
    //模板参数查询

    const erGrid1Ready = (e: any) => {
      gridView1 = erFormHelper.getGrid('GridView1');

      gridView1.gridOptions.getRowStyle = (params: any) => {
        console.log('params', params);
        if (params.data && 'MAT_NO' in params.data) {
          //  if (
          //   (params.data.MEND_FLAG.toString().trim() != '' || params.data.MEND_FLAG.toString().trim() != '0') &&
          //   params.data.MEND_BEFORE_WEIGHT != 0 &&
          //   params.data.PRODUTE_CAL_WT != 0 &&
          //   (params.data.PRODUTE_CAL_WT - params.data.MEND_BEFORE_WEIGHT > 0.5 ||
          //     params.data.MEND_BEFORE_WEIGHT - params.data.PRODUTE_CAL_WT > 0.5)
          // ) {
          //   return {
          //     fontweight: 'blod',
          //     background: '#A9F5A9'
          //   };
          // } else if (
          //   (params.data.PRODUTE_CAL_WT - params.data.MAT_ACT_WT > 0.5 ||
          //     params.data.MAT_ACT_WT - params.data.PRODUTE_CAL_WT > 0.5) &&
          //   params.data.MAT_ACT_WT != 0 &&
          //   params.data.PRODUTE_CAL_WT != 0
          // ) {
          //   //重量不在范围的为绿色
          //   return {
          //     fontweight: 'blod',
          //     background: '#A9F5A9'
          //   };
          // } 
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
          if (params.data.HOLD_FLAG.toString().trim() != '0' || params.data.USAGE_DECISION.toString().trim() == '3005') {
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
            //修磨的为橘红色
            return {
              fontweight: 'blod',
              background: '#FE9A2E'
            };
          }

          if (params.data.RCV_MAT_FLAG.toString().trim() === 'N') {
            //未收货颜色为黄色
            return {
              fontweight: 'blod',
              background: 'yellow'
            };
          }
          //出库的为白色
          if (params.data.ARCHIVE_TIME.toString().trim() !== '') {
            return {
              fontweight: 'blod',
              background: '#FFFFFF'
            };
          }
          if (params.data.RCV_MAT_FLAG.toString().trim() === 'S') {
            //收货后状态颜色为蓝色
            return {
              fontweight: 'blod',
              background: '#7FBFF5'
            };
          }
        }
      };
      console.log('gridView1', gridView1);
      erFormHelper.setGridEditable('GridView1', false);
      erFormHelper.setGridToolbarVisible('GridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    //查询信息
    const queryMainGrid = async () => {
      const eiInfo = new EI.EIInfo();
      //获取查询条件
      const Query: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      //多条查询
      if (Query.data[0].MAT_NO) {
        const new_matno = (Query.data[0].MAT_NO as string).split('\n').join("','");
        Query.data[0].MAT_NO = new_matno;
      } else {
        Query.addColumn('MAT_NO');
      }
      eiInfo.addBlock(Query);
      const outInfo = await erFormHelper.callService('mmsm01a1f2_inq', eiInfo, true, false, true);
      //判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        //是否弹出查询成功提示
        console.log('outInfo', outInfo);
        erFormHelper.messageInfo('信息查询成功！本次查询返回' + outInfo.getBlock(0).data.length + '条记录！');
        console.log('outInfo', outInfo);
        erFormHelper.mergeDataToGrid(outInfo, 'GridView1');
      }
    };

    //#region 分页查询信息 grid1pagingQuery start
    const grid1pagingQuery = async () => {
      //options.success({ data: undefined, total: undefined });
      const Query = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter');
      const inInfo = new EI.EIInfo();
      inInfo.addBlock(Query, 'Table1');
      inInfo.addBlock(erFormHelper.getAllControlValueAsFilter('LayoutGroupFilter'), 'QUERY_FILTER');
      /*  const eiBlock_page = new EI.EiBlock();
      eiBlock_page.pushData({
        RecordFrom: options.data.skip,
        PageSize: options.data.pageSize
      });
      inInfo.addBlock(eiBlock_page, 'PageInfo'); */
      inInfo.getBlock(0).data[0]['ORIGIN_MAT_NO'] = '';
      inInfo.getBlock(0).data[0]['STOCK_NO'] = '';
      inInfo.getBlock(0).data[0]['IN_FLAG'] = '';
      inInfo.getBlock(0).data[0]['PRODUCT_FLAG'] = '';
      inInfo.getBlock(0).data[0]['SG_SIGN'] = '';
      const outInfo = await erFormHelper.callService('mmsm01a1f2_inq', inInfo, false, true);
      if (outInfo.sys.status >= 0) {
        const resultData = outInfo.getBlock(0).data; //后台返回的当页的数据
        const reusltTotal = outInfo.blocks['PageInfo'].data[0]['TOTALRECORDCOUNT']; //后台返回数据总条数
        //固定写法[ison的键必须是data和total]
        const result = { data: resultData, total: reusltTotal };
        // options.success(result);
        if (outInfo.getBlock(0).data.length === 0) {
          erFormHelper.messageInfo('未查询到材料信息');
        }
      }
    };
    //#endregion 分页查询信息 end

    const handleTabChange = (activeKey: string) => {
      console.log('111111111111111111111111111', activeKey, a1a1);
      //   const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1, true);
      // console.log(activeKey);
      if (activeKey === 'tab1') {
        erFormHelper.setControlValueEx('LayoutGroup1', { ...a1a1 });
      } else if (activeKey === 'tab2') {
        erFormHelper.setControlValueEx('LayoutGroup2', { ...a1a1 });
      } else if (activeKey === 'tab3') {
        erFormHelper.setControlValueEx('LayoutGroup3', { ...a1a1 });
      } else if (activeKey === 'tab4') {
        erFormHelper.setControlValueEx('LayoutGroup4', { ...a1a1 });
      }
      else if (activeKey === 'tab5') {
        erFormHelper.setControlValueEx('LayoutGroup5', { ...a1a1 });
      }
      else if (activeKey === 'tab6') {
        erFormHelper.setControlValueEx('LayoutGroup6', { ...a1a1 });
      }
    };

    //焦点行数据查询
    let a1a1 = {};
    const GridView1FocusChanged = async (e: any) => {
      if (e) {
        if (e.rowChanged && e.data) {
          const inInfo = new EI.EIInfo();
          inInfo.addBlock(
            erFormHelper.convertModelAsBlock(e.data, {
              MAT_NO: e.data.get('MAT_NO')
            })
          );
          const outInfo = await erFormHelper.callService('mmsm01a1a1_inq', inInfo, false, false);
          if (outInfo.sys.status < 0) {
            return false;
          }
          //清空
          // erFormHelper.setAllControlDefalutValue('LayoutGroup1', false);
          // erFormHelper.setAllControlDefalutValue('LayoutGroup2', false);
          // erFormHelper.setAllControlDefalutValue('LayoutGroup3', false);
          // erFormHelper.setAllControlDefalutValue('LayoutGroup4', false);
          // erFormHelper.setAllControlDefalutValue('LayoutGroup5', false);
          // erFormHelper.setAllControlDefalutValue('LayoutGroup6', false);
          //加载
          console.log('outInfo', outInfo);
          console.log('outInfo', outInfo.getBlock(0));
          console.log('outInfo', outInfo.getBlock(0).data[0]);
          a1a1 = outInfo.getBlock(0).data[0];
          erFormHelper.setControlValueEx('LayoutGroup1', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroup2', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroup3', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroup4', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroup5', outInfo.getBlock(0).data[0]);
          erFormHelper.setControlValueEx('LayoutGroup6', outInfo.getBlock(0).data[0]);
        }
      }
    };

    //弹窗配置
    const popFreeEditOkClick = async (e: PopFreeReturnInfo) => {
      const inInfo = new EI.EIInfo();
      let outInfo: EI.EIInfo = new EI.EIInfo();
      //新增
      if (cs_OkClick === 'F3') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div
          }),
          'PARA'
        );
        outInfo = await erFormHelper.callService('mmsm01a1f3_ins', inInfo, false, true, true);
      }
      //修改
      if (cs_OkClick === 'F4') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div,
            Button_check: 'F4_BUTTON'
          }),
          'PARA'
        );
        inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView1'), 'YSJL'); //获取勾选行数据（原始记录）
        console.log('ININFO', inInfo);
        outInfo = await erFormHelper.callService('mmsm01a1f4_upd', inInfo, false, true);
      }
      //拆批
      if (cs_OkClick === 'F6') {
        const aaa = popFreeEdit.FormHelper.getAllControlValueAsEiBlock('LayoutGroupF6');
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            /*   MAT_NUM_CUT: aaa.data[0]['MAT_NUM_CUT'],
            MAT_NO: e.dataModel.MAT_NO */
          })
        );
        outInfo = await erFormHelper.callService('mmsm01a1f6_pro_new', inInfo, false, true);
      }
      //并批
      if (cs_OkClick === 'F7') {
        //const aaa = popFreeEdit.FormHelper.getAllControlValueAsEiBlock('LayoutGroupF7');
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div,
            Button_check: 'F7_BUTTON'
            //MAIN_MAT_FLAG: aaa.data[0]['MAIN_MAT_FLAG']
          })
        );
        inInfo.addBlock(erFormHelper.getGridSelectRowsAsBlock('GridView1'), 'YSJL'); //获取勾选行数据（原始记录）
        outInfo = await erFormHelper.callService('mmsm01a1f4_upd', inInfo, false, true);
      }
      if (cs_OkClick === 'F8') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div,
            Button_check: 'F8_BUTTON'
            //MAIN_MAT_FLAG: aaa.data[0]['MAIN_MAT_FLAG']
          })
        );

        outInfo = await erFormHelper.callService('mmsm01a1f8_pro', inInfo, false, true);
      }
      //管理封锁
      if (cs_OkClick === 'F10') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div
          }),
          'Table1'
        );
        const eiBlock_table2 = new EI.EiBlock();
        eiBlock_table2.pushData({ MAT_NO: e.dataModel.MAT_NO });
        inInfo.addBlock(eiBlock_table2, 'Table2');
        outInfo = await erFormHelper.callService('mmsm01a1f10_pro', inInfo, false, true);
      }
      //管理释放封锁
      if (cs_OkClick === 'F11') {
        inInfo.addBlock(
          erFormHelper.convertModelAsBlock(e.dataModel, {
            PROC_DIV: i_proc_div,
            FACTORY_DIV: v_factory_div
          }),
          'Table1'
        );
        const eiBlock_table2 = new EI.EiBlock();
        eiBlock_table2.pushData({ MAT_NO: e.dataModel.MAT_NO });
        inInfo.addBlock(eiBlock_table2, 'Table2');
        outInfo = await erFormHelper.callService('mmsm01a1f11_pro', inInfo, false, true);
      }
      //判断操作
      if (outInfo?.sys.status >= 0) {
        erFormHelper.messageSuccess('操作成功');
      }
      erFormHelper.excuteGridServerPaging('GridView1', 0);

      queryMainGrid();
    };

    //自定义模板参数
    const popFreeEdit_paras = async (windowsNumber: string, Click_name: string) => {
      if (i_windowsNumber === cs_dialog) {
        //新增
        if (Click_name === 'F3') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, cs_dialog, 'LayoutGroupF3');
        }
        //修改
        if (Click_name === 'F4') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, cs_dialog, 'LayoutGroupF4');
        }
        //拆批
        if (Click_name === 'F6') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, cs_dialog, 'LayoutGroupF6');
        }
        //并批
        if (Click_name === 'F7') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, cs_dialog, 'LayoutGroupF7');
        }
        if (Click_name === 'F8') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, cs_dialog, 'LayoutGroupF8');
        }
        //管理封锁
        if (Click_name === 'F10') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, cs_dialog, 'LayoutGroupF10');
        }
        //管理释放封锁
        if (Click_name === 'F11') {
          popFreeEdit = new ER.PopFreeHelper(formPartition, cs_dialog, 'LayoutGroupF11');
        }
      }
      //新增
      if (Click_name === 'F3') {
        //新增
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === cs_dialog) {
          popFreeEdit.FormHelper.setControlReadOnly('LayoutGroupF3', true, 'HEAT_NO', 'PONO');
          erFormHelper.getGridCurrentRow('GridView1')["STOCK_NO"] = 'SYA';
          erFormHelper.getGridCurrentRow('GridView1')["MEASURE_WT_FLAG"] = '0';
          popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));

          popFreeEdit.setEvent('itemValueChanged', async (e: any) => {
            if (e.itemCode === 'MAT_NO') {
              //获取浇内顺序号
              const eiInfo = new EI.EIInfo();
              const eiBlock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
              eiBlock.addColumn('PROC_DIV', 'MMSM01A1_MAT_NO'); //传表名
              eiBlock.addColumn('HEAT_NO_01A1', popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8)); //熔炼号
              eiInfo.addBlock(eiBlock, '');

              console.log('eiInfo', eiInfo);
              const outInfo = await erFormHelper.callService('mmsmgetdata_inq', eiInfo, true, false, true);
              //判断调后台是否失败
              if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
                return 0;
              }

              console.log('outInfo', outInfo.getBlock(0).data[0]);
              //对于1位和2位的浇内顺序号，进行补0操作
              let s_cast_div_no_1 = outInfo.getBlock(0).data[0]['CAST_DIV_NO']?.toString();
              if (s_cast_div_no_1?.length == 1) {
                s_cast_div_no_1 = '00' + s_cast_div_no_1;
              } else if (s_cast_div_no_1?.length == 2) {
                s_cast_div_no_1 = '0' + s_cast_div_no_1;
              }

              if (outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() != '') {
                popFreeEdit.setValue({ SM_PLAN_NO: outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() });
              }
              if (outInfo.getBlock(0).data[0]['PONO']?.toString().trim() != '') {
                popFreeEdit.setValue({ PONO: outInfo.getBlock(0).data[0]['PONO']?.toString().trim() });
              }

              if (popFreeEdit.getValue('SLAB_NO').toString().length == 20) {
                //判断
                const s_SLAB_NO =
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
                  popFreeEdit.getValue('ST_NO').toString().trim() +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
                  s_cast_div_no_1;
                //是否将钢牌号联查出来

                popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
                popFreeEdit.setValue({ PRINT_NO: s_SLAB_NO });
              } else if (popFreeEdit.getValue('SLAB_NO').toString().length == 21) {
                const s_SLAB_NO =
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
                  popFreeEdit.getValue('ST_NO').toString().trim() +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(17, 1);
                s_cast_div_no_1;
                //是否将钢牌号联查出来
                popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
                popFreeEdit.setValue({ PRINT_NO: s_SLAB_NO });
              } else {
                erFormHelper.messageInfo('板坯号长度不为20位或21位,请重新确认！');
                return;
              }

              popFreeEdit.setValue({ BATCH: popFreeEdit.getValue('MAT_NO').toString() });
              popFreeEdit.setValue({ HEAT_NO: popFreeEdit.getValue('MAT_NO').toString().substr(0, 8) });
            }
            if (e.itemCode === 'ST_NO') {
              const eiInfo = new EI.EIInfo();
              const eiBlock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
              eiBlock.addColumn('PROC_DIV', 'MMSM01A1_ST_NO'); //传表名
              eiBlock.addColumn('ST_NO11', popFreeEdit.getValue('ST_NO').toString().trim()); //熔炼号
              eiInfo.addBlock(eiBlock, '');

              console.log('eiInfo', eiInfo);
              const outInfo = await erFormHelper.callService('mmsmgetdata_inq', eiInfo, true, false, true);
              //判断调后台是否失败
              if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
              }
              if (outInfo.getBlock(0).data[0]['SG_GRADE_1']?.toString().trim() != '') {
                popFreeEdit.setValue({ SG_GRADE_1: outInfo.getBlock(0).data[0]['SG_GRADE_1']?.toString().trim() });
              }
              //STEEL_GROUP;
              const s_DIV = popFreeEdit.getValue('C_DIV').toString().trim();
              let s_STEEL_GROUP_1 = '';
              //1 不锈钢  2碳钢
              if (s_DIV == '1') {
                s_STEEL_GROUP_1 = 'S';
              } else if (s_DIV == '2') {
                s_STEEL_GROUP_1 = 'C';
              }
              popFreeEdit.setValue({ STEEL_GROUP: s_STEEL_GROUP_1 + popFreeEdit.getValue('ST_NO').toString().trim() });
              const s_SLAB_NO =
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(0, 8) +
                popFreeEdit.getValue('ST_NO').toString().trim() +
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14);
              //是否将钢牌号联查出来
              popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
              popFreeEdit.setValue({ PRINT_NO: s_SLAB_NO });
            }
            if (e.itemCode == 'STRAND_NO') {
              const s_SLAB_NO =
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(0, 14) +
                popFreeEdit.getValue('STRAND_NO').toString() +
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(15);
              //是否将钢牌号联查出来
              popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
              popFreeEdit.setValue({ PRINT_NO: s_SLAB_NO });
            }
          });
        }
      }
      //修改
      if (Click_name === 'F4') {
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === cs_dialog) {
          popFreeEdit.FormHelper.setControlReadOnly('LayoutGroupF4', true, 'HEAT_NO', 'PONO');
          popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));

          /*  popFreeEdit.setEvent('itemValueChanged', async (e: any) => {
            if (e.itemCode === 'MAT_NO') {
              //获取浇内顺序号
              const eiInfo = new EI.EIInfo();
              const eiBlock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
              eiBlock.addColumn('PROC_DIV', 'MMSM01A1_MAT_NO'); //传表名
              eiBlock.addColumn('HEAT_NO_01A1', popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8)); //熔炼号
              eiInfo.addBlock(eiBlock, '');

              console.log('eiInfo', eiInfo);
              const outInfo = await erFormHelper.callService('mmsmgetdata_inq', eiInfo, true, false, true);
              //判断调后台是否失败
              if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
              }

              console.log('outInfo', outInfo.getBlock(0).data[0]);
              //对于1位和2位的浇内顺序号，进行补0操作
              let s_cast_div_no = outInfo.getBlock(0).data[0]['CAST_DIV_NO']?.toString();
              if (s_cast_div_no?.length == 1) {
                s_cast_div_no = '00' + s_cast_div_no;
              } else if (s_cast_div_no?.length == 2) {
                s_cast_div_no = '0' + s_cast_div_no;
              }

              if (outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() != '') {
                popFreeEdit.setValue({ SM_PLAN_NO: outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() });
              }

              if (popFreeEdit.getValue('SLAB_NO').toString().length == 20) {
                //判断
                const s_SLAB_NO =
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
                  popFreeEdit.getValue('ST_NO').toString().trim() +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
                  s_cast_div_no;
                //是否将钢牌号联查出来

                popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
              } else if (popFreeEdit.getValue('SLAB_NO').toString().length == 21) {
                const s_SLAB_NO =
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
                  popFreeEdit.getValue('ST_NO').toString().trim() +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(17, 1);
                s_cast_div_no;
                //是否将钢牌号联查出来
                popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
              } else {
                erFormHelper.messageInfo('板坯号长度不为20位或21位,请重新确认！');
                return;
              }

              popFreeEdit.setValue({ BATCH: popFreeEdit.getValue('MAT_NO').toString() });
              popFreeEdit.setValue({ HEAT_NO: popFreeEdit.getValue('MAT_NO').toString().substr(0, 8) });
            }
            if (e.itemCode === 'ST_NO') {
              const eiInfo = new EI.EIInfo();
              const eiBlock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
              eiBlock.addColumn('PROC_DIV', 'MMSM01A1_ST_NO'); //传表名
              eiBlock.addColumn('ST_NO11', popFreeEdit.getValue('ST_NO').toString().trim()); //熔炼号
              eiInfo.addBlock(eiBlock, '');

              console.log('eiInfo', eiInfo);
              const outInfo = await erFormHelper.callService('mmsmgetdata_inq', eiInfo, true, false, true);
              //判断调后台是否失败
              if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
              }
              if (outInfo.getBlock(0).data[0]['SG_GRADE_1']?.toString().trim() != '') {
                popFreeEdit.setValue({ SG_GRADE_1: outInfo.getBlock(0).data[0]['SG_GRADE_1']?.toString().trim() });
              }
              const s_SLAB_NO =
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(0, 8) +
                popFreeEdit.getValue('ST_NO').toString().trim() +
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14);
              //是否将钢牌号联查出来
              popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
            }
          }); */
        }
      }
      //拆批
      if (Click_name === 'F6') {
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === cs_dialog) {
          popFreeEdit.FormHelper.setControlReadOnly('LayoutGroupF6', true);
          // popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));
        }
      }
      //修改过渡坯
      if (Click_name === 'F7') {
        if (i_windowsNumber === cs_dialog) {
          popFreeEdit.FormHelper.setControlReadOnly('LayoutGroupF7', true, 'HEAT_NO', 'PONO');
          popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));

          popFreeEdit.setEvent('itemValueChanged', async (e: any) => {
            if (e.itemCode === 'MAT_NO') {
              //获取浇内顺序号
              const eiInfo = new EI.EIInfo();
              const eiBlock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
              eiBlock.addColumn('PROC_DIV', 'MMSM01A1_MAT_NO'); //传表名
              eiBlock.addColumn('HEAT_NO_01A1', popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8)); //熔炼号
              eiInfo.addBlock(eiBlock, '');

              console.log('eiInfo', eiInfo);
              const outInfo = await erFormHelper.callService('mmsmgetdata_inq', eiInfo, true, false, true);
              //判断调后台是否失败
              if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
              }

              console.log('outInfo', outInfo.getBlock(0).data[0]);
              //对于1位和2位的浇内顺序号，进行补0操作
              let s_cast_div_no = outInfo.getBlock(0).data[0]['CAST_DIV_NO']?.toString();
              if (s_cast_div_no?.length == 1) {
                s_cast_div_no = '00' + s_cast_div_no;
              } else if (s_cast_div_no?.length == 2) {
                s_cast_div_no = '0' + s_cast_div_no;
              }

              if (outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() != '') {
                popFreeEdit.setValue({ SM_PLAN_NO: outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() });
              }
              if (outInfo.getBlock(0).data[0]['PONO']?.toString().trim() != '') {
                popFreeEdit.setValue({ PONO: outInfo.getBlock(0).data[0]['PONO']?.toString().trim() });
              }

              if (popFreeEdit.getValue('SLAB_NO').toString().length == 20) {
                //判断
                const s_SLAB_NO =
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
                  popFreeEdit.getValue('ST_NO').toString().trim() +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
                  s_cast_div_no;
                //是否将钢牌号联查出来

                popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
              } else if (popFreeEdit.getValue('SLAB_NO').toString().length == 21) {
                const s_SLAB_NO =
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
                  popFreeEdit.getValue('ST_NO').toString().trim() +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
                  popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
                  popFreeEdit.getValue('SLAB_NO').toString().trim().substr(17, 1);
                s_cast_div_no;
                //是否将钢牌号联查出来
                popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
              } else {
                erFormHelper.messageInfo('板坯号长度不为20位或21位,请重新确认！');
                return;
              }

              popFreeEdit.setValue({ BATCH: popFreeEdit.getValue('MAT_NO').toString() });
              popFreeEdit.setValue({ HEAT_NO: popFreeEdit.getValue('MAT_NO').toString().substr(0, 8) });
            }
            if (e.itemCode === 'ST_NO') {
              const eiInfo = new EI.EIInfo();
              const eiBlock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
              eiBlock.addColumn('PROC_DIV', 'MMSM01A1_ST_NO'); //传表名
              eiBlock.addColumn('ST_NO11', popFreeEdit.getValue('ST_NO').toString().trim()); //熔炼号
              eiInfo.addBlock(eiBlock, '');

              console.log('eiInfo', eiInfo);
              const outInfo = await erFormHelper.callService('mmsmgetdata_inq', eiInfo, true, false, true);
              //判断调后台是否失败
              if (outInfo.sys.status < 0) {
                erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
              }
              if (outInfo.getBlock(0).data[0]['SG_GRADE_1']?.toString().trim() != '') {
                popFreeEdit.setValue({ SG_GRADE_1: outInfo.getBlock(0).data[0]['SG_GRADE_1']?.toString().trim() });
              }
              //STEEL_GROUP;
              const s_DIV = popFreeEdit.getValue('C_DIV').toString().trim();
              let s_STEEL_GROUP = '';
              //1 不锈钢  2碳钢
              if (s_DIV == '1') {
                s_STEEL_GROUP = 'S';
              } else if (s_DIV == '2') {
                s_STEEL_GROUP = 'C';
              }
              popFreeEdit.setValue({ STEEL_GROUP: s_STEEL_GROUP + popFreeEdit.getValue('ST_NO').toString().trim() });
              const s_SLAB_NO =
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(0, 8) +
                popFreeEdit.getValue('ST_NO').toString().trim() +
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14);
              //是否将钢牌号联查出来
              popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
            }
            if (e.itemCode == 'STRAND_NO') {
              const s_SLAB_NO =
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(0, 14) +
                popFreeEdit.getValue('STRAND_NO').toString() +
                popFreeEdit.getValue('SLAB_NO').toString().trim().substr(15);
              //是否将钢牌号联查出来
              popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
            }
          });
          // popFreeEdit.setEvent('ok', async (e: any) => {

          //     //获取浇内顺序号
          //     const eiInfo = new EI.EIInfo();
          //     const eiBlock = erFormHelper.getGridSelectRowsAsBlock('GridView1');
          //     eiBlock.addColumn('PROC_DIV', 'MMSM01A1_MAT_NO'); //传表名
          //     eiBlock.addColumn('HEAT_NO_01A1', popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8)); //熔炼号
          //     eiInfo.addBlock(eiBlock, '');

          //     console.log('eiInfo', eiInfo);
          //     const outInfo = await erFormHelper.callService('mmsmgetdata_inq', eiInfo, true, false, true);
          //     //判断调后台是否失败
          //     if (outInfo.sys.status < 0) {
          //       erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
          //     }

          //     console.log('outInfo', outInfo.getBlock(0).data[0]);
          //     //对于1位和2位的浇内顺序号，进行补0操作
          //     let s_cast_div_no = outInfo.getBlock(0).data[0]['CAST_DIV_NO']?.toString();
          //     if (s_cast_div_no?.length == 1) {
          //       s_cast_div_no = '00' + s_cast_div_no;
          //     } else if (s_cast_div_no?.length == 2) {
          //       s_cast_div_no = '0' + s_cast_div_no;
          //     }

          //     if (outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() != '') {
          //       popFreeEdit.setValue({ SM_PLAN_NO: outInfo.getBlock(0).data[0]['SM_PLAN_NO']?.toString().trim() });
          //     }
          //     if (outInfo.getBlock(0).data[0]['PONO']?.toString().trim() != '') {
          //       popFreeEdit.setValue({ PONO: outInfo.getBlock(0).data[0]['PONO']?.toString().trim() });
          //     }

          //     if (popFreeEdit.getValue('SLAB_NO').toString().length == 20) {
          //       //判断
          //       const s_SLAB_NO =
          //         popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
          //         popFreeEdit.getValue('ST_NO').toString().trim() +
          //         popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
          //         popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
          //         s_cast_div_no;
          //       //是否将钢牌号联查出来

          //       popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
          //     } else if (popFreeEdit.getValue('SLAB_NO').toString().length == 21) {
          //       const s_SLAB_NO =
          //         popFreeEdit.getValue('MAT_NO').toString().trim().substr(0, 8) +
          //         popFreeEdit.getValue('ST_NO').toString().trim() +
          //         popFreeEdit.getValue('SLAB_NO').toString().trim().substr(14, 1) +
          //         popFreeEdit.getValue('MAT_NO').toString().trim().substr(8, 2) +
          //         popFreeEdit.getValue('SLAB_NO').toString().trim().substr(17, 1);
          //       s_cast_div_no;
          //       //是否将钢牌号联查出来
          //       popFreeEdit.setValue({ SLAB_NO: s_SLAB_NO });
          //     } else {
          //       erFormHelper.messageInfo('板坯号长度不为20位或21位,请重新确认！');
          //       return;
          //     }

          //     popFreeEdit.setValue({ BATCH: popFreeEdit.getValue('MAT_NO').toString() });
          //     popFreeEdit.setValue({ HEAT_NO: popFreeEdit.getValue('MAT_NO').toString().substr(0, 8) });

          // });
        }
      }
      if (Click_name === 'F8') {
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === cs_dialog) {
          popFreeEdit.FormHelper.setControlReadOnly('LayoutGroupF8', true, 'HEAT_NO', 'PONO');
          popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));
        }
      }
      //管理封锁
      if (Click_name === 'F10') {
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === cs_dialog) {
          popFreeEdit.FormHelper.setControlReadOnly('LayoutGroupF10', true);
          popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));
        }
      }
      //管理释放封锁
      if (Click_name === 'F11') {
        //popFreeEdit.AllowEidt = true;
        if (i_windowsNumber === cs_dialog) {
          popFreeEdit.FormHelper.setControlReadOnly('LayoutGroupF11', true);
          popFreeEdit.ReceiveData(erFormHelper.getGridCurrentRow('GridView1'));
        }
      }
    };

    //F2按钮查询
    const F2_DO = async (e: any) => {
      //Query();
      queryMainGrid();
      // erFormHelper.excuteGridServerPaging('GridView1', 0);
    };
    //F3按钮新增
    const F3_DO = async (e: any) => {
      // 弹出新增画面
      cs_OkClick = 'F3';
      i_windowsNumber = cs_dialog;
      //模板参数
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      //加载弹窗配置
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      //queryMainGrid();
    };

    //修改
    const F4_DO = async (e: any) => {
      // 弹出新增画面
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //判断是否有选中行
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请勾选数据行！');
        return;
      }
      cs_OkClick = 'F4';
      i_windowsNumber = cs_dialog;
      //模板参数
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      //加载弹窗配置
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      //添加

      console.log('11111');
      //erFormHelper.excuteGridServerPaging('GridView1', 0);
      editable.value = false;
      erFormHelper.setGridEditable('gridView1', false);
    };

    //删除
    const F5_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //判断是否有选中行
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请勾选数据行！');
        return;
      }
      if (selectedRows.data[0]['RCV_MAT_FLAG'] === 'S' || selectedRows.data[0]['RCV_MAT_FLAG'] === 'W') {
        erFormHelper.messageInfo('该条数据已收货,请重新确认！');
        return;
      }
      eiInfo.addBlock(selectedRows, 'Table0');
      eiInfo.getBlock(0).data[0]['ORIGIN_MAT_NO'] = '';
      eiInfo.getBlock(0).data[0]['STOCK_NO'] = '';
      eiInfo.getBlock(0).data[0]['IN_FLAG'] = '';
      eiInfo.getBlock(0).data[0]['PRODUCT_FLAG'] = '';
      eiInfo.getBlock(0).data[0]['SG_SIGN'] = '';
      const outInfo = await erFormHelper.callService('mmsm01a1f5_del', eiInfo);
      if (outInfo.sys.status < 0) {
        //维护完成重新查询
        erFormHelper.messageError('查询错误：' + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageSuccess('操作成功');
        queryMainGrid();
      }
      //queryMainGrid();
      //erFormHelper.excuteGridServerPaging('GridView1', 0);
    };
    //拆批
    const F6_DO = async (e: any) => {
      //获取当前新增行
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //判断是否有选中行
      if (selectedRows.data.length === 0) {
        // erFormHelper.messageInfo('请勾选数据行！');
        // return;
      }
      cs_OkClick = 'F6';
      i_windowsNumber = cs_dialog;
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      editable.value = false;
      erFormHelper.setGridEditable('gridView1', false);
      //queryMainGrid();
      //erFormHelper.excuteGridServerPaging('GridView1', 0);
    };
    //并批
    const F7_DO = async (e: any) => {
      //获取当前新增行
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //判断是否有选中行
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请勾选数据行！');
        return;
      }
      cs_OkClick = 'F7';
      i_windowsNumber = cs_dialog;
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      editable.value = false;
      erFormHelper.setGridEditable('gridView1', false);
      //queryMainGrid();
      //erFormHelper.excuteGridServerPaging('GridView1', 0);
    };
    //在制品转成品
    const F8_DO = async (e: any) => {
      //获取当前新增行
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //判断是否有选中行
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请勾选数据行！');
        return;
      }
      cs_OkClick = 'F8';
      i_windowsNumber = cs_dialog;
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
      editable.value = false;
      erFormHelper.setGridEditable('gridView1', false);
      // queryMainGrid();
      //erFormHelper.excuteGridServerPaging('GridView1', 0);
    };
    //成品转在制品
    const F9_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const selectedRows = erFormHelper.getGridSelectRowsAsBlock(gridView1);
      //判断是否有选中行
      if (selectedRows.data.length === 0) {
        erFormHelper.messageInfo('请勾选数据行！');
        return;
      }
      eiInfo.addBlock(selectedRows, 'Table0');
      let outInfo: EI.EIInfo = new EI.EIInfo();
      outInfo = await erFormHelper.callService('mmsm01a1f9_pro', eiInfo, false, true);
      //queryMainGrid();
      //erFormHelper.excuteGridServerPaging('GridView1', 0);
    };
    //管理封锁
    const F10_DO = async (e: any) => {
      cs_OkClick = 'F10';
      i_windowsNumber = cs_dialog;
      //模板参数
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      //加载弹窗配置
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };
    //管理释放封锁
    const F11_DO = async (e: any) => {
      cs_OkClick = 'F11';
      i_windowsNumber = cs_dialog;
      //模板参数
      popFreeEdit_paras(i_windowsNumber, cs_OkClick);
      //加载弹窗配置
      ER.PopUtils.showErPopFree(ErPopFree, popFreeEdit, popFreeEditOkClick);
    };

    const F12_DO = async (e: any) => {
      const mainGridCurrentRow = erFormHelper.getGridCurrentRow(gridView1);
      //跳转
      EFCallForm('MMSM96S2N', { MAT_NO: mainGridCurrentRow.MAT_NO });
    };

    return {
      erGrid1Ready,
      handleTabChange,
      tab1ActiveKey,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F7_DO,
      F8_DO,
      F9_DO,
      F10_DO,
      F11_DO,
      F12_DO,
      GridView1FocusChanged
    };
  }
});
