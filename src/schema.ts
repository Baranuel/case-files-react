import { ElementPosition, ElementType } from './types/element';

import { createSchema, createTableSchema, definePermissions, Schema, column, Row, ExpressionBuilder, ANYONE_CAN} from '@rocicorp/zero';

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
        creatorId: 'string',
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

const boardTableSchema= createTableSchema({
    tableName: 'board',
    columns: {
        id: 'string',
        title: 'string',
        creatorId: 'string',
    },
    primaryKey: 'id',
});



export type ZeroSchema = typeof schema

export type Element = Row<typeof elementTableSchema>
export type Content = Row<typeof contentTableSchema>
export type Board = Row<typeof boardTableSchema>

export type ElementSchema = typeof elementTableSchema
export type ContentSchema = typeof contentTableSchema
export type BoardSchema = typeof boardTableSchema

export const schema = createSchema({
    version: 1,
    tables: {
        element: elementTableSchema,
        content: contentTableSchema,
        board: boardTableSchema
    }
});


 type JWTPayload  = {
    azp: string; // Authorized party
    exp: number; // Expiration time (in seconds since the epoch)
    iat: number; // Issued at time (in seconds since the epoch)
    iss: string; // Issuer
    jti: string; // JWT ID
    nbf: number; // Not before time (in seconds since the epoch)
    sub: string; // Subject (user ID)
  }

export const permissions = definePermissions<JWTPayload, Schema>(schema, () => {


    const allowIfCreator = (
        authData: JWTPayload,
        {cmp}: ExpressionBuilder<ElementSchema>,
      ) => cmp('creatorId', '=', authData.sub);


      return {
        element: {
            row: {
                insert: ANYONE_CAN,
                select: ANYONE_CAN,
                update: {
                    postMutation: [allowIfCreator]
                }
            }
        }
    }
       
});
