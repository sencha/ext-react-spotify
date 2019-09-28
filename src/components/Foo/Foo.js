import React, {Component} from "react";
import "./Foo.scss";
import Constants from "../../utils/Constants";

export default class Foo extends Component {
    render() {
        return (<div className="foo">
            <p>
                This is my custom component.
            </p>
            <p>
                And by the way, Avogadros number is {Constants.avogadrosNumber}.
            </p>
        </div>);
    }
}
