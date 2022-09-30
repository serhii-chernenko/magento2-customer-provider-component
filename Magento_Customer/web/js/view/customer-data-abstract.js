// this component could be extended to not duplicate all the content from the defaults object
// to each component, such as: custom1, custom2, custom3, etc.

// use uiCollection or uiComponent (they are the same) if you expect children components
define(['uiCollection'], (uiCollection) => {
    return uiCollection.extend({
        defaults: {
            // current component depends on component customerProvider
            deps: ['customerProvider'],

            // just create a variable with a component name which created as data provider
            // for other components
            provider: 'customerProvider',

            // you can import data from other components, in our case it's the customerProvider
            imports: {
                isLoading: '${ $.provider }:isLoading',
                isGuest: '${ $.provider }:isGuest',
                isLoggedIn: '${ $.provider }:isLoggedIn',
                firstName: '${ $.provider }:firstName'
            },

            // you should track observables if you expect updates
            // in knockout html template for components
            tracks: {
                isLoading: true,
                isGuest: true,
                isLoggedIn: true,
                firstName: true
            }
        }
    });
});
