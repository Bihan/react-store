import PropTypes from 'prop-types';
import React from 'react';

import Numeral from './index';

import styles from './styles.scss';

const propTypes = {
    /**
     * reqired for style override
     */
    className: PropTypes.string,

    /**
     * The label of the numeral
     */
    label: PropTypes.string,
    /**
     * show in block
     */
    inBlock: PropTypes.bool,
    /**
     * The value of the numeral
     */
    value: PropTypes.number,
    /**
     * The value which is compared with referenceLine to identify color
     * Generally referenceValue is equal to value
     */
    referenceValue: PropTypes.number,
    /**
     * The value which sets the baseline for comparision. referenceValue
     * below referenceLine shows a negative color.
     */
    referenceLine: PropTypes.number,
    /**
     * to generate className
     * params provided in callback (referenceValue, value, referenceLine)
     */
    modifier: PropTypes.func,
};

const defaultProps = {
    className: '',
    label: undefined,
    value: undefined,
    referenceValue: undefined,
    referenceLine: undefined,
    modifier: (refValue, value, refLine) =>
        (refValue - refLine >= 0 ? styles['gain-positive'] : styles['gain-negative']),
    inBlock: false,
};

/**
 * Numeral component for formatted numbers with conditional coloring
 */
export default class ColoredNumeral extends React.PureComponent {
    static defaultProps = defaultProps;
    static propTypes = propTypes;

    render() {
        const {
            className,
            label,
            referenceLine = 0,
            value,
            referenceValue = value,
            modifier,
            inBlock,
            ...props
        } = this.props;

        const defaultStyle = inBlock ? 'block-numeral' : 'colored-numeral';
        const colorClass = modifier(referenceValue, value, referenceLine);

        return (
            <span className={`${defaultStyle} ${className} ${colorClass} ${styles[defaultStyle]}`}>
                {
                    label && (
                        <div
                            className="label"
                        >
                            { label }
                        </div>
                    )
                }
                <Numeral
                    value={value}
                    {...props}
                />
            </span>
        );
    }
}
