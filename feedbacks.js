const { combineRgb } = require('@companion-module/base');

module.exports = function (self) {
    self.setFeedbackDefinitions({
        ndiFeedAvailable: {
            type: 'boolean',
            name: 'NDI Feed Availability',
            description: 'Changes color based on NDI feed availability',
            options: [],
            defaultStyle: {
                color: combineRgb(255, 255, 255), // Default text color: white
                bgcolor: combineRgb(255, 0, 0), // Default background: red
            },
            
            callback: (feedback) => {
                // Immediate determination of the NDI availability
                const ndiAvailable = !self.isNDIAvailable();

                self.log('debug', `Evaluating NDI feed availability for feedback. NDI Available: ${ndiAvailable}`);

                let color, bgcolor;
                if (ndiAvailable) {
                    // NDI is available: Apply green background with white text
                    color = combineRgb(255, 255, 255); // white text
                    bgcolor = combineRgb(0, 255, 0); // green background
                    self.log('info', `Applying available NDI styles: text=ffffff, bgcolor=00ff00`);
                } else {
                    // NDI is not available: Apply red background with white text
                    color = combineRgb(255, 255, 255); // white text
                    bgcolor = combineRgb(255, 0, 0); // red background
                    self.log('info', `Applying unavailable NDI styles: text=ffffff, bgcolor=ff0000`);
                }

                return {
                    color: color,
                    bgcolor: bgcolor
                };
            },
        },
    });
};
