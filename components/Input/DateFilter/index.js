import PropTypes from 'prop-types';
import React from 'react';

import {
    SelectInput,
    DateInput,
} from '..';
import {
    PrimaryButton,
    DangerButton,
} from '../../Action';
import {
    FormattedDate,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '../../View';

import styles from './styles.scss';


const propTypes = {
    /**
     * for styling
     */
    className: PropTypes.string,

    /**
     * Whether the input should be disabled
     */

    onChange: PropTypes.func,

    /**
     * Placeholder for the input
     */
    placeholder: PropTypes.string,

    value: PropTypes.shape({
        type: PropTypes.string,
        startDate: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        endDate: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
    }),
};

const defaultProps = {
    className: '',
    onChange: undefined,
    placeholder: 'Select an option',
    value: undefined,
};

export default class DateFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;
    static defaultOptions = [
        { key: 'today', label: 'Today' },
        { key: 'yesterday', label: 'Yesterday' },
        { key: 'current-week', label: 'This week' },
        { key: 'last-7-days', label: 'Last 7 days' },
        { key: 'current-month', label: 'This month' },
        { key: 'last-30-days', label: 'Last 30 days' },
        { key: 'custom', label: 'Custom range' },
    ];

    constructor(props) {
        super(props);

        this.state = {
            modalShown: false,
            startDate: undefined,
            endDate: undefined,
        };

        if (props.value && props.value.type === 'custom') {
            this.state = {
                ...this.state,
                startDate: props.value.startDate,
                endDate: props.value.endDate,
            };
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value && nextProps.value.type === 'custom') {
            this.setState({
                startDate: nextProps.value.startDate,
                endDate: nextProps.value.endDate,
            });
        }
    }

    getRangeValues = (type) => {
        let startDate = this.state.startDate;
        let endDate = this.state.endDate;

        switch (type) {
            case 'today': {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                startDate = today.getTime();
                endDate = today.getTime();
                break;
            }
            case 'yesterday': {
                const yesterday = new Date();
                yesterday.setHours(0, 0, 0, 0);
                yesterday.setDate(yesterday.getDate() - 1);
                startDate = yesterday.getTime();
                endDate = yesterday.getTime();
                break;
            }
            case 'current-week': {
                const min = new Date();
                min.setHours(0, 0, 0, 0);
                min.setDate(min.getDate() - min.getDay());
                startDate = min.getTime();

                const max = min;
                max.setHours(0, 0, 0, 0);
                max.setDate(min.getDate() + 7);
                endDate = max.getTime();
                break;
            }
            case 'last-7-days': {
                const min = new Date();
                min.setHours(0, 0, 0, 0);
                min.setDate(min.getDate() - 7);
                startDate = min.getTime();

                const max = new Date();
                max.setHours(0, 0, 0, 0);
                endDate = max.getTime();
                break;
            }
            case 'current-month': {
                const min = new Date();
                min.setHours(0, 0, 0, 0);
                min.setDate(1);
                startDate = min.getTime();

                const max = new Date();
                max.setHours(0, 0, 0, 0);
                endDate = max.getTime();
                break;
            }
            case 'last-30-days': {
                const min = new Date();
                min.setHours(0, 0, 0, 0);
                min.setDate(min.getDate() - 30);
                startDate = min.getTime();

                const max = new Date();
                max.setHours(0, 0, 0, 0);
                endDate = max.getTime();
                break;
            }
            default:
                console.error(`Invalid type: ${type}`);
        }

        return {
            startDate,
            endDate,
        };
    }

    getValue = () => (this.props.value)

    setCustomDate = () => {
        const {
            startDate,
            endDate,
        } = this.state;

        this.props.onChange({
            type: 'custom',
            startDate,
            endDate,
        });

        this.closeModal();
    }

    getStyleName = () => {
        const {
            className,
            value,
        } = this.props;

        const styleNames = [...className.split(' '), styles['select-input']];

        if (value && value.type === 'custom') {
            styleNames.push(styles.monospace);
        }

        return styleNames.join(' ');
    }

    handleChange = (valueType) => {
        if (this.props.onChange) {
            if (!valueType) {
                this.props.onChange(valueType);
            } else if (valueType === 'custom-range') {
                this.setCustomDate();
            } else if (valueType === 'custom') {
                this.showModal();
            } else {
                this.props.onChange({
                    type: valueType,
                    ...this.getRangeValues(valueType),
                });
            }
        }
    }

    showModal = () => {
        this.setState({
            modalShown: true,
        });
    }

    closeModal = () => {
        this.setState({ modalShown: false });
    }

    render() {
        const {
            placeholder,
            value,
            onChange, // eslint-disable-line no-unused-vars
            ...otherProps
        } = this.props;


        const {
            modalShown,
            startDate,
            endDate,
        } = this.state;

        const options = [
            ...DateFilter.defaultOptions,
        ];

        if (startDate && endDate) {
            const startStr = FormattedDate.format(new Date(startDate), 'dd-MM-yyyy');
            const endStr = FormattedDate.format(new Date(endDate), 'dd-MM-yyyy');
            const customLabel = `${startStr} to ${endStr}`;

            options.push({ key: 'custom-range', label: customLabel });
        }

        return ([
            <SelectInput
                key="select-input"
                onChange={this.handleChange}
                options={options}
                placeholder={placeholder}
                className={this.getStyleName(value)}
                value={value && (value.type === 'custom' ? 'custom-range' : value.type)}
                {...otherProps}
            />,
            <Modal
                key="modal"
                closeOnEscape
                onClose={this.closeModal}
                show={modalShown}
                className={styles.modal}
            >
                <ModalHeader
                    title="Select date range"
                />
                <ModalBody>
                    <DateInput
                        label="Start date"
                        onChange={timestamp => this.setState({ startDate: timestamp })}
                        value={startDate}
                    />
                    <DateInput
                        label="End date"
                        onChange={timestamp => this.setState({ endDate: timestamp })}
                        value={endDate}
                    />
                </ModalBody>
                <ModalFooter>
                    <DangerButton
                        onClick={this.closeModal}
                    >
                        Close
                    </DangerButton>
                    <PrimaryButton
                        onClick={this.setCustomDate}
                    >
                        Apply
                    </PrimaryButton>
                </ModalFooter>
            </Modal>,
        ]);
    }
}
