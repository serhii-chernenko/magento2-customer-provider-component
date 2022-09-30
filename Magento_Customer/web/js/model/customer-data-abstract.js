// this component makes the subscription and reloading customer data only one time in place here
// you don't need to do that in each custom components, such as: custom1, custom2, custom3, etc.

// use uiElement if you don't expect children components
define(['uiElement', 'Magento_Customer/js/customer-data'], (
    uiElement,
    customerData
) => {
    return uiElement.extend({
        defaults: {
            // create local variables to use them for different states of components
            isLoading: true,
            isGuest: false,
            isLoggedIn: false,
            firstName: '',

            // you should track observables if you expect
            // that they will be imported in other components via: imports, links, listens
            tracks: {
                isLoading: true,
                isGuest: true,
                isLoggedIn: true,
                firstName: true
            }
        },

        initialize() {
            this._super();

            customerData
                .get('customer')
                .subscribe(this.onCustomerSectionUpdate.bind(this));
            customerData.reload(['customer']);

            return this;
        },

        onCustomerSectionUpdate(customer) {
            this.isLoading = false;

            if (!customer.firstname) {
                this.isGuest = true;

                return this;
            }

            this.isLoggedIn = true;
            this.firstName = customer.firstname;
        }
    });
});
