import * as scErrors from 'sc-errors';
const InvalidActionError = scErrors.InvalidActionError;

export class AGRequest {
  constructor(socket, id, procedureName, data) {
    this.socket = socket;
    this.id = id;
    this.procedure = procedureName;
    this.data = data;
    this.sent = false;
  }

  _respond(responseData, options) {
    if (this.sent) {
      throw new InvalidActionError(`Response to request ${this.id} has already been sent`);
    }
    this.sent = true;
    this.socket.sendObject(responseData, options);
  };
  
  end(data, options) {
    let responseData = {
      rid: this.id
    };
    if (data !== undefined) {
      responseData.data = data;
    }
    this._respond(responseData, options);
  };
  
  error (error, options) {
    let responseData = {
      rid: this.id,
      error: scErrors.dehydrateError(error)
    };
    this._respond(responseData, options);
  };
}
