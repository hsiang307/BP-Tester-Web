var ReactRouter = window.ReactRouterDOM
var Router = ReactRouter.MemoryRouter
var Route = ReactRouter.Route
var Link = ReactRouter.Link

const AppRouter = () => (
  <Router>
    <div>
      <Route path="/" exact component={MainMenu} />
      <Route path="/setid/" component={SetID} />
      <Route path="/scan/" component={Scan} />
      <Route path="/monitor/" component={Monitor} />
      <Route path="/uploadmonitor/" component={UploadMonitor} />
      <Route path="/uploadfirmware/" component={UploadFirmware} />
      <Route path="/setupmenu/" component={SetUp} />
      <Route path="/monitormenu/" component={MonitorMenu} />
      <Route path="/viewfirmware/" component={ViewFirmware} />
    </div>
  </Router>
);

class MainMenu extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <br></br><h1>Hexagon Sensor Test</h1><br></br><br></br>
        <div class="row" align="center">
          <div class="col-xs-12 col-md-6">
            <Link to="/setupmenu/" style={{ textDecoration: 'none' }}><button class="button">
              Set Up Sensors
              </button></Link>
          </div>
          <div class="col-xs-12 col-md-6">
            <Link to="/monitormenu/" style={{ textDecoration: 'none' }}> <button class="button">
              Monitor Sensors
              </button></Link>
          </div>
        </div>
      </div>
    );
  }
}

class SetUp extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <br></br><h1>Set Up Sensors</h1><br></br><br></br>
        <div class="row" align="center">
          <div class="col-xs-12 col-md-4">
            <Link to="/uploadmonitor/" style={{ textDecoration: 'none' }}><button class="button">
              Upload Monitor
                  </button></Link>
          </div>
          <div class="col-xs-12 col-md-4">
            <Link to="/uploadfirmware/" style={{ textDecoration: 'none' }}><button class="button">
              Upload Firmware
                  </button></Link>
          </div>
          <div class="col-xs-12 col-md-4">
            <Link to="/setid/" style={{ textDecoration: 'none' }}><button class="button">
              Set ID
                  </button></Link>
          </div>

        </div>
        <div class="center">
          <br></br><br></br><Link to="/"><button class="smallbutton">Main Menu</button></Link>
        </div>
      </div>
    );
  }
}

class MonitorMenu extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <br></br><h1>Monitor Sensors</h1><br></br><br></br>
        <div class="row" align="center">
          <div class="col-xs-12 col-md-4">
            <Link to="/scan/" style={{ textDecoration: 'none' }}><button class="button">
              Scan
              </button></Link>
          </div>
          <div class="col-xs-12 col-md-4">
            <Link to="/viewfirmware/" style={{ textDecoration: 'none' }}><button class="button">
              View Firmware Versions
              </button></Link>
          </div>
          <div class="col-xs-12 col-md-4">
            <Link to="/monitor/" style={{ textDecoration: 'none' }}> <button class="button">
              View Sensor Readings
              </button></Link>
          </div>
        </div>
        <div class="center">
          <br></br><br></br><Link to="/"><button class="smallbutton">Main Menu</button></Link>
        </div>
      </div>
    );
  }
}

class SetID extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <br></br><h1 class="center">Set Sensor ID</h1><br></br>
        <h2 class="center">
          Select the new ID<br></br>
          Press and hold MD button on sensor<br></br>
          Press "Set ID"<br></br>
          Release the MD button<br></br><br></br>
          <input type="number" id="address" min="1" max="247" class="center"></input><br></br><br></br>
          <button class="smallbutton" onClick={this.sendSetIDCommand.bind(this)}>Set ID</button><br></br>
          <Link to="/"><button class="smallbutton">Main Menu</button></Link>
        </h2>
      </div>
    );
  }

  sendSetIDCommand() {
    var value = "0"
    value = document.getElementById("address").value;
    jQuery.ajax("sendsetidcommand.html?value=" + value);
    alert("Set ID command sent");
  }
}

class UploadMonitor extends React.Component {

  constructor() {
    super();
    this.state = { uploadScreen: 1, uploadSuccessful: false }
  }

  startUpload() {
    var percent = 0
    this.interval = setInterval(() => {
      percent++;
      document.getElementById("percent").innerHTML = (percent);
      document.getElementById("progbar").style.width = (percent) + "%";
      if (percent >= 100) {
        percent = 0
        clearInterval(this.interval);
        { this.uploadComplete() }
      }
    }, 90);
  }

  sendUploadMonitorCommand() {
    jQuery.ajax("senduploadmonitorcommand.html");
    this.setState({ uploadScreen: 2 });
  }

  uploadComplete() {
    document.getElementById("title").innerHTML = 'Upload Complete';
    $.getJSON("json.html", function (data) {
      this.setState({ uploadSuccessful: data.uploadsuccessful, uploadScreen: 3 });
    }.bind(this));
  }

