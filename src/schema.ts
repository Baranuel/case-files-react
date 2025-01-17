import { ElementPosition, ElementType } from './types/element';

import { createSchema, createTableSchema, definePermissions, Schema, column, Row} from '@rocicorp/zero';

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
        position: column.json<ElementPosition>(),
        imageUrl: {type: 'string', optional: true},
        layer: 'number',
        boardId:{type:'string', optional: true},
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

export type ZeroSchema = typeof schema
export type Element = Row<typeof elementTableSchema>
export type Content = Row<typeof contentTableSchema>

export const schema = createSchema({
    version: 2,
    tables: {
        element: elementTableSchema,
        content: contentTableSchema,
    }
});



export const permissions = definePermissions<any, Schema>(schema, () => ({}));
