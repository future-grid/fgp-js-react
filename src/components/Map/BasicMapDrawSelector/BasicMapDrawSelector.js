import React, { Component } from 'react'
import './BasicMapDrawSelector.css'
import Draw, {createRegularPolygon, createBox} from 'ol/interaction/Draw';

export class BasicMapDrawSelector extends Component {
    constructor(props){
        super(props);
    }


    componentDidUpdate(){
        // console.log('hey, the features changed => ', this.props.focusedFeatures);
    }
   
    render() {
        return (
            <div className={ "d-block fgpReactMapDrawBox" }>
                <label htmlFor={"mapDraw"}>
                    Selection:
                </label>
                <select defaultValue={this.props.drawType} onChange={this.props.handleDrawingSelection} id="mapDraw">
                    <option value={"None"}>
                        Single
                    </option>
                    <option value={"Circle"}>
                        Multi-Selection-Circle
                    </option>
                    <option value={"Square"}>
                        Multi-Selection-Square
                    </option>
                    <option value={"Polygon"}>
                        Polygon
                    </option>
                </select>
            </div>
        )
    }
}

export default BasicMapDrawSelector
