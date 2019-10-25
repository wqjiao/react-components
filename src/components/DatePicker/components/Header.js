import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let { weeks } = this.props;

        return(
            <div className="weeks-header">
                {weeks.map((week, index) => {
                    return (
                        <div
                            style = {{
                                float: 'left',
                                boxSizing: 'border-box',
                                padding: '4px',
                                width: 28
                            }}
                            key={week + '-' + index}
                        >
                            <div className={'calender-date'}
                                style={{
                                    fontSize: 12,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    padding: '4px 0'
                                }}>
                                {week}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Header;
