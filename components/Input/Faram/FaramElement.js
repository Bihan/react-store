import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

import FaramContext from './FaramContext';
import { isTruthy } from '../../../utils/common';


/*
 * FaramElementHOC
 *
 * Transforms a component that has `onChange` and `value`
 * props to a consumer of FaramContext and auto connect the
 * input `faramElementName` field of the form data.
 */


const propTypes = {
    faramElementName: PropTypes.string,
    faramElementIndex: PropTypes.number,
    forwardedRef: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    faramAction: PropTypes.string,
    faramElement: PropTypes.bool,
};

const defaultProps = {
    faramElementName: undefined,
    faramElementIndex: undefined,
    forwardedRef: undefined,
    faramAction: undefined,
    faramElement: false,
};

const FaramElement = elementType => (WrappedComponent) => {
    class FaramElementHOC extends React.PureComponent {
        static propTypes = propTypes;
        static defaultProps = defaultProps;

        calculateProps = (api) => {
            const {
                forwardedRef,
                faramElementName,
                faramElementIndex,
                faramAction,
                faramElement,
                ...props
            } = this.props;

            // Set reference
            props.ref = forwardedRef;

            if (!api) {
                return props;
            }

            const identifier = faramElementName || faramElementIndex;
            if (faramElement || isTruthy(identifier) || isTruthy(faramAction)) {
                return {
                    ...api.getCalculatedProps(identifier, elementType, faramAction),
                    ...props,
                };
            }

            return props;
        }

        renderWrappedComponent = (api) => {
            const newProps = this.calculateProps(api);
            return <WrappedComponent {...newProps} />;
        }

        render() {
            return (
                <FaramContext.Consumer>
                    {this.renderWrappedComponent}
                </FaramContext.Consumer>
            );
        }
    }

    return hoistNonReactStatics(
        React.forwardRef((props, ref) => (
            <FaramElementHOC
                {...props}
                forwardedRef={ref}
            />
        )),
        WrappedComponent,
    );
};

export default FaramElement;
