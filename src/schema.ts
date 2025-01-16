import { ElementPosition, ElementType } from './types/element';

import { createSchema, createTableSchema, definePermissions, Schema, column, Row} from '@rocicorp/zero';

import { createSchema, createTableSchema, definePermissions, NOBODY_CAN, Schema } from '@rocicorp/zero';
const contentTableSchema = createTableSchema({
    tableName: 'content',
    columns: {
        id: 'string',
        title: 'string',
        content: 'string',
    },
    primaryKey: 'id',
});

const elementTableSchema = createTableSchema({
    tableName: 'element',
    columns: {
        id: 'string',
        type:column.enumeration<ElementType>(),
        title: 'string',
        position: column.json<ElementPosition>(),
        imageUrl: {type: 'string', optional: true},
        layer: 'number',
        contentId: {type: 'string', optional: true},
    },
    primaryKey: 'id',
    relationships: {
        content: {
            sourceField: 'contentId',
            destField: 'id',
            destSchema: contentTableSchema,
        }
    }
});

type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
  }
export type ZeroSchema = typeof schema
export type Element = Row<typeof elementTableSchema>

export const schema = createSchema({
    version: 1,
    tables: {
        element: elementTableSchema,
        content: contentTableSchema,
    }
});



export const permissions = definePermissions<any, Schema>(schema, () => ({}));
