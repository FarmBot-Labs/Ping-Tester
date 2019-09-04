import { Component, h } from "preact";
import { Farmbot } from "farmbot";
import { PingTool } from "./tools/ping";
import { RpcTool } from "./tools/rpc_tool";

interface Props { farmbot: Farmbot; onExit: () => void; }
interface State { }

export class Active extends Component<Props, State> {
  state: State = {};

  render({ }, { }) {
    return <div>
      <button onClick={this.props.onExit}>Log Out</button>
      <hr />
      <PingTool farmbot={this.props.farmbot} />
      <hr />
      {/* <RpcTool farmbot={this.props.farmbot} /> */}
    </div>;
  }
}
