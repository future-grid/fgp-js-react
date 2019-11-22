import React, { Component } from 'react'
import './BasicMapDrawSelector.css'
import Draw, {createRegularPolygon, createBox} from 'ol/interaction/Draw';

export class BasicMapDrawSelector extends Component {
    constructor(props){
        super(props);
        this.state = {
          
        };
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
                    {/* <option value={"Circle"}>
                        Circle
                    </option>
                    <option value={"Square"}>
                        Square
                    </option>
                    <option value={"Box"}>
                        Box
                    </option> */}
                </select>
            </div>
        )
    }
}

export default BasicMapDrawSelector
