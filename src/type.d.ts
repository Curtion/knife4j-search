interface ServerList {
  location: string;
  name: string;
  swaggerVersion: string;
  url: string;
  swagger?: any;
}

interface Server {
  blinkURL: string; // name/tags/operationId
  url: string; // paths:key
  method: string;
  name: string; // tags/summary
}
