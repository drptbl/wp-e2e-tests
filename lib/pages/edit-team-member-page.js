import { By, until } from 'selenium-webdriver';
import BaseContainer from '../base-container.js';

import * as DriverHelper from '../driver-helper.js';

export default class EditTeamMemberPage extends BaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.edit-team-member-form' ) );
	}

	removeSelectedUser() {
		DriverHelper.clickWhenClickable( this.driver, By.css( '.edit-team-member-form__remove-user' ) );
		return DriverHelper.clickWhenClickable( this.driver, By.css( '.dialog button[data-reactid*=accept]' ) );
	}

	changeToNewRole( roleName ) {
		DriverHelper.clickWhenClickable( this.driver, By.css( `select#roles option[value=${roleName}]` ) );
		DriverHelper.clickWhenClickable( this.driver, By.css( 'button.form-button.is-primary' ) );
		return this.driver.wait( until.elementLocated( By.css( '.is-success' ) ), this.explicitWaitMS, 'Could not locate the success message' );
	}

	successNoticeDisplayed() {
		return this.driver.isElementPresent( By.css( '.is-success' ) );
	}
}
