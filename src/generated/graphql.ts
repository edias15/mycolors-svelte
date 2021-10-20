import type { OperationStore } from '@urql/svelte';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Color = {
  __typename?: 'Color';
  colorName?: Maybe<Scalars['String']>;
  hexCode?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  colors?: Maybe<Array<Maybe<Color>>>;
};

export type ColorsQueryVariables = Exact<{ [key: string]: never; }>;


export type ColorsQuery = { __typename?: 'Query', colors?: Array<{ __typename?: 'Color', hexCode?: string | null | undefined, colorName?: string | null | undefined } | null | undefined> | null | undefined };


export const ColorsDocument = gql`
    query Colors {
  colors {
    hexCode
    colorName
  }
}
    `;
export type ColorsQueryStore = OperationStore<ColorsQuery, ColorsQueryVariables>;