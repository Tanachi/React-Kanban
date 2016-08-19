var Card = React.createClass({
  render: function() {
    return (
      <div className="card">
        <h2 className="cardTitle">
          {this.props.title}
        </h2>
        <h2 className="cardCreation">
          {this.props.creation}
        </h2>
        <h2 className="cardAssigned">
          {this.props.assigned}
        </h2>
        <h2 className="cardPriority">
          {this.props.priority}
        </h2>
      </div>
    );
  }
});
var QueueList = React.createClass({
  render: function() {
    var cardNodes = this.props.data.map(function(card) {
      return (
        <Card title={card.title} creation={card.createdBy}
          assigned={card.assignedBy} priority={card.priority}  key={card.id}>
        </Card>
      );
    });
    return (
      <div className="queueList">
        {cardNodes}
      </div>
    );
  }
});

var ProgressList = React.createClass({
  render: function() {
    var cardNodes = this.props.data.map(function(card) {
      return (
        <Card title={card.title} creation={card.createdBy}
          assigned={card.assignedBy} priority={card.priority}  key={card.id}>
        </Card>
      );
    });
    return (
      <div className="progressList">
        {cardNodes}
      </div>
    );
  }
});

var DoneList = React.createClass({
  render: function() {
    var cardNodes = this.props.data.map(function(card) {
      return (
        <Card title={card.title} creation={card.createdBy}
          assigned={card.assignedBy} priority={card.priority}  key={card.id}>
        </Card>
      );
    });
    return (
      <div className="doneList">
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
          <DoneList data={this.state.done} />
          <QueueList data={this.state.queue} />
          <ProgressList data={this.state.progress} />
          <CardForm onCardSubmit={this.handleCardSubmit} />
      </div>
    );
  }
});

ReactDOM.render(
   <CardBox />,
    document.getElementById('app')
  );