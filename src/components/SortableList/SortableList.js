import React, { Component } from 'react';

import Card from "./Card";
import { DropTarget, DragSource } from 'react-dnd';

const typeCard = Symbol.for('@@Type::Card');

const specTarget = {
  drop(props) {
    return {
      id: props.id,
      index: props.index,
    };
  }
};

const specSource = {
  beginDrag(props) {
    return {
      id: props.id,
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    const source = monitor.getItem();
    const target = monitor.getDropResult();

    if (source.id === target.id) {
      return;
    }
    props.moveCard(source.id, target.index);
  }
};

const collectTarget = connect => ({
  connectDropTarget: connect.dropTarget(),
});

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const CardWithDnD = DropTarget(typeCard, specTarget, collectTarget)(
  DragSource(typeCard, specSource, collectSource)(Card)
);

class SortableList extends React.Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.state = {
      cards: [{
          id: '--0',
          title: '#1 Test',
          color: "success"
        }, {
          id: '--1',
          title: '#2 Text',
            color: "primary"
        }, {
          id: '--2',
          title: '#3 Task',
            color: "warning"
        }, {
          id: '--3',
          title: '#4 Some text',
            color: "info"
        }, {
          id: '--4',
          title: '#5 New row',
            color: "danger"
        }, {
          id: '--5',
          title: '#6 Next item',
            color: "dark"
        },
      ]
    };
  }

  moveCard (id, index) {
    const { cards } = this.state;
    const sourceCard = cards.find(card => card.id === id);
    const sortCards = cards.filter(card => card.id !== id)

    sortCards.splice(index, 0, sourceCard);
    this.setState({ cards: sortCards });
  }

  render() {
    const cards  = this.props.children;
    return (
      <div className="offset-2 col-8">
        { cards.map((card, i) => (
          <CardWithDnD
            key={card.id}
            index={i}
            moveCard={this.moveCard}
            {...card}
          />
        )) }
      </div>
    );
  }
}

export default SortableList;
