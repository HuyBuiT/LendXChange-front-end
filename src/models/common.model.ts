import { ComponentType } from 'react';

export interface ObjectMultiLanguageProps {
  [x: string]: string;
}

export interface KeyAbleProps {
  [key: string]: any;
}

export enum BlockchainTransactionStatusEnum {
  LOADING = 'loading',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface BaseResponseData<T> {
  statusCode: number;
  message?: string;
  error?: string;
  data: T;
}

export type ResponseDataList<T> = {
  statusCode: number;
  data: {
    pageData: T;
    pageNum: number;
    total: number;
  };
};

export type PaginationType = {
  pageNum: number;
  total: number;
};

export type HOCControllerInterface = ComponentType<any>;

export interface DataListInterface<T> {
  pageData: T;
  pagination: PaginationType;
}
