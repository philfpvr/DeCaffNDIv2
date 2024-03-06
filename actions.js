const axios = require('axios');
const grandiose = require('grandiose-mac'); // Ensure grandiose-mac is referenced for NDI discovery

module.exports = function (self) {
    const updateNDIChoices = () => {
        if (self.availableNDIs.length === 0) {
            // Return a placeholder choice indicating no NDI sources available
            return [{ id: 'no_sources', label: 'No NDI sources available' }];
        } else {
            return self.availableNDIs.map(ndiName => ({ id: ndiName, label: ndiName }));
        }
    };
    
    
    

    self.setActionDefinitions({
        scan_ndi: {
            name: 'Scan NDI',
            callback: async () => {
                try {
                    self.log('info', 'Scanning for NDI sources...');
                    const ndiSources = await grandiose.find({ showLocalSources: true });
                    const ndiNames = ndiSources.map(source => source.name);
                    self.log('info', `Found NDI sources during scan: ${ndiNames.join(', ')}`);
                    self.updateAvailableNDIs(ndiNames);
                } catch (error) {
                    // Handle the case where no NDI streams are found within the wait time
                    self.log('error', `Error scanning for NDI sources: ${error.message}`);
                    // Update available NDI sources to an empty array to reflect no sources found
                    self.updateAvailableNDIs([]);
                }
            }
        },
        
        
        
        
        update_url_and_send: {
            name: 'Update URL and Send',
            options: [
                {
                    type: 'dropdown',
                    label: 'Select NDI Source',
                    id: 'selectedNDI',
                    choices: updateNDIChoices() // Dynamically update choices based on available NDI sources
                }
            ],
            callback: async (action) => {
                try {
                    const ndiName = action.options.selectedNDI;
                    const url = `http://${self.config.hostname}/api/simple/${self.config.playerStreamName}${encodeURIComponent(ndiName)}`;
                    self.log('info', `Sending HTTP GET to ${url}`);
                    await axios.get(url);
                    self.log('info', `HTTP GET request to ${url} was successful`);
                } catch (error) {
                    self.log('error', `Error sending HTTP GET request: ${error}`);
                }
            }
        },
        // Additional actions can be defined here, following the same pattern

        start_stream: {
            name: 'Start Stream',
            callback: async () => {
                try {
                    const url = `http://${self.config.hostname}/api/simple/player_start`;
                    self.log('info', `Starting stream with HTTP GET to ${url}`);
                    await axios.get(url);
                    self.log('info', 'Stream started successfully');
                } catch (error) {
                    self.log('error', `Error starting stream: ${error}`);
                }
            }
        },
        stop_stream: {
            name: 'Stop Stream',
            callback: async () => {
                try {
                    const url = `http://${self.config.hostname}/api/simple/player_stop`;
                    self.log('info', `Stopping stream with HTTP GET to ${url}`);
                    await axios.get(url);
                    self.log('info', 'Stream stopped successfully');
                } catch (error) {
                    self.log('error', `Error stopping stream: ${error}`);
                }
            }
        },
        // Define other actions as necessary, with logging
    });
    // Whenever the availableNDIs are updated, refresh the action definitions to reflect the new choices
    // This might require invoking this method or similar whenever availableNDIs change
};
