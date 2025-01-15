


import { createSchema, createTableSchema, definePermissions, NOBODY_CAN, Schema } from '@rocicorp/zero';

const elementTableSchema = createTableSchema({
    tableName: 'element',
    columns: {
        id: 'string',
        name: 'string',
    },
    primaryKey: 'id'
});

export const schema = createSchema({
    version: 1,
    tables: {
        element: elementTableSchema,
    }
});

export const permissions = definePermissions<any, Schema>(schema, () => ({}));
