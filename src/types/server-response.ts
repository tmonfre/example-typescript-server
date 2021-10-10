import { BaseError } from './errors';

class ServerResponse {
    status: number;

    data: Record<string, unknown> | BaseError;

    constructor(data: Record<string, unknown> = {}, status = 200) {
      this.status = status;
      this.data = data;
    }
}

export default ServerResponse;
