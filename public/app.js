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

var CardList = React.createClass({
  render: function() {
    var cardNodes = this.props.data.map(function(card) {
      return (
        <Card title={card.title} creation={card.createdBy}
          assigned={card.assignedBy} priority={card.priority}  key={card.id}>
        </Card>
      );
    });
    return (
      <div className="cardList">
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
        this.setState({data: data});
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
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCardsFromServer();
  },
  render: function() {
    return (
      <div className="cardBox">
        <h1>Kaban Cards</h1>
        <CardList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
   <CardBox />,
    document.getElementById('app')
  );