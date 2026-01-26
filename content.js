console.log("Hello Intervals.Icu");

const EXPORT_BUTTON_ID = 'activity-to-clipboard-button';

// Get the activity data (JSON) from API
async function getActivityData() {
    // 1. Get the activity ID from the current page URL (e.g., /activities/12345)
    const activityId = window.location.pathname.split('/').pop();

    // 2. Construct the dynamic API URL
    const apiUrl = `https://intervals.icu/api/activity/${activityId}`;
    console.log(`Fetching data from: ${apiUrl}`);

    // 3. Perform the API call
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            // Throw an error with the response status to be caught by the caller
            throw new Error(`API request failed with status ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error during API call:', error);
        // Re-throw the error to be handled by the click listener's catch block
        throw error;
    }
}

// Add an export button to the activity page
// to copy the activity data to clipboard
// with JSON format.
function addExportButton() {
    if (document.getElementById(EXPORT_BUTTON_ID)) {
        return; // Button already exists
    }

    // Use a more reliable selector for the actions container at the top of the activity page.
    const actionsContainer = getButtonContainer();

    if (actionsContainer) {
        // Create a wrapper to better integrate with the site's button layout.
        const buttonGroup = document.createElement('div');
        buttonGroup.style = 'float: right; padding-right: 12px;';

        const exportButton = document.createElement('a');
        exportButton.id = EXPORT_BUTTON_ID;
        exportButton.className = 'btn btn-default';
        exportButton.innerHTML = 'JSON to clipboard';
        exportButton.href = '#';

        exportButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const activityJSON = await getActivityData();
            console.log("Activity JSON:", activityJSON);

            if (activityJSON) {
                navigator.clipboard.writeText(JSON.stringify(activityJSON)).then(() => {
                    console.log('Activity JSON copied to clipboard!');
                    const originalText = exportButton.innerHTML;
                    exportButton.innerHTML = 'Copied!';
                    setTimeout(() => {
                        exportButton.innerHTML = originalText;
                    }, 2000); // Revert after 2 seconds
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            } else {
                console.error('Could not extract summary to copy.');
            }
        });

        buttonGroup.appendChild(exportButton);
        actionsContainer.appendChild(buttonGroup);
        console.log('Export button added to activity header.');
    }
}

// Retrieve the div container where the button should be placed
function getButtonContainer() {
    // Get the higher level container
    const header = document.querySelector('.gutter8');

    if (header) {
        // Retrieve the last child inside the header element
        const rightSection = header.lastElementChild;

        if (rightSection) {
            const lastSection = rightSection.lastElementChild;
            return lastSection;
        }
    }

    return null; // Return null if the container is not found
}

// The content of activity pages is loaded dynamically.
// We need to wait for the right elements to appear.
// A MutationObserver is a robust way to do this.
const observer = new MutationObserver((mutationsList, observer) => {
    // Look for the new actions container to be added to the page.
    if (getButtonContainer()) {
        addExportButton();
    }
});

// Start observing the body for child list and subtree changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Also run it once on script load, in case the content is already there
addExportButton();
