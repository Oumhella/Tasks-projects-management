// src/types/react-kanban.d.ts
declare module "@lourenci/react-kanban" {
    import * as React from "react";

    export interface Card {
        id: string | number;
        title: string;
        description?: string;
        [key: string]: any;
    }

    export interface Column {
        id: string | number;
        title: string;
        cards: Card[];
        [key: string]: any;
    }

    export interface Board {
        columns: Column[];
    }

    export interface BoardProps {
        initialBoard: Board;
        allowAddCard?: { on: "top" | "bottom" };
        allowRemoveCard?: boolean;
        disableColumnDrag?: boolean;
        onNewCardConfirm?: (draftCard: Card) => Promise<Card>;
        onCardRemove?: (card: Card) => void;
        onCardDragEnd?: (
            card: Card,
            source: { fromColumnId: number | string; fromPosition: number },
            destination: { toColumnId: number | string; toPosition: number }
        ) => void;
    }

    export const Board: React.FC<BoardProps>;
    export default Board;
}
