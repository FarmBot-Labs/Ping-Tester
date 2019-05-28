import { Component, h } from "preact";
import { Farmbot } from "farmbot";

interface Props {
  farmbot: Farmbot;
  onExit: () => void;
}

interface State {
  total: number;
  totalOk: number;
}

export class Active extends Component<Props, State> {
  state: State = {
    total: 0,
    totalOk: 0
  };

  get percentage() {
    return this.state.totalOk / this.state.total;
  }

  ping = () => {
    this.setState({ total: this.state.total + 1 });
    const no = () => { };
    const ok = () => this.setState({ totalOk: this.state.totalOk + 1 });

    this.props.farmbot.ping().then(ok, no);
  };

  render({ }, { }) {
    return <div>
      <button onClick={this.props.onExit}>Try Different Token</button>
      <button onClick={this.ping}>Perform Ping</button>
      <br />
      {this.state.totalOk}/{this.state.total} = {this.percentage || 0}% Success Rate
    </div>;
  }
}
