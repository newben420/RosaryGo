export interface Session {
    id?: number;
    is_dm: boolean;
    start: number;
    stop?: number;
    intention: string;
}