import { Component, render, h } from "preact";
import { Farmbot } from "farmbot";
import { Active } from "./active";
import { LoginForm } from "./login_form";

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

export const getEventValue =
  (e: Event) => (e.currentTarget as HTMLInputElement).value;

const DEFAULT_STATE: State = {
  status: STATUS.NEED_CREDENTIALS,
  token: "",
  misc: "Use Token"
};

class Main extends Component<{}, State> {
  state: State = DEFAULT_STATE;

  submit = (token: string) => {
    const farmbot = new Farmbot({ token });

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

    farmbot.connect().then(ok, no)
  };

  tokenChange = (e: Event) => this.setState({ token: getEventValue(e) });

  onExit = () => this.setState({
    status: STATUS.NEED_CREDENTIALS,
    farmbot: undefined
  });

  render({ }, { status }) {
    switch (status) {
      case STATUS.HAVE_CREDENTIALS:
        return <Active farmbot={this.state.farmbot} onExit={this.onExit} />;
      default:
        return <LoginForm onSubmit={this.submit} />;
    }
  }
}
document.body.textContent = "";

render(<Main />, document.body);
