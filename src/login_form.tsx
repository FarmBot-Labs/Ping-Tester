import { Component, h } from "preact";
import { getEventValue } from "./index";
import axios from "axios";

type FormField = "email" | "password" | "url";
type TokenForm = Record<FormField, string>
interface LoginFormProps {
  onSubmit: (token: string) => void;
}

export class LoginForm extends Component<LoginFormProps, TokenForm> {
  state = {
    email: "test@test.com",
    password: "",
    url: "http://localhost:3000",
  }

  change = (key: FormField) => (e: Event) => {
    const value = getEventValue(e);
    const update: Partial<TokenForm> = { [key]: value };
    this.setState({ ...this.state, ...update });
  };

  field = (key: FormField) => {
    return <div>
      <label name={key}>
        {key}
      </label>
      <input
        value={this.state[key]}
        type={key}
        name={key}
        id={`${key}-input`}
        onChange={this.change(key)} />
    </div>;
  };

  submitToken = (token: string | undefined) => {
    if (token) {
      this.props.onSubmit(token);
    }
  }

  render() {
    return <form onSubmit={(e) => {
      e.preventDefault();
      createToken(this.state).then(this.submitToken);
    }}>
      {this.field("email")}
      {this.field("password")}
      {this.field("url")}
      <button>Submit</button>
    </form>;
  }
}

interface TokenData { token: { encoded: string; } }

function createToken({ email, password, url }: TokenForm) {
  const path = url + "/api/tokens";
  const payload = { user: { email, password } };
  return axios.post<TokenData>(path, payload).then(({ data }) => {
    return data.token.encoded
  }, (x) => {
    alert("Error. See console.");
    return console.dir(x);
  })
}
