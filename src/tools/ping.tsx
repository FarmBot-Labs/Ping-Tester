import { Component, h } from "preact";
import { Farmbot, uuid } from "farmbot";
import { Ping, startPing, completePing, failPing, PingDictionary, calculateLatency, calculatePingLoss } from "./ping_helpers";

interface Props {
  farmbot: Farmbot
}

type State = PingDictionary;

export class PingTool extends Component<Props, State> {
  state: State = {};

  ping = () => {
    const id = uuid();
    const ok = () => this.setState(completePing(this.state, id));
    const no = () => this.setState(failPing(this.state, id));

    this.setState(startPing(this.state, id));
    setTimeout(no, 3500);

    this.props.farmbot.ping().then(ok, no);
  }

  render({ }, { }) {
    const report = {
      ...calculateLatency(this.state),
      ...calculatePingLoss(this.state)
    };
    return <div>
      <button onClick={this.ping}>Perform Ping</button>
      <br />
      <pre>{JSON.stringify(report)}</pre>
    </div>;
  }
}