  render() {
    if (this.state.uploadScreen === 1) {
      return (
        <div>
          <br></br><h1 class="center">Upload Monitor</h1><br></br>
          <h2 class="center">
            Disconnect sensor power<br></br>
            Press and hold MD button on sensor<br></br>
            Connect power without releasing MD button<br></br>
            Release the MD button<br></br>
            Press upload<br></br><br></br>
            <button class="smallbutton" onClick={this.sendUploadMonitorCommand.bind(this)}>Upload</button><br></br>
            <Link to="/"><button class="smallbutton">Main Menu</button></Link>
          </h2>
        </div>
      );
    } else if (this.state.uploadScreen === 2) {
      return (
        <div>
          {this.startUpload()}
          <br></br><h1><span id="title">Uploading Monitor...</span></h1><br></br>
          <h2>
            <div id="body" align='center'>
              <div id="percentupdate"><b><span id="percent"></span>% Complete</b></div><br></br>
              <div class="progress" id="progressb">
                <div id="progbar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                </div>
              </div>
            </div>
          </h2>
        </div>
      )
    } else if (this.state.uploadSuccessful === 1) {
      return (
        <div>
          <div>
            <h1>Upload Successful</h1> <br></br> <br></br>
            <h2 class="center">Please reboot sensor for installation to complete<br></br><br></br><br></br></h2>
          </div>
          <h2><Link to="/"><button class="smallbutton">Main Menu</button></Link></h2>
        </div>
      )
    } else if (this.state.uploadSuccessful === 0) {
      return (
        <div>
          <div>
            <h1>Upload Failed!</h1> <br></br> <br></br>
            <h2 class="center">Please try again!<br></br><br></br><br></br></h2>
          </div>
          <h2><Link to="/"><button class="smallbutton">Main Menu</button></Link></h2>
        </div>
      )
    }
  }
}

class UploadFirmware extends React.Component {

  constructor() {
    super();
    this.state = { uploadScreen: 1, uploadSuccessful: false }
  }

  startUpload() {
    var percent = 0
    this.interval = setInterval(() => {
      percent++;
      document.getElementById("percent").innerHTML = (percent);
      document.getElementById("progbar").style.width = (percent) + "%";
      if (percent >= 100) {
        percent = 0
        clearInterval(this.interval);
        { this.uploadComplete() }
      }
    }, 90);
  }

  sendUploadMonitorCommand() {
    jQuery.ajax("senduploadfirmwarecommand.html");
    this.setState({ uploadScreen: 2 });
  }

  uploadComplete() {
    document.getElementById("title").innerHTML = 'Upload Complete';
    $.getJSON("json.html", function (data) {
      this.setState({ uploadSuccessful: data.uploadsuccessful, uploadScreen: 3 });
    }.bind(this));
  }

  render() {
    if (this.state.uploadScreen === 1) {
      return (
        <div>
          <br></br><h1 class="center">Upload Firmware</h1><br></br>
          <h2 class="center">
            Disconnect sensor power<br></br>
            Press and hold MD button on sensor<br></br>
            Connect power without releasing MD button<br></br>
            Release the MD button<br></br>
            Press upload<br></br><br></br>
            <button class="smallbutton" onClick={this.sendUploadMonitorCommand.bind(this)}>Upload</button><br></br>
            <Link to="/"><button class="smallbutton">Main Menu</button></Link>
          </h2>
        </div>
      );
    } else if (this.state.uploadScreen === 2) {
      return (
        <div>
          {this.startUpload()}
          <br></br><h1><span id="title">Uploading Firmware...</span></h1><br></br>
          <h2>
            <div id="body" align='center'>
              <div id="percentupdate"><b><span id="percent"></span>% Complete</b></div><br></br>
              <div class="progress" id="progressb">
                <div id="progbar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                </div>
              </div>
            </div>
          </h2>
        </div>
      )
    } else if (this.state.uploadSuccessful === 1) {
      return (
        <div>
          <div>
            <h1>Upload Successful</h1> <br></br> <br></br>
            <h2 class="center">Please reboot sensor for installation to complete<br></br><br></br><br></br></h2>
          </div>
          <h2><Link to="/"><button class="smallbutton">Main Menu</button></Link></h2>
        </div>
      )
    } else if (this.state.uploadSuccessful === 0) {
      return (
        <div>
          <div>
            <h1>Upload Failed!</h1> <br></br> <br></br>
            <h2 class="center">Please try again!<br></br><br></br><br></br></h2>
          </div>
          <h2><Link to="/"><button class="smallbutton">Main Menu</button></Link></h2>
        </div>
      )
    }
  }
}


class Scan extends React.Component {
  constructor() {
    super();
    this.state = { numOfSensors: null }
  }

  startScan() {
    jQuery.ajax("sendscancommand.html");
    var percent = 0
    this.interval = setInterval(() => {
      percent++;
      document.getElementById("percent").innerHTML = (percent);
      document.getElementById("progbar").style.width = (percent) + "%";
      if (percent >= 100) {
        percent = 0
        clearInterval(this.interval);
        { this.scanComplete() }
      }
    }, 400);
  }

  scanComplete() {
    document.getElementById("title").innerHTML = 'Scan Complete!';
    $.getJSON("json.html", function (data) {
      this.setState({ numOfSensors: data.sensors });
    }.bind(this));
  }

