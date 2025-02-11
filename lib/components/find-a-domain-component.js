import { By, until } from 'selenium-webdriver';

import BaseContainer from '../base-container.js';

import * as driverHelper from '../driver-helper.js';

export default class FindADomainComponent extends BaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.register-domain-step' ) );
		this.declineGoogleAppsLinkSelector = By.className( 'google-apps-dialog__cancel-link' );
	}
	waitForResults() {
		const driver = this.driver;
		const resultsLoadingSelector = By.css( '.domain-suggestion__content div.domain-product-price.is-placeholder' );
		driver.wait( function() {
			return driver.isElementPresent( resultsLoadingSelector ).then( function( present ) {
				return ! present;
			} );
		}, this.explicitWaitMS * 2, 'The domain results loading element was still present when it should have disappeared by now.' );
		return this.checkForUnknownABTestKeys();
	}
	waitForGoogleApps() {
		return this.driver.wait( until.elementLocated( this.declineGoogleAppsLinkSelector ), this.explicitWaitMS, 'Could not locate the link to decline google apps.' );
	}
	searchForBlogNameAndWaitForResults( blogName ) {
		const searchInputSelector = By.className( 'search__input' );
		this.driver.findElement( searchInputSelector ).sendKeys( blogName );
		return this.waitForResults();
	}
	freeBlogAddress() {
		const freeBlogAddressSelector = By.css( '.domain-suggestion__content h3' );
		return this.driver.findElement( freeBlogAddressSelector ).getText().then( function( text ) {
			return text;
		} );
	}
	selectDotComAddress( dotComAddress ) {
		const reactDataAttr = dotComAddress.replace( '.', '=1' );
		const selector = By.css( `button[data-reactid*="${reactDataAttr}"]` );
		this.driver.wait( until.elementLocated( selector ), this.explicitWaitMS, 'Could not locate the select button for the paid address: ' + dotComAddress );
		const element = this.driver.findElement( selector );
		this.driver.wait( until.elementIsEnabled( element ), this.explicitWaitMS, 'The paid address button for ' + dotComAddress + ' does not appear to be enabled to click' );
		return driverHelper.clickWhenClickable( this.driver, selector, this.explicitWaitMS );
	}
	selectFreeAddress() {
		const freeAddressSelector = By.css( '.domain-suggestion__action button.is-primary' );
		return driverHelper.clickWhenClickable( this.driver, freeAddressSelector, this.explicitWaitMS );
	}
	selectMapOwnDomain() {
		const mapOwnSelector = By.css( 'div.domain-mapping-suggestion button' );
		return driverHelper.clickWhenClickable( this.driver, mapOwnSelector, this.explicitWaitMS );
	};
	waitForOwnDomainMapping() {
		const ownDomainInputSelector = By.css( 'input.map-domain-step__external-domain' );
		this.driver.wait( until.elementLocated( ownDomainInputSelector ), this.explicitWaitMS, 'Could not locate the own domain input selector' );
		const ownDomainInputElement = this.driver.findElement( ownDomainInputSelector );
		return this.driver.wait( until.elementIsVisible( ownDomainInputElement ), this.explicitWaitMS, 'Could not see the own domain input selector visible' );
	}
	declineGoogleApps() {
		return driverHelper.clickWhenClickable( this.driver, this.declineGoogleAppsLinkSelector, this.explicitWaitMS );
	}
	selectAddEmailForGoogleApps() {
		const googleAppsFieldsSelector = By.css( 'fieldset.google-apps-dialog__user-fields' );
		this.waitForGoogleApps();
		driverHelper.clickWhenClickable( this.driver, By.css( '.google-apps-dialog__continue-button' ), this.explicitWaitMS );
		this.driver.wait( until.elementLocated( googleAppsFieldsSelector ), this.explicitWaitMS, 'Could not locate the google apps information fieldset' );
		const googleAppsFieldsElement = this.driver.findElement( googleAppsFieldsSelector );
		return this.driver.wait( until.elementIsVisible( googleAppsFieldsElement ), this.explicitWaitMS, 'Could not see the google apps information fieldset displayed, check it is visible' );
	}
	selectPreviousStep() {
		return driverHelper.clickWhenClickable( this.driver, By.css( 'a.previous-step' ), this.explicitWaitMS );
	}
}
