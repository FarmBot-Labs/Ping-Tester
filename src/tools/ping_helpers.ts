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

type PingLossReport = Record<Ping["kind"] | "total", number>;

export const calculatePingLoss = (s: PingDictionary): PingLossReport => {
  const all = Object.values(s);
  const report: PingLossReport = {
    complete: 0,
    pending: 0,
    timeout: 0,
    total: 0,
  };

  all.map(p => report[p.kind] += 1);
  report.total = all.length

  return report;
}

/** Non-destructively create a new PingDictionary
 * where all entries started after a `cutoff` time. */
export const prune =
  (last: PingDictionary, cutoff: number): PingDictionary => {
    const next: PingDictionary = {};
    Object
      .entries(last)
      .filter(([_id, item]) => item.start.getTime() > cutoff)
      .map(([uuid, item]) => next[uuid] = item);
    return next;
  };

const TEN_MINUTES = 600000;

const tenMinutesAgo =
  () => (new Date).getTime() - TEN_MINUTES;

interface LatencyReport {
  best: number;
  worst: number;
  average: number;
  total: number;
}

export const calculateLatency =
  (s: PingDictionary, cutoff = tenMinutesAgo()): LatencyReport => {
    const latency: number[] = [];

    Object
      .values(prune(s, cutoff))
      .filter(s => s.kind === "complete")
      .map(s => s.end.getTime() - s.start.getTime())
      .forEach(s => latency.push(s));

    return {
      best: Math.min(...latency) || 0,
      worst: Math.max(...latency) || 0,
      average: latency.reduce((a, b) => a + b, 0) / latency.length,
      total: latency.length
    };
  }
