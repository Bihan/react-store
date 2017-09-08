import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.scss';

// TODO: add className for all spans in numeral
// TODO: remove all gain-class in all other files because they are not required

import {
    addSeparator,
    isFalsy,
    isTruthy,
    formattedNormalize,
} from '../../utils/common';

const propTypes = {
    /**
     * Normalize numer into Lac, Cr, Ar
     */
    normal: PropTypes.bool,
    /**
     * Numer of digits after decimal point. Rounding is also applied.
     */
    precision: PropTypes.number,
    /**
     * Prefix the output with certain string. Eg. $
     */
    prefix: PropTypes.string,
    /**
     * Specify which separator to use for thousands
     */
    separator: PropTypes.string,
    /**
     * Show or hide thousands separator
     */
    showSeparator: PropTypes.bool,
    /**
     * Show both positive and negative sign for number
     */
    showSign: PropTypes.bool,
    /**
     * Prefix the output with certain string. Eg. %
     */
    suffix: PropTypes.string,
    /**
     * The value of the numeral
     */
    value: PropTypes.number,
};

const defaultProps = {
    normal: false,
    precision: 2,
    prefix: undefined,
    separator: undefined,
    showSeparator: true,
    showSign: false,
    suffix: undefined,
    value: undefined,
};


/**
 * Numeral component for formatted numbers
 */
@CSSModules(styles, { allowMultiple: true })
export default class Numeral extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            normal,
            precision,
            prefix,
            separator,
            showSeparator,
            showSign,
            suffix,
            value,
        } = this.props;

        if (isFalsy(value)) {
            return (
                <span>?</span>
            );
        }

        // Only use absolute part if showSign is true (sign are added later)
        let number = isTruthy(showSign) ? Math.abs(value) : value;

        // Get normalize-suffix and reduce the number
        let normalizeSuffix;
        if (normal) {
            const val = formattedNormalize(number);
            number = val.number;
            normalizeSuffix = val.normalizeSuffix;
        }

        // Convert number to fixed precision
        if (isTruthy(precision)) {
            number = number.toFixed(precision);
        }

        // Convert number to add separator
        if (showSeparator) {
            number = addSeparator(number, separator);
        }

        return (
            <span styleName="numeral">
                {
                    isTruthy(prefix) &&
                    <span>
                        {prefix}
                    </span>
                }
                {
                    isTruthy(showSign) && value !== 0 &&
                    <span>
                        {value > 0 ? '+' : '-'}
                    </span>
                }
                <span>
                    {number}
                </span>
                {
                    isTruthy(normalizeSuffix) &&
                    <span>
                        {normalizeSuffix}
                    </span>
                }
                {
                    isTruthy(suffix) &&
                    <span>
                        {suffix}
                    </span>
                }
            </span>
        );
    }
}
