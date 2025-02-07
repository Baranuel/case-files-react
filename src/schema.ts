import { ElementPosition, ElementType } from './types/element';

import { createSchema, Schema, Row, ExpressionBuilder, ANYONE_CAN, table, enumeration, json, string, number, relationships, boolean, definePermissions} from '@rocicorp/zero';


const content = table('content').columns({
    id: string(),
    title: string().optional(),
    notes: string().optional(),
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
    creatorId: string().optional(),
    layer: number(),
}).primaryKey('id')

const collaboration = table('collaboration').columns({
    id: string(),
    boardId: string(),
    boardCreatorId: string(),
    userId: string(),
    status: enumeration<'pending' | 'accepted' | 'rejected'>(),
    createdAt: number().optional(),
}).primaryKey('id')

const user = table('user').columns({
    id: string(),
    name: string().optional(),
    imageUrl: string().optional(),
    tier: enumeration<'free' | 'paid'>(),
    maxBoards: number(),
    createdAt: number().optional(),
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
    }),
    creator: one({
        sourceField:['creatorId'],
        destField: ['id'],
        destSchema: user,
    })
}))

const collaborationRelationships = relationships(collaboration, ({one}) => ({
    board: one({
        sourceField:['boardId'],
        destField: ['id'],
        destSchema: board
    }),
    user: one({
        sourceField:['userId'],
        destField: ['id'],
        destSchema: user
    })
}))

const boardRelationships = relationships(board, ({one}) => ({
    creator: one({
        sourceField:['creatorId'],
        destField: ['id'],
        destSchema: user
    })
}))

export const schema = createSchema( 1, {
    tables: [element, content, board, collaboration, user],
    relationships: [elementRelationships, collaborationRelationships, boardRelationships]
})

type AuthData = {
    sub: string
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
    return {}
})

export type ZeroSchema = typeof schema

export type Element = Row<typeof schema.tables.element>
export type Content = Row<typeof schema.tables.content>
export type Board = Row<typeof schema.tables.board>
export type Collaboration = Row<typeof schema.tables.collaboration> 
export type User = Row<typeof schema.tables.user>

export type ElementSchema = typeof element
export type ContentSchema = typeof content
export type BoardSchema = typeof board
export type CollaborationSchema = typeof collaboration
export type UserSchema = typeof user