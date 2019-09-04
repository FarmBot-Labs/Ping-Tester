import { Component, h } from "preact";
import { Farmbot, uuid } from "farmbot";
import {
  calculateLatency,
  calculatePingLoss,
  completePing,
  failPing,
  Ping,
  PingDictionary,
  startPing
} from "./ping_helpers";

interface Props {
  farmbot: Farmbot
}

type State = {
  timerId: number;
  pings: PingDictionary;
};

export class PingTool extends Component<Props, State> {
  state: State = {
    timerId: 0,
    pings: {}
  };

  get pingState(): PingDictionary { return this.state.pings; }

  ping = () => {
    const id = uuid();
    const ok = () => this.setState({ pings: completePing(this.pingState, id) });
    const no = () => this.setState({ pings: failPing(this.pingState, id) });

    this.setState({ pings: startPing(this.pingState, id) });
    setTimeout(no, 3500);

    this.props.farmbot.ping().then(ok, no);
  }

  togglePing =
    (state: "start" | "stop") => {
      if (state == "start") {
        this.ping();
        this.start();
      } else {
        this.stop();
      }
    }

  start = () => {
    const timerId = setInterval(this.ping, 2500) as any as number;
    this.setState({ timerId });
  };

  stop = () => {
    clearInterval(this.state.timerId);
    this.setState({ timerId: 0 });
  };

  render({ }, { }) {
    const reportA = calculateLatency(this.pingState);
    const reportB = calculatePingLoss(this.pingState);
    const report = { ...reportA, ...reportB };
    const { timerId } = this.state;
    const action: "start" | "stop" = timerId === 0 ? "start" : "stop";
    const ber = ((report.complete || 0) / report.total) || 0;
    return <div>
      <button onClick={() => this.togglePing(action)}>{action} pinging</button>
      <br />
      <ul>
        <li>best: {report.best || 0}</li>
        <li>worst: {report.worst || 0}</li>
        <li>average: {(report.average || 0).toFixed(1)}</li>
        <li>Pings OK: {report.complete}</li>
        <li>Pings pending: {report.pending || 0}</li>
        <li>Pings failed: {report.timeout || 0}</li>
        <li>Total pings: {report.total || 0}</li>
        <li>Percent OK: {(100 * ber).toFixed(1)}</li>
      </ul>
      <pre>
        {JSON.stringify(reportA)}
      </pre>
      <pre>
        {JSON.stringify(reportB)}
      </pre>
    </div>;
  }
}
