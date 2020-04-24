/**
 * External dependencies
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';

import './style.scss';

class ChecklistAnswer extends Component {
	constructor( props ) {
		super( props );
		this.state = { checked: false };
	}

	toggleCheckbox = () => {
		this.setState( { checked: ! this.state.checked } );
	};

	render() {
		return (
			<div
				className={ classNames( 'jp-checklist-answer-container', { checked: this.state.checked } ) }
				onClick={ this.toggleCheckbox }
				onKeyPress={ this.toggleCheckbox }
				role="checkbox"
				aria-checked={ this.state.checked }
				tabIndex={ 0 }
			>
				<div className="jp-checklist-answer-checkbox-container">
					<input type="checkbox" tabIndex={ -1 } checked={ this.state.checked } />
				</div>
				<div className="jp-checklist-answer-title">{ this.props.title }</div>
				<div className="jp-checklist-answer-details">{ this.props.details }</div>
				<div className="jp-checklist-answer-chevron-container">
					<Gridicon icon="chevron-down" size={ 14 } />
				</div>
			</div>
		);
	}
}

ChecklistAnswer.propTypes = {
	title: PropTypes.string.isRequired,
	details: PropTypes.string.isRequired,
};

export { ChecklistAnswer };
