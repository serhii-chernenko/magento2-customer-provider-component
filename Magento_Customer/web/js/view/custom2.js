// this is a custom component that extends Magento_Customer/js/view/customer-data-abstract.
// and you already have all the necessary data
// without the duplicating a code to each custom component like this.

define(['Magento_Customer/js/view/customer-data-abstract'], (
    customerDataAbstract
) => {
    return customerDataAbstract.extend({
        defaults: {
            template: 'Magento_Customer/custom2'
        }
    });
});
