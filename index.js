'use strict';

const urlApi = "https://api.nps.gov/api/v1/parks";

function displayResults(responseJson) {
    console.log(responseJson)
    $('#results-list').empty();
    $('.error-message').empty();
    for (let i = 0; i < responseJson.limit && i < responseJson.total; i++) {
        $('#results-list').append(
            `
            <li>
                <p><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].fullName}</a></p>
                <span>Website: ${responseJson.data[i].url}</span>
                <p>Park address: ${JSON.stringify(responseJson.data[i].addresses[1])}</p>
                <span><strong>Description:</strong> ${responseJson.data[1].description}</span>
            </li>
            `
    )}
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
}

function getStateParks(searchedStates, maxResults = 10) {
    const params = {
        api_key: "1qnP25UZu97VqOeb0KIzMWxGUaWgVMsbgM8WFYMY",
        stateCode: searchedStates,
        limit: maxResults,
        fields: "addresses"
    }

    const queryString = formatQueryParams(params);

    const url = `${urlApi}?${queryString}`;

    const options = {
        headers: new Headers({
            "accept": "application/json"
        })
    };

    fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
        $('#results-list').empty();
        console.log(error);
        $('#js-error-message').text(`Something went wrong: ${error.message}`);
    })
}

$(function searchFetch() {
    $('form').submit( event => {
        event.preventDefault();

        const firstState = $('#united-states-1').val();
        const secondState = $('#united-states-2').val();
        const thirdState = $('#united-states-3').val();

        const states = [firstState, secondState, thirdState];

        console.log(states);

        const maxResults = $('#js-max-results').val();

        getStateParks(states, maxResults);
    })
})