  render() {
    if (this.state.numOfSensors === null) {
      return (
        <div>
          {this.startScan()}
          <br></br><h1><span id="title">Scanning for sensors...</span></h1><br></br>
          <h2>
            <div id="body" align='center'>
              <div id="percentupdate"><b><span id="percent"></span>% Complete</b></div><br></br>
              <div class="progress" id="progressb">
                <div id="progbar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                </div>
              </div>
            </div>
          </h2>
        </div>
      )
    } else if (this.state.numOfSensors === 0) {
      return (
        <div>
          <h1>Scan Complete!</h1><br></br><br></br>
          <h2 class="center"><red>No sensors detected! Please ensure that sensors are connected correctly and have been assigned a UNIQUE ID, then scan again.</red><br></br><br></br><br></br>
            <Link to="/"><button class="smallbutton">Main Menu</button></Link></h2>
        </div>
      )
    } else if (this.state.numOfSensors > 0) {
      return (
        <div>
          <h1>Scan Complete!</h1><br></br><br></br>
          <h2 class="center"><green>{this.state.numOfSensors}</green> sensors detected!<br></br><br></br><br></br>
            <Link to="/"><button class="smallbutton">Main Menu</button></Link></h2>
        </div>
      )
    }
  }
}

class Monitor extends React.Component {

  constructor() {
    super();
    this.state = { dataList: [], sensors: null }
    var sensorTypes = ["Unknown", "Temperature & Humidity", "Temperature", "Light", "", "Accelerometer"]
    this.interval = setInterval(() => {
      $.getJSON("json.html", (data) => {
        var dataList = [];
        for (let i = 0; i < data.id.length; i++) {
          dataList.push({
            id: data.id[i],
            type: sensorTypes[data.type[i]],
            data: data.data[i],
          })
        }
        this.setState({
          dataList: dataList,
          sensors: data.sensors
        })
      })
    }, 200);
  }

  createHeaders = () => {
    var names = ['ID', 'Type', 'Data'];
    var namesList = names.map(function (name) {
      return <th>{name}</th>;
    })
    return <tr>{namesList}</tr>
  }

  renderDataList = () => {
    return this.state.dataList.map(function (item) {
      return (
        <tr>
          <td>{item.id}</td>
          <td>{item.type}</td>
          <td>{item.data}</td>
        </tr>
      )
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.sensors === null) {
      return (
        <div>
        </div>
      )
    }
    else if (this.state.sensors === 0) {
      return (
        <div><br></br>
          <h2 class="center"><red>No sensors detected! Please ensure that sensors are connected correctly and have been assigned a UNIQUE ID, then scan again.</red><br></br><br></br>
            <Link to="/"><button class="smallbutton">Main Menu</button></Link><br></br><br></br></h2>
        </div>
      )
    } else if (this.state.sensors > 0) {
      return (
        <h2><br></br><table align='center'>
          {this.createHeaders()}
          {this.renderDataList()}
        </table>
          <br></br><br></br>
          <Link to="/"><button class="smallbutton">Main Menu</button></Link><br></br><br></br></h2>

      )
    }
  }
}

class ViewFirmware extends React.Component {

  constructor() {
    super();
    this.state = { dataList: [], sensors: null }
    var sensorTypes = ["Unknown", "Temperature & Humidity", "Temperature", "Light", "", "Accelerometer"]
    this.interval = setInterval(() => {
      $.getJSON("json.html", (data) => {
        var dataList = [];
        for (let i = 0; i < data.id.length; i++) {
          dataList.push({
            id: data.id[i],
            type: sensorTypes[data.type[i]],
            monitor: data.monitor[i],
            firmware: data.firmware[i],
          })
        }
        this.setState({
          dataList: dataList,
          sensors: data.sensors
        })
      })
    }, 200);
  }

  createHeaders = () => {
    var names = ['ID', 'Type', 'Monitor', 'Firmware'];
    var namesList = names.map(function (name) {
      return <th>{name}</th>;
    })
    return <tr>{namesList}</tr>
  }

  renderDataList = () => {
    return this.state.dataList.map(function (item) {
      return (
        <tr>
          <td>{item.id}</td>
          <td>{item.type}</td>
          <td>{item.monitor}</td>
          <td>{item.firmware}</td>
        </tr>
      )
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.sensors === null) {
      return (
        <div>
        </div>
      )
    }
    else if (this.state.sensors === 0) {
      return (
        <div><br></br>
          <h2 class="center"><red>No sensors detected! Please ensure that sensors are connected correctly and have been assigned a UNIQUE ID, then scan again.</red><br></br><br></br>
            <Link to="/"><button class="smallbutton">Main Menu</button></Link><br></br><br></br></h2>
        </div>
      )
    } else if (this.state.sensors > 0) {
      return (
        <h2><br></br><table align='center'>
          {this.createHeaders()}
          {this.renderDataList()}
        </table>
          <br></br><br></br>
          <Link to="/"><button class="smallbutton">Main Menu</button></Link><br></br><br></br></h2>

      )
    }
  }
}

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);