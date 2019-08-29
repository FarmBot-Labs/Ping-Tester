import { uuid } from "farmbot";

interface Pending {
  kind: "pending";
  id: string;
  start: Date;
  end?: undefined;
}

interface Timeout {
  kind: "timeout";
  id: string;
  start: Date;
  end?: undefined;
}

interface Complete {
  kind: "complete";
  id: string;
  start: Date;
  end: Date;
}

export type Ping = Complete | Pending | Timeout;
export type PingDictionary = Record<string, Ping | undefined>;

export const startPing =
  (s: PingDictionary, id: string): PingDictionary => {
    return { ...s, [id]: { kind: "pending", id, start: new Date() } };
  }

export const failPing =
  (s: PingDictionary, id: string): PingDictionary => {
    const failure = s[id];
    if (failure && failure.kind != "complete") {
      const nextFailure: Timeout =
        { kind: "timeout", id, start: failure.start };
      return { ...s, [id]: nextFailure };
    } else {
      console.warn("Tried to fail non-existent ping " + id);
      return s;
    }
  }

export const completePing =
  (s: PingDictionary, id: string): PingDictionary => {
    const failure = s[id];
    if (failure && failure.kind == "pending") {
      return {
        ...s,
        [id]: {
          kind: "complete",
          id,
          start: failure.start,
          end: new Date()
        }
      };
    } else {
      console.warn("Tried to complete non-existent ping " + id);
      return s;
    }
  }
