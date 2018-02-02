import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    load: PropTypes.func.isRequired,
};

class Bundle extends React.Component {
    static propTypes = propTypes;

    static loadingStyle = {
        height: '100%',
        fontSize: '2em',
        color: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    constructor(props) {
        super(props);
        this.state = {
            Component: null,
            failed: false,
        };
    }

    componentWillMount() {
        this.mounted = true;
        this.props.load()
            .then(this.handleLoad)
            .catch(this.handleLoadError);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleLoad = (Component) => {
        if (!this.mounted) {
            console.warn('Bundle was unmounted before loading Component');
            return;
        }
        this.setState({
            Component: Component.default ? Component.default : Component,
        });
    }

    handleLoadError = (err) => {
        if (!this.mounted) {
            console.warn('Bundle was unmounted before loading Component');
            return;
        }
        this.setState({ failed: true });
        console.warn('Failed loading bundle');
        console.warn(err);
    }

    renderLoading = ({ text }) => (
        <div style={Bundle.loadingStyle}>
            {text}
        </div>
    )

    render() {
        const {
            load, // eslint-disable-line no-unused-vars
            ...otherProps
        } = this.props;
        const { Component, failed } = this.state;
        const Loading = this.renderLoading;

        if (!Component) {
            const message = failed ? 'Error while loading page.' : 'Loading...';
            return (
                <Loading text={message} />
            );
        }
        return <Component {...otherProps} />;
    }
}

export default Bundle;
