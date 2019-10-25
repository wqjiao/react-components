import React, {Component} from 'react';

class DragImg extends Component {
    state = {
        cursor: 'pointer',
        relativeX: 0,
        relatveY: 0,
        isDragging: false,
    };

    componentDidMount() {
        let node = this.refs.dragPanel;

        node.style.left = '50px';
        node.style.top = '50px';

    }

    handleMouseEnter = (e) => {
        console.log('handleMouseEnter')
        this.setState({
            cursor: 'cursor'
        });
    }

    handleMouseLeave = (e) => {
        console.log('handleMouseLeave')
        this.setState({
            isDragging: false
        });
    }

    handleMouseDown = (e) => {
        console.log('handleMouseDown')
        this.setState({
            isDragging: true
        });
    }

    handleMouseUp = (e) => {
        console.log(this.state.isDragging, 'handleMouseUp');
        this.setState({
            relativeX: 0,
            relativeY: 0,
            isDragging: false,
        });
    }

    handleMouseMove = (e) => {
        let node = this.refs.dragPanel;
        console.log('handleMouseMove', node)
        this.setState({
            cursor: 'move',
            relativeX: e.clientX - node.offsetLeft,
            relativeY: e.clientY - node.offsetTop,
        });

        if (this.state.isDragging) {
            node.style.left = e.pageX - this.state.relativeX + 'px';
            node.style.top = e.pageY - this.state.relativeY + 'px';
        }
    }

    render() {
        return(
            <div
                onMouseEnter = { this.handleMouseEnter }
                onMouseLeave = { this.handleMouseLeave }
                onMouseDown={this.handleMouseDown} 
                onMouseUp={this.handleMouseUp}
                onMouseMove = { this.handleMouseMove }
                ref = "dragPanel"
                style = {{ 'cursor': this.state.cursor, userSelect: 'none' }}
            >
                <span  draggable="true">拖拽拖拽</span>
            </div>
        )
    }
}

export default DragImg;
