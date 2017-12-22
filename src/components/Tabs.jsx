import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';

export class Tabs extends Component {
  
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeTabIndex: this.props.defaultActiveTabIndex,
            error: false,
            success: false
        };
        this.handleTabClick = this.handleTabClick.bind(this);
        this.debounce = this.debounce.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
        this.renderSuccessMessage = this.renderSuccessMessage.bind(this);
    }
  
    // Toggle currently active tab
    handleTabClick(tabIndex) {
        this.setState({
            activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
        });
    }

    // Encapsulate <Tabs/> component API as props for <Tab/> children
    renderChildrenWithTabsApiAsProps() {
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                onClick : this.handleTabClick,
                tabIndex: index,
                isActive: index === this.state.activeTabIndex
            });
        });
    }
  
    // Render current active tab content
    renderActiveTabContent() {
        const {children} = this.props;
        const {activeTabIndex} = this.state;
        if(children[activeTabIndex]) {
            return React.cloneElement(children[activeTabIndex].props.children, {
                submitData: this.submitData,
                debounce: this.debounce,
                renderErrorMessage: this.renderErrorMessage,
                renderSuccessMessage: this.renderSuccessMessage
            });
        }
    }

    renderSuccessMessage() {
        this.setState({ success: true });
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000)
    }

    renderErrorMessage() {
        this.setState({ error: true });
        setTimeout(() => {
            this.setState({ error: false });
        }, 4000)
    }

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    //submit filtering/adding data
    submitData(data) {
        console.log(data);
        axios.get('http://localhost:5000/filter/blood', {
            params: {
                bloodType: data.bloodType,
                ageFrom: data.ages[0],
                ageTo: data.ages[1],
                longitudeMin: data.searchArea.minLong,
                longitudeMax: data.searchArea.maxLong,
                latitudeMin: data.searchArea.minLat,
                latitudeMax: data.searchArea.maxLat
            }
            })
            .then(function (response) {
                console.log("succeed");
                console.log(response);
            })
            .catch(function (error) {
                console.log('error');
                console.log(error);
            });
        }
  
    render() {
        return (
            <div className="tabs">
                <ul className="nav nav-tabs nav-justified">
                    {this.renderChildrenWithTabsApiAsProps()}
                </ul>
                <div className="tabs-active-content">
                    {this.renderActiveTabContent()}
                    
                    { this.state.error ?
                        <div className="status-message">
                            <div className="error">Something wrong</div>
                        </div> : ''
                    }

                    { this.state.success ?
                        <div className="status-message">
                            <div className="success">Success</div>
                        </div> : ''
                    }
                </div>
            </div>
        );
    }
};

export default Tabs;