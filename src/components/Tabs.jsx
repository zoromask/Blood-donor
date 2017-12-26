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