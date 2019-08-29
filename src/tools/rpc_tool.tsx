import { Component, h } from "preact";
import { Farmbot, uuid, ALLOWED_AXIS } from "farmbot";

interface Props { farmbot: Farmbot }

interface State {
  lastResponse: unknown;
  lastJobId: string;
}

const WAITING = "Sent...";

export class RpcTool extends Component<Props, State> {
  state: State = {
    lastResponse: "Try an RPC to change results.",
    lastJobId: uuid()
  };

  p = (p: Promise<unknown>) => () => {
    const lastJobId = uuid();
    setTimeout(() => {
      if (this.state.lastJobId === lastJobId) {
        this.setState({ lastResponse: "Timeout." });
      }
    }, 3500);
    this.setState({ lastResponse: WAITING, lastJobId });
    const ok = (lastResponse: unknown) => {
      this.setState({ lastResponse, lastJobId: uuid() });
    }
    p.then();
  };

  render({ }, { }) {
    const { farmbot } = this.props;
    const axis: ALLOWED_AXIS = "all";
    return <div>
      <button onClick={this.p(farmbot.ping())}>ping</button>
      <button onClick={this.p(farmbot.checkUpdates())}>checkUpdates</button>
      <button onClick={this.p(farmbot.dumpInfo())}>dumpInfo</button>
      <button onClick={this.p(farmbot.readStatus())}>readStatus</button>
      <button onClick={this.p(farmbot.rebootFirmware())}>rebootFirmware</button>
      <button onClick={this.p(farmbot.emergencyLock())}>emergencyLock</button>
      <button onClick={this.p(farmbot.emergencyUnlock())}>emergencyUnlock</button>
      <button onClick={this.p(farmbot.installFirstPartyFarmware())}>installFirstPartyFarmware</button>
      <button onClick={this.p(farmbot.powerOff())}>powerOff</button>
      <button onClick={this.p(farmbot.reboot())}>reboot</button>
      <button onClick={this.p(farmbot.resetMCU())}>resetMCU</button>
      <button onClick={this.p(farmbot.sync())}>sync</button>
      <button onClick={this.p(farmbot.takePhoto())}>takePhoto</button>
      <button onClick={this.p(farmbot.home({ axis, speed: 100 }))}>home (ALL)</button>
      <button onClick={this.p(farmbot.findHome({ axis, speed: 100 }))}>
        findHome (ALL)
      </button>
      <button onClick={this.p(farmbot.moveAbsolute({ x: 1, y: 1, z: 1 }))}>
        moveAbsolute (1,1,1)
      </button>
      <button onClick={this.p(farmbot.setZero(axis))}>
        setZero (ALL)
      </button>
      <button onClick={this.p(farmbot.calibrate({ axis }))}>
        calibrate (ALL)
      </button>
      {/* <button onClick={this.p(farmbot.execScript())}>execScript</button>
      <button onClick={this.p(farmbot.execSequence())}>execSequence</button>
      <button onClick={this.p(farmbot.flashFirmware())}>flashFirmware</button>
      <button onClick={this.p(farmbot.installFarmware())}>installFarmware</button>
      <button onClick={this.p(farmbot.moveRelative())}>moveRelative</button>
      <button onClick={this.p(farmbot.readPin())}>readPin</button>
      <button onClick={this.p(farmbot.removeFarmware())}>removeFarmware</button>
      <button onClick={this.p(farmbot.setConfig())}>setConfig</button>
      <button onClick={this.p(farmbot.setServoAngle())}>setServoAngle</button>
      <button onClick={this.p(farmbot.setUserEnv())}>setUserEnv</button>
      <button onClick={this.p(farmbot.togglePin())}>togglePin</button>
      <button onClick={this.p(farmbot.updateFarmware())}>updateFarmware</button>
      <button onClick={this.p(farmbot.writePin())}>writePin</button>
      */}
      <pre>
        {JSON.stringify(this.state.lastResponse)}
      </pre>
    </div>;
  }
}
