const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base');
const axios = require('axios'); // For HTTP requests
const UpgradeScripts = require('./upgrades');
const UpdateActions = require('./actions');
const UpdateFeedbacks = require('./feedbacks');
const UpdateVariableDefinitions = require('./variables');

class ModuleInstance extends InstanceBase {
    constructor(internal) {
        super(internal);
        this.availableNDIs = []; // Initialize an empty array to store available NDI sources
        this.log('debug', 'Module instance created');
		this.initVariables();
    }

    async init(config) {
        this.config = config;
        this.updateStatus(InstanceStatus.Ok);
        this.log('info', 'Module initialized with config');
        this.updateActions(); // Export actions
        this.updateFeedbacks(); // Export feedbacks
        this.updateVariableDefinitions(); // Export variable definitions
    }

    async destroy() {
        this.log('debug', 'Module instance destroyed');
    }

    async configUpdated(config) {
        this.config = config;
        this.log('info', 'Config updated');
        this.updateActions(); // Ensure actions are updated with the new config
        this.updateVariableDefinitions(); // Ensure variable definitions are updated
		this.updateFeedbacks();
    }

    getConfigFields() {
        this.log('debug', 'Fetching config fields');
        // Note: Direct updates to config fields for dynamic UI changes might not be supported.
        return [
            {
                type: 'textinput',
                id: 'hostname',
                label: 'Decaffiene IP',
                width: 8,
                regex: Regex.URL,
            },
           
        ];
    }

	updateAvailableNDIs(ndiList) {
		this.log('info', `Updating available NDI sources with new list: ${ndiList.join(', ') || 'None'}`);
		this.availableNDIs = ndiList;
	
		const ndiAvailable = this.isNDIAvailable() ? 'True' : 'False';
		this.log('info', `Updating 'NDIavailable' variable to: ${ndiAvailable}`);
	
		// Use setVariableValues to update the 'NDIavailable' variable
		this.setVariableValues({ 'NDIavailable': ndiAvailable });
		this.log('debug', `'NDIavailable' variable updated successfully.`);
	
		// Log before checking feedbacks
		this.log('debug', 'About to trigger feedback reevaluation for ndiFeedAvailable.');
	
		try {
			this.checkFeedbacks('ndiFeedAvailable');
			// Log after successful feedback reevaluation
			this.log('info', 'Feedback reevaluation for ndiFeedAvailable completed successfully.');
		} catch (error) {
			// Log if there's an error during feedback reevaluation
			this.log('error', `Error during feedback reevaluation for ndiFeedAvailable: ${error.message}`);
		}
	
		this.updateActions(); // This ensures actions are updated based on the new NDI list
	}
	
	
	initVariables() {
        // Assuming variables.js has been properly required and initialized
    }

	isNDIAvailable() {
		// Define isAvailable at the beginning of the method
		const isAvailable = this.availableNDIs && this.availableNDIs.length > 0;
	
		this.log('debug', 'Checking NDI availability...');
		// Now log the result of the NDI availability check after isAvailable has been defined
		this.log('debug', `NDI availability check: ${isAvailable}`);
		
		if (isAvailable) {
			this.log('info', `NDI is available. Number of sources: ${this.availableNDIs.length}`);
		} else {
			this.log('info', 'NDI is not available.');
		}
	
		return isAvailable;
	}
	
	
	

    updateNDIVariables(ndiSources) {
        let variablesToUpdate = {};
        this.log('debug', 'Starting to update NDI source variables.');

        for (let i = 1; i <= ndiSources.length; i++) {
            variablesToUpdate[`ndi_source_${i}`] = ndiSources[i-1]; // Update variable with source name
            this.log('info', `Setting variable ndi_source_${i}: ${ndiSources[i-1]}`);
        }

        try {
            this.setVariableValues(variablesToUpdate);
            this.log('debug', 'NDI source variables updated successfully.');
        } catch (error) {
            this.log('error', `Failed to update NDI source variables: ${error}`);
        }
    }

	async updateActions() {
		try {
			this.log('info', 'Updating actions...');
			await UpdateActions(this);
			this.log('info', 'Actions updated successfully.');
		} catch (error) {
			this.log('error', `Failed to update actions: ${error.message}`);
		}
	}
	
	async updateFeedbacks() {
		try {
			this.log('info', 'Updating feedbacks...');
			await UpdateFeedbacks(this);
			this.log('info', 'Feedbacks updated successfully.');
		} catch (error) {
			this.log('error', `Failed to update feedbacks: ${error.message}`);
		}
	}
	
	async updateVariableDefinitions() {
		try {
			this.log('info', 'Updating variable definitions...');
			await UpdateVariableDefinitions(this); // Assuming UpdateVariableDefinitions is the correct function to call
			this.log('info', 'Variable definitions updated successfully.');
		} catch (error) {
			this.log('error', `Failed to update variable definitions: ${error.message}`);
		}
	}
	
	
}

runEntrypoint(ModuleInstance, UpgradeScripts);
