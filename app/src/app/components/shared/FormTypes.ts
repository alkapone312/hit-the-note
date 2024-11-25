type EnumerateValuesType = { 
    value: string | number;
    name: string;
}[];

interface CommonOption {
    type: string;
    name: string;
    label: string;
    default: unknown;
}

type SelectOptions = {
    type: 'select';
    values: EnumerateValuesType;
    default: string | number;
} & CommonOption;

type ChainOptions = {
    type: 'list';
    values: EnumerateValuesType;
    default: (string | number)[];
} & CommonOption;

type NumberOptions = {
    type: 'number';
    step: number;
    default: number;
    range?: [number, number];
} & CommonOption;

type SettingsArray = (SelectOptions | ChainOptions | NumberOptions)[];

export type {EnumerateValuesType, CommonOption, SelectOptions, ChainOptions, NumberOptions, SettingsArray};