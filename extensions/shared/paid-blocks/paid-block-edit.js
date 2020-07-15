
/**
 * WordPress dependencies
 */
import { Fragment, useEffect, useState } from '@wordpress/element';
import { createHigherOrderComponent, compose } from '@wordpress/compose';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, Button } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getUpgradeUrl } from './utils';

const JetpackPaidBlockEdit = OriginalBlockEdit => props => {
	const {
		plan,
		postId,
		postType,
		planSlug,
		isSavingPost,
		savePost,
		isEditedPostAutosaveable,
	} = props;

	const [ shouldRedirectToCheckoutPage, setShouldRedirect ] = useState( false );

	const checkoutUrl = getUpgradeUrl( { plan, planSlug, postId, postType } );

	useEffect( () => {
		if ( isSavingPost ) {
			return;
		}

	    if ( ! shouldRedirectToCheckoutPage ) {
		    return;
	    }

	    window.location.href = checkoutUrl;
	}, [ isSavingPost, shouldRedirectToCheckoutPage, checkoutUrl ] );

	const goToCheckoutPage = () => {
		if ( ! window?.location?.href ) {
			return;
		}

		// If the post is not autosaveable, redirect.
		if ( ! isEditedPostAutosaveable ) {
			return window.location.href = checkoutUrl;
		}

		// Save the post before to perform redirection.
		savePost();

		// Hack to ensuring getting the saving post status.
		setTimeout( () => setShouldRedirect( true ), 0 );
	};

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup>
					<Button
						aria-label={ __( 'Upgrade to Premium to use this block', 'jetpack' ) }
						onClick={ goToCheckoutPage }
						label={ __(
							'Upgrade to Premium to use this block.',
							'jetpack'
						) }
						showTooltip={ true }
					>
						{ __( 'Upgrade', 'jetpack' ) }
					</Button>
				</ToolbarGroup>
			</BlockControls>

			<OriginalBlockEdit { ...props } />
		</Fragment>
	);
};

export default createHigherOrderComponent(
	compose( [
		withSelect( select => {
			const editorSelector = select( 'core/editor' );
			const post = editorSelector.getCurrentPost();
			const planSlug = 'value_bundle';

			return {
				plan: select( 'wordpress-com/plans' ).getPlan( planSlug ),
				planSlug,
				postId: post.id,
				postType: post.type,
				postStatus: post.status,
				isSavingPost: editorSelector.isSavingPost(),
				isEditedPostAutosaveable: editorSelector.isEditedPostAutosaveable(),
			};
		} ),
		withDispatch( dispatch => {
			return {
				savePost: dispatch( 'core/editor' ).savePost,
			};
		} ),
		JetpackPaidBlockEdit,
	] ),
	'JetpackPaidBlockEdit'
);