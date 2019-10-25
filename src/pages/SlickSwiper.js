import React, { Component } from 'react';
import ReactSlick from '../components/ReactSlick';
const {
    AntdCarousel,
    CustomPag,
    AsNavFor,
} = ReactSlick;

class SlickSwiper extends Component {
    render() {
        return (
            <div>
                <div style={{marginBottom: 20}}>
                    <AntdCarousel />
                </div>
                <div style={{marginBottom: 20}}>
                    <CustomPag />
                </div>
                <div style={{marginBottom: 20}}>
                    <AsNavFor />
                </div> 
            </div>
        );
    }
}

export default SlickSwiper;