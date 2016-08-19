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
          if(element.status === 'In Progress')
            doneArray.push(element);
          if(element.status === 'Queue')
            progressArray.push(element);
        });
        this.setState({queue: queueArray, done:doneArray, progress:progressArray});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
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
      </div>
    );
  }
});

ReactDOM.render(
   <CardBox />,
    document.getElementById('app')
  );