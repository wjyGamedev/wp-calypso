/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import page from 'page';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import ActionCard from 'components/action-card';
import Button from 'components/button';
import CompactCard from 'components/card/compact';
import ExternalLink from 'components/external-link';
import GoogleMyBusinessConnectButton from 'my-sites/google-my-business/connect-button';
import HeaderCake from 'components/header-cake';
import Main from 'components/main';
import config from 'config';
import { recordTracksEvent } from 'state/analytics/actions';
import { canCurrentUser } from 'state/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

class SelectBusinessType extends Component {
	static propTypes = {
		recordTracksEvent: PropTypes.func.isRequired,
		siteId: PropTypes.string.isRequired,
		translate: PropTypes.func.isRequired,
	};

	trackCreateMyListingClick = () => {
		this.props.recordTracksEvent(
			'calypso_google_my_business_select_business_type_create_my_listing_button_click'
		);
	};

	trackOptimizeYourSEOClick = () => {
		this.props.recordTracksEvent(
			'calypso_google_my_business_select_business_type_optimize_your_seo_button_click'
		);
	};

	trackGoogleMyBusinessLinkClick = () => {
		this.props.recordTracksEvent(
			'calypso_google_my_business_select_business_type_google_my_business_link_click'
		);
	};

	handleConnect = () => {
		/* eslint-disable no-console */
		console.log( 'connected' );
		// TODO: handle redirect to the "Create My Listings" page here
	};

	goBack = () => {
		page.back( `/stats/day/${ this.props.siteId }` );
	};

	render() {
		const { canUserManageOptions, translate, siteId } = this.props;

		let connectButton;

		if ( config.isEnabled( 'google-my-business' ) && canUserManageOptions ) {
			connectButton = (
				<GoogleMyBusinessConnectButton
					onClick={ this.trackCreateMyListingClick }
					onConnect={ this.handleConnect }
				>
					{ translate( 'Create Your Listing', {
						comment: 'Call to Action to add a business listing to Google My Business',
					} ) }
				</GoogleMyBusinessConnectButton>
			);
		} else {
			connectButton = (
				<Button
					primary
					href="https://www.google.com/business/"
					target="_blank"
					onClick={ this.trackCreateMyListingClick }
				>
					{ translate( 'Create Your Listing', {
						comment: 'Call to Action to add a business listing to Google My Business',
					} ) }{' '}
					<Gridicon icon="external" />
				</Button>
			);
		}

		return (
			<Main className="select-business-type">
				<HeaderCake isCompact={ false } alwaysShowActionText={ false } onClick={ this.goBack }>
					{ translate( 'Google My Business' ) }
				</HeaderCake>

				<CompactCard className="select-business-type__explanation">
					<div className="select-business-type__explanation-main">
						<h1 className="select-business-type__explanation-heading">
							{ translate( 'Which type of business are you?' ) }
						</h1>

						<p>
							{ translate(
								'{{link}}Google My Business{{/link}} lists your local business on Google Search and Google Maps. ' +
									'It works for businesses that have a physical location or serve a local area.',
								{
									components: {
										link: (
											<ExternalLink
												href="https://www.google.com/business/"
												target="_blank"
												rel="noopener noreferrer"
												icon={ true }
												onClick={ this.trackGoogleMyBusinessLinkClick }
											/>
										),
									},
								}
							) }
						</p>
					</div>

					<img
						className="select-business-type__explanation-image"
						src="/calypso/images/google-my-business/business-local.svg"
						alt="Local business illustration"
					/>
				</CompactCard>

				<ActionCard
					headerText={ translate( 'Physical Location or Service Area', {
						comment: 'In the context of a business activity, brick and mortar or online service',
					} ) }
					mainText={ translate(
						'Your business has a physical location customers can visit, ' +
							'or provides goods and services to local customers, or both.'
					) }
				>
					{ connectButton }
				</ActionCard>

				<ActionCard
					headerText={ translate( 'Online Only', {
						comment: 'In the context of a business activity, as opposed to a brick and mortar',
					} ) }
					mainText={ translate(
						"Don't provide in-person services? Learn more about reaching your customers online."
					) }
					buttonText={ translate( 'Optimize Your SEO', { comment: 'Call to Action button' } ) }
					buttonHref={ '/settings/traffic/' + siteId }
					buttonOnClick={ this.trackOptimizeYourSEOClick }
				/>
			</Main>
		);
	}
}

export default connect(
	state => ( {
		canUserManageOptions: canCurrentUser( state, getSelectedSiteId( state ), 'manage_options' ),
	} ),
	{ recordTracksEvent }
)( localize( SelectBusinessType ) );
