import { Component, render, h } from "preact";
import { Farmbot } from "farmbot";
import { Active } from "./active";

enum STATUS {
  NEED_CREDENTIALS,
  HAVE_CREDENTIALS
}


interface InactiveState {
  status: STATUS.NEED_CREDENTIALS;
  token: string;
  misc: string;
  farmbot?: undefined;
};

interface ActiveState {
  status: STATUS.HAVE_CREDENTIALS;
  token: string;
  misc: string;
  farmbot: Farmbot;
}

type State = InactiveState | ActiveState;

export function getEventValue(e: Event): string {
  return (e.currentTarget as any).value;
}

const DEFAULT_STATE: State = {
  status: STATUS.NEED_CREDENTIALS,
  token: "",
  misc: "Use Token"
};

class Main extends Component<{}, State> {
  state: State = DEFAULT_STATE;

  submit = () => {
    const farmbot = new Farmbot({ token: this.state.token });

    const ok = () => {
      this.setState({
        farmbot,
        status: STATUS.HAVE_CREDENTIALS,
        misc: "Connected!",
      });
    };

    const no = () => {
      this.setState({
        farmbot: undefined,
        status: STATUS.NEED_CREDENTIALS,
        misc: "Failed to connect " + (new Date).toJSON(),
      });
    }

    farmbot
      .connect()
      .then(ok, no)
  };

  tokenChange = (e: Event) => this.setState({ token: getEventValue(e) });

  needCredentials = () => {
    return <div>
      <form onSubmit={this.submit} action="javascript:">
        <input type="text"
          name="token"
          placeholder="Enter Farmbot Token"
          id="token"
          onChange={this.tokenChange} />
        <button type="submit">{this.state.misc}</button>
        <br />
        Extract token with: <pre>console.log(store.getState().auth.token.encoded)</pre>
      </form>
    </div>;
  }

  onExit = () => this.setState({
    status: STATUS.NEED_CREDENTIALS,
    farmbot: undefined
  });

  render({ }, { status }) {
    switch (status) {
      case STATUS.HAVE_CREDENTIALS:
        return <Active farmbot={this.state.farmbot} onExit={this.onExit} />;
      default:
        return this.needCredentials();
    }
  }
}
document.body.textContent = "";

render(<Main />, document.body);
