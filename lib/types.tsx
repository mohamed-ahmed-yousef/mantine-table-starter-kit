import {Mapper} from "@/search/operator";

export const roles = ["ADMIN", "SUPERVISOR", "MANAGER", "EMPLOYEE"] as const;
export type Role = (typeof roles)[number];
export const roleList: Role[] = [...roles];

export type ColumnTypes = {
    id: string;
    type: keyof typeof Mapper;
    extraInfo?: "numberRange" | "dateRange";
};