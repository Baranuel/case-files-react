import { ElementPosition, ElementType } from './types/element';

import { createSchema, Schema, Row, ExpressionBuilder, ANYONE_CAN, table, enumeration, json, string, number, relationships, boolean, definePermissions} from '@rocicorp/zero';


const content = table('content').columns({
    id: string(),
    title: string(),
    notes: string(),
    victim: boolean(),
    timeOfDeath: number().optional(),
}).primaryKey('id')

const board = table('board').columns({
    id: string(),
    title: string(),
    creatorId: string(),
    createdAt: number().optional(),
}).primaryKey('id')

const element = table('element').columns({
    id: string(),
    type: enumeration<ElementType>(),
    position: json<ElementPosition>(),
    imageUrl: string().optional(),
    contentId: string().optional(),
    boardId: string().optional(),
    layer: number(),
}).primaryKey('id')

const elementRelationships = relationships(element, ({one}) => ({
    content: one({
        sourceField:['contentId'],
        destField: ['id'],
        destSchema: content,
    }),
    board: one({
        sourceField:['boardId'],
        destField: ['id'],
        destSchema: board,
    })
}))


export const schema = createSchema( 1, {
    tables: [element, content, board],
    relationships: [elementRelationships]
})

type AuthData = any

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
    return {}
})

export type ZeroSchema = typeof schema

export type Element = Row<typeof schema.tables.element>
export type Content = Row<typeof schema.tables.content>
export type Board = Row<typeof schema.tables.board>

export type ElementSchema = typeof element
export type ContentSchema = typeof content
export type BoardSchema = typeof board