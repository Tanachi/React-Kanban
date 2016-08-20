function selectOptions(status) {
  var done = "Done";
  var progress = "In Progress";
  var queue = "Queue";
  var returnArray = [];
  if(status === done){
    returnArray.push(progress);
    returnArray.push(queue);
  }
  if(status === queue){
    returnArray.push(done);
    returnArray.push(progress);
  }
  if(status === progress){
    returnArray.push(done);
    returnArray.push(queue);
  }
  return returnArray;
}

var Card = React.createClass({
  render: function() {
      var options = selectOptions(this.props.status);
    return (
      <div className="card">
        <h3 className="cardTitle">
          {this.props.title}
        </h3>
        <h3 className="cardCreation">
          {this.props.creation}
        </h3>
        <h3 className="cardAssigned">
          {this.props.assigned}
        </h3>
        <h3 className="cardPriority">
          {this.props.priority}
        </h3>
        <select name="status" defaultValue = "Select New Status">
          <option value={options[0]}>{options[0]}</option>
          <option value={options[1]}>{options[1]}</option>
        </select>
      </div>
    );
  }
});
var CardList = React.createClass({
  render: function() {
    var cardNodes = this.props.data.map(function(card) {
      return (
        <Card status={card.status} title={card.title} creation={card.createdBy}
          assigned={card.assignedBy} priority={card.priority}  key={card.id}>
        </Card>
      );
    });
    return (
      <div className="cardList">
        <h1>
          {this.props.display}
        </h1>
        {cardNodes}
      </div>
    );
  }
});
var CardForm = React.createClass({
  getInitialState: function() {
    return {title: '', createdBy: '', assignedBy:'', priority:''};
  },
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },
  handleCreatedByChange: function(e) {
    this.setState({createdBy: e.target.value});
  },
  handleAssignedByChange: function(e) {
    this.setState({assignedBy: e.target.value});
  },
  handlePriorityChange: function(e) {
    this.setState({priority: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var assignedBy = this.state.assignedBy.trim();
    var createdBy = this.state.createdBy.trim();
    var priority = this.state.priority.trim();
    if (!title || !assignedBy || !createdBy || !priority) {
      return;
    }
    this.props.onCardSubmit({title: title, createdBy: createdBy,
      assignedBy: assignedBy, priority: priority});
    this.setState({title: '', createdBy: '', assignedBy:'', priority:''});
  },
  render: function() {
    return (
      <form className="cardForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <input
          type="text"
          placeholder="CreatedBy"
          value={this.state.createdBy}
          onChange={this.handleCreatedByChange}
        />
         <input
          type="text"
          placeholder="AssignedBy"
          value={this.state.assignedBy}
          onChange={this.handleAssignedByChange}
        />
         <input
          type="text"
          placeholder="priority"
          value={this.state.priority}
          onChange={this.handlePriorityChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var CardBox = React.createClass({
  loadCardsFromServer: function() {
    $.ajax({
      url: '/cards',
      type: 'GET',
      dataType: "json",
      cache: false,
      success: function(data) {
        var queueArray = [];
        var doneArray = [];
        var progressArray = [];
        data.forEach(function(element, index, array) {
          if(element.status === 'Queue')
            queueArray.push(element);
          if(element.status === 'Done')
            doneArray.push(element);
          if(element.status === 'In Progress')
            progressArray.push(element);
        });
        this.setState({queue: queueArray, done:doneArray, progress:progressArray});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCardSubmit: function(card) {
    $.ajax({
      url: "/cards",
      dataType: 'json',
      type: 'POST',
      data: card,
      success: function(data) {
        this.setState({data: data});
        location.reload();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {done: [], queue: [], progress: []};
  },
  componentDidMount: function() {
    this.loadCardsFromServer();
  },
  render: function() {
    return (
      <div className="cardBox">
        <h1>Kaban Cards</h1>
          <CardList display={"Done"} data={this.state.done} />
          <CardList display={"Queue"} data={this.state.queue} />
          <CardList display={"In Progress"} data={this.state.progress} />
          <CardForm onCardSubmit={this.handleCardSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
  <CardBox />,
  document.getElementById('app')
);