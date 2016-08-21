var Card = React.createClass({
  getInitialState: function() {
    return {status:this.props.status};
  },
  handleStatusChange: function(e) {
    console.log("Changing State");
    this.setState({status: e.target.value});
    this.handleStatusSubmit({status:e.target.value});
  },
  handleStatusSubmit: function(card) {
    $.ajax({
      url: "/cards/" + this.props.cardID,
      dataType: 'json',
      type: 'PUT',
      data: card,
      success: function(data) {
        this.props.updater(this.props.cardID, card.status);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleDeleteSubmit: function (argument) {
    $.ajax({
      url: "/cards/" + this.props.cardID,
      dataType: 'json',
      type: 'DELETE',
      data: {id:this.props.cardID},
      success: function(data) {
        location.reload();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
      var options = selectOptions(this.props.status);
      var optionsList = options.map(function (status) {
        return (
        <option value={status} key={options.indexOf(status)}>{status}</option>
        )
      });
    return (
      <div className="card" id={this.props.cardID}>
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
        <select
          name="status"
          value = {this.props.status}
          onChange={this.handleStatusChange}
        >
          {optionsList}
        </select>
        <button onClick={this.handleDeleteSubmit}>DELETE THIS</button>
      </div>
    );
  }
});
var CardList = React.createClass({
  render: function() {
    var updater = this.props.updater;
    var dataArray = this.props.data.filter(this.props.cleaner);
    var cardNodes = dataArray.map(function(card) {
      return (
        <Card updater={updater} cardID={card.id} status={card.status} title={card.title} creation={card.createdBy}
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
        this.setState({data:data});
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
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCardsFromServer();
  },
  updateBoardState: function(id, status) {
    var newData = this.state.data;
    newData.forEach(function(element, index, array) {
      if(element.id === id){
        element.status = status;
      }
    });
    this.setState({data:newData});
  },
  render: function() {
    return (
      <div className="cardBox">
        <h1>Kaban Cards</h1>
          <CardList updater={this.updateBoardState} cleaner={isDone} display={"Done"}  data={this.state.data} />
          <CardList updater={this.updateBoardState} cleaner={isProgress} display={"In Progress"} data={this.state.data} />
          <CardList updater={this.updateBoardState} cleaner={isQueue} display={"Queue"} data={this.state.data} />
          <CardForm onCardSubmit={this.handleCardSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
  <CardBox />,
  document.getElementById('app')
);

function selectOptions(status) {
  var statusList = ["Done", "In Progress", "Queue"];
  var returnList = [status];
  statusList.forEach(function(element,index,array) {
    if(element !== status)
      returnList.push(element);
  });
  return returnList;
}

function isDone(data) {
  if ('status' in data  &&  data.status === "Done") {
    return true;
  }
  else if(typeof(data) === 'string' && data === "Done"){
    return true;
  }
  else {
    return false;
  }
}
function isProgress(data) {
  if ('status' in data  &&  data.status === "In Progress") {
    return true;
  }
  else if(typeof(data) === 'string' && data === "In Progress"){
    return true;
  }
  else {
    return false;
  }
}
function isQueue(data) {
  if ('status' in data  &&  data.status === "Queue") {
    return true;
  }
  else if(typeof(data) === 'string' && data === "Queue"){
    return true;
  }
  else {
    return false;
  }
}