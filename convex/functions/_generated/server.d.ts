// Auto-generated Convex types for development
// Run 'bunx convex dev' to regenerate

export type QueryCtx = {
  db: {
    <TableName extends string>(tableName: TableName): {
      collect(): Promise<any[]>;
      first(): Promise<any | null>;
      get(id: any): Promise<any | null>;
      withIndex(name: string, args?: any): {
        collect(): Promise<any[]>;
        first(): Promise<any | null>;
      };
      order(dir?: "asc" | "desc"): {
        collect(): Promise<any[]>;
        first(): Promise<any | null>;
        take(n: number): Promise<any[]>;
      };
    };
  };
  auth: {
    getUserIdentity(): Promise<any | null>;
  };
};

export type MutationCtx = {
  db: {
    <TableName extends string>(tableName: TableName): {
      collect(): Promise<any[]>;
      first(): Promise<any | null>;
      get(id: any): Promise<any | null>;
    };
    insert<TableName extends string>(tableName: TableName, document: any): Promise<any>;
    patch(id: any, document: any): Promise<void>;
    delete(id: any): Promise<void>;
  };
  auth: {
    getUserIdentity(): Promise<any | null>;
  };
};

export type ActionCtx = {
  runQuery: (query: any, args?: any) => Promise<any>;
  storage: {
    getUrl(id: string): Promise<string | null>;
  };
};

export function query<Args>(definition: {
  args: any;
  handler: (ctx: QueryCtx, args: Args) => any;
}): any {
  return definition;
}

export function mutation<Args>(definition: {
  args: any;
  handler: (ctx: MutationCtx, args: Args) => any;
}): any {
  return definition;
}

export function action(definition: {
  handler: (ctx: ActionCtx, args: any) => any;
}): any {
  return definition;
}

export const v = {
  id: (_tableName: string) => ({} as any),
  string: () => ({} as any),
  number: () => ({} as any),
  boolean: () => ({} as any),
  null: () => ({} as any),
  array: (_t: any) => ({} as any),
  object: (_fields: Record<string, any>) => ({} as any),
  optional: (_t: any) => ({} as any),
  union: (..._options: any[]) => ({} as any),
  literal: (_value: any) => ({} as any),
};
