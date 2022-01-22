export type MyMinionClientOptions = {
  url: string;
};

export type RequestParameters<Variables> = {
  variables?: Variables;
  fetch?: typeof fetch;
};

export enum RequestStatus {
  "NEVER" = "NEVER",
  "LOADING" = "LOADING",
  "DONE" = "DONE",
}

export declare type ResponseResult<T> = {
  data: T | null;
  errors: Error[] | null;
};

export declare type RequestResult<T> = {
  status: RequestStatus;
} & ResponseResult<T>;

export const defaultStoreValue = {
  status: RequestStatus.NEVER,
  data: null,
  errors: null,
};

export class MyMinionClient {
  private url: string;

  constructor(options: MyMinionClientOptions) {
    this.url = options.url;
  }

  public async request<T>({
    skFetch,
    document,
    variables,
  }): Promise<ResponseResult<T>> {
    const fetchToUse = skFetch ? skFetch : fetch;
    try {
      const res = await fetchToUse(this.url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: document, variables }),
      });

      if (res.status !== 200) {
        return { data: null, errors: [res.statusText] };
      }

      let data = await res.json();
      if (data.errors) {
        return { data: null, errors: data.errors };
      }
      return { data, errors: null };
    } catch (errors) {
      return { data: null, errors: [errors.toString()] };
    }
  }
}
