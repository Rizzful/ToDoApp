export type Item = {
    id: number | undefined;
    listId: number | undefined;
    title: string;
    text: string;
    start: string | Date;
    deadline: string | Date;
    completed: boolean;
}