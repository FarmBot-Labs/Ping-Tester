import { Component, h } from "preact";
import { Farmbot, uuid } from "farmbot";
import { Ping, startPing, completePing, failPing, PingDictionary } from "./ping_helpers";

interface Props {
  farmbot: Farmbot
}

type State = PingDictionary;

export class PingTool extends Component<Props, State> {
  state: State = {};

  statusDisplay = () => {
    const reports = Object
      .values(this.state)
      .sort((a, b) => {
        const date1 = a.start.getTime();
        const date2 = b.start.getTime();

        return (date1 - date2);
      })
      .map(x => {
        const tag = x.id.slice(0, 5);
        switch (x.kind) {
          case "complete":
            const diff = x.end.getTime() - x.start.getTime();
            return <li>{tag} / {diff} ms</li>;
          case "pending":
          case "timeout":
            return <li>{tag} / {x.kind}</li>;
        }
      });
    return <ul>{reports}</ul>;
  }

  ping = () => {
    const id = uuid();
    const ok = () => this.setState(completePing(this.state, id));
    const no = () => this.setState(failPing(this.state, id));

    this.setState(startPing(this.state, id));
    setTimeout(no, 3500);

    this.props.farmbot.ping().then(ok, no);
  }

  render({ }, { }) {
    return <div>
      <button onClick={this.ping}>Perform Ping</button>
      <br />
      {this.statusDisplay()}
    </div>;
  }
}
