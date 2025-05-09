/**
 * Utility type to omit specific properties from a type
 */
export type OmitProperties<T, K extends keyof T> = Omit<T, K>;
