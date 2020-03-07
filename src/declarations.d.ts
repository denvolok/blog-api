import { Application as ExpressFeathers } from '@feathersjs/express';

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}

export interface ServiceModels {}

// TODO: extract to another file?
export namespace BlobService {
  interface Config {
    Model: any;
    id?: string;
    returnUri?: boolean;
    returnBuffer?: boolean;
  }

  interface Data {
    id: string;
    buffer: Buffer;
    size: number;
  }

  interface UriPayload {
    id: string;
    uri: string;
  }

  interface BlobPayload {
    id: string;
    buffer: Buffer;
    contentType: string;
  }

  type Payload = UriPayload | BlobPayload;

  class Service {
    constructor(config: Config);

    get(id: string, params?: any): Promise<Data>;
    create(body: Payload, params?: any): Promise<Data>;
    remove(id: string): Promise<{id: string}>;
  }
}

// The application instance type that will be used everywhere else
export type Application = ExpressFeathers<ServiceTypes>;
