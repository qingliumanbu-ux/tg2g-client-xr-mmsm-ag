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
import { Console, error } from 'console';
import { constants } from 'fs/promises';

export default defineComponent({
    name: 'MMSM35POP',
    components: { xrEfForm, xrEfPanel, erLayout, erGrid },
    props: {
        openInDialog: {
            type: Boolean,
            default: false
        },
        dialogFormName: {
            type: String,
            default: ''
        },
        parentInfo: {
            type: Object
        }
    },
    // 向父画面传递数据-注册emit监听事件
    emits: ['getChildInfo'],
    setup: (props, { emit }) => {
    // 变量定义
    let formParams: any = '';
    let formPartition: any = '';
    let v_prod_shift_group = '';
    const initializeService = '';
    let formName = ''; // 当前画面名
    let now = new Date();
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    const initializeFlag = ref(0);
    let gridView1: any;
    const grid_view_1 = ref('');
    // 获取画面相关配置信息
    const efFormInitialized = (formInfo: any) => {
            formParams = formInfo;
            formPartition = formParams.formPartition;
            formName = formParams.formName;
            console.log('11111111');
            /* nextTick(() => {
              initializePage();
            }); */
        };

    const efFormReady = (e: any) => {
            efFormInfo.value = e.formInfo;
            efFormIsReady.value = true;
            formPartition = efFormInfo.value.formPartition;
            formName = efFormInfo.value.formName; // 当前画面名
            // 初始化低代码工具类
            initializePage();
        };

    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    //分切数
    const CUT_NUM = parentInfo.value?.CUT_NUM;
    //材料号
    const MAT_NO = parentInfo.value?.MAT_NO;
    //材料长度
    const matLen = parentInfo.value?.MAT_ACT_LEN;
    //材料宽度
    const matwidth = parentInfo.value?.MAT_ACT_WIDTH;
    //材料厚度
    const matthick = parentInfo.value?.MAT_ACT_THICK;
    //材料重量
    const matWt = parentInfo.value?.MAT_ACT_WT;
    //根数
    const matTube = parentInfo.value?.MAT_NUM;
    //批次号
    const BATCH = parentInfo.value?.BATCH;
    //喷印号
    const PRINT_NO = parentInfo.value?.PRINT_NO;
    //板坯号
    const SLAB_NO = parentInfo.value?.SLAB_NO;
    //熔炼号
    const HEAT_NO = parentInfo.value?.HEAT_NO;
    //钢种
    const ST_NO = parentInfo.value?.ST_NO;
    //获取功能名--按钮名称
    const FORMNAME = parentInfo.value?.FORMNAME;
    // 是否显示layout2 tab页
    const isLayout2Visib = ref<boolean>(true);
    // 是否显示grid tab页
    const isGridVisib = ref<boolean>(true);

    let new_BATCH: any;
    let new_PRINT_NO: any;

        if (FORMNAME == 'F6') {
            isGridVisib.value = false;
            isLayout2Visib.value = true;
        } else if (FORMNAME == 'F7') {
            isGridVisib.value = true;
            isLayout2Visib.value = false;
    }
    // 画面相关数据初始化
    const initializePage = async() => {
      const initialResult = await erFormHelper.Initialize(formPartition, formName, '', initializeService);
            if (initialResult.flag >= 0) {
                // 画面工具类初始化成功后将画面渲染条件设置为1
                initializeFlag.value = 1;
                // 回调函数获取控件信息及设置定义事件等操作
                // setTimeout(() => {
                //   // 获取画面上的主要控件信息
                //   handleEfDialogMessage();
                // }, 5);
                nextTick(() => {
                    handleEfDialogMessage();
                });
                if (FORMNAME === 'F7') {
                    setControlVisibleAndValue(0);
                } else if (FORMNAME === 'F6') {
                    setControlVisibleAndValue(CUT_NUM);
                }
            } else {
                erFormHelper.messageError('ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!');
            }
    };

    const erGrid1Ready = () => {
            gridView1 = erFormHelper.getGrid('GridView1');
            erFormHelper.setGridEditable(grid_view_1.value, false);
            erFormHelper.setGridToolbarVisible('GridView1', {
                addrow: false,
                copyrow: false,
                excel: true
            });

        };

        onMounted(() => {
            //initializePage();
            handleEfDialogMessage();
        });

    //layout1值发生改变事件
    const layout_valueChanged1 = (e: any) => {
            if (e.itemCode === 'MAT_LEN_1') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        const wt_mat1 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_1', wt_mat1);
                console.log('wt_mat1', wt_mat1);
        //  const wt_mat1 = parseFloat((erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)
        //                   /erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')
        //                   *erFormHelper.getControlValue('layoutControlGroup1','IN_MAT_WT')).toFixed(3));
        //  erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_1', wt_mat1);
        //  console.log('wt_mat1', wt_mat1);

        // console.log('ST_NO', ST_NO);
        // console.log('ST_NO',ST_NO.substring(0,2));
        // if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //   const density = 7.95;
        //   console.log('density',density);
        //   const wt_mat1 =
        //     (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //     (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //     (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //   erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_1', wt_mat1);
        //   console.log('wt_mat1',wt_mat1);

        // }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //   const density = 7.9;
        //   console.log('density',density)
        //   const wt_mat1 =
        //     (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //     (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //     (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //   erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_1', wt_mat1);
        //   console.log('wt_mat1',wt_mat1)

        // }else{
        //   const density = 7.85;
        //   console.log('density',density)
        //   const wt_mat1 =
        //     (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //     (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //     (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //   erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_1', wt_mat1);
        //   console.log('wt_mat1',wt_mat1);
        // }
        //console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);
      }
            if (e.itemCode === 'MAT_LEN_2') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        //   console.log('ST_NO',ST_NO.substring(0,2));
        //   if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //     const density = 7.95;
        //     console.log('density',density);
        //     const wt_mat2 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_2', wt_mat2);
        //     console.log('wt_mat2',wt_mat2);

        //   }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //     const density = 7.9;
        //     console.log('density',density)
        //     const wt_mat2 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_2', wt_mat2);
        //     console.log('wt_mat2',wt_mat2)

        //   }else{
        //     const density = 7.85;
        //     console.log('density',density)
        //     const wt_mat2 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_2', wt_mat2);
        //     console.log('wt_mat2',wt_mat2);
        //  }
        //  console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //  console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);

        const wt_mat2 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_2', wt_mat2);
      }
            if (e.itemCode === 'MAT_LEN_3') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        //   console.log('ST_NO',ST_NO.substring(0,2));
        //   if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //     const density = 7.95;
        //     console.log('density',density);
        //     const wt_mat3 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_3', wt_mat3);
        //     console.log('wt_mat3',wt_mat3);

        //   }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //     const density = 7.9;
        //     console.log('density',density)
        //     const wt_mat3 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_3', wt_mat3);
        //     console.log('wt_mat3',wt_mat3)

        //   }else{
        //     const density = 7.85;
        //     console.log('density',density)
        //     const wt_mat3 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_3', wt_mat3);
        //     console.log('wt_mat3',wt_mat3);
        //  }
        //  console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //  console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);
        const wt_mat3 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_3', wt_mat3);
      }
            if (e.itemCode === 'MAT_LEN_4') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        //   console.log('ST_NO',ST_NO.substring(0,2));
        //   if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //     const density = 7.95;
        //     console.log('density',density);
        //     const wt_mat4 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_4', wt_mat4);
        //     console.log('wt_mat4',wt_mat4);

        //   }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //     const density = 7.9;
        //     console.log('density',density)
        //     const wt_mat4 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_4', wt_mat4);
        //     console.log('wt_mat4',wt_mat4)

        //   }else{
        //     const density = 7.85;
        //     console.log('density',density)
        //     const wt_mat4 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_4', wt_mat4);
        //     console.log('wt_mat4',wt_mat4);
        //  }
        //  console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //  console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);
        const wt_mat4 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_4', wt_mat4);
      }
            if (e.itemCode === 'MAT_LEN_5') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        //   console.log('ST_NO',ST_NO.substring(0,2));
        //   if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //     const density = 7.95;
        //     console.log('density',density);
        //     const wt_mat5 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_5', wt_mat5);
        //     console.log('wt_mat5',wt_mat5);

        //   }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //     const density = 7.9;
        //     console.log('density',density)
        //     const wt_mat5 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_5', wt_mat5);
        //     console.log('wt_mat5',wt_mat5)

        //   }else{
        //     const density = 7.85;
        //     console.log('density',density)
        //     const wt_mat5 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_5', wt_mat5);
        //     console.log('wt_mat5',wt_mat5);
        //  }
        //  console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //  console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);
        const wt_mat5 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_5', wt_mat5);
      }
            if (e.itemCode === 'MAT_LEN_6') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        //   console.log('ST_NO',ST_NO.substring(0,2));
        //   if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //     const density = 7.95;
        //     console.log('density',density);
        //     const wt_mat6 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_6', wt_mat6);
        //     console.log('wt_mat6',wt_mat6);

        //   }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //     const density = 7.9;
        //     console.log('density',density)
        //     const wt_mat6 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_6', wt_mat6);
        //     console.log('wt_mat6',wt_mat6)

        //   }else{
        //     const density = 7.85;
        //     console.log('density',density)
        //     const wt_mat6 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_6', wt_mat6);
        //     console.log('wt_mat6',wt_mat6);
        //  }
        //  console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //  console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);
        const wt_mat6 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_6', wt_mat6);
      }
            if (e.itemCode === 'MAT_LEN_7') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        //   console.log('ST_NO',ST_NO.substring(0,2));
        //   if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //     const density = 7.95;
        //     console.log('density',density);
        //     const wt_mat7 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_7', wt_mat7);
        //     console.log('wt_mat7',wt_mat7);

        //   }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //     const density = 7.9;
        //     console.log('density',density)
        //     const wt_mat7 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_7', wt_mat7);
        //     console.log('wt_mat7',wt_mat7)

        //   }else{
        //     const density = 7.85;
        //     console.log('density',density)
        //     const wt_mat7 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_7', wt_mat7);
        //     console.log('wt_mat7',wt_mat7);
        //  }
        //  console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //  console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);
        const wt_mat7 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_7', wt_mat7);
      }
            if (e.itemCode === 'MAT_LEN_8') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_9');
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);

                console.log('len_sum', len_sum);

        //   console.log('ST_NO',ST_NO.substring(0,2));
        //   if (ST_NO.substring(0,2) === '1A' || ST_NO.substring(0,2)==='1D') {
        //     const density = 7.95;
        //     console.log('density',density);
        //     const wt_mat8 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_8', wt_mat8);
        //     console.log('wt_mat8',wt_mat8);

        //   }else if (ST_NO.substring(0,2) === '1F' || ST_NO.substring(0,2)==='1M' || ST_NO.substring(0,2)==='1P') {
        //     const density = 7.9;
        //     console.log('density',density)
        //     const wt_mat8 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_8', wt_mat8);
        //     console.log('wt_mat8',wt_mat8)

        //   }else{
        //     const density = 7.85;
        //     console.log('density',density)
        //     const wt_mat8 =
        //       (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode)/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000) *
        //       (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000) * density;
        //     erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_8', wt_mat8);
        //     console.log('wt_mat8',wt_mat8);
        //  }
        //  console.log('CUT_AFTER_WIDTH',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH')/1000);
        //  console.log('CUT_AFTER_THICK',erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_THICK')/1000);
        const wt_mat8 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_8', wt_mat8);
      }
            if (e.itemCode === 'MAT_LEN_9') {
        const len_sum =
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_1') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_2') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_3') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_4') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_5') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_6') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_7') +
                erFormHelper.getControlValue('layoutControlGroup1', 'MAT_LEN_8') +
                erFormHelper.getControlValue('layoutControlGroup1', e.itemCode);
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum);
                console.log('len_sum', len_sum);
        const wt_mat9 =
                (erFormHelper.getControlValue('layoutControlGroup1', e.itemCode) /
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_LEN')) *
                erFormHelper.getControlValue('layoutControlGroup1', 'IN_MAT_WT');
                erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_9', wt_mat9);
      }
      const cutscorp_len =
            erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_LEN') -
            erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_LEN');
            erFormHelper.setControlValue('layoutControlGroup2', 'OTHER_CUT_LEN', cutscorp_len);

      //切后重量改变
      // const wt_sum =
      //  parseFloat(( erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_1')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_2')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_3')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_4')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_5')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_6')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_7')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_8')+
      // erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_9')).toFixed(3));
      const wt_sum =
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_1') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_2') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_3') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_4') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_5') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_6') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_7') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_8') +
            erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_9');

            erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WT', wt_sum);
            console.log('wt_sum', wt_sum);

      //切废重量
      const cutscorp_wt =
            erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_WT') -
            erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WT');
            erFormHelper.setControlValue('layoutControlGroup2', 'CUT_SCRAP_WT', cutscorp_wt);

            //切废重量大于0时加到最后一支材料上
            // if ((erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_WT') -
            // erFormHelper.getControlValue('layoutControlGroup2', 'CUT_AFTER_WT')) > 0) {
            //   const wt_mat_i = erFormHelper.getControlValue('layoutControlGroup1', 'MAT_WT_'+ CUT_NUM) + cutscorp_wt;
            //   erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_'+ CUT_NUM, wt_mat_i);
            //   console.log('wt_mat_i', wt_mat_i);
            // }
        };

    //layout值发生改变事件
    const layout_valueChanged = (e: any) => {
            //录入切后规格和重量，自动算出来切废长度和切废重量
            //切废长度
            if (e.itemCode === 'CUT_AFTER_LEN') {
        const cutscorp_len =
                erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_LEN') -
                erFormHelper.getControlValue('layoutControlGroup2', e.itemCode);
                erFormHelper.setControlValue('layoutControlGroup2', 'OTHER_CUT_LEN', cutscorp_len);

                console.log('cutscorp_len', cutscorp_len);
      }
            //切废重量
            if (e.itemCode === 'CUT_AFTER_WT') {
        const cutscorp_wt =
                erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_WT') -
                erFormHelper.getControlValue('layoutControlGroup2', e.itemCode);
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_SCRAP_WT', cutscorp_wt);
      }
            //切废宽度
            if (e.itemCode === 'CUT_AFTER_WIDTH') {
        const cutscorp_width =
                erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_WIDTH') -
                erFormHelper.getControlValue('layoutControlGroup2', e.itemCode);
                erFormHelper.setControlValue('layoutControlGroup2', 'MAT_WIDTH_SCRAP_CUT', cutscorp_width);
      }
        };

    const handleEfDialogMessage = () => {
      const perMileWt = matWt / matTube / (matLen / 1000);
      const aftCutLen = Math.floor(matLen / CUT_NUM); //切后长度
      const aftCutWt = parseFloat((Math.floor(perMileWt * (aftCutLen / 1000) * matTube * 1000) / 1000).toFixed(3)); //切后重量
      const cutFlen = matLen - aftCutLen * CUT_NUM; //切废长度
      const cutFWt = matWt - aftCutWt * CUT_NUM; //切废重量
      const len_sum = aftCutLen * CUT_NUM; //切后总长度
      const wt_sum = aftCutWt * CUT_NUM; //切后总重量
      const aftCutWidth = matwidth; //切后宽度
      const aftCutThick = matthick; //切后厚度
            //分切录入
            if (FORMNAME === 'F7') {
                setControlVisibleAndValue(0);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_NO', MAT_NO);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_BATCH', BATCH);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_PRINT_NO', PRINT_NO);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_SLAB_NO', SLAB_NO);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_LEN', matLen);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_WT', matWt);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_TUBE', matTube);
                getT01value(); //调用查询，查询已经新增和待新增的数据

                //切前长度
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_LEN', matLen);
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_WIDTH', matwidth);
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_THICK', matthick);
                //切前重量
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_WT', matWt);
                //切后长、宽、 厚、重量
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum); //切后长度
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WT', wt_sum); //切后重量
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH', aftCutWidth); //切后宽度
                erFormHelper.setControlValue('layoutControlGroup2', 'MAT_WIDTH_SCRAP_CUT', matwidth - aftCutWidth); //切废宽度
                erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_THICK', aftCutThick); //切后厚度
                //大于0的切废量才会带入到画面的切废中
                if (cutFWt >= 0) {
                    //  erFormHelper.setControlValue('layoutControlGroup2', 'CUT_SCRAP_WT', cutFWt); //切废重量
                    //  erFormHelper.setControlValue('layoutControlGroup2', 'OTHER_CUT_LEN', cutFlen); //切废长度
                    erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_1', aftCutWt + cutFWt); //切废重量加到第一块坯子
                    erFormHelper.setControlValue('layoutControlGroup1', 'MAT_LEN_1', aftCutLen + cutFlen); //切废长度加到第一块坯子
                    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WT', matWt); //切后重量
                    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', matLen); //切后长度
                }
                erFormHelper.setControlValue('layoutControlGroup2', 'RECUT_DATE', now); //改切日期

            } else if (FORMNAME === 'F6') {
                setControlVisibleAndValue(CUT_NUM);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_NO', MAT_NO);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_BATCH', BATCH);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_PRINT_NO', PRINT_NO);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_SLAB_NO', SLAB_NO);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_LEN', matLen);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_WT', matWt);
                erFormHelper.setControlValue('layoutControlGroup1', 'IN_MAT_TUBE', matTube);
                getT01value();
        for (let i = 1; i <= CUT_NUM; i++) {
    erFormHelper.setControlValue('layoutControlGroup1', 'MAT_NO_' + i, MAT_NO + i + '0');
    //当为第一个值材料时，批次号和喷印号
    /*  if (i === 1) {
      erFormHelper.setControlValue('layoutControlGroup1', 'BATCH_' + i, MAT_NO);
      erFormHelper.setControlValue('layoutControlGroup1', 'PRINT_NO_' + i, PRINT_NO);
    } else {
      erFormHelper.setControlValue('layoutControlGroup1', 'BATCH_' + i, HEAT_NO + '3' + i);
      erFormHelper.setControlValue(
        'layoutControlGroup1',
        'PRINT_NO_' + i,
        PRINT_NO.substring(0, 15) + '3' + i + PRINT_NO.substring(17)
      );
    } */
    erFormHelper.setControlValue('layoutControlGroup1', 'MAT_LEN_' + i, aftCutLen);
    //erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_' + i, Math.max(aftCutWt, 3) );//小数点最大3位
    erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_' + i, aftCutWt); //小数点最大3位
    console.log('MAT_WT_', Math.max(aftCutWt, 3));

    erFormHelper.setControlValue('layoutControlGroup1', 'MAT_NUM_' + i, matTube);

    //切前长度
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_LEN', matLen);
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_WIDTH', matwidth);
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_THICK', matthick);
    //切前重量
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_BEFORE_WT', matWt);
    //切后长、宽、 厚、重量
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', len_sum); //切后长度
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WT', wt_sum); //切后重量
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WIDTH', aftCutWidth); //切后宽度
    erFormHelper.setControlValue('layoutControlGroup2', 'MAT_WIDTH_SCRAP_CUT', matwidth - aftCutWidth); //切废宽度
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_THICK', aftCutThick); //切后厚度
    //大于0的切废量才会带入到画面的切废中
    if (cutFWt >= 0) {
        //  erFormHelper.setControlValue('layoutControlGroup2', 'CUT_SCRAP_WT', cutFWt); //切废重量
        //  erFormHelper.setControlValue('layoutControlGroup2', 'OTHER_CUT_LEN', cutFlen); //切废长度
        erFormHelper.setControlValue('layoutControlGroup1', 'MAT_WT_1', aftCutWt + cutFWt); //切废重量加到第一块坯子
        erFormHelper.setControlValue('layoutControlGroup1', 'MAT_LEN_1', aftCutLen + cutFlen); //切废长度加到第一块坯子
        erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WT', matWt); //切后重量
        erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', matLen); //切后长度
    }
}
erFormHelper.setControlValue('layoutControlGroup2', 'RECUT_DATE', now); //改切日期
      }
    };

    //获取分切数据
    const getT01value = async() => {
      const eiInfo = new EI.EIInfo();

      const eiBlock = erFormHelper.getAllControlValueAsEiBlock('layoutControlGroup1', {
        //新加
        IN_MAT_NO: MAT_NO,
        IN_BATCH: BATCH,
        IN_PRINT_NO: PRINT_NO,
        IN_SLAB_NO: SLAB_NO,
        IN_MAT_LEN: matLen,
        IN_MAT_WT: matWt,
        //
        MAT_WIDTH: matwidth,
        MAT_THICK: matthick,
        CUT_NUM: CUT_NUM,
        HEAT_NO: HEAT_NO
    });
    if (FORMNAME === 'F7') {
        eiBlock.addColumn('PROC_DIV', 'F7');
    } else if (FORMNAME === 'F6') {
        eiBlock.addColumn('PROC_DIV', 'F6');
    }
    eiInfo.addBlock(eiBlock, '');
    console.log('eiInfo', eiInfo);
      const outInfo = await erFormHelper.callService('mmsm35popf2_inq', eiInfo);
    if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
    } else {
        if (FORMNAME === 'F7') {
            erFormHelper.mergeDataToGrid(outInfo, 'gridView1');
        } else if (FORMNAME === 'F6') {
          for (let j = 0; j < outInfo.getBlock(0).data.length; j++) {
                erFormHelper.setControlValue(
                    'layoutControlGroup1',
                    'BATCH_' + (j + 1),
                    outInfo.getBlock(0).data[j]['BATCH']
                    );
                erFormHelper.setControlValue(
                    'layoutControlGroup1',
                    'PRINT_NO_' + (j + 1),
                    outInfo.getBlock(0).data[j]['PRINT_NO']
                    );
                erFormHelper.setControlValue(
                    'layoutControlGroup1',
                    'SLAB_NO_' + (j + 1),
                    outInfo.getBlock(0).data[j]['SLAB_NO']
                    );
            }
        }
    }
    };

    //设置layout字段是否可见
    const setControlVisibleAndValue = (e: any) => {
      for (let i = 1; i <= 10; i++) {
        if (i > e) {
            erFormHelper.setControlVisible('layoutControlGroup1', false, `MAT_NO_${i}`, 'empty');
            erFormHelper.setControlVisible('layoutControlGroup1', false, `MAT_LEN_${i}`, 'empty');
            erFormHelper.setControlVisible('layoutControlGroup1', false, `MAT_WT_${i}`, 'empty');
            erFormHelper.setControlVisible('layoutControlGroup1', false, `MAT_NUM_${i}`, 'empty');
            erFormHelper.setControlVisible('layoutControlGroup1', false, `BATCH_${i}`, 'empty');
            erFormHelper.setControlVisible('layoutControlGroup1', false, `PRINT_NO_${i}`, 'empty');
            erFormHelper.setControlVisible('layoutControlGroup1', false, `SLAB_NO_${i}`, 'empty');
        }
    }
};

    //切废保存
    const SaveFeigang = async(e: any) => {
      const v_prod_shift_group = erFormHelper.getControlValue('layoutControlGroup2', 'PROD_SHIFT_GROUP');

      /* const layout1 = erFormHelper.getGridSelectRowsAsBlock('gridView1'); */
      const layout2 = erFormHelper.getAllControlValue('layoutControlGroup2');
    //当切废长度和切废重量都有的时候，确认为切废，存入39表
    if (layout2['CUT_SCRAP_WT'] || layout2['OTHER_CUT_LEN']) {
        // if (!layout2['RECUT_GROUP'] ) {
        //   console.log('有切废且没有切废班组');

        //   return false;
        // }else{
        console.log('有切废且有切废班组');

        const eiInfo = new EI.EIInfo();
        const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'PARA');
        eiBlock.pushData(
          {
            ...layout2,
                MAT_NO: MAT_NO,
                PRO_DIV: 'I',
                SAP_ERP_MATNR: '分切切废'
          },
            true
            );

        /*  eiInfo.addBlock(layout1, 'TMMSM01'); */

        console.log('eiInfo', eiInfo);
        const outInfo = await erFormHelper.callService('mmsm39f3_pro', eiInfo);
        // 判断调后台是否失败
        if (outInfo.sys.status < 0) {
            erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
        }
        //}
    }
    };

    const F2_DO = async(e: any) => {
    if (erFormHelper.getControlValue('layoutControlGroup2', 'CUT_SCRAP_WT') === -3.552713678800501e-15) {
        erFormHelper.setControlValue('layoutControlGroup2', 'CUT_SCRAP_WT', 0);
    }
    if (
        erFormHelper.getControlValue('layoutControlGroup2', 'OTHER_CUT_LEN') < 0 ||
        erFormHelper.getControlValue('layoutControlGroup2', 'CUT_SCRAP_WT') < 0
        ) {
        console.log('111111111111111', erFormHelper.getControlValue('layoutControlGroup2', 'OTHER_CUT_LEN'), );
        // const mes_res = await erFormHelper.messageConfirm('材料总规格超过入口材料规格，是否继续？');
        // if (!mes_res) {
        //   return false;
        // };
        erFormHelper.messageError('材料总规格超过入口材料规格，不能分切！');
    } else {
        const layout2 = erFormHelper.getAllControlValue('layoutControlGroup2');

        if (layout2['CUT_SCRAP_WT'] || layout2['OTHER_CUT_LEN']) {
            //有切废

            if (!layout2['RECUT_GROUP']) {
                //没有切废班组
                erFormHelper.messageError('有改切时请添加改切班组！');
                return false;
                //先调用切废，将切废数据补全(先用分切前的母坯数据生成切废数据，存入TMMSM39表)
            } else {
            // SaveFeigang(e);
            const layout2 = erFormHelper.getAllControlValue('layoutControlGroup2');
                //当切废长度和切废重量都有的时候，确认为切废，存入39表

                // if (!layout2['RECUT_GROUP'] ) {
                //   console.log('有切废且没有切废班组');

                //   return false;
                // }else{
                console.log('有切废且有切废班组');
                erFormHelper.stopGridEditing('gridView1', async() => {
              const eiInfo = new EI.EIInfo();
              const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'PARA');
                    eiBlock.pushData(
                {
                  ...layout2,
                            MAT_NO: MAT_NO,
                            PRO_DIV: 'I',
                            SAP_ERP_MATNR: '分切切废'
                },
                        true
                        );

                    /*  eiInfo.addBlock(layout1, 'TMMSM01'); */

                    console.log('eiInfo', eiInfo);
              await erFormHelper.callService('mmsm39f3_pro', eiInfo).then(async(res) => {
                        console.log('gyujhnjk')
                const eiInfo1 = new EI.EIInfo();

                const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
                const obj: any = {
                  ...layoutControlGroup1,
                            CUT_NUM: CUT_NUM,
                            MAT_NO: MAT_NO
                };

                        if (FORMNAME === 'F6') {
                  const eiBlock = eiInfo1.addBlock(new EI.EiBlock());
                            eiBlock.pushData(obj, true);
                } else if (FORMNAME === 'F7') {
                  const eiBlock = eiInfo1.addBlock(new EI.EiBlock(), 'TMMSM35MP');
                  const gridView1value = erFormHelper.getGridAllRowsAsBlock('gridView1');
                            eiBlock.pushData(obj, true);
                            eiInfo1.addBlock(gridView1value, 'TMMSM35');
                }
                        console.log('eiInfo1', eiInfo1);
                let outInfo_F2_DO = new EI.EIInfo();
                        if (FORMNAME === 'F6') {
                            outInfo_F2_DO = await erFormHelper.callService('mmsm35f6_cut', eiInfo1);
                        } else if (FORMNAME === 'F7') {
                            outInfo_F2_DO = await erFormHelper.callService('mmsm35f7_cut', eiInfo1);
                        }
                        if (outInfo_F2_DO.sys.status < 0) {
                            // 判断调后台是否失败
                            erFormHelper.messageError('保存错误:' + outInfo_F2_DO.sys.msg);
                        } else {
                            erFormHelper.messageSuccess('保存成功');

                            closeEfDialog();
                        }
                    }).catch(error => {
                            erFormHelper.messageError('保存错误:' + error);
                            return false;
                        });
              // console.log('outInfo', outInfo);
              // // 判断调后台是否失败
              // if (outInfo.sys.status < 0) {
              //   erFormHelper.messageError('保存错误:' + outInfo.sys.msg);
              //   return false;
              // }
              //}



            });
          }
        } else {
            erFormHelper.stopGridEditing('gridView1', async() => {
            const eiInfo = new EI.EIInfo();
            const layoutControlGroup1 = erFormHelper.getAllControlValue('layoutControlGroup1');
            const obj: any = {
              ...layoutControlGroup1,
                    CUT_NUM: CUT_NUM,
                    MAT_NO: MAT_NO
            };

                if (FORMNAME === 'F6') {
              const eiBlock = eiInfo.addBlock(new EI.EiBlock());
                    eiBlock.pushData(obj, true);
            } else if (FORMNAME === 'F7') {
              const eiBlock = eiInfo.addBlock(new EI.EiBlock(), 'TMMSM35MP');
              const gridView1value = erFormHelper.getGridAllRowsAsBlock('gridView1');
                    eiBlock.pushData(obj, true);
                    eiInfo.addBlock(gridView1value, 'TMMSM35');
            }
                console.log('eiInfo', eiInfo);
            let outInfo_F2_DO = new EI.EIInfo();
                if (FORMNAME === 'F6') {
                    outInfo_F2_DO = await erFormHelper.callService('mmsm35f6_cut', eiInfo);
                } else if (FORMNAME === 'F7') {
                    outInfo_F2_DO = await erFormHelper.callService('mmsm35f7_cut', eiInfo);
                }
                if (outInfo_F2_DO.sys.status < 0) {
                    // 判断调后台是否失败
                    erFormHelper.messageError('保存错误:' + outInfo_F2_DO.sys.msg);
                } else {
                    erFormHelper.messageSuccess('保存成功');

                    closeEfDialog();
                }
          });
        }
      }
    //}
};
    // 点击关闭按钮，绑定事件closeEfDialog
    // 向父画面传递数据-触发emit方法向父传递数据，并在emits中注册事件名
    const closeEfDialog = () => {
    console.log('123435');
      const data = {
        // name: formName,
        close: true
    };
    emit('getChildInfo', data);
};

    const cellValueChanged = (e: any) => {
      let fq_data = erFormHelper.getGridAllRowsAsBlock('gridView1').data;
    console.log('qwerftgbhvcdxsw', fq_data)
      erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_WT', fq_data.map(obj => obj.MAT_WT).reduce((acc, curr) => Number(acc) + Number(curr), 0)); //切后重量
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_SCRAP_WT', erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_WT') - Number(fq_data.map(obj => obj.MAT_WT).reduce((acc, curr) => Number(acc) + Number(curr), 0))); //切后重量
    erFormHelper.setControlValue('layoutControlGroup2', 'CUT_AFTER_LEN', fq_data.map(obj => obj.MAT_LEN).reduce((acc, curr) => Number(acc) + Number(curr), 0)); //切后长度
    erFormHelper.setControlValue('layoutControlGroup2', 'OTHER_CUT_LEN', erFormHelper.getControlValue('layoutControlGroup2', 'CUT_BEFORE_LEN') - Number(fq_data.map(obj => obj.MAT_LEN).reduce((acc, curr) => Number(acc) + Number(curr), 0))); //切后长度
}

    return {
      erGrid1Ready,
      efFormReady,
      erFormHelper,
      initializeFlag,
      F2_DO,
      efFormInitialized,
      closeEfDialog,
      layout_valueChanged,
      layout_valueChanged1,
      isGridVisib,
      isLayout2Visib, cellValueChanged
    };
  }
});
