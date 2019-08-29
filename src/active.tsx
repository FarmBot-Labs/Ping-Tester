import { Component, h } from "preact";
import { Farmbot } from "farmbot";

interface Props { farmbot: Farmbot; onExit: () => void; }
interface State { total: number; totalOk: number; inProgress: boolean; }

export class Active extends Component<Props, State> {
  state: State = {
    total: 0,
    totalOk: 0,
    inProgress: false
  };

  get percentage() {
    return (((this.state.totalOk / this.state.total) || 0) * 100).toFixed(2);
  }

  ping = () => {
    this.setState({ total: this.state.total + 1, inProgress: true });
    const no = () => this.setState({ inProgress: false });
    const ok = () => this.setState({
      totalOk: this.state.totalOk + 1,
      inProgress: false
    });

    this.props.farmbot.ping().then(ok, no);
  };

  statusDisplay = () => {
    if (this.state.inProgress) {
      return "Pinging...";
    } else {
      return [
        this.state.totalOk,
        "/",
        this.state.total,
        "=",
        (this.percentage || 0),
        "% Success Rate"
      ].join(" ");
    }
  }

  render({ }, { }) {
    return <div>
      <button onClick={this.props.onExit}>Try Different Token</button>
      <button onClick={this.ping}>Perform Ping</button>
      <br />
      {this.statusDisplay()}
    </div>;
  }
}
