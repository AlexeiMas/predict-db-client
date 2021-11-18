import React from 'react';
import style from './AdvancedFilters.module.scss';
import * as Icons from '../../../../assets/images';

export const CloseBtn = (({ ...rest }) => (<Icons.CloseIcon height={24} width={24} onClick={rest.onClose} className={style.closeIcon} />))