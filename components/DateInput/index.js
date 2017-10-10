import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import React from 'react';

import DatePicker from '../DatePicker';
import DateUnit from './DateUnit';
import FloatingContainer from '../FloatingContainer';
import styles from './styles.scss';

import { getNumDaysInMonth, isFalsy, isTruthy } from '../../utils/common';


const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};


@CSSModules(styles, { allowMultiple: true })
export default class DateInput extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            dayUnit: undefined,
            monthUnit: undefined,
            yearUnit: undefined,

            day: null,
            month: null,
            year: null,

            date: null,

            showDatePicker: false,
            pickerContainerStyle: {},
        };

        this.boundingClientRect = {};
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
    }

    getDimension = () => {
        const cr = this.container.getBoundingClientRect();
        this.boundingClientRect = cr;

        return {
            pickerContainerStyle: {
                left: `${cr.right - 250}px`,
                top: `${(cr.top + window.scrollY) + cr.height}px`,
                width: '250px',
            },
        };
    };

    setToday = () => {
        this.setValue(new Date());
    }

    setValue = (timestamp) => {
        if (isFalsy(timestamp)) {
            this.setState({
                date: null,
                day: null,
                month: null,
                year: null,
            });
            return;
        }

        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        this.setState({ date, day, month, year });
    }

    changeValue = (key, val) => {
        const newState = { ...this.state };
        newState[key] = val;

        let date;
        if (!this.state.date) {
            date = new Date();
        } else {
            date = new Date(this.state.date.getTime());
        }

        date.setDate(1);
        date.setMonth(newState.month - 1);
        date.setYear(newState.year);

        if (newState.day) {
            const max = getNumDaysInMonth(date);
            if (newState.day > max) {
                newState.day = max;
            }
            date.setDate(newState.day);
        }

        newState.date = date;

        this.setState(newState);
    }

    clear = () => {
        this.setValue(null);
    }

    handleDatePickerClosed = () => {
        this.setState({
            focused: false,
            showDatePicker: false,
        });
    }

    handleDatePick = (timestamp) => {
        this.setValue(timestamp);
        this.setState({ focused: true });
    }

    handleDynamicStyleOverride = (pickerContainer) => {
        const pickerRect = pickerContainer.getBoundingClientRect();
        const cr = this.boundingClientRect;

        const pageOffset = window.innerHeight;
        const containerOffset = cr.top + pickerRect.height + cr.height;

        const newStyle = {
        };

        if (pageOffset < containerOffset) {
            newStyle.top = `${(cr.top + window.scrollY) - pickerRect.height}px`;
        }

        return newStyle;
    }

    handleScroll = () => {
        if (this.state.showOptions) {
            const newState = this.getDimension();
            this.setState(newState);
        }
    }

    handleResize = () => {
        const newState = this.getDimension();
        this.setState(newState);
    };

    handleUnitFocus = () => {
        this.setState({ focused: true });
    }

    handleUnitBlur = () => {
        this.setState({ focused: false });
    }

    showDatePicker = () => {
        this.setState({
            showDatePicker: true,
            ...this.getDimension(),
        });
    }

    render() {
        const {
            className,
        } = this.props;

        const isToday =
            (this.state.date && this.state.date.toDateString()) === (new Date()).toDateString();

        return (
            <div
                styleName="date-input-wrapper"
                className={className}
                ref={(el) => { this.container = el; }}
            >
                <div styleName={`date-input ${this.state.focused || this.state.showDatePicker ? 'focus' : ''}`}>
                    <div styleName="inputs">
                        <DateUnit
                            length={2}
                            max={getNumDaysInMonth(this.state.date)}
                            nextUnit={this.state.monthUnit}
                            onChange={(value) => { this.changeValue('day', value); }}
                            onFocus={this.handleUnitFocus}
                            onBlur={this.handleUnitBlur}
                            placeholder="dd"
                            ref={(unit) => { this.setState({ dayUnit: unit }); }}
                            styleName="day"
                            value={isTruthy(this.state.day) ? String(this.state.day) : null}
                        />
                        <span styleName="separator">/</span>
                        <DateUnit
                            length={2}
                            max={12}
                            nextUnit={this.state.yearUnit}
                            onChange={(value) => { this.changeValue('month', value); }}
                            onFocus={this.handleUnitFocus}
                            onBlur={this.handleUnitBlur}
                            placeholder="mm"
                            ref={(unit) => { this.setState({ monthUnit: unit }); }}
                            styleName="month"
                            value={isTruthy(this.state.month) ? String(this.state.month) : null}
                        />
                        <span styleName="separator">/</span>
                        <DateUnit
                            length={4}
                            onChange={(value) => { this.changeValue('year', value); }}
                            onFocus={this.handleUnitFocus}
                            onBlur={this.handleUnitBlur}
                            placeholder="yyyy"
                            ref={(unit) => { this.setState({ yearUnit: unit }); }}
                            styleName="year"
                            value={isTruthy(this.state.year) ? String(this.state.year) : null}
                        />
                    </div>
                    <div styleName="actions">
                        <button
                            onClick={this.clear}
                            styleName={isFalsy(this.state.date) && 'hidden'}
                        >
                            <span className="ion-close-round" />
                        </button>
                        <button
                            onClick={this.setToday}
                            styleName={isToday && 'active'}
                        >
                            <span className="ion-android-time" />
                        </button>
                        <button onClick={this.showDatePicker}>
                            <span className="ion-ios-calendar-outline" />
                        </button>
                    </div>
                </div>

                <FloatingContainer
                    ref={(el) => { this.pickerContainer = el; }}
                    show={this.state.showDatePicker}
                    onClose={this.handleDatePickerClosed}
                    containerId="datepicker-container"
                    styleOverride={this.state.pickerContainerStyle}
                    onDynamicStyleOverride={this.handleDynamicStyleOverride}
                    closeOnBlur
                >
                    <DatePicker
                        date={this.state.date && this.state.date.getTime()}
                        onDatePick={this.handleDatePick}
                    />
                </FloatingContainer>
            </div>
        );
    }
}
