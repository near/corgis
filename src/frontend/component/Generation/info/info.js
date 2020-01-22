import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { GiGreekSphinx } from "react-icons/gi";

import ColorPicker from '../colorpicker/colorpicker';
import Button from '../../common/Button/Button';

import './info.css';
let generate = require('project-name-generator');
class Info extends Component {
    state = {
        Name: `${this.props.newCorgiName}`
    }

    handleRandomName = () => {
        let name = generate({ words: 2, alliterative: true }).spaced
        this.setState({ Name: name })
        this.props.handleChange({ name: "newCorgiName", value: name })
    }

    handleNameChange = (event) => {
        let value = event.target.value;
        this.setState({ Name: value })
        this.props.handleChange({ name: "newCorgiName", value })
    }

    handleSubmit = (e) => {
        let { handleChange, history } = this.props
        e.preventDefault()
        handleChange({ name: "newCorgiName", value: this.state.Name })
        history.push("/generating")
    }

    render() {
        let { color, backgroundColor, handleChange } = this.props
        return (
            <div className="inputboard">
                <p className="title">My Corgi is called</p>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input
                            className="inputname"
                            name="Name"
                            type="text"
                            placeholder="Corgi name"
                            onChange={this.handleNameChange}
                            value={this.state.Name}
                            required />
                        <GiGreekSphinx
                            onClick={this.handleRandomName}
                            style={{
                                marginLeft: "5px",
                                color: "#a51cea",
                                fontSize: "1.5rem",
                                borderRadius: "50%",
                                boxShadow: "0 0 4px 4px rgba(0, 0, 0, 0.5), inset 0 0 5px 2px #ffffff",
                                background: "#f5ebff",
                                cursor: "pointer",
                                marginTop: "10px"
                            }} />
                    </div>
                    <p className="title">Colors</p>
                    <ColorPicker
                        color={color}
                        handleChange={handleChange}
                        backgroundColor={backgroundColor} />
                    <Button description="Generate Corgi" />
                </form>
                <p className="quote">This will create a one-of-a-kind Corgi that will develop a unique size and
                    thought process. The size it grows to will untimately determine it’s value
                </p>
            </div>
        )
    }
}

export default withRouter(Info)
